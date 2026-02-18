import {
  GeoPoint,
  Timestamp,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../config/firebaseConfig";
import { CourtDetails } from "../types/CourtSearchTypes";
import {
  CourtDocument,
  CourtType,
  LightingLevel,
  NetType,
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

/**
 * MAIN HANDLER: Get Court Data (Get or Create Pattern)
 */
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
