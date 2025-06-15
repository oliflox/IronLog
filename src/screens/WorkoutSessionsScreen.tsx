import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import GenericFlatList from "../components/GenericFlatList";
import { Sessions } from "../mock/Sessions";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSessions">;

const WorkoutSessionsScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const sessions = Sessions[programId] || [];

  const handleItemPress = (item: any) => {
    navigation.navigate('WorkoutExercises', { sessionId: item.id });
  };

  return (
    <GenericFlatList
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