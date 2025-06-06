// PostsScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import CreatePostScreen from "../components/CreatePostScreen";
const { width, height } = Dimensions.get("window");

export default function PostsScreen({ navigation, route }) {
  const [popup, setPopup] = useState(false);
  const userdata = route.params.userdata;
  const profileImag = userdata.profileImage
    ? userdata.profileImage
    : "./assets/defualt_profil.jpg";

  return (
    <View style={styles.center}>
      <View style={styles.CreatePost}>
        <TouchableOpacity
          onPress={() => {
            setPopup(true);
          }}
        >
          <View>
            <Image />
          </View>
          <Text>new</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.PostList}>
        <FlatList></FlatList>
      </View>

      <Modal
        visible={popup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPopup(false)}
      >
        <TouchableOpacity
          style={popStyles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setPopup(false)}
        >
          <CreatePostScreen
            navigation={navigation}
            route={route}
            popup={setPopup}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    backgroundColor: "white",
  },
  CreatePost: {
    flex: 2,
    marginTop: height * 0.05,
  },
  PostList: {
    flex: 8,
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
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
