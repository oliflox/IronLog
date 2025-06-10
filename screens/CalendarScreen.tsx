import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Exercise, mockWorkouts } from '../mock/workoutData';
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

  // Préparation des dates marquées pour le calendrier
  const markedDates = Object.keys(mockWorkouts).reduce((acc, date) => {
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

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <View style={calendarStyles.exerciseItem}>
      <Text style={calendarStyles.exerciseTitle}>{item.name}</Text>
      <Text style={calendarStyles.exerciseDetails}>
        {item.sets} séries × {item.reps} répétitions
      </Text>
    </View>
  );

  return (
    <View style={calendarStyles.container}>
      <Text style={calendarStyles.title}>Calendrier</Text>
      <View style={calendarStyles.calendarContainer}>
        <Calendar
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={markedDates}
          theme={calendarTheme}
        />
      </View>
      <FlatList
        data={selected ? mockWorkouts[selected]?.exercises || [] : []}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        style={calendarStyles.exerciseList}
        ListEmptyComponent={
          <Text style={calendarStyles.exerciseDetails}>
            Aucun exercice enregistré pour cette date
          </Text>
        }
      />
    </View>
  );
};

export default CalendarScreen; 