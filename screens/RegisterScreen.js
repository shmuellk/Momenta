// RegistrationFlow.js
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
  Modal,
  TouchableOpacity,
} from "react-native";

import AccountInfo from "./AccountInfo"; // step 0
import AccountInfoB from "./AccountInfoB"; // step 1 (gender & image)
import LogInInfo from "./LogInInfo"; // step 2 (maybe additional info)
import VerificationScreen from "./VerificationScreen"; // step 3

import authModel from "../models/authModel";

const { width, height } = Dimensions.get("window");
const STEPS = ["1", "2", "3", "4"];
const COLORS = ["#B39DDB", "#9575CD", "#8A66C8", "#7E57C2"];

export default function RegistrationFlow({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepColor, setCurrentStepColor] = useState(COLORS[0]);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMasseg, setErrorModalMasseg] = useState("");
  const [nuv, setNuv] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    fullname: "",
    Username: "",
    imageProfile: "", // we’ll fill this in step 1
    gender: "", // step 1
    Phone: "",
    email: "",
    password: "",
    pass: "", // temporary
    rePass: "", // temporary
  });

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / (STEPS.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCurrentStepColor(COLORS[currentStep]);
  }, [currentStep]);

  // Handle Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep > 0) {
        setCurrentStep((s) => s - 1);
        return true;
      }
      return false;
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

  const handleChange = (field, val) => {
    setUserData((prev) => ({ ...prev, [field]: val }));
  };

  // STEP 1: After picking image & choosing gender
  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await authModel.register(userData);
      if (res.ok) {
        // proceed to “LogInInfo” or “VerificationScreen”
        setCurrentStep((s) => s + 1);
      } else {
        console.log("data = " + JSON.stringify(res));

        setErrorModalVisible(true);
        setErrorModalMasseg(res.error || "משהו השתבש בהרשמה");
        setNuv(true);
      }
    } catch (error) {
      setErrorModalVisible(true);
      setErrorModalMasseg("קרתה שגיאה בהרשמה, אנא נסה שוב.");
      setNuv(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (number) => {
    try {
      setLoading(true);
      const res = await authModel.verify({
        code: number,
        email: userData.email,
      });
      if (res) {
        setErrorModalMasseg("המשתמש נוצר בהצלחה!");
        setErrorModalVisible(true);
        setNuv(true);
      } else {
        setErrorModalMasseg(res.error || "קוד האימות שגוי, אנא נסה שוב");
        setErrorModalVisible(true);
      }
    } catch (error) {
      setErrorModalVisible(true);
      setErrorModalMasseg("קרתה שגיאה באימות, אנא נסה שוב.");
      setNuv(true);
    } finally {
      setLoading(false);
    }
  };
  console.log("errorModalMasseg = " + errorModalMasseg);

  const handleResend = async () => {
    try {
      await authModel.resend({ email: userData.email });
      setErrorModalVisible(true);
      setErrorModalMasseg("קוד חדש נשלח");
    } catch (error) {
      setErrorModalVisible(true);
      setErrorModalMasseg("קרתה שגיאה, אנא נסה שוב.");
      setNuv(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Modal
        visible={errorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setErrorModalVisible(false);
          setErrorModalMasseg("");
          if (nuv) {
            navigation.navigate("LogInScreen");
          }
        }}
      >
        <TouchableOpacity
          style={popStyles.modalBackground}
          activeOpacity={1}
          onPressOut={() => {
            setErrorModalVisible(false);
            if (nuv) {
              navigation.navigate("LogInScreen");
            }
          }}
        >
          <View style={popStyles.modalContent}>
            <Text style={popStyles.text}>{errorModalMasseg}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.contain}>
          <View style={styles.container}>
            <View style={styles.logo_contain}>
              <Image
                source={require("../assets/Logo.png")}
                style={styles.image}
              />
              <Text style={styles.comp_name}>Momenta</Text>
            </View>

            {/* Progress Bar */}
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

            {/* Step Content */}
            <View style={styles.stepContent}>
              {currentStep === 0 && (
                <AccountInfo
                  onPress={() => setCurrentStep((s) => s + 1)}
                  color={currentStepColor}
                  text="הבא"
                  handleChange={handleChange}
                  userData={userData}
                />
              )}
              {currentStep === 1 && (
                <AccountInfoB
                  onPress={() => setCurrentStep((s) => s + 1)}
                  color={currentStepColor}
                  loading={loading}
                  text="הבא"
                  handleChange={handleChange}
                  userData={userData}
                />
              )}
              {currentStep === 2 && (
                <LogInInfo
                  onPress={() => {
                    handleRegister();
                  }}
                  color={currentStepColor}
                  loading={loading}
                  text="הבא"
                  handleChange={handleChange}
                  userData={userData}
                />
              )}
              {currentStep === 3 && (
                <VerificationScreen
                  onPress={(number) => handleVerify(number)}
                  color={currentStepColor}
                  text="בודק קוד"
                  resend={handleResend}
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
    height: 120,
    width: 120,
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

const popStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
