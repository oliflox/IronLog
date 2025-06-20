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
      await db.runAsync('DELETE FROM exercise_sets WHERE id = ?', [setId]);
    } catch (error) {
      console.error('Erreur lors de la suppression du set:', error);
      throw error;
    }
  },

  async updateLogDate(logId: string, newDate: string): Promise<void> {
    try {
      await db.runAsync('UPDATE exercise_logs SET date = ? WHERE id = ?', [newDate, logId]);
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
}; 