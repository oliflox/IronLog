import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('mydb.db');

const executeWithRetry = async (operation: () => Promise<any>, maxRetries = 3, delay = 100) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Si c'est une erreur de verrouillage, attendre et réessayer
      if (error instanceof Error && error.message.includes('locked')) {
        console.log(`Tentative ${i + 1} échouée, nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Augmenter le délai exponentiellement
      } else {
        throw error;
      }
    }
  }
};

export const initDatabase = async () => {
  try {
    console.log('Début de l\'initialisation de la base de données...');

    // Créer la table workouts avec la colonne order si elle n'existe pas
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "order" INTEGER DEFAULT 0
      );
    `));

    // Vérifier si la colonne order existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT "order" FROM workouts LIMIT 1'));
      console.log('Colonne order existe déjà');
    } catch (error) {
      console.log('Ajout de la colonne order à la table workouts...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE workouts ADD COLUMN "order" INTEGER DEFAULT 0'));

      // Mettre à jour l'ordre des workouts existants
      const workouts = await executeWithRetry(() => db.getAllAsync<{ id: string }>('SELECT id FROM workouts'));
      for (let i = 0; i < workouts.length; i++) {
        await executeWithRetry(() => db.runAsync('UPDATE workouts SET "order" = ? WHERE id = ?', [i, workouts[i].id]));
      }
      console.log('Migration terminée avec succès');
    }

    // Créer la table sessions
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        workoutId TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        FOREIGN KEY (workoutId) REFERENCES workouts (id) ON DELETE CASCADE
      );
    `));

    console.log('Table sessions créée avec succès');

    // Créer la table exercises
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sessionId TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        imageUrl TEXT,
        description TEXT,
        FOREIGN KEY (sessionId) REFERENCES sessions (id) ON DELETE CASCADE
      );
    `));

    console.log('Table exercises créée avec succès');

    // Créer la table timers
    await executeWithRetry(() => db.execAsync('DROP TABLE IF EXISTS timers'));
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS timers (
        id TEXT PRIMARY KEY,
        duration INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0
      );
    `));

    console.log('Table timers créée avec succès');

    // Créer la table exercise_logs
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_logs (
        id TEXT PRIMARY KEY,
        exerciseId TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (exerciseId) REFERENCES exercises (id) ON DELETE CASCADE
      );
    `));

    console.log('Table exercise_logs créée avec succès');

    // Créer la table exercise_sets
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_sets (
        id TEXT PRIMARY KEY,
        logId TEXT NOT NULL,
        repetitions INTEGER NOT NULL,
        weight REAL NOT NULL,
        "order" INTEGER DEFAULT 0,
        FOREIGN KEY (logId) REFERENCES exercise_logs (id) ON DELETE CASCADE
      );
    `));

    console.log('Table exercise_sets créée avec succès');
    console.log('Initialisation de la base de données terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}; 