import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import AddExercisePopup from "../components/AddExercisePopup";
import EditExercisePopup from "../components/EditExercisePopup";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useEditMode } from "../contexts/EditModeContext";
import { useExerciseManager } from "../hooks/useExerciseManager";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Exercise } from "../storage/exerciseRepository";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutExercises">;

const WorkoutExercisesScreen = ({ route, navigation }: Props) => {
  const { sessionId } = route.params;
  const { exercises, isLoading, error, loadExercises, deleteExercise, reorderExercises, updateExercise, createExercise } = useExerciseManager(sessionId);
  const { editMode } = useEditMode();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  
  const handleItemPress = (item: any) => {
    // Navigation vers l'écran de détail de l'exercice ou log des performances
    console.log('Navigation vers l\'exercice:', item);
    // navigation.navigate("ExerciseDetail", { exerciseId: item.id });
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    await deleteExercise(exerciseId);
  };

  const handleReorderExercises = async (reorderedItems: any[]) => {
    await reorderExercises(reorderedItems);
  };

  const handleUpdateExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setEditPopupVisible(false);
    setSelectedExercise(null);
  };

  const handleSaveExercise = (updatedExercise: Exercise) => {
    updateExercise(updatedExercise);
  };

  const handleAddExercise = (name: string, description?: string, imageUrl?: string) => {
    createExercise(name, description, imageUrl);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <GenericFlatList
        data={exercises}
        onItemPress={handleItemPress}
        title="Exercices"
        onDeleteItem={handleDeleteExercise}
        onReorderItems={handleReorderExercises}
        editMode={editMode}
        onUpdateItem={handleUpdateExercise}
      />
      <GlobalAddButton 
        onRefresh={loadExercises}
        exerciseSessionId={sessionId}
      />
      <EditExercisePopup
        visible={editPopupVisible}
        exercise={selectedExercise}
        onClose={handleCloseEditPopup}
        onSave={handleSaveExercise}
      />
      <AddExercisePopup
        visible={addPopupVisible}
        onClose={() => setAddPopupVisible(false)}
        onAdd={handleAddExercise}
      />
    </>
  );
};

export default WorkoutExercisesScreen; 