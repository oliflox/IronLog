import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useWorkouts } from "../hooks/useWorkouts";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Workout, workoutRepository } from "../storage/workoutRepository";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

const WorkoutScreen = ({ navigation }: Props) => {
  const { workouts, isLoading, error, refreshWorkouts } = useWorkouts();

  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutSessions", { programId: item.id });
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await workoutRepository.deleteWorkout(workoutId);
      await refreshWorkouts();
    } catch (err) {
      console.error('Erreur lors de la suppression du workout:', err);
    }
  };

  const handleReorderWorkouts = async (reorderedItems: any[]) => {
    try {
      const reorderedWorkouts = reorderedItems.map((item, index) => ({
        ...item,
        order: index
      })) as Workout[];
      
      await workoutRepository.reorderWorkouts(reorderedWorkouts);
      await refreshWorkouts();
    } catch (err) {
      console.error('Erreur lors de la réorganisation des workouts:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
      />
      <GlobalAddButton onRefresh={refreshWorkouts} />
    </>
  );
};

export default WorkoutScreen;
