import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import EditExercisePopup from "../components/EditExercisePopup";
import ExerciseList from "../components/ExerciseList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useEditMode } from "../contexts/EditModeContext";
import { useExerciseManager } from "../hooks/useExerciseManager";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Exercise } from "../storage/exerciseRepository";
import { ExerciseTemplate } from "../storage/exerciseTemplateRepository";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutExercises">;

const WorkoutExercisesScreen = ({ route, navigation }: Props) => {
  const { sessionId, selectedExercise } = route.params;
  const { exercises, error, loadExercises, deleteExercise, reorderExercises, updateExercise, createExerciseFromTemplate } = useExerciseManager(sessionId);
  const { editMode } = useEditMode();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedExerciseForEdit, setSelectedExerciseForEdit] = useState<Exercise | null>(null);
  
  // Gérer l'exercice sélectionné depuis la bibliothèque
  useEffect(() => {
    if (selectedExercise) {
      handleAddExerciseFromLibrary(selectedExercise);
    }
  }, [selectedExercise]);

  const handleItemPress = (item: Exercise) => {
    // Navigation vers la page de log de l'exercice
    navigation.navigate("WorkoutLog", { 
      exercise: {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl
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

  const handleAddExerciseFromLibrary = async (template: ExerciseTemplate) => {
    await createExerciseFromTemplate(template);
    // Nettoyer la route pour éviter de re-ajouter l'exercice
    navigation.setParams({ sessionId, selectedExercise: undefined });
  };

  const handleAddButtonPress = () => {
    // Naviguer vers la bibliothèque d'exercices
    navigation.navigate("ExerciseLibrary", { sessionId });
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