import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { timerStyles } from '../styles/timer';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

const TimerScreen = ({ navigation }: Props) => {
  return (
    <View style={timerStyles.container}>
      <Text style={timerStyles.title}>Chronomètre</Text>
    </View>
  );
};

export default TimerScreen; 