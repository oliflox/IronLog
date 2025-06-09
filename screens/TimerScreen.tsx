import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

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
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveTimer(null);
    setTimeLeft(0);
  };

  return (
    <View style={timerStyles.container}>
      <Text style={timerStyles.title}>Chronomètre</Text>
      <View style={timerStyles.gridContainer}>
        {PRESET_TIMERS.map((seconds) => (
          <Pressable
            key={seconds}
            style={timerStyles.timerBubble}
            onPress={() => handleTimerPress(seconds)}
          >
            <Text style={timerStyles.timerText}>{formatTime(seconds)}</Text>
          </Pressable>
        ))}
      </View>

      {activeTimer !== null && (
        <View style={timerStyles.activeTimerContainer}>
          <Text style={timerStyles.activeTimerText}>{formatTime(timeLeft)}</Text>
          <TouchableOpacity style={timerStyles.stopButton} onPress={handleStop}>
            <Text style={timerStyles.stopButtonText}>Arrêter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TimerScreen; 