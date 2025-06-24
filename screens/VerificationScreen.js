// VerificationScreen.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Acsess_btn from "../components/acsess_btn";
import VerifyCode from "../components/verifyCode";

export default function VerificationScreen({ onPress, resend }) {
  const [codes, setCodes] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(60);

  const input0Ref = useRef();
  const input1Ref = useRef();
  const input2Ref = useRef();
  const input3Ref = useRef();

  // Countdown timer
  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [seconds]);

  // Auto-submit when all 4 digits are entered
  useEffect(() => {
    if (codes.every((c) => c.length === 1)) {
      const number = codes.reduce((acc, d) => acc * 10 + parseInt(d, 10), 0);
      onPress(number);
    }
  }, [codes]);

  // Handle digit input and focus
  const handleChange = (idx, text) => {
    const next = [...codes];
    next[idx] = text;
    setCodes(next);

    if (text.length === 1) {
      if (idx === 0) input1Ref.current?.focus();
      if (idx === 1) input2Ref.current?.focus();
      if (idx === 2) input3Ref.current?.focus();
    }
  };

  // Call the parent-provided `resend` callback and reset timer
  const handleResend = () => {
    resend();
    setSeconds(60);
  };

  // Manual submit fallback
  const handleSubmit = () => {
    const number = codes.reduce((acc, d) => acc * 10 + parseInt(d, 10), 0);
    onPress(number);
  };

  return (
    <View style={styles.root}>
      <VerifyCode
        input0Ref={input0Ref}
        input1Ref={input1Ref}
        input2Ref={input2Ref}
        input3Ref={input3Ref}
        codes={codes}
        onChange={handleChange}
      />

      <View style={styles.resendRow}>
        {seconds > 0 ? (
          <Text style={styles.countdown}>שלח קוד שוב בעוד {seconds} שניות</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendButton}>שלח קוד חדש</Text>
          </TouchableOpacity>
        )}
      </View>

      <Acsess_btn text="אישור" color="#8A66C8" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  resendRow: {
    marginVertical: 20,
  },
  countdown: {
    color: "#B39DDB",
    fontSize: 14,
  },
  resendButton: {
    color: "#B39DDB",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
