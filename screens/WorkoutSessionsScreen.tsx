import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Sessions, WorkoutDay } from "../mock/Sessions";
import { workoutStyles } from "../styles/workout";

type RootStackParamList = {
  Workout: undefined;
  WorkoutDays: { programId: string };
  WorkoutExercises: { sessionId: string };
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutDays">;

const WorkoutDaysScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const workoutDays = Sessions[programId] || [];

  const renderWorkoutDay = ({ item }: { item: WorkoutDay }) => (
    <Pressable 
      style={({ pressed }) => [
        workoutStyles.workoutItem,
        pressed && { opacity: 0.7 }
      ]}
      onPress={() => {
        navigation.navigate('WorkoutExercises', { sessionId: item.id });
      }}
    >
        <Text style={workoutStyles.sessionName}>{item.day}</Text>
    </Pressable>
  );

  return (
    <View style={workoutStyles.workoutContainer}>
      <Text style={workoutStyles.workoutTitle}>{workoutDays[0].muscleGroup}</Text>
      <FlatList
        data={workoutDays}
        renderItem={renderWorkoutDay}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default WorkoutDaysScreen; 