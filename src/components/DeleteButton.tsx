import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import IconButton from './IconButton';

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => (
  <IconButton
    icon="trash"
    size={20}
    color={theme.colors.error}
    onPress={onDelete}
    style={styles.button}
  />
);

const styles = StyleSheet.create({
  button: {
    marginLeft: 8,
  },
});

export default DeleteButton; 