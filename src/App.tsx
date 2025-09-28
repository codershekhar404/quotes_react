import React, { Suspense } from 'react';
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
  const { state } = useAppContext();

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