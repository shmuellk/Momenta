// AccountInfoB.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Acsess_btn from "../components/acsess_btn";
import ImagePickerModal from "../components/ImagePickerModal";

const { width } = Dimensions.get("window");

const AccountInfoB = ({
  text,
  onPress,
  color,
  handleChange,
  userData = {},
}) => {
  const [errors, setErrors] = useState({ gender: false, imageProfile: false });
  const [localImageUri, setLocalImageUri] = useState(
    userData.imageProfile || ""
  );
  const [modalVisible, setModalVisible] = useState(false);

  const pickFromLibrary = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("אין הרשאה", "יש לאפשר גישה לגלריה כדי לבחור תמונה.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImageUri(uri);
      handleChange("imageProfile", uri);
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("אין הרשאה", "יש לאפשר גישה למצלמה כדי לצלם תמונה.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImageUri(uri);
      handleChange("imageProfile", uri);
    }
  };

  const validateAndNext = () => {
    const newErr = {
      gender: (userData.gender || "").trim() === "",
      imageProfile: !localImageUri,
    };
    setErrors(newErr);
    if (!newErr.gender && !newErr.imageProfile) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickButtonText}>בחר תמונת פרופיל</Text>
      </TouchableOpacity>

      <Image
        source={
          localImageUri
            ? { uri: localImageUri }
            : require("../assets/defualt_profil.jpg") // להחליף בנתיב של תמונה ריקה
        }
        style={styles.profileImage}
      />

      {errors.imageProfile && (
        <Text style={styles.errorText}>אנא בחר תמונת פרופיל</Text>
      )}

      <View style={styles.genderContainer}>
        {["זכר", "נקבה"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderButton,
              userData.gender === g && styles.genderButtonActive,
            ]}
            onPress={() => handleChange("gender", g)}
          >
            <Text
              style={[
                styles.genderText,
                userData.gender === g && styles.genderTextActive,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.gender && <Text style={styles.errorText}>אנא בחר מין</Text>}

      <View style={styles.nextButton}>
        <Acsess_btn text={text} color={color} onPress={validateAndNext} />
      </View>

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPickFromLibrary={pickFromLibrary}
        onTakePhoto={takePhoto}
      />
    </View>
  );
};

export default AccountInfoB;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  pickButton: {
    backgroundColor: "#8E2DE2",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  pickButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#8E2DE2",
    marginVertical: 20,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.7,
    marginBottom: 20,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#8E2DE2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
  },
  genderButtonActive: {
    backgroundColor: "#8E2DE2",
  },
  genderText: {
    color: "#8E2DE2",
    fontSize: 16,
  },
  genderTextActive: {
    color: "#fff",
  },
  nextButton: {
    marginTop: 30,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOption: {
    paddingVertical: 15,
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 18,
  },
  cancelOption: {
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});
