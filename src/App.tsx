// import React, { Suspense } from 'react';
// import { Toaster } from 'sonner@2.0.3';
// import { AppProvider, useAppContext } from './contexts/AppContext';
// import { BottomNavigation } from './components/navigation/BottomNavigation';
// import { HomeScreen } from './components/screens/HomeScreen';
// import { DiscoverScreen } from './components/screens/DiscoverScreen';
// import { FavoritesScreen } from './components/screens/FavoritesScreen';
// import { SettingsScreen } from './components/screens/SettingsScreen';
// import { AuthorDetailScreen } from './components/screens/AuthorDetailScreen';
// import { CategoryDetailScreen } from './components/screens/CategoryDetailScreen';
// import { ErrorScreen } from './components/screens/ErrorScreen';
// import { HomeScreenSkeleton, DiscoverScreenSkeleton } from './components/states/LoadingStates';

// function AppContent() {
//   const { state } = useAppContext();

//   const renderScreen = () => {
//     if (state.isLoading) {
//       switch (state.currentScreen) {
//         case 'home':
//           return <HomeScreenSkeleton />;
//         case 'discover':
//           return <DiscoverScreenSkeleton />;
//         default:
//           return <HomeScreenSkeleton />;
//       }
//     }

//     switch (state.currentScreen) {
//       case 'home':
//         return <HomeScreen />;
//       case 'discover':
//         return <DiscoverScreen />;
//       case 'favorites':
//         return <FavoritesScreen />;
//       case 'settings':
//         return <SettingsScreen />;
//       case 'author':
//         return <AuthorDetailScreen />;
//       case 'category':
//         return <CategoryDetailScreen />;
//       case '404':
//         return <ErrorScreen type="404" />;
//       case 'network-error':
//         return <ErrorScreen type="network-error" />;
//       default:
//         return <HomeScreen />;
//     }
//   };

//   return (
//     <div className="size-full bg-background text-foreground">
//       <main className="min-h-screen">
//         <Suspense fallback={<HomeScreenSkeleton />}>
//           {renderScreen()}
//         </Suspense>
//       </main>
      
//       <BottomNavigation />
      
//       <Toaster 
//         position="top-center"
//         toastOptions={{
//           duration: 2000,
//           style: {
//             background: 'var(--card)',
//             color: 'var(--card-foreground)',
//             border: '1px solid var(--border)',
//           },
//         }}
//       />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <AppProvider>
//       <AppContent />
//     </AppProvider>
//   );
// }

import React, { Suspense, useEffect } from 'react';
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

// AppContext के 'Screen' keys को URL Hash paths से मैप करना
const hashToScreenMap: { [key: string]: string } = {
  'home': 'home',
  'discover': 'discover',
  'favorites': 'favorites',
  'settings': 'settings',
  'author': 'author', // /#/author/123 जैसे डायनामिक राउट्स के लिए
  'category': 'category', // /#/category/abc जैसे डायनामिक राउट्स के लिए
  '404': '404',
  'network-error': 'network-error',
};


function AppContent() {
  const { state, dispatch } = useAppContext();

  // URL Hash (/#/route) को Context State के साथ सिंक्रनाइज़ करने के लिए useEffect
  useEffect(() => {
    const syncHashToContext = () => {
      // 1. URL hash से '#' हटाएँ
      let currentPath = window.location.hash.substring(1);
      
      // 2. /home को डिफ़ॉल्ट रूट के रूप में सेट करें अगर hash खाली है
      if (currentPath === '' || currentPath === '/') {
        currentPath = '/home';
        window.location.hash = '/home';
      }

      // 3. पाथ सेगमेंट (जैसे '/author/123' से 'author') निकालें
      const cleanPath = currentPath.split('/')[1] || ''; 
      
      // 4. मैप से स्क्रीन की जांच करें
      const mappedScreen = hashToScreenMap[cleanPath];
      
      let newScreen = mappedScreen;
      if (!newScreen) {
        // यदि कोई स्क्रीन नहीं मिली, तो 404 पर जाएँ
        newScreen = '404';
      }

      // 5. यदि नई स्क्रीन वर्तमान स्क्रीन से अलग है, तो context को अपडेट करें
      if (newScreen && newScreen !== state.currentScreen) {
        dispatch({ type: 'SET_SCREEN', payload: { screen: newScreen as any } });
      }
    };

    // 'hashchange' इवेंट को जोड़ें
    window.addEventListener('hashchange', syncHashToContext);

    // Initial load पर State को Hash से सिंक्रनाइज़ करें
    syncHashToContext(); 

    // Event listener को हटाएँ जब कंपोनेंट अनमाउंट हो
    return () => {
      window.removeEventListener('hashchange', syncHashToContext);
    };
  }, [dispatch, state.currentScreen]);

  const renderScreen = () => {
    // यह लॉजिक context state (जो अब URL hash से अपडेट होता है) पर निर्भर करता है।
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
        return <AuthorDetailScreen />; // AuthorDetailScreen रेंडर होगा
      case 'category':
        return <CategoryDetailScreen />; // CategoryDetailScreen रेंडर होगा
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
