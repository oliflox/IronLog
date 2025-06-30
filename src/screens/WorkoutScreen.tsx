import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text, View } from "react-native";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import NamePopup from "../components/NamePopup";
import { useEditMode } from "../contexts/EditModeContext";
import { useWorkoutManager } from "../hooks/useWorkoutManager";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Workout } from "../storage/workoutRepository";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutHome">;

const WorkoutScreen = ({ navigation }: Props) => {
  const { editMode } = useEditMode();
  const { workouts, error, loadWorkouts, deleteWorkout, reorderWorkouts, updateWorkout } = useWorkoutManager();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutSessions", { programId: item.id });
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    await deleteWorkout(workoutId);
  };

  const handleReorderWorkouts = async (reorderedItems: any[]) => {
    await reorderWorkouts(reorderedItems);
  };

  const handleUpdateWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setEditPopupVisible(false);
    setSelectedWorkout(null);
  };

  const handleSaveWorkoutName = (newName: string) => {
    if (!selectedWorkout) return;
    updateWorkout({ ...selectedWorkout, name: newName });
    setEditPopupVisible(false);
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <GenericFlatList
        data={workouts}
        onItemPress={handleItemPress}
        title="Workouts"
        onDeleteItem={handleDeleteWorkout}
        onReorderItems={handleReorderWorkouts}
        editMode={editMode}
        onUpdateItem={handleUpdateWorkout}
      />
      <GlobalAddButton 
        actionType="workout"
        onRefresh={loadWorkouts} 
      />
      <NamePopup
        visible={editPopupVisible}
        title="Modifier le workout"
        confirmLabel="Enregistrer"
        initialValue={selectedWorkout?.name}
        onClose={handleCloseEditPopup}
        onConfirm={handleSaveWorkoutName}
      />
    </>
  );
};

export default WorkoutScreen;
