import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../config/firebaseConfig";
import { searchNearbyCourts } from "../services/GooglePlacesService";

export default function CreatePostScreen({ navigation }: any) {
  const [myScore, setMyScore] = useState("");
  const [oppScore, setOppScore] = useState("");
  const [description, setDescription] = useState("");
  const [taggedFriend, setTaggedFriend] = useState("");
  const [currentUserName, setCurrentUserName] = useState("Baller");
  const [courtQuery, setCourtQuery] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TODO: switch to location of user
  const GNV_REGION = {
    latitude: 29.6499,
    longitude: -82.3558,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.displayName) setCurrentUserName(userData.displayName);
          }
        } catch (err) {
          console.log("Error fetching name:", err);
        }
      }
    };
    fetchUserName();
  }, []);

  const executeCourtSearch = useCallback(async (text: string) => {
    setIsSearching(true);
    try {
      const results = await searchNearbyCourts(GNV_REGION, text);
      setSearchResults(results);
    } catch (error) {
      console.error("Court search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchCourt = (text: string) => {
    setCourtQuery(text);

    if (selectedCourt && text !== selectedCourt.name) setSelectedCourt(null);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (text.length > 2) {
      debounceTimer.current = setTimeout(() => {
        executeCourtSearch(text);
      }, 400);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCourt = (court: any) => {
    setSelectedCourt(court);
    setCourtQuery(court.name);
    setSearchResults([]);
  };

  const handlePost = async () => {
    const finalCourtName = selectedCourt ? selectedCourt.name : courtQuery;
    const finalCourtAddress = selectedCourt
      ? selectedCourt.address
      : "Custom Location";

    if (!myScore || !oppScore || !finalCourtName) {
      Alert.alert("Missing Info", "Please enter scores and a location.");
      return;
    }

    setIsPosting(true);
    try {
      // 1. Create the post
      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser?.uid,
        userName: currentUserName,
        courtName: finalCourtName,
        courtLocation: finalCourtAddress,
        myScore: myScore,
        opponentScore: oppScore,
        description: description,
        taggedFriends: taggedFriend.trim() ? [taggedFriend] : [],
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
      });

      // 2. INCREMENT GAMES PLAYED FOR USER
      if (auth.currentUser?.uid) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          "stats.gamesPlayed": increment(1),
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not post game.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={isPosting}>
          {isPosting ? (
            <ActivityIndicator color="#F97316" />
          ) : (
            <Text style={styles.postText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.brandTitle}>Hoopify</Text>
          <Text style={{ color: "#A0A0A0", marginBottom: 20 }}>
            Posting as:{" "}
            <Text style={{ fontWeight: "bold", color: "#FFFFFF" }}>
              {currentUserName}
            </Text>
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Game Location</Text>
            <View style={styles.searchContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#A0A0A0"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Where did you play?"
                placeholderTextColor="#A0A0A0"
                value={courtQuery}
                onChangeText={handleSearchCourt}
              />
              {isSearching && (
                <ActivityIndicator size="small" color="#F97316" />
              )}
            </View>
            {searchResults.length > 0 && (
              <View style={styles.dropdown}>
                {searchResults.map((court) => (
                  <TouchableOpacity
                    key={court.id}
                    style={styles.dropdownItem}
                    onPress={() => handleSelectCourt(court)}
                  >
                    <Text style={styles.dropdownText}>{court.name}</Text>
                    <Text style={styles.dropdownSubtext}>{court.address}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Your Score</Text>
              <TextInput
                style={styles.scoreInput}
                placeholder="0"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                value={myScore}
                onChangeText={setMyScore}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Opponent Score</Text>
              <TextInput
                style={styles.scoreInput}
                placeholder="0"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                value={oppScore}
                onChangeText={setOppScore}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tag Friends (Optional)</Text>
            <View style={styles.tagInputContainer}>
              <Ionicons
                name="person-add-outline"
                size={20}
                color="#A0A0A0"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Who did you play with?"
                placeholderTextColor="#A0A0A0"
                value={taggedFriend}
                onChangeText={setTaggedFriend}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Game Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What a game! We pulled off a tight win..."
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#2A2A2A",
  },
  cancelText: { fontSize: 16, color: "#A0A0A0" },
  postText: { fontSize: 16, color: "#F97316", fontWeight: "bold" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
  content: { padding: 20 },
  brandTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#F97316",
    marginBottom: 5,
  },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#A0A0A0", marginBottom: 8 },
  input: { fontSize: 16, color: "#FFFFFF", flex: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  dropdown: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#333333",
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderColor: "#333333" },
  dropdownText: { fontWeight: "bold", color: "#FFFFFF" },
  dropdownSubtext: { fontSize: 12, color: "#A0A0A0" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfInput: { width: "48%" },
  scoreInput: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
  },
  textArea: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
  },
});
