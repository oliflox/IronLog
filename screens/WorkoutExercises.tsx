import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ExerciseList from '../components/ExerciseList';
import { exercises } from '../mock/exercises';

const WorkoutExercises: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ExerciseList exercises={exercises} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default WorkoutExercises; 