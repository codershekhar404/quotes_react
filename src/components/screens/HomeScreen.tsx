import React, { useEffect, useState } from 'react';
import { Shuffle, Heart, TrendingUp, Clock } from 'lucide-react';
import { QuoteCard } from '../cards/QuoteCard';
import { AuthorCard } from '../cards/AuthorCard';
import { CategoryCard } from '../cards/CategoryCard';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAppContext } from '../../contexts/AppContext';
import { 
  getQuoteOfTheDay, 
  getRandomQuote, 
  getTrendingQuotes, 
  mockAuthors, 
  mockCategories 
} from '../../data/mockData';

export function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const [greeting, setGreeting] = useState('');
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(getQuoteOfTheDay());

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleRandomQuote = () => {
    const randomQuote = getRandomQuote();
    setQuoteOfTheDay(randomQuote);
    dispatch({ type: 'INCREMENT_QUOTES_READ' });
  };

  const handleAuthorClick = (authorId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'author', authorId } });
  };

  const handleCategoryClick = (categoryId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'category', categoryId } });
  };

  const featuredAuthors = mockAuthors.slice(0, 4);
  const popularCategories = mockCategories.slice(0, 6);
  const trendingQuotes = getTrendingQuotes().slice(0, 3);

  return (
    <div className="pb-20 space-y-8">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="space-y-2">
          <h1 className="text-2xl">{greeting}!</h1>
          <p className="text-muted-foreground">
            Ready to discover some inspiration?
          </p>
        </div>
      </div>

      {/* Quote of the Day */}
      <section className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Quote of the Day</span>
          </h2>
          <Button variant="ghost" size="sm" onClick={handleRandomQuote}>
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
        <QuoteCard 
          quote={quoteOfTheDay} 
          variant="hero"
          onClick={() => dispatch({ type: 'INCREMENT_QUOTES_READ' })}
        />
      </section>

      {/* Quick Actions */}
      <section className="px-6 space-y-4">
        <h2>Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800"
            onClick={handleRandomQuote}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                <Shuffle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm">Random Quote</h3>
                <p className="text-xs text-muted-foreground">Get inspired</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800"
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: { screen: 'favorites' } })}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm">My Favorites</h3>
                <p className="text-xs text-muted-foreground">{state.favorites.length} saved</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="px-6 space-y-4">
        <h2>Popular Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {popularCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      </section>

      {/* Featured Authors */}
      <section className="space-y-4">
        <div className="px-6">
          <h2>Featured Authors</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 px-6">
            {featuredAuthors.map((author) => (
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

      {/* Trending Quotes */}
      <section className="px-6 space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <h2>Trending Quotes</h2>
        </div>
        <div className="space-y-4">
          {trendingQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              variant="compact"
              onClick={() => dispatch({ type: 'INCREMENT_QUOTES_READ' })}
            />
          ))}
        </div>
      </section>

      {/* Daily Statistics */}
      <section className="px-6 space-y-4">
        <h2>Your Progress Today</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-primary">{state.userStats.quotesRead}</p>
              <p className="text-xs text-muted-foreground">Quotes Read</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-green-500">{state.userStats.totalFavorites}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-orange-500">{state.userStats.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}