import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Region } from "react-native-maps"; // Import the type for TypeScript
import { GameMap } from "../components/GameMap";

export default function CourtSearchScreen() {
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  const handleRegionChange = (region: Region) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(region);
    }, 500);
  };

  const performSearch = (region: Region) => {
    setIsSearching(true);
    console.log("🔍 SEARCH FIRED!");
    console.log(
      "📍 Center:",
      region.latitude.toFixed(4),
      region.longitude.toFixed(4)
    );
    console.log("📏 Zoom Delta:", region.latitudeDelta.toFixed(4));

    // Simulate a network request taking 1 second
    setTimeout(() => {
      setIsSearching(false);
      console.log("✅ Search Complete");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Pass the handler down to the child */}
        <GameMap onRegionChange={handleRegionChange} />

        {/* Visual Debug Overlay */}
        <View style={styles.debugOverlay}>
          <Text style={styles.debugText}>
            Status: {isSearching ? "⏳ Searching..." : "Idle"}
          </Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.placeholderText}>Scrollable Games List</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  mapContainer: { flex: 0.6, borderBottomWidth: 1, borderBottomColor: "#333" },
  listContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  placeholderText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },

  // Debug Styles
  debugOverlay: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    borderRadius: 8,
  },
  debugText: {
    color: "#00FF00", // Hacker Green
    fontSize: 12,
    fontWeight: "bold",
  },
});
