import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../styles/theme';

interface AddLogPopupProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (date: string, sets: { repetitions: number; weight: number; order: number }[]) => void;
  lastSet?: { repetitions: number; weight: number } | null;
}

const AddLogPopup: React.FC<AddLogPopupProps> = ({ visible, onClose, onAdd, lastSet }) => {
  const [repetitions, setRepetitions] = useState('');
  const [weight, setWeight] = useState('');

  // Pré-remplir avec le dernier set quand le popup s'ouvre
  useEffect(() => {
    if (visible && lastSet) {
      setRepetitions(lastSet.repetitions.toString());
      setWeight(lastSet.weight.toString());
    } else if (visible) {
      setRepetitions('');
      setWeight('');
    }
  }, [visible, lastSet]);

  const handleAdd = () => {
    const reps = parseInt(repetitions) || 0;
    const weightValue = parseFloat(weight) || 0;
    
    if (reps <= 0 || weightValue <= 0) {
      return;
    }

    // Utiliser la date du jour
    const today = new Date().toISOString().split('T')[0];
    const newSet = { repetitions: reps, weight: weightValue, order: 0 };
    
    onAdd(today, [newSet]);
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
          <Text style={styles.title}>Ajouter un set</Text>
          
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
              style={[styles.button, styles.addButton, !isValid && styles.disabledButton]} 
              onPress={handleAdd}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Ajouter</Text>
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
  addButton: {
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

export default AddLogPopup; 