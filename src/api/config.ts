import Constants from 'expo-constants';

// Récupération des variables d'environnement
const getEnvVar = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key];
  if (!value) {
    throw new Error(`Variable d'environnement ${key} non définie`);
  }
  return value;
};

// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: getEnvVar('API_URL'),
  // Token d'authentification
  TOKEN: getEnvVar('API_TOKEN'),
  // Endpoints
  ENDPOINTS: {
    SYNC: '/api/sync',
  }
} as const; 