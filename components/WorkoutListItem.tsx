import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, Pressable, Text } from "react-native";
import { Workout } from "../mock/workouts";
import { workoutStyles } from "../styles/workout";

type RootStackParamList = {
  Workout: undefined;
  WorkoutDays: { programId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WorkoutListItemProps {
  item: Workout;
}

export const WorkoutListItem: React.FC<WorkoutListItemProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable
      style={({ pressed }) => [
        workoutStyles.workoutItem,
        pressed && { opacity: 0.7 }
      ]}
      onPress={() => {
        navigation.navigate("WorkoutDays", { programId: item.id });
      }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={workoutStyles.workoutImage}
      />
      <Text style={workoutStyles.workoutName}>{item.name}</Text>
    </Pressable>
  );
};
