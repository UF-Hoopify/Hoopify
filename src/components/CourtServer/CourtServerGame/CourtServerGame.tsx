import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { fetchCourtGames } from "../../../services/CourtService";
import {
  CourtServerGame as CourtServerGameType,
  GameVisibility,
} from "../../../types/CourtServerTypes";
import CourtServerGameListContainer from "./CourtServerGameListContainer";
import { CreateCourtServerGameModal } from "./CreateCourtServerGameModal";
import { GameVisibilityToggle } from "./GameVisibilityToggle";

interface CourtServerGameProps {
  courtServerId: string;
}

const CourtServerGame = ({ courtServerId }: CourtServerGameProps) => {
  const [gameVisibility, setGameVisibility] =
    useState<GameVisibility>("public");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [games, setGames] = useState<CourtServerGameType[]>([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const fetchedGames = await fetchCourtGames(
          courtServerId,
          gameVisibility,
        );
        console.log("Fetched court games:", fetchedGames);
        setGames(fetchedGames);
      } catch (error) {
        console.error("Error fetching court games:", error);
      }
    };

    loadGames();
  }, [courtServerId, gameVisibility]);

  const listHeader = useMemo(
    () => (
      <View style={styles.headerRow}>
        <GameVisibilityToggle
          gameVisibility={gameVisibility}
          onToggle={(newVisibility) => setGameVisibility(newVisibility)}
        />

        <View style={styles.createButtonShell}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
          <CreateCourtServerGameModal
            visible={isCreateModalVisible}
            onClose={() => setIsCreateModalVisible(false)}
            courtServerId={courtServerId}
          />
        </View>
      </View>
    ),
    [courtServerId, gameVisibility, isCreateModalVisible],
  );

  return (
    <CourtServerGameListContainer
      courtServerGames={games}
      ListHeaderComponent={listHeader}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 16,
  },
  createButtonShell: {
    width: 44,
    height: 44,
    backgroundColor: "#E68A2E",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    width: 44,
    height: 44,
    backgroundColor: "#E68A2E",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CourtServerGame;
