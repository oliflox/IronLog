import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
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
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.title}>Modifier le workout</Text>
            <Pressable onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom du workout</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Entrez le nom du workout"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popup: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.mainBg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
};

export default EditWorkoutPopup; 