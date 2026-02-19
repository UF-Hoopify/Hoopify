import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // NEW

export interface PostData {
  id: string;
  userId: string; // NEW: Required to navigate to their profile
  userName: string;
  courtName: string;
  courtLocation?: string;
  myScore: string;
  opponentScore: string;
  description: string;
  taggedFriends: string[];
  timestamp: any;
  likes: number;
  comments: number;
}

export default function PostCard({ post }: { post: PostData }) {
  const isWin = parseInt(post.myScore) > parseInt(post.opponentScore);
  const navigation = useNavigation(); // NEW

  const handlePressUser = () => {
    // @ts-ignore
    navigation.navigate("UserProfile", { userId: post.userId });
  };

  return (
    <View style={styles.card}>
      {/* Header - NOW CLICKABLE */}
      <TouchableOpacity style={styles.header} onPress={handlePressUser}>
        <View>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timeAgo}>Just now</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.gameTitle}>Game at {post.courtName}</Text>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>You</Text>
            <Text style={[styles.scoreValue, isWin && styles.winText]}>{post.myScore}</Text>
          </View>
          <Text style={styles.vs}>-</Text>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Opponent</Text>
            <Text style={[styles.scoreValue, !isWin && styles.winText]}>{post.opponentScore}</Text>
          </View>
        </View>

        <View style={styles.locationBadge}>
          <Ionicons name="location-sharp" size={16} color="#F97316" />
          <Text style={styles.locationText}>{post.courtLocation || "Gainesville, FL"}</Text>
        </View>
      </View>

      {post.taggedFriends.length > 0 && (
        <View style={styles.taggedSection}>
          <Ionicons name="basketball-outline" size={16} color="#F97316" />
          <Text style={styles.taggedText}>
            Played with: <Text style={{fontWeight: 'bold'}}>{post.taggedFriends.join(", ")}</Text>
          </Text>
        </View>
      )}

      {post.description ? (
        <Text style={styles.descriptionText}>{post.description}</Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.statText}>🏀 {post.likes || 0}</Text>
        <Text style={styles.statText}>💬 {post.comments || 0}</Text>
      </View>
    </View>
  );
}

// ... Keep your existing styles for PostCard ...
const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", marginBottom: 16, padding: 16, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: "#F0F0F0" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  userName: { fontWeight: "bold", fontSize: 16, color: "#333" },
  timeAgo: { color: "#999", fontSize: 12 },
  gameTitle: { fontWeight: "800", fontSize: 18, marginBottom: 12, color: "#111" },
  contentContainer: { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 12 },
  scoreBoard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  scoreItem: { alignItems: "center" },
  scoreLabel: { fontSize: 12, color: "#666", marginBottom: 4, textTransform: "uppercase" },
  scoreValue: { fontSize: 28, fontWeight: "900", color: "#333" },
  winText: { color: "#F97316" }, 
  vs: { fontSize: 20, color: "#DDD", fontWeight: "300" },
  locationBadge: { flexDirection: "row", alignItems: "center" },
  locationText: { marginLeft: 4, color: "#666", fontSize: 14 },
  taggedSection: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  taggedText: { marginLeft: 8, color: "#555", fontSize: 14 },
  descriptionText: { fontSize: 14, color: "#444", marginBottom: 16, lineHeight: 20 },
  footer: { flexDirection: "row", gap: 16, paddingTop: 12, borderTopWidth: 1, borderColor: "#F0F0F0" },
  statText: { fontSize: 14, fontWeight: "600", color: "#444" },
});