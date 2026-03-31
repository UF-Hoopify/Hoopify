import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
import ChatTab from "./ChatTab";
import StatusTab from "./StatusTab";

interface CourtDetailsSectionProps {
  game: CourtServerGame;
}

const CourtDetailsSection = ({ game }: CourtDetailsSectionProps) => {
  const [activeTab, setActiveTab] = useState<"Status" | "Chat">("Status");

  return (
    <View style={styles.courtDetailsContainer}>
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab("Status")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Status" && styles.tabTextActive,
            ]}
          >
            Status
          </Text>
          {activeTab === "Status" && <View style={styles.tabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("Chat")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Chat" && styles.tabTextActive,
            ]}
          >
            Chat
          </Text>
          {activeTab === "Chat" && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {activeTab === "Status" ? <StatusTab game={game} /> : <ChatTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  courtDetailsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  tabRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  tabText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    paddingBottom: 6,
  },
  tabTextActive: {
    color: "#FFF",
  },
  tabUnderline: {
    height: 2,
    backgroundColor: "#FFF",
    borderRadius: 1,
  },
});

export default CourtDetailsSection;
