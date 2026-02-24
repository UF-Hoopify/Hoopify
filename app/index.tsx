import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// --- SCREENS ---
import AddFriendsScreen from "../src/screens/AddFriendsScreen";
import ChatScreen from "../src/screens/ChatScreen";
import CourtSearchScreen from "../src/screens/CourtSearchScreen";
import CreatePostScreen from "../src/screens/CreatePostScreen";
import FeedScreen from "../src/screens/FeedScreen";
import LandingScreen from "../src/screens/LandingScreen";
import LoginScreen from "../src/screens/LoginScreen";
import SignUpScreen from "../src/screens/SignUpScreen";
import SinglePostScreen from "../src/screens/SinglePostScreen";
import UserGamesScreen from "../src/screens/UserGamesScreen";
import UserProfileScreen from "../src/screens/UserProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#888888",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: "#121212",
          borderTopColor: "#2A2A2A",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Feed")
            iconName = focused ? "basketball" : "basketball-outline";
          else if (route.name === "Explore")
            iconName = focused ? "map" : "map-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
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

function DevMenu({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏀 Hoopify Dev Mode</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="🚀 Go to App"
          color="#F97316"
          onPress={() => navigation.navigate("MainTabs")}
        />
        <View style={styles.divider} />
        <Button
          title="⬅️ Back to Landing"
          color="#A0A0A0"
          onPress={() => navigation.navigate("Landing")}
        />
      </View>
    </View>
  );
}

export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { color: "#FFFFFF", fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />

      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: true, title: "", headerTintColor: "#F97316" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true, title: "", headerTintColor: "#F97316" }}
      />

      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: true, title: "Chat" }}
      />
      <Stack.Screen name="AddFriends" component={AddFriendsScreen} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ presentation: "modal" }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerShown: true,
          title: "Player Profile",
        }}
      />

      <Stack.Screen
        name="UserGames"
        component={UserGamesScreen}
        options={{
          headerShown: true,
          title: "Games Played",
        }}
      />
      <Stack.Screen
        name="SinglePost"
        component={SinglePostScreen}
        options={{
          headerShown: true,
          title: "Game Details",
        }}
      />

      <Stack.Screen name="DevMenu" component={DevMenu} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, color: "#FFF" },
  buttonContainer: { width: "80%" },
  divider: { height: 1, backgroundColor: "#2A2A2A", marginVertical: 20 },
});
