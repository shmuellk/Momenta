// Input_text.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

const Input_text = React.forwardRef(
  (
    {
      placeholder,
      isPassword = false,
      onChangeText,
      onSubmitEditing,
      returnKeyType,
      icon,
      required = false,
      keyboardType = "default",
      val, // parent-controlled value
    },
    ref
  ) => {
    const [hidePass, setHidePass] = useState(isPassword);
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState(false);

    // if parent clears val, also clear our error
    useEffect(() => {
      if (!required || (val != null && val.trim() !== "")) {
        setError(false);
      }
    }, [val, required]);

    const handleBlur = () => {
      setIsFocused(false);
      if (required && (!val || val.trim() === "")) {
        setError(true);
      }
    };

    return (
      <View style={{ marginVertical: 10 }}>
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
            ref={ref}
            style={styles.textInput}
            placeholder={placeholder}
            secureTextEntry={hidePass}
            onFocus={() => {
              setIsFocused(true);
              setError(false);
            }}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType}
            keyboardType={keyboardType}
            value={val}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setHidePass((h) => !h)}
              style={styles.eye}
            >
              <Icon
                name={hidePass ? "eyeo" : "eye"}
                size={height * 0.03}
                color="grey"
              />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>required</Text>
          </View>
        )}
      </View>
    );
  }
);

export default Input_text;

const styles = StyleSheet.create({
  inputContainer: {
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
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  eye: {
    paddingHorizontal: 5,
  },
  errorContainer: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
