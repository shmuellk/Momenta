import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CreatePostScreen({ navigation, route }) {
  const userId = route.params.userId; // מניחים שיש את המשתמש כפרמטר
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
        mediaTypes: [ImagePicker.MediaType.Images],
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
      const resp = await fetch("http://192.168.1.5:3000/posts", {
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
          onPress: () => navigation.goBack(),
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
    <View style={styles.container}>
      <Text style={styles.label}>כתוב טקסט לפוסט:</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="להוסיף תיאור או כיתוב..."
        style={styles.input}
      />

      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="בחר תמונה והעלה פוסט" onPress={pickAndUpload} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    height: 40,
  },
});
