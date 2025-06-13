import { config } from 'dotenv';

// Charger les variables d'environnement
config();

export const useMockData = process.env.USE_MOCK_DATA === 'true';

// Configuration de l'API
export const apiConfig = {
  baseUrl: useMockData ? 'mock' : process.env.API_URL || 'http://localhost:8081',
  useMockData,
}; 