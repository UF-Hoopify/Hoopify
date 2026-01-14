import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

interface GameMapProps {
  onRegionChange: (region: Region) => void;
}

export const GameMap: React.FC<GameMapProps> = ({ onRegionChange }) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.006,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={onRegionChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { width: "100%", height: "100%" },
});
