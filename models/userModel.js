import axios from "axios";
import { Platform } from "react-native";

const ip = "128.140.125.244:5001";

// התחברות
const login = async (data) => {
  const email = data.email || "";
  const password = data.password || "";

  try {
    const response = await axios.post(`http://${ip}/users/login`, {
      email,
      password,
    });
    return response.data.user;
  } catch (error) {
    console.log("Error during login request:", error);
    return false;
  }
};

// שליפת משתמש לפי ID
const getUser = async (userId) => {
  try {
    const resp = await axios.post(`http://${ip}/users/getUser`, {
      userId: userId,
    });

    if (resp.status >= 200 && resp.status < 300 && resp.data?.user) {
      return resp.data.user;
    } else {
      console.log("getUser: Unexpected response", resp.data);
      return false;
    }
  } catch (error) {
    console.log(
      "Error during getUser request:",
      error.response || error.message
    );
    return false;
  }
};

// עדכון פרטי משתמש (למשל name, userName, password וכו')
const updateUser = async (data) => {
  try {
    const payload = {
      userId: data.userId,
    };

    if (data.name) payload.name = data.name;
    if (data.userName) payload.userName = data.userName;
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.password) payload.password = data.password;

    console.log(payload);

    const resp = await axios.put(`http://${ip}/users/update`, payload);

    return { ok: true, data: resp.data };
  } catch (error) {
    console.log("Error during update request:", error);
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    return { ok: false, error: msg };
  }
};

// ✅ פונקציה חדשה לעדכון תמונת פרופיל בשרת
const updateProfileImage = async (userId, localImageUri) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);

    const filename = localImageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : "image";

    formData.append("profileImage", {
      uri:
        Platform.OS === "ios"
          ? localImageUri.replace("file://", "")
          : localImageUri,
      name: filename,
      type: mimeType,
    });

    const response = await axios.post(
      `http://${ip}/users/updateProfileImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { ok: true, data: response.data.user };
  } catch (error) {
    console.log("Error uploading image:", error.message);
    return { ok: false, error: error.response?.data?.error || error.message };
  }
};

const getUsersComplit = async (searchText) => {
  try {
    const resp = await axios.post(`http://${ip}/users/getUsersComplit`, {
      data: searchText,
    });
    return resp.data;
  } catch (error) {
    console.log("Error in getUsersComplit:", error.message);
    return [];
  }
};

export default {
  login,
  getUser,
  updateUser,
  updateProfileImage,
  getUsersComplit,
};
