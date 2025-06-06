import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import GenericList from "../components/GenericList";
import { Sessions } from "../mock/Sessions";

type RootStackParamList = {
  Workout: undefined;
  WorkoutSessions: { programId: string };
  WorkoutExercises: { sessionId: string };
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSessions">;

const WorkoutSessionsScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const sessions = Sessions[programId] || [];

  const handleItemPress = (item: any) => {
    navigation.navigate('WorkoutExercises', { sessionId: item.id });
  };

  return (
    <GenericList
      data={sessions.map(session => ({
        id: session.id,
        name: session.day,
        imageUrl: session.imageUrl
      }))}
      onItemPress={handleItemPress}
      title={sessions[0]?.muscleGroup}
    />
  );
};

export default WorkoutSessionsScreen; 