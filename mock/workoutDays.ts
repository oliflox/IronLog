export interface WorkoutDay {
  id: string;
  day: string;
  muscleGroup: string;
  exercises: string[];
}

export const workoutDaysByProgram: Record<string, WorkoutDay[]> = {
  '1': [ // Full Body Workout
    {
      id: '1-1',
      day: 'Lundi',
      muscleGroup: 'Full Body',
      exercises: ['Squats', 'Bench Press', 'Pull-ups', 'Shoulder Press', 'Deadlifts']
    },
    {
      id: '1-2',
      day: 'Mercredi',
      muscleGroup: 'Full Body',
      exercises: ['Lunges', 'Push-ups', 'Rows', 'Dips', 'Planks']
    },
    {
      id: '1-3',
      day: 'Vendredi',
      muscleGroup: 'Full Body',
      exercises: ['Deadlifts', 'Overhead Press', 'Pull-ups', 'Squats', 'Push-ups']
    }
  ],
  '2': [ // Upper Body Strength
    {
      id: '2-1',
      day: 'Lundi',
      muscleGroup: 'Chest & Triceps',
      exercises: ['Bench Press', 'Incline Dumbbell Press', 'Tricep Pushdowns', 'Chest Flyes']
    },
    {
      id: '2-2',
      day: 'Mercredi',
      muscleGroup: 'Back & Biceps',
      exercises: ['Pull-ups', 'Barbell Rows', 'Bicep Curls', 'Lat Pulldowns']
    },
    {
      id: '2-3',
      day: 'Vendredi',
      muscleGroup: 'Shoulders & Arms',
      exercises: ['Overhead Press', 'Lateral Raises', 'Hammer Curls', 'Tricep Extensions']
    }
  ],
  '3': [ // Leg Day
    {
      id: '3-1',
      day: 'Lundi',
      muscleGroup: 'Quadriceps',
      exercises: ['Squats', 'Leg Press', 'Lunges', 'Leg Extensions']
    },
    {
      id: '3-2',
      day: 'Mercredi',
      muscleGroup: 'Hamstrings',
      exercises: ['Deadlifts', 'Romanian Deadlifts', 'Leg Curls', 'Hip Thrusts']
    },
    {
      id: '3-3',
      day: 'Vendredi',
      muscleGroup: 'Calves & Glutes',
      exercises: ['Calf Raises', 'Hip Thrusts', 'Bulgarian Split Squats', 'Glute Bridges']
    }
  ]
}; 