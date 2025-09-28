export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  tags: string[];
  likes: number;
  isFavorite?: boolean;
  date?: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  birthYear?: number;
  deathYear?: number;
  quoteCount: number;
  image?: string;
  nationality?: string;
  profession?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  quoteCount: number;
  color: string;
  icon: string;
  image?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface UserStats {
  totalFavorites: number;
  quotesRead: number;
  streakDays: number;
  joinDate: string;
  favoriteCategories: string[];
}

export type Screen = 'home' | 'discover' | 'favorites' | 'settings' | 'author' | 'category' | '404' | 'network-error';