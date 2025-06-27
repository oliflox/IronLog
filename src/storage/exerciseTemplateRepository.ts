import { randomUUID } from "expo-crypto";
import exerciseLibrary from "../data/exerciseLibrary.json";
import { db } from "./database";
import { ExerciseCategory, ExerciseType } from "./exerciseRepository";

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  imageUrl?: string;
  description?: string;
  isDefault: boolean;
  type: ExerciseType;
  category: ExerciseCategory;
}

const getExerciseTypeAndCategory = (muscleGroup: string): { type: ExerciseType; category: ExerciseCategory } => {
  if (muscleGroup === 'Cardio') {
    return { type: 'time', category: 'Cardio' };
  } else if (muscleGroup === 'Autres') {
    return { type: 'time', category: 'Autres' };
  } else {
    return { type: 'weight_reps', category: 'Musculation' };
  }
};

export const exerciseTemplateRepository = {
  async initializeDefaultTemplates(): Promise<void> {
    try {
      const existingTemplates = await db.getAllAsync<{ id: string }>('SELECT id FROM exercise_templates WHERE isDefault = 1');
      
      if (existingTemplates.length === 0) {
        for (const exercise of exerciseLibrary.exercises) {
          const { type, category } = getExerciseTypeAndCategory(exercise.muscleGroup);
          
          await db.runAsync(
            'INSERT INTO exercise_templates (id, name, muscleGroup, imageUrl, description, isDefault, type, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              randomUUID(),
              exercise.name,
              exercise.muscleGroup,
              exercise.imageUrl,
              exercise.description,
              1,
              type,
              category
            ]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des templates par défaut:', error);
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
      return await db.getAllAsync<ExerciseTemplate>(
        'SELECT * FROM exercise_templates WHERE muscleGroup = ? ORDER BY name',
        [muscleGroup]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des templates par groupe musculaire:', error);
      throw error;
    }
  },

  async getMuscleGroups(): Promise<string[]> {
    try {
      const groups = await db.getAllAsync<{ muscleGroup: string }>(
        'SELECT DISTINCT muscleGroup FROM exercise_templates ORDER BY muscleGroup'
      );
      return groups.map(g => g.muscleGroup);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes musculaires:', error);
      throw error;
    }
  },

  async createTemplate(name: string, muscleGroup: string, description?: string, imageUrl?: string): Promise<ExerciseTemplate> {
    try {
      const id = randomUUID();
      const { type, category } = getExerciseTypeAndCategory(muscleGroup);
      
      await db.runAsync(
        'INSERT INTO exercise_templates (id, name, muscleGroup, description, imageUrl, isDefault, type, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, muscleGroup, description || null, imageUrl || null, 0, type, category]
      );
      
      return {
        id,
        name,
        muscleGroup,
        description,
        imageUrl,
        isDefault: false,
        type,
        category
      };
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