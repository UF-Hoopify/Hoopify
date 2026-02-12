import React, { useEffect, useState } from "react";
import { 
  View, StyleSheet, FlatList, TouchableOpacity, Text, SafeAreaView, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import PostCard, { PostData } from "../components/CourtSearch/Feed/PostCard";

export default function FeedScreen({ navigation }: any) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time updates
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PostData[];
      
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HoopLink Feed</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderColor: "#EEE"
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#F97316" },
  listContent: { padding: 16, paddingBottom: 100 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  fab: {
    position: "absolute", bottom: 30, right: 30,
    backgroundColor: "#F97316", width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#F97316", shadowOpacity: 0.4, shadowRadius: 10, elevation: 8
  }
});