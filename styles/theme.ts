import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    primary: '#BA181B',
    secondary: '#A4161A',
    tertiary: '#660708',
    background: '#161A1D',
    text: '#FFFFFF',

  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  layout: {
    screenWidth: width,
    screenHeight: height,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 6,
    },
    opacity: {
      low: 0.5,
      medium: 0.7,
      high: 1,
    },
  },
} as const;

// Type pour le thème
export type Theme = typeof theme;

// Hook personnalisé pour utiliser le thème
export const useTheme = () => theme; 