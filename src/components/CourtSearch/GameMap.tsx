import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Court } from "../../data/mockCourts";

interface GameMapProps {
  onRegionChange: (region: Region) => void;
  courts: Court[];
}

export const GameMap: React.FC<GameMapProps> = ({ onRegionChange, courts }) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 29.6499,
          longitude: -82.3558,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onRegionChangeComplete={onRegionChange}
      >
        {courts.map((court) => (
          <Marker
            key={court.id}
            coordinate={{ latitude: court.lat, longitude: court.lng }}
            title={court.name}
            description={`${court.available} hoopers here`}
            pinColor="#F97316"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { width: "100%", height: "100%" },
});
