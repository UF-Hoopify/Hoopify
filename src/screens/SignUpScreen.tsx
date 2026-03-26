import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; 

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState("");      // <--- NEW: Full Name
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validate all fields including Name
    if (!name || !username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Create Firestore Document
      // We map "Name" to displayName so it shows on the Profile Page
      // We save "Username" as a separate field for search/tagging later
      await setDoc(doc(db, "users", uid), {
        displayName: name,        // Real Name (e.g. Vedant Karalkar)
        username: username,       // Handle (e.g. @HooperVedant)
        email: email,
        location: "Gainesville, FL", // Defaulting to GNV for now
        photoURL: "https://i.pravatar.cc/300", 
        friendsList: [],
        stats: {
          friends: 0,
          following: 0,
          level: "Rookie",
          gamesPlayed: 0
        },
        createdAt: new Date()
      });

      // 3. Go to Main App
      navigation.replace("MainTabs");
      
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.inputContainer}>
        {/* NEW INPUT: FULL NAME */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="LeBron James" 
          value={name} 
          onChangeText={setName} 
        />

        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          placeholder="KingJames23" 
          value={username} 
          onChangeText={setUsername} 
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="baller@example.com" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="••••••••" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? <Text style={{fontWeight: 'bold'}}>Log In</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFF" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#000" },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: "#666", marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#F5F5F5", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: "#F97316", padding: 18, borderRadius: 30, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  linkText: { textAlign: "center", color: "#666", marginTop: 10 }
});