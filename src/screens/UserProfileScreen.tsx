import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

interface UserStats {
  friends: number;
  following: number;
  level: string;
  gamesPlayed: number;
}

interface UserProfile {
  id: string;
  displayName: string;
  location: string;
  photoURL: string;
  stats: UserStats;
}

export default function UserProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMounted = useRef(true);
  const navigation = useNavigation();
  const route = useRoute();

  // Logic: Use param ID if provided, otherwise use current Auth ID
  const currentAuthId = auth.currentUser?.uid;
  const paramId = (route.params as any)?.userId;
  const TARGET_USER_ID = paramId || currentAuthId || "mock_id";

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", TARGET_USER_ID));
      
      if (isMounted.current) {
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() } as UserProfile);
        } else {
          // Fallback MOCK DATA
          setUser({
            id: "mock_id",
            displayName: "Vedant Karalkar",
            location: "Gainesville, FL",
            photoURL: "", // No longer used, but kept for type safety
            stats: {
              friends: 124,
              following: 256,
              level: "Intermediate",
              gamesPlayed: 67
            }
          });
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [TARGET_USER_ID]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleMessagePress = () => {
    if (!user) return;
    // @ts-ignore
    navigation.navigate("ChatScreen", { 
      recipientId: user.id, 
      recipientName: user.displayName 
    });
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#F97316" />
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      )}

      {user && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section (IMAGE REMOVED) */}
          <View style={styles.header}>
            <Text style={styles.name}>{user.displayName}</Text>
            <Text style={styles.location}>{user.location}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Add Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleMessagePress}>
              <Text style={styles.primaryBtnText}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.stats.friends}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Player Details */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Basketball Level</Text>
              <Text style={styles.infoValue}>{user.stats.level}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Games Played</Text>
              <Text style={styles.infoValue}>{user.stats.gamesPlayed}</Text>
            </View>
          </View>

          {/* DEV MODE BUTTON */}
          <TouchableOpacity 
            style={{ marginTop: 40, padding: 10 }} 
            onPress={() => (navigation as any).navigate("DevMenu")}
          >
            <Text style={{ color: "#AAA", fontSize: 12 }}>🔧 Back to Dev Mode</Text>
          </TouchableOpacity>

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loadingText: { color: "#FFF", marginLeft: 8, fontSize: 14, fontWeight: "600" },
  
  // UPDATED HEADER STYLE (Removed Avatar styles)
  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  name: { fontSize: 32, fontWeight: "bold", color: "#000" },
  location: { fontSize: 16, color: "#666", marginTop: 4 },

  actionRow: { 
    flexDirection: "row", width: "85%", justifyContent: "space-between", marginBottom: 25 
  },
  primaryBtn: { 
    backgroundColor: "#F97316", paddingVertical: 12, borderRadius: 25, 
    flex: 0.48, alignItems: "center", elevation: 2 
  },
  primaryBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  secondaryBtn: { 
    backgroundColor: "#FFF4E6", paddingVertical: 12, borderRadius: 25, 
    flex: 0.48, alignItems: "center", borderWidth: 1, borderColor: "#F97316" 
  },
  secondaryBtnText: { color: "#F97316", fontWeight: "bold", fontSize: 16 },
  statsContainer: { 
    flexDirection: "row", width: "85%", justifyContent: "space-around", 
    paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#F0F0F0",
    marginBottom: 20
  },
  statBox: { alignItems: "center", flex: 1 },
  statDivider: { width: 1, backgroundColor: '#DDD', height: '80%' },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#333" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 2 },
  infoSection: { width: "85%", backgroundColor: '#FAFAFA', borderRadius: 15, padding: 15 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  infoLabel: { fontSize: 16, color: "#555" },
  infoValue: { fontSize: 16, fontWeight: "600", color: "#000" }
});