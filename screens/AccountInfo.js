import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, I18nManager, Dimensions } from "react-native";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";
const { width, height } = Dimensions.get("window");

const AccountInfo = ({ text, onPress, color, handleChange, userData = {} }) => {
  const UsernameRef = useRef();
  const PhoneRef = useRef();
  const isValidPhone = (val) => /^\d{10}$/.test(val);
  const [errors, setErrors] = useState({
    fullname: false,
    userName: false,
    Phone: false,
  });

  const validateAndNext = () => {
    // always grab a string before trim
    const fullVal = (userData.fullname || "").trim();
    const userVal = (userData.userName || "").trim();
    const phoneVal = (userData.Phone || "").trim();

    const newErr = {
      fullname: fullVal === "",
      userName: userVal === "",
      Phone: !isValidPhone(phoneVal),
    };
    setErrors(newErr);

    if (!newErr.fullname && !newErr.userName && !newErr.Phone) {
      onPress();
    }
  };

  return (
    <View>
      <View style={styles.inputsContain}>
        <Input_text
          placeholder="Full Name"
          val={userData.fullname || ""}
          onChangeText={(val) => {
            handleChange("fullname", val);
            if (val.trim() !== "")
              setErrors((e) => ({ ...e, fullname: false }));
          }}
          onSubmitEditing={() => UsernameRef.current?.focus()}
          returnKeyType="next"
          icon="contacts"
        />
        {errors.fullname && (
          <Text style={styles.error}>יש למלא את השם המלא</Text>
        )}

        <Input_text
          placeholder="userName"
          val={userData.userName || ""}
          onChangeText={(val) => {
            handleChange("userName", val);
            if (val.trim() !== "")
              setErrors((e) => ({ ...e, userName: false }));
          }}
          ref={UsernameRef}
          onSubmitEditing={() => PhoneRef.current?.focus()}
          returnKeyType="next"
          icon="user"
        />
        {errors.userName && (
          <Text style={styles.error}>יש למלא את שם המשתמש</Text>
        )}

        <Input_text
          placeholder="Phone Number"
          val={userData.Phone || ""}
          onChangeText={(val) => {
            handleChange("Phone", val);
            if (val.trim().length === 10)
              setErrors((e) => ({ ...e, Phone: false }));
          }}
          ref={PhoneRef}
          onSubmitEditing={validateAndNext}
          returnKeyType="done"
          icon="phone"
          keyboardType="number-pad"
        />
        {errors.Phone && (
          <Text style={styles.error}>יש להזין מספר טלפון בן 10 ספרות</Text>
        )}
      </View>

      <View style={styles.nextButton}>
        <Acsess_btn text={text} color={color} onPress={validateAndNext} />
      </View>
    </View>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  inputsContain: { alignItems: "center" },
  nextButton: { alignSelf: "center", marginTop: 50 },
  error: {
    color: "red",
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
    marginHorizontal: width * 0.05,
  },
});
