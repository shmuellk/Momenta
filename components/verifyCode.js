// VerifyCode.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Input_code from "../components/input_code";

export default function VerifyCode({
  input0Ref,
  input1Ref,
  input2Ref,
  input3Ref,
  codes,
  onChange,
}) {
  return (
    <View style={styles.container}>
      <Input_code
        ref={input0Ref}
        value={codes[0]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={(t) => onChange(0, t)}
      />
      <Input_code
        ref={input1Ref}
        value={codes[1]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={(t) => onChange(1, t)}
      />
      <Input_code
        ref={input2Ref}
        value={codes[2]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={(t) => onChange(2, t)}
      />
      <Input_code
        ref={input3Ref}
        value={codes[3]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={(t) => onChange(3, t)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "center" },
});
