import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  BackHandler,
  Platform,
} from "react-native";

import AccountInfo from "./AccountInfo";
import LogInInfo from "./LogInInfo";
import VerificationScreen from "./VerificationScreen";
import Acsess_btn from "../components/acsess_btn";

const { width, height } = Dimensions.get("window");
const STEPS = ["1", "2", "3"];
const COLORS = ["#B39DDB", "#9575CD", "#7E57C2"];

export default function RegistrationFlow({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepColor, setCurrentStepColor] = useState(COLORS[0]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // אנימציית הפס
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / (STEPS.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();

    // עדכון הצבע אחרי האנימציה
    setCurrentStepColor(COLORS[currentStep]);
  }, [currentStep]);

  // טיפול בכפתור Back הפיזי (Android)
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep > 0) {
        setCurrentStep((s) => s - 1);
        return true; // עצרנו את ברירת המחדל – לא לצאת מהמסך
      }
      // אם currentStep === 0, מחזירים false כדי שהניווט החיצוני יטפל בחזרה
      return false;
    };

    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }
  }, [currentStep]);

  const STEP_BAR_WIDTH = width * 0.6;
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, STEP_BAR_WIDTH],
  });

  return (
    <View style={styles.container}>
      {/* לוגו ושם */}
      <View style={styles.logo_contain}>
        <Image source={require("../assets/Logo.png")} style={styles.image} />
        <Text style={styles.comp_name}>Momenta</Text>
      </View>

      {/* Step Indicator */}
      <View
        style={[
          styles.stepContainer,
          { width: STEP_BAR_WIDTH, alignSelf: "center" },
        ]}
      >
        <View style={styles.track} />
        <Animated.View
          style={[
            styles.progress,
            { width: progressBarWidth, backgroundColor: currentStepColor },
          ]}
        />
        {STEPS.map((label, idx) => {
          const left = (STEP_BAR_WIDTH / (STEPS.length - 1)) * idx;
          const isActive = idx === currentStep;
          return (
            <View
              key={idx}
              style={[
                styles.circle,
                { left },
                isActive && { borderColor: currentStepColor },
              ]}
            >
              <Text
                style={[
                  styles.circleLabel,
                  isActive && { color: currentStepColor },
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* תוכן השלבים */}
      <View style={styles.stepContent}>
        {currentStep === 0 && <AccountInfo />}
        {currentStep === 1 && <LogInInfo />}
        {currentStep === 2 && <VerificationScreen />}
      </View>

      {/* כפתור "הבא" (כפי שהיה) */}
      <View style={styles.nextButton}>
        <Acsess_btn
          text="הבא"
          onPress={() =>
            setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
          }
          color={currentStepColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  logo_contain: {
    alignSelf: "center",
    marginTop: height * 0.1,
  },
  image: {
    height: 130,
    width: 130,
    resizeMode: "contain",
  },
  comp_name: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#7E57C2",
    alignSelf: "center",
  },
  stepContainer: {
    height: 60,
    justifyContent: "center",
    marginBottom: 30,
  },
  track: {
    position: "absolute",
    height: 4,
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 2,
  },
  progress: {
    position: "absolute",
    height: 4,
    width: "100%",
    borderRadius: 2,
  },
  circle: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -14,
  },
  circleLabel: {
    color: "#aaa",
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
});
