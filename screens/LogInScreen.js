import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Button,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";
import Link_text from "../components/link_text";

const { width, height } = Dimensions.get("window");

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popUp, setPopUp] = useState(false);

  const LogIn = () => {
    navigation.navigate("MainScreen");
  };
  const Register = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <ScrollView style={styles.contain}>
      <View style={styles.logo_contain}>
        <Image source={require("../assets/Logo.png")} style={styles.image} />
        <Text style={styles.comp_name}>Momenta</Text>
      </View>
      <View style={styles.log_in_block}>
        <Input_text placeholder="email" onChange={(val) => setEmail(val)} />
        <Input_text
          placeholder="password"
          isPassword={true}
          onChange={(val) => setPassword(val)}
        />
      </View>

      <View style={styles.logIn_btn}>
        <Acsess_btn text="התחברות" onPress={LogIn} color="#7E57C2" />
      </View>

      <View style={styles.Link_contain}>
        <Link_text
          text="שחכתי סיסמא"
          color="#9575CD"
          onPress={() => setPopUp(true)}
        />
      </View>

      <View style={styles.registar}>
        <Acsess_btn text="אין לי חשבון" onPress={Register} color="#B39DDB" />
      </View>

      <Modal
        visible={popUp}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPopUp(false)}
      >
        <TouchableOpacity
          style={popStyles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setPopUp(false)}
        >
          <View style={popStyles.modalContent}>
            <Text style={popStyles.text}>שלחנו לך מייל לאיפוס הסיסמה ✉️</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default LogInScreen;
const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  logo_contain: {
    alignSelf: "center",
    marginTop: height * 0.1,
  },
  image: {
    height: 130,
    width: 130,
    resizeMode: "contain",
  },
  comp_name: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#7E57C2",
    alignSelf: "center",
  },
  log_in_block: {
    alignSelf: "center",
    marginTop: height * 0.08,
  },
  logIn_btn: {
    marginTop: height * 0.05,
    alignSelf: "center",
    alignItems: "center",
  },
  Link_contain: {
    marginTop: 20,
    alignItems: "center",
  },
  registar: {
    marginTop: height * 0.06, // דוחף כלפי מטה יחסית לגובה המסך
    alignSelf: "center",
  },
});

const popStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
