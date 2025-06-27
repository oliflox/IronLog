import { useCallback, useEffect, useState } from 'react';
import { exerciseLogRepository, ExerciseLogWithExercise } from '../storage/exerciseLogRepository';

export const useCalendarLogs = () => {
  const [datesWithLogs, setDatesWithLogs] = useState<string[]>([]);
  const [selectedDateLogs, setSelectedDateLogs] = useState<ExerciseLogWithExercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSelectedDate, setLastSelectedDate] = useState<string>('');

  const loadDatesWithLogs = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const dates = await exerciseLogRepository.getDatesWithLogs();
      setDatesWithLogs(dates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des dates');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogsForDate = useCallback(async (date: string) => {
    try {
      setError(null);
      setLoading(true);
      setLastSelectedDate(date);
      
      const logs = await exerciseLogRepository.getLogsByDate(date);
      setSelectedDateLogs(logs);
      
      console.log(`Logs chargés pour ${date}:`, logs.length, 'exercices');
    } catch (err) {
      console.error('Erreur lors du chargement des logs pour', date, err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des logs');
      setSelectedDateLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelectedDateLogs = useCallback(() => {
    setSelectedDateLogs([]);
    setLastSelectedDate('');
  }, []);

  const refreshAll = useCallback(async () => {
    // Sauvegarder la date actuellement sélectionnée
    const currentSelectedDate = lastSelectedDate;
    
    // Recharger seulement les dates avec logs
    await loadDatesWithLogs();
    
    // Si une date était sélectionnée, recharger ses logs
    if (currentSelectedDate) {
      await loadLogsForDate(currentSelectedDate);
    }
  }, [loadDatesWithLogs, loadLogsForDate, lastSelectedDate]);

  // Fonction pour forcer la mise à jour des dates avec logs
  const refreshDates = useCallback(async () => {
    await loadDatesWithLogs();
  }, [loadDatesWithLogs]);

  // Charger les dates avec logs au montage du composant
  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        // Nettoyer d'abord les logs orphelins
        await exerciseLogRepository.cleanupOrphanedLogs();
        // Puis charger les dates avec logs
        await loadDatesWithLogs();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du calendrier:', error);
      }
    };
    
    initializeCalendar();
  }, []); // Dépendance vide pour ne charger qu'une fois

  return {
    datesWithLogs,
    selectedDateLogs,
    error,
    loading,
    loadLogsForDate,
    clearSelectedDateLogs,
    refreshDates,
    refreshAll,
    lastSelectedDate
  };
}; 