import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { auth } from "../../../config/firebaseConfig";
import {
  changePlayerStatus,
  changePlayerTeamStatus,
} from "../../../services/CourtService";
import {
  CourtServerGame,
  PlayerStatus,
  PlayerTeam,
} from "../../../types/CourtServerTypes";
import { capitalizeFirst } from "./courtGameDetailsHelpers";
import StatusPickerModal from "./StatusPickerModal";

interface StatusTabProps {
  game: CourtServerGame;
}

const TeamPicker = ({
  currentTeam,
  isCurrentUser,
  onTeamChange,
}: {
  currentTeam: PlayerTeam;
  isCurrentUser: boolean;
  onTeamChange: (team: "home" | "away") => void;
}) => {
  if (!isCurrentUser) {
    return (
      <Text style={styles.teamLabel}>{capitalizeFirst(currentTeam)}</Text>
    );
  }

  return (
    <View style={styles.teamPickerRow}>
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
  const players = Object.entries(localPlayers);

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

  if (players.length === 0) {
    return <Text style={styles.emptyText}>No players yet.</Text>;
  }

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

  return (
    <View style={styles.statusList}>
      {players.map(([userId, player]) => {
        const isCurrentUser = userId === currentUserId;

        const badge = (
          <View style={[styles.statusBadge, getStatusStyle(player.status)]}>
            <Text
              style={[
                styles.statusBadgeText,
                getStatusTextStyle(player.status),
              ]}
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
      })}

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
