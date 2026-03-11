import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Button, StatusBar, StyleSheet, Text, View } from "react-native";
import { CourtServerTab } from "../components/CourtServer/CourtServerTab";
import { CourtServerThumbnail } from "../components/CourtServer/CourtServerThumbnail";
import { useCourtContext } from "../context/CourtContext";

export const CourtServerScreen = () => {
  const navigation = useNavigation<any>();
  const { activeCourt } = useCourtContext();
  const snapPoints = useMemo(() => ["50%", "92%"], []);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  if (!activeCourt) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No court selected.</Text>
        <Text style={styles.subText}>
          Go to the Explore tab and select a court to Check In.
        </Text>
        <Button
          title="Go to Map"
          onPress={() => navigation.navigate("MainTabs", { screen: "Explore" })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Thumbnail fills the background */}
      <CourtServerThumbnail
        name={activeCourt.name}
        address={activeCourt.address}
        rating={activeCourt.rating_google}
        totalRatings={activeCourt.total_ratings_google}
        photos={activeCourt.photos}
        hideNavigationArrows={isSheetExpanded}
      />

      {/* Bottom sheet slides over the thumbnail */}
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
        enableDynamicSizing={false}
        onChange={(index) => setIsSheetExpanded(index === 1)}
      >
        <CourtServerTab courtServerId={activeCourt.id} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  sheetBackground: {
    backgroundColor: "#121212",
  },
  sheetIndicator: {
    backgroundColor: "#555",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});
