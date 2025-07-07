import { StyleSheet, TextInput, View, Dimensions } from "react-native";
import React, { useState, forwardRef } from "react";
const { width } = Dimensions.get("window");

const Input_code = forwardRef(
  (
    {
      KeyHint,
      onSubmitEditing,
      autoFocus = false,
      onDeleteBack,
      onChangeText,
      value,
    },
    ref
  ) => {
    const [focus, setFocus] = useState(false);

    return (
      <View
        style={[
          styles.input_contain,
          {
            borderColor: focus ? "#7E57C2" : "black",
            borderWidth: focus ? 2 : 1,
          },
        ]}
      >
        <TextInput
          ref={ref}
          style={styles.input}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          maxLength={1}
          selectTextOnFocus={true}
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          enterKeyHint={KeyHint}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
          value={value}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && value === "") {
              onDeleteBack?.();
            }
          }}
          onChangeText={(text) => {
            onChangeText(text);
            if (text.length === 1) {
              onSubmitEditing?.();
            }
          }}
        />
      </View>
    );
  }
);

export default Input_code;

const styles = StyleSheet.create({
  input_contain: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    width: width * 0.16,
    height: width * 0.16,
    marginHorizontal: 5,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    textAlign: "center",
    fontSize: 30,
    textAlignVertical: "center",
    height: "100%",
    width: "100%",
  },
});
