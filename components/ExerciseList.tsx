import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Exercise } from '../mock/exercises';

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const renderItem = ({ item }: { item: Exercise }) => (
    <View style={styles.exerciseCard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.exerciseImage}
      />
      <Text style={styles.exerciseName}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  exerciseCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exerciseImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  exerciseName: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExerciseList; 