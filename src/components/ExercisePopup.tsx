import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Exercise } from "../storage/exerciseRepository";
import { editExercisePopupStyles } from "../styles/editExercisePopup";
import { theme } from "../styles/theme";
import BasePopup from "./BasePopup";

interface ExercisePopupProps {
  visible: boolean;
  exercise?: Exercise | null; // Si présent => mode édition, sinon création
  onClose: () => void;
  // Callbacks
  onAdd?: (name: string, description?: string, imageUrl?: string) => void;
  onSave?: (updatedExercise: Exercise) => void;
}

/**
 * Fusion de AddExercisePopup & EditExercisePopup.
 * Détermine automatiquement le mode en fonction de la présence de `exercise`.
 */
const ExercisePopup: React.FC<ExercisePopupProps> = ({
  visible,
  exercise,
  onClose,
  onAdd,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  // Reset / populate selon le mode
  useEffect(() => {
    if (visible) {
      if (exercise) {
        setName(exercise.name);
        setDescription(exercise.description || "");
        setImageUrl(exercise.imageUrl);
      } else {
        setName("");
        setDescription("");
        setImageUrl(undefined);
      }
    }
  }, [visible, exercise]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUrl(undefined);
  };

  const handleConfirm = () => {
    if (!name.trim()) return;

    if (exercise && onSave) {
      onSave({
        ...exercise,
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl,
      });
    } else if (!exercise && onAdd) {
      onAdd(name.trim(), description.trim() || undefined, imageUrl);
    }
    onClose();
  };

  const isValid = name.trim().length > 0;
  const isEditMode = !!exercise;

  return (
    <BasePopup
      visible={visible}
      title={isEditMode ? "Modifier l'exercice" : "Ajouter un exercice"}
      onClose={onClose}
      confirmLabel={isEditMode ? "Enregistrer" : "Ajouter"}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
    >
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
          <Text style={editExercisePopupStyles.label}>Image (optionnel)</Text>
          <View style={editExercisePopupStyles.imageContainer}>
            {imageUrl ? (
              <View style={editExercisePopupStyles.imagePreview}>
                <Image
                  source={{ uri: imageUrl }}
                  style={editExercisePopupStyles.previewImage}
                />
                <Pressable
                  onPress={removeImage}
                  style={editExercisePopupStyles.removeImageButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={theme.colors.error}
                  />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={pickImage}
                style={editExercisePopupStyles.imagePickerButton}
              >
                <Ionicons
                  name="camera"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={editExercisePopupStyles.imagePickerText}>
                  Sélectionner une image
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={editExercisePopupStyles.inputGroup}>
          <Text style={editExercisePopupStyles.label}>
            Description (optionnel)
          </Text>
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
    </BasePopup>
  );
};

export default ExercisePopup; 