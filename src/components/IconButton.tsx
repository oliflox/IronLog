import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

interface IconButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  onPress: () => void;
  style?: ViewStyle;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, size = 24, color = 'black', onPress, style }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});

export default IconButton; 