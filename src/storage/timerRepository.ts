import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface Timer {
  id: string;
  duration: number; // en secondes
  order: number;
}

export const timerRepository = {
  async initializeDefaultTimers(): Promise<void> {
    try {
      const result = await db.getAllAsync<Timer>('SELECT * FROM timers ORDER BY "order"');

      if (result.length === 0) {
        const timers = [
          { id: randomUUID(), duration: 30, order: 0 },
          { id: randomUUID(), duration: 60, order: 1 },
          { id: randomUUID(), duration: 120, order: 2 }
        ];

        for (const timer of timers) {
          await db.runAsync(
            'INSERT INTO timers (id, duration, "order") VALUES (?, ?, ?)',
            [timer.id, timer.duration, timer.order]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des timers par défaut:', error);
      throw error;
    }
  },

  async getAllTimers(): Promise<Timer[]> {
    try {
      return await db.getAllAsync<Timer>('SELECT * FROM timers ORDER BY "order"');
    } catch (error) {
      console.error('Erreur lors de la récupération des timers:', error);
      throw error;
    }
  },

  async createTimer(duration: number): Promise<Timer> {
    try {
      const id = randomUUID();
      const result = await db.getAllAsync<{maxOrder: number}>('SELECT COALESCE(MAX("order"), -1) as maxOrder FROM timers');
      const maxOrder = result[0]?.maxOrder || -1;
      const newOrder = maxOrder + 1;
      
      await db.runAsync(
        'INSERT INTO timers (id, duration, "order") VALUES (?, ?, ?)',
        [id, duration, newOrder]
      );
      return { id, duration, order: newOrder };
    } catch (error) {
      console.error('Erreur lors de la création du timer:', error);
      throw error;
    }
  },

  async updateTimer(id: string, duration: number): Promise<void> {
    try {
      await db.runAsync('UPDATE timers SET duration = ? WHERE id = ?', [duration, id]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du timer:', error);
      throw error;
    }
  },

  async deleteTimer(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM timers WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression du timer:', error);
      throw error;
    }
  },

  async reorderTimers(timers: Timer[]): Promise<void> {
    try {
      for (let i = 0; i < timers.length; i++) {
        await db.runAsync(
          'UPDATE timers SET "order" = ? WHERE id = ?',
          [i, timers[i].id]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des timers:', error);
      throw error;
    }
  }
}; 