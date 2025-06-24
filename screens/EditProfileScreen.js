import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";

import Input_text from "../components/input"; // ✅ קומפוננטת אינפוט שלך
import userModel from "../models/userModel"; // ✅ ודא שהנתיב נכון!
import authModel from "../models/authModel";

export default function EditProfileScreen({ route, navigation }) {
  const { userdata } = route.params;

  const [userName, setUserName] = useState(userdata.userName || "");
  const [email, setEmail] = useState(userdata.email || "");
  const [phone, setPhone] = useState(userdata.phone || "");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ מצב טעינה

  // refs לשדות מעבר
  const emailRef = useRef();
  const phoneRef = useRef();
  const passRef = useRef();
  const rePassRef = useRef();

  const handleSave = async () => {
    if (password && password !== rePassword) {
      Alert.alert("שגיאה", "הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);

    const res = await userModel.updateUser({
      userId: userdata._id,
      name: userName,
      userName: userName,
      email: email,
      phone: phone,
      password: password,
    });

    if (res.ok) {
      // ✅ משוך מחדש את המשתמש מהשרת
      const resGet = await userModel.getUser(userdata._id);

      setLoading(false);

      if (resGet) {
        // ✅ חזור למסך פרופיל עם הנתונים המעודכנים
        navigation.navigate("ProfileMain", { userdata: resGet });
      } else {
        navigation.goBack();
      }

      Alert.alert("הצלחה", "המשתמש עודכן בהצלחה!");
    } else {
      setLoading(false);
      Alert.alert("שגיאה", res.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Input_container}>
        <Input_text
          placeholder="שם משתמש"
          icon="user"
          val={userName}
          onChangeText={setUserName}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current.focus()}
          required
        />

        <Input_text
          ref={emailRef}
          placeholder="אימייל"
          icon="mail"
          val={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current.focus()}
          required
        />

        <Input_text
          ref={phoneRef}
          placeholder="טלפון"
          icon="phone"
          val={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => passRef.current.focus()}
          required
        />

        <Input_text
          ref={passRef}
          placeholder="סיסמא"
          icon="lock"
          val={password}
          onChangeText={setPassword}
          isPassword
          returnKeyType="next"
          onSubmitEditing={() => rePassRef.current.focus()}
        />

        <Input_text
          ref={rePassRef}
          placeholder="אימות סיסמא"
          icon="lock"
          val={rePassword}
          onChangeText={setRePassword}
          isPassword
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>שמור שינויים</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  Input_container: {
    alignItems: "center",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#8E2DE2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
