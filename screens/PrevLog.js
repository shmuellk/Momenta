import React from "react";
import { StyleSheet, Text, Dimensions, View, I18nManager } from "react-native";
import LottieView from "lottie-react-native";
import Acsess_btn from "../components/acsess_btn";
const { width, height } = Dimensions.get("window");

const PrevLog = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate("LogInScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <LottieView
          source={require("../assets/Messaging.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.name}>Momenta</Text>
      </View>
      <View style={styles.Haders}>
        <Text style={styles.MainHader}>
          <Text style={{ color: "#7E57C2" }}>חברים. </Text>
          <Text style={{ color: "#9575CD" }}>עולמות. </Text>
          <Text style={{ color: "#B39DDB" }}>חיבורים</Text>
        </Text>
        <Text style={styles.SubHader}>רשת אחת שמחברת את כולם</Text>
      </View>
      <View style={styles.btn_contain}>
        <Acsess_btn text="מתחילים" onPress={handlePress} color="#BDA8DF" />
      </View>
    </View>
  );
};

export default PrevLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  animation: {
    width: width * 2,
    height: width,
  },
  image: {
    width: width * 0.7,
    height: 100,
    marginBottom: 50, // מרווח לפני הכפתור
  },
  name: {
    fontSize: 50,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#7E57C2",
    alignSelf: "center",
    bottom: height * 0.06,
  },
  Haders: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  MainHader: {
    fontSize: width * 0.075,
    fontWeight: "bold",
  },
  SubHader: {
    fontSize: width * 0.06,
    color: "#D8CCEC",
  },
  intro: {
    marginTop: 100,
    alignItems: "center",
  },
  btn_contain: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});
