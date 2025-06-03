// PostsScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import CreatePostScreen from "../components/CreatePostScreen";

export default function PostsScreen({ navigation, route }) {
  console.log("====================================");
  console.log(JSON.stringify(route.params));
  console.log("====================================");
  return (
    <View style={styles.center}>
      {/* forward both navigation and route to CreatePostScreen */}
      <CreatePostScreen navigation={navigation} route={route} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
