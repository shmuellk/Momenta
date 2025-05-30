import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import React, { useState } from "react";
const { width, height } = Dimensions.get("window");

const Input_code = ({
  KeyHint,
  ref,
  onSubmitEditing,
  autoFocus = false,
  onDeleteBack,
  onChangeText,
}) => {
  const [focus, setFocus] = useState(false);
  return (
    <View
      style={[styles.input_contain, { borderColor: focus ? "red" : "black" }]}
    >
      <TextInput
        style={styles.input}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        maxLength={1}
        selectTextOnFocus={true}
        keyboardType="number-pad"
        enterKeyHint={KeyHint}
        ref={ref}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        onChangeText={(text) => {
          onChangeText(text);
          if (text.length === 1) {
            onSubmitEditing?.();
          }
          if (text.length === 0) {
            onDeleteBack?.();
          }
        }}
      ></TextInput>
    </View>
  );
};

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
