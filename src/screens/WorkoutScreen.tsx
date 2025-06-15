import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import GenericFlatList from "../components/GenericFlatList";
import { mockWorkouts } from "../mock/workouts";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

const WorkoutScreen = ({ navigation }: Props) => {
  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutSessions", { programId: item.id });
  };

  return (
    <GenericFlatList
      data={mockWorkouts}
      onItemPress={handleItemPress}
      title="Workouts"
    />
  );
};

export default WorkoutScreen;
