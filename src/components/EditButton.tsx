import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import IconButton from './IconButton';

interface EditButtonProps {
  onPress: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onPress }) => (
  <IconButton
    icon="pencil"
    size={24}
    color={theme.colors.primary}
    onPress={onPress}
    style={styles.button}
  />
);

const styles = StyleSheet.create({
  button: {
    marginRight: 8,
  },
});

export default EditButton; 