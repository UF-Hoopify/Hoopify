import { useUserLocation } from "@/src/hooks/useUserLocation";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Court } from "../../types/CourtSearchTypes";

interface GameMapProps {
  onRegionChangeComplete: (region: Region) => void;
  courts: Court[];
  isSearching?: boolean;
  onCourtSelect: (court: Court) => void;
  onMapPress?: () => void;
}

const DEFAULT_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MAX_MARKERS = 20;

const GameMapComponent: React.FC<GameMapProps> = ({
  onRegionChangeComplete,
  courts = [],
  isSearching = false,
  onCourtSelect,
  onMapPress,
}) => {
  const { location, loading, errorMsg } = useUserLocation();
  const initialRegion = useMemo(() => {
    if (location) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    return DEFAULT_REGION;
  }, [location]);

  const handleMapReady = useCallback(() => {
    onRegionChangeComplete(initialRegion);
  }, [onRegionChangeComplete, initialRegion]);

  const markers = useMemo(() => {
    if (isSearching) return null;

    const seenIds = new Set<string>();

    return courts
      .slice(0, MAX_MARKERS)
      .filter((court) => {
        if (!court?.id) return false;
        if (seenIds.has(court.id)) return false;

        const valid =
          typeof court.lat === "number" &&
          typeof court.lng === "number" &&
          !Number.isNaN(court.lat) &&
          !Number.isNaN(court.lng);

        if (!valid) return false;

        seenIds.add(court.id);
        return true;
      })
      .map((court) => (
        <Marker
          key={court.id}
          coordinate={{
            latitude: court.lat,
            longitude: court.lng,
          }}
          title={court.name}
          pinColor="#F97316"
          tracksViewChanges={false}
          onPress={(e) => {
            e.stopPropagation();
            onCourtSelect(court);
          }}
        />
      ));
  }, [courts, isSearching, onCourtSelect]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChangeComplete}
        moveOnMarkerPress={false}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onMapReady={handleMapReady}
        onPress={onMapPress}
      >
        {markers}
      </MapView>
    </View>
  );
};

export const GameMap = React.memo(GameMapComponent);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { width: "100%", height: "100%" },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
