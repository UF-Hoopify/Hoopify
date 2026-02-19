import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function UserGamesScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, "posts"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        
        // FIX: Added "as any[]" here so TypeScript knows it can have other properties like timestamp
        const fetchedGames = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        
        // Sort newest first
        fetchedGames.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setGames(fetchedGames);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [userId]);

  const renderGame = ({ item }: any) => {
    const isWin = parseInt(item.myScore) > parseInt(item.opponentScore);
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("SinglePost", { post: item })}
      >
        <View style={styles.headerRow}>
          <Text style={styles.courtName}>{item.courtName}</Text>
          <Text style={[styles.resultBadge, isWin ? styles.win : styles.loss]}>
            {isWin ? "W" : "L"}
          </Text>
        </View>
        <Text style={styles.location}><Ionicons name="location-sharp" size={14}/> {item.courtLocation}</Text>
        <Text style={styles.scoreText}>Score: {item.myScore} - {item.opponentScore}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#F97316" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={renderGame}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No games logged yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: { backgroundColor: "#FFF", padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: "#F0F0F0" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  courtName: { fontSize: 16, fontWeight: "bold", color: "#333", flex: 1 },
  resultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: "hidden", fontWeight: "bold", color: "#FFF" },
  win: { backgroundColor: "#4CAF50" },
  loss: { backgroundColor: "#F44336" },
  location: { fontSize: 14, color: "#666", marginBottom: 8 },
  scoreText: { fontSize: 16, fontWeight: "900", color: "#333" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999", fontSize: 16 }
});