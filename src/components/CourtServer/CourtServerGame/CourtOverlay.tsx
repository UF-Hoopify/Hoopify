import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../../../config/firebaseConfig";
import { changePlayerTeamStatus } from "../../../services/CourtService";
import {
  CourtServerGame,
  GamePlayer,
  PlayerTeam,
} from "../../../types/CourtServerTypes";
import { formatTime } from "./courtGameDetailsHelpers";

interface CourtOverlayProps {
  game: CourtServerGame;
}

const COURT_LINE = "#E68A2E";
const COURT_LINE_W = 1;
const AVATAR_SIZE = 36;

interface Position {
  left: number;
  top: number;
}

const POSITION_LAYOUTS: Record<string, { home: Position[]; away: Position[] }> =
  {
    "1v1": {
      home: [{ left: 25, top: 50 }],
      away: [{ left: 75, top: 50 }],
    },
    "2v2": {
      home: [
        { left: 20, top: 30 },
        { left: 20, top: 70 },
      ],
      away: [
        { left: 80, top: 30 },
        { left: 80, top: 70 },
      ],
    },
    "3v3": {
      home: [
        { left: 15, top: 22 },
        { left: 30, top: 50 },
        { left: 15, top: 78 },
      ],
      away: [
        { left: 85, top: 22 },
        { left: 70, top: 50 },
        { left: 85, top: 78 },
      ],
    },
    "4v4": {
      home: [
        { left: 12, top: 22 },
        { left: 28, top: 38 },
        { left: 28, top: 62 },
        { left: 12, top: 78 },
      ],
      away: [
        { left: 88, top: 22 },
        { left: 72, top: 38 },
        { left: 72, top: 62 },
        { left: 88, top: 78 },
      ],
    },
    "5v5": {
      home: [
        { left: 10, top: 18 },
        { left: 25, top: 32 },
        { left: 18, top: 50 },
        { left: 25, top: 68 },
        { left: 10, top: 82 },
      ],
      away: [
        { left: 90, top: 18 },
        { left: 75, top: 32 },
        { left: 82, top: 50 },
        { left: 75, top: 68 },
        { left: 90, top: 82 },
      ],
    },
  };

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const CourtOverlay = ({ game }: CourtOverlayProps) => {
  const currentUserId = auth.currentUser?.uid;
  const maxPerTeam = parseInt(game.format.split("v")[0], 10);
  const maxInGame = maxPerTeam * 2;
  const layout = POSITION_LAYOUTS[game.format] ?? POSITION_LAYOUTS["5v5"];

  // Compute "In Game" players: oldest confirmed up to format limit
  const inGamePlayers = useMemo(() => {
    const entries = Object.entries(game.players ?? {});
    return entries
      .filter(([, p]) => p.status === "confirmed")
      .sort((a, b) => {
        const timeA = a[1].lastStatusSwitchedTime?.toMillis?.() ?? 0;
        const timeB = b[1].lastStatusSwitchedTime?.toMillis?.() ?? 0;
        return timeA - timeB;
      })
      .slice(0, maxInGame);
  }, [game.players, maxInGame]);

  // Split into home/away
  const homePlayers = inGamePlayers.filter(([, p]) => p.team === "home");
  const awayPlayers = inGamePlayers.filter(([, p]) => p.team === "away");

  // Build slot arrays padded with nulls for empty spots
  const homeSlots: ([string, GamePlayer] | null)[] = layout.home.map(
    (_, i) => homePlayers[i] ?? null,
  );
  const awaySlots: ([string, GamePlayer] | null)[] = layout.away.map(
    (_, i) => awayPlayers[i] ?? null,
  );

  // Is the current user in the "In Game" partition?
  const currentUserInGame = inGamePlayers.some(([id]) => id === currentUserId);

  const handleSlotPress = async (targetTeam: "home" | "away") => {
    if (!currentUserId || !currentUserInGame) return;
    const currentTeam = game.players?.[currentUserId]?.team;
    if (currentTeam === targetTeam) return;

    try {
      await changePlayerTeamStatus(game.id, targetTeam);
    } catch (error) {
      console.error("Failed to swap position:", error);
    }
  };

  const renderSlot = (
    entry: [string, GamePlayer] | null,
    position: Position,
    team: PlayerTeam,
    index: number,
  ) => {
    const isEmpty = !entry;
    const borderColor =
      isEmpty ? "#444" : team === "home" ? "#E68A2E" : "#6BA3D6";

    const avatar = (
      <View
        style={[
          styles.avatar,
          {
            left: `${position.left}%`,
            top: `${position.top}%`,
            borderColor,
            transform: [
              { translateX: -AVATAR_SIZE / 2 },
              { translateY: -AVATAR_SIZE / 2 },
            ],
          },
        ]}
      >
        <Text style={[styles.avatarText, isEmpty && styles.avatarTextEmpty]}>
          {isEmpty ? "?" : getInitials(entry[1].displayName ?? "?")}
        </Text>
      </View>
    );

    if (isEmpty && currentUserInGame) {
      return (
        <TouchableOpacity
          key={`${team}-${index}`}
          activeOpacity={0.6}
          onPress={() => handleSlotPress(team as "home" | "away")}
          style={[
            styles.avatar,
            styles.avatarTouchable,
            {
              left: `${position.left}%`,
              top: `${position.top}%`,
              borderColor,
              transform: [
                { translateX: -AVATAR_SIZE / 2 },
                { translateY: -AVATAR_SIZE / 2 },
              ],
            },
          ]}
        >
          <Text style={[styles.avatarText, styles.avatarTextEmpty]}>?</Text>
        </TouchableOpacity>
      );
    }

    return <React.Fragment key={`${team}-${index}`}>{avatar}</React.Fragment>;
  };

  return (
    <View style={styles.courtOverlayContainer}>
      <View style={styles.courtOverlayInner}>
        <View style={styles.courtMock}>
          <View style={styles.courtCenterLine} />
          <View style={styles.courtCenterCircle} />
          <View style={[styles.courtThreePoint, styles.courtThreePointLeft]} />
          <View
            style={[styles.courtThreePoint, styles.courtThreePointRight]}
          />
          <View style={[styles.courtPaint, styles.courtPaintLeft]} />
          <View style={[styles.courtPaint, styles.courtPaintRight]} />

          {/* Home slots */}
          {homeSlots.map((entry, i) =>
            renderSlot(entry, layout.home[i], "home", i),
          )}

          {/* Away slots */}
          {awaySlots.map((entry, i) =>
            renderSlot(entry, layout.away[i], "away", i),
          )}
        </View>

        {/* Info banner at top */}
        <View style={styles.courtInfoBanner}>
          <Text style={styles.courtInfoLabel}>TIME & VENUE</Text>
          <View style={styles.courtInfoRow}>
            <View style={styles.clockDot} />
            <Text style={styles.courtInfoTime}>
              {formatTime(game.meetupTime)}
            </Text>
          </View>
        </View>

        {/* Footer pills */}
        <View style={styles.courtFooter}>
          <View style={styles.courtPillRow}>
            <View style={styles.courtPill}>
              <Text style={styles.courtPillText}>
                {game.competitiveness === "casual" ? "Casual" : "Comp"}
              </Text>
            </View>
            <View style={styles.courtPill}>
              <Text style={styles.courtPillText}>
                {game.visibility === "public" ? "open" : "private"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courtOverlayContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  courtOverlayInner: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  courtMock: {
    height: 180,
    marginHorizontal: 12,
    marginTop: 50,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#161616",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    position: "relative",
  },
  courtCenterLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: COURT_LINE_W,
    backgroundColor: COURT_LINE,
    marginLeft: -COURT_LINE_W / 2,
  },
  courtCenterCircle: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    backgroundColor: "#161616",
    marginTop: -22,
    marginLeft: -22,
  },
  courtThreePoint: {
    position: "absolute",
    top: "6%",
    bottom: "6%",
    width: "36%",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  courtThreePointLeft: {
    left: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 1000,
    borderBottomRightRadius: 1000,
  },
  courtThreePointRight: {
    right: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000,
  },
  courtPaint: {
    position: "absolute",
    top: "32%",
    bottom: "32%",
    width: "19%",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  courtPaintLeft: { left: 0, borderLeftWidth: 0 },
  courtPaintRight: { right: 0, borderRightWidth: 0 },
  courtInfoBanner: {
    position: "absolute",
    top: 14,
    left: 16,
  },
  courtInfoLabel: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  courtInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E68A2E",
    marginRight: 8,
  },
  courtInfoTime: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  courtFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  courtPillRow: { flexDirection: "row", gap: 8 },
  courtPill: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  courtPillText: { color: "#AAA", fontSize: 12, fontWeight: "600" },
  avatar: {
    position: "absolute",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  avatarTouchable: {
    zIndex: 20,
  },
  avatarText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  avatarTextEmpty: { color: "#555", fontSize: 16 },
});

export default CourtOverlay;
