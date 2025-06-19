import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { editWorkoutPopupStyles } from "../styles/editWorkoutPopup";
import { theme } from "../styles/theme";

interface Workout {
  id: string;
  name: string;
  order: number;
}

interface EditWorkoutPopupProps {
  visible: boolean;
  workout: Workout | null;
  onClose: () => void;
  onSave: (updatedWorkout: Workout) => void;
}

const EditWorkoutPopup: React.FC<EditWorkoutPopupProps> = ({
  visible,
  workout,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");

  React.useEffect(() => {
    if (workout) {
      setName(workout.name);
    }
  }, [workout]);

  const handleSave = () => {
    if (workout && name.trim()) {
      onSave({
        ...workout,
        name: name.trim(),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (workout) {
      setName(workout.name);
    }
    onClose();
  };

  if (!workout) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={editWorkoutPopupStyles.overlay}>
        <View style={editWorkoutPopupStyles.popup}>
          <View style={editWorkoutPopupStyles.header}>
            <Text style={editWorkoutPopupStyles.title}>Modifier le workout</Text>
            <Pressable onPress={handleCancel} style={editWorkoutPopupStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={editWorkoutPopupStyles.content}>
            <View style={editWorkoutPopupStyles.inputGroup}>
              <Text style={editWorkoutPopupStyles.label}>Nom du workout</Text>
              <TextInput
                style={editWorkoutPopupStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Entrez le nom du workout"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={editWorkoutPopupStyles.footer}>
            <Pressable onPress={handleCancel} style={editWorkoutPopupStyles.cancelButton}>
              <Text style={editWorkoutPopupStyles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[editWorkoutPopupStyles.saveButton, !name.trim() && editWorkoutPopupStyles.saveButtonDisabled]}
              disabled={!name.trim()}
            >
              <Text style={editWorkoutPopupStyles.saveButtonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditWorkoutPopup; 