export interface Exercise {
  name: string;
  imageUrl: string;
}

export interface WorkoutSession {
  id: string;
  day: string;
  muscleGroup: string;
  imageUrl?: string;
  exercises: Exercise[];
}

export const Sessions: Record<string, WorkoutSession[]> = {
  '1': [ // Full Body Workout
    {
      id: '1-1',
      day: 'Lundi',
      muscleGroup: 'Full Body',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      exercises: [
        {
          name: 'Squats',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Bench Press',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Pull-ups',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Shoulder Press',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Deadlifts',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        }
      ]
    },
    {
      id: '1-2',
      day: 'Mercredi',
      muscleGroup: 'Full Body',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      exercises: [
        {
          name: 'Lunges',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Push-ups',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Rows',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Dips',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Planks',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        }
      ]
    }
  ],
  '2': [ // Upper Body Strength
    {
      id: '2-1',
      day: 'Lundi',
      muscleGroup: 'Chest & Triceps',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      exercises: [
        {
          name: 'Bench Press',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Incline Dumbbell Press',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Tricep Pushdowns',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        },
        {
          name: 'Chest Flyes',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
        }
      ]
    },
  ]
}; 