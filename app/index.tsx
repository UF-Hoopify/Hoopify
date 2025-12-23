import { StyleSheet, Text, View } from "react-native";
import { db } from "../firebaseConfig"; // Import the DB connection

export default function Index() {
  // Quick check: Is the DB object existing?
  const connectionStatus = db
    ? "Connected to Firestore ✅"
    : "Connection Failed ❌";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HoopMap</Text>
      <Text style={styles.subtitle}>Bowjeet is Active</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{connectionStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Dark mode background
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 18,
    color: "#aaaaaa",
    marginBottom: 20,
  },
  statusBox: {
    padding: 15,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  statusText: {
    color: "#4CAF50", // Green text
    fontWeight: "600",
  },
});
