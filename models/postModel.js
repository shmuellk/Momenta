// postModel.js
import axios from "axios";

const ip = "128.140.125.244:5001";

const creatPost = async (formData) => {
  try {
    const resp = await axios.post(`http://${ip}/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      ok: resp.status >= 200 && resp.status < 300,
      data: resp.data,
    };
  } catch (error) {
    console.log("🔴 Error during creatPost request:", error.message);
    return {
      ok: false,
      error: error.response?.data || error.message,
    };
  }
};

const getAllPosts = async (page = 1, limit = 5) => {
  try {
    const resp = await axios.get(
      `http://${ip}/post?page=${page}&limit=${limit}`
    );
    return {
      ok: resp.status >= 200 && resp.status < 300,
      data: resp.data,
    };
  } catch (error) {
    console.log("Error during getAllPosts request:", error);
    return {
      ok: false,
      error: error.response?.data || error.message,
    };
  }
};

const likePost = async (postId, userId) => {
  try {
    const resp = await axios.post(`http://${ip}/post/${postId}/like`, {
      userId,
    });
    return { ok: resp.status >= 200 && resp.status < 300, data: resp.data };
  } catch (error) {
    console.log("Error during likePost request:", error);
    return { ok: false, error: error.response?.data || error.message };
  }
};

const addComment = async (postId, userId, text) => {
  try {
    const resp = await axios.post(`http://${ip}/post/${postId}/comments`, {
      userId,
      text,
    });
    return { ok: resp.status >= 200 && resp.status < 300, data: resp.data };
  } catch (error) {
    console.log("Error during addComment request:", error);
    return { ok: false, error: error.response?.data || error.message };
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const resp = await axios.get(`http://${ip}/post/user/${userId}`);
    return {
      ok: resp.status >= 200 && resp.status < 300,
      data: resp.data,
    };
  } catch (error) {
    console.log("Error during getPostsByUserId request:", error);
    return {
      ok: false,
      error: error.response?.data || error.message,
    };
  }
};
export default {
  creatPost,
  getAllPosts,
  likePost,
  addComment,
  getPostsByUserId,
};
