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
  calendarContainer: {
    backgroundColor: theme.colors.mainBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  exerciseList: {
    flex: 1,
    marginTop: theme.spacing.md,
  },
  exerciseItem: {
    backgroundColor: theme.colors.itemBg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  exerciseTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  exerciseDetails: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
});

export const calendarTheme = {
  calendarBackground: theme.colors.mainBg,
  textSectionTitleColor: theme.colors.textSecondary,

  selectedDayBackgroundColor: theme.colors.primary,
  selectedDayTextColor: theme.colors.text,

  todayTextColor: theme.colors.text,
  todayBackgroundColor: theme.colors.accent,

  dayTextColor: theme.colors.text,

  textDisabledColor: theme.colors.accent,

  dotColor: theme.colors.primary,
  selectedDotColor: theme.colors.text,

  arrowColor: theme.colors.text,
  arrowStyle: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 10,
  },

  monthTextColor: theme.colors.text,
  indicatorColor: theme.colors.primary,
  
  textDayFontWeight: '300' as const,
  textMonthFontWeight: 'bold' as const,
  textDayHeaderFontWeight: '500' as const,
};