import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text, View } from "react-native";
import EditWorkoutPopup from "../components/EditWorkoutPopup";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useEditMode } from "../contexts/EditModeContext";
import { useWorkoutManager } from "../hooks/useWorkoutManager";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Workout } from "../storage/workoutRepository";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

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

  const handleSaveWorkout = (updatedWorkout: Workout) => {
    updateWorkout(updatedWorkout);
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
      <EditWorkoutPopup
        visible={editPopupVisible}
        workout={selectedWorkout}
        onClose={handleCloseEditPopup}
        onSave={handleSaveWorkout}
      />
    </>
  );
};

export default WorkoutScreen;
