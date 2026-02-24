import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Region } from "react-native-maps";
import { CourtBottomSheet } from "../components/CourtSearch/CourtBottomSheet";
import { GameMap } from "../components/CourtSearch/GameMap";
import { searchNearbyCourts } from "../services/GooglePlacesService";
import { Court } from "../types/CourtSearchTypes";

export default function CourtSearchScreen() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const isMounted = useRef(true);
  const lastSearchedRegion = useRef<Region | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      debounceTimer.current && clearTimeout(debounceTimer.current);
      abortController.current?.abort();
    };
  }, []);

  const hasMapMovedSignificantly = (newRegion: Region): boolean => {
    if (!lastSearchedRegion.current) return true;

    const latDiff = Math.abs(
      newRegion.latitude - lastSearchedRegion.current.latitude,
    );
    const lngDiff = Math.abs(
      newRegion.longitude - lastSearchedRegion.current.longitude,
    );
    const zoomDiff = Math.abs(
      newRegion.latitudeDelta - lastSearchedRegion.current.latitudeDelta,
    );

    return latDiff > 0.002 || lngDiff > 0.002 || zoomDiff > 0.002;
  };

  const handleRegionChangeComplete = useCallback((region: Region) => {
    if (!hasMapMovedSignificantly(region)) return;

    debounceTimer.current && clearTimeout(debounceTimer.current);
    abortController.current?.abort();

    debounceTimer.current = setTimeout(async () => {
      if (!isMounted.current) return;

      setIsSearching(true);
      lastSearchedRegion.current = region;

      const controller = new AbortController();
      abortController.current = controller;

      try {
        const fetchedCourts = await searchNearbyCourts(
          region,
          "basketball court",
          controller.signal,
        );

        if (isMounted.current) {
          setCourts(fetchedCourts);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching courts:", err);
        }
      } finally {
        if (isMounted.current) {
          setIsSearching(false);
        }
      }
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {isSearching && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#F97316" />
          <Text style={styles.loadingText}>Finding courts...</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <GameMap
          courts={courts}
          isSearching={isSearching}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
      </View>

      <CourtBottomSheet courts={courts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  mapContainer: { ...StyleSheet.absoluteFillObject },
  loadingOverlay: {
    position: "absolute",
    top: 60,
    left: "50%",
    transform: [{ translateX: -50 }],
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loadingText: {
    color: "#FFF",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
