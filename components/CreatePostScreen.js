import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImagePickerModal from "../components/ImagePickerModal";
import postModel from "../models/postModel";

const { width } = Dimensions.get("window");

export default function CreatePostScreen({ navigation, route, popup }) {
  const userId = route.params.userdata._id;
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePicked = async (uri) => {
    try {
      if (!uri) return;

      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      const formData = new FormData();
      formData.append("photo", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: filename,
        type,
      });
      formData.append("userId", userId);
      formData.append("text", text);

      setUploading(true);

      const resp = await postModel.creatPost(formData);
      if (!resp.ok) throw new Error(resp.error || "Upload failed");

      Alert.alert("✅ סיום!", "התמונה והטקסט נשמרו בהצלחה.", [
        {
          text: "אוקיי",
          onPress: () => {
            popup(false);
          },
        },
      ]);
    } catch (err) {
      console.error("🔴 upload error:", err);
      Alert.alert("שגיאה", err.message || JSON.stringify(err));
    } finally {
      setUploading(false);
    }
  };

  const handlePickFromLibrary = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("אין הרשאה", "יש לאפשר גישה לגלריה כדי לבחור תמונה.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });
    if (!result.canceled) {
      handleImagePicked(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
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
      handleImagePicked(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>כתוב טקסט לפוסט:</Text>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="להוסיף תיאור או כיתוב..."
          placeholderTextColor="#999"
          style={styles.textInput}
          multiline
          numberOfLines={4}
        />

        {uploading ? (
          <ActivityIndicator
            size="large"
            color="#1E90FF"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>בחר תמונה והעלה פוסט</Text>
          </TouchableOpacity>
        )}
      </View>

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPickFromLibrary={handlePickFromLibrary}
        onTakePhoto={handleTakePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4B0082",
    marginBottom: 16,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#8E2DE2",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 120,
    marginBottom: 24,
    backgroundColor: "#F8F8F8",
  },
  loader: {
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#8E2DE2",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
