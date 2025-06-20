import { useEffect, useState } from 'react';
import { Exercise, exerciseRepository } from '../storage/exerciseRepository';

export const useExerciseManager = (sessionId: string) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Charger les exercices
  const loadExercises = async () => {
    try {
      setError(null);
      const data = await exerciseRepository.getExercisesBySessionId(sessionId);
      setExercises(data);
    } catch (err) {
      setError('Erreur lors du chargement des exercices');
      console.error('Erreur lors du chargement des exercices:', err);
    }
  };

  // Initialiser les exercices par défaut
  const initializeExercises = async () => {
    try {
      await exerciseRepository.initializeDefaultExercises(sessionId);
      await loadExercises();
    } catch (err) {
      setError('Erreur lors de l\'initialisation des exercices');
      console.error('Erreur lors de l\'initialisation des exercices:', err);
    }
  };

  // Créer un exercice
  const createExercise = async (name: string, description?: string, imageUrl?: string) => {
    if (!sessionId) return;
    try {
      await exerciseRepository.createExercise(name, sessionId, description, imageUrl);
      await loadExercises();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de l\'exercice');
    }
  };

  // Mettre à jour un exercice
  const updateExercise = async (exercise: Exercise) => {
    try {
      await exerciseRepository.updateExercise(exercise.id, exercise.name, exercise.description, exercise.imageUrl);
      await loadExercises();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'exercice');
    }
  };

  // Supprimer un exercice
  const deleteExercise = async (exerciseId: string) => {
    try {
      setError(null);
      await exerciseRepository.deleteExercise(exerciseId);
      await loadExercises();
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de l\'exercice');
      console.error('Erreur lors de la suppression de l\'exercice:', err);
      return false;
    }
  };

  // Réorganiser les exercices
  const reorderExercises = async (reorderedItems: Exercise[]) => {
    try {
      setError(null);
      const reorderedExercises = reorderedItems.map((item, index) => ({
        ...item,
        order: index
      }));
      await exerciseRepository.reorderExercises(reorderedExercises);
      await loadExercises();
      return true;
    } catch (err) {
      setError('Erreur lors de la réorganisation des exercices');
      console.error('Erreur lors de la réorganisation des exercices:', err);
      return false;
    }
  };

  // Charger les exercices au montage du composant
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setError(null);
        const data = await exerciseRepository.getExercisesBySessionId(sessionId);
        setExercises(data);
      } catch (err) {
        setError('Erreur lors du chargement des exercices');
        console.error('Erreur lors du chargement des exercices:', err);
      }
    };
    
    initialLoad();
  }, [sessionId]);

  return {
    // État
    exercises,
    error,
    
    // Actions
    loadExercises,
    initializeExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    reorderExercises,
    
    // Utilitaires
    clearError: () => setError(null),
  };
}; 