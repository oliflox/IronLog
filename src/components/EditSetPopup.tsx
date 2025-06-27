import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseType } from '../storage/exerciseRepository';
import { theme } from '../styles/theme';

interface EditSetPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (repetitions?: number, weight?: number, duration?: number) => void;
  set?: { repetitions?: number; weight?: number; duration?: number } | null;
  exerciseType?: ExerciseType;
}

const EditSetPopup: React.FC<EditSetPopupProps> = ({ visible, onClose, onSave, set, exerciseType = 'weight_reps' }) => {
  const [repetitions, setRepetitions] = useState('');
  const [weight, setWeight] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  useEffect(() => {
    if (visible && set) {
      if (exerciseType === 'weight_reps') {
        setRepetitions(set.repetitions?.toString() || '');
        setWeight(set.weight?.toString() || '');
        setMinutes('');
        setSeconds('');
      } else {
        const totalSeconds = set.duration || 0;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        setMinutes(mins.toString());
        setSeconds(secs.toString());
        setRepetitions('');
        setWeight('');
      }
    } else if (visible) {
      setRepetitions('');
      setWeight('');
      setMinutes('');
      setSeconds('');
    }
  }, [visible, set, exerciseType]);

  const handleSave = () => {
    if (exerciseType === 'weight_reps') {
      const reps = parseInt(repetitions) || 0;
      const weightValue = parseFloat(weight) || 0;
      
      if (reps <= 0 || weightValue <= 0) {
        return;
      }
      
      onSave(reps, weightValue);
    } else {
      const mins = parseInt(minutes) || 0;
      const secs = parseInt(seconds) || 0;
      const totalSeconds = mins * 60 + secs;
      
      if (totalSeconds <= 0) {
        return;
      }
      
      onSave(undefined, undefined, totalSeconds);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isValid = exerciseType === 'weight_reps' 
    ? (parseInt(repetitions) || 0) > 0 && (parseFloat(weight) || 0) > 0
    : (parseInt(minutes) || 0) > 0 || (parseInt(seconds) || 0) > 0;

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
            {exerciseType === 'weight_reps' ? (
              <>
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
              </>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Durée</Text>
                <View style={styles.durationContainer}>
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={minutes}
                      onChangeText={setMinutes}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                    <Text style={styles.durationUnit}>min</Text>
                  </View>
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={seconds}
                      onChangeText={(value) => {
                        const secs = parseInt(value) || 0;
                        if (secs >= 0 && secs < 60) {
                          setSeconds(value);
                        }
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                    <Text style={styles.durationUnit}>sec</Text>
                  </View>
                </View>
              </View>
            )}
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
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  durationUnit: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
    marginRight: 5,
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