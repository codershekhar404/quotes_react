import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, X, Clock, Shuffle } from 'lucide-react';
import { QuoteCard } from '../cards/QuoteCard';
import { AuthorCard } from '../cards/AuthorCard';
import { CategoryCard } from '../cards/CategoryCard';
import { SearchInput } from '../ui/search-input';
import { FloatingActionButton } from '../ui/floating-action-button';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { useAppContext } from '../../contexts/AppContext';
import { 
  searchQuotes, 
  getTrendingQuotes, 
  mockCategories, 
  mockAuthors,
  mockQuotes 
} from '../../data/mockData';

export function DiscoverScreen() {
  const { state, dispatch } = useAppContext();
  const [searchResults, setSearchResults] = useState(mockQuotes);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleRandomQuote = () => {
    const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
    // Navigate to a random quote view or show in modal
    dispatch({ type: 'INCREMENT_QUOTES_READ' });
  };

  useEffect(() => {
    if (state.searchQuery.trim()) {
      const results = searchQuotes(state.searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults(mockQuotes);
    }
  }, [state.searchQuery]);

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    if (query.trim()) {
      dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query });
    }
  };

  const handleFilterToggle = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    
    let filtered = searchResults;
    if (newFilters.length > 0) {
      filtered = searchResults.filter(quote => 
        newFilters.includes(quote.category)
      );
    }
    setSearchResults(filtered);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchResults(state.searchQuery ? searchQuotes(state.searchQuery) : mockQuotes);
  };

  const handleAuthorClick = (authorId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'author', authorId } });
  };

  const handleCategoryClick = (categoryId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'category', categoryId } });
  };

  const trendingQuotes = getTrendingQuotes().slice(0, 4);
  const recentSearches = state.searchHistory.slice(0, 5);

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl mb-4">Discover</h1>
        
        {/* Search Bar */}
        <SearchInput
          value={state.searchQuery}
          onChange={handleSearch}
          onSubmit={handleSearch}
          placeholder="Search quotes, authors, topics..."
          suggestions={mockCategories.map(c => c.name)}
          recentSearches={recentSearches}
        />

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
            {activeFilters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {searchResults.length} quotes found
          </p>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="default"
                className="cursor-pointer"
                onClick={() => handleFilterToggle(filter)}
              >
                {filter}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="px-6">
          <Card className="p-4">
            <h3 className="mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {mockCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={activeFilters.includes(category.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleFilterToggle(category.name)}
                >
                  {category.icon} {category.name}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Searches */}
      {!state.searchQuery && recentSearches.length > 0 && (
        <section className="px-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <h2 className="text-lg">Recent Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleSearch(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Browse Categories */}
      {!state.searchQuery && (
        <section className="px-6 space-y-4">
          <h2 className="text-lg">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            {mockCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Authors */}
      {!state.searchQuery && (
        <section className="space-y-4">
          <div className="px-6">
            <h2 className="text-lg">Featured Authors</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 px-6">
              {mockAuthors.slice(0, 6).map((author) => (
                <AuthorCard
                  key={author.id}
                  author={author}
                  variant="compact"
                  onClick={() => handleAuthorClick(author.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Quotes */}
      {!state.searchQuery && (
        <section className="px-6 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <h2 className="text-lg">Trending Quotes</h2>
          </div>
          <div className="space-y-4">
            {trendingQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onClick={() => dispatch({ type: 'INCREMENT_QUOTES_READ' })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Search Results */}
      {state.searchQuery && (
        <section className="px-6 space-y-4">
          <h2 className="text-lg">Search Results</h2>
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
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
                    Try different keywords or browse categories below
                  </p>
                </div>
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
            </Card>
          )}
        </section>
      )}

      {/* Random Quote FAB */}
      <FloatingActionButton
        onClick={handleRandomQuote}
        icon={<Shuffle className="h-5 w-5" />}
        label="Random Quote"
        position="bottom-right"
      />
    </div>
  );
}