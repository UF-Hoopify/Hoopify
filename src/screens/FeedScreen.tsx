import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard, { PostData } from "../components/CourtSearch/Feed/PostCard";
import { auth, db } from "../config/firebaseConfig";

export default function FeedScreen({ navigation }: any) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"friends" | "explore">("explore");
  const [myFriends, setMyFriends] = useState<string[]>([]);

  // --- FRIENDS LISTENER ---
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};

    const userRef = doc(db, "users", userId);

    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().friendsList) {
        setMyFriends(docSnap.data().friendsList);
      }
    });

    return () => unsubUser();
  }, []);

  // --- POSTS LISTENER ---
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostData[];

      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- TAB FILTERING ---
  const displayedPosts =
    activeTab === "explore"
      ? posts
      : posts.filter(
          (post) =>
            myFriends.includes(post.userId) ||
            post.userId === auth.currentUser?.uid,
        );

  // --- UI RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hoopify</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddFriends")}>
          <Ionicons name="person-add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* TABS (Explore vs Friends) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.activeTab]}
          onPress={() => setActiveTab("friends")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "explore" && styles.activeTab]}
          onPress={() => setActiveTab("explore")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "explore" && styles.activeTabText,
            ]}
          >
            Explore
          </Text>
        </TouchableOpacity>
      </View>

      {/* FEED CONTENT */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : activeTab === "friends" && displayedPosts.length === 0 ? (
        // EMPTY STATE FOR FRIENDS
        <View style={styles.emptyContainer}>
          <Ionicons name="basketball-outline" size={60} color="#333333" />
          <Text style={styles.emptyTitle}>No Friend Posts</Text>
          <Text style={styles.emptySubtitle}>
            Find hoopers to see their games here!
          </Text>
          <TouchableOpacity
            style={styles.addFriendBtn}
            onPress={() => navigation.navigate("AddFriends")}
          >
            <Text style={styles.addFriendBtnText}>Find Friends</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // POPULATED FEED
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// === CHANGED: Completely overhauled the StyleSheet for the Dark Theme ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" }, // Dark background

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#F97316" },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderColor: "#2A2A2A",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#F97316" },

  tabText: { fontSize: 16, fontWeight: "600", color: "#A0A0A0" },
  activeTabText: { color: "#F97316" },

  listContent: { padding: 16, paddingBottom: 100 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "#FFFFFF",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  addFriendBtn: {
    backgroundColor: "#F97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFriendBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#F97316",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F97316",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
