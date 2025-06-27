import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Pressable, SectionList, SectionListData, StyleSheet, Text, View } from "react-native";
import { ExerciseType } from "../storage/exerciseRepository";
import { sectionListStyles } from "../styles/sectionList";
import { theme } from "../styles/theme";

interface SectionItem {
  id: string;
  repetitions?: number;
  weight?: number;
  duration?: number;
  setNumber: number;
}

interface Section {
  title: string;
  totalReps?: number;
  totalWeight?: number;
  totalDuration?: number;
  data: SectionItem[];
  log?: any; // Pour les actions CRUD
}

interface GenericSectionListProps {
  sections: Section[];
  headerImage?: string;
  headerTitle?: string;
  onSectionPress?: (section: Section) => void;
  onSectionLongPress?: (section: Section) => void;
  showActions?: boolean;
  editMode?: boolean;
  onSetEdit?: (set: SectionItem) => void;
  onSetDelete?: (set: SectionItem) => void;
  onDateEdit?: (section: Section) => void;
  exerciseType?: ExerciseType;
}

const GenericSectionList: React.FC<GenericSectionListProps> = React.memo(({
  sections,
  headerImage,
  headerTitle,
  onSectionPress,
  onSectionLongPress,
  showActions = false,
  editMode = false,
  onSetEdit,
  onSetDelete,
  onDateEdit,
  exerciseType,
}) => {
  const renderItem = ({ item }: { item: SectionItem }) => {
    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isTimeBased = exerciseType === 'time';
    
    return (
      <View style={sectionListStyles.itemContainer}>
        <Text style={sectionListStyles.setNumber}>Set {item.setNumber}</Text>
        <Text style={sectionListStyles.itemText}>
          {isTimeBased ? (
            <Text style={sectionListStyles.itemNumbers}>{formatDuration(item.duration || 0)}</Text>
          ) : (
            <>
              <Text style={sectionListStyles.itemNumbers}>{item.repetitions || 0}</Text> reps x <Text style={sectionListStyles.itemNumbers}>{item.weight || 0}</Text> Kg
            </>
          )}
        </Text>
        {editMode && (
          <View style={styles.setActions}>
            <Pressable
              onPress={() => onSetEdit?.(item)}
              style={styles.setActionButton}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
            </Pressable>
            <Pressable
              onPress={() => onSetDelete?.(item)}
              style={[styles.setActionButton]}
            >
              <Ionicons name="trash" size={16} color="#FF3B30" />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<SectionItem, Section>;
  }) => {
    const sectionData = section as Section;
    const isTimeBased = exerciseType === 'time';
    
    return (
      <View style={sectionListStyles.sectionHeader}>
        <View style={sectionListStyles.sectionHeaderContent}>
          <View style={styles.dateContainer}>
            <Text style={sectionListStyles.sectionHeaderText}>{section.title}</Text>
            {editMode && (
              <Pressable
                onPress={() => onDateEdit?.(sectionData)}
                style={styles.dateEditButton}
              >
                <Ionicons name="pencil" size={16} color={theme.colors.primary} />
              </Pressable>
            )}
          </View>
          <View style={sectionListStyles.sectionTotals}>
            {isTimeBased ? (
              <Text style={sectionListStyles.sectionTotalText}>
                {Math.floor((sectionData.totalDuration || 0) / 60)}:{(sectionData.totalDuration || 0) % 60 < 10 ? '0' : ''}{(sectionData.totalDuration || 0) % 60} <Text style={sectionListStyles.sectionTotalSubText}>min</Text>
              </Text>
            ) : (
              <>
                <Text style={sectionListStyles.sectionTotalText}>
                  {sectionData.totalReps || 0} <Text style={sectionListStyles.sectionTotalSubText}>reps</Text>
                </Text>
                <Text style={sectionListStyles.sectionTotalText}>
                  {sectionData.totalWeight || 0} <Text style={sectionListStyles.sectionTotalSubText}>kg</Text>
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = useMemo(() => {
    if (!headerImage && !headerTitle) return null;

    const firstLetter = headerTitle ? headerTitle.charAt(0).toUpperCase() : "";

    return (
      <View style={sectionListStyles.headerContainer}>
        {headerImage ? (
          <Image
            source={{ uri: headerImage }}
            style={sectionListStyles.workoutImage}
          />
        ) : (
          <View style={[sectionListStyles.workoutImage]}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {firstLetter}
            </Text>
          </View>
        )}
        <Text style={sectionListStyles.headerName}>{headerTitle}</Text>
      </View>
    );
  }, [headerImage, headerTitle]);

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled
      style={sectionListStyles.listContainer}
    />
  );
});

GenericSectionList.displayName = 'GenericSectionList';

const styles = StyleSheet.create({
  setActions: {
    flexDirection: 'row',
    gap: 8,
  },
  setActionButton: {
    padding: 4,
    borderRadius: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateEditButton: {
    padding: 4,
    borderRadius: 4,
  },
});

export default GenericSectionList;
