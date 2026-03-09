import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CourtServerTab } from "../components/CourtServer/CourtServerTab";
import { CourtServerThumbnail } from "../components/CourtServer/CourtServerThumbnail"; // Ensure path is correct
import { useCourtContext } from "../context/CourtContext";

export const CourtServerScreen = () => {
  const navigation = useNavigation<any>();
  const { activeCourt } = useCourtContext();
  if (!activeCourt) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No court selected.</Text>
        <Text style={styles.subText}>
          Go to the Explore tab and select a court to Check In.
        </Text>
        <Button
          title="Go to Map"
          onPress={() => navigation.navigate("MainTabs", { screen: "Explore" })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CourtServerThumbnail
        name={activeCourt.name}
        address={activeCourt.address}
        rating={activeCourt.rating_google}
        totalRatings={activeCourt.total_ratings_google}
        photos={activeCourt.photos}
      />
      <CourtServerTab courtServerId={activeCourt.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
    marginTop: 40,
  },
  placeholderText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  placeholderSubText: {
    color: "#333",
    fontSize: 14,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});
