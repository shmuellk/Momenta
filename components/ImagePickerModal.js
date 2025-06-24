// components/ImagePickerModal.js
import React from "react";
import { Modal, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ImagePickerModal({
  visible,
  onClose,
  onPickFromLibrary,
  onTakePhoto,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>בחר מקור תמונה</Text>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={onPickFromLibrary}
          >
            <Ionicons
              name="image-outline"
              size={26}
              color="#7E57C2"
              style={styles.optionIcon}
            />
            <Text style={styles.modalOptionText}>גלריה</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={onTakePhoto}>
            <Ionicons
              name="camera-outline"
              size={26}
              color="#7E57C2"
              style={styles.optionIcon}
            />
            <Text style={styles.modalOptionText}>מצלמה</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.cancelOption]}
            onPress={onClose}
          >
            <Ionicons
              name="close-circle-outline"
              size={26}
              color="#E53935"
              style={styles.optionIcon}
            />
            <Text style={[styles.modalOptionText, { color: "#E53935" }]}>
              ביטול
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionIcon: {
    marginRight: 10,
  },
  modalOptionText: {
    fontSize: 18,
    color: "#333",
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
});
