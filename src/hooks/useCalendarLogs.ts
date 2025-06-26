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
      
      // Si une date était sélectionnée, recharger ses logs
      if (lastSelectedDate && dates.includes(lastSelectedDate)) {
        await loadLogsForDate(lastSelectedDate);
      } else if (lastSelectedDate && !dates.includes(lastSelectedDate)) {
        // Si la date sélectionnée n'a plus de logs, vider la sélection
        setSelectedDateLogs([]);
        setLastSelectedDate('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des dates');
    } finally {
      setLoading(false);
    }
  }, [lastSelectedDate]);

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
    await loadDatesWithLogs();
  }, [loadDatesWithLogs]);

  useEffect(() => {
    loadDatesWithLogs();
  }, [loadDatesWithLogs]);

  return {
    datesWithLogs,
    selectedDateLogs,
    error,
    loading,
    loadLogsForDate,
    clearSelectedDateLogs,
    refreshDates: loadDatesWithLogs,
    refreshAll,
    lastSelectedDate
  };
}; 