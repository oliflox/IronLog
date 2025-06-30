import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator
} from "react-native-draggable-flatlist";
import { Timer } from "../storage/timerRepository";
import { theme } from "../styles/theme";
import { timerStyles } from "../styles/timer";
import DeleteButton from "./DeleteButton";

interface EmptyProps { emptyText?: string; }

interface TimerListProps extends EmptyProps {
  data: Timer[];
  onItemPress?: (item: Timer) => void;
  onDeleteItem?: (itemId: string) => void;
  onReorderItems?: (data: Timer[]) => void;
  onUpdateItem?: (item: Timer) => void;
  editMode?: boolean;
}

const TimerList: React.FC<TimerListProps> = ({ 
  data, 
  onItemPress, 
  onDeleteItem,
  onReorderItems,
  onUpdateItem,
  editMode = false,
  emptyText = 'Aucune donnée',
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}min ${secs}sec`;
    }
    return `${secs}sec`;
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Timer>) => {
    return (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[
            timerStyles.timerItem,
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
            <View style={{ flex: 1 }}>
              <Text style={[
                timerStyles.timerItemText,
                editMode && { color: theme.colors.textSecondary }
              ]}>
                {formatTime(item.duration)}
              </Text>
            </View>
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
    <View style={timerStyles.timerList}>
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

export default TimerList; 