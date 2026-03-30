import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";

interface DescriptionProps {
  game: CourtServerGame;
}

const Description = ({ game }: DescriptionProps) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.sectionTitle}>DESCRIPTION</Text>
    <Text style={styles.descriptionText}>
      {game.description || "No description provided."}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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
});

export default Description;
