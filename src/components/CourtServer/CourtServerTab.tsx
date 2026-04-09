import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CourtServerGame from "./CourtServerGame/CourtServerGame";
import { TabCarousel } from "./TabCarousel";
import TabInfoContent from "./TabInfoContent";

const TABS = ["Games", "Info", "Reviews"];

export const CourtServerTab = ({
  courtServerId,
}: {
  courtServerId: string;
}) => {
  const [activeTab, setActiveTab] = useState("Info");

  return (
    <View style={styles.container}>
      <TabCarousel
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      <View style={styles.detailsContainer}>
        {activeTab === "Info" && (
          <BottomSheetScrollView
            contentContainerStyle={styles.infoContent}
            showsVerticalScrollIndicator={false}
          >
            <TabInfoContent />
          </BottomSheetScrollView>
        )}
        {activeTab === "Games" && (
          <CourtServerGame courtServerId={courtServerId} />
        )}
        {activeTab === "Reviews" && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Reviews & Ratings</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  detailsContainer: {
    flex: 1,
    width: "100%",
  },
  infoContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
  },
});
