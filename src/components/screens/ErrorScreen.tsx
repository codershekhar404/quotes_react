import React from 'react';
import { 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Home, 
  Search, 
  TrendingUp 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { mockCategories } from '../../data/mockData';

interface ErrorScreenProps {
  type: '404' | 'network-error';
}

export function ErrorScreen({ type }: ErrorScreenProps) {
  const { dispatch } = useAppContext();

  const handleRetry = () => {
    // In a real app, this would retry the failed operation
    window.location.reload();
  };

  const handleNavigation = (screen: 'home' | 'discover' | 'favorites' | 'settings') => {
    dispatch({ type: 'SET_SCREEN', payload: { screen } });
  };

  const handleCategoryClick = (categoryId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'category', categoryId } });
  };

  if (type === '404') {
    return (
      <div className="pb-20 min-h-screen flex items-center justify-center">
        <div className="px-6 w-full max-w-md">
          <Card className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="h-10 w-10 text-orange-500" />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl">404</h1>
                <h2>Page Not Found</h2>
                <p className="text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleNavigation('home')}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleNavigation('discover')}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Discover Quotes
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Or explore popular categories:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mockCategories.slice(0, 4).map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.icon} {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (type === 'network-error') {
    return (
      <div className="pb-20 min-h-screen flex items-center justify-center">
        <div className="px-6 w-full max-w-md">
          <Card className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <Wifi className="h-10 w-10 text-red-500" />
              </div>
              
              <div className="space-y-3">
                <h2>Connection Error</h2>
                <p className="text-muted-foreground">
                  Unable to connect to the server. Please check your internet connection and try again.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Button 
                    onClick={handleRetry}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleNavigation('home')}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Some content available offline</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      While offline, you can still:
                    </p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>View your favorites</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>Browse cached quotes</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>Adjust your settings</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation('favorites')}
                    className="w-full"
                  >
                    View Favorites
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}