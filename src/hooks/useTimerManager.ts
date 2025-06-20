import { useEffect, useState } from 'react';
import { Timer, timerRepository } from '../storage/timerRepository';

export const useTimerManager = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTimers = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const data = await timerRepository.getAllTimers();
      setTimers(data);
    } catch (err) {
      setError('Erreur lors du chargement des timers');
      console.error('Erreur lors du chargement des timers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les timers au montage du composant
  useEffect(() => {
    loadTimers();
  }, []);

  // Créer un timer
  const createTimer = async (name: string, duration: number) => {
    setIsLoading(true);
    try {
      await timerRepository.createTimer(name, duration);
      await loadTimers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la création du timer');
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour un timer
  const updateTimer = async (timer: Timer) => {
    setIsLoading(true);
    try {
      await timerRepository.updateTimer(timer.id, timer.name, timer.duration);
      await loadTimers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du timer');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un timer
  const deleteTimer = async (timerId: string) => {
    setIsLoading(true);
    try {
      await timerRepository.deleteTimer(timerId);
      await loadTimers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression du timer');
    } finally {
      setIsLoading(false);
    }
  };

  // Réorganiser les timers
  const reorderTimers = async (reorderedTimers: Timer[]) => {
    setIsLoading(true);
    try {
      await timerRepository.reorderTimers(reorderedTimers);
      setTimers(reorderedTimers);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la réorganisation des timers');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    timers,
    isLoading,
    error,
    loadTimers,
    createTimer,
    updateTimer,
    deleteTimer,
    reorderTimers,
  };
}; 