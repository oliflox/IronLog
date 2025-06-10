import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { calendarStyles } from '../styles/calendar';
import { theme } from '../styles/theme';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const CalendarScreen = ({ navigation }: Props) => {
  const [selected, setSelected] = useState('');

  return (
    <View style={calendarStyles.container}>
      <Text style={calendarStyles.title}>Calendrier</Text>
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
        theme={{
          calendarBackground: theme.colors.mainBg,

          textSectionTitleColor: theme.colors.textSecondary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.text,

          todayTextColor: theme.colors.text,
          todayBackgroundColor: theme.colors.accent,

          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.accent,

          dotColor: theme.colors.primary,
          selectedDotColor: theme.colors.text,

          arrowColor: theme.colors.text,
          arrowStyle: {
            backgroundColor: theme.colors.primary,
            borderRadius: 10,
            padding: 10,
          },

          monthTextColor: theme.colors.text,
          indicatorColor: theme.colors.primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
        }}
        style={{
          backgroundColor: theme.colors.mainBg,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.sm,
        }}
      />
    </View>
  );
};

export default CalendarScreen; 