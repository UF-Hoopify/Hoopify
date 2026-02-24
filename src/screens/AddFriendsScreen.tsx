import { Ionicons } from "@expo/vector-icons";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../config/firebaseConfig";

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
        const myFriendsIds = myDoc.exists()
          ? myDoc.data().friendsList || []
          : [];

        // 2. Get all users
        const querySnapshot = await getDocs(collection(db, "users"));
        const allUsers = querySnapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.id !== currentUserId); // Exclude myself

        // 3. Split them up
        const friendsList = allUsers.filter((u) => myFriendsIds.includes(u.id));
        const othersList = allUsers.filter((u) => !myFriendsIds.includes(u.id));

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
  const filteredFriends = friends.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredOthers = others.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Setup the two sections
  const sections = [
    {
      title: "My Friends",
      data:
        filteredFriends.length > 0
          ? filteredFriends
          : [{ id: "empty-friends" }],
    },
    {
      title: "Add Friends",
      data: filteredOthers,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Hoopers</Text>
        <View style={{ width: 24 }}></View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#A0A0A0"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username..."
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#F97316"
          style={{ marginTop: 20 }}
        />
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
            if (item.id === "empty-friends") {
              return (
                <View style={styles.emptySpacer}>
                  <Text style={styles.emptyText}>
                    No friends currently, add some below!
                  </Text>
                </View>
              );
            }

            // Normal User Row
            return (
              <TouchableOpacity
                style={styles.userRow}
                onPress={() =>
                  navigation.navigate("UserProfile", { userId: item.id })
                }
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {item.displayName
                      ? item.displayName.charAt(0).toUpperCase()
                      : "?"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.userName}>{item.displayName}</Text>
                  <Text style={styles.userHandle}>
                    @{item.username || "hooper"}
                  </Text>
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
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  searchInput: { flex: 1, fontSize: 16, color: "#FFFFFF" },
  sectionHeader: {
    backgroundColor: "#121212",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#2A2A2A",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#A0A0A0",
    textTransform: "uppercase",
    fontSize: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#1E1E1E",
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
    backgroundColor: "#2A1608", // Darkened the orange background slightly so it doesn't blind the user in dark mode
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F97316",
  },
  avatarText: { color: "#F97316", fontWeight: "bold", fontSize: 18 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#FFFFFF" },
  userHandle: { fontSize: 14, color: "#A0A0A0", marginTop: 2 },
  emptySpacer: { padding: 30, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#666666", fontSize: 14, fontStyle: "italic" },
});
