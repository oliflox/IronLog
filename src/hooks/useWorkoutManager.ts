import { useEffect, useState } from 'react';
import { Workout, workoutRepository } from '../storage/workoutRepository';

export const useWorkoutManager = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les workouts
  const loadWorkouts = async () => {
    try {
      setError(null);
      const data = await workoutRepository.getAllWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError('Erreur lors du chargement des workouts');
      console.error('Erreur lors du chargement des workouts:', err);
    }
  };

  // Initialiser les workouts par défaut
  const initializeWorkouts = async () => {
    try {
      await workoutRepository.initializeDefaultWorkouts();
      await loadWorkouts();
    } catch (err) {
      setError('Erreur lors de l\'initialisation des workouts');
      console.error('Erreur lors de l\'initialisation des workouts:', err);
    }
  };

  // Créer un workout
  const createWorkout = async (name: string) => {
    try {
      setError(null);
      await workoutRepository.createWorkout(name);
      await loadWorkouts();
      return true;
    } catch (err) {
      setError('Erreur lors de la création du workout');
      console.error('Erreur lors de la création du workout:', err);
      return false;
    }
  };

  // Mettre à jour un workout
  const updateWorkout = async (workout: Workout) => {
    try {
      setError(null);
      await workoutRepository.updateWorkout(workout);
      await loadWorkouts();
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour du workout');
      console.error('Erreur lors de la mise à jour du workout:', err);
      return false;
    }
  };

  // Supprimer un workout
  const deleteWorkout = async (workoutId: string) => {
    try {
      setError(null);
      await workoutRepository.deleteWorkout(workoutId);
      await loadWorkouts();
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression du workout');
      console.error('Erreur lors de la suppression du workout:', err);
      return false;
    }
  };

  // Réorganiser les workouts
  const reorderWorkouts = async (reorderedItems: Workout[]) => {
    try {
      setError(null);
      const reorderedWorkouts = reorderedItems.map((item, index) => ({
        ...item,
        order: index
      }));
      await workoutRepository.reorderWorkouts(reorderedWorkouts);
      await loadWorkouts();
      return true;
    } catch (err) {
      setError('Erreur lors de la réorganisation des workouts');
      console.error('Erreur lors de la réorganisation des workouts:', err);
      return false;
    }
  };

  // Charger les workouts au montage du composant
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await workoutRepository.getAllWorkouts();
        setWorkouts(data);
      } catch (err) {
        setError('Erreur lors du chargement des workouts');
        console.error('Erreur lors du chargement des workouts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialLoad();
  }, []);

  return {
    // État
    workouts,
    isLoading,
    error,
    
    // Actions
    loadWorkouts,
    initializeWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    reorderWorkouts,
    
    // Utilitaires
    clearError: () => setError(null),
  };
}; 