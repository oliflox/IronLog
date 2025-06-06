import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import GenericFlatList from "../components/GenericFlatList";
import { exercises } from "../mock/exercises";
import { workoutLog } from "../mock/workoutLog";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "WorkoutLog"
>;

interface WorkoutExercisesProps {
  navigation: NavigationProp;
  route: {
    params: {
      sessionId: string;
    };
  };
}

const WorkoutExercises: React.FC<WorkoutExercisesProps> = ({ navigation }) => {
  const handleExercisePress = (exercise: any) => {
    const exerciseData = workoutLog[exercise.id];
    if (exerciseData) {
      navigation.navigate("WorkoutLog", {
        exercise: exerciseData,
      });
    }
  };

  return (
    <GenericFlatList
      data={exercises}
      title="Exercices"
      onItemPress={handleExercisePress}
    />
  );
};

export default WorkoutExercises;
