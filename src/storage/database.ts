import { openDatabaseSync } from 'expo-sqlite';
import { exerciseTemplateRepository } from './exerciseTemplateRepository';

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
        muscleGroup TEXT,
        type TEXT DEFAULT 'weight_reps',
        category TEXT DEFAULT 'Musculation',
        FOREIGN KEY (sessionId) REFERENCES sessions (id) ON DELETE CASCADE
      );
    `));

    console.log('Table exercises créée avec succès');

    // Vérifier si la colonne muscleGroup existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT muscleGroup FROM exercises LIMIT 1'));
      console.log('Colonne muscleGroup existe déjà');
    } catch (error) {
      console.log('Ajout de la colonne muscleGroup à la table exercises...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE exercises ADD COLUMN muscleGroup TEXT'));
      console.log('Migration muscleGroup terminée avec succès');
    }

    // Vérifier si la colonne type existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT type FROM exercises LIMIT 1'));
      console.log('Colonne type existe déjà');
    } catch (error) {
      console.log('Ajout de la colonne type à la table exercises...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE exercises ADD COLUMN type TEXT DEFAULT "weight_reps"'));
      console.log('Migration type terminée avec succès');
    }

    // Vérifier si la colonne category existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT category FROM exercises LIMIT 1'));
      console.log('Colonne category existe déjà');
    } catch (error) {
      console.log('Ajout de la colonne category à la table exercises...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE exercises ADD COLUMN category TEXT DEFAULT "Musculation"'));
      console.log('Migration category terminée avec succès');
    }

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
    await executeWithRetry(() => db.execAsync('DROP TABLE IF EXISTS exercise_sets'));
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_sets (
        id TEXT PRIMARY KEY,
        logId TEXT NOT NULL,
        repetitions INTEGER,
        weight REAL,
        duration INTEGER,
        "order" INTEGER DEFAULT 0,
        FOREIGN KEY (logId) REFERENCES exercise_logs (id) ON DELETE CASCADE
      );
    `));

    console.log('Table exercise_sets créée avec succès');

    // Vérifier si la colonne duration existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT duration FROM exercise_sets LIMIT 1'));
      console.log('Colonne duration existe déjà');
    } catch (error) {
      console.log('Ajout de la colonne duration à la table exercise_sets...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE exercise_sets ADD COLUMN duration INTEGER'));
      console.log('Migration duration terminée avec succès');
    }

    // Créer la table profile
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS profile (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        avatar TEXT,
        lastWorkout TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `));

    console.log('Table profile créée avec succès');

    // Créer la table measurements
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS measurements (
        id TEXT PRIMARY KEY,
        profileId TEXT NOT NULL,
        label TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (profileId) REFERENCES profile (id) ON DELETE CASCADE
      );
    `));

    console.log('Table measurements créée avec succès');

    // Créer la table exercise_templates pour les exercices prédéfinis
    await executeWithRetry(() => db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        muscleGroup TEXT NOT NULL,
        imageUrl TEXT,
        description TEXT,
        isDefault INTEGER DEFAULT 0,
        type TEXT DEFAULT 'weight_reps',
        category TEXT DEFAULT 'Musculation'
      );
    `));

    console.log('Table exercise_templates créée avec succès');

    // Vérifier si la colonne type existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT type FROM exercise_templates LIMIT 1'));
      console.log('Colonne type existe déjà dans exercise_templates');
    } catch (error) {
      console.log('Ajout de la colonne type à la table exercise_templates...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE exercise_templates ADD COLUMN type TEXT DEFAULT "weight_reps"'));
      console.log('Migration type exercise_templates terminée avec succès');
    }

    // Vérifier si la colonne category existe, sinon l'ajouter
    try {
      await executeWithRetry(() => db.execAsync('SELECT category FROM exercise_templates LIMIT 1'));
      console.log('Colonne category existe déjà dans exercise_templates');
    } catch (error) {
      console.log('Ajout de la colonne category à la table exercise_templates...');
      await executeWithRetry(() => db.execAsync('ALTER TABLE exercise_templates ADD COLUMN category TEXT DEFAULT "Musculation"'));
      console.log('Migration category exercise_templates terminée avec succès');
    }

    // Initialiser les templates d'exercices par défaut
    await exerciseTemplateRepository.initializeDefaultTemplates();

    // Migration des exercices existants pour les types et catégories
    try {
      console.log('Migration des types et catégories des exercices existants...');
      
      // Mettre à jour les exercices de musculation
      await executeWithRetry(() => db.runAsync(
        'UPDATE exercises SET type = "weight_reps", category = "Musculation" WHERE muscleGroup IN ("Pectoraux", "Dos", "Épaules", "Biceps", "Triceps", "Jambes", "Abdominaux")'
      ));
      
      // Mettre à jour les exercices cardio
      await executeWithRetry(() => db.runAsync(
        'UPDATE exercises SET type = "time", category = "Cardio" WHERE muscleGroup = "Cardio"'
      ));
      
      // Mettre à jour les exercices autres
      await executeWithRetry(() => db.runAsync(
        'UPDATE exercises SET type = "time", category = "Autres" WHERE muscleGroup = "Autres"'
      ));
      
      // Mettre à jour les exercices sans groupe musculaire (par défaut musculation)
      await executeWithRetry(() => db.runAsync(
        'UPDATE exercises SET type = "weight_reps", category = "Musculation" WHERE muscleGroup IS NULL OR muscleGroup = ""'
      ));
      
      console.log('Migration des types et catégories terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de la migration des types et catégories:', error);
    }

    console.log('Initialisation de la base de données terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

export const resetExerciseData = async () => {
  try {
    console.log('Réinitialisation des données d\'exercices...');
    
    // Supprimer tous les exercices existants
    await executeWithRetry(() => db.runAsync('DELETE FROM exercises'));
    console.log('Exercices supprimés');
    
    // Supprimer tous les templates existants
    await executeWithRetry(() => db.runAsync('DELETE FROM exercise_templates'));
    console.log('Templates supprimés');
    
    // Réinitialiser les templates par défaut
    await exerciseTemplateRepository.initializeDefaultTemplates();
    console.log('Templates par défaut réinitialisés');
    
    console.log('Réinitialisation terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw error;
  }
}; 