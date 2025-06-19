import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useExerciseManager } from '../hooks/useExerciseManager';
import { useSessionManager } from '../hooks/useSessionManager';
import { useWorkoutManager } from '../hooks/useWorkoutManager';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import AddExercisePopup from './AddExercisePopup';
import AddSessionPopup from './AddSessionPopup';
import AddWorkoutPopup from './AddWorkoutPopup';
import GlobalPopup from './GlobalPopup';

interface GlobalAddButtonProps {
  onRefresh?: () => void;
  sessionWorkoutId?: string; // Pour les sessions, on a besoin de l'ID du workout parent
  exerciseSessionId?: string; // Pour les exercices, on a besoin de l'ID de la session parent
  style?: any;
}

const GlobalAddButton: React.FC<GlobalAddButtonProps> = ({ 
  onRefresh,
  sessionWorkoutId,
  exerciseSessionId,
  style
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const state = navigation.getState();
  const currentRoute = state?.routes[state?.index ?? 0];
  const currentScreen = currentRoute?.name;
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isAddWorkoutVisible, setIsAddWorkoutVisible] = useState(false);
  const [isAddSessionVisible, setIsAddSessionVisible] = useState(false);
  const [isAddExerciseVisible, setIsAddExerciseVisible] = useState(false);

  const { createWorkout } = useWorkoutManager();
  const { createSession } = sessionWorkoutId ? useSessionManager(sessionWorkoutId) : { createSession: null };
  const { createExercise } = exerciseSessionId ? useExerciseManager(exerciseSessionId) : { createExercise: null };

  const getButtonConfig = (screen: string | undefined) => {
    switch (screen) {
      case 'Calendar':
        return {
          icon: "share-social" as const,
          message: "Partage du calendrier d'entraînement"
        };
      case 'Workout':
        return {
          icon: "add" as const,
          message: "Ajout d'un nouvel exercice"
        };
      case 'WorkoutSessions':
        return {
          icon: "add" as const,
          message: "Ajout d'une nouvelle session"
        };
      case 'WorkoutExercises':
        return {
          icon: "add" as const,
          message: "Ajout d'un nouvel exercice"
        };
      case 'Timer':
        return {
          icon: "add" as const,
          message: "Création d'un nouveau timer"
        };
      case 'Profil':
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

  const { icon, message } = getButtonConfig(currentScreen);

  const handlePress = () => {
    if (currentScreen === 'Workout') {
      setIsAddWorkoutVisible(true);
    } else if (currentScreen === 'WorkoutSessions') {
      setIsAddSessionVisible(true);
    } else if (currentScreen === 'WorkoutExercises') {
      setIsAddExerciseVisible(true);
    } else {
      setPopupMessage(message);
      setIsPopupVisible(true);
    }
  };

  const handleAddWorkout = async (name: string) => {
    const success = await createWorkout(name);
    if (success) {
      setIsAddWorkoutVisible(false);
      onRefresh?.();
    }
  };

  const handleAddSession = async (name: string) => {
    if (sessionWorkoutId && createSession) {
      const success = await createSession(name);
      if (success) {
        setIsAddSessionVisible(false);
        onRefresh?.();
      }
    }
  };

  const handleAddExercise = async (name: string, description?: string) => {
    if (exerciseSessionId && createExercise) {
      const success = await createExercise(name, description);
      if (success) {
        setIsAddExerciseVisible(false);
        onRefresh?.();
      }
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
      
      <AddWorkoutPopup
        visible={isAddWorkoutVisible}
        onClose={() => setIsAddWorkoutVisible(false)}
        onAdd={handleAddWorkout}
      />
      
      <AddSessionPopup
        visible={isAddSessionVisible}
        onClose={() => setIsAddSessionVisible(false)}
        onAdd={handleAddSession}
      />
      
      <AddExercisePopup
        visible={isAddExerciseVisible}
        onClose={() => setIsAddExerciseVisible(false)}
        onAdd={handleAddExercise}
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