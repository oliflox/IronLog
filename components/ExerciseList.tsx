import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { Exercise } from '../mock/exercises';
import { workoutStyles } from '../styles/workout';

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const renderItem = ({ item }: { item: Exercise }) => (
    <View style={workoutStyles.workoutItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={workoutStyles.workoutImage}
      />
      <Text style={workoutStyles.workoutName}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={1}
    />
  );
};

export default ExerciseList; 