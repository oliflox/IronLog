import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';

// Configuration de base d'Axios
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
    'Content-Type': 'application/json',
  },
};

// Création de l'instance Axios
export const apiClient: AxiosInstance = axios.create(axiosConfig);

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    console.log('Requête API:', config.url);
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log('Réponse API:', response.status);
    return response;
  },
  (error) => {
    console.error('Erreur de réponse:', error.response?.data || error.message);
    return Promise.reject(error);
  }
); 