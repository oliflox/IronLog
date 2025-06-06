import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import GenericSectionList from '../components/GenericSectionList';

interface ExerciseHistoryScreenProps {
  route: {
    params: {
      exercise: {
        id: string;
        name: string;
        imageUrl: string;
        history: {
          date: string;
          sets: {
            id: string;
            repetitions: number;
            weight: number;
          }[];
        }[];
      };
    };
  };
}

const ExerciseHistoryScreen: React.FC<ExerciseHistoryScreenProps> = () => {
  const route = useRoute();
  const { exercise } = route.params as ExerciseHistoryScreenProps['route']['params'];

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
    <View style={styles.container}>
      <GenericSectionList
        sections={sections}
        headerImage={exercise.imageUrl}
        headerTitle={exercise.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ExerciseHistoryScreen; 