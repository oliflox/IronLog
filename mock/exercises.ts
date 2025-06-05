export interface Exercise {
  id: string;
  name: string;
  imageUrl: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms';
  description: string;
}

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Développé Couché',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    category: 'chest',
    description: 'Exercice de base pour les pectoraux',
  },
  {
    id: '2',
    name: 'Squat',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500',
    category: 'legs',
    description: 'Exercice fondamental pour les jambes',
  },
  {
    id: '3',
    name: 'Tractions',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500',
    category: 'back',
    description: 'Excellent exercice pour le dos',
  },
  {
    id: '4',
    name: 'Développé Militaire',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500',
    category: 'shoulders',
    description: 'Exercice complet pour les épaules',
  },
  {
    id: '5',
    name: 'Curl Biceps',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500',
    category: 'arms',
    description: 'Exercice d\'isolation pour les biceps',
  },
]; 