import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        width: "100%",
      }}
    >
      {/* Top Controls Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <GameVisibilityToggle
          gameVisibility={gameVisibility}
          onToggle={(newVisibility) => setGameVisibility(newVisibility)}
        />

        {/* Create Game Button */}
        <View
          style={{
            width: 44,
            height: 44,
            backgroundColor: "#E68A2E",
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#E68A2E",
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setIsCreateModalVisible(true)} // <-- Add this onPress
          >
            <Text style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
              +
            </Text>
          </TouchableOpacity>
          <CreateCourtServerGameModal
            visible={isCreateModalVisible}
            onClose={() => setIsCreateModalVisible(false)}
            courtServerId={courtServerId}
          />
        </View>
      </View>

      {/* Games List */}
      <CourtServerGameListContainer courtServerGames={games} />
    </View>
  );
};

export default CourtServerGame;
