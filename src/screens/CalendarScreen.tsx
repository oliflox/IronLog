import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
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

  // Synchroniser la date sélectionnée avec le hook
  useEffect(() => {
    if (lastSelectedDate !== selected) {
      setSelected(lastSelectedDate);
    }
  }, [lastSelectedDate, selected]);

  // Rafraîchir les données quand on revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      console.log('Focus sur CalendarScreen - rafraîchissement des données');
      refreshAll();
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
    console.log('Dates avec logs:', datesWithLogs);
    
    setSelected(dateString);
    
    if (datesWithLogs.includes(dateString)) {
      console.log('Chargement des logs pour:', dateString);
      await loadLogsForDate(dateString);
    } else {
      console.log('Aucun log pour cette date, vidage de la sélection');
      clearSelectedDateLogs();
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

  const renderExerciseItem = ({ item }: { item: ExerciseLogWithExercise }) => (
    <View style={calendarStyles.exerciseItem}>
      <Text style={calendarStyles.exerciseTitle}>{item.exerciseName}</Text>
      <View style={calendarStyles.setsContainer}>
        {item.sets.map((set, index) => (
          <Text key={set.id} style={calendarStyles.exerciseDetails}>
            Set {index + 1}: {set.repetitions} reps × {set.weight}kg
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
    </View>
  );
};

export default CalendarScreen; 