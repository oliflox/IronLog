import { randomUUID } from "expo-crypto";
import { db } from "./database";

export interface Measurement {
  id: string;
  profileId: string;
  label: string;
  value: number;
  unit: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  lastWorkout?: string;
  createdAt: string;
  updatedAt: string;
  measurements?: Measurement[];
}

export interface ProfileWithMeasurements extends Profile {
  measurements: Measurement[];
}

export const profileRepository = {
  async getProfile(): Promise<ProfileWithMeasurements | null> {
    try {
      const profile = await db.getFirstAsync<Profile>(
        'SELECT * FROM profile ORDER BY createdAt DESC LIMIT 1'
      );

      if (!profile) {
        return null;
      }

      const measurements = await db.getAllAsync<Measurement>(
        'SELECT * FROM measurements WHERE profileId = ? ORDER BY createdAt DESC',
        [profile.id]
      );

      return {
        ...profile,
        measurements
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  async createProfile(firstName: string, lastName: string, avatar?: string): Promise<Profile> {
    try {
      const now = new Date().toISOString();
      const id = randomUUID();

      await db.runAsync(
        'INSERT INTO profile (id, firstName, lastName, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [id, firstName, lastName, avatar, now, now]
      );

      const createdProfile = await db.getFirstAsync<Profile>(
        'SELECT * FROM profile WHERE id = ?',
        [id]
      );

      return createdProfile!;
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      throw error;
    }
  },

  async updateProfile(id: string, updates: Partial<Pick<Profile, 'firstName' | 'lastName' | 'avatar' | 'lastWorkout'>>): Promise<void> {
    try {
      const now = new Date().toISOString();
      const fields = [];
      const values = [];

      if (updates.firstName !== undefined) {
        fields.push('firstName = ?');
        values.push(updates.firstName);
      }
      if (updates.lastName !== undefined) {
        fields.push('lastName = ?');
        values.push(updates.lastName);
      }
      if (updates.avatar !== undefined) {
        fields.push('avatar = ?');
        values.push(updates.avatar);
      }
      if (updates.lastWorkout !== undefined) {
        fields.push('lastWorkout = ?');
        values.push(updates.lastWorkout);
      }

      fields.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      await db.runAsync(
        `UPDATE profile SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  async addMeasurement(profileId: string, label: string, value: number, unit: string): Promise<Measurement> {
    try {
      const now = new Date().toISOString();
      const id = randomUUID();

      await db.runAsync(
        'INSERT INTO measurements (id, profileId, label, value, unit, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [id, profileId, label, value, unit, now]
      );

      const createdMeasurement = await db.getFirstAsync<Measurement>(
        'SELECT * FROM measurements WHERE id = ?',
        [id]
      );

      return createdMeasurement!;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la mensuration:', error);
      throw error;
    }
  },

  async updateMeasurement(id: string, value: number): Promise<void> {
    try {
      await db.runAsync(
        'UPDATE measurements SET value = ? WHERE id = ?',
        [value, id]
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la mensuration:', error);
      throw error;
    }
  },

  async deleteMeasurement(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM measurements WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression de la mensuration:', error);
      throw error;
    }
  },

  async getMeasurements(profileId: string): Promise<Measurement[]> {
    try {
      return await db.getAllAsync<Measurement>(
        'SELECT * FROM measurements WHERE profileId = ? ORDER BY createdAt DESC',
        [profileId]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des mensurations:', error);
      throw error;
    }
  },

  async initializeDefaultProfile(): Promise<void> {
    try {
      const existingProfile = await db.getFirstAsync<{ id: string }>('SELECT id FROM profile LIMIT 1');
      
      if (!existingProfile) {
        await this.createProfile('John', 'Doe');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du profil par défaut:', error);
      throw error;
    }
  }
}; 