import { randomUUID } from "expo-crypto";
import exerciseLibrary from "../data/exerciseLibrary.json";
import { db } from "./database";

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  imageUrl?: string;
  description?: string;
  isDefault: boolean;
}

export const exerciseTemplateRepository = {
  async initializeDefaultTemplates(): Promise<void> {
    try {
      const result = await db.getAllAsync<ExerciseTemplate>('SELECT * FROM exercise_templates WHERE isDefault = 1');

      if (result.length === 0) {
        // Charger les exercices depuis le fichier JSON
        const exercises = exerciseLibrary.exercises;
        
        for (const exercise of exercises) {
          const template = {
            id: randomUUID(),
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            description: exercise.description,
            imageUrl: exercise.imageUrl,
            isDefault: 1
          };

          await db.runAsync(
            'INSERT INTO exercise_templates (id, name, muscleGroup, description, isDefault, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
            [template.id, template.name, template.muscleGroup, template.description, template.isDefault, template.imageUrl]
          );
        }
        console.log('Templates d\'exercices par défaut initialisés depuis le JSON');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des templates d\'exercices:', error);
      throw error;
    }
  },

  async getAllTemplates(): Promise<ExerciseTemplate[]> {
    try {
      return await db.getAllAsync<ExerciseTemplate>('SELECT * FROM exercise_templates ORDER BY muscleGroup, name');
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      throw error;
    }
  },

  async getTemplatesByMuscleGroup(muscleGroup: string): Promise<ExerciseTemplate[]> {
    try {
      return await db.getAllAsync<ExerciseTemplate>('SELECT * FROM exercise_templates WHERE muscleGroup = ? ORDER BY name', [muscleGroup]);
    } catch (error) {
      console.error('Erreur lors de la récupération des templates par groupe musculaire:', error);
      throw error;
    }
  },

  async getMuscleGroups(): Promise<string[]> {
    try {
      const result = await db.getAllAsync<{muscleGroup: string}>('SELECT DISTINCT muscleGroup FROM exercise_templates ORDER BY muscleGroup');
      return result.map(r => r.muscleGroup);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes musculaires:', error);
      throw error;
    }
  },

  async createTemplate(name: string, muscleGroup: string, description?: string, imageUrl?: string): Promise<ExerciseTemplate> {
    try {
      const id = randomUUID();
      await db.runAsync(
        'INSERT INTO exercise_templates (id, name, muscleGroup, description, imageUrl, isDefault) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, muscleGroup, description || null, imageUrl || null, 0]
      );
      return { id, name, muscleGroup, description, imageUrl, isDefault: false };
    } catch (error) {
      console.error('Erreur lors de la création du template:', error);
      throw error;
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM exercise_templates WHERE id = ? AND isDefault = 0', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
      throw error;
    }
  }
}; 