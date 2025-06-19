import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('mydb.db');

export const initDatabase = async () => {
  try {   
    // Créer la table workouts avec la colonne order si elle n'existe pas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "order" INTEGER DEFAULT 0
      );
    `);
    
    // Vérifier si la colonne order existe, sinon l'ajouter
    try {
      await db.execAsync('SELECT "order" FROM workouts LIMIT 1');
      console.log('Colonne order existe déjà');
    } catch (error) {
      console.log('Ajout de la colonne order à la table workouts...');
      await db.execAsync('ALTER TABLE workouts ADD COLUMN "order" INTEGER DEFAULT 0');
      
      // Mettre à jour l'ordre des workouts existants
      const workouts = await db.getAllAsync<{id: string}>('SELECT id FROM workouts');
      for (let i = 0; i < workouts.length; i++) {
        await db.runAsync('UPDATE workouts SET "order" = ? WHERE id = ?', [i, workouts[i].id]);
      }
      console.log('Migration terminée avec succès');
    }

    // Créer la table sessions
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        workoutId TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        FOREIGN KEY (workoutId) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `);
    
    console.log('Table sessions créée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}; 