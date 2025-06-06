import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import GenericList from "../components/GenericList";
import { mockWorkouts } from "../mock/workouts";

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
  WorkoutSessions: { programId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

const WorkoutScreen = ({ navigation }: Props) => {
  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutSessions", { programId: item.id });
  };

  return (
    <GenericList
      data={mockWorkouts}
      onItemPress={handleItemPress}
      title="Workouts"
    />
  );
};

export default WorkoutScreen;
