import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";
import Link_text from "../components/link_text";
import userModel from "../models/userModel";
const { width, height } = Dimensions.get("window");

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState(false);

  const passwordRef = useRef();

  const LogIn = async () => {
    const userData = await userModel.login({ email, password });
    if (userData) {
      setError(false);
      navigation.navigate("MainScreen", userData);
    } else {
      setError(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.contain}>
          <View style={styles.logo_contain}>
            <Image
              source={require("../assets/Logo.png")}
              style={styles.image}
            />
            <Text style={styles.comp_name}>Momenta</Text>
          </View>
          <View style={styles.log_in_block}>
            <Input_text
              placeholder="email"
              onChangeText={(val) => setEmail(val)}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              icon="user"
            />
            <Input_text
              placeholder="password"
              isPassword={true}
              onChangeText={(val) => setPassword(val)}
              ref={passwordRef}
              icon="lock"
              onSubmitEditing={LogIn}
            />
            {error && (
              <Text style={styles.error}>שם משתמש או סיסמא שגויים</Text>
            )}
          </View>
          <View style={styles.Link_contain}>
            <Link_text
              text="שחכתי סיסמא ?"
              color="#9575CD"
              onPress={() => setPopUp(true)}
            />
          </View>
          <View style={styles.logIn_btn}>
            <Acsess_btn text="התחברות" onPress={LogIn} color="#7E57C2" />
          </View>

          <View style={styles.registar_contain}>
            <Text style={styles.registar_text}>חסר לך Momenta בחיים? </Text>
            <Link_text
              text="הצטרפו עכשיו"
              color="#9575CD"
              onPress={() => navigation.navigate("RegisterScreen")}
            />
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
                <Text style={popStyles.text}>
                  שלחנו לך מייל לאיפוס הסיסמה ✉️
                </Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    marginHorizontal: 30,
  },

  error: {
    textAlign: I18nManager.isRTL ? "left" : "right",
    color: "red",
  },
  registar_contain: {
    marginTop: height * 0.06, // דוחף כלפי מטה יחסית לגובה המסך
    alignSelf: "center",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  registar_text: {
    fontSize: 16,
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
