// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import PostsScreen from "./PostsScreen";
import ProfileScreen from "./ProfileScreen";
import ChatsScreen from "./ChatsScreen";

const Tab = createBottomTabNavigator();

export default function App({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // icon above the label
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
    >
      <Tab.Screen
        name="PROFILE"
        component={ProfileScreen}
        initialParams={{ userdata: route.params ?? null }}
      />
      <Tab.Screen
        name="POSTS"
        component={PostsScreen}
        initialParams={{ userdata: route.params ?? null }}
      />
      <Tab.Screen
        name="CHATS"
        component={ChatsScreen}
        initialParams={{ userdata: route.params ?? null }}
      />
    </Tab.Navigator>
  );
}
