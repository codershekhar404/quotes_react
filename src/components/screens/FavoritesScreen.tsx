import React, { useState, useMemo } from 'react';
import { Heart, Search, Trash2, Download, Upload, Filter } from 'lucide-react';
import { QuoteCard } from '../cards/QuoteCard';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { mockCategories } from '../../data/mockData';

export function FavoritesScreen() {
  const { state, dispatch } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFavorites = useMemo(() => {
    let filtered = state.favorites;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(quote =>
        quote.text.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query) ||
        quote.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(quote => quote.category === selectedCategory);
    }

    return filtered;
  }, [state.favorites, searchQuery, selectedCategory]);

  const favoriteCategories = useMemo(() => {
    const categories = state.favorites.reduce((acc, quote) => {
      acc[quote.category] = (acc[quote.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .map(([category, count]) => ({ category, count }));
  }, [state.favorites]);

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites? This action cannot be undone.')) {
      dispatch({ type: 'CLEAR_FAVORITES' });
    }
  };

  const handleExportFavorites = () => {
    const dataStr = JSON.stringify(state.favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quotes-favorites-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportFavorites = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const quotes = JSON.parse(e.target?.result as string);
            if (Array.isArray(quotes)) {
              quotes.forEach(quote => {
                if (!state.favorites.some(fav => fav.id === quote.id)) {
                  dispatch({ type: 'ADD_FAVORITE', payload: quote });
                }
              });
            }
          } catch (error) {
            alert('Failed to import favorites. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (state.favorites.length === 0) {
    return (
      <div className="pb-20">
        {/* Header */}
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-2xl mb-2">Favorites</h1>
          <p className="text-muted-foreground">Your saved quotes</p>
        </div>

        {/* Empty State */}
        <div className="px-6 mt-12">
          <Card className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3>No favorites yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start exploring quotes and tap the heart icon to save your favorites. 
                  They'll appear here for easy access.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => dispatch({ type: 'SET_SCREEN', payload: { screen: 'discover' } })}
                  className="w-full max-w-xs"
                >
                  Discover Quotes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => dispatch({ type: 'SET_SCREEN', payload: { screen: 'home' } })}
                  className="w-full max-w-xs"
                >
                  Go to Home
                </Button>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Have favorites from another device?
                </p>
                <Button variant="ghost" size="sm" onClick={handleImportFavorites}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Favorites
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl">Favorites</h1>
            <p className="text-muted-foreground">{state.favorites.length} saved quotes</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportFavorites}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleImportFavorites}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearFavorites}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All ({state.favorites.length})
            </Badge>
            {favoriteCategories.map(({ category, count }) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({count})
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-primary">{state.favorites.length}</p>
              <p className="text-xs text-muted-foreground">Total Favorites</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-green-500">{favoriteCategories.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-orange-500">
                {new Set(state.favorites.map(q => q.author)).size}
              </p>
              <p className="text-xs text-muted-foreground">Authors</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Favorites List */}
      <section className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">
            {selectedCategory ? `${selectedCategory} Quotes` : 'All Favorites'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredFavorites.length} quotes
          </p>
        </div>

        {filteredFavorites.length > 0 ? (
          <div className="space-y-4">
            {filteredFavorites.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                variant="favorite"
                onClick={() => dispatch({ type: 'INCREMENT_QUOTES_READ' })}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3>No quotes found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `No favorites match "${searchQuery}"`
                    : `No favorites in ${selectedCategory}`
                  }
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}