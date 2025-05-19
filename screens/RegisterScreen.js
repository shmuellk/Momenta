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
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import AccountInfo from "./AccountInfo";
import LogInInfo from "./LogInInfo";
import VerificationScreen from "./VerificationScreen";

const { width, height } = Dimensions.get("window");
const STEPS = ["1", "2", "3"];
const COLORS = ["#B39DDB", "#9575CD", "#7E57C2"];

export default function RegistrationFlow({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepColor, setCurrentStepColor] = useState(COLORS[0]);
  const [userData, setUserData] = useState({
    fullname: "",
    Username: "",
    Phone: "",
    email: "",
    password: "",
  });
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animate the progress bar and update its color
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / (STEPS.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();

    setCurrentStepColor(COLORS[currentStep]);
  }, [currentStep]);

  // Handle Android hardware back button
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep > 0) {
        setCurrentStep((s) => s - 1);
        return true; // We've handled it
      }
      return false; // Let the system handle it (navigate back)
    };

    if (Platform.OS === "android") {
      const backSub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backSub.remove();
    }
  }, [currentStep]);

  const STEP_BAR_WIDTH = width * 0.6;
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, STEP_BAR_WIDTH],
  });

  const handleChange = (filde, val) =>
    setUserData((prev) => ({ ...prev, [filde]: val }));

  const FirstNext = () => setCurrentStep((s) => s + 1);
  const SecondNext = () => setCurrentStep((s) => s + 1);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.contain}>
          <View style={styles.container}>
            {/* Logo and title */}
            <View style={styles.logo_contain}>
              <Image
                source={require("../assets/Logo.png")}
                style={styles.image}
              />
              <Text style={styles.comp_name}>Momenta</Text>
            </View>

            {/* Step indicator centered */}
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
                  {
                    width: progressBarWidth,
                    backgroundColor: currentStepColor,
                  },
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

            {/* Step content */}
            <View style={styles.stepContent}>
              {currentStep === 0 && (
                <AccountInfo
                  onPress={FirstNext}
                  color={currentStepColor}
                  text="הבא"
                  handleChange={handleChange}
                />
              )}
              {currentStep === 1 && (
                <LogInInfo
                  onPress={SecondNext}
                  color={currentStepColor}
                  text="הבא"
                  handleChange={handleChange}
                />
              )}
              {currentStep === 2 && (
                <VerificationScreen
                  onPress={() => setCurrentStep((s) => s + 1)}
                  color={currentStepColor}
                  text="הבא"
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
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
    alignItems: "center",
  },
});
