import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// --- SCREENS ---
import LandingScreen from "../src/screens/LandingScreen";
import SignUpScreen from "../src/screens/SignUpScreen";
import LoginScreen from "../src/screens/LoginScreen";
import CourtSearchScreen from "../src/screens/CourtSearchScreen";
import UserProfileScreen from "../src/screens/UserProfileScreen";
import ChatScreen from "../src/screens/ChatScreen";
import FeedScreen from "../src/screens/FeedScreen";         // <--- NEW
import CreatePostScreen from "../src/screens/CreatePostScreen"; // <--- NEW

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- THE MAIN APP TABS ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 5, paddingTop: 5 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Feed") {
            iconName = focused ? "basketball" : "basketball-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "map" : "map-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Explore" component={CourtSearchScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

// --- DEV MENU ---
function DevMenu({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏀 Hoopify Dev Mode</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="🚀 Go to App (Feed)" 
          color="#F97316"
          onPress={() => navigation.navigate('MainTabs')} 
        />
        <View style={styles.divider} />
        <Button 
          title="⬅️ Back to Landing Page" 
          onPress={() => navigation.navigate('Landing')} 
        />
      </View>
    </View>
  );
}

// --- ROOT NAVIGATION ---
export default function Index() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
          
          {/* Auth Flow */}
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true, title: '' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: '' }} />

          {/* Main App (Tabs) */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Standalone Screens */}
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: true, title: 'Chat' }} />
          
          {/* Create Post (Modal Style) */}
          <Stack.Screen 
            name="CreatePost" 
            component={CreatePostScreen} 
            options={{ presentation: 'modal', headerShown: false }} 
          />
          
          <Stack.Screen name="DevMenu" component={DevMenu} />

        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  buttonContainer: { width: "80%" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
});