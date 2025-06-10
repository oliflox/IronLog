import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { timerStyles } from '../styles/timer';

type RootStackParamList = {
  Workout: undefined;
  Profil: undefined;
  Timer: undefined;
  Calendar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

// Timers prédéfinis (en secondes)
const PRESET_TIMERS = [30, 45, 60, 90, 120, 180];

const TimerScreen = ({ navigation }: Props) => {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUsedTimer, setLastUsedTimer] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setActiveTimer(null);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerPress = (seconds: number) => {
    setActiveTimer(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
    setLastUsedTimer(seconds);
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveTimer(null);
    setTimeLeft(0);
  };

  const handleStart = () => {
    if (lastUsedTimer) {
      setActiveTimer(lastUsedTimer);
      setTimeLeft(lastUsedTimer);
      setIsRunning(true);
    }
  };

  const renderTimerItem = ({ item: seconds }: { item: number }) => (
    <Pressable
      style={timerStyles.timerItem}
      onPress={() => handleTimerPress(seconds)}
    >
      <Text style={timerStyles.timerItemText}>{formatTime(seconds)}</Text>
    </Pressable>
  );

  return (
    <View style={timerStyles.container}>
      <Text style={timerStyles.title}>Chronomètre</Text>
      
      <View style={timerStyles.currentTimerContainer}>
        <Text style={timerStyles.currentTimerText}>
          {formatTime(isRunning ? timeLeft : (lastUsedTimer || 0))}
        </Text>
        <Pressable
          style={timerStyles.timerButton}
          onPress={isRunning ? handleStop : handleStart}
        >
          <Text style={timerStyles.timerButtonText}>
            {isRunning ? 'Arrêter' : 'Lancer'}
          </Text>
        </Pressable>
      </View>
      <Text style={timerStyles.title}>Chronomètres enregistrés</Text>
      <FlatList
        style={timerStyles.timerList}
        data={PRESET_TIMERS}
        renderItem={renderTimerItem}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};

export default TimerScreen; 