// LogInInfo.js
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";

const LogInInfo = ({ text, onPress, color, handleChange }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const PasswordRef = useRef();
  const RepassRef = useRef();

  return (
    <View>
      <View style={styles.inputsContain}>
        {/* Email field */}
        <Input_text
          placeholder="Email"
          onChangeText={(val) => handleChange("email", val)}
          onSubmitEditing={() => PasswordRef.current?.focus()}
          returnKeyType="next"
          icon="mail"
        />

        {/* Password field */}
        <Input_text
          placeholder="Password"
          secureTextEntry
          onChangeText={(val) => {
            setPass(val);
            setError(false); // reset error when user retypes
          }}
          ref={PasswordRef}
          onSubmitEditing={() => RepassRef.current?.focus()}
          returnKeyType="next"
          icon="lock"
          isPassword={true}
        />

        {/* Confirm password */}
        <Input_text
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={(val) => {
            if (val === pass) {
              handleChange("password", val);
              setError(false);
            } else {
              setError(true);
            }
          }}
          ref={RepassRef}
          onSubmitEditing={onPress}
          returnKeyType="done"
          icon="lock"
          isPassword={true}
        />

        {error && <Text style={styles.errorText}>הסיסמאות לא תואמות</Text>}
      </View>

      <View style={styles.nextButton}>
        <Acsess_btn
          text={text}
          color={color}
          onPress={onPress}
          disabled={error} // optional: disable button until match
        />
      </View>
    </View>
  );
};

export default LogInInfo;

const styles = StyleSheet.create({
  inputsContain: {
    alignItems: "center",
  },
  nextButton: {
    alignSelf: "center",
    marginTop: 30,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
});
