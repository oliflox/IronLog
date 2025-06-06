export interface WorkoutLog {
  id: string;
  name: string;
  imageUrl: string;
  history: {
    date: string;
    sets: {
      id: string;
      repetitions: number;
      weight: number;
    }[];
  }[];
}

export const workoutLog: Record<string, WorkoutLog> = {
  '1': {
    id: '1',
    name: 'Développé Couché',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    history: [
      {
        date: '2024-03-20',
        sets: [
          { id: '1', repetitions: 12, weight: 60 },
          { id: '2', repetitions: 10, weight: 65 },
          { id: '3', repetitions: 8, weight: 70 },
        ],
      },
      {
        date: '2024-03-13',
        sets: [
          { id: '4', repetitions: 12, weight: 55 },
          { id: '5', repetitions: 10, weight: 60 },
          { id: '6', repetitions: 8, weight: 65 },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Squat',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    history: [
      {
        date: '2024-03-20',
        sets: [
          { id: '7', repetitions: 10, weight: 80 },
          { id: '8', repetitions: 8, weight: 90 },
          { id: '9', repetitions: 6, weight: 100 },
        ],
      },
    ],
  },
}; 