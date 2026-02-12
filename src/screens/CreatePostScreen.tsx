import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, ActivityIndicator, Alert, SafeAreaView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore"; // Added doc, getDoc
import { db, auth } from "../config/firebaseConfig";
import { searchNearbyCourts } from "../services/GooglePlacesService";

export default function CreatePostScreen({ navigation }: any) {
  // Form State
  const [myScore, setMyScore] = useState("");
  const [oppScore, setOppScore] = useState("");
  const [description, setDescription] = useState("");
  const [taggedFriend, setTaggedFriend] = useState(""); 
  
  // User State
  const [currentUserName, setCurrentUserName] = useState("Baller"); // Default

  // Court Search State
  const [courtQuery, setCourtQuery] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const GNV_REGION = {
    latitude: 29.6499,
    longitude: -82.3558,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // --- NEW: Fetch Real Name from Database on Load ---
  useEffect(() => {
    const fetchUserName = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // If they have a name in DB, use it. Otherwise fallback to Auth name.
            if (userData.displayName) {
              setCurrentUserName(userData.displayName);
            }
          }
        } catch (err) {
          console.log("Error fetching name:", err);
        }
      }
    };
    fetchUserName();
  }, []);

  const handleSearchCourt = async (text: string) => {
    setCourtQuery(text);
    if (selectedCourt && text !== selectedCourt.name) {
      setSelectedCourt(null);
    }

    if (text.length > 2) {
      setIsSearching(true);
      const results = await searchNearbyCourts(GNV_REGION, text);
      setSearchResults(results);
      setIsSearching(false);
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
    const finalCourtAddress = selectedCourt ? selectedCourt.address : "Custom Location";

    if (!myScore || !oppScore || !finalCourtName) {
      Alert.alert("Missing Info", "Please enter scores and a location.");
      return;
    }

    setIsPosting(true);
    try {
      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser?.uid,
        userName: currentUserName, // <--- USING THE FETCHED NAME NOW
        courtName: finalCourtName,
        courtLocation: finalCourtAddress,
        myScore: myScore,
        opponentScore: oppScore,
        description: description,
        taggedFriends: taggedFriend.trim() ? [taggedFriend] : [],
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0
      });

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={isPosting}>
          {isPosting ? <ActivityIndicator color="#F97316" /> : <Text style={styles.postText}>Post</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.brandTitle}>HoopLink</Text>
        <Text style={{color: '#666', marginBottom: 20}}>
          Posting as: <Text style={{fontWeight: 'bold', color: '#000'}}>{currentUserName}</Text>
        </Text>
        
        {/* Court Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Game Location</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={{marginRight: 8}}/>
            <TextInput
              style={styles.input}
              placeholder="Where did you play?"
              value={courtQuery}
              onChangeText={handleSearchCourt}
            />
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

        {/* Scores */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Your Score</Text>
            <TextInput 
              style={styles.scoreInput} 
              placeholder="0" 
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
              keyboardType="numeric"
              value={oppScore}
              onChangeText={setOppScore}
            />
          </View>
        </View>

        {/* Tag Friends */}
        <View style={styles.section}>
          <Text style={styles.label}>Tag Friends (Optional)</Text>
          <View style={styles.tagInputContainer}>
            <Ionicons name="person-add-outline" size={20} color="#666" style={{marginRight: 8}}/>
            <TextInput
              style={styles.input}
              placeholder="Who did you play with?"
              value={taggedFriend}
              onChangeText={setTaggedFriend}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Game Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What a game! We pulled off a tight win..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#F0F0F0"
  },
  cancelText: { fontSize: 16, color: "#666" },
  postText: { fontSize: 16, color: "#F97316", fontWeight: "bold" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  brandTitle: { fontSize: 24, fontWeight: "900", color: "#F97316", marginBottom: 5 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: { fontSize: 16, color: "#000", flex: 1 },
  searchContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5",
    padding: 12, borderRadius: 8
  },
  tagInputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5",
    padding: 12, borderRadius: 8
  },
  dropdown: {
    backgroundColor: "#FFF", borderRadius: 8, marginTop: 4,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 4
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderColor: "#EEE" },
  dropdownText: { fontWeight: "bold" },
  dropdownSubtext: { fontSize: 12, color: "#666" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  halfInput: { width: "48%" },
  scoreInput: {
    backgroundColor: "#F5F5F5", borderRadius: 8, padding: 16, fontSize: 24,
    fontWeight: "bold", textAlign: "center"
  },
  textArea: {
    backgroundColor: "#F5F5F5", borderRadius: 8, padding: 12, height: 100, textAlignVertical: "top"
  }
});