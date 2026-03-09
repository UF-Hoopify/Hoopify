import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
import CourtServerGameThumbnail from "./CourtServerGameThumbnail";

interface CourtServerGameListContainerProps {
  courtServerGames: CourtServerGame[];
}

const CourtServerGameListContainer = ({
  courtServerGames,
}: CourtServerGameListContainerProps) => {
  if (courtServerGames.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No games yet. Create one!</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
    >
      {courtServerGames.map((game) => (
        <CourtServerGameThumbnail key={game.id} game={game} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});

export default CourtServerGameListContainer;
