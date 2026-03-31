import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { auth } from "../../../config/firebaseConfig";
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
  const isInGame = !!(currentUserId && game.players?.[currentUserId]);

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

      <JoinButton isInGame={isInGame} />
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
