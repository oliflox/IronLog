import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface EditButtonProps {
  onPress: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="pencil" size={24} color={theme.colors.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});

export default EditButton; 