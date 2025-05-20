import { StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";

const AccountInfo = ({ text, onPress, color, handleChange, userData }) => {
  const UsernameRef = useRef();
  const PhoneRef = useRef();

  return (
    <View>
      <View style={styles.inputsContain}>
        <Input_text
          placeholder="Full Name"
          val={userData.fullname}
          onChangeText={(val) => handleChange("fullname", val)}
          onSubmitEditing={() => UsernameRef.current?.focus()}
          returnKeyType="next"
          icon="contacts"
          required={true}
        />
        <Input_text
          placeholder="Username"
          val={userData.Username}
          onChangeText={(val) => handleChange("Username", val)}
          ref={UsernameRef}
          onSubmitEditing={() => PhoneRef.current?.focus()}
          returnKeyType="next"
          icon="user"
          required={true}
        />
        <Input_text
          placeholder="Phone Number"
          val={userData.Phone}
          onChangeText={(val) => handleChange("Phone", val)}
          ref={PhoneRef}
          onSubmitEditing={onPress}
          icon="phone"
          required={true}
          keyboardType="number-pad"
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
