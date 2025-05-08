import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
const { width, height } = Dimensions.get("window");

const Acsess_btn = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Acsess_btn;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#BDA8DF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    width: width * 0.8,
    height: 60,
    position: "absolute",
    bottom: 50,
    alignSelf: "center", // 💥 זה ממקם אותו במרכז גם כש-absolute
  },
  buttonContent: {
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
});
