// 🔹 screens/ChatsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import moment from "moment";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import userModel from "../models/userModel";
import chatModel from "../models/chatModel";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ChatsScreen({ route }) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [existingChats, setExistingChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = route.params?.userdata;

  const fetchChats = async () => {
    const resp = await chatModel.getUserChats(currentUser._id);
    if (resp.ok) {
      const allChats = resp.data;

      const anonChat = allChats.find(
        (c) => c.isAnonymous && c.users.some((u) => u._id === currentUser._id)
      );
      const regularChats = allChats
        .filter((c) => !c.isAnonymous || c.isRevealed)
        .sort((a, b) => {
          const aTime = a.messages.at(-1)?.createdAt || a.updatedAt;
          const bTime = b.messages.at(-1)?.createdAt || b.updatedAt;
          return new Date(bTime) - new Date(aTime);
        });

      const ordered = anonChat ? [anonChat, ...regularChats] : regularChats;
      setExistingChats(ordered);
    }
  };

  useEffect(() => {
    chatModel.subscribeToReveal(() => {
      fetchChats();
    });
    return () => {
      chatModel.unsubscribeFromReveal();
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim()) handleSearch(searchText);
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      setSearchText("");
      setSearchResults([]);
      fetchChats();
    }, [currentUser])
  );

  const handleSearch = async (text) => {
    setLoading(true);
    const response = await userModel.getUsersComplete(text);
    const filtered = response.filter((u) => u._id !== currentUser._id);
    setSearchResults(filtered);
    setLoading(false);
  };

  const onUserPress = (user) => {
    const existing = existingChats.find((chat) =>
      chat.users.some((u) => u._id === user._id)
    );

    if (existing) {
      // 🔁 אם קיים צ'אט – נווט אליו עם ה־chatId
      navigation.navigate("ChatRoom", {
        myUserId: currentUser._id,
        targetUser: user,
        chatId: existing._id,
        isAnonymous: false,
      });
    } else {
      // 🆕 אחרת פתח שיחה חדשה
      navigation.navigate("ChatRoom", {
        myUserId: currentUser._id,
        targetUser: user,
      });
    }
  };

  const onAnonymousPress = async () => {
    const resp = await chatModel.startAnonymousChat(currentUser._id);
    if (resp.ok) {
      const chat = resp.data;
      const partnerId = chat.users.find((id) => id !== currentUser._id);
      navigation.navigate("ChatRoom", {
        myUserId: currentUser._id,
        targetUser: { _id: partnerId, userName: "אנונימי", profileImage: null },
        chatId: chat._id,
        isAnonymous: true,
      });
    } else {
      alert(
        resp.error === "No users available"
          ? "לא נמצאו משתמשים זמינים לשיחה אנונימית."
          : resp.error
      );
    }
  };

  const renderUserItem = ({ item }) => {
    if (item._id === currentUser._id) return null;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => onUserPress(item)}
      >
        <View style={styles.chatRow}>
          <View style={styles.avatarPlaceholder}>
            {item.profileImage ? (
              <Image
                source={{ uri: item.profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={{ fontSize: 20, color: "#555" }}>
                {item.userName[0]}
              </Text>
            )}
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.lastMessage}>התחל שיחה</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderChatItem = ({ item }) => {
    const targetUser = item.users.find((u) => u._id !== currentUser._id);
    const isAnon = item.isAnonymous && !item.isRevealed;
    const lastMsg = item.messages.at(-1);
    const time = lastMsg?.createdAt
      ? moment(lastMsg.createdAt).format("HH:mm")
      : "";

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("ChatRoom", {
            myUserId: currentUser._id,
            targetUser: isAnon
              ? { _id: targetUser._id, userName: "אנונימי", profileImage: null }
              : targetUser,
            chatId: item._id,
            isAnonymous: isAnon,
          })
        }
      >
        <View style={styles.chatRow}>
          <View style={styles.avatarPlaceholder}>
            {isAnon ? (
              <Image
                source={require("../assets/defualt_profil.jpg")}
                style={styles.avatarImage}
              />
            ) : (
              <Image
                source={{ uri: targetUser.profileImage }}
                style={styles.avatarImage}
              />
            )}
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.userName}>
              {isAnon ? "אנונימי" : targetUser.userName}
            </Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMsg?.text || "לא נשלחה עדיין הודעה"}
            </Text>
          </View>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* חיפוש */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="account-search" size={24} color="#333" />
          <TextInput
            style={styles.searchInput}
            placeholder="חיפוש משתמש..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            selectTextOnFocus
          />
        </View>
      </View>

      {/* כפתור אנונימי */}
      {!searchText.trim() && (
        <TouchableOpacity style={styles.anonButton} onPress={onAnonymousPress}>
          <Text style={styles.anonText}>התחל צ'אט אנונימי</Text>
        </TouchableOpacity>
      )}

      {/* שיחות */}
      <View style={styles.chatsContainer}>
        {searchText.trim() ? (
          loading ? (
            <ActivityIndicator size="large" color="#7E57C2" />
          ) : (
            <>
              <Text style={styles.sectionTitle}>תוצאות חיפוש</Text>
              <FlatList
                data={searchResults}
                keyExtractor={(i) => i._id}
                renderItem={renderUserItem}
                initialNumToRender={10}
              />
            </>
          )
        ) : (
          <>
            <Text style={styles.sectionTitle}>השיחות שלי</Text>
            <FlatList
              data={existingChats}
              keyExtractor={(i) => i._id}
              renderItem={renderChatItem}
              initialNumToRender={10}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    marginLeft: 10,
    textAlign: "right",
  },
  searchContainer: { alignItems: "center", justifyContent: "flex-start" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 40,
    backgroundColor: "#F9F9F9",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    height: "100%",
    textAlign: "right",
  },
  chatsContainer: { flex: 1, padding: 12 },
  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  chatRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBB",
    marginLeft: 10,
  },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  chatInfo: { flex: 1, marginHorizontal: 10 },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    textAlign: "right",
  },
  timeText: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 5,
  },
  anonButton: {
    marginTop: 10,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#7E57C2",
    alignItems: "center",
  },
  anonText: { color: "#fff", fontWeight: "bold" },
});
