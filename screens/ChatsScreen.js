// ChatsScreen.js
import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          {/* האייקון בצד שמאל */}
          <Ionicons name="account-search" size={24} color="#333" />

          {/* הקלט יתפוס את שאר המקום */}
          <TextInput
            style={styles.searchInput}
            placeholder="חיפוש משתמש..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* כאן תוכל לשבץ את רשימת הצ'אטים שלך */}
      <View style={styles.chatsContainer}>{/* … תוכן הצ'אטים … */}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  searchContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-start", // מתחיל מלמעלה
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center", // מרכז אנכית
    width: width * 0.9, // למשל 90% מרוחב המסך
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12, // ריווח פנימי מצדדים
    marginTop: 40,
    backgroundColor: "#F9F9F9",
  },
  searchInput: {
    flex: 1, // יתפוס את כל השטח הנותר אחרי האייקון
    marginLeft: 8, // ריווח קטן בין האייקון לטקסט
    fontSize: 16,
    color: "#333",
    height: "100%", // לוקח את גובה המיכל
  },
  chatsContainer: {
    flex: 8,
    // פה תוכל להוסיף סגנונות נוספים כמו רקע, פנלים, רשימה וכו'
    backgroundColor: "#FFF",
  },
});
