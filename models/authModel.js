import axios from "axios";
const ip = "192.168.1.55:3000";

const register = async (data) => {
  const name = data.fullname ? data.fullname : "";
  const email = data.email ? data.email : "";
  const phone = data.Phone ? data.Phone : "";
  const password = data.password ? data.password : "";
  const userName = data.Username ? data.Username : "";

  console.log("name = " + name);
  console.log("email = " + email);
  console.log("phone = " + phone);
  console.log("password = " + password);
  console.log("userName = " + userName);

  try {
    const response = await axios.post(`http://${ip}/auth/register`, {
      name,
      email,
      phone,
      password,
      userName,
    });

    return true;
  } catch (error) {
    console.log("Error during login request:", error);
    return false;
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
