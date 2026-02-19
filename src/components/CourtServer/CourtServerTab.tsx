import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabCarousel } from "./TabCarousel";
import TabInfoContent from "./TabInfoContent";

const TABS = ["Games", "Info", "Chat", "Reviews"];

export const CourtServerTab = () => {
  const [activeTab, setActiveTab] = useState("Info");

  return (
    <View style={styles.container}>
      {/* 1. THE CAROUSEL */}
      <TabCarousel
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* 2. THE DETAILS (Placeholder Content) */}
      <View style={styles.detailsContainer}>
        {activeTab === "Info" && <TabInfoContent />}
        {activeTab === "Games" && (
          <Text style={styles.placeholderText}>
            🏀 Upcoming Games List Initial
          </Text>
        )}
        {activeTab === "Chat" && (
          <Text style={styles.placeholderText}>💬 Court Chat Room</Text>
        )}
        {activeTab === "Reviews" && (
          <Text style={styles.placeholderText}>⭐ Reviews & Ratings</Text>
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
    padding: 20,
    minHeight: 300, // Forces space so you can see it scrolling
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
  },
});
