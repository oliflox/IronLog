import React from 'react';
import { SafeAreaView, View } from 'react-native';
import ExerciseList from '../components/ExerciseList';
import { exercises } from '../mock/exercises';
import { workoutStyles } from '../styles/workout';

const WorkoutExercises: React.FC = () => {
  return (
      <View style={workoutStyles.workoutContainer}>
        <ExerciseList exercises={exercises} />
      </View>
  );
};

export default WorkoutExercises; 