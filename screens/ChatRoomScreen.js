import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import chatModel from "../models/chatModel";

export default function ChatRoomScreen({ route }) {
  const { myUserId, targetUser } = route.params;
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
          <Image
            source={
              targetUser.profileImage
                ? { uri: targetUser.profileImage }
                : require("../assets/defualt_profil.jpg")
            }
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              marginLeft: 10,
            }}
          />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>
            {targetUser.userName}
          </Text>
        </View>
      ),
    });
  }, [navigation, targetUser]);

  useEffect(() => {
    const init = async () => {
      const resp = await chatModel.createOrGetChat(myUserId, targetUser._id);
      if (resp.ok) {
        const chat = resp.data;
        setChatId(chat._id);
        setMessages(chat.messages || []);
        chatModel.joinChatRoom(chat._id);
      }
    };

    init();

    chatModel.subscribeToMessages((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      chatModel.unsubscribeFromMessages();
    };
  }, []);

  const handleSend = () => {
    if (!text.trim() || !chatId) return;
    chatModel.sendMessage({ roomId: chatId, senderId: myUserId, text });
    setText("");
  };

  const renderItem = ({ item }) => {
    const senderId = item.senderId || item.sender?._id || item.sender || null;
    const isMe = senderId?.toString() === myUserId?.toString();
    const time = item.createdAt ? moment(item.createdAt).format("HH:mm") : "";

    return (
      <View
        style={[
          styles.bubbleWrapper,
          isMe ? styles.alignRight : styles.alignLeft,
        ]}
      >
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          <View style={styles.bubbleRow}>
            <Text
              style={[
                styles.messageText,
                isMe ? styles.myText : styles.otherText,
              ]}
            >
              {item.text}
            </Text>
            <Text style={styles.timeInline}>{time}</Text>
          </View>
          <View
            style={[
              styles.bubbleTail,
              isMe ? styles.tailRight : styles.tailLeft,
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 83}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              style={{ flex: 1 }}
            />

            <View style={styles.inputContainer}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="כתוב הודעה..."
                style={styles.input}
                multiline
                returnKeyType="default"
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={{ color: "white" }}>שלח</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  bubbleWrapper: {
    maxWidth: "75%",
    marginVertical: 4,
    position: "relative",
  },
  alignLeft: {
    alignSelf: "flex-start",
  },
  alignRight: {
    alignSelf: "flex-end",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    position: "relative",
    backgroundColor: "#FFF",
  },
  myBubble: {
    backgroundColor: "#7E57C2",
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: "#E6E6E6",
    borderBottomLeftRadius: 0,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
  myText: {
    color: "#fff",
  },
  otherText: {
    color: "#000",
  },
  timeInline: {
    fontSize: 10,
    color: "#bbb",
    marginLeft: 6,
    alignSelf: "flex-end",
    minWidth: 36,
    textAlign: "right",
  },
  bubbleTail: {
    position: "absolute",
    bottom: 0,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderBottomWidth: 10,
  },
  tailRight: {
    right: -10,
    borderLeftWidth: 10,
    borderLeftColor: "#7E57C2",
  },
  tailLeft: {
    left: -10,
    borderRightWidth: 10,
    borderRightColor: "#E6E6E6",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 8,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#7E57C2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
});
