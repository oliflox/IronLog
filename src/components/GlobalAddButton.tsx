import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useExerciseManager } from '../hooks/useExerciseManager';
import { useSessionManager } from '../hooks/useSessionManager';
import { useTimerManager } from '../hooks/useTimerManager';
import { useWorkoutManager } from '../hooks/useWorkoutManager';
import { theme } from '../styles/theme';
import ExercisePopup from './ExercisePopup';
import GlobalPopup from './GlobalPopup';
import NamePopup from './NamePopup';
import TimerPopup from './TimerPopup';

type ActionType = 'workout' | 'session' | 'exercise' | 'timer' | 'calendar' | 'profile';

interface GlobalAddButtonProps {
  actionType: ActionType;
  onRefresh?: () => void;
  onPress?: () => void;
  sessionWorkoutId?: string; // Pour les sessions, on a besoin de l'ID du workout parent
  exerciseSessionId?: string; // Pour les exercices, on a besoin de l'ID de la session parent
  style?: any;
}

const GlobalAddButton: React.FC<GlobalAddButtonProps> = ({ 
  actionType,
  onRefresh,
  onPress,
  sessionWorkoutId,
  exerciseSessionId,
  style
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isAddWorkoutVisible, setIsAddWorkoutVisible] = useState(false);
  const [isAddSessionVisible, setIsAddSessionVisible] = useState(false);
  const [isAddExerciseVisible, setIsAddExerciseVisible] = useState(false);
  const [isAddTimerVisible, setIsAddTimerVisible] = useState(false);

  const { createWorkout } = useWorkoutManager();
  const { createSession } = sessionWorkoutId ? useSessionManager(sessionWorkoutId) : { createSession: null };
  const { createExercise } = exerciseSessionId ? useExerciseManager(exerciseSessionId) : { createExercise: null };
  const { createTimer } = useTimerManager();

  const getButtonConfig = (type: ActionType) => {
    switch (type) {
      case 'calendar':
        return {
          icon: "share-social" as const,
          message: "Partage du calendrier d'entraînement"
        };
      case 'workout':
        return {
          icon: "add" as const,
          message: "Ajout d'un nouveau workout"
        };
      case 'session':
        return {
          icon: "add" as const,
          message: "Ajout d'une nouvelle session"
        };
      case 'exercise':
        return {
          icon: "add" as const,
          message: "Ajout d'un nouvel exercice"
        };
      case 'timer':
        return {
          icon: "add" as const,
          message: "Création d'un nouveau timer"
        };
      case 'profile':
        return {
          icon: "add" as const,
          message: "Ajout d'une nouvelle statistique"
        };
      default:
        return {
          icon: "add" as const,
          message: "Action non définie"
        };
    }
  };

  const { icon, message } = getButtonConfig(actionType);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (actionType === 'workout') {
      setIsAddWorkoutVisible(true);
    } else if (actionType === 'session') {
      setIsAddSessionVisible(true);
    } else if (actionType === 'exercise') {
      setIsAddExerciseVisible(true);
    } else if (actionType === 'timer') {
      setIsAddTimerVisible(true);
    } else {
      setPopupMessage(message);
      setIsPopupVisible(true);
    }
  };

  const handleAddWorkout = async (name: string) => {
    try {
      await createWorkout(name);
      setIsAddWorkoutVisible(false);
      onRefresh?.();
    } catch (error) {
      console.error('Erreur lors de la création du workout:', error);
    }
  };

  const handleAddSession = async (name: string) => {
    if (sessionWorkoutId && createSession) {
      try {
        await createSession(name);
        setIsAddSessionVisible(false);
        onRefresh?.();
      } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
      }
    }
  };

  const handleAddExercise = async (name: string, description?: string, imageUrl?: string) => {
    if (exerciseSessionId && createExercise) {
      try {
        await createExercise(name, description, imageUrl);
        setIsAddExerciseVisible(false);
        onRefresh?.();
      } catch (error) {
        console.error('Erreur lors de la création de l\'exercice:', error);
      }
    }
  };

  const handleAddTimer = async (duration: number) => {
    try {
      await createTimer(duration);
      setIsAddTimerVisible(false);
      onRefresh?.();
    } catch (error) {
      console.error('Erreur lors de la création du timer:', error);
    }
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <Pressable
          style={styles.button}
          onPress={handlePress}
        >
          <Ionicons name={icon} size={30} color="white" />
        </Pressable>
      </View>
      
      <GlobalPopup
        visible={isPopupVisible}
        message={popupMessage}
        onClose={() => setIsPopupVisible(false)}
      />
      
      {/* Ajout Workout */}
      <NamePopup
        visible={isAddWorkoutVisible}
        title="Ajouter un workout"
        confirmLabel="Ajouter"
        onClose={() => setIsAddWorkoutVisible(false)}
        onConfirm={handleAddWorkout}
      />

      {/* Ajout Session */}
      <NamePopup
        visible={isAddSessionVisible}
        title="Ajouter une session"
        confirmLabel="Ajouter"
        onClose={() => setIsAddSessionVisible(false)}
        onConfirm={handleAddSession}
      />

      {/* Ajout Exercice */}
      <ExercisePopup
        visible={isAddExerciseVisible}
        onClose={() => setIsAddExerciseVisible(false)}
        onAdd={handleAddExercise}
      />

      {/* Ajout Timer */}
      <TimerPopup
        visible={isAddTimerVisible}
        onClose={() => setIsAddTimerVisible(false)}
        onAdd={handleAddTimer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlobalAddButton; 