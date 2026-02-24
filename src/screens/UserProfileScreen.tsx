import { useNavigation, useRoute } from "@react-navigation/native";
import {
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../config/firebaseConfig";

interface UserProfile {
  id: string;
  displayName: string;
  username?: string;
  location: string;
  stats: {
    friends: number;
    following: number;
    level: string;
    gamesPlayed: number;
  };
}

export default function UserProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const isMounted = useRef(true);
  const navigation = useNavigation();
  const route = useRoute();

  const currentAuthId = auth.currentUser?.uid;
  const paramId = (route.params as any)?.userId;

  const TARGET_USER_ID = paramId || currentAuthId;
  const isViewingSelf = currentAuthId === TARGET_USER_ID;

  const fetchUserProfile = useCallback(async () => {
    if (!TARGET_USER_ID) return;
    setIsLoading(true);

    try {
      const userDoc = await getDoc(doc(db, "users", TARGET_USER_ID));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        const trueFriendsCount = userData.friendsList
          ? userData.friendsList.length
          : 0;
        const gamesQuery = query(
          collection(db, "posts"),
          where("userId", "==", TARGET_USER_ID),
        );
        const countSnapshot = await getCountFromServer(gamesQuery);
        const trueGamesCount = countSnapshot.data().count;

        setUser({
          id: userDoc.id,
          ...userData,
          stats: {
            ...userData.stats,
            friends: trueFriendsCount,
            gamesPlayed: trueGamesCount,
          },
        } as UserProfile);
      }

      if (!isViewingSelf && currentAuthId) {
        const myDoc = await getDoc(doc(db, "users", currentAuthId));
        if (myDoc.exists()) {
          const myFriends = myDoc.data().friendsList || [];
          setIsFriend(myFriends.includes(TARGET_USER_ID));
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      // Only turn off the loading spinner if the user is still on this screen
      if (isMounted.current) setIsLoading(false);
    }
  }, [TARGET_USER_ID, isViewingSelf, currentAuthId]);

  // Trigger the fetch when the screen loads or when the target ID changes
  useEffect(() => {
    isMounted.current = true;
    fetchUserProfile();
    return () => {
      isMounted.current = false;
    };
  }, [fetchUserProfile]);

  // Navigate to the Chat screen, passing along the recipient's name and ID
  const handleMessagePress = () => {
    if (!user) return;
    // @ts-ignore
    navigation.navigate("ChatScreen", {
      recipientId: user.id,
      recipientName: user.displayName,
    });
  };

  const handleAddFriend = async () => {
    if (!currentAuthId || !TARGET_USER_ID) return;
    setAddingFriend(true);

    try {
      await updateDoc(doc(db, "users", currentAuthId), {
        friendsList: arrayUnion(TARGET_USER_ID),
        "stats.friends": increment(1),
      });

      // TODO: add "friend request" feature instead of adding on both documents
      // You are trying to force an update on someone ELSE's profile document.
      // Your Firestore Security Rule `allow update: if request.auth.uid == userId`
      // explicitly blocks you from modifying data that isn't yours.
      // (To fix this properly later, you need a "friend requests" subcollection
      // or a Firebase Cloud Function to handle two-way friendship creation).
      await updateDoc(doc(db, "users", TARGET_USER_ID), {
        friendsList: arrayUnion(currentAuthId),
        "stats.friends": increment(1),
      });

      setIsFriend(true);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              stats: { ...prev.stats, friends: (prev.stats?.friends || 0) + 1 },
            }
          : null,
      );

      Alert.alert("Success", `You are now friends with ${user?.displayName}!`);
    } catch (error) {
      console.error(error); // Logging the error helps debugging!
      Alert.alert(
        "Error",
        "Could not add friend. (Check Firestore Security Rules)",
      );
    } finally {
      setAddingFriend(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#F97316" />
        </View>
      )}

      {user && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.name}>{user.displayName}</Text>
            {user.username && (
              <Text style={{ color: "#888", fontSize: 16 }}>
                @{user.username}
              </Text>
            )}
            <Text style={styles.location}>{user.location}</Text>
          </View>

          {!isViewingSelf && (
            <View style={styles.actionRow}>
              {!isFriend && (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleAddFriend}
                  disabled={addingFriend}
                >
                  {addingFriend ? (
                    <ActivityIndicator color="#F97316" />
                  ) : (
                    <Text style={styles.secondaryBtnText}>Add Friend</Text>
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.primaryBtn, isFriend && { flex: 1 }]}
                onPress={handleMessagePress}
              >
                <Text style={styles.primaryBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statBox}
              onPress={() => (navigation as any).navigate("AddFriends")}
            >
              <Text style={styles.statNumber}>{user.stats?.friends || 0}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.statBox}
              onPress={() =>
                (navigation as any).navigate("UserGames", { userId: user.id })
              }
            >
              <Text style={styles.statNumber}>
                {user.stats?.gamesPlayed || 0}
              </Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Basketball Level</Text>
              <Text style={styles.infoValue}>
                {user.stats?.level || "Rookie"}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingVertical: 20, alignItems: "center" },
  loadingOverlay: {
    position: "absolute",
    top: 60,
    left: "50%",
    transform: [{ translateX: -50 }],
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 20,
  },
  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  name: { fontSize: 32, fontWeight: "bold", color: "#000" },
  location: { fontSize: 16, color: "#666", marginTop: 4 },
  actionRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "#FFF4E6",
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F97316",
  },
  secondaryBtnText: { color: "#F97316", fontWeight: "bold", fontSize: 16 },
  statsContainer: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
  },
  statBox: { alignItems: "center", flex: 1 },
  statDivider: { width: 1, backgroundColor: "#DDD", height: "80%" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#333" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 2 },
  infoSection: {
    width: "85%",
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    padding: 15,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 16, color: "#555" },
  infoValue: { fontSize: 16, fontWeight: "600", color: "#000" },
});
