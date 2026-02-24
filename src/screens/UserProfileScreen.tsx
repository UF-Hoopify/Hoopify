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

import { SafeAreaView } from "react-native-safe-area-context";
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
      if (isMounted.current) setIsLoading(false);
    }
  }, [TARGET_USER_ID, isViewingSelf, currentAuthId]);

  useEffect(() => {
    isMounted.current = true;
    fetchUserProfile();
    return () => {
      isMounted.current = false;
    };
  }, [fetchUserProfile]);

  const handleMessagePress = () => {
    if (!user) return;
    // @ts-ignore
    navigation.navigate("ChatScreen", {
      recipientId: user.id,
      recipientName: user.displayName,
    });
  };

  // --- ACTION HANDLERS ---
  const handleAddFriend = async () => {
    if (!currentAuthId || !TARGET_USER_ID) return;
    setAddingFriend(true);

    try {
      // 1. Add them to YOUR friends list
      await updateDoc(doc(db, "users", currentAuthId), {
        friendsList: arrayUnion(TARGET_USER_ID),
        "stats.friends": increment(1),
      });

      // ⚠️ CRITICAL ISSUE STILL PRESENT:
      // If Firestore Rules are locked down securely, this line will throw a permission denied error.
      // You cannot write to another user's document directly.
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
      console.error(error);
      Alert.alert(
        "Error",
        "Could not add friend. (Check Firestore Security Rules)",
      );
    } finally {
      setAddingFriend(false);
    }
  };

  // --- UI RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#F97316" />
        </View>
      )}

      {user && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.name}>{user.displayName}</Text>
            {user.username && (
              <Text style={styles.username}>@{user.username}</Text>
            )}
            <Text style={styles.location}>{user.location}</Text>
          </View>

          {/* ACTION BUTTONS */}
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

          {/* STATS SECTION */}
          <View style={styles.statsContainer}>
            {/* TODO: Link to an actual friends list instead of the global AddFriends component */}
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

          {/* ADDITIONAL INFO */}
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
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { paddingVertical: 20, alignItems: "center" },
  loadingOverlay: {
    position: "absolute",
    top: 60,
    left: "50%",
    transform: [{ translateX: -50 }],
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 16,
    borderRadius: 20,
  },
  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  name: { fontSize: 32, fontWeight: "bold", color: "#FFFFFF" },
  username: { color: "#A0A0A0", fontSize: 16, marginTop: 4 },
  location: { fontSize: 16, color: "#A0A0A0", marginTop: 4 },
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
    backgroundColor: "transparent",
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
    borderColor: "#2A2A2A",
    marginBottom: 20,
  },
  statBox: { alignItems: "center", flex: 1 },
  statDivider: { width: 1, backgroundColor: "#2A2A2A", height: "80%" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  statLabel: { fontSize: 13, color: "#A0A0A0", marginTop: 2 },
  infoSection: {
    width: "85%",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 15,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 16, color: "#A0A0A0" },
  infoValue: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
});
