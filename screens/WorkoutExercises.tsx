import React from 'react';
import GenericList from '../components/GenericList';
import { exercises } from '../mock/exercises';

const WorkoutExercises: React.FC = () => {
  return (
    <GenericList
      data={exercises}
      title="Exercises"
    />
  );
};

export default WorkoutExercises; 