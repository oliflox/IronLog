import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { editTimerPopupStyles } from "../styles/editTimerPopup";
import { theme } from "../styles/theme";

interface AddTimerPopupProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, duration: number) => void;
}

const AddTimerPopup: React.FC<AddTimerPopupProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const handleAdd = () => {
    if (name.trim() && (minutes.trim() || seconds.trim())) {
      const minutesValue = parseInt(minutes, 10) || 0;
      const secondsValue = parseInt(seconds, 10) || 0;
      const totalSeconds = minutesValue * 60 + secondsValue;
      
      if (totalSeconds > 0) {
        onAdd(name.trim(), totalSeconds);
        setName("");
        setMinutes("");
        setSeconds("");
        onClose();
      }
    }
  };

  const handleCancel = () => {
    setName("");
    setMinutes("");
    setSeconds("");
    onClose();
  };

  const minutesValue = parseInt(minutes, 10) || 0;
  const secondsValue = parseInt(seconds, 10) || 0;
  const totalSeconds = minutesValue * 60 + secondsValue;
  const isValid = name.trim() && totalSeconds > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={editTimerPopupStyles.overlay}>
        <View style={editTimerPopupStyles.popup}>
          <View style={editTimerPopupStyles.header}>
            <Text style={editTimerPopupStyles.title}>Ajouter un timer</Text>
            <Pressable onPress={handleCancel} style={editTimerPopupStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={editTimerPopupStyles.content}>
            <View style={editTimerPopupStyles.inputGroup}>
              <Text style={editTimerPopupStyles.label}>Nom du timer</Text>
              <TextInput
                style={editTimerPopupStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Entrez le nom du timer"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={editTimerPopupStyles.inputGroup}>
              <Text style={editTimerPopupStyles.label}>Durée</Text>
              <View style={editTimerPopupStyles.durationContainer}>
                <View style={editTimerPopupStyles.timeInputContainer}>
                  <TextInput
                    style={editTimerPopupStyles.timeInput}
                    value={minutes}
                    onChangeText={setMinutes}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                  />
                  <Text style={editTimerPopupStyles.durationUnit}>min</Text>
                </View>
                <View style={editTimerPopupStyles.timeInputContainer}>
                  <TextInput
                    style={editTimerPopupStyles.timeInput}
                    value={seconds}
                    onChangeText={setSeconds}
                    placeholder="30"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                  />
                  <Text style={editTimerPopupStyles.durationUnit}>sec</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={editTimerPopupStyles.footer}>
            <Pressable onPress={handleCancel} style={editTimerPopupStyles.cancelButton}>
              <Text style={editTimerPopupStyles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              style={[editTimerPopupStyles.saveButton, !isValid && editTimerPopupStyles.saveButtonDisabled]}
              disabled={!isValid}
            >
              <Text style={editTimerPopupStyles.saveButtonText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTimerPopup; 