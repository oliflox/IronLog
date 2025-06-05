import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const sessionsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  workoutDayItem: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  workoutDayHeader: {
    flex: 1,
    marginBottom: theme.spacing.sm,
  },
  workoutDayTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  workoutDaySubtitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  exerciseList: {
    marginTop: theme.spacing.sm,
  },
  exerciseItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  workoutDayImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
}); 