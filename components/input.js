import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import React, { useState } from "react";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/AntDesign";

const Input_text = ({
  placeholder,
  isPassword = false,
  onChangeText,
  ref,
  onSubmitEditing,
  returnKeyType,
  icon,
}) => {
  const [hide_pass, setHide_pass] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: isFocused ? "#7E57C2" : "#ccc",
          borderWidth: isFocused ? 2 : 1,
        },
      ]}
    >
      <Icon
        name={icon}
        size={height * 0.03}
        color={isFocused ? "#7E57C2" : "grey"}
        style={styles.icon}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        secureTextEntry={hide_pass}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={onChangeText}
        ref={ref}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setHide_pass(!hide_pass)}
          style={styles.eye}
        >
          <Icon
            name={hide_pass ? "eyeo" : "eye"}
            size={height * 0.03}
            color={"grey"}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input_text;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: width * 0.7,
    height: height * 0.07,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  icon: {
    paddingHorizontal: 5,
  },
  textInput: {
    flex: 1, // הכי חשוב!
    fontSize: 16,
    paddingHorizontal: 10,
  },
  eye: {
    paddingHorizontal: 5,
  },
});
