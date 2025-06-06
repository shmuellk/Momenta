import axios from "axios";
const ip = "128.140.125.244:5000";
const login = async (data) => {
  const email = data.email ? data.email : "";
  const password = data.password ? data.password : "";

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

export default { login };
