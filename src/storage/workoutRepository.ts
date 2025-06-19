import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface Workout {
  id: string;
  name: string;
  order: number;
}

export const workoutRepository = {
  async initializeDefaultWorkouts(): Promise<void> {
    try {
      const result = await db.getAllAsync<Workout>('SELECT * FROM workouts ORDER BY COALESCE("order", 999999)');

      if (result.length === 0) {
        const workouts = [
          { id: randomUUID(), name: 'Yolo', order: 0 },
          { id: randomUUID(), name: 'Push Day', order: 1 },
          { id: randomUUID(), name: 'Pull Day', order: 2 }
        ];

        for (const workout of workouts) {
          await db.runAsync(
            'INSERT INTO workouts (id, name, "order") VALUES (?, ?, ?)',
            [workout.id, workout.name, workout.order]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des workouts par défaut:', error);
      throw error;
    }
  },

  async getAllWorkouts(): Promise<Workout[]> {
    try {
      return await db.getAllAsync<Workout>('SELECT * FROM workouts ORDER BY COALESCE("order", 999999)');
    } catch (error) {
      console.error('Erreur lors de la récupération des workouts:', error);
      throw error;
    }
  },

  async createWorkout(name: string): Promise<Workout> {
    try {
      const id = randomUUID();
      const result = await db.getAllAsync<{maxOrder: number}>('SELECT COALESCE(MAX("order"), -1) as maxOrder FROM workouts');
      const maxOrder = result[0]?.maxOrder || -1;
      const newOrder = maxOrder + 1;
      
      await db.runAsync(
        'INSERT INTO workouts (id, name, "order") VALUES (?, ?, ?)',
        [id, name, newOrder]
      );
      return { id, name, order: newOrder };
    } catch (error) {
      console.error('Erreur lors de la création du workout:', error);
      throw error;
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression du workout:', error);
      throw error;
    }
  },

  async reorderWorkouts(workouts: Workout[]): Promise<void> {
    try {
      for (let i = 0; i < workouts.length; i++) {
        await db.runAsync(
          'UPDATE workouts SET "order" = ? WHERE id = ?',
          [i, workouts[i].id]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des workouts:', error);
      throw error;
    }
  }
}; 