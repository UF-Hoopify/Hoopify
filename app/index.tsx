import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// --- SCREENS ---
import ChatScreen from "../src/screens/ChatScreen";
import CourtSearchScreen from "../src/screens/CourtSearchScreen";
import LandingScreen from "../src/screens/LandingScreen";
import LoginScreen from "../src/screens/LoginScreen";
import SignUpScreen from "../src/screens/SignUpScreen";
import UserProfileScreen from "../src/screens/UserProfileScreen";
// 1. IMPORT THE NEW SCREEN
import { CourtServerScreen } from "../src/screens/CourtServerScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. THE MAIN APP TABS (Profile + Explore + CourtServer) ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#F97316", // Hoopify Orange
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#121212", // Dark tab bar to match your dark mode UI
          borderTopColor: "#333",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "CourtServer") {
            // 2. ADD ICON LOGIC
            iconName = focused ? "basketball" : "basketball-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile" component={UserProfileScreen} />
      <Tab.Screen name="Explore" component={CourtSearchScreen} />
      {/* 3. ADD THE TAB */}
      <Tab.Screen
        name="CourtServer"
        component={CourtServerScreen}
        options={{ title: "Court Preview" }} // Optional: Rename label if needed
      />
    </Tab.Navigator>
  );
}

// --- 2. THE DEV MENU (Cleaned Up) ---
function DevMenu({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏀 Hoopify Dev Mode</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.sectionLabel}>Shortcuts</Text>
        <Button
          title="⬅️ Back to Landing Page"
          onPress={() => navigation.navigate("Landing")}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Direct Access</Text>
        <Button
          title="📍 Open Map (Explore Tab)"
          onPress={() => navigation.navigate("MainTabs", { screen: "Explore" })}
        />
        <View style={{ height: 10 }} />
        <Button
          title="👤 Open Profile (Profile Tab)"
          onPress={() => navigation.navigate("MainTabs", { screen: "Profile" })}
        />
        <View style={{ height: 10 }} />
        <Button
          title="🏟 Open Court Server (Preview)"
          onPress={() =>
            navigation.navigate("MainTabs", { screen: "CourtServer" })
          }
        />
      </View>
    </View>
  );
}

// --- 3. ROOT NAVIGATION ---
export default function Index() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{ headerShown: false }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: true, title: "" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: true, title: "" }}
          />

          {/* Main App (Tabs) */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Standalone Screens */}
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
              headerShown: true,
              title: "Chat",
              headerTintColor: "#F97316",
            }}
          />

          {/* Dev Menu */}
          <Stack.Screen name="DevMenu" component={DevMenu} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  buttonContainer: { width: "80%" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  sectionLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
