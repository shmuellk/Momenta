import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import PostsScreen from "./PostsScreen";
import ProfileScreen from "./ProfileScreen";
import ChatsScreen from "./ChatsScreen";
import EditProfileScreen from "./EditProfileScreen";
import ChatRoomScreen from "./ChatRoomScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProfileStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
        initialParams={{ userdata: route.params?.userdata }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "עריכת פרופיל" }}
      />
    </Stack.Navigator>
  );
}

function ChatsStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatsMain"
        component={ChatsScreen}
        options={{ headerShown: false }}
        initialParams={{ userdata: route.params?.userdata }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ title: "צ'אט פרטי" }}
      />
    </Stack.Navigator>
  );
}
export default function App({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "POSTS") {
            iconName = "home-outline";
          } else if (route.name === "CHATS") {
            iconName = "chatbubble-outline";
          } else if (route.name === "PROFILE") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7E57C2",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarIconStyle: { marginTop: 4 },
      })}
      initialRouteName="POSTS"
    >
      <Tab.Screen
        name="PROFILE"
        component={ProfileStack}
        initialParams={{ userdata: route.params ?? null }}
      />
      <Tab.Screen
        name="POSTS"
        component={PostsScreen}
        initialParams={{ userdata: route.params ?? null }}
      />
      <Tab.Screen
        name="CHATS"
        component={ChatsStack}
        initialParams={{ userdata: route.params ?? null }}
      />
    </Tab.Navigator>
  );
}
