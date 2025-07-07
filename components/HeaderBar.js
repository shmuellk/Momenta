// components/HeaderBar.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function HeaderBar({ profileImage, userName, onPlusPress }) {
  return (
    <View style={styles.header}>
      <Image source={profileImage} style={styles.profileImage} />
      <Text style={styles.welcomeText}>ברוך הבא {userName}</Text>
      <TouchableOpacity style={styles.plusButton} onPress={onPlusPress}>
        <AntDesign name="pluscircle" size={30} color="#8E2DE2" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#8E2DE2",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  plusButton: { padding: 5 },
});
