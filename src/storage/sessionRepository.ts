import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface Session {
  id: string;
  name: string;
  workoutId: string;
  order: number;
}

export const sessionRepository = {
  async initializeDefaultSessions(workoutId: string): Promise<void> {
    try {
      const result = await db.getAllAsync<Session>('SELECT * FROM sessions WHERE workoutId = ? ORDER BY "order"', [workoutId]);

      if (result.length === 0) {
        const sessions = [
          { id: randomUUID(), name: 'Session 1', workoutId, order: 0 },
          { id: randomUUID(), name: 'Session 2', workoutId, order: 1 },
          { id: randomUUID(), name: 'Session 3', workoutId, order: 2 }
        ];

        for (const session of sessions) {
          await db.runAsync(
            'INSERT INTO sessions (id, name, workoutId, "order") VALUES (?, ?, ?, ?)',
            [session.id, session.name, session.workoutId, session.order]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des sessions par défaut:', error);
      throw error;
    }
  },

  async getSessionsByWorkoutId(workoutId: string): Promise<Session[]> {
    try {
      return await db.getAllAsync<Session>('SELECT * FROM sessions WHERE workoutId = ? ORDER BY "order"', [workoutId]);
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  },

  async createSession(name: string, workoutId: string): Promise<Session> {
    try {
      const id = randomUUID();
      const result = await db.getAllAsync<{maxOrder: number}>('SELECT COALESCE(MAX("order"), -1) as maxOrder FROM sessions WHERE workoutId = ?', [workoutId]);
      const maxOrder = result[0]?.maxOrder || -1;
      const newOrder = maxOrder + 1;
      
      await db.runAsync(
        'INSERT INTO sessions (id, name, workoutId, "order") VALUES (?, ?, ?, ?)',
        [id, name, workoutId, newOrder]
      );
      return { id, name, workoutId, order: newOrder };
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      throw error;
    }
  },

  async deleteSession(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM sessions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
      throw error;
    }
  },

  async reorderSessions(sessions: Session[]): Promise<void> {
    try {
      for (let i = 0; i < sessions.length; i++) {
        await db.runAsync(
          'UPDATE sessions SET "order" = ? WHERE id = ?',
          [i, sessions[i].id]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des sessions:', error);
      throw error;
    }
  },

  async updateSession(id: string, name: string): Promise<void> {
    try {
      await db.runAsync('UPDATE sessions SET name = ? WHERE id = ?', [name, id]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      throw error;
    }
  }
}; 