import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mainBg,
    padding: theme.spacing.md,
  },
  profileBlock: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.sm,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  lastWorkout: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  editButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  measurementsBlock: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  measurementsTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  measurementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementItem: {
    width: '30%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  measurementLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
  measurementValue: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.lg,
  },
  weeklyBlock: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  weeklyTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  weeklyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  weeklyStat: {
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.md,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  weeklyDuration: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  statsBlock: {
    backgroundColor: theme.colors.itemBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  statsTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  recordLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
  recordValue: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.md,
  },
}); 