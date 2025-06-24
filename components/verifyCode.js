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
        onChangeText={(t) => onChange(0, t)}
        onSubmitEditing={() => input1Ref.current?.focus()}
        // תא ראשון — אין אחורה
      />
      <Input_code
        ref={input1Ref}
        value={codes[1]}
        onChangeText={(t) => onChange(1, t)}
        onSubmitEditing={() => input2Ref.current?.focus()}
        onDeleteBack={() => input0Ref.current?.focus()}
      />
      <Input_code
        ref={input2Ref}
        value={codes[2]}
        onChangeText={(t) => onChange(2, t)}
        onSubmitEditing={() => input3Ref.current?.focus()}
        onDeleteBack={() => input1Ref.current?.focus()}
      />
      <Input_code
        ref={input3Ref}
        value={codes[3]}
        onChangeText={(t) => onChange(3, t)}
        // תא אחרון — אין קדימה
        onDeleteBack={() => input2Ref.current?.focus()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
