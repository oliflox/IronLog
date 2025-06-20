import { useEffect, useState } from 'react';
import { Timer, timerRepository } from '../storage/timerRepository';

export const useTimerManager = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadTimers = async () => {
    try {
      setError(null);
      const data = await timerRepository.getAllTimers();
      setTimers(data);
    } catch (err) {
      setError('Erreur lors du chargement des timers');
      console.error('Erreur lors du chargement des timers:', err);  
    }
  };

  // Charger les timers au montage du composant
  useEffect(() => {
    loadTimers();
  }, []);

  // Créer un timer
  const createTimer = async (duration: number) => {
    try {
      await timerRepository.createTimer(duration);
      await loadTimers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la création du timer');
    }
  };

  // Mettre à jour un timer
  const updateTimer = async (timer: Timer) => {
    try {
        await timerRepository.updateTimer(timer.id, timer.duration);
      await loadTimers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du timer');
    }
  };

  // Supprimer un timer
  const deleteTimer = async (timerId: string) => {
    try {
      await timerRepository.deleteTimer(timerId);
      await loadTimers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression du timer');
    }
  };

  // Réorganiser les timers
  const reorderTimers = async (reorderedTimers: Timer[]) => {
    try {
      await timerRepository.reorderTimers(reorderedTimers);
      setTimers(reorderedTimers);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la réorganisation des timers');
    }
  };

  return {
    timers,
    error,
    loadTimers,
    createTimer,
    updateTimer,
    deleteTimer,
    reorderTimers,
  };
}; 