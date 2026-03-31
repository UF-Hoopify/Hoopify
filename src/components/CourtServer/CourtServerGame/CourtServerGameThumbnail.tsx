import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  CourtServerGame,
  GamePlayer,
  PlayerTeam,
} from "../../../types/CourtServerTypes";

interface Props {
  game: CourtServerGame;
  onPress?: (game: CourtServerGame) => void;
}

const AVATAR_SIZE = 36;

interface Position {
  left: number;
  top: number;
}

/** Max players per team for each format */
const getMaxPerTeam = (format: string): number => {
  const match = format.match(/(\d+)v(\d+)/);
  if (match) return parseInt(match[1], 10);
  return 5;
};

/**
 * Percentage-based positions for each team per format.
 * Home = left half, Away = right half (mirrored).
 */
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

const formatTime = (timestamp: { toDate?: () => Date }): string => {
  try {
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp as unknown as number);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
};

const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max) + "…" : str;

/** Single player avatar circle */
const PlayerAvatar = ({
  player,
  position,
  team,
  isEmpty,
}: {
  player?: GamePlayer;
  position: Position;
  team: PlayerTeam;
  isEmpty: boolean;
}) => {
  const borderColor = team === "home" ? "#E68A2E" : "#6BA3D6";

  return (
    <View
      style={[
        styles.avatar,
        {
          left: `${position.left}%`,
          top: `${position.top}%`,
          borderColor: isEmpty ? "#444" : borderColor,
          transform: [
            { translateX: -AVATAR_SIZE / 2 },
            { translateY: -AVATAR_SIZE / 2 },
          ],
        },
      ]}
    >
      <Text style={[styles.avatarText, isEmpty && styles.avatarTextEmpty]}>
        {isEmpty ? "?" : getInitials(player?.displayName ?? "?")}
      </Text>
    </View>
  );
};

/** Basketball court lines drawn strictly referencing the minimal Figma design */
const BasketballCourt = () => (
  <View style={styles.court}>
    {/* Center elements */}
    <View style={styles.centerLine} />
    <View style={styles.centerCircle} />

    {/* --- LEFT SIDE --- */}
    <View style={[styles.threePoint, styles.threePointLeft]} />
    <View style={[styles.paint, styles.paintLeft]} />

    {/* Left Free Throw: Full dashed circle base */}
    <View style={[styles.ftCircleDashed, styles.ftLeft]} />
    {/* Left Free Throw: Solid clipping container revealing right half */}
    <View style={[styles.ftSolidContainer, styles.ftSolidContainerLeft]}>
      <View style={[styles.ftCircleSolid, styles.ftCircleSolidLeft]} />
    </View>

    {/* --- RIGHT SIDE --- */}
    <View style={[styles.threePoint, styles.threePointRight]} />
    <View style={[styles.paint, styles.paintRight]} />

    {/* Right Free Throw: Full dashed circle base */}
    <View style={[styles.ftCircleDashed, styles.ftRight]} />
    {/* Right Free Throw: Solid clipping container revealing left half */}
    <View style={[styles.ftSolidContainer, styles.ftSolidContainerRight]}>
      <View style={[styles.ftCircleSolid, styles.ftCircleSolidRight]} />
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const CourtServerGameThumbnail = ({ game, onPress }: Props) => {
  const maxPerTeam = getMaxPerTeam(game.format);
  const layout = POSITION_LAYOUTS[game.format] ?? POSITION_LAYOUTS["5v5"];

  // Split players by team
  const allPlayers = Object.values(game.players ?? {});
  const homePlayers = allPlayers.filter((p) => p.team === "home");
  const awayPlayers = allPlayers.filter((p) => p.team === "away");

  // Build slot arrays — fill with real players, pad with null for empty spots
  const homeSlots: (GamePlayer | null)[] = layout.home.map(
    (_, i) => homePlayers[i] ?? null,
  );
  const awaySlots: (GamePlayer | null)[] = layout.away.map(
    (_, i) => awayPlayers[i] ?? null,
  );

  // Extra players beyond what the layout can show
  const homeExtra = Math.max(0, homePlayers.length - maxPerTeam);
  const awayExtra = Math.max(0, awayPlayers.length - maxPerTeam);

  const isLive = game.status === "in_progress" || game.status === "open";

  return (
    <View style={styles.card}>
      {/* ---- Header ---- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.venueLabel}>TIME & VENUE</Text>
          <View style={styles.headerRow}>
            <View style={styles.clockDot} />
            <Text style={styles.timeText}>
              {formatTime(game.meetupTime)}
              {game.courtDescriptor
                ? `  ·  ${truncate(game.courtDescriptor, 18)}`
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => onPress?.(game)}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ---- Court with player overlays ---- */}
      <View style={styles.courtContainer}>
        <BasketballCourt />

        {/* Home players */}
        {homeSlots.map((player, i) => (
          <PlayerAvatar
            key={`home-${i}`}
            player={player ?? undefined}
            position={layout.home[i]}
            team="home"
            isEmpty={!player}
          />
        ))}

        {/* Away players */}
        {awaySlots.map((player, i) => (
          <PlayerAvatar
            key={`away-${i}`}
            player={player ?? undefined}
            position={layout.away[i]}
            team="away"
            isEmpty={!player}
          />
        ))}

        {/* +N overflow indicators */}
        {homeExtra > 0 && (
          <View style={[styles.extraBadge, { left: "5%", bottom: "5%" }]}>
            <Text style={styles.extraText}>+{homeExtra}</Text>
          </View>
        )}
        {awayExtra > 0 && (
          <View style={[styles.extraBadge, { right: "5%", bottom: "5%" }]}>
            <Text style={styles.extraText}>+{awayExtra}</Text>
          </View>
        )}
      </View>

      {/* ---- Footer ---- */}
      <View style={styles.footer}>
        <View style={styles.pillRow}>
          <View style={styles.footerPill}>
            <Text style={styles.footerPillText}>
              {game.competitiveness === "casual" ? "Casual" : "Comp"}
            </Text>
          </View>
          <View style={styles.footerPill}>
            <Text style={styles.footerPillText}>{game.format}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const COURT_LINE = "#E68A2E";
const COURT_LINE_W = 1;
const FT_RADIUS = 22; // Master variable for easy sizing

const styles = StyleSheet.create({
  /* Card */
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerLeft: { flex: 1 },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  venueLabel: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  clockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E68A2E",
    marginRight: 8,
  },
  timeText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  liveBadge: {
    backgroundColor: "#D32F2F",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  liveText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* Court container */
  courtContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    height: 190,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  court: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#161616",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    borderRadius: 8,
  },

  /* Center line */
  centerLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: COURT_LINE_W,
    backgroundColor: COURT_LINE,
    marginLeft: -COURT_LINE_W / 2, // centers it perfectly
  },

  /* Center circle */
  centerCircle: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    backgroundColor: "#161616", // Hides the center line inside the circle
    marginTop: -24,
    marginLeft: -24,
  },

  /* Paint / key areas */
  paint: {
    position: "absolute",
    top: "32%",
    bottom: "32%",
    width: "19%",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  paintLeft: { left: 0, borderLeftWidth: 0 },
  paintRight: { right: 0, borderRightWidth: 0 },

  /* 3-Point Lines */
  threePoint: {
    position: "absolute",
    top: "6%", // Adjusted slightly higher/lower to match screenshot scale
    bottom: "6%",
    width: "36%", // Adjusted slightly wider to match screenshot scale
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  threePointLeft: {
    left: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 1000, // Large number forces perfect round arc
    borderBottomRightRadius: 1000,
  },
  threePointRight: {
    right: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000,
  },

  /* Free throw circles - Dashed Base */
  ftCircleDashed: {
    position: "absolute",
    top: "50%",
    width: FT_RADIUS * 2,
    height: FT_RADIUS * 2,
    borderRadius: FT_RADIUS,
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    borderStyle: "dashed",
    marginTop: -FT_RADIUS,
  },
  ftLeft: { left: "19%", marginLeft: -FT_RADIUS },
  ftRight: { right: "19%", marginRight: -FT_RADIUS },

  /* Free throw circles - Solid Half Clipping Container */
  ftSolidContainer: {
    position: "absolute",
    top: "50%",
    width: FT_RADIUS,
    height: FT_RADIUS * 2,
    marginTop: -FT_RADIUS,
    overflow: "hidden", // Clips the circle inside to be exactly half
  },
  ftSolidContainerLeft: { left: "19%" },
  ftSolidContainerRight: { right: "19%" },

  /* Free throw circles - Solid Full Circle */
  ftCircleSolid: {
    position: "absolute",
    width: FT_RADIUS * 2,
    height: FT_RADIUS * 2,
    borderRadius: FT_RADIUS,
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  ftCircleSolidLeft: { left: -FT_RADIUS }, // Shifts left to show right half
  ftCircleSolidRight: { right: -FT_RADIUS }, // Shifts right to show left half

  /* Player avatars */
  avatar: {
    position: "absolute",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  avatarTextEmpty: { color: "#555", fontSize: 16 },

  /* +N extra badge */
  extraBadge: {
    position: "absolute",
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  extraText: { color: "#AAA", fontSize: 11, fontWeight: "600" },

  /* Footer */
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  pillRow: { flexDirection: "row", gap: 8 },
  footerPill: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  footerPillText: { color: "#AAA", fontSize: 12, fontWeight: "600" },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E68A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});

export default CourtServerGameThumbnail;
