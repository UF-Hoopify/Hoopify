import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { auth } from "../../../config/firebaseConfig";
import { changePlayerStatus } from "../../../services/CourtService";
import { CourtServerGame, PlayerStatus } from "../../../types/CourtServerTypes";
import { capitalizeFirst } from "./courtGameDetailsHelpers";
import StatusPickerModal from "./StatusPickerModal";

interface StatusTabProps {
  game: CourtServerGame;
}

const StatusTab = ({ game }: StatusTabProps) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [localPlayers, setLocalPlayers] = useState(game.players ?? {});

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
              <Text style={styles.playerMeta}>
                {capitalizeFirst(player.team)} ·{" "}
                {capitalizeFirst(player.status)}
              </Text>
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
});

export default StatusTab;
