import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import GenericSectionList from '../components/GenericSectionList';
import { RootStackParamList } from '../navigation/AppNavigator';

interface WorkoutLogScreenProps {
  route: RouteProp<RootStackParamList, 'WorkoutLog'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'WorkoutLog'>;
}

const WorkoutLogScreen: React.FC<WorkoutLogScreenProps> = () => {
  const route = useRoute();
  const { exercise } = route.params as WorkoutLogScreenProps['route']['params'];

  const sections = exercise.history.map((historyItem) => {
    const totalReps = historyItem.sets.reduce((acc, set) => acc + set.repetitions, 0);
    const totalWeight = historyItem.sets.reduce((acc, set) => acc + set.weight, 0);

    const date = new Date(historyItem.date);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'short' });
    const year = date.getFullYear();

    return {
      title: `${day} ${month} ${year}`,
      totalReps,
      totalWeight,
      data: historyItem.sets.map((set, index) => ({
        id: set.id,
        repetitions: set.repetitions,
        weight: set.weight,
        setNumber: index + 1,
      })),
    };
  });

  return (
      <GenericSectionList
        sections={sections}
        headerImage={exercise.imageUrl}
        headerTitle={exercise.name}
      />
  );
};

export default WorkoutLogScreen; 