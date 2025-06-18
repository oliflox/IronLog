import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('mydb.db');

export const initDatabase = async () => {
  try {   
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}; 