import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import EditExercisePopup from "../components/EditExercisePopup";
import ExerciseList from "../components/ExerciseList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useEditMode } from "../contexts/EditModeContext";
import { useExerciseManager } from "../hooks/useExerciseManager";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Exercise } from "../storage/exerciseRepository";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutExercises">;

const WorkoutExercisesScreen = ({ route, navigation }: Props) => {
  const { sessionId } = route.params;
  const { exercises, error, loadExercises, deleteExercise, reorderExercises, updateExercise } = useExerciseManager(sessionId);
  const { editMode } = useEditMode();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedExerciseForEdit, setSelectedExerciseForEdit] = useState<Exercise | null>(null);
  
  // Recharger les exercices quand l'écran revient au focus
  useFocusEffect(
    useCallback(() => {
      const refreshExercises = async () => {
        await loadExercises();
      };
      refreshExercises();
    }, [sessionId])
  );
  
  const handleItemPress = (item: Exercise) => {
    // Navigation vers la page de log de l'exercice
    navigation.navigate("WorkoutLog", { 
      exercise: {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        type: item.type
      }
    });
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    await deleteExercise(exerciseId);
  };

  const handleReorderExercises = async (reorderedItems: Exercise[]) => {
    await reorderExercises(reorderedItems);
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    setSelectedExerciseForEdit(exercise);
    setEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setEditPopupVisible(false);
    setSelectedExerciseForEdit(null);
  };

  const handleSaveExercise = (updatedExercise: Exercise) => {
    updateExercise(updatedExercise);
  };

  const handleAddButtonPress = () => {
    // Naviguer vers la bibliothèque d'exercices
    navigation.push("ExerciseLibrary", { sessionId });
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <ExerciseList
        data={exercises}
        onItemPress={handleItemPress}
        title="Exercices"
        onDeleteItem={handleDeleteExercise}
        onReorderItems={handleReorderExercises}
        editMode={editMode}
        onUpdateItem={handleUpdateExercise}
        showEditButton={false}
      />
      <GlobalAddButton 
        actionType="exercise"
        onPress={handleAddButtonPress}
      />
      <EditExercisePopup
        visible={editPopupVisible}
        exercise={selectedExerciseForEdit}
        onClose={handleCloseEditPopup}
        onSave={handleSaveExercise}
      />
    </>
  );
};

export default WorkoutExercisesScreen; 