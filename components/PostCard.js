// components/PostCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function PostCard({
  post,
  isLiked,
  uploader,
  getTextAlign,
  handleLike,
  onCommentPress,
}) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={
            uploader.profileImage
              ? { uri: uploader.profileImage }
              : require("../assets/defualt_profil.jpg")
          }
          style={styles.uploaderImage}
        />
        <Text style={styles.uploaderName}>{uploader.userName || "משתמש"}</Text>
      </View>

      <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

      <Text
        style={[
          styles.postText,
          {
            textAlign: getTextAlign(post.text),
            writingDirection:
              getTextAlign(post.text) === "right" ? "rtl" : "ltr",
            alignSelf:
              getTextAlign(post.text) === "right" ? "flex-end" : "flex-start",
          },
        ]}
      >
        {post.text}
      </Text>

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post._id)}
        >
          <FontAwesome
            name={isLiked ? "thumbs-up" : "thumbs-o-up"}
            size={24}
            color={isLiked ? "#8E2DE2" : "#999"}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onCommentPress(post._id)}
        >
          <FontAwesome name="comment-o" size={24} color="#8E2DE2" />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  uploaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8E2DE2",
    marginLeft: 10,
  },
  uploaderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postText: {
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  postActions: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  actionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  actionText: {
    marginHorizontal: 6,
    fontSize: 16,
    color: "#8E2DE2",
  },
});
