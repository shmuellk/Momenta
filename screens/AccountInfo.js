import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";

const AccountInfo = ({ text, onPress, color, handleChange }) => {
  const UsernameRef = useRef();
  const PhoneRef = useRef();

  return (
    <View>
      <View style={styles.inputsContain}>
        <Input_text
          placeholder="Full Name"
          onChangeText={(val) => handleChange("fullname", val)}
          onSubmitEditing={() => UsernameRef.current?.focus()}
          returnKeyType="next"
          icon="contacts"
        />
        <Input_text
          placeholder="Username"
          onChangeText={(val) => handleChange("username", val)}
          ref={UsernameRef}
          onSubmitEditing={() => PhoneRef.current?.focus()}
          returnKeyType="next"
          icon="user"
        />
        <Input_text
          placeholder="Phone Number"
          onChangeText={(val) => handleChange("phone", val)}
          ref={PhoneRef}
          onSubmitEditing={onPress}
          icon="phone"
        />
      </View>
      <View style={styles.nextButton}>
        <Acsess_btn text={text} color={color} onPress={onPress} />
      </View>
    </View>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  inputsContain: {
    alignItems: "center",
  },
  nextButton: {
    alignSelf: "center",
    marginTop: 50,
  },
});
