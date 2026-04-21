import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface JoinButtonProps {
  isInGame?: boolean;
  onJoinGame?: () => void;
}

const JoinButton = ({ isInGame = false, onJoinGame }: JoinButtonProps) => (
  <View style={styles.joinButtonContainer}>
    <TouchableOpacity
      style={[styles.joinButton, isInGame && styles.joinButtonDisabled]}
      activeOpacity={isInGame ? 1 : 0.8}
      disabled={isInGame}
      onPress={onJoinGame}
    >
      <Ionicons
        name="basketball-outline"
        size={20}
        color={isInGame ? "#666" : "#000"}
        style={{ marginRight: 8 }}
      />
      <Text
        style={[
          styles.joinButtonText,
          isInGame && styles.joinButtonTextDisabled,
        ]}
      >
        {isInGame ? "Joined/Queued" : "Join/Queue Game"}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
  joinButtonDisabled: {
    backgroundColor: "#2A2A2A",
  },
  joinButtonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700",
  },
  joinButtonTextDisabled: {
    color: "#666",
  },
});

export default JoinButton;
