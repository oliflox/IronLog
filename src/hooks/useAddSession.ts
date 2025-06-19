import { useState } from 'react';
import { sessionRepository } from '../storage/sessionRepository';

export const useAddSession = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSession = async (name: string, workoutId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sessionRepository.createSession(name, workoutId);
      onSuccess?.();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout de la session');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addSession,
    isLoading,
    error
  };
}; 