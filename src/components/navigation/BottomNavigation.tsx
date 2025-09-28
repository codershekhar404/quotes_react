// import React from 'react';
// import { Home, Search, Heart, Settings } from 'lucide-react';
// import { Screen } from '../../types';
// import { useAppContext } from '../../contexts/AppContext';

// export function BottomNavigation() {
//   const { state, dispatch } = useAppContext();

//   const navItems = [
//     { screen: 'home' as Screen, icon: Home, label: 'Home' },
//     { screen: 'discover' as Screen, icon: Search, label: 'Discover' },
//     { screen: 'favorites' as Screen, icon: Heart, label: 'Favorites' },
//     { screen: 'settings' as Screen, icon: Settings, label: 'Settings' }
//   ];

//   const handleNavigation = (screen: Screen) => {
//     dispatch({ type: 'SET_SCREEN', payload: { screen } });
//   };

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
//       <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
//         {navItems.map(({ screen, icon: Icon, label }) => {
//           const isActive = state.currentScreen === screen;
//           return (
//             <button
//               key={screen}
//               onClick={() => handleNavigation(screen)}
//               className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
//                 isActive 
//                   ? 'text-primary bg-primary/10' 
//                   : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
//               }`}
//             >
//               <div className="relative">
//                 <Icon className="h-5 w-5" />
//                 {screen === 'favorites' && state.favorites.length > 0 && (
//                   <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
//                     {state.favorites.length > 9 ? '9+' : state.favorites.length}
//                   </div>
//                 )}
//               </div>
//               <span className="text-xs">{label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }

import React from 'react';
import { Home, Search, Heart, Settings } from 'lucide-react';
import { Screen } from '../../types'; // यह मानते हुए कि 'Screen' type यहाँ उपलब्ध है
import { useAppContext } from '../../contexts/AppContext';

export function BottomNavigation() {
  // state को बटन को active दिखाने के लिए अभी भी ज़रूरी है
  const { state } = useAppContext(); 

  const navItems = [
    // यहाँ 'screen' मान (home, discover, favorites, settings) URL Hash (/#/home) में path के रूप में उपयोग किए जाएंगे।
    { screen: 'home' as Screen, icon: Home, label: 'Home' },
    { screen: 'discover' as Screen, icon: Search, label: 'Discover' },
    { screen: 'favorites' as Screen, icon: Heart, label: 'Favorites' },
    { screen: 'settings' as Screen, icon: Settings, label: 'Settings' }
  ];

  const handleNavigation = (screen: Screen) => {
    // *** महत्वपूर्ण बदलाव ***
    // SET_SCREEN dispatch करने के बजाय, सीधे URL Hash को अपडेट करें।
    // App.tsx में लगा 'hashchange' listener context state को अपडेट करेगा।
    window.location.hash = `/${screen}`;
    
    // Note: यहाँ dispatch हटा दिया गया है क्योंकि App.tsx अब URL hash से context को सिंक्रनाइज़ करता है।
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const isActive = state.currentScreen === screen;
          return (
            <button
              key={screen}
              onClick={() => handleNavigation(screen)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {screen === 'favorites' && state.favorites.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                    {state.favorites.length > 9 ? '9+' : state.favorites.length}
                  </div>
                )}
              </div>
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
