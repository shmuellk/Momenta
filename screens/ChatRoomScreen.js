// 🔹 ChatRoomScreen.js
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
  Alert,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import chatModel from "../models/chatModel";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ChatRoomScreen({ route }) {
  const {
    myUserId,
    targetUser,
    chatId: existingChatId,
    isAnonymous = false,
  } = route.params;

  const [chatId, setChatId] = useState(existingChatId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(!isAnonymous);
  const [userDisplay, setUserDisplay] = useState(targetUser);

  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const imageSrc =
      revealed && userDisplay?.profileImage
        ? { uri: userDisplay.profileImage }
        : require("../assets/defualt_profil.jpg");
    const name = revealed ? userDisplay?.userName : "";

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
          <Image
            source={imageSrc}
            style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 10 }}
          />
          {name !== "" && (
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>
              {name}
            </Text>
          )}
        </View>
      ),
      headerLeft: (props) =>
        isAnonymous && !revealed ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
            <View style={{ flexDirection: "row-reverse" }}>
              <TouchableOpacity
                onPress={handleReveal}
                style={styles.revealButton}
              >
                <Text style={styles.revealText}>חשיפת משתמשים</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleStartNew}
                style={styles.newChatButton}
              >
                <Text style={styles.newChatText}>שיחה חדשה</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
        ),
    });
  }, [revealed, userDisplay]);

  useEffect(() => {
    const init = async () => {
      const resp = await chatModel.createOrGetChat(myUserId, targetUser._id);
      if (!resp.ok) return Alert.alert("שגיאה בטעינת הצ'אט");

      const chat = resp.data;
      setChatId(chat._id);
      setMessages(chat.messages);
      const other = chat.users.find((u) => u._id !== myUserId);
      setUserDisplay(other);
      if (!chat.isAnonymous) setRevealed(true);
      chatModel.joinChatRoom(chat._id);
    };

    init();
    const msgSub = (msg) => setMessages((prev) => [...prev, msg]);
    chatModel.subscribeToMessages(msgSub);
    return () => chatModel.unsubscribeFromMessages();
  }, []);

  useEffect(() => {
    if (!chatId || (!isAnonymous && revealed)) return;

    const promptReveal = async () => {
      const resp = await chatModel.checkRevealStatus(chatId, myUserId);
      if (resp.ok && resp.data.shouldPrompt) {
        Alert.alert(
          "בקשת חשיפה",
          "המשתמש השני ביקש לחשוף את זהותו. האם להפוך לחשוף?",
          [
            {
              text: "לא",
              style: "cancel",
              onPress: async () =>
                chatModel.respondToReveal(chatId, myUserId, false),
            },
            {
              text: "כן",
              onPress: async () => {
                await chatModel.respondToReveal(chatId, myUserId, true);
                const refresh = await chatModel.createOrGetChat(
                  myUserId,
                  userDisplay._id
                );
                if (refresh.ok && !refresh.data.isAnonymous) {
                  setRevealed(true);
                  const other = refresh.data.users.find(
                    (u) => u._id !== myUserId
                  );
                  setUserDisplay(other);
                  Alert.alert("נחשפתם זה לזה!");
                }
              },
            },
          ]
        );
      }
    };

    promptReveal();
  }, [chatId]);

  const handleReveal = async () => {
    const resp = await chatModel.requestReveal(chatId, myUserId);
    resp.ok
      ? Alert.alert("בקשה נשלחה", "המשתמש השני יחליט אם לחשוף.")
      : Alert.alert("שגיאה", resp.error);
  };

  const handleStartNew = async () => {
    const resp = await chatModel.startNewAnonymousChat(myUserId, chatId);
    if (resp.ok) {
      const newChat = resp.data;
      const partnerId = newChat.users.find((id) => id !== myUserId);
      navigation.replace("ChatRoom", {
        myUserId,
        targetUser: { _id: partnerId, userName: "אנונימי", profileImage: null },
        chatId: newChat._id,
        isAnonymous: true,
      });
    } else {
      Alert.alert("שגיאה", resp.error);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    chatModel.sendMessage({ roomId: chatId, senderId: myUserId, text });
    setText("");
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === myUserId || item.sender?._id === myUserId;
    const bubbleStyle = isMe ? styles.myBubble : styles.otherBubble;
    return (
      <View
        style={[
          styles.bubbleWrapper,
          isMe ? styles.alignRight : styles.alignLeft,
        ]}
      >
        <View style={[styles.bubble, bubbleStyle]}>
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myText : styles.otherText,
            ]}
          >
            {item.text}
          </Text>
          <Text style={styles.timeInline}>
            {moment(item.createdAt).format("HH:mm")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 83}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(_, i) => i.toString()}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="כתוב הודעה..."
                value={text}
                onChangeText={setText}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={{ color: "#fff" }}>שלח</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FAFAFA" },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  bubbleWrapper: { maxWidth: "75%", marginVertical: 4 },
  alignLeft: { alignSelf: "flex-start" },
  alignRight: { alignSelf: "flex-end" },
  bubble: { padding: 8, borderRadius: 16, elevation: 2 },
  myBubble: { backgroundColor: "#7E57C2", borderBottomRightRadius: 0 },
  otherBubble: { backgroundColor: "#EEE", borderBottomLeftRadius: 0 },
  messageText: { fontSize: 16, lineHeight: 22 },
  myText: { color: "#fff" },
  otherText: { color: "#333" },
  timeInline: {
    fontSize: 10,
    color: "#bbb",
    alignSelf: "flex-end",
    marginTop: 4,
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
  revealButton: {
    borderColor: "#7E57C2",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 2,
  },
  revealText: { color: "#7E57C2", fontWeight: "bold" },
  newChatButton: {
    borderColor: "#C00",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newChatText: { color: "#C00", fontWeight: "bold" },
});
