import { apiClient } from '../client';
import { API_CONFIG } from '../config';
import { Workout } from '../types';

export const syncApi = {
  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.SYNC);
      return response.data.workouts || [];
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  },
}; 