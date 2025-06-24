import axios from "axios";
const ip = "128.140.125.244:5000";
import { Platform } from "react-native";

const register = async (userData) => {
  try {
    // Build a FormData object
    const formData = new FormData();
    formData.append("name", userData.fullname || "");
    formData.append("email", userData.email || "");
    formData.append("phone", userData.Phone || "");
    formData.append("password", userData.password || "");
    formData.append("userName", userData.Username || "");
    formData.append("gander", userData.gander || "");

    // If userData.imageProfile is a local URI, we need to extract filename & type
    // React Native’s fetch/axios FormData can accept an object like { uri, name, type }
    if (userData.imageProfile) {
      // Extract the file extension from the URI
      const uri = userData.imageProfile;
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image";

      formData.append("imageProfile", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: filename,
        type: mimeType,
      });
    }

    // Send multipart/form-data to /auth/register
    const resp = await axios.post(`http://${ip}/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // If you get 200, it means the server sent the verification code
    return { ok: true, data: resp.data };
  } catch (error) {
    console.log(
      "Error during register request:",
      error.response || error.message
    );
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    return { ok: false, error: msg };
  }
};

const resend = async (data) => {
  const email = data.email ? data.email : "";
  console.log("email in = " + email);

  try {
    const response = await axios.post(`http://${ip}/auth/resend`, {
      email,
    });
    console.log("resend : " + response.data);

    return true;
  } catch (error) {
    console.log("Error during login request:", error);
    return false;
  }
};

const verify = async (data) => {
  try {
    console.log("email = " + data.email);
    console.log("code = " + data.code);

    const response = await axios.post(`http://${ip}/auth/verify`, {
      email: data.email || "",
      code: data.code || "",
    });

    console.log("response = " + JSON.stringify(response));

    // למשל: backend מחזיר { verified: true, ... }
    if (
      (response.status === 200 || response.status === 201) &&
      response.data.verified === true
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error during login request:", error);
    return false;
  }
};

export default { register, resend, verify };
