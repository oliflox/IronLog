import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const timerStyles = StyleSheet.create({
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
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  timerBubble: {
    aspectRatio: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  timerText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  activeTimerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.itemBg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  activeTimerText: {
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  stopButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  stopButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
}); 