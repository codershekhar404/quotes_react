import React from 'react';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Volume2, 
  Smartphone, 
  Info, 
  User, 
  BarChart3,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useAppContext } from '../../contexts/AppContext';

export function SettingsScreen() {
  const { state, dispatch } = useAppContext();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: { theme } });
  };

  const handleTogglePreference = (key: keyof typeof state.preferences) => {
    if (typeof state.preferences[key] === 'boolean') {
      dispatch({ 
        type: 'UPDATE_PREFERENCES', 
        payload: { [key]: !state.preferences[key] } 
      });
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Clear app cache? This will not affect your favorites or settings.')) {
      // In a real app, this would clear cached data
      console.log('Cache cleared');
    }
  };

  const handleResetPreferences = () => {
    if (window.confirm('Reset all preferences to default? This will not affect your favorites.')) {
      dispatch({ 
        type: 'UPDATE_PREFERENCES', 
        payload: {
          theme: 'system',
          notifications: true,
          soundEffects: true,
          hapticFeedback: true,
          fontSize: 'medium'
        }
      });
    }
  };

  const handleExportData = () => {
    const data = {
      favorites: state.favorites,
      preferences: state.preferences,
      stats: state.userStats,
      searchHistory: state.searchHistory,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quotes-app-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ] as const;

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      {/* User Profile */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Profile</h2>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 opacity-70" />
            </div>
            <div className="flex-1">
              <h3>Quote Enthusiast</h3>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(state.userStats.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg text-primary">{state.userStats.totalFavorites}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
            <div>
              <p className="text-lg text-green-500">{state.userStats.quotesRead}</p>
              <p className="text-xs text-muted-foreground">Quotes Read</p>
            </div>
            <div>
              <p className="text-lg text-orange-500">{state.userStats.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Theme Settings */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Appearance</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <Card
                    key={value}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      state.preferences.theme === value
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => handleThemeChange(value)}
                  >
                    <div className="text-center space-y-2">
                      <Icon className="h-6 w-6 mx-auto" />
                      <p className="text-sm">{label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Notification Settings */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Notifications & Feedback</h2>
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Daily quote reminders
                </p>
              </div>
            </div>
            <Switch
              checked={state.preferences.notifications}
              onCheckedChange={() => handleTogglePreference('notifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>Sound Effects</p>
                <p className="text-sm text-muted-foreground">
                  Interaction sounds
                </p>
              </div>
            </div>
            <Switch
              checked={state.preferences.soundEffects}
              onCheckedChange={() => handleTogglePreference('soundEffects')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>Haptic Feedback</p>
                <p className="text-sm text-muted-foreground">
                  Vibration feedback
                </p>
              </div>
            </div>
            <Switch
              checked={state.preferences.hapticFeedback}
              onCheckedChange={() => handleTogglePreference('hapticFeedback')}
            />
          </div>
        </Card>
      </section>

      {/* Data Management */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Data Management</h2>
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your data
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              Export
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>Clear Cache</p>
                <p className="text-sm text-muted-foreground">
                  Free up storage space
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearCache}>
              Clear
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>Reset Preferences</p>
                <p className="text-sm text-muted-foreground">
                  Restore default settings
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleResetPreferences}>
              Reset
            </Button>
          </div>
        </Card>
      </section>

      {/* App Information */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">About</h2>
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Info className="h-5 w-5 text-muted-foreground" />
            <div>
              <p>Modern Quotes App</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Discover and collect inspiring quotes from great minds throughout history.
            </p>
            <div className="flex justify-center space-x-4 pt-2">
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* Statistics */}
      <section className="px-6 space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-lg">Usage Statistics</h2>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Search History</p>
              <p className="text-xl">{state.searchHistory.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Favorite Categories</p>
              <p className="text-xl">
                {new Set(state.favorites.map(q => q.category)).size}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Favorite Authors</p>
              <p className="text-xl">
                {new Set(state.favorites.map(q => q.author)).size}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Session Streak</p>
              <p className="text-xl">{state.userStats.streakDays}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}