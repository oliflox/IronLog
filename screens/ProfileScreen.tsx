import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { profileStyles } from '../styles/profile';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profil'>;

const ProfileScreen = ({ navigation }: Props) => {
  return (
    <View style={profileStyles.container}>
      <Text style={profileStyles.title}>Profil</Text>
    </View>
  );
};

export default ProfileScreen; 