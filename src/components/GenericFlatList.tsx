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

interface EmptyProps {
  emptyText?: string;
}

interface GenericFlatListProps extends EmptyProps {
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
  emptyText = 'Aucune donnée',
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
              editMode && { opacity: 0.6 },
            ]}
            onPress={() => {
              if (!editMode) {
                onItemPress?.(item);
              }
            }}
            disabled={editMode}
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
            <Text style={[
              workoutStyles.workoutName,
              editMode && { color: theme.colors.textSecondary }
            ]}>{item.name}</Text>
            {editMode && (
              <View style={{ marginLeft: 8, opacity: 0.6 }}>
                <Ionicons name="lock-closed" size={16} color={theme.colors.textSecondary} />
              </View>
            )}
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
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>{emptyText}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default GenericFlatList;
