import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Court } from "../../data/mockCourts";

interface CourtBottomSheetProps {
  courts: Court[];
}

export const CourtBottomSheet: React.FC<CourtBottomSheetProps> = ({
  courts,
}) => {
  const snapPoints = useMemo(() => ["15%", "90%"], []);
  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetFlatList<Court>
        data={courts}
        keyExtractor={(item: Court) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }: { item: Court }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              {item.available} Hoopers Active • {item.lat.toFixed(3)},{" "}
              {item.lng.toFixed(3)}
            </Text>
            <View style={styles.joinButton}>
              <Text style={styles.joinText}>View Court</Text>
            </View>
          </View>
        )}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#131214",
  },
  indicator: {
    backgroundColor: "#555",
    width: 75,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#2C2C2C",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#AAA",
    marginTop: 4,
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: "#F97316",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  joinText: {
    color: "white",
    fontWeight: "bold",
  },
});
