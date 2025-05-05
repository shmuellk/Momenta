import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  View,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const PrevLog = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate("LogInScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <LottieView
          source={require("../assets/Messaging.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        {/* <Image
        source={require("../assets/name.png")}
        style={styles.image}
        resizeMode="contain"
      /> */}
        <Text style={styles.name}>Momenta</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>קדימה, מתחילים</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PrevLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  animation: {
    width: width * 1,
    height: width * 1,
  },
  image: {
    width: width * 0.7,
    height: 100,
    marginBottom: 50, // מרווח לפני הכפתור
  },
  button: {
    backgroundColor: "#BDA8DF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    width: width * 0.8,
    height: 60,
    position: "absolute",
    bottom: 50,
  },
  buttonContent: {
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  name: {
    fontSize: 50,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#7E57C2",
    alignSelf: "center",
  },
  intro: {
    marginTop: 100,
  },
});
