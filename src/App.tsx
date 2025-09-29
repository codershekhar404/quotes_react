import React, { Suspense, useEffect, useRef } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { FavoritesScreen } from './components/screens/FavoritesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AuthorDetailScreen } from './components/screens/AuthorDetailScreen';
import { CategoryDetailScreen } from './components/screens/CategoryDetailScreen';
import { ErrorScreen } from './components/screens/ErrorScreen';
import { HomeScreenSkeleton, DiscoverScreenSkeleton } from './components/states/LoadingStates';

function AppContent() {
  const { state, dispatch } = useAppContext();
  const isUpdatingFromHash = useRef(false);
  const isUpdatingFromState = useRef(false);

  // URL Hash se Context State ko sync karo (Browser back/forward/direct URL ke liye)
  useEffect(() => {
    const syncHashToContext = () => {
      if (isUpdatingFromState.current) {
        isUpdatingFromState.current = false;
        return;
      }

      isUpdatingFromHash.current = true;

      let currentPath = window.location.hash.substring(1);
      
      if (currentPath === '' || currentPath === '/') {
        currentPath = '/home';
        window.location.hash = '/home';
        isUpdatingFromHash.current = false;
        return;
      }

      const pathParts = currentPath.split('/').filter(p => p);
      const baseRoute = pathParts[0];
      const param = pathParts[1];

      let newScreen;
      let authorId;
      let categoryId;

      switch (baseRoute) {
        case 'home':
        case 'discover':
        case 'favorites':
        case 'settings':
        case '404':
        case 'network-error':
          newScreen = baseRoute;
          break;
        
        case 'author':
          newScreen = 'author';
          authorId = param;
          break;
        
        case 'category':
          newScreen = 'category';
          categoryId = param;
          break;
        
        default:
          newScreen = '404';
      }

      if (newScreen !== state.currentScreen || 
          authorId !== state.selectedAuthorId || 
          categoryId !== state.selectedCategoryId) {
        dispatch({ 
          type: 'SET_SCREEN', 
          payload: { 
            screen: newScreen as any,
            authorId,
            categoryId
          } 
        });
      }

      isUpdatingFromHash.current = false;
    };

    syncHashToContext();
    window.addEventListener('hashchange', syncHashToContext);

    return () => {
      window.removeEventListener('hashchange', syncHashToContext);
    };
  }, []); // Empty dependency array - sirf mount/unmount par

  // Context State se URL ko sync karo (Programmatic navigation ke liye)
  useEffect(() => {
    if (isUpdatingFromHash.current) {
      return;
    }

    isUpdatingFromState.current = true;

    let newHash = '';
    
    switch (state.currentScreen) {
      case 'home':
      case 'discover':
      case 'favorites':
      case 'settings':
      case '404':
      case 'network-error':
        newHash = `/${state.currentScreen}`;
        break;
      
      case 'author':
        if (state.selectedAuthorId) {
          newHash = `/author/${state.selectedAuthorId}`;
        } else {
          newHash = '/discover';
        }
        break;
      
      case 'category':
        if (state.selectedCategoryId) {
          newHash = `/category/${state.selectedCategoryId}`;
        } else {
          newHash = '/discover';
        }
        break;
    }

    if (newHash && window.location.hash !== `#${newHash}`) {
      window.location.hash = newHash;
    }
  }, [state.currentScreen, state.selectedAuthorId, state.selectedCategoryId]);

  const renderScreen = () => {
    if (state.isLoading) {
      switch (state.currentScreen) {
        case 'home':
          return <HomeScreenSkeleton />;
        case 'discover':
          return <DiscoverScreenSkeleton />;
        default:
          return <HomeScreenSkeleton />;
      }
    }

    switch (state.currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'discover':
        return <DiscoverScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'author':
        return <AuthorDetailScreen />;
      case 'category':
        return <CategoryDetailScreen />;
      case '404':
        return <ErrorScreen type="404" />;
      case 'network-error':
        return <ErrorScreen type="network-error" />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="size-full bg-background text-foreground">
      <main className="min-h-screen">
        <Suspense fallback={<HomeScreenSkeleton />}>
          {renderScreen()}
        </Suspense>
      </main>
      
      <BottomNavigation />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}