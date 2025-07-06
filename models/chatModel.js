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
    return { ok: false, error: error.message };
  }
};

const getUserChats = async (userId) => {
  try {
    const resp = await axios.get(`${ip}/chat/${userId}`);
    return { ok: true, data: resp.data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

const startAnonymousChat = async (userId) => {
  try {
    const resp = await axios.post(`${ip}/chat/anonymous`, { userId });
    return { ok: true, data: resp.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const requestReveal = async (chatId, userId) => {
  try {
    const resp = await axios.post(`${ip}/chat/anonymous/requestReveal`, {
      chatId,
      userId,
    });
    return { ok: true, data: resp.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const checkRevealStatus = async (chatId, userId) => {
  try {
    const resp = await axios.get(
      `${ip}/chat/anonymous/checkReveal/${chatId}/${userId}`
    );
    return { ok: true, data: resp.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const respondToReveal = async (chatId, userId, accept) => {
  try {
    const resp = await axios.post(`${ip}/chat/anonymous/respondReveal`, {
      chatId,
      userId,
      accept,
    });
    if (accept && resp.data?.data?.isRevealed) {
      socket.emit("chatRevealed", { chatId });
    }
    return { ok: true, data: resp.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const startNewAnonymousChat = async (userId, chatId) => {
  try {
    const resp = await axios.post(`${ip}/chat/anonymous/new`, {
      userId,
      chatId,
    });
    return { ok: true, data: resp.data };
  } catch (err) {
    return { ok: false, error: err.message };
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

const subscribeToReveal = (callback) => {
  socket.on("chatRevealed", callback);
};

const unsubscribeFromReveal = () => {
  socket.off("chatRevealed");
};

export default {
  socket,
  ip,
  createOrGetChat,
  getUserChats,
  startAnonymousChat,
  requestReveal,
  checkRevealStatus,
  respondToReveal,
  startNewAnonymousChat,
  joinChatRoom,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
  subscribeToReveal,
  unsubscribeFromReveal,
};
