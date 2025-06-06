import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import GenericFlatList from '../components/GenericFlatList';
import { exerciseHistory } from '../mock/exerciseHistory';
import { exercises } from '../mock/exercises';

type RootStackParamList = {
  ExerciseHistory: {
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseHistory'>;

const WorkoutExercises: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleExercisePress = (exercise: any) => {
    const exerciseData = exerciseHistory[exercise.id];
    if (exerciseData) {
      navigation.navigate('ExerciseHistory', {
        exercise: exerciseData,
      });
    }
  };

  return (
    <GenericFlatList
      data={exercises}
      title="Exercises"
      onItemPress={handleExercisePress}
    />
  );
};

export default WorkoutExercises; 