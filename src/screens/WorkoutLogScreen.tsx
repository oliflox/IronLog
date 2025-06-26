import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AddLogPopup from '../components/AddLogPopup';
import EditDatePopup from '../components/EditDatePopup';
import EditSetPopup from '../components/EditSetPopup';
import GenericSectionList from '../components/GenericSectionList';
import LogFormModal from '../components/LogFormModal';
import { useEditMode } from '../contexts/EditModeContext';
import { useExerciseLogs } from '../hooks/useExerciseLogs';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ExerciseLog } from '../storage/exerciseLogRepository';

interface WorkoutLogScreenProps {
  route: RouteProp<RootStackParamList, 'WorkoutLog'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'WorkoutLog'>;
}

interface SectionItem {
  id: string;
  repetitions: number;
  weight: number;
  setNumber: number;
}

interface Section {
  title: string;
  totalReps: number;
  totalWeight: number;
  data: SectionItem[];
  log: ExerciseLog;
}

const WorkoutLogScreen: React.FC<WorkoutLogScreenProps> = () => {
  const route = useRoute();
  const { exercise } = route.params as WorkoutLogScreenProps['route']['params'];
  const { editMode } = useEditMode();
  
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingLog, setEditingLog] = useState<ExerciseLog | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditSetPopup, setShowEditSetPopup] = useState(false);
  const [showEditDatePopup, setShowEditDatePopup] = useState(false);
  const [selectedSet, setSelectedSet] = useState<SectionItem | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const {
    logs,
    error,
    addSet,
    createLog,
    updateLog,
    deleteLog,
    deleteSet,
    updateLogDate,
    updateSet,
    initializeDefaultLogs,
    refreshLogs
  } = useExerciseLogs(exercise.id);

  const handleAddSet = async (date: string, sets: { repetitions: number; weight: number; order: number }[]) => {
    try {
      await addSet(date, sets[0]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du set:', error);
    }
  };

  const handleEditLog = async (date: string, sets: { repetitions: number; weight: number; order: number }[]) => {
    if (!editingLog) return;
    
    try {
      await updateLog(editingLog.id, date, sets);
      setEditingLog(null);
    } catch (error) {
      console.error('Erreur lors de la modification du log:', error);
    }
  };

  const handleDeleteLog = (log: ExerciseLog) => {
    Alert.alert(
      'Supprimer le log',
      'Êtes-vous sûr de vouloir supprimer ce log ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLog(log.id);
            } catch (error) {
              console.error('Erreur lors de la suppression du log:', error);
            }
          }
        }
      ]
    );
  };

  const handleEditLogPress = (log: ExerciseLog) => {
    setEditingLog(log);
    setShowEditModal(true);
  };

  const handleSetEdit = (set: SectionItem) => {
    setSelectedSet(set);
    setShowEditSetPopup(true);
  };

  const handleSetSave = async (repetitions: number, weight: number) => {
    if (!selectedSet) return;
    
    try {
      await updateSet(selectedSet.id, repetitions, weight);
      setSelectedSet(null);
    } catch (error) {
      console.error('Erreur lors de la modification du set:', error);
    }
  };

  const handleSetDelete = (set: SectionItem) => {
    Alert.alert(
      'Supprimer le set',
      'Êtes-vous sûr de vouloir supprimer ce set ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSet(set.id);
            } catch (error) {
              console.error('Erreur lors de la suppression du set:', error);
            }
          }
        }
      ]
    );
  };

  const handleDateEdit = (section: any) => {
    setSelectedSection(section);
    setShowEditDatePopup(true);
  };

  const handleDateSave = async (newDate: string) => {
    if (!selectedSection) return;
    
    try {
      await updateLogDate(selectedSection.log.id, newDate);
      setSelectedSection(null);
    } catch (error) {
      console.error('Erreur lors de la modification de la date:', error);
    }
  };

  const handleInitializeDefaultLogs = async () => {
    try {
      await initializeDefaultLogs();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des logs par défaut:', error);
    }
  };

  // Récupérer le dernier set pour pré-remplir le formulaire
  const getLastSet = () => {
    if (logs.length === 0) return null;
    
    // Prendre le premier log (le plus récent) et son dernier set
    const latestLog = logs[0];
    if (latestLog.sets.length === 0) return null;
    
    const lastSet = latestLog.sets[latestLog.sets.length - 1];
    return {
      repetitions: lastSet.repetitions,
      weight: lastSet.weight
    };
  };

  const sections: Section[] = logs
    .map((historyItem) => {
      const totalReps = historyItem.sets.reduce((acc, set) => acc + set.repetitions, 0);
      const totalWeight = historyItem.sets.reduce((acc, set) => acc + set.weight, 0);

      const date = new Date(historyItem.date);
      const day = date.getDate();
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const year = date.getFullYear();

      return {
        title: `${day} ${month} ${year}`,
        totalReps,
        totalWeight,
        data: historyItem.sets.map((set, index) => ({
          id: set.id,
          repetitions: set.repetitions,
          weight: set.weight,
          setNumber: index + 1,
        })),
        log: historyItem,
      };
    })
    .filter(section => section.data.length > 0); // Filtrer les sections sans sets

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
        <Pressable onPress={refreshLogs} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GenericSectionList
        sections={sections}
        headerImage={exercise.imageUrl}
        headerTitle={exercise.name}
        onSectionPress={editMode ? (section) => handleEditLogPress(section.log) : undefined}
        onSectionLongPress={editMode ? (section) => handleDeleteLog(section.log) : undefined}
        editMode={editMode}
        onSetEdit={handleSetEdit}
        onSetDelete={handleSetDelete}
        onDateEdit={handleDateEdit}
      />

      {logs.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun log trouvé</Text>
          <Pressable onPress={handleInitializeDefaultLogs} style={styles.initButton}>
            <Text style={styles.initButtonText}>Initialiser avec des données d'exemple</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        onPress={() => setShowAddPopup(true)}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddLogPopup
        visible={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onAdd={handleAddSet}
        lastSet={getLastSet()}
      />

      <EditSetPopup
        visible={showEditSetPopup}
        onClose={() => {
          setShowEditSetPopup(false);
          setSelectedSet(null);
        }}
        onSave={handleSetSave}
        set={selectedSet}
      />

      <EditDatePopup
        visible={showEditDatePopup}
        onClose={() => {
          setShowEditDatePopup(false);
          setSelectedSection(null);
        }}
        onSave={handleDateSave}
        currentDate={selectedSection?.log?.date}
      />

      <LogFormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingLog(null);
        }}
        onSubmit={handleEditLog}
        log={editingLog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  initButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  initButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WorkoutLogScreen; 