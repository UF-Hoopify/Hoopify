import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CourtGameDetailsProps {
  game: CourtServerGame;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

const formatDuration = (
  start: { toDate?: () => Date },
  end?: { toDate?: () => Date },
): string => {
  if (!end) return "N/A";
  try {
    const s = start.toDate
      ? start.toDate()
      : new Date(start as unknown as number);
    const e = end.toDate ? end.toDate() : new Date(end as unknown as number);
    const diffMin = Math.round((e.getTime() - s.getTime()) / 60000);
    return `${diffMin} Min`;
  } catch {
    return "N/A";
  }
};

const capitalizeFirst = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// ---------------------------------------------------------------------------
// Sub-components (mocked)
// ---------------------------------------------------------------------------

/** Header: "[format] at [time]" with back arrow and court info */
const Header = ({
  game,
  onBack,
}: {
  game: CourtServerGame;
  onBack: () => void;
}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={22} color="#FFF" />
    </TouchableOpacity>
    <View style={styles.headerCenter}>
      <Text style={styles.headerTitle}>
        {game.format} at {formatTime(game.meetupTime)}
      </Text>
      {game.courtDescriptor ? (
        <Text style={styles.headerSubtitle}>
          {game.courtDescriptor.toUpperCase()}
        </Text>
      ) : null}
    </View>
    {/* Spacer to balance the back button */}
    <View style={styles.backButton} />
  </View>
);

/** Court overlay — mocked placeholder matching the thumbnail style */
const CourtOverlay = ({ game }: { game: CourtServerGame }) => (
  <View style={styles.courtOverlayContainer}>
    <View style={styles.courtOverlayInner}>
      <View style={styles.courtMock}>
        <View style={styles.courtCenterLine} />
        <View style={styles.courtCenterCircle} />
        <View style={[styles.courtThreePoint, styles.courtThreePointLeft]} />
        <View style={[styles.courtThreePoint, styles.courtThreePointRight]} />
        <View style={[styles.courtPaint, styles.courtPaintLeft]} />
        <View style={[styles.courtPaint, styles.courtPaintRight]} />
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
        <View style={styles.courtArrowButton}>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </View>
      </View>
    </View>
  </View>
);

/** Metadata row: type, level, duration */
const MetaData = ({ game }: { game: CourtServerGame }) => (
  <View style={styles.metaContainer}>
    <View style={styles.metaSeparator} />
    <View style={styles.metaRow}>
      <View style={styles.metaItem}>
        <View style={[styles.metaIcon, { backgroundColor: "#2A2A2A" }]}>
          <Ionicons name="people-outline" size={18} color="#E68A2E" />
        </View>
        <Text style={styles.metaLabel}>TYPE</Text>
        <Text style={styles.metaValue}>{game.format}</Text>
      </View>

      <View style={styles.metaItem}>
        <View style={[styles.metaIcon, { backgroundColor: "#2A2A2A" }]}>
          <Ionicons name="trophy-outline" size={18} color="#E68A2E" />
        </View>
        <Text style={styles.metaLabel}>LEVEL</Text>
        <Text style={styles.metaValue}>
          {capitalizeFirst(game.competitiveness)}
        </Text>
      </View>

      <View style={styles.metaItem}>
        <View style={[styles.metaIcon, { backgroundColor: "#2A2A2A" }]}>
          <Ionicons name="time-outline" size={18} color="#E68A2E" />
        </View>
        <Text style={styles.metaLabel}>DUR</Text>
        <Text style={styles.metaValue}>
          {formatDuration(game.meetupTime, game.endingTime)}
        </Text>
      </View>
    </View>
  </View>
);

/** Description section */
const Description = ({ game }: { game: CourtServerGame }) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.sectionTitle}>DESCRIPTION</Text>
    <Text style={styles.descriptionText}>
      {game.description || "No description provided."}
    </Text>
  </View>
);

/** Court Details — Status / Chat tab switcher (mocked) */
const CourtDetailsSection = ({ game }: { game: CourtServerGame }) => {
  const [activeTab, setActiveTab] = useState<"Status" | "Chat">("Status");
  const players = Object.values(game.players ?? {});

  return (
    <View style={styles.courtDetailsContainer}>
      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab("Status")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Status" && styles.tabTextActive,
            ]}
          >
            Status
          </Text>
          {activeTab === "Status" && <View style={styles.tabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("Chat")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Chat" && styles.tabTextActive,
            ]}
          >
            Chat
          </Text>
          {activeTab === "Chat" && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      {activeTab === "Status" ? (
        <View style={styles.statusList}>
          {players.length === 0 ? (
            <Text style={styles.emptyText}>No players yet.</Text>
          ) : (
            players.map((player, index) => (
              <View key={index} style={styles.playerRow}>
                {/* Avatar */}
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerAvatarText}>
                    {player.displayName
                      ? player.displayName.charAt(0).toUpperCase()
                      : "?"}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {player.displayName || "Unknown"}
                  </Text>
                  <Text style={styles.playerMeta}>
                    {capitalizeFirst(player.team)} ·{" "}
                    {capitalizeFirst(player.status)}
                  </Text>
                </View>

                {/* Status badge */}
                <View
                  style={[
                    styles.statusBadge,
                    player.status === "confirmed"
                      ? styles.statusReady
                      : player.status === "pending"
                        ? styles.statusMaybe
                        : styles.statusDeclined,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      player.status === "confirmed"
                        ? styles.statusReadyText
                        : player.status === "pending"
                          ? styles.statusMaybeText
                          : styles.statusDeclinedText,
                    ]}
                  >
                    {player.status === "confirmed"
                      ? "READY"
                      : player.status === "pending"
                        ? "MAYBE"
                        : "OUT"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.chatPlaceholder}>
          <Text style={styles.emptyText}>Chat coming soon.</Text>
        </View>
      )}
    </View>
  );
};

/** Join / Queue button */
const JoinButton = () => (
  <View style={styles.joinButtonContainer}>
    <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
      <Ionicons
        name="basketball-outline"
        size={20}
        color="#000"
        style={{ marginRight: 8 }}
      />
      <Text style={styles.joinButtonText}>Join/Queue Game</Text>
    </TouchableOpacity>
  </View>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const CourtGameDetails = ({ game, onBack }: CourtGameDetailsProps) => {
  return (
    <View style={styles.container}>
      <Header game={game} onBack={onBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CourtOverlay game={game} />
        <MetaData game={game} />
        <Description game={game} />
        <CourtDetailsSection game={game} />
      </ScrollView>

      <JoinButton />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const COURT_LINE = "#E68A2E";
const COURT_LINE_W = 1;

const styles = StyleSheet.create({
  /* Container */
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0D0D0D",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 2,
  },

  /* Court Overlay */
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
  courtArrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E68A2E",
    alignItems: "center",
    justifyContent: "center",
  },

  /* MetaData */
  metaContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metaSeparator: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metaItem: {
    alignItems: "center",
  },
  metaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  metaLabel: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Description */
  descriptionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 20,
  },

  /* Court Details (Status / Chat) */
  courtDetailsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  tabRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  tabText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    paddingBottom: 6,
  },
  tabTextActive: {
    color: "#FFF",
  },
  tabUnderline: {
    height: 2,
    backgroundColor: "#FFF",
    borderRadius: 1,
  },

  /* Status list */
  statusList: {
    gap: 12,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  playerAvatarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  playerMeta: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusReady: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
  },
  statusMaybe: {
    backgroundColor: "rgba(230, 138, 46, 0.15)",
  },
  statusDeclined: {
    backgroundColor: "rgba(211, 47, 47, 0.15)",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusReadyText: {
    color: "#4CAF50",
  },
  statusMaybeText: {
    color: "#E68A2E",
  },
  statusDeclinedText: {
    color: "#D32F2F",
  },

  /* Chat placeholder */
  chatPlaceholder: {
    paddingVertical: 24,
  },

  /* Join Button */
  joinButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: "#0D0D0D",
  },
  joinButton: {
    backgroundColor: "#E68A2E",
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default CourtGameDetails;
