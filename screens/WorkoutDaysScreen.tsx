import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { WorkoutDay, workoutDaysByProgram } from "../mock/workoutDays";
import { workoutDaysStyles } from "../styles/workoutDays";

type RootStackParamList = {
  Workout: undefined;
  WorkoutDays: { programId: string };
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutDays">;

const WorkoutDaysScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const workoutDays = workoutDaysByProgram[programId] || [];

  const renderWorkoutDay = ({ item }: { item: WorkoutDay }) => (
    <Pressable 
      style={({ pressed }) => [
        workoutDaysStyles.workoutDayItem,
        pressed && { opacity: 0.7 }
      ]}
      onPress={() => {
        console.log('Navigate to exercises for day:', item.day);
      }}
    >
        <Text style={workoutDaysStyles.workoutDayTitle}>{item.day}</Text>
    </Pressable>
  );

  return (
    <View style={workoutDaysStyles.container}>
      <Text style={workoutDaysStyles.title}>{workoutDays[0].muscleGroup}</Text>
      <FlatList
        data={workoutDays}
        renderItem={renderWorkoutDay}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default WorkoutDaysScreen; 