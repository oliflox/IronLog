import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator
} from "react-native-draggable-flatlist";
import { theme } from "../styles/theme";
import { workoutStyles } from "../styles/workout";
import DeleteButton from "./DeleteButton";

interface ListItem {
  id: string;
  name: string;
  imageUrl?: string;
  order?: number;
}

interface GenericFlatListProps {
  data: ListItem[];
  onItemPress?: (item: ListItem) => void;
  title?: string;
  onDeleteItem?: (itemId: string) => void;
  onReorderItems?: (data: ListItem[]) => void;
  onUpdateItem?: (item: ListItem) => void;
  editMode?: boolean;
}

const GenericFlatList: React.FC<GenericFlatListProps> = ({ 
  data, 
  onItemPress, 
  title, 
  onDeleteItem,
  onReorderItems,
  onUpdateItem,
  editMode = false,
}) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    const firstLetter = item.name.charAt(0).toUpperCase();

    return (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[
            workoutStyles.workoutItem,
            { opacity: isActive ? 0.5 : 1 }
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              { flex: 1, flexDirection: "row", alignItems: "center" },
              pressed && { opacity: 0.7 },
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
                <Text
                  style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
                >
                  {firstLetter}
                </Text>
              </View>
            )}
            <Text style={workoutStyles.workoutName}>{item.name}</Text>
          </Pressable>
          {onDeleteItem && editMode && (
            <DeleteButton onDelete={() => onDeleteItem(item.id)} />
          )}
          {onUpdateItem && editMode && (
            <Pressable
              style={{ padding: 8, marginLeft: 4 }}
              onPress={() => onUpdateItem(item)}
            >
              <Ionicons name="pencil" size={20} color={theme.colors.primary} />
            </Pressable>
          )}
          {onReorderItems && editMode && (
            <Pressable
              style={{ padding: 8, marginLeft: 4 }}
              onLongPress={drag}
            >
              <Ionicons name="reorder-three" size={20} color={theme.colors.primary} />
            </Pressable>
          )}
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <View style={workoutStyles.workoutContainer}>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => onReorderItems?.(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default GenericFlatList;
