import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { auth } from "../../../config/firebaseConfig";
import {
  changePlayerStatus,
  changePlayerTeamStatus,
} from "../../../services/CourtService";
import {
  CourtServerGame,
  GamePlayer,
  PlayerStatus,
  PlayerTeam,
} from "../../../types/CourtServerTypes";
import { capitalizeFirst } from "./courtGameDetailsHelpers";
import StatusPickerModal from "./StatusPickerModal";

interface StatusTabProps {
  game: CourtServerGame;
}

type PlayerEntry = [string, GamePlayer];

const sortByOldest = (a: PlayerEntry, b: PlayerEntry): number => {
  const timeA = a[1].lastStatusSwitchedTime?.toMillis?.() ?? 0;
  const timeB = b[1].lastStatusSwitchedTime?.toMillis?.() ?? 0;
  return timeA - timeB;
};

type Section = "inGame" | "inQueue" | "backUps";

const TeamPicker = ({
  currentTeam,
  isCurrentUser,
  onTeamChange,
  section,
  homeHasSpace,
  awayHasSpace,
}: {
  currentTeam: PlayerTeam;
  isCurrentUser: boolean;
  onTeamChange: (team: "home" | "away") => void;
  section: Section;
  homeHasSpace: boolean;
  awayHasSpace: boolean;
}) => {
  // Back Ups: show nothing
  if (section === "backUps") return null;

  // In Queue: show "In-Queue" label
  if (section === "inQueue") {
    return <Text style={styles.teamLabel}>In-Queue</Text>;
  }

  // In Game: non-current users just see their team label
  if (!isCurrentUser) {
    return (
      <Text style={styles.teamLabel}>{capitalizeFirst(currentTeam)}</Text>
    );
  }

  // In Game current user: only show buttons for teams with space (or their current team)
  const showHome = currentTeam === "home" || homeHasSpace;
  const showAway = currentTeam === "away" || awayHasSpace;

  // If only one option, show as label
  if (showHome && !showAway) {
    return <Text style={styles.teamLabel}>Home</Text>;
  }
  if (showAway && !showHome) {
    return <Text style={styles.teamLabel}>Away</Text>;
  }

  return (
    <View style={styles.teamPickerRow}>
      {showHome && (
        <TouchableOpacity
          style={[
            styles.teamOption,
            currentTeam === "home" && styles.teamOptionActive,
          ]}
          onPress={() => onTeamChange("home")}
        >
          <Text
            style={[
              styles.teamOptionText,
              currentTeam === "home" && styles.teamOptionTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
      )}
      {showAway && (
        <TouchableOpacity
          style={[
            styles.teamOption,
            currentTeam === "away" && styles.teamOptionActive,
          ]}
          onPress={() => onTeamChange("away")}
        >
          <Text
            style={[
              styles.teamOptionText,
              currentTeam === "away" && styles.teamOptionTextActive,
            ]}
          >
            Away
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const StatusTab = ({ game }: StatusTabProps) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [localPlayers, setLocalPlayers] = useState(game.players ?? {});

  useEffect(() => {
    setLocalPlayers(game.players ?? {});
  }, [game.players]);

  const currentUserId = auth.currentUser?.uid;

  const maxPerTeam = parseInt(game.format.split("v")[0], 10);
  const maxInGame = maxPerTeam * 2;

  const { inGame, inQueue, backUps } = useMemo(() => {
    const entries = Object.entries(localPlayers);

    const readyPlayers = entries
      .filter(([, p]) => p.status === "confirmed")
      .sort(sortByOldest);

    const notReadyPlayers = entries
      .filter(([, p]) => p.status !== "confirmed")
      .sort(sortByOldest);

    return {
      inGame: readyPlayers.slice(0, maxInGame),
      inQueue: readyPlayers.slice(maxInGame),
      backUps: notReadyPlayers,
    };
  }, [localPlayers, maxInGame]);

  const handleStatusSelect = async (newStatus: PlayerStatus) => {
    if (!currentUserId) return;

    setLocalPlayers((prev) => ({
      ...prev,
      [currentUserId]: { ...prev[currentUserId], status: newStatus },
    }));

    try {
      await changePlayerStatus(game.id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      setLocalPlayers((prev) => ({
        ...prev,
        [currentUserId]: {
          ...prev[currentUserId],
          status: game.players[currentUserId].status,
        },
      }));
    }
  };

  const handleTeamChange = async (newTeam: "home" | "away") => {
    if (!currentUserId) return;

    const previousTeam = localPlayers[currentUserId].team;
    setLocalPlayers((prev) => ({
      ...prev,
      [currentUserId]: { ...prev[currentUserId], team: newTeam },
    }));

    try {
      await changePlayerTeamStatus(game.id, newTeam);
    } catch (error) {
      console.error("Failed to update team:", error);
      setLocalPlayers((prev) => ({
        ...prev,
        [currentUserId]: { ...prev[currentUserId], team: previousTeam },
      }));
    }
  };

  const allPlayers = Object.entries(localPlayers);
  if (allPlayers.length === 0) {
    return <Text style={styles.emptyText}>No players yet.</Text>;
  }

  const homeCount = inGame.filter(([, p]) => p.team === "home").length;
  const awayCount = inGame.filter(([, p]) => p.team === "away").length;
  const homeHasSpace = homeCount < maxPerTeam;
  const awayHasSpace = awayCount < maxPerTeam;

  const getStatusLabel = (status: PlayerStatus) =>
    status === "confirmed" ? "READY" : status === "pending" ? "MAYBE" : "OUT";

  const getStatusStyle = (status: PlayerStatus) =>
    status === "confirmed"
      ? styles.statusReady
      : status === "pending"
        ? styles.statusMaybe
        : styles.statusDeclined;

  const getStatusTextStyle = (status: PlayerStatus) =>
    status === "confirmed"
      ? styles.statusReadyText
      : status === "pending"
        ? styles.statusMaybeText
        : styles.statusDeclinedText;

  const renderPlayerRow = (
    [userId, player]: PlayerEntry,
    section: Section,
  ) => {
    const isCurrentUser = userId === currentUserId;

    const badge = (
      <View style={[styles.statusBadge, getStatusStyle(player.status)]}>
        <Text
          style={[styles.statusBadgeText, getStatusTextStyle(player.status)]}
        >
          {getStatusLabel(player.status)}
        </Text>
      </View>
    );

    return (
      <View key={userId} style={styles.playerRow}>
        <View style={styles.playerAvatar}>
          <Text style={styles.playerAvatarText}>
            {player.displayName
              ? player.displayName.charAt(0).toUpperCase()
              : "?"}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {player.displayName || "Unknown"}
          </Text>
          <View style={styles.playerMetaRow}>
            <TeamPicker
              currentTeam={player.team}
              isCurrentUser={isCurrentUser}
              onTeamChange={handleTeamChange}
              section={section}
              homeHasSpace={homeHasSpace}
              awayHasSpace={awayHasSpace}
            />
            <Text style={styles.playerMeta}>
              {" "}· {capitalizeFirst(player.status)}
            </Text>
          </View>
        </View>

        {isCurrentUser ? (
          <TouchableOpacity onPress={() => setPickerVisible(true)}>
            {badge}
          </TouchableOpacity>
        ) : (
          badge
        )}
      </View>
    );
  };

  const renderSection = (
    title: string,
    players: PlayerEntry[],
    section: Section,
  ) => {
    if (players.length === 0) return null;

    return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
          {players.map((entry) => renderPlayerRow(entry, section))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.statusList}>
      {renderSection("IN GAME", inGame, "inGame")}
      {renderSection("IN QUEUE", inQueue, "inQueue")}
      {renderSection("BACK UPS", backUps, "backUps")}

      {currentUserId && localPlayers[currentUserId] && (
        <StatusPickerModal
          visible={pickerVisible}
          currentStatus={localPlayers[currentUserId].status}
          onSelect={handleStatusSelect}
          onClose={() => setPickerVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusList: {
    gap: 0,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  sectionHeader: {
    backgroundColor: "#121212",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#2A2A2A",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#A0A0A0",
    textTransform: "uppercase",
    fontSize: 12,
  },
  sectionContent: {
    gap: 12,
    paddingVertical: 12,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
  playerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  playerMeta: {
    color: "#888",
    fontSize: 12,
  },
  teamLabel: {
    color: "#888",
    fontSize: 12,
  },
  teamPickerRow: {
    flexDirection: "row",
    gap: 4,
  },
  teamOption: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  teamOptionActive: {
    backgroundColor: "rgba(230, 138, 46, 0.15)",
  },
  teamOptionText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  teamOptionTextActive: {
    color: "#E68A2E",
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
});

export default StatusTab;
