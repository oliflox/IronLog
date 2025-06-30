import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import BasePopup from './BasePopup';

interface NamePopupProps {
  visible: boolean;
  title: string; // Titre affiché dans l'en-tête
  confirmLabel?: string; // Texte du bouton de confirmation (par défaut 'Enregistrer')
  initialValue?: string; // Valeur de départ du champ
  onClose: () => void;
  onConfirm: (name: string) => void; // Callback avec le nom saisi
}

/**
 * Composant générique destiné à remplacer les paires AddXXXPopup / EditXXXPopup
 * pour les entités dont l'unique champ éditable est le nom (Workout, Session, etc.).
 */
const NamePopup: React.FC<NamePopupProps> = ({
  visible,
  title,
  confirmLabel = 'Enregistrer',
  initialValue = '',
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState(initialValue);

  // Quand le popup s'ouvre ou quand la valeur initiale change, on reset le champ
  useEffect(() => {
    if (visible) {
      setName(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    onClose();
  };

  const isValid = name.trim().length > 0;

  return (
    <BasePopup
      visible={visible}
      title={title}
      onClose={onClose}
      confirmLabel={confirmLabel}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
    >
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Entrez un nom"
        placeholderTextColor="#666"
      />
    </BasePopup>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default NamePopup; 