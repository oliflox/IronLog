import { useCallback, useEffect, useState } from 'react';
import { exerciseLogRepository, ExerciseLogWithExercise } from '../storage/exerciseLogRepository';

export const useExerciseLogs = (exerciseId: string) => {
  const [logs, setLogs] = useState<ExerciseLogWithExercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setError(null);
      const logsData = await exerciseLogRepository.getLogsWithExerciseInfo(exerciseId);
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des logs');
    }
  }, [exerciseId]);

  const addSet = useCallback(async (date: string, set: { repetitions?: number; weight?: number; duration?: number; order: number }) => {
    try {
      setError(null);
      await exerciseLogRepository.addSetToLog(exerciseId, date, set);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du set');
      throw err;
    }
  }, [exerciseId, loadLogs]);

  const createLog = useCallback(async (date: string, sets: { repetitions?: number; weight?: number; duration?: number; order: number }[]) => {
    try {
      setError(null);
      await exerciseLogRepository.createLog(exerciseId, date, sets);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du log');
      throw err;
    }
  }, [exerciseId, loadLogs]);

  const updateLog = useCallback(async (logId: string, date: string, sets: { repetitions?: number; weight?: number; duration?: number; order: number }[]) => {
    try {
      setError(null);
      await exerciseLogRepository.updateLog(logId, date, sets);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification du log');
      throw err;
    }
  }, [loadLogs]);

  const deleteLog = useCallback(async (logId: string) => {
    try {
      setError(null);
      await exerciseLogRepository.deleteLog(logId);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du log');
      throw err;
    }
  }, [loadLogs]);

  const initializeDefaultLogs = useCallback(async () => {
    try {
      setError(null);
      await exerciseLogRepository.initializeDefaultLogs(exerciseId);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'initialisation des logs par défaut');
      throw err;
    }
  }, [exerciseId, loadLogs]);

  const deleteSet = useCallback(async (setId: string) => {
    try {
      setError(null);
      await exerciseLogRepository.deleteSet(setId);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du set');
      throw err;
    }
  }, [loadLogs]);

  const updateLogDate = useCallback(async (logId: string, newDate: string) => {
    try {
      setError(null);
      await exerciseLogRepository.updateLogDate(logId, newDate);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification de la date');
      throw err;
    }
  }, [loadLogs]);

  const updateSet = useCallback(async (setId: string, repetitions?: number, weight?: number, duration?: number) => {
    try {
      setError(null);
      await exerciseLogRepository.updateSet(setId, repetitions, weight, duration);
      await loadLogs(); // Recharger les logs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification du set');
      throw err;
    }
  }, [loadLogs]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    logs,
    error,
    addSet,
    createLog,
    updateLog,
    deleteLog,
    initializeDefaultLogs,
    deleteSet,
    updateLogDate,
    updateSet,
    refreshLogs: loadLogs
  };
}; 