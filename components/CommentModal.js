// components/CommentModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

export default function CommentModal({
  visible,
  onClose,
  commentText,
  setCommentText,
  comments,
  usersMap,
  getTextAlign,
  handleAddComment,
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="הוסף תגובה..."
            value={commentText}
            onChangeText={setCommentText}
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
            <Text style={styles.sendText}>שלח</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const commenter =
              usersMap[String(item.userId?._id || item.userId)] || {};
            return (
              <View style={styles.commentRow}>
                <View style={styles.commentHeader}>
                  <Image
                    source={
                      commenter.profileImage
                        ? { uri: commenter.profileImage }
                        : require("../assets/defualt_profil.jpg")
                    }
                    style={styles.commenterImage}
                  />
                  <Text style={styles.commenterName}>
                    {commenter.userName || "משתמש"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.commentText,
                    {
                      textAlign: getTextAlign(item.text),
                      writingDirection:
                        getTextAlign(item.text) === "right" ? "rtl" : "ltr",
                      alignSelf:
                        getTextAlign(item.text) === "right"
                          ? "flex-end"
                          : "flex-start",
                    },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  sendBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendText: {
    color: "#8E2DE2",
    fontWeight: "bold",
  },
  commentRow: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  commentHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  commenterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  commenterName: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 15,
  },
});
