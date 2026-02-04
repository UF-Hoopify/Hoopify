import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform 
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the Tab Bar
      navigation.replace("MainTabs");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="baller@example.com" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>Dont have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFF" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, color: "#000" },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: "#666", marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#F5F5F5", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: "#F97316", padding: 18, borderRadius: 30, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  linkText: { textAlign: "center", color: "#666", marginTop: 10 }
});