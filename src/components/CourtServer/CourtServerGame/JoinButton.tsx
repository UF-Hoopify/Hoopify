import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  joinButtonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default JoinButton;
