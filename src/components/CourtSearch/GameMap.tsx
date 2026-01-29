import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Court } from "../../types/CourtSearchTypes";

interface GameMapProps {
  onRegionChangeComplete: (region: Region) => void;
  courts: Court[];
  isSearching?: boolean;
  onCourtSelect: (court: Court) => void;
  onMapPress?: () => void;
}

const INITIAL_REGION: Region = {
  latitude: 29.6499,
  longitude: -82.3558,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// TODO: Make MAX_MARKERS configurable via props if needed
const MAX_MARKERS = 20;

const GameMapComponent: React.FC<GameMapProps> = ({
  onRegionChangeComplete,
  courts = [],
  isSearching = false,
  onCourtSelect,
  onMapPress,
}) => {
  const handleMapReady = useCallback(() => {
    onRegionChangeComplete(INITIAL_REGION);
  }, [onRegionChangeComplete]);

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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={onRegionChangeComplete}
        moveOnMarkerPress={false}
        onMapReady={handleMapReady}
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
});
