import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface PostData {
  id: string;
  userId: string;
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
  const navigation = useNavigation();

  const handlePressUser = () => {
    // @ts-ignore
    navigation.navigate("UserProfile", { userId: post.userId });
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.header} onPress={handlePressUser}>
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.timeAgo}>Just now</Text>
          </View>
        </TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
      </View>

      <Text style={styles.gameTitle}>Game at {post.courtName}</Text>

      {/* Score Box */}
      <View style={styles.scoreBox}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>You</Text>
          <Text style={[styles.scoreValue, isWin && styles.winText]}>
            {post.myScore}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Opponent</Text>
          <Text style={[styles.scoreValue, !isWin && styles.winText]}>
            {post.opponentScore}
          </Text>
        </View>
      </View>

      {/* Location & Tags */}
      <View style={styles.infoRow}>
        <Ionicons name="location-sharp" size={16} color="#F97316" />
        <Text style={styles.infoText}>
          {post.courtLocation || "Gainesville, FL"}
        </Text>
      </View>

      {post.taggedFriends.length > 0 && (
        <View style={styles.infoRow}>
          <Ionicons name="basketball" size={16} color="#F97316" />
          <Text style={styles.infoText}>
            Played with:{" "}
            <Text style={styles.boldText}>{post.taggedFriends.join(", ")}</Text>
          </Text>
        </View>
      )}

      {post.description ? (
        <Text style={styles.descriptionText}>{post.description}</Text>
      ) : null}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.statItem}>
          <Ionicons name="basketball-outline" size={18} color="#666" />
          <Text style={styles.statText}>{post.likes || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={18} color="#666" />
          <Text style={styles.statText}>{post.comments || 0}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  timeAgo: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 2,
  },
  gameTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    color: "#FFFFFF",
  },
  scoreBox: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreItem: {
    flex: 1,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginBottom: 6,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  winText: {
    color: "#F97316",
    textShadowColor: "rgba(249, 115, 22, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#3A3A3C",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    color: "#AEAEB2",
    fontSize: 14,
  },
  boldText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  descriptionText: {
    fontSize: 14,
    color: "#AEAEB2",
    marginBottom: 16,
    marginTop: 4,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
});
