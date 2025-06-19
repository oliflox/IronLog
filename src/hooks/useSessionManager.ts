import { useEffect, useState } from 'react';
import { Session, sessionRepository } from '../storage/sessionRepository';

export const useSessionManager = (workoutId: string) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les sessions
  const loadSessions = async () => {
    try {
      setError(null);
      const data = await sessionRepository.getSessionsByWorkoutId(workoutId);
      setSessions(data);
    } catch (err) {
      setError('Erreur lors du chargement des sessions');
      console.error('Erreur lors du chargement des sessions:', err);
    }
  };

  // Créer une session
  const createSession = async (name: string) => {
    try {
      setError(null);
      await sessionRepository.createSession(name, workoutId);
      await loadSessions();
      return true;
    } catch (err) {
      setError('Erreur lors de la création de la session');
      console.error('Erreur lors de la création de la session:', err);
      return false;
    }
  };

  // Mettre à jour une session
  const updateSession = async (session: Session) => {
    try {
      setError(null);
      await sessionRepository.updateSession(session);
      await loadSessions();
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la session');
      console.error('Erreur lors de la mise à jour de la session:', err);
      return false;
    }
  };

  // Supprimer une session
  const deleteSession = async (sessionId: string) => {
    try {
      setError(null);
      await sessionRepository.deleteSession(sessionId);
      await loadSessions();
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la session');
      console.error('Erreur lors de la suppression de la session:', err);
      return false;
    }
  };

  // Réorganiser les sessions
  const reorderSessions = async (reorderedItems: Session[]) => {
    try {
      setError(null);
      const reorderedSessions = reorderedItems.map((item, index) => ({
        ...item,
        order: index
      }));
      await sessionRepository.reorderSessions(reorderedSessions);
      await loadSessions();
      return true;
    } catch (err) {
      setError('Erreur lors de la réorganisation des sessions');
      console.error('Erreur lors de la réorganisation des sessions:', err);
      return false;
    }
  };

  // Charger les sessions au montage du composant
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await sessionRepository.getSessionsByWorkoutId(workoutId);
        setSessions(data);
      } catch (err) {
        setError('Erreur lors du chargement des sessions');
        console.error('Erreur lors du chargement des sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialLoad();
  }, [workoutId]);

  return {
    // État
    sessions,
    isLoading,
    error,
    
    // Actions
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    reorderSessions,
    
    // Utilitaires
    clearError: () => setError(null),
  };
}; 