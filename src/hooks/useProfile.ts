import { useEffect, useState } from 'react';
import { exerciseLogRepository } from '../storage/exerciseLogRepository';
import { profileRepository, ProfileWithMeasurements } from '../storage/profileRepository';

export interface ProfileData {
  profile: ProfileWithMeasurements | null;
  weeklyStats: {
    reps: number;
    weight: number;
    workouts: number;
    duration: string;
  };
  topExercises: Array<{
    name: string;
    record: string;
  }>;
  lastWorkout: string | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    profile: null,
    weeklyStats: { reps: 0, weight: 0, workouts: 0, duration: '0h 0m' },
    topExercises: [],
    lastWorkout: null,
    loading: true,
    error: null
  });

  const loadProfileData = async () => {
    try {
      setProfileData(prev => ({ ...prev, loading: true, error: null }));

      // Charger le profil
      const profile = await profileRepository.getProfile();
      
      // Si pas de profil, en créer un par défaut
      if (!profile) {
        await profileRepository.initializeDefaultProfile();
        const newProfile = await profileRepository.getProfile();
        setProfileData(prev => ({ ...prev, profile: newProfile }));
      } else {
        setProfileData(prev => ({ ...prev, profile }));
      }

      // Charger les statistiques hebdomadaires
      const weeklyStats = await exerciseLogRepository.getWeeklyStats();
      
      // Charger les exercices principaux
      const topExercises = await exerciseLogRepository.getTopExercises();
      
      // Charger la date du dernier entraînement
      const lastWorkout = await exerciseLogRepository.getLastWorkoutDate();

      setProfileData(prev => ({
        ...prev,
        weeklyStats,
        topExercises,
        lastWorkout,
        loading: false
      }));

    } catch (error) {
      console.error('Erreur lors du chargement des données du profil:', error);
      setProfileData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        loading: false
      }));
    }
  };

  const updateProfile = async (updates: Partial<Pick<ProfileWithMeasurements, 'firstName' | 'lastName' | 'avatar' | 'lastWorkout'>>) => {
    try {
      if (!profileData.profile) {
        throw new Error('Aucun profil à mettre à jour');
      }

      await profileRepository.updateProfile(profileData.profile.id, updates);
      await loadProfileData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  const addMeasurement = async (label: string, value: number, unit: string) => {
    try {
      if (!profileData.profile) {
        throw new Error('Aucun profil pour ajouter une mensuration');
      }

      await profileRepository.addMeasurement(profileData.profile.id, label, value, unit);
      await loadProfileData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la mensuration:', error);
      throw error;
    }
  };

  const updateMeasurement = async (id: string, value: number) => {
    try {
      await profileRepository.updateMeasurement(id, value);
      await loadProfileData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la mensuration:', error);
      throw error;
    }
  };

  const deleteMeasurement = async (id: string) => {
    try {
      await profileRepository.deleteMeasurement(id);
      await loadProfileData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la suppression de la mensuration:', error);
      throw error;
    }
  };

  const refreshData = () => {
    loadProfileData();
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return {
    ...profileData,
    updateProfile,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    refreshData
  };
}; 