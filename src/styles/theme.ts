import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    mainBg: '#1C1C1E',
    itemBg: '#2C2C2E',

    primary: '#D72638',
    secondary: '#A4161A',
    tertiary: '#660708',

    text: '#fff',
    textSecondary: '#CCCCCC',

    accent: '#3A3A3C',

  },
  spacing: {
    
    xs: 8,
    sm: 12,
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
  }
} as const;

// Type pour le thème
export type Theme = typeof theme;

// Hook personnalisé pour utiliser le thème
export const useTheme = () => theme; 