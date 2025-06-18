import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { initDatabase } from '../storage/database';
import { workoutRepository } from '../storage/workoutRepository';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'Workout'>>();

  const loadWorkouts = async () => {
    try {
      console.log('Chargement des workouts...');
      const data = await workoutRepository.getAllWorkouts();
      console.log('Workouts chargés:', data);
      setWorkouts(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des workouts');
      console.error(err);
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initDatabase();
        await workoutRepository.initializeDefaultWorkouts();
        await loadWorkouts();
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des workouts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    setup();
  }, []);

  // Écouter les changements de route.params
  useEffect(() => {
    console.log('Route params changés:', route.params);
    if (route.params?.refresh) {
      console.log('Rafraîchissement déclenché');
      loadWorkouts();
    }
  }, [route.params]);

  return {
    workouts,
    isLoading,
    error,
    refreshWorkouts: loadWorkouts
  };
}; 