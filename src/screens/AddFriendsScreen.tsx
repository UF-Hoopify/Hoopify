import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, ActivityIndicator, SectionList 
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function AddFriendsScreen({ navigation }: any) {
  const [friends, setFriends] = useState<any[]>([]);
  const [others, setOthers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return;

        // 1. Get my friends list IDs
        const myDoc = await getDoc(doc(db, "users", currentUserId));
        const myFriendsIds = myDoc.exists() ? (myDoc.data().friendsList || []) : [];

        // 2. Get all users
        const querySnapshot = await getDocs(collection(db, "users"));
        const allUsers = querySnapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.id !== currentUserId); // Exclude myself

        // 3. Split them up
        const friendsList = allUsers.filter(u => myFriendsIds.includes(u.id));
        const othersList = allUsers.filter(u => !myFriendsIds.includes(u.id));

        setFriends(friendsList);
        setOthers(othersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter based on search bar
  const filteredFriends = friends.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredOthers = others.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Setup the two sections
  const sections = [
    { 
      title: "My Friends", 
      data: filteredFriends.length > 0 ? filteredFriends : [{ id: 'empty-friends' }] 
    },
    { 
      title: "Add Friends", 
      data: filteredOthers 
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Hoopers</Text>
        <View style={{ width: 24 }}></View> 
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 20 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => {
            // Empty State Handling
            if (item.id === 'empty-friends') {
              return (
                <View style={styles.emptySpacer}>
                  <Text style={styles.emptyText}>No friends currently, add some below!</Text>
                </View>
              );
            }

            // Normal User Row (NO IMAGES)
            return (
              <TouchableOpacity 
                style={styles.userRow}
                onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {item.displayName ? item.displayName.charAt(0).toUpperCase() : "?"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.userName}>{item.displayName}</Text>
                  <Text style={styles.userHandle}>@{item.username || "hooper"}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", marginHorizontal: 16, marginBottom: 16, padding: 12, borderRadius: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  sectionHeader: { backgroundColor: "#F8F9FA", paddingVertical: 8, paddingHorizontal: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EEE" },
  sectionTitle: { fontWeight: "bold", color: "#666", textTransform: "uppercase", fontSize: 12 },
  userRow: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: "#F9F9F9" },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, marginRight: 16, backgroundColor: "#FFF4E6", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#F97316" },
  avatarText: { color: "#F97316", fontWeight: "bold", fontSize: 18 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  userHandle: { fontSize: 14, color: "#888", marginTop: 2 },
  emptySpacer: { padding: 30, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#999", fontSize: 14, fontStyle: "italic" }
});