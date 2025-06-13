
export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
};

export type WorkoutDay = {
  date: string;
  exercises: Exercise[];
};

export const mockWorkouts: Record<string, WorkoutDay> = {
  '2025-06-02': {
    date: '2025-06-02',
    exercises: [
      { id: '1', name: 'Développé Couché', sets: 4, reps: 12 },
      { id: '2', name: 'Squat', sets: 5, reps: 8 },
      { id: '3', name: 'Tractions', sets: 3, reps: 10 },
    ],
  },
  '2025-06-05': {
    date: '2025-06-05',
    exercises: [
      { id: '4', name: 'Soulevé de Terre', sets: 4, reps: 6 },
      { id: '5', name: 'Presse à Cuisses', sets: 4, reps: 12 },
    ],
  },
  '2025-06-08': {
    date: '2025-06-08',
    exercises: [
      { id: '6', name: 'Développé Militaire', sets: 4, reps: 10 },
      { id: '7', name: 'Rowing Barre', sets: 4, reps: 12 },
    ],
  },
}; 