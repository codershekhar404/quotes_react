import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Quote, UserPreferences, UserStats, Screen } from '../types';

interface AppState {
  currentScreen: Screen;
  selectedAuthorId?: string;
  selectedCategoryId?: string;
  favorites: Quote[];
  searchQuery: string;
  searchHistory: string[];
  preferences: UserPreferences;
  userStats: UserStats;
  isLoading: boolean;
  error?: string;
}

type AppAction =
  | { type: 'SET_SCREEN'; payload: { screen: Screen; authorId?: string; categoryId?: string } }
  | { type: 'ADD_FAVORITE'; payload: Quote }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'INCREMENT_QUOTES_READ' };

const initialState: AppState = {
  currentScreen: 'home',
  favorites: [],
  searchQuery: '',
  searchHistory: [],
  preferences: {
    theme: 'system',
    notifications: true,
    soundEffects: true,
    hapticFeedback: true,
    fontSize: 'medium'
  },
  userStats: {
    totalFavorites: 0,
    quotesRead: 0,
    streakDays: 1,
    joinDate: new Date().toISOString().split('T')[0],
    favoriteCategories: []
  },
  isLoading: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return {
        ...state,
        currentScreen: action.payload.screen,
        selectedAuthorId: action.payload.authorId,
        selectedCategoryId: action.payload.categoryId
      };
    
    case 'ADD_FAVORITE':
      const newFavorite = { ...action.payload, isFavorite: true };
      const updatedFavorites = [...state.favorites, newFavorite];
      return {
        ...state,
        favorites: updatedFavorites,
        userStats: {
          ...state.userStats,
          totalFavorites: updatedFavorites.length
        }
      };
    
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(quote => quote.id !== action.payload);
      return {
        ...state,
        favorites: filteredFavorites,
        userStats: {
          ...state.userStats,
          totalFavorites: filteredFavorites.length
        }
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    
    case 'ADD_SEARCH_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(item => item !== action.payload)].slice(0, 10);
      return {
        ...state,
        searchHistory: newHistory
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
        userStats: {
          ...state.userStats,
          totalFavorites: 0
        }
      };
    
    case 'INCREMENT_QUOTES_READ':
      return {
        ...state,
        userStats: {
          ...state.userStats,
          quotesRead: state.userStats.quotesRead + 1
        }
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('quotesApp_favorites');
    const savedPreferences = localStorage.getItem('quotesApp_preferences');
    const savedStats = localStorage.getItem('quotesApp_stats');
    const savedSearchHistory = localStorage.getItem('quotesApp_searchHistory');

    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      favorites.forEach((quote: Quote) => {
        dispatch({ type: 'ADD_FAVORITE', payload: quote });
      });
    }

    if (savedPreferences) {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: JSON.parse(savedPreferences) });
    }

    if (savedStats) {
      const stats = JSON.parse(savedStats);
      dispatch({ type: 'INCREMENT_QUOTES_READ' }); // This will trigger stats update
    }

    if (savedSearchHistory) {
      const history = JSON.parse(savedSearchHistory);
      history.forEach((query: string) => {
        dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query });
      });
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('quotesApp_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('quotesApp_preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  useEffect(() => {
    localStorage.setItem('quotesApp_stats', JSON.stringify(state.userStats));
  }, [state.userStats]);

  useEffect(() => {
    localStorage.setItem('quotesApp_searchHistory', JSON.stringify(state.searchHistory));
  }, [state.searchHistory]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.preferences.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}