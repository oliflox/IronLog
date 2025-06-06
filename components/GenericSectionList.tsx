import React from "react";
import { Image, SectionList, SectionListData, Text, View } from "react-native";
import { sectionListStyles } from "../styles/sectionList";

interface SectionItem {
  id: string;
  repetitions: number;
  weight: number;
  setNumber: number;
}

interface Section {
  title: string;
  data: SectionItem[];
}

interface GenericSectionListProps {
  sections: Section[];
  headerImage?: string;
  headerTitle?: string;
}

const GenericSectionList: React.FC<GenericSectionListProps> = ({
  sections,
  headerImage,
  headerTitle,
}) => {
  const renderItem = ({ item }: { item: SectionItem }) => (
    <View style={sectionListStyles.itemContainer}>
      <Text style={sectionListStyles.setNumber}>Set {item.setNumber}</Text>
      <Text style={sectionListStyles.itemText}>
        <Text style={sectionListStyles.itemNumbers}>{item.repetitions}</Text> reps x <Text style={sectionListStyles.itemNumbers}>{item.weight}</Text> Kg
      </Text>
      <Text style={sectionListStyles.itemText}>edit</Text>
    </View>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<SectionItem, Section>;
  }) => (
    <View style={sectionListStyles.sectionHeader}>
      <Text style={sectionListStyles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderHeader = () => {
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
  };

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
};

export default GenericSectionList;
