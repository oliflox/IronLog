import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { editSessionPopupStyles } from "../styles/editSessionPopup";
import { theme } from "../styles/theme";

interface Session {
  id: string;
  name: string;
  workoutId: string;
  order: number;
}

interface EditSessionPopupProps {
  visible: boolean;
  session: Session | null;
  onClose: () => void;
  onSave: (updatedSession: Session) => void;
}

const EditSessionPopup: React.FC<EditSessionPopupProps> = ({
  visible,
  session,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");

  React.useEffect(() => {
    if (session) {
      setName(session.name);
    }
  }, [session]);

  const handleSave = () => {
    if (session && name.trim()) {
      onSave({
        ...session,
        name: name.trim(),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (session) {
      setName(session.name);
    }
    onClose();
  };

  if (!session) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={editSessionPopupStyles.overlay}>
        <View style={editSessionPopupStyles.popup}>
          <View style={editSessionPopupStyles.header}>
            <Text style={editSessionPopupStyles.title}>Modifier la session</Text>
            <Pressable onPress={handleCancel} style={editSessionPopupStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={editSessionPopupStyles.content}>
            <View style={editSessionPopupStyles.inputGroup}>
              <Text style={editSessionPopupStyles.label}>Nom de la session</Text>
              <TextInput
                style={editSessionPopupStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Entrez le nom de la session"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={editSessionPopupStyles.footer}>
            <Pressable onPress={handleCancel} style={editSessionPopupStyles.cancelButton}>
              <Text style={editSessionPopupStyles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[editSessionPopupStyles.saveButton, !name.trim() && editSessionPopupStyles.saveButtonDisabled]}
              disabled={!name.trim()}
            >
              <Text style={editSessionPopupStyles.saveButtonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditSessionPopup; 