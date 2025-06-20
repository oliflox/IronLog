import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../styles/theme';

interface EditSetPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (repetitions: number, weight: number) => void;
  set?: { repetitions: number; weight: number } | null;
}

const EditSetPopup: React.FC<EditSetPopupProps> = ({ visible, onClose, onSave, set }) => {
  const [repetitions, setRepetitions] = useState('');
  const [weight, setWeight] = useState('');

  // Pré-remplir avec les valeurs du set quand le popup s'ouvre
  useEffect(() => {
    if (visible && set) {
      setRepetitions(set.repetitions.toString());
      setWeight(set.weight.toString());
    } else if (visible) {
      setRepetitions('');
      setWeight('');
    }
  }, [visible, set]);

  const handleSave = () => {
    const reps = parseInt(repetitions) || 0;
    const weightValue = parseFloat(weight) || 0;
    
    if (reps <= 0 || weightValue <= 0) {
      return;
    }

    onSave(reps, weightValue);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isValid = (parseInt(repetitions) || 0) > 0 && (parseFloat(weight) || 0) > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Modifier le set</Text>
          
          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Répétitions</Text>
              <TextInput
                style={styles.input}
                value={repetitions}
                onChangeText={setRepetitions}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={(value) => {
                  // Permettre seulement les nombres avec max 1 décimale
                  const regex = /^\d*\.?\d{0,1}$/;
                  if (regex.test(value) || value === '') {
                    setWeight(value);
                  }
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Annuler</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.saveButton, !isValid && styles.disabledButton]} 
              onPress={handleSave}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditSetPopup; 