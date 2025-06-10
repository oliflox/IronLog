import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const navigationStyles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 12,
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xxl,
  },
});

export const navigationOptions = {
  headerShown: false,
  headerTintColor: '#BA181B',
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTitleStyle: {
    fontWeight: 'bold' as const,
  },
}; 