import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ChatTab = () => (
  <View style={styles.chatPlaceholder}>
    <Text style={styles.emptyText}>Chat coming soon.</Text>
  </View>
);

const styles = StyleSheet.create({
  chatPlaceholder: {
    paddingVertical: 24,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});

export default ChatTab;
