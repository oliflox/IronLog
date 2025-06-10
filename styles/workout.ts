import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const workoutStyles = StyleSheet.create({
  workoutContainer: {
    flex: 1,
    backgroundColor: theme.colors.mainBg,
    padding: theme.spacing.md,
  },
  workoutTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.lg
  },
  workoutImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.md,
    backgroundColor: '#B1A7A6', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  workoutName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
}); 