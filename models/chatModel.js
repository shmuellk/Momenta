import axios from "axios";
import { io } from "socket.io-client";

const ip = "http://128.140.125.244:5001";
const socket = io(ip);

const createOrGetChat = async (myUserId, targetUserId) => {
  try {
    const resp = await axios.post(`${ip}/chat`, {
      user1: myUserId,
      user2: targetUserId,
    });
    return { ok: true, data: resp.data };
  } catch (error) {
    console.log("❌ createOrGetChat error:", error.message);
    return { ok: false, error: error.message };
  }
};

const joinChatRoom = (roomId) => {
  socket.emit("joinRoom", roomId);
};

const sendMessage = ({ roomId, senderId, text }) => {
  socket.emit("sendMessage", { roomId, senderId, text });
};

const subscribeToMessages = (callback) => {
  socket.on("newMessage", callback);
};

const unsubscribeFromMessages = () => {
  socket.off("newMessage");
};

const getUserChats = async (userId) => {
  try {
    const resp = await axios.get(`${ip}/chat/${userId}`);
    return { ok: true, data: resp.data };
  } catch (error) {
    console.log("❌ getUserChats error:", error.message);
    return { ok: false, error: error.message };
  }
};

export default {
  socket,
  createOrGetChat,
  joinChatRoom,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
  getUserChats,
};
