import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Court } from "../../types/CourtSearchTypes";
import { CourtListing } from "./CourtListing"; // Import the new component

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
          <CourtListing
            court={item}
            onPress={() => console.log("Navigate to Court Server:", item.id)}
          />
        )}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#121212", // Dark Theme Background
  },
  indicator: {
    backgroundColor: "#555",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
});
