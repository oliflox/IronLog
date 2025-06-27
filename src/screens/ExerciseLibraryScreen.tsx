import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useExerciseManager } from "../hooks/useExerciseManager";
import { useExerciseTemplates } from "../hooks/useExerciseTemplates";
import { RootStackParamList } from "../navigation/AppNavigator";
import { ExerciseType } from "../storage/exerciseRepository";
import { ExerciseTemplate } from "../storage/exerciseTemplateRepository";
import { theme } from "../styles/theme";

const EXERCISE_TYPES: ExerciseType[] = ['weight_reps', 'time'];

const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  'weight_reps': 'Poids et répétitions',
  'time': 'Temps'
};

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseLibrary">;

interface Section {
  title: string;
  data: ExerciseTemplate[];
}

const ExerciseLibraryScreen = ({ route, navigation }: Props) => {
  const { sessionId } = route.params;
  const { templates, muscleGroups, loading, error, getTemplatesByMuscleGroup, createTemplate, loadTemplates } = useExerciseTemplates();
  const { createExerciseFromTemplate } = useExerciseManager(sessionId);
  const [sectionsData, setSectionsData] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    muscleGroup: "",
    description: "",
    imageUrl: "",
    type: "" as ExerciseType | ""
  });

  useEffect(() => {
    const loadSections = async () => {
      if (muscleGroups.length > 0) {
        const sectionsData: Section[] = [];
        
        for (const muscleGroup of muscleGroups) {
          const groupTemplates = await getTemplatesByMuscleGroup(muscleGroup);
          if (groupTemplates.length > 0) {
            sectionsData.push({
              title: muscleGroup,
              data: groupTemplates
            });
          }
        }
        
        setSectionsData(sectionsData);
        setFilteredSections(sectionsData);
      }
    };
    
    loadSections();
  }, [templates, muscleGroups]);

  // Filtrer les sections en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSections(sectionsData);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sectionsData
        .map(section => ({
          ...section,
          data: section.data.filter(exercise => 
            exercise.name.toLowerCase().includes(query) ||
            exercise.muscleGroup.toLowerCase().includes(query) ||
            (exercise.description && exercise.description.toLowerCase().includes(query))
          )
        }))
        .filter(section => section.data.length > 0);
      
      setFilteredSections(filtered);
    }
  }, [searchQuery, sectionsData]);

  const handleExercisePress = async (exercise: ExerciseTemplate) => {
    try {
      // Ajouter directement l'exercice à la session
      await createExerciseFromTemplate(exercise);
      // Revenir à l'écran précédent
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter l'exercice à la session");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleAddCustomExercise = () => {
    setShowAddModal(true);
  };

  const handleSaveCustomExercise = async () => {
    if (!newExercise.name.trim() || !newExercise.muscleGroup.trim()) {
      Alert.alert("Erreur", "Le nom et le groupe musculaire sont obligatoires");
      return;
    }

    // Vérifier si le type et la catégorie sont sélectionnés
    if (!newExercise.type) {
      Alert.alert("Erreur", "Le type d'exercice est obligatoire");
      return;
    }

    try {
      await createTemplate(
        newExercise.name.trim(),
        newExercise.muscleGroup.trim(),
        newExercise.description.trim() || undefined,
        newExercise.imageUrl.trim() || undefined,
        newExercise.type
      );
      
      // Réinitialiser le formulaire
      setNewExercise({
        name: "",
        muscleGroup: "",
        description: "",
        imageUrl: "",
        type: "" as ExerciseType | ""
      });
      
      setShowAddModal(false);
      
      // Recharger les templates
      await loadTemplates();
      
      Alert.alert("Succès", "Exercice ajouté à la bibliothèque !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter l'exercice");
    }
  };

  const handleCancelAdd = () => {
    setNewExercise({
      name: "",
      muscleGroup: "",
      description: "",
      imageUrl: "",
      type: "" as ExerciseType | ""
    });
    setShowAddModal(false);
  };

  const handleSelectMuscleGroup = (muscleGroup: string) => {
    setNewExercise({...newExercise, muscleGroup});
    setShowMuscleGroupPicker(false);
  };

  const handleSelectType = (type: ExerciseType) => {
    setNewExercise({...newExercise, type});
    setShowTypePicker(false);
  };

  const handlePickImage = async () => {
    try {
      // Demander les permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre galerie.');
        return;
      }

      // Ouvrir le picker d'images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewExercise({...newExercise, imageUrl: result.assets[0].uri});
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const getDefaultImageForMuscleGroup = (muscleGroup: string) => {
    const defaultImages = {
      'Pectoraux': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Dos': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Épaules': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Biceps': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Triceps': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Jambes': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      'Abdominaux': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
    };
    return defaultImages[muscleGroup as keyof typeof defaultImages] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop';
  };

  const renderExerciseItem = ({ item }: { item: ExerciseTemplate }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => handleExercisePress(item)}
    >
      {/* Vignette à gauche */}
      <View style={styles.exerciseThumbnail}>
        <Image
          source={{ 
            uri: item.imageUrl || getDefaultImageForMuscleGroup(item.muscleGroup)
          }}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.exerciseDescription}>{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Chargement des exercices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un exercice..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery.trim() === "" 
                ? "Aucun exercice disponible" 
                : `Aucun exercice trouvé pour "${searchQuery}"`
              }
            </Text>
          </View>
        }
      />

      {/* Bouton d'ajout d'exercice custom */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCustomExercise}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal d'ajout d'exercice custom */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Ajouter un exercice custom</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Nom de l'exercice *"
                value={newExercise.name}
                onChangeText={(text) => setNewExercise({...newExercise, name: text})}
              />
              
              {/* Sélecteur de groupe musculaire */}
              <TouchableOpacity
                style={styles.modalInput}
                onPress={() => setShowMuscleGroupPicker(true)}
              >
                <Text style={[
                  styles.placeholderText,
                  newExercise.muscleGroup ? styles.selectedText : {}
                ]}>
                  {newExercise.muscleGroup || "Sélectionner un groupe musculaire *"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} style={styles.chevronIcon} />
              </TouchableOpacity>
              
              {/* Sélecteur de type d'exercice */}
              <TouchableOpacity
                style={styles.modalInput}
                onPress={() => setShowTypePicker(true)}
              >
                <Text style={[
                  styles.placeholderText,
                  newExercise.type ? styles.selectedText : {}
                ]}>
                  {newExercise.type ? EXERCISE_TYPE_LABELS[newExercise.type] : "Sélectionner le type d'exercice *"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} style={styles.chevronIcon} />
              </TouchableOpacity>
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Description (optionnel)"
                value={newExercise.description}
                onChangeText={(text) => setNewExercise({...newExercise, description: text})}
                multiline
                numberOfLines={3}
              />
              
              {/* Image picker */}
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handlePickImage}
              >
                {newExercise.imageUrl ? (
                  <Image
                    source={{ uri: newExercise.imageUrl }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Ionicons name="camera" size={32} color={theme.colors.textSecondary} />
                    <Text style={styles.imagePickerText}>Sélectionner une image</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelAdd}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveCustomExercise}
                >
                  <Text style={styles.saveButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Picker de groupe musculaire */}
      {showMuscleGroupPicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Sélectionner un groupe musculaire</Text>
            <ScrollView style={styles.pickerScrollView}>
              {muscleGroups.map((muscleGroup) => (
                <TouchableOpacity
                  key={muscleGroup}
                  style={styles.pickerOption}
                  onPress={() => handleSelectMuscleGroup(muscleGroup)}
                >
                  <Text style={styles.pickerOptionText}>{muscleGroup}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCancelButton}
              onPress={() => setShowMuscleGroupPicker(false)}
            >
              <Text style={styles.pickerCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Picker de type d'exercice */}
      {showTypePicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Sélectionner le type d'exercice</Text>
            <ScrollView style={styles.pickerScrollView}>
              {EXERCISE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.pickerOption}
                  onPress={() => handleSelectType(type)}
                >
                  <Text style={styles.pickerOptionText}>{EXERCISE_TYPE_LABELS[type]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCancelButton}
              onPress={() => setShowTypePicker(false)}
            >
              <Text style={styles.pickerCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mainBg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.mainBg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.mainBg,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.mainBg,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.regular,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  listContainer: {
    paddingBottom: theme.spacing.lg,
  },
  sectionHeader: {
    backgroundColor: theme.colors.itemBg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.itemBg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.mainBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.itemBg,
  },
  exerciseThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContainer: {
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.mainBg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textArea: {
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'white',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'white',
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    flex: 1,
  },
  selectedText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  chevronIcon: {
    marginLeft: theme.spacing.xs,
  },
  imagePickerButton: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.itemBg,
    borderStyle: 'dashed',
  },
  imagePickerPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.mainBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.itemBg,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: theme.colors.mainBg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '80%',
    maxHeight: '80%',
  },
  pickerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  pickerScrollView: {
    maxHeight: 200,
    marginBottom: theme.spacing.md,
  },
  pickerOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.itemBg,
  },
  pickerOptionText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  pickerCancelButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  pickerCancelText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'white',
  },
});

export default ExerciseLibraryScreen; 