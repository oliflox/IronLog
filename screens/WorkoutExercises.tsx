import React from 'react';
import GenericFlatList from '../components/GenericFlatList';
import { exercises } from '../mock/exercises';

const WorkoutExercises: React.FC = () => {
  return (
    <GenericFlatList
      data={exercises}
      title="Exercises"
    />
  );
};

export default WorkoutExercises; 