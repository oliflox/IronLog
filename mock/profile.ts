// Données mockées du profil utilisateur
export const profileMock = {
  name: 'John Doe',
  lastWorkout: '22 avril',
  avatar: require('../assets/images/icon.png'), // à remplacer par la vraie photo si besoin
  measurements: [
    { label: 'Bras', value: 16, unit: 'cm' },
    { label: 'Poitrine', value: 42, unit: 'cm' },
    { label: 'Taille', value: 32, unit: 'cm' },
    { label: 'Cuisse', value: 24, unit: 'cm' },
    { label: 'Poids', value: 190, unit: 'kg' },
    { label: 'Hauteur', value: 72, unit: 'cm' },
  ],
  weekly: {
    reps: 14250,
    weight: 36500,
    workouts: 5,
    duration: '5h 30m',
  },
  topExercises: [
    { name: 'Développé couché', record: '120kg' },
    { name: 'Soulevé de terre', record: '180kg' },
    { name: 'Squat', record: '150kg' },
  ],
}; 