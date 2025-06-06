import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { workoutStyles } from '../styles/workout';

interface ListItem {
  id: string;
  name: string;
  imageUrl?: string;
}

interface GenericListProps {
  data: ListItem[];
  onItemPress?: (item: ListItem) => void;
  title?: string;
}

const GenericList: React.FC<GenericListProps> = ({ data, onItemPress, title }) => {
  const renderItem = ({ item }: { item: ListItem }) => (
    <Pressable
      style={({ pressed }) => [
        workoutStyles.workoutItem,
        pressed && { opacity: 0.7 }
      ]}
      onPress={() => onItemPress?.(item)}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={workoutStyles.workoutImage}
        />
      )}
      <Text style={workoutStyles.workoutName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={workoutStyles.workoutContainer}>
      {title && <Text style={workoutStyles.workoutTitle}>{title}</Text>}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
    </View>
  );
};

export default GenericList; 