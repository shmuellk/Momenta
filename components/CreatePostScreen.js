import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get("window");

export default function CreatePostScreen({ navigation, route, popup }) {
  const userId = route.params.userdata._id; // מניחים שיש את המשתמש כפרמטר
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState(""); // שדה הטקסט לפוסט

  const pickAndUpload = useCallback(async () => {
    try {
      // בקשת הרשאות
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("אין הרשאה", "יש לאפשר גישה לגלריה כדי לבחור תמונה.");
        return;
      }

      // בחירת תמונה
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });
      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      // הכנת formData
      const formData = new FormData();
      formData.append("photo", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: filename,
        type,
      });
      formData.append("userId", userId);
      formData.append("text", text); // <-- הוספנו את שדה הטקסט כאן

      setUploading(true);
      const resp = await fetch("http://128.140.125.244:5000/post", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Upload failed");

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
  }, [userId, text]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>כתוב טקסט לפוסט:</Text>

        <TextInput
          value={text}
          onChangeText={(val) => {
            setText(val);
          }}
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
          <TouchableOpacity style={styles.button} onPress={pickAndUpload}>
            <Text style={styles.buttonText}>בחר תמונה והעלה פוסט</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // המכול הבסיסית מכסה את כל המסך ומרכזת כל דבר במרכז
  screenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    // הצללה לאנדרואיד
    elevation: 4,
    // הצללה ל־iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top", // כדי שהטקסט יתחיל מהפינה העליונה
    minHeight: 100,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  loader: {
    marginVertical: 12,
  },
  // כפתור מותאם אישית עם צבע, פינות מעוגלות, וגובה סטנדרטי
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  // הטקסט שבתוך הכפתור
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
