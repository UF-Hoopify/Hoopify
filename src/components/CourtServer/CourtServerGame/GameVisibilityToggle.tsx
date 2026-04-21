import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { GameVisibility } from "../../../types/CourtServerTypes";

interface GameVisibilityToggleProps {
  gameVisibility: GameVisibility;
  onToggle: (visibility: GameVisibility) => void;
}

export const GameVisibilityToggle = ({
  gameVisibility,
  onToggle,
}: GameVisibilityToggleProps) => {
  return (
    <View style={styles.container}>
      {/* Public Button */}
      <TouchableOpacity
        style={[
          styles.button,
          gameVisibility === "public" && styles.activeButton,
        ]}
        onPress={() => onToggle("public")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.text,
            gameVisibility === "public" && styles.activeText,
          ]}
        >
          Public
        </Text>
      </TouchableOpacity>

      {/* Private Button */}
      <TouchableOpacity
        style={[
          styles.button,
          gameVisibility === "private" && styles.activeButton,
        ]}
        onPress={() => onToggle("private")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.text,
            gameVisibility === "private" && styles.activeText,
          ]}
        >
          Private
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    padding: 4,
    flex: 1,
    marginRight: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#E68A2E",
  },
  text: {
    color: "#888888",
    fontWeight: "600",
    fontSize: 14,
  },
  activeText: {
    color: "#FFFFFF",
  },
});
