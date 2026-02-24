import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import PostCard from "../components/CourtSearch/Feed/PostCard";

export default function SinglePostScreen({ route }: any) {
  const { post } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PostCard post={post} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 16 },
});
