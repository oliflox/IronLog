import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import AddButton from "../components/AddButton";
import GenericFlatList from "../components/GenericFlatList";
import { useWorkouts } from "../hooks/useWorkouts";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

const WorkoutScreen = ({ navigation }: Props) => {
  const { workouts, isLoading, error, refreshWorkouts } = useWorkouts();

  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutSessions", { programId: item.id });
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
      />
      <AddButton onRefresh={refreshWorkouts} />
    </>
  );
};

export default WorkoutScreen;
