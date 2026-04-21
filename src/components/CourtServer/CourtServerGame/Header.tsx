import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
import { formatTime } from "./courtGameDetailsHelpers";

interface HeaderProps {
  game: CourtServerGame;
  onBack: () => void;
}

const Header = ({ game, onBack }: HeaderProps) => (
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

const styles = StyleSheet.create({
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
});

export default Header;
