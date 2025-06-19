import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { editExercisePopupStyles } from "../styles/editExercisePopup";
import { theme } from "../styles/theme";

interface AddExercisePopupProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, description?: string) => void;
}

const AddExercisePopup: React.FC<AddExercisePopupProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), description.trim() || undefined);
      setName("");
      setDescription("");
      onClose();
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    onClose();
  };

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
            <Text style={editExercisePopupStyles.title}>Ajouter un exercice</Text>
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
              onPress={handleAdd}
              style={[editExercisePopupStyles.saveButton, !name.trim() && editExercisePopupStyles.saveButtonDisabled]}
              disabled={!name.trim()}
            >
              <Text style={editExercisePopupStyles.saveButtonText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddExercisePopup; 