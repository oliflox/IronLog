import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { calendarStyles } from '../styles/calendar';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const CalendarScreen = ({ navigation }: Props) => {
  return (
    <View style={calendarStyles.container}>
      <Text style={calendarStyles.title}>Calendrier</Text>
    </View>
  );
};

export default CalendarScreen; 