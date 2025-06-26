import React, { useState, useEffect } from "react";
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
  I18nManager,
} from "react-native";
import moment from "moment";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import userModel from "../models/userModel";
import chatModel from "../models/chatModel";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ChatsScreen({ route }) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [existingChats, setExistingChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = route.params?.userdata;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim()) {
        handleSearch(searchText);
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  useEffect(() => {
    const fetchChats = async () => {
      const resp = await chatModel.getUserChats(currentUser._id);
      if (resp.ok) {
        const sortedChats = resp.data.sort((a, b) => {
          const aTime =
            a.messages[a.messages.length - 1]?.createdAt || a.updatedAt;
          const bTime =
            b.messages[b.messages.length - 1]?.createdAt || b.updatedAt;
          return new Date(bTime) - new Date(aTime);
        });
        setExistingChats(sortedChats);
      }
    };

    if (currentUser?._id) {
      fetchChats();
    }
  }, [currentUser]);

  const handleSearch = async (text) => {
    setLoading(true);
    const response = await userModel.getUsersComplit(text);
    setSearchResults(response);
    setLoading(false);
  };

  const onUserPress = (user) => {
    navigation.navigate("ChatRoom", {
      myUserId: currentUser._id,
      targetUser: user,
    });
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
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
            ) : (
              <Text style={{ fontSize: 20, color: "#555" }}>
                {item.userName[0]}
              </Text>
            )}
          </View>

          <View style={styles.chatInfo}>
            <Text style={styles.username}>{item.userName}</Text>
            <Text style={styles.lastMessage}>התחל שיחה</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderChatItem = ({ item }) => {
    const targetUser = item.users.find((u) => u._id !== currentUser._id);
    const lastMessage = item.messages[item.messages.length - 1];
    const time = lastMessage?.createdAt
      ? moment(lastMessage.createdAt).format("HH:mm")
      : "";

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => onUserPress(targetUser)}
      >
        <View style={styles.chatRow}>
          <View style={styles.avatarPlaceholder}>
            {targetUser.profileImage ? (
              <Image
                source={{ uri: targetUser.profileImage }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
            ) : (
              <Text style={{ fontSize: 20, color: "#555" }}>
                {targetUser.userName[0]}
              </Text>
            )}
          </View>

          <View style={styles.chatInfo}>
            <Text style={styles.username}>{targetUser.userName}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage?.text || "לא נשלחה עדיין הודעה"}
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
          />
        </View>
      </View>

      {/* שיחות קיימות */}
      {!searchText.trim() && (
        <View style={styles.chatsContainer}>
          <Text style={styles.sectionTitle}>השיחות שלי</Text>
          <FlatList
            data={existingChats}
            keyExtractor={(item) => item._id}
            renderItem={renderChatItem}
          />
        </View>
      )}

      {/* תוצאות חיפוש */}
      {searchText.trim() && (
        <View style={styles.chatsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#7E57C2" />
          ) : (
            <>
              <Text style={styles.sectionTitle}>תוצאות חיפוש</Text>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id}
                renderItem={renderUserItem}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    marginLeft: 10,
    textAlign: "right",
  },
  searchContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
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
  chatsContainer: {
    flex: 1,
    padding: 12,
  },
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
    flexDirection: "row-reverse", // RTL
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
  chatInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  username: {
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
});
