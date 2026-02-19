import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import PostCard from "../components/CourtSearch/Feed/PostCard";

export default function SinglePostScreen({ route }: any) {
  const { post } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Reusing the exact same UI card from the Feed! */}
      <PostCard post={post} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  content: { padding: 16 }
});