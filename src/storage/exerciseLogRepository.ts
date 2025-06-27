import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface ExerciseSet {
  id: string;
  logId: string;
  repetitions: number;
  weight: number;
  order: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  date: string;
  sets: ExerciseSet[];
}

export interface ExerciseLogWithExercise extends ExerciseLog {
  exerciseName: string;
  exerciseImageUrl?: string;
}

export const exerciseLogRepository = {
  async getLogsByExerciseId(exerciseId: string): Promise<ExerciseLog[]> {
    try {
      const logs = await db.getAllAsync<{ id: string; exerciseId: string; date: string }>(
        'SELECT * FROM exercise_logs WHERE exerciseId = ? ORDER BY date DESC',
        [exerciseId]
      );

      const result: ExerciseLog[] = [];
      
      for (const log of logs) {
        const sets = await db.getAllAsync<ExerciseSet>(
          'SELECT * FROM exercise_sets WHERE logId = ? ORDER BY "order"',
          [log.id]
        );
        
        result.push({
          ...log,
          sets
        });
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      throw error;
    }
  },

  async getLogsWithExerciseInfo(exerciseId: string): Promise<ExerciseLogWithExercise[]> {
    try {
      const exercise = await db.getFirstAsync<{ name: string; imageUrl?: string }>(
        'SELECT name, imageUrl FROM exercises WHERE id = ?',
        [exerciseId]
      );

      if (!exercise) {
        throw new Error('Exercice non trouvé');
      }

      const logs = await this.getLogsByExerciseId(exerciseId);
      
      return logs.map(log => ({
        ...log,
        exerciseName: exercise.name,
        exerciseImageUrl: exercise.imageUrl
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des logs avec info exercice:', error);
      throw error;
    }
  },

  async createLog(exerciseId: string, date: string, sets: Omit<ExerciseSet, 'id' | 'logId'>[]): Promise<ExerciseLog> {
    try {
      const logId = randomUUID();
      
      // Créer le log
      await db.runAsync(
        'INSERT INTO exercise_logs (id, exerciseId, date) VALUES (?, ?, ?)',
        [logId, exerciseId, date]
      );

      // Créer les sets
      for (let i = 0; i < sets.length; i++) {
        const setId = randomUUID();
        await db.runAsync(
          'INSERT INTO exercise_sets (id, logId, repetitions, weight, "order") VALUES (?, ?, ?, ?, ?)',
          [setId, logId, sets[i].repetitions, sets[i].weight, i]
        );
      }

      // Récupérer le log créé avec ses sets
      const createdLog = await db.getFirstAsync<{ id: string; exerciseId: string; date: string }>(
        'SELECT * FROM exercise_logs WHERE id = ?',
        [logId]
      );

      const createdSets = await db.getAllAsync<ExerciseSet>(
        'SELECT * FROM exercise_sets WHERE logId = ? ORDER BY "order"',
        [logId]
      );

      return {
        ...createdLog!,
        sets: createdSets
      };
    } catch (error) {
      console.error('Erreur lors de la création du log:', error);
      throw error;
    }
  },

  async updateLog(logId: string, date: string, sets: Omit<ExerciseSet, 'id' | 'logId'>[]): Promise<void> {
    try {
      // Mettre à jour la date du log
      await db.runAsync('UPDATE exercise_logs SET date = ? WHERE id = ?', [date, logId]);

      // Supprimer les anciens sets
      await db.runAsync('DELETE FROM exercise_sets WHERE logId = ?', [logId]);

      // Créer les nouveaux sets
      for (let i = 0; i < sets.length; i++) {
        const setId = randomUUID();
        await db.runAsync(
          'INSERT INTO exercise_sets (id, logId, repetitions, weight, "order") VALUES (?, ?, ?, ?, ?)',
          [setId, logId, sets[i].repetitions, sets[i].weight, i]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du log:', error);
      throw error;
    }
  },

  async deleteLog(logId: string): Promise<void> {
    try {
      // Les sets seront supprimés automatiquement grâce à CASCADE
      await db.runAsync('DELETE FROM exercise_logs WHERE id = ?', [logId]);
    } catch (error) {
      console.error('Erreur lors de la suppression du log:', error);
      throw error;
    }
  },

  async deleteLogsByExerciseId(exerciseId: string): Promise<void> {
    try {
      // Les logs et sets seront supprimés automatiquement grâce à CASCADE
      await db.runAsync('DELETE FROM exercise_logs WHERE exerciseId = ?', [exerciseId]);
    } catch (error) {
      console.error('Erreur lors de la suppression des logs de l\'exercice:', error);
      throw error;
    }
  },

  async initializeDefaultLogs(exerciseId: string): Promise<void> {
    try {
      const existingLogs = await db.getAllAsync<{ id: string }>('SELECT id FROM exercise_logs WHERE exerciseId = ?', [exerciseId]);
      
      if (existingLogs.length === 0) {
        const defaultLogs = [
          {
            date: '2025-03-20',
            sets: [
              { repetitions: 12, weight: 60, order: 0 },
              { repetitions: 10, weight: 65, order: 1 },
              { repetitions: 8, weight: 70, order: 2 },
            ]
          },
          {
            date: '2025-03-15',
            sets: [
              { repetitions: 12, weight: 55, order: 0 },
              { repetitions: 10, weight: 60, order: 1 },
              { repetitions: 8, weight: 65, order: 2 },
            ]
          },
          {
            date: '2025-03-13',
            sets: [
              { repetitions: 12, weight: 55, order: 0 },
              { repetitions: 10, weight: 60, order: 1 },
              { repetitions: 8, weight: 65, order: 2 },
            ]
          }
        ];

        for (const log of defaultLogs) {
          await this.createLog(exerciseId, log.date, log.sets);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des logs par défaut:', error);
      throw error;
    }
  },

  async addSetToLog(exerciseId: string, date: string, set: Omit<ExerciseSet, 'id' | 'logId'>): Promise<void> {
    try {
      // Vérifier s'il existe déjà un log pour cette date
      const existingLog = await db.getFirstAsync<{ id: string }>(
        'SELECT id FROM exercise_logs WHERE exerciseId = ? AND date = ?',
        [exerciseId, date]
      );

      if (existingLog) {
        // Ajouter le set au log existant
        const setId = randomUUID();
        const maxOrder = await db.getFirstAsync<{maxOrder: number}>(
          'SELECT COALESCE(MAX("order"), -1) as maxOrder FROM exercise_sets WHERE logId = ?',
          [existingLog.id]
        );
        const newOrder = (maxOrder?.maxOrder || -1) + 1;
        
        await db.runAsync(
          'INSERT INTO exercise_sets (id, logId, repetitions, weight, "order") VALUES (?, ?, ?, ?, ?)',
          [setId, existingLog.id, set.repetitions, set.weight, newOrder]
        );
      } else {
        // Créer un nouveau log avec ce set
        await this.createLog(exerciseId, date, [set]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du set au log:', error);
      throw error;
    }
  },

  async deleteSet(setId: string): Promise<void> {
    try {
      // Récupérer le logId avant de supprimer le set
      const setInfo = await db.getFirstAsync<{ logId: string }>(
        'SELECT logId FROM exercise_sets WHERE id = ?',
        [setId]
      );

      if (!setInfo) {
        throw new Error('Set non trouvé');
      }

      // Supprimer le set
      await db.runAsync('DELETE FROM exercise_sets WHERE id = ?', [setId]);

      // Vérifier s'il reste des sets pour ce log
      const remainingSets = await db.getAllAsync<{ id: string }>(
        'SELECT id FROM exercise_sets WHERE logId = ?',
        [setInfo.logId]
      );

      // Si plus aucun set, supprimer le log entier
      if (remainingSets.length === 0) {
        await db.runAsync('DELETE FROM exercise_logs WHERE id = ?', [setInfo.logId]);
        console.log('Log supprimé car plus aucun set');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du set:', error);
      throw error;
    }
  },

  async updateLogDate(logId: string, newDate: string): Promise<void> {
    try {
      // Récupérer le log actuel avec ses sets
      const currentLog = await db.getFirstAsync<{ id: string; exerciseId: string; date: string }>(
        'SELECT * FROM exercise_logs WHERE id = ?',
        [logId]
      );

      if (!currentLog) {
        throw new Error('Log non trouvé');
      }

      // Vérifier s'il existe déjà un log avec la nouvelle date
      const existingLog = await db.getFirstAsync<{ id: string }>(
        'SELECT id FROM exercise_logs WHERE exerciseId = ? AND date = ? AND id != ?',
        [currentLog.exerciseId, newDate, logId]
      );

      if (existingLog) {
        // Fusionner les sets : récupérer les sets du log actuel
        const currentSets = await db.getAllAsync<ExerciseSet>(
          'SELECT * FROM exercise_sets WHERE logId = ? ORDER BY "order"',
          [logId]
        );

        // Récupérer l'ordre maximum des sets du log existant
        const maxOrder = await db.getFirstAsync<{maxOrder: number}>(
          'SELECT COALESCE(MAX("order"), -1) as maxOrder FROM exercise_sets WHERE logId = ?',
          [existingLog.id]
        );
        const startOrder = (maxOrder?.maxOrder || -1) + 1;

        // Déplacer tous les sets du log actuel vers le log existant
        for (let i = 0; i < currentSets.length; i++) {
          const setId = randomUUID();
          await db.runAsync(
            'INSERT INTO exercise_sets (id, logId, repetitions, weight, "order") VALUES (?, ?, ?, ?, ?)',
            [setId, existingLog.id, currentSets[i].repetitions, currentSets[i].weight, startOrder + i]
          );
        }

        // Supprimer le log actuel (les sets seront supprimés automatiquement par la contrainte de clé étrangère)
        await db.runAsync('DELETE FROM exercise_logs WHERE id = ?', [logId]);
      } else {
        // Pas de log existant avec cette date, simplement mettre à jour la date
        await db.runAsync('UPDATE exercise_logs SET date = ? WHERE id = ?', [newDate, logId]);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la date:', error);
      throw error;
    }
  },

  async updateSet(setId: string, repetitions: number, weight: number): Promise<void> {
    try {
      await db.runAsync('UPDATE exercise_sets SET repetitions = ?, weight = ? WHERE id = ?', [repetitions, weight, setId]);
    } catch (error) {
      console.error('Erreur lors de la modification du set:', error);
      throw error;
    }
  },

  async getLogsByDate(date: string): Promise<ExerciseLogWithExercise[]> {
    try {
      const logs = await db.getAllAsync<{ id: string; exerciseId: string; date: string }>(
        'SELECT * FROM exercise_logs WHERE date = ? ORDER BY exerciseId',
        [date]
      );

      const result: ExerciseLogWithExercise[] = [];
      
      for (const log of logs) {
        // Récupérer les informations de l'exercice
        const exercise = await db.getFirstAsync<{ name: string; imageUrl?: string }>(
          'SELECT name, imageUrl FROM exercises WHERE id = ?',
          [log.exerciseId]
        );

        if (!exercise) {
          console.warn(`Exercice non trouvé pour l'ID: ${log.exerciseId}`);
          continue;
        }

        // Récupérer les sets
        const sets = await db.getAllAsync<ExerciseSet>(
          'SELECT * FROM exercise_sets WHERE logId = ? ORDER BY "order"',
          [log.id]
        );
        
        result.push({
          ...log,
          sets,
          exerciseName: exercise.name,
          exerciseImageUrl: exercise.imageUrl
        });
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des logs par date:', error);
      throw error;
    }
  },

  async getDatesWithLogs(): Promise<string[]> {
    try {
      const dates = await db.getAllAsync<{ date: string }>(
        'SELECT DISTINCT date FROM exercise_logs ORDER BY date DESC'
      );
      
      return dates.map(d => d.date);
    } catch (error) {
      console.error('Erreur lors de la récupération des dates avec logs:', error);
      throw error;
    }
  },

  async getWeeklyStats(): Promise<{ reps: number; weight: number; workouts: number; duration: string }> {
    try {
      // Calculer le début de la semaine (lundi)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = dimanche
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysToMonday);
      monday.setHours(0, 0, 0, 0);

      const startOfWeek = monday.toISOString().split('T')[0];
      const endOfWeek = today.toISOString().split('T')[0];

      // Récupérer tous les logs de la semaine
      const logs = await db.getAllAsync<{ id: string; exerciseId: string; date: string }>(
        'SELECT * FROM exercise_logs WHERE date BETWEEN ? AND ?',
        [startOfWeek, endOfWeek]
      );

      let totalReps = 0;
      let totalWeight = 0;
      const uniqueDates = new Set<string>();

      for (const log of logs) {
        uniqueDates.add(log.date);
        const sets = await db.getAllAsync<{ repetitions: number; weight: number }>(
          'SELECT repetitions, weight FROM exercise_sets WHERE logId = ?',
          [log.id]
        );

        for (const set of sets) {
          totalReps += set.repetitions;
          totalWeight += set.repetitions * set.weight;
        }
      }

      // Calculer la durée (estimation basée sur le nombre de séances)
      const workouts = uniqueDates.size;
      const estimatedDurationMinutes = workouts * 90; // 1h30 par séance en moyenne
      const hours = Math.floor(estimatedDurationMinutes / 60);
      const minutes = estimatedDurationMinutes % 60;
      const duration = `${hours}h ${minutes}m`;

      return {
        reps: totalReps,
        weight: Math.round(totalWeight),
        workouts,
        duration
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques hebdomadaires:', error);
      throw error;
    }
  },

  async getTopExercises(limit: number = 3): Promise<{ name: string; record: string }[]> {
    try {
      // Récupérer les exercices avec leurs poids maximum
      const exercises = await db.getAllAsync<{ exerciseId: string; exerciseName: string; maxWeight: number }>(
        `SELECT 
          e.id as exerciseId,
          e.name as exerciseName,
          MAX(es.weight) as maxWeight
        FROM exercises e
        LEFT JOIN exercise_logs el ON e.id = el.exerciseId
        LEFT JOIN exercise_sets es ON el.id = es.logId
        WHERE es.weight IS NOT NULL
        GROUP BY e.id, e.name
        HAVING maxWeight > 0
        ORDER BY maxWeight DESC
        LIMIT ?`,
        [limit]
      );

      return exercises.map(ex => ({
        name: ex.exerciseName,
        record: `${ex.maxWeight}kg`
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices principaux:', error);
      throw error;
    }
  },

  async getLastWorkoutDate(): Promise<string | null> {
    try {
      const lastLog = await db.getFirstAsync<{ date: string }>(
        'SELECT date FROM exercise_logs ORDER BY date DESC LIMIT 1'
      );

      return lastLog?.date || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la date du dernier entraînement:', error);
      throw error;
    }
  }
}; 