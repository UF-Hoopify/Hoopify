import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { ReactElement } from "react";
import {
  ListRenderItem,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
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
  const renderGame: ListRenderItem<CourtServerGame> = ({ item }) => (
    <CourtServerGameThumbnail game={item} />
  );

  return (
    <BottomSheetFlatList
      data={courtServerGames}
      keyExtractor={(item) => item.id}
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
