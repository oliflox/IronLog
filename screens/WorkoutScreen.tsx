import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, Text, View } from "react-native";

import { WorkoutList } from "../components/WorkoutList";
import { mockWorkouts } from "../mock/workouts";
import { workoutStyles } from "../styles/workout";

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

const WorkoutScreen = ({ navigation }: Props) => {
  return (
    <View style={workoutStyles.workoutContainer}>
      <Text style={workoutStyles.workoutTitle}>Workouts</Text>
      <FlatList
        data={mockWorkouts}
        renderItem={({ item }) => <WorkoutList item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default WorkoutScreen;
