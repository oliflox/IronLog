import { useEffect, useState } from 'react';
import { initDatabase } from '../storage/database';
import { sessionRepository } from '../storage/sessionRepository';

export const useSessions = (workoutId: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      console.log('Chargement des sessions pour workoutId:', workoutId);
      const data = await sessionRepository.getSessionsByWorkoutId(workoutId);
      console.log('Sessions chargées:', data);
      setSessions(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des sessions');
      console.error(err);
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initDatabase();
        await loadSessions();
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des sessions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    setup();
  }, [workoutId]);

  return {
    sessions,
    isLoading,
    error,
    refreshSessions: loadSessions
  };
}; 