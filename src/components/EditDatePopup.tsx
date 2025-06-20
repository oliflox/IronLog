import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { theme } from '../styles/theme';

interface EditDatePopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
  currentDate?: string;
}

const EditDatePopup: React.FC<EditDatePopupProps> = ({ visible, onClose, onSave, currentDate }) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Pré-remplir avec la date actuelle quand le popup s'ouvre
  useEffect(() => {
    if (visible && currentDate) {
      setSelectedDate(currentDate);
    } else if (visible) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [visible, currentDate]);

  const handleSave = () => {
    if (!selectedDate.trim()) {
      return;
    }

    onSave(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const isValid = selectedDate.trim() !== '';

  // Préparer les dates marquées pour le calendrier
  const markedDates = selectedDate ? {
    [selectedDate]: {
      selected: true,
      selectedColor: theme.colors.primary,
    }
  } : {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Modifier la date</Text>
          
          <View style={styles.content}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: '#333',
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: theme.colors.primary,
                dayTextColor: '#333',
                textDisabledColor: '#d9e1e8',
                dotColor: theme.colors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: theme.colors.primary,
                monthTextColor: '#333',
                indicatorColor: theme.colors.primary,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Annuler</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.saveButton, !isValid && styles.disabledButton]} 
              onPress={handleSave}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '95%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
  },
  content: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditDatePopup; 