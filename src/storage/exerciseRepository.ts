import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface Exercise {
  id: string;
  name: string;
  sessionId: string;
  order: number;
  imageUrl?: string;
  description?: string;
}

export const exerciseRepository = {
  async initializeDefaultExercises(sessionId: string): Promise<void> {
    try {
      const result = await db.getAllAsync<Exercise>('SELECT * FROM exercises WHERE sessionId = ? ORDER BY "order"', [sessionId]);

      if (result.length === 0) {
        const exercises = [
          { id: randomUUID(), name: 'Développé couché', sessionId, order: 0, description: 'Exercice de pectoraux' },
          { id: randomUUID(), name: 'Squat', sessionId, order: 1, description: 'Exercice de jambes' },
          { id: randomUUID(), name: 'Traction', sessionId, order: 2, description: 'Exercice de dos' }
        ];

        for (const exercise of exercises) {
          await db.runAsync(
            'INSERT INTO exercises (id, name, sessionId, "order", description) VALUES (?, ?, ?, ?, ?)',
            [exercise.id, exercise.name, exercise.sessionId, exercise.order, exercise.description]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des exercices par défaut:', error);
      throw error;
    }
  },

  async getExercisesBySessionId(sessionId: string): Promise<Exercise[]> {
    try {
      return await db.getAllAsync<Exercise>('SELECT * FROM exercises WHERE sessionId = ? ORDER BY "order"', [sessionId]);
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      throw error;
    }
  },

  async createExercise(name: string, sessionId: string, description?: string): Promise<Exercise> {
    try {
      const id = randomUUID();
      const result = await db.getAllAsync<{maxOrder: number}>('SELECT COALESCE(MAX("order"), -1) as maxOrder FROM exercises WHERE sessionId = ?', [sessionId]);
      const maxOrder = result[0]?.maxOrder || -1;
      const newOrder = maxOrder + 1;
      
      await db.runAsync(
        'INSERT INTO exercises (id, name, sessionId, "order", description) VALUES (?, ?, ?, ?, ?)',
        [id, name, sessionId, newOrder, description || null]
      );
      return { id, name, sessionId, order: newOrder, description };
    } catch (error) {
      console.error('Erreur lors de la création de l\'exercice:', error);
      throw error;
    }
  },

  async updateExercise(id: string, name: string, description?: string): Promise<void> {
    try {
      await db.runAsync('UPDATE exercises SET name = ?, description = ? WHERE id = ?', [name, description || null, id]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'exercice:', error);
      throw error;
    }
  },

  async deleteExercise(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exercice:', error);
      throw error;
    }
  },

  async reorderExercises(exercises: Exercise[]): Promise<void> {
    try {
      for (let i = 0; i < exercises.length; i++) {
        await db.runAsync(
          'UPDATE exercises SET "order" = ? WHERE id = ?',
          [i, exercises[i].id]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des exercices:', error);
      throw error;
    }
  }
}; 