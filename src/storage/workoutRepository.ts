import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface Workout {
  id: string;
  name: string;
}

export const workoutRepository = {
  async initializeDefaultWorkouts(): Promise<void> {
    try {
      const result = await db.getAllAsync<Workout>('SELECT * FROM workouts');

      if (result.length === 0) {
        const workouts = [
          { id: randomUUID(), name: 'Yolo' },
          { id: randomUUID(), name: 'Push Day' },
          { id: randomUUID(), name: 'Pull Day' }
        ];

        for (const workout of workouts) {
          await db.runAsync(
            'INSERT INTO workouts (id, name) VALUES (?, ?)',
            [workout.id, workout.name]
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
      return await db.getAllAsync<Workout>('SELECT * FROM workouts');
    } catch (error) {
      console.error('Erreur lors de la récupération des workouts:', error);
      throw error;
    }
  },

  async createWorkout(name: string): Promise<Workout> {
    try {
      const id = randomUUID();
      await db.runAsync(
        'INSERT INTO workouts (id, name) VALUES (?, ?)',
        [id, name]
      );
      return { id, name };
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
  }
}; 