export interface Exercise {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Développé Couché',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    description: 'Exercice de base pour les pectoraux'
  },
  {
    id: '2',
    name: 'Squat',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    description: 'Exercice complet pour les jambes'
  },
  {
    id: '3',
    name: 'Tractions',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    description: 'Exercice pour le dos et les biceps'
  },
  {
    id: '4',
    name: 'Soulevé de Terre',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    description: 'Exercice complet pour tout le corps'
  }
]; 