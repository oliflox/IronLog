import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { calendarStyles, calendarTheme } from '../styles/calendar';
import { theme } from '../styles/theme';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const CalendarScreen = ({ navigation }: Props) => {
  const [selected, setSelected] = useState('');

  // Données d'exemple - À remplacer par vos vraies données
  const exercises: Exercise[] = [
    { id: '1', name: 'Développé Couché', sets: 4, reps: 12 },
    { id: '2', name: 'Squat', sets: 5, reps: 8 },
    { id: '3', name: 'Tractions', sets: 3, reps: 10 },
  ];

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
          markedDates={{
            [selected]: {
              selected: true,
              selectedColor: theme.colors.primary,
            },
          }}
          theme={calendarTheme}
        />
      </View>
      <FlatList
        data={exercises}
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