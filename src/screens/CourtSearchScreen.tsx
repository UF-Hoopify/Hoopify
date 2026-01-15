import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";
import { CourtBottomSheet } from "../components/CourtSearch/CourtBottomSheet"; // Import the new sheet
import { GameMap } from "../components/CourtSearch/GameMap";
import { MOCK_COURTS } from "../data/mockCourts";

export default function CourtSearchScreen() {
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  const handleRegionChange = (region: Region) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      console.log("Searching area...");
      setIsSearching(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <GameMap courts={MOCK_COURTS} onRegionChange={handleRegionChange} />
      </View>
      <CourtBottomSheet courts={MOCK_COURTS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
