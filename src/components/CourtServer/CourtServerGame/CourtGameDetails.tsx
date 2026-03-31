import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { auth } from "../../../config/firebaseConfig";
import { addPlayerToGame } from "../../../services/CourtService";
import { CourtServerGame } from "../../../types/CourtServerTypes";
import CourtDetailsSection from "./CourtDetailsSection";
import CourtOverlay from "./CourtOverlay";
import Description from "./Description";
import Header from "./Header";
import JoinButton from "./JoinButton";
import MetaData from "./MetaData";

interface CourtGameDetailsProps {
  game: CourtServerGame;
  onBack: () => void;
}

const CourtGameDetails = ({ game, onBack }: CourtGameDetailsProps) => {
  const currentUserId = auth.currentUser?.uid;
  const [isInGame, setIsInGame] = useState(
    !!(currentUserId && game.players?.[currentUserId]),
  );

  const handleJoinGame = async () => {
    try {
      const assignedTeam = await addPlayerToGame(game);
      setIsInGame(true);

      if (assignedTeam === "unassigned") {
        Alert.alert("Queued", "Both teams are full. You've been added to the queue.");
      }
    } catch (error) {
      console.error("Failed to join game:", error);
      Alert.alert("Error", "Failed to join the game. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Header game={game} onBack={onBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CourtOverlay game={game} />
        <MetaData game={game} />
        <Description game={game} />
        <CourtDetailsSection game={game} />
      </ScrollView>

      <JoinButton isInGame={isInGame} onJoinGame={handleJoinGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default CourtGameDetails;
