import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { workoutRepository } from '../storage/workoutRepository';

export const useAddWorkout = (onSuccess?: () => void, onRefresh?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const addWorkout = async (name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await workoutRepository.createWorkout(name);
      console.log('Workout créé, tentative de rafraîchissement...');
      navigation.setParams({ refresh: true });
      console.log('Paramètre refresh envoyé');
      onRefresh?.();
      onSuccess?.();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout du workout');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addWorkout,
    isLoading,
    error
  };
}; 