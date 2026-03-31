import {
  GeoPoint,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app, auth } from "../config/firebaseConfig";
import { CourtDetails } from "../types/CourtSearchTypes";
import {
  Competitiveness,
  CourtDocument,
  CourtServerGame,
  CourtType,
  GameFormat,
  GameVisibility,
  LightingLevel,
  NetType,
  PlayerTeam,
  RimQuality,
  SurfaceType,
} from "../types/CourtServerTypes";

const db = getFirestore(app);

const hasSignificantChanges = (
  dbData: CourtDocument,
  googleData: CourtDetails,
): boolean => {
  if (dbData.rating_google !== (googleData.rating || 0)) return true;

  const googlePhotos = googleData.photos || [];
  if (dbData.photos.length === 0 && googlePhotos.length > 0) return true;

  if (dbData.is_open_now !== (googleData.isOpenNow ?? false)) return true;

  const diff = Math.abs(
    (dbData.total_ratings_google || 0) - (googleData.totalRatings || 0),
  );
  if (diff > 5) return true;

  return false;
};

export const getCourtServerData = async (
  googleCourtDetails: CourtDetails,
): Promise<CourtDocument> => {
  const courtRef = doc(db, "courts", googleCourtDetails.id);

  try {
    const courtSnap = await getDoc(courtRef);

    // Court Exists
    if (courtSnap.exists()) {
      const dbData = courtSnap.data() as CourtDocument;

      const freshGoogleData = {
        name: googleCourtDetails.name,
        rating_google: googleCourtDetails.rating || 0,
        total_ratings_google: googleCourtDetails.totalRatings || 0,
        is_open_now: googleCourtDetails.isOpenNow ?? dbData.is_open_now,
        photos:
          googleCourtDetails.photos && googleCourtDetails.photos.length > 0
            ? googleCourtDetails.photos
            : dbData.photos,
      };

      if (hasSignificantChanges(dbData, googleCourtDetails)) {
        console.log(
          `[CourtService] Significant change detected for ${googleCourtDetails.name}. Updating DB...`,
        );

        updateDoc(courtRef, {
          ...freshGoogleData,
        }).catch((err) =>
          console.error("[CourtService] Background update failed:", err),
        );
      } else {
        console.log(
          `[CourtService] Data is fresh enough for ${googleCourtDetails.name}. Skipping write.`,
        );
      }

      return {
        ...dbData,
        ...freshGoogleData,
      };
    }

    console.log(
      `[CourtService] New court discovered: ${googleCourtDetails.name}. Creating...`,
    );

    const newCourt: CourtDocument = {
      id: googleCourtDetails.id,

      // Google Data
      name: googleCourtDetails.name,
      address: googleCourtDetails.address || "Unknown Address",
      location: new GeoPoint(googleCourtDetails.lat, googleCourtDetails.lng),
      photos: googleCourtDetails.photos || [],
      rating_google: googleCourtDetails.rating || 0,
      total_ratings_google: googleCourtDetails.totalRatings || 0,
      is_open_now: googleCourtDetails.isOpenNow || false,
      opening_hours: googleCourtDetails.hours || [],

      // Hoopify Defaults
      court_type: "outdoor" as CourtType, // Safe default
      surface: "unknown" as SurfaceType,
      rim_quality: "unknown" as RimQuality,
      net_type: "unknown" as NetType,
      lighting: "none" as LightingLevel,
      court_count: 0,

      // Live Status Defaults
      active_player_count: 0,
      last_activity_at: Timestamp.now(),
    };

    await setDoc(courtRef, newCourt);

    return newCourt;
  } catch (error) {
    console.error("[CourtService] Error in getCourtServerData:", error);
    throw error;
  }
};

/**
 * Fetches upcoming and live games for a specific court server.
 * * @param courtId - The ID of the gym/park (e.g., "florida-gymnasium")
 * @param visibility - "public" or "private"
 * @returns A promise resolving to an array of CourtServerGame objects
 */
export const fetchCourtGames = async (
  courtId: string,
  visibility: GameVisibility,
): Promise<CourtServerGame[]> => {
  try {
    const gamesRef = collection(db, "games");

    const gamesQuery = query(
      gamesRef,
      where("courtServerId", "==", courtId),
      where("visibility", "==", visibility),
      where("status", "in", ["upcoming", "live"]),
      orderBy("meetupTime", "asc"),
    );

    const querySnapshot = await getDocs(gamesQuery);
    const games: CourtServerGame[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
      } as CourtServerGame;
    });

    return games;
  } catch (error) {
    console.error("Error fetching court games:", error);
    throw new Error("Failed to load games. Please try again.");
  }
};

/**
 * Subscribes to real-time updates for a single game document.
 * Returns an unsubscribe function for cleanup.
 */
export const subscribeToGame = (
  gameId: string,
  onUpdate: (game: CourtServerGame) => void,
  onError?: (error: Error) => void,
) => {
  const gameRef = doc(db, "games", gameId);

  return onSnapshot(
    gameRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({ id: snapshot.id, ...snapshot.data() } as CourtServerGame);
      }
    },
    (error) => {
      console.error("Error listening to game:", error);
      onError?.(error);
    },
  );
};

/**
 * Updates the current user's player status in a game.
 */
export const changePlayerStatus = async (
  gameId: string,
  newStatus: "confirmed" | "pending" | "declined",
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User must be logged in to change status.");

  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  const currentStatus = gameSnap.data()?.players?.[currentUser.uid]?.status;

  const updates: Record<string, unknown> = {
    [`players.${currentUser.uid}.status`]: newStatus,
  };

  if (currentStatus !== newStatus) {
    updates[`players.${currentUser.uid}.lastStatusSwitchedTime`] =
      serverTimestamp();
  }

  await updateDoc(gameRef, updates);
};

/**
 * Updates the current user's team assignment in a game.
 */
export const changePlayerTeamStatus = async (
  gameId: string,
  newTeam: "home" | "away",
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User must be logged in to change team.");

  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    [`players.${currentUser.uid}.team`]: newTeam,
  });
};

/**
 * Adds the current user to a game.
 * Assigns to whichever team (home/away) has fewer players.
 * If both teams are full based on the game format, assigns as "unassigned" (in-queue).
 */
export const addPlayerToGame = async (
  game: CourtServerGame,
): Promise<PlayerTeam> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User must be logged in to join a game.");

  const players = game.players ?? {};
  const maxPerTeam = parseInt(game.format.split("v")[0], 10);

  let homeCount = 0;
  let awayCount = 0;
  for (const p of Object.values(players)) {
    if (p.team === "home") homeCount++;
    else if (p.team === "away") awayCount++;
  }

  let assignedTeam: PlayerTeam;
  if (homeCount < maxPerTeam) {
    assignedTeam = "home";
  } else if (awayCount < maxPerTeam) {
    assignedTeam = "away";
  } else {
    assignedTeam = "unassigned";
  }

  const userSnap = await getDoc(doc(db, "users", currentUser.uid));
  const displayName = userSnap.exists()
    ? userSnap.data().displayName || "Anonymous"
    : "Anonymous";

  const gameRef = doc(db, "games", game.id);

  await updateDoc(gameRef, {
    [`players.${currentUser.uid}`]: {
      displayName,
      team: assignedTeam,
      lastStatusSwitchedTime: serverTimestamp(),
      status: "confirmed",
    },
  });

  return assignedTeam;
};

interface CreateGameParams {
  courtServerId: string;
  courtDescriptor?: string;
  meetupTime: Date;
  endingTime?: Date;
  format: GameFormat; // e.g., "3v3"
  visibility: GameVisibility;
  competitiveness: Competitiveness; // e.g., "casual"
  description: string;
  inivtedUserIds?: string[]; // Optional list of user IDs to invite
}

export const createCourtGame = async (
  params: CreateGameParams,
): Promise<string> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser)
      throw new Error("User must be logged in to create a game.");

    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    const displayName = userSnap.exists()
      ? userSnap.data().displayName || "Anonymous"
      : "Anonymous";

    const gamesRef = collection(db, "games");

    const newGame = {
      courtServerId: params.courtServerId,
      creatorId: currentUser.uid,
      createdAt: serverTimestamp(),
      meetupTime: Timestamp.fromDate(params.meetupTime),
      ...(params.endingTime && {
        endingTime: Timestamp.fromDate(params.endingTime), // optional
      }),
      ...(params.courtDescriptor && {
        courtDescriptor: params.courtDescriptor,
      }),
      format: params.format,
      visibility: params.visibility,
      competitiveness: params.competitiveness,
      status: "upcoming",
      description: params.description,
      invitedUserIds: params.inivtedUserIds || [],
      players: {
        [currentUser.uid]: {
          userId: currentUser.uid,
          displayName,
          team: "home",
          lastStatusSwitchedTime: serverTimestamp(),
          status: "confirmed",
        },
      },
    };

    const docRef = await addDoc(gamesRef, newGame);
    return docRef.id;
  } catch (error) {
    console.error("Error creating game:", error);
    throw new Error("Failed to post game.");
  }
};
