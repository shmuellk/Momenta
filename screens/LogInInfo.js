// LogInInfo.js
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, I18nManager, Dimensions } from "react-native";
import Input_text from "../components/input";
import Acsess_btn from "../components/acsess_btn";
const { width, height } = Dimensions.get("window");

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const LogInInfo = ({
  text,
  onPress,
  color,
  handleChange,
  userData = {},
  loading,
}) => {
  const PasswordRef = useRef();
  const RepassRef = useRef();

  const [errors, setErrors] = useState({
    emailEmpty: false,
    emailFormat: false,
    passEmpty: false,
    rePassEmpty: false,
    match: false,
  });

  const validateAndNext = () => {
    const emailVal = (userData.email || "").trim();
    const passVal = (userData.pass || "").trim();
    const rePassVal = (userData.rePass || "").trim();

    const newErr = {
      emailEmpty: emailVal === "",
      emailFormat: emailVal !== "" && !isValidEmail(emailVal),
      passEmpty: passVal === "",
      rePassEmpty: rePassVal === "",
      match: passVal !== "" && rePassVal !== "" && passVal !== rePassVal,
    };
    setErrors(newErr);

    if (
      !newErr.emailEmpty &&
      !newErr.emailFormat &&
      !newErr.passEmpty &&
      !newErr.rePassEmpty &&
      !newErr.match
    ) {
      handleChange("password", passVal); // עדכון סיסמה סופית
      onPress();
    }
  };

  return (
    <View>
      <View style={styles.inputsContain}>
        {/* Email */}
        <Input_text
          placeholder="Email"
          val={userData.email || ""}
          onChangeText={(val) => {
            handleChange("email", val);
            setErrors((e) => ({
              ...e,
              emailEmpty: val.trim() === "",
              emailFormat: val.trim() !== "" && !isValidEmail(val),
            }));
          }}
          onSubmitEditing={() => PasswordRef.current?.focus()}
          returnKeyType="next"
          icon="mail"
        />
        {errors.emailEmpty && (
          <Text style={styles.error}>יש למלא כתובת אימייל</Text>
        )}
        {!errors.emailEmpty && errors.emailFormat && (
          <Text style={styles.error}>כתובת המייל אינה תקינה</Text>
        )}

        {/* Password */}
        <Input_text
          placeholder="Password"
          isPassword
          val={userData.pass || ""}
          onChangeText={(val) => {
            handleChange("pass", val);
            handleChange("password", val);
            setErrors((e) => ({
              ...e,
              passEmpty: val.trim() === "",
              match: false,
            }));
          }}
          ref={PasswordRef}
          onSubmitEditing={() => RepassRef.current?.focus()}
          returnKeyType="next"
          icon="lock"
        />
        {errors.passEmpty && <Text style={styles.error}>יש למלא סיסמה</Text>}

        {/* Confirm Password */}
        <Input_text
          placeholder="Confirm Password"
          isPassword
          val={userData.rePass || ""}
          onChangeText={(val) => {
            handleChange("rePass", val);
            setErrors((e) => ({
              ...e,
              rePassEmpty: val.trim() === "",
              match: e.passEmpty === false && val !== (userData.pass || ""),
            }));
          }}
          ref={RepassRef}
          onSubmitEditing={validateAndNext}
          returnKeyType="done"
          icon="lock"
        />
        {errors.rePassEmpty && <Text style={styles.error}>יש לאשר סיסמה</Text>}
        {!errors.rePassEmpty && errors.match && (
          <Text style={styles.error}>הסיסמאות לא תואמות</Text>
        )}
      </View>

      <View style={styles.nextButton}>
        <Acsess_btn
          text={text}
          color={color}
          onPress={validateAndNext}
          disabled={loading}
          loading={loading}
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
  error: {
    color: "red",
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
    marginHorizontal: width * 0.05,
  },
});
