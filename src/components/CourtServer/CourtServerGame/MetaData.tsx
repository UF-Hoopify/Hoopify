import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
import { capitalizeFirst, formatDuration } from "./courtGameDetailsHelpers";

interface MetaDataProps {
  game: CourtServerGame;
}

const MetaData = ({ game }: MetaDataProps) => (
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

const styles = StyleSheet.create({
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
});

export default MetaData;
