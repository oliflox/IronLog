export interface Workout {
  id: string;
  name: string;
  imageUrl: string;
}

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Upper Body Strength',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Leg Day',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  },
]; 