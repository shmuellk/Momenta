// components/ProfileHeader.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProfileHeader({ profileImage, userName, pickImage }) {
  return (
    <View style={styles.profileSection}>
      <View style={styles.profileImageWrapper}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/defualt_profil.jpg")
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{userName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: "relative",
    width: 120,
    height: 120,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#8E2DE2",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8E2DE2",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
