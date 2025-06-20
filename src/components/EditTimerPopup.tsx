import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { editTimerPopupStyles } from "../styles/editTimerPopup";
import { theme } from "../styles/theme";

interface Timer {
  id: string;
  duration: number;
  order: number;
}

interface EditTimerPopupProps {
  visible: boolean;
  timer: Timer | null;
  onClose: () => void;
  onSave: (updatedTimer: Timer) => void;
}

const EditTimerPopup: React.FC<EditTimerPopupProps> = ({
  visible,
  timer,
  onClose,
  onSave,
}) => {
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  React.useEffect(() => {
    if (timer) {
      const mins = Math.floor(timer.duration / 60);
      const secs = timer.duration % 60;
      setMinutes(mins.toString());
      setSeconds(secs.toString());
    }
  }, [timer]);

  const handleSave = () => {
    if (timer && (minutes.trim() || seconds.trim())) {
      const minutesValue = parseInt(minutes, 10) || 0;
      const secondsValue = parseInt(seconds, 10) || 0;
      const totalSeconds = minutesValue * 60 + secondsValue;
      
      if (totalSeconds > 0) {
        onSave({
          ...timer,
          duration: totalSeconds,
        });
        onClose();
      }
    }
  };

  const handleCancel = () => {
    if (timer) {
      const mins = Math.floor(timer.duration / 60);
      const secs = timer.duration % 60;
      setMinutes(mins.toString());
      setSeconds(secs.toString());
    }
    onClose();
  };

  const minutesValue = parseInt(minutes, 10) || 0;
  const secondsValue = parseInt(seconds, 10) || 0;
  const totalSeconds = minutesValue * 60 + secondsValue;
  const isValid = totalSeconds > 0;

  if (!timer) return null;

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
            <Text style={editTimerPopupStyles.title}>Modifier le timer</Text>
            <Pressable onPress={handleCancel} style={editTimerPopupStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={editTimerPopupStyles.content}>
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
                    placeholder="0"
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
              onPress={handleSave}
              style={[editTimerPopupStyles.saveButton, !isValid && editTimerPopupStyles.saveButtonDisabled]}
              disabled={!isValid}
            >
              <Text style={editTimerPopupStyles.saveButtonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditTimerPopup; 