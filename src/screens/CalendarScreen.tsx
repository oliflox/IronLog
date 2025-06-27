import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, Share, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendarLogs } from '../hooks/useCalendarLogs';
import { ExerciseLogWithExercise } from '../storage/exerciseLogRepository';
import { calendarStyles, calendarTheme } from '../styles/calendar';
import { theme } from '../styles/theme';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type MarkedDate = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const CalendarScreen = ({ navigation }: Props) => {
  const [selected, setSelected] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { 
    datesWithLogs, 
    selectedDateLogs, 
    loading, 
    error,
    loadLogsForDate, 
    clearSelectedDateLogs, 
    refreshAll,
    lastSelectedDate 
  } = useCalendarLogs();

  // Recharger les données quand l'utilisateur revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          await refreshAll();
        } catch (error) {
          console.error('Erreur lors du rechargement des données:', error);
        }
      };
      
      loadData();
    }, [refreshAll])
  );

  // Préparation des dates marquées pour le calendrier
  const markedDates = datesWithLogs.reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: theme.colors.primary,
    };
    return acc;
  }, {} as Record<string, MarkedDate>);

  // Ajout de la date sélectionnée
  if (selected) {
    markedDates[selected] = {
      ...markedDates[selected],
      selected: true,
      selectedColor: theme.colors.primary,
    };
  }

  const handleDayPress = async (day: { dateString: string }) => {
    const dateString = day.dateString;
    console.log('Clic sur la date:', dateString);
    
    setSelected(dateString);
    
    // Toujours essayer de charger les logs pour cette date
    try {
      await loadLogsForDate(dateString);
    } catch (error) {
      console.log('Aucun log pour cette date ou erreur de chargement');
      // La liste sera vide naturellement si pas de données
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setRefreshing(false);
    }
  };

  const formatSetDisplay = (set: any, exerciseType: string) => {
    if (exerciseType === 'time') {
      // Format pour les exercices de temps
      const duration = set.duration || 0;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `Set ${set.order + 1}: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      // Format pour les exercices de poids/reps
      return `Set ${set.order + 1}: ${set.repetitions || 0} reps × ${set.weight || 0}kg`;
    }
  };

  const formatSetForShare = (set: any, exerciseType: string) => {
    if (exerciseType === 'time') {
      const duration = set.duration || 0;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `  Set ${set.order + 1}: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `  Set ${set.order + 1}: ${set.repetitions || 0} reps × ${set.weight || 0}kg`;
    }
  };

  const handleShare = async () => {
    if (!selected) {
      Alert.alert('Aucune date sélectionnée', 'Veuillez sélectionner une date pour partager les données.');
      return;
    }

    if (selectedDateLogs.length === 0) {
      Alert.alert('Aucune donnée', 'Aucun exercice enregistré pour cette date.');
      return;
    }

    try {
      // Formater la date
      const dateObj = new Date(selected);
      const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Créer le contenu à partager
      let shareContent = `📅 Entraînement du ${formattedDate}\n\n`;
      
      selectedDateLogs.forEach((log, index) => {
        shareContent += `🏋️ ${log.exerciseName}\n`;
        log.sets.forEach((set, setIndex) => {
          shareContent += formatSetForShare(set, log.exerciseType) + '\n';
        });
        if (index < selectedDateLogs.length - 1) {
          shareContent += '\n';
        }
      });

      shareContent += '\n💪 Partagé depuis IronLog';

      await Share.share({
        message: shareContent,
        title: `Entraînement du ${formattedDate}`,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert('Erreur', 'Impossible de partager les données.');
    }
  };

  const renderExerciseItem = ({ item }: { item: ExerciseLogWithExercise }) => (
    <View style={calendarStyles.exerciseItem}>
      <Text style={calendarStyles.exerciseTitle}>{item.exerciseName}</Text>
      <View style={calendarStyles.setsContainer}>
        {item.sets.map((set, index) => (
          <Text key={set.id} style={calendarStyles.exerciseDetails}>
            {formatSetDisplay(set, item.exerciseType)}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={calendarStyles.container}>
      <Text style={calendarStyles.title}>Calendrier</Text>
      <View style={calendarStyles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={calendarTheme}
        />
      </View>
      
      {error && (
        <Text style={[calendarStyles.exerciseDetails, { color: 'red' }]}>
          Erreur: {error}
        </Text>
      )}
      
      {loading ? (
        <Text style={calendarStyles.exerciseDetails}>Chargement...</Text>
      ) : (
        <FlatList
          data={selectedDateLogs}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id}
          style={calendarStyles.exerciseList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <Text style={calendarStyles.exerciseDetails}>
              {selected 
                ? 'Aucun exercice enregistré pour cette date'
                : 'Sélectionnez une date pour voir les exercices'
              }
            </Text>
          }
        />
      )}

      {/* Bouton de partage flottant */}
      <TouchableOpacity
        style={calendarStyles.shareButton}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Ionicons name="share-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CalendarScreen; 