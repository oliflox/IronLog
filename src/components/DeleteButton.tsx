import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  return (
    <Pressable style={styles.button} onPress={onDelete}>
      <Ionicons name="trash" size={20} color={theme.colors.error} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginLeft: 8,
  },
});

export default DeleteButton; 