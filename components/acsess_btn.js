import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
const { width, height } = Dimensions.get("window");

const Acsess_btn = ({ text, onPress, color, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Acsess_btn;

const styles = StyleSheet.create({
  button: {
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    width: width * 0.8,
    height: 60,
    alignSelf: "center",
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
