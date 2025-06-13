import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { workoutStyles } from '../styles/workout';

interface ListItem {
  id: string;
  name: string;
  imageUrl?: string;
}

interface GenericFlatListProps {
  data: ListItem[];
  onItemPress?: (item: ListItem) => void;
  title?: string;
}

const GenericFlatList: React.FC<GenericFlatListProps> = ({ data, onItemPress, title }) => {
  const renderItem = ({ item }: { item: ListItem }) => {
    const firstLetter = item.name.charAt(0).toUpperCase();

    return (
      <Pressable
        style={({ pressed }) => [
          workoutStyles.workoutItem,
          pressed && { opacity: 0.7 }
        ]}
        onPress={() => onItemPress?.(item)}
      >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={workoutStyles.workoutImage}
          />
        ) : (
          <View style={[workoutStyles.workoutImage]}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              {firstLetter}
            </Text>
          </View>
        )}
        <Text style={workoutStyles.workoutName}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <View style={workoutStyles.workoutContainer}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
    </View>
  );
};

export default GenericFlatList; 