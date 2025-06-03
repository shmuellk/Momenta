// PostsScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CreatePostScreen from "../components/CreatePostScreen";
export default function PostsScreen() {
  return (
    <View style={styles.center}>
      <CreatePostScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
