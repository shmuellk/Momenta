import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";

import CreatePostScreen from "../components/CreatePostScreen";
import HeaderBar from "../components/HeaderBar";
import PostCard from "../components/PostCard";
import CommentModal from "../components/CommentModal";
import { useFocusEffect } from "@react-navigation/native";
import postModel from "../models/postModel";
import userModel from "../models/userModel";

export default function PostsScreen({ navigation, route }) {
  const [popup, setPopup] = useState(false);
  const [commentPopup, setCommentPopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [usersMap, setUsersMap] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [postsList, setPostsList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef();
  const userdata = route.params.userdata;

  const profileImage = userdata.profileImage
    ? { uri: userdata.profileImage }
    : require("../assets/defualt_profil.jpg");

  const fetchPosts = (() => {
    let isActive = true;
    return async (pageNumber) => {
      if (loading || !hasMore) return;

      setLoading(true);
      isActive = true;

      const res = await postModel.getAllPosts(pageNumber, 5);
      if (!isActive) return;

      if (res.ok) {
        const newPosts = res.data.posts;
        setPostsList((prev) => {
          const allPosts = pageNumber === 1 ? newPosts : [...prev, ...newPosts];
          const map = new Map();
          allPosts.forEach((p) => map.set(String(p._id), p));
          return Array.from(map.values());
        });

        if (newPosts.length < 5) setHasMore(false);
      } else {
        Alert.alert("שגיאה", res.error || "שגיאה בטעינת פוסטים");
      }

      setLoading(false);
    };
  })();

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts(page);
    }, [page])
  );

  useEffect(() => {
    const fetchMissingUsers = async () => {
      const missingIds = [];
      postsList.forEach((p) => {
        const postUserId = String(p.userId?._id || p.userId);
        if (!usersMap[postUserId]) missingIds.push(postUserId);
        p.comments?.forEach((c) => {
          const commentUserId = String(c.userId?._id || c.userId);
          if (!usersMap[commentUserId]) missingIds.push(commentUserId);
        });
      });

      const uniqueIds = [...new Set(missingIds)];
      if (uniqueIds.length === 0) return;

      const promises = uniqueIds.map(async (id) => {
        const user = await userModel.getUser(id);
        return { id, user };
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

    if (postsList.length > 0) fetchMissingUsers();
  }, [postsList]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await fetchPosts(1);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) setPage((prev) => prev + 1);
  };

  const getTextAlign = (text) => {
    const hebrewPattern = /[\u0590-\u05FF]/;
    return hebrewPattern.test(text) ? "right" : "left";
  };

  const handleLike = async (postId) => {
    const res = await postModel.likePost(postId, userdata._id);
    if (res.ok) {
      setPostsList((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: res.data.likes, likedBy: res.data.likedBy }
            : p
        )
      );
    } else {
      Alert.alert("שגיאה", res.error || "שגיאה בלייק");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("שגיאה", "כתוב תגובה קודם!");
      return;
    }
    const res = await postModel.addComment(
      selectedPostId,
      userdata._id,
      commentText
    );
    if (res.ok) {
      setPostsList((prev) =>
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

  const renderItem = ({ item }) => {
    const isLiked = item.likedBy?.includes(userdata._id);
    const uploader = usersMap[String(item.userId?._id || item.userId)] || {};
    return (
      <PostCard
        post={item}
        isLiked={isLiked}
        uploader={uploader}
        getTextAlign={getTextAlign}
        handleLike={handleLike}
        onCommentPress={(id) => {
          setSelectedPostId(id);
          setCommentPopup(true);
        }}
      />
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#8E2DE2" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        profileImage={profileImage}
        userName={userdata.userName}
        onPlusPress={() => setPopup(true)}
      />

      <FlatList
        data={postsList}
        renderItem={renderItem}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ref={flatListRef}
        ListFooterComponent={renderFooter}
      />

      <Modal
        visible={popup}
        transparent
        animationType="fade"
        onRequestClose={() => setPopup(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setPopup(false)}
        >
          <CreatePostScreen
            navigation={navigation}
            route={route}
            popup={setPopup}
          />
        </TouchableOpacity>
      </Modal>

      <CommentModal
        visible={commentPopup}
        onClose={() => setCommentPopup(false)}
        commentText={commentText}
        setCommentText={setCommentText}
        comments={
          selectedPostId
            ? postsList.find((p) => p._id === selectedPostId)?.comments || []
            : []
        }
        usersMap={usersMap}
        getTextAlign={getTextAlign}
        handleAddComment={handleAddComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { paddingHorizontal: 20, paddingBottom: 110 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
