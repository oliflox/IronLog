import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { editExercisePopupStyles } from "../styles/editExercisePopup";
import { theme } from "../styles/theme";

interface Exercise {
  id: string;
  name: string;
  sessionId: string;
  order: number;
  imageUrl?: string;
  description?: string;
}

interface EditExercisePopupProps {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSave: (updatedExercise: Exercise) => void;
}

const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  visible,
  exercise,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  React.useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDescription(exercise.description || "");
    }
  }, [exercise]);

  const handleSave = () => {
    if (exercise && name.trim()) {
      onSave({
        ...exercise,
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (exercise) {
      setName(exercise.name);
      setDescription(exercise.description || "");
    }
    onClose();
  };

  if (!exercise) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={editExercisePopupStyles.overlay}>
        <View style={editExercisePopupStyles.popup}>
          <View style={editExercisePopupStyles.header}>
            <Text style={editExercisePopupStyles.title}>Modifier l'exercice</Text>
            <Pressable onPress={handleCancel} style={editExercisePopupStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={editExercisePopupStyles.content}>
            <View style={editExercisePopupStyles.inputGroup}>
              <Text style={editExercisePopupStyles.label}>Nom de l'exercice</Text>
              <TextInput
                style={editExercisePopupStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Entrez le nom de l'exercice"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={editExercisePopupStyles.inputGroup}>
              <Text style={editExercisePopupStyles.label}>Description (optionnel)</Text>
              <TextInput
                style={editExercisePopupStyles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Entrez une description de l'exercice"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={editExercisePopupStyles.footer}>
            <Pressable onPress={handleCancel} style={editExercisePopupStyles.cancelButton}>
              <Text style={editExercisePopupStyles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[editExercisePopupStyles.saveButton, !name.trim() && editExercisePopupStyles.saveButtonDisabled]}
              disabled={!name.trim()}
            >
              <Text style={editExercisePopupStyles.saveButtonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditExercisePopup; 