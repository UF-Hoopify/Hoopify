import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [incomingIds, setIncomingIds] = useState<string[]>([]);
  const [outgoingIds, setOutgoingIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    let friendsA: any[] = [];
    let friendsB: any[] = [];

    const hydrate = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        const users = userSnapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.id !== currentUserId);

        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const updateRelationshipState = () => {
      const merged = [...friendsA, ...friendsB];
      const accepted: string[] = [];
      const incoming: string[] = [];
      const outgoing: string[] = [];

      for (const docSnap of merged) {
        const data = docSnap.data();
        const otherUserId =
          data.user1Id === currentUserId ? data.user2Id : data.user1Id;

        if (data.status === "accepted") {
          accepted.push(otherUserId);
        } else if (data.status === "pending") {
          if (data.requesterId === currentUserId) {
            outgoing.push(otherUserId);
          } else {
            incoming.push(otherUserId);
          }
        }
      }

      setAcceptedIds(accepted);
      setIncomingIds(incoming);
      setOutgoingIds(outgoing);
      setLoading(false);
    };

    const q1 = query(
      collection(db, "friends"),
      where("user1Id", "==", currentUserId)
    );

    const q2 = query(
      collection(db, "friends"),
      where("user2Id", "==", currentUserId)
    );

    const unsub1 = onSnapshot(q1, (snapshot) => {
      friendsA = snapshot.docs;
      updateRelationshipState();
    });

    const unsub2 = onSnapshot(q2, (snapshot) => {
      friendsB = snapshot.docs;
      updateRelationshipState();
    });

    hydrate();

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  const incomingUsers = filteredUsers.filter((u) => incomingIds.includes(u.id));
  const friends = filteredUsers.filter((u) => acceptedIds.includes(u.id));
  const requestedUsers = filteredUsers.filter((u) => outgoingIds.includes(u.id));
  const others = filteredUsers.filter(
    (u) =>
      !acceptedIds.includes(u.id) &&
      !incomingIds.includes(u.id) &&
      !outgoingIds.includes(u.id)
  );

  const sections = [
    {
      title: "Requests",
      data: incomingUsers.length ? incomingUsers : [{ id: "empty-requests" }],
    },
    {
      title: "My Friends",
      data: friends.length ? friends : [{ id: "empty-friends" }],
    },
    {
      title: "Requested",
      data: requestedUsers.length ? requestedUsers : [{ id: "empty-requested" }],
    },
    {
      title: "Add Friends",
      data: others,
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
        <View style={{ width: 24 }} />
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
          renderItem={({ item, section }) => {
            if (item.id === "empty-requests") {
              return (
                <View style={styles.emptySpacer}>
                  <Text style={styles.emptyText}>No incoming requests.</Text>
                </View>
              );
            }

            if (item.id === "empty-friends") {
              return (
                <View style={styles.emptySpacer}>
                  <Text style={styles.emptyText}>No friends yet.</Text>
                </View>
              );
            }

            if (item.id === "empty-requested") {
              return (
                <View style={styles.emptySpacer}>
                  <Text style={styles.emptyText}>No outgoing requests.</Text>
                </View>
              );
            }

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
    backgroundColor: "#2A1608",
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