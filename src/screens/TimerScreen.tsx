import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import {Pressable, Text, View } from 'react-native';
import AddTimerPopup from "../components/AddTimerPopup";
import EditTimerPopup from "../components/EditTimerPopup";
import GlobalAddButton from "../components/GlobalAddButton";
import TimerList from "../components/TimerList";
import { useEditMode } from "../contexts/EditModeContext";
import { useTimerManager } from "../hooks/useTimerManager";
import { RootTabParamList } from "../navigation/AppNavigator";
import { Timer } from "../storage/timerRepository";
import { timerStyles } from '../styles/timer';

type Props = BottomTabScreenProps<RootTabParamList, 'Timer'>;

const TimerScreen = ({ navigation }: Props) => {
  const { editMode } = useEditMode();
  const { timers, error, loadTimers, deleteTimer, reorderTimers, updateTimer, createTimer } = useTimerManager();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState<Timer | null>(null);
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  
  // États pour le timer actif
  const [activeTimer, setActiveTimer] = useState<Timer | null>(null);
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

  const handleItemPress = (item: any) => {
    if (!editMode) {
      // Lancer le timer sélectionné
      const timer = item as Timer;
      setActiveTimer(timer);
      setTimeLeft(timer.duration);
      setIsRunning(true);
    }
  };

  const handleDeleteTimer = async (timerId: string) => {
    await deleteTimer(timerId);
  };

  const handleReorderTimers = async (reorderedItems: any[]) => {
    await reorderTimers(reorderedItems);
  };

  const handleUpdateTimer = (timer: any) => {
    setSelectedTimer(timer);
    setEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setEditPopupVisible(false);
    setSelectedTimer(null);
  };

  const handleSaveTimer = (updatedTimer: Timer) => {
    updateTimer(updatedTimer);
  };

  const handleAddTimer = (duration: number) => {
    createTimer(duration);
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveTimer(null);
    setTimeLeft(0);
  };

  const handleStart = () => {
    if (activeTimer) {
      setTimeLeft(activeTimer.duration);
      setIsRunning(true);
    }
  };

  const handleOpenAddPopup = () => {
    setAddPopupVisible(true);
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={timerStyles.container}>
      {/* Timer actif en haut */}
      <View style={timerStyles.currentTimerContainer}>
        <Text style={timerStyles.currentTimerText}>
          {formatTime(isRunning ? timeLeft : (activeTimer?.duration || 0))}
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

      {/* Liste des timers sauvegardés */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 }}>
        <Text style={timerStyles.title}>Chronomètres enregistrés</Text>
      </View>
      <TimerList
        data={timers}
        onItemPress={handleItemPress}
        onDeleteItem={handleDeleteTimer}
        onReorderItems={handleReorderTimers}
        editMode={editMode}
        onUpdateItem={handleUpdateTimer}
      />
      
      <GlobalAddButton onRefresh={loadTimers} />
      <EditTimerPopup
        visible={editPopupVisible}
        timer={selectedTimer}
        onClose={handleCloseEditPopup}
        onSave={handleSaveTimer}
      />
      <AddTimerPopup
        visible={addPopupVisible}
        onClose={() => setAddPopupVisible(false)}
        onAdd={handleAddTimer}
      />
    </View>
  );
};

export default TimerScreen; 