import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { ReactElement, useState } from "react";
import {
  ListRenderItem,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
import CourtGameDetails from "./CourtGameDetails";
import CourtServerGameThumbnail from "./CourtServerGameThumbnail";

interface CourtServerGameListContainerProps {
  courtServerGames: CourtServerGame[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListHeaderComponent?: ReactElement | null;
}

const CourtServerGameListContainer = ({
  courtServerGames,
  contentContainerStyle,
  ListHeaderComponent,
}: CourtServerGameListContainerProps) => {
  const [selectedGame, setSelectedGame] = useState<CourtServerGame | null>(
    null,
  );

  const renderGame: ListRenderItem<CourtServerGame> = ({ item }) => (
    <CourtServerGameThumbnail game={item} onPress={setSelectedGame} />
  );

  return (
    <>
      <BottomSheetFlatList
        data={courtServerGames}
        keyExtractor={(item: CourtServerGame) => item.id}
        renderItem={renderGame}
        style={styles.scrollContainer}
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No games yet. Create one!</Text>
          </View>
        }
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      />

      <Modal
        visible={selectedGame !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedGame(null)}
      >
        {selectedGame && (
          <CourtGameDetails
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
          />
        )}
      </Modal>
    </>
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
