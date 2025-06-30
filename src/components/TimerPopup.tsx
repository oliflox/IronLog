import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Timer } from "../storage/timerRepository";
import { editTimerPopupStyles } from "../styles/editTimerPopup";
import { theme } from "../styles/theme";
import BasePopup from "./BasePopup";

interface TimerPopupProps {
  visible: boolean;
  timer?: Timer | null; // Si présent, édition. Sinon, création
  onClose: () => void;
  onAdd?: (duration: number) => void;
  onSave?: (updatedTimer: Timer) => void;
}

/**
 * Composant unifié pour la création / modification d'un timer.
 */
const TimerPopup: React.FC<TimerPopupProps> = ({
  visible,
  timer,
  onClose,
  onAdd,
  onSave,
}) => {
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");

  // Initialiser / reset les valeurs
  useEffect(() => {
    if (visible) {
      if (timer) {
        const mins = Math.floor(timer.duration / 60);
        const secs = timer.duration % 60;
        setMinutes(mins.toString());
        setSeconds(secs.toString());
      } else {
        setMinutes("0");
        setSeconds("0");
      }
    }
  }, [visible, timer]);

  const getTotalSeconds = (): number => {
    const mins = parseInt(minutes, 10) || 0;
    const secs = parseInt(seconds, 10) || 0;
    return mins * 60 + secs;
  };

  const handleConfirm = () => {
    const totalSeconds = getTotalSeconds();
    if (totalSeconds <= 0) return;

    if (timer && onSave) {
      onSave({ ...timer, duration: totalSeconds });
    } else if (!timer && onAdd) {
      onAdd(totalSeconds);
    }

    onClose();
  };

  const isValid = getTotalSeconds() > 0;
  const isEditMode = !!timer;

  return (
    <BasePopup
      visible={visible}
      title={isEditMode ? "Modifier le timer" : "Ajouter un timer"}
      onClose={onClose}
      confirmLabel={isEditMode ? "Enregistrer" : "Ajouter"}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
    >
      <View style={editTimerPopupStyles.content}>
        <View style={editTimerPopupStyles.inputGroup}>
          <Text style={editTimerPopupStyles.label}>Durée</Text>
          <View style={editTimerPopupStyles.durationContainer}>
            <View style={editTimerPopupStyles.timeInputContainer}>
              <TextInput
                style={editTimerPopupStyles.timeInput}
                value={minutes}
                onChangeText={setMinutes}
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={editTimerPopupStyles.durationUnit}>min</Text>
            </View>
            <View style={editTimerPopupStyles.timeInputContainer}>
              <TextInput
                style={editTimerPopupStyles.timeInput}
                value={seconds}
                onChangeText={setSeconds}
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={editTimerPopupStyles.durationUnit}>sec</Text>
            </View>
          </View>
        </View>
      </View>
    </BasePopup>
  );
};

export default TimerPopup; 