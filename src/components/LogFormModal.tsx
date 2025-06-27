import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { ExerciseLog } from '../storage/exerciseLogRepository';
import { ExerciseType } from '../storage/exerciseRepository';

interface LogFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (date: string, sets: { repetitions?: number; weight?: number; duration?: number; order: number }[]) => Promise<void>;
  log?: ExerciseLog | null;
  exerciseType?: ExerciseType;
}

const LogFormModal: React.FC<LogFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  log,
  exerciseType = 'weight_reps',
}) => {
  const [date, setDate] = useState('');
  const [sets, setSets] = useState<{ repetitions?: number; weight?: number; duration?: number; order: number }[]>([
    { order: 0 }
  ]);

  useEffect(() => {
    if (log) {
      setDate(log.date);
      setSets(log.sets.map(set => ({
        repetitions: set.repetitions,
        weight: set.weight,
        duration: set.duration,
        order: set.order
      })));
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setSets([{ order: 0 }]);
    }
  }, [log, visible]);

  const addSet = () => {
    setSets([...sets, { order: sets.length }]);
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      const newSets = sets.filter((_, i) => i !== index);
      setSets(newSets.map((set, i) => ({ ...set, order: i })));
    }
  };

  const updateSet = (index: number, field: 'repetitions' | 'weight' | 'duration', value: string) => {
    const newSets = [...sets];
    if (field === 'duration') {
      // Pour la durée, on attend un format "mm:ss" ou juste des secondes
      const parts = value.split(':');
      let totalSeconds = 0;
      if (parts.length === 2) {
        totalSeconds = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
      } else {
        totalSeconds = parseInt(value) || 0;
      }
      newSets[index] = {
        ...newSets[index],
        [field]: totalSeconds
      };
    } else {
      newSets[index] = {
        ...newSets[index],
        [field]: parseInt(value) || 0
      };
    }
    setSets(newSets);
  };

  const handleSubmit = async () => {
    if (!date.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une date');
      return;
    }

    if (exerciseType === 'weight_reps') {
      if (sets.some(set => !set.repetitions || set.repetitions <= 0 || !set.weight || set.weight <= 0)) {
        Alert.alert('Erreur', 'Veuillez saisir des valeurs valides pour tous les sets');
        return;
      }
    } else {
      if (sets.some(set => !set.duration || set.duration <= 0)) {
        Alert.alert('Erreur', 'Veuillez saisir des durées valides pour tous les sets');
        return;
      }
    }

    try {
      await onSubmit(date, sets);
      onClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le log');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDurationInput = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {log ? 'Modifier le log' : 'Ajouter un log'}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              keyboardType="default"
            />
          </View>

          <View style={styles.setsContainer}>
            <View style={styles.setsHeader}>
              <Text style={styles.label}>Sets</Text>
              <Pressable style={styles.addButton} onPress={addSet}>
                <Text style={styles.addButtonText}>+ Ajouter</Text>
              </Pressable>
            </View>

            {sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setNumber}>Set {index + 1}</Text>
                <View style={styles.setInputs}>
                  {exerciseType === 'weight_reps' ? (
                    <>
                      <View style={styles.inputField}>
                        <Text style={styles.smallLabel}>Répétitions</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={set.repetitions?.toString() || ''}
                          onChangeText={(value) => updateSet(index, 'repetitions', value)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                      <View style={styles.inputField}>
                        <Text style={styles.smallLabel}>Poids (kg)</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={set.weight?.toString() || ''}
                          onChangeText={(value) => updateSet(index, 'weight', value)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                    </>
                  ) : (
                    <View style={styles.inputField}>
                      <Text style={styles.smallLabel}>Durée (mm:ss)</Text>
                      <TextInput
                        style={styles.smallInput}
                        value={set.duration ? formatDurationInput(set.duration) : ''}
                        onChangeText={(value) => updateSet(index, 'duration', value)}
                        keyboardType="default"
                        placeholder="0:00"
                      />
                    </View>
                  )}
                  {sets.length > 1 && (
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeSet(index)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </Pressable>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {log ? 'Modifier' : 'Ajouter'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  smallLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    minWidth: 60,
  },
  durationPreview: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  setsContainer: {
    marginTop: 10,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  setRow: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  setInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  inputField: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogFormModal; 