import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import GenericSectionList from '../components/GenericSectionList';
import { RootStackParamList } from '../navigation/AppNavigator';

interface WorkoutLogScreenProps {
  route: RouteProp<RootStackParamList, 'WorkoutLog'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'WorkoutLog'>;
}

const WorkoutLogScreen: React.FC<WorkoutLogScreenProps> = () => {
  const route = useRoute();
  const { exercise } = route.params as WorkoutLogScreenProps['route']['params'];

  const sections = exercise.history.map((historyItem) => ({
    title: new Date(historyItem.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }),
    data: historyItem.sets.map((set, index) => ({
      id: set.id,
      repetitions: set.repetitions,
      weight: set.weight,
      setNumber: index + 1,
    })),
  }));

  return (
      <GenericSectionList
        sections={sections}
        headerImage={exercise.imageUrl}
        headerTitle={exercise.name}
      />
  );
};

export default WorkoutLogScreen; 