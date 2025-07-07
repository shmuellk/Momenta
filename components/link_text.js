import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const Link_text = ({ text, color, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.link, { color: color || "#8E2DE2" }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Link_text;

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
