import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import postModel from "../models/postModel";
import userModel from "../models/userModel";
import PostCard from "../components/PostCard";
import ProfileHeader from "../components/ProfileHeader";
import CommentModal from "../components/CommentModal";
import ImagePickerModal from "../components/ImagePickerModal";

export default function ProfileScreen({ route, navigation }) {
  // ✅ מקור אמת יחיד
  const [user, setUser] = useState(route.params?.userdata);

  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);

  const [commentPopup, setCommentPopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const flatListRef = useRef();

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await postModel.getPostsByUserId(user._id);
      if (res.ok) {
        setPosts(res.data.posts);
      } else {
        Alert.alert("שגיאה", JSON.stringify(res.error));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?._id) fetchUserPosts();
    }, [user._id])
  );

  useEffect(() => {
    const fetchMissingUsers = async () => {
      const missingIds = [];
      posts.forEach((p) => {
        const id = String(p.userId?._id || p.userId);
        if (!usersMap[id]) missingIds.push(id);
        p.comments?.forEach((c) => {
          const cid = String(c.userId?._id || c.userId);
          if (!usersMap[cid]) missingIds.push(cid);
        });
      });
      const uniqueIds = [...new Set(missingIds)];
      const promises = uniqueIds.map(async (id) => {
        const fetchedUser = await userModel.getUser(id);
        return { id, user: fetchedUser };
      });
      const results = await Promise.all(promises);
      setUsersMap((prev) => {
        const updated = { ...prev };
        results.forEach(({ id, user }) => {
          if (user) updated[id] = user;
        });
        return updated;
      });
    };
    if (posts.length > 0) fetchMissingUsers();
  }, [posts]);

  const handleLike = async (postId) => {
    const res = await postModel.likePost(postId, user._id);
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: res.data.likes, likedBy: res.data.likedBy }
            : p
        )
      );
    } else {
      Alert.alert("שגיאה", JSON.stringify(res.error));
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("שגיאה", "כתוב תגובה קודם!");
      return;
    }
    const res = await postModel.addComment(
      selectedPostId,
      user._id,
      commentText
    );
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === selectedPostId ? { ...p, comments: res.data.comments } : p
        )
      );
      setCommentPopup(false);
      setCommentText("");
    } else {
      Alert.alert("שגיאה", res.error || "שגיאה בהוספת תגובה");
    }
  };

  const getTextAlign = (text) => {
    const hebrewPattern = /[\u0590-\u05FF]/;
    return hebrewPattern.test(text) ? "right" : "left";
  };

  // ✅ עדכון תמונה + עדכון user + עדכון route params
  const updateProfileImage = async (localUri) => {
    const res = await userModel.updateProfileImage(user._id, localUri);
    if (res.ok) {
      const newProfileImage = res.data.user.profileImage;
      const updatedUser = { ...user, profileImage: newProfileImage };
      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      navigation.setParams({ userdata: updatedUser });
    } else {
      Alert.alert("שגיאה", JSON.stringify(res.error));
    }
  };

  const pickFromLibrary = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("אין הרשאה", "יש לאפשר גישה לגלריה כדי לבחור תמונה.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("אין הרשאה", "יש לאפשר גישה למצלמה כדי לצלם תמונה.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  const renderItem = ({ item }) => {
    const isLiked = item.likedBy?.includes(user._id);
    const uploader = usersMap[String(item.userId?._id || item.userId)] || {};
    return (
      <PostCard
        post={item}
        uploader={uploader}
        isLiked={isLiked}
        handleLike={handleLike}
        getTextAlign={getTextAlign}
        onCommentPress={(id) => {
          setSelectedPostId(id);
          setCommentPopup(true);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => navigation.navigate("EditProfile", { userdata: user })}
      >
        <Ionicons name="settings-outline" size={28} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutIcon}
        onPress={async () => {
          await AsyncStorage.removeItem("userData");
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
        }}
      >
        <Ionicons name="log-out-outline" size={28} color="#333" />
      </TouchableOpacity>

      <ProfileHeader
        profileImage={
          user?.profileImage
            ? { uri: user.profileImage }
            : require("../assets/defualt_profil.jpg")
        }
        userName={user.userName}
        pickImage={() => setModalVisible(true)}
      />

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => String(item._id)}
        renderItem={renderItem}
        contentContainerStyle={styles.postsList}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#8E2DE2" />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              אין פוסטים להצגה.
            </Text>
          )
        }
      />

      <CommentModal
        visible={commentPopup}
        onClose={() => setCommentPopup(false)}
        commentText={commentText}
        setCommentText={setCommentText}
        comments={
          selectedPostId
            ? posts.find((p) => p._id === selectedPostId)?.comments || []
            : []
        }
        usersMap={usersMap}
        getTextAlign={getTextAlign}
        handleAddComment={handleAddComment}
      />

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPickFromLibrary={pickFromLibrary}
        onTakePhoto={takePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  settingsIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  logoutIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  postsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
