import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const calendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mainBg,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
});