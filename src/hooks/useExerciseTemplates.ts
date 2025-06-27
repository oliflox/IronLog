import { useEffect, useState } from 'react';
import { ExerciseTemplate, exerciseTemplateRepository } from '../storage/exerciseTemplateRepository';

export const useExerciseTemplates = () => {
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialiser les templates par défaut si nécessaire
      await exerciseTemplateRepository.initializeDefaultTemplates();
      
      // Charger tous les templates
      const allTemplates = await exerciseTemplateRepository.getAllTemplates();
      setTemplates(allTemplates);
      
      // Charger les groupes musculaires
      const groups = await exerciseTemplateRepository.getMuscleGroups();
      setMuscleGroups(groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des templates');
    } finally {
      setLoading(false);
    }
  };

  const getTemplatesByMuscleGroup = async (muscleGroup: string): Promise<ExerciseTemplate[]> => {
    try {
      return await exerciseTemplateRepository.getTemplatesByMuscleGroup(muscleGroup);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des templates');
      return [];
    }
  };

  const createTemplate = async (name: string, muscleGroup: string, description?: string, imageUrl?: string): Promise<void> => {
    try {
      await exerciseTemplateRepository.createTemplate(name, muscleGroup, description, imageUrl);
      await loadTemplates(); // Recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du template');
      throw err;
    }
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    try {
      await exerciseTemplateRepository.deleteTemplate(id);
      await loadTemplates(); // Recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du template');
      throw err;
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    muscleGroups,
    loading,
    error,
    loadTemplates,
    getTemplatesByMuscleGroup,
    createTemplate,
    deleteTemplate
  };
}; 