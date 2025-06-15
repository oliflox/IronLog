// Types pour les réponses de l'API
export interface Workout {
  id: string;
  name: string;
  description?: string;
  sessions: Session[];
}

export interface Session {
  id: string;
  workoutId: Workout['id'];
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  sessionId: Session['id'];
  name: string;
  description?: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  date: string;
}

// Types pour les requêtes API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Types pour les erreurs API
export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 