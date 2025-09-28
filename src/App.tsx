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

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { AppProvider } from './contexts/AppContext';

// सभी आवश्यक स्क्रीन कंपोनेंट्स को वापस इंपोर्ट किया गया है
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { FavoritesScreen } from './components/screens/FavoritesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AuthorDetailScreen } from './components/screens/AuthorDetailScreen';
import { CategoryDetailScreen } from './components/screens/CategoryDetailScreen';
import { ErrorScreen } from './components/screens/ErrorScreen';
import { HomeScreenSkeleton, DiscoverScreenSkeleton } from './components/states/LoadingStates';

// URL Paths को स्क्रीन कंपोनेंट्स के साथ मैप करना
const SCREEN_MAP = {
  '/': HomeScreen, // Root path
  '/home': HomeScreen,
  '/discover': DiscoverScreen,
  '/favorites': FavoritesScreen,
  '/settings': SettingsScreen,
  // Note: Dynamic paths (जैसे /author/123) के लिए एडवांस लॉजिक की आवश्यकता होगी
  '/author': AuthorDetailScreen, 
  '/category': CategoryDetailScreen,
};

// नोट: AppContent अब URL-आधारित Routing का उपयोग करके स्क्रीन को रेंडर करता है।
function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // 1. URL बदलने पर स्टेट को अपडेट करने के लिए इफ़ेक्ट
  useEffect(() => {
    // ब्राउज़र के बैक/फॉरवर्ड बटन को हैंडल करना
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // इतिहास बदलने वाली फंक्शनैलिटी (जैसे BottomNavigation से pushState कॉल) को इंटरसेप्ट करें
    const originalPushState = window.history.pushState;
    window.history.pushState = (data, title, url) => {
      originalPushState.call(window.history, data, title, url);
      // pushState के बाद path को मैन्युअल रूप से अपडेट करें
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState; // cleanup
    };
  }, []);

  // 2. वर्तमान Path के आधार पर सही कंपोनेंट चुनें
  const getCurrentScreen = useMemo(() => {
    // URL से केवल पहला सेगमेंट निकालें (उदाहरण: /discover/123 को /discover में बदलें)
    const pathSegment = currentPath.split('/')[1] || '';
    const cleanPath = pathSegment === '' ? '/' : `/${pathSegment}`;

    let ScreenComponent = SCREEN_MAP[cleanPath as keyof typeof SCREEN_MAP];

    if (!ScreenComponent) {
      // अगर path नहीं मिला, तो 404 ErrorScreen दिखाएँ
      return <ErrorScreen type="404" />;
    }
    
    // सस्पेंस के भीतर चयनित स्क्रीन कंपोनेंट रेंडर करें
    return <ScreenComponent />;

  }, [currentPath]);


  return (
    <div className="size-full bg-background text-foreground">
      <main className="min-h-screen">
        <Suspense fallback={<HomeScreenSkeleton />}>
          {getCurrentScreen}
        </Suspense>
      </main>
      
      {/* Bottom Navigation को बरकरार रखा गया है। 
          यह उम्मीद की जाती है कि इसके लिंक अब window.history.pushState() का उपयोग करके नेविगेट करेंगे। */}
      <BottomNavigation />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            zIndex: 99999, // सुनिश्चित करें कि टोस्टर दिखाई दे
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
