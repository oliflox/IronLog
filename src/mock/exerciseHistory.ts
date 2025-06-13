export interface ExerciseHistory {
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

export const exerciseHistory: Record<string, ExerciseHistory> = {
  '1': {
    id: '1',
    name: 'Développé Couché',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    history: [
      {
        date: new Date().toISOString(),
        sets: [
          { id: '1', repetitions: 10, weight: 60 },
          { id: '2', repetitions: 8, weight: 65 },
          { id: '3', repetitions: 6, weight: 70 },
        ],
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours avant
        sets: [
          { id: '4', repetitions: 10, weight: 55 },
          { id: '5', repetitions: 8, weight: 60 },
          { id: '6', repetitions: 6, weight: 65 },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Squat',
    imageUrl: 'https://example.com/squat.jpg',
    history: [
      {
        date: new Date().toISOString(),
        sets: [
          { id: '1', repetitions: 8, weight: 100 },
          { id: '2', repetitions: 8, weight: 110 },
          { id: '3', repetitions: 6, weight: 120 },
        ],
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sets: [
          { id: '4', repetitions: 8, weight: 95 },
          { id: '5', repetitions: 8, weight: 105 },
          { id: '6', repetitions: 6, weight: 115 },
        ],
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Soulevé de Terre',
    imageUrl: 'https://example.com/deadlift.jpg',
    history: [
      {
        date: new Date().toISOString(),
        sets: [
          { id: '1', repetitions: 6, weight: 120 },
          { id: '2', repetitions: 6, weight: 130 },
          { id: '3', repetitions: 4, weight: 140 },
        ],
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sets: [
          { id: '4', repetitions: 6, weight: 115 },
          { id: '5', repetitions: 6, weight: 125 },
          { id: '6', repetitions: 4, weight: 135 },
        ],
      },
    ],
  },
}; 