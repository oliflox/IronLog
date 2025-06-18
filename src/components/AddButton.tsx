import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useAddWorkout } from '../hooks/useAddWorkout';
import { RootStackParamList } from '../navigation/AppNavigator';
import { navigationStyles } from '../styles/navigation';
import AddWorkoutPopup from './AddWorkoutPopup';
import GlobalPopup from './GlobalPopup';

interface AddButtonProps {
  onRefresh: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onRefresh }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const state = navigation.getState();
  const currentRoute = state?.routes[state?.index ?? 0];
  const currentScreen = currentRoute?.name;
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isAddWorkoutVisible, setIsAddWorkoutVisible] = useState(false);

  const { addWorkout } = useAddWorkout(() => {
    setIsAddWorkoutVisible(false);
  }, onRefresh);

  const getButtonConfig = (screen: string | undefined) => {
    switch (screen) {
      case 'Calendar':
        return {
          icon: "share-social" as const,
          message: "Partage du calendrier d'entraînement"
        };
      case 'Workout':
        return {
          icon: "add" as const,
          message: "Ajout d'un nouvel exercice"
        };
      case 'Timer':
        return {
          icon: "add" as const,
          message: "Création d'un nouveau timer"
        };
      case 'Profil':
        return {
          icon: "add" as const,
          message: "Ajout d'une nouvelle statistique"
        };
      default:
        return {
          icon: "add" as const,
          message: "Action non définie"
        };
    }
  };

  const { icon, message } = getButtonConfig(currentScreen);

  const handlePress = () => {
    if (currentScreen === 'Workout') {
      setIsAddWorkoutVisible(true);
    } else {
      setPopupMessage(message);
      setIsPopupVisible(true);
    }
  };

  return (
    <>
      <Pressable
        style={navigationStyles.addButton}
        onPress={handlePress}
      >
        <Ionicons 
          name={icon} 
          size={30} 
          color="#fff" 
        />
      </Pressable>
      <GlobalPopup
        visible={isPopupVisible}
        message={popupMessage}
        onClose={() => setIsPopupVisible(false)}
      />
      <AddWorkoutPopup
        visible={isAddWorkoutVisible}
        onClose={() => setIsAddWorkoutVisible(false)}
        onAdd={addWorkout}
      />
    </>
  );
};

export default AddButton; 