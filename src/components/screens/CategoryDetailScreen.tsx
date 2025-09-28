import React, { useMemo } from 'react';
import { ArrowLeft, BookOpen, TrendingUp, Filter } from 'lucide-react';
import { QuoteCard } from '../cards/QuoteCard';
import { CategoryCard } from '../cards/CategoryCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { getCategoryById, getQuotesByCategory, mockCategories, mockAuthors } from '../../data/mockData';

export function CategoryDetailScreen() {
  const { state, dispatch } = useAppContext();
  
  const category = useMemo(() => {
    if (!state.selectedCategoryId) return null;
    return getCategoryById(state.selectedCategoryId);
  }, [state.selectedCategoryId]);

  const categoryQuotes = useMemo(() => {
    if (!category) return [];
    return getQuotesByCategory(category.name);
  }, [category]);

  const relatedCategories = useMemo(() => {
    if (!category) return [];
    // Get categories with similar themes (this is a simple example)
    return mockCategories
      .filter(c => c.id !== category.id)
      .slice(0, 3);
  }, [category]);

  const categoryStats = useMemo(() => {
    const quotes = categoryQuotes;
    const totalLikes = quotes.reduce((sum, quote) => sum + (quote.likes || 0), 0);
    const avgLikes = quotes.length > 0 ? Math.round(totalLikes / quotes.length) : 0;
    const favoriteCount = quotes.filter(quote => 
      state.favorites.some(fav => fav.id === quote.id)
    ).length;
    const uniqueAuthors = new Set(quotes.map(quote => quote.author)).size;
    
    return {
      totalQuotes: quotes.length,
      totalLikes,
      avgLikes,
      favoriteCount,
      uniqueAuthors
    };
  }, [categoryQuotes, state.favorites]);

  const topAuthorsInCategory = useMemo(() => {
    const authorCounts = categoryQuotes.reduce((acc, quote) => {
      acc[quote.author] = (acc[quote.author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(authorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([author, count]) => ({ author, count }));
  }, [categoryQuotes]);

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'discover' } });
  };

  const handleRelatedCategoryClick = (categoryId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'category', categoryId } });
  };

  const handleAuthorClick = (authorName: string) => {
    const author = mockAuthors.find(a => a.name === authorName);
    if (author) {
      dispatch({ type: 'SET_SCREEN', payload: { screen: 'author', authorId: author.id } });
    }
  };

  if (!category) {
    return (
      <div className="pb-20">
        <div className="px-6 pt-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl">Category Not Found</h1>
          </div>
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3>Category not found</h3>
                <p className="text-muted-foreground">
                  The category you're looking for doesn't exist or has been removed.
                </p>
              </div>
              <Button onClick={handleBack}>
                Back to Discover
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="px-6 pt-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl">{category.name}</h1>
        </div>
      </div>

      {/* Category Overview */}
      <section className="px-6 space-y-4">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl mb-2">{category.name}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground mt-3">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {categoryStats.totalQuotes} quotes in this category
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Category Statistics */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-primary">{categoryStats.totalQuotes}</p>
              <p className="text-xs text-muted-foreground">Total Quotes</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-green-500">{categoryStats.favoriteCount}</p>
              <p className="text-xs text-muted-foreground">Your Favorites</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-orange-500">{categoryStats.uniqueAuthors}</p>
              <p className="text-xs text-muted-foreground">Authors</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-purple-500">{categoryStats.avgLikes}</p>
              <p className="text-xs text-muted-foreground">Avg Likes</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Top Authors */}
      {topAuthorsInCategory.length > 0 && (
        <section className="px-6 space-y-4">
          <h2 className="text-lg">Top Authors in {category.name}</h2>
          <Card className="p-4">
            <div className="space-y-3">
              {topAuthorsInCategory.map(({ author, count }, index) => (
                <div
                  key={author}
                  className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors duration-200"
                  onClick={() => handleAuthorClick(author)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">{index + 1}</span>
                    </div>
                    <p>{author}</p>
                  </div>
                  <Badge variant="secondary">{count} quotes</Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Most Popular Quotes */}
      {categoryQuotes.length > 0 && (
        <section className="px-6 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-lg">Most Popular</h2>
          </div>
          <div className="space-y-4">
            {categoryQuotes
              .sort((a, b) => (b.likes || 0) - (a.likes || 0))
              .slice(0, 3)
              .map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onClick={() => dispatch({ type: 'INCREMENT_QUOTES_READ' })}
                />
              ))}
          </div>
        </section>
      )}

      {/* All Quotes */}
      {categoryQuotes.length > 3 && (
        <section className="px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">All {category.name} Quotes</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {categoryQuotes.length - 3} more
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {categoryQuotes
              .slice(3)
              .map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onClick={() => dispatch({ type: 'INCREMENT_QUOTES_READ' })}
                />
              ))}
          </div>
        </section>
      )}

      {/* Empty State for No Quotes */}
      {categoryQuotes.length === 0 && (
        <section className="px-6">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center text-white text-2xl mx-auto opacity-50`}>
                {category.icon}
              </div>
              <div className="space-y-2">
                <h3>No quotes available</h3>
                <p className="text-muted-foreground">
                  We don't have any quotes in the {category.name} category yet.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => dispatch({ type: 'SET_SCREEN', payload: { screen: 'discover' } })}
              >
                Explore Other Categories
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section className="space-y-4">
          <div className="px-6">
            <h2 className="text-lg">Related Categories</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 px-6">
              {relatedCategories.map((relatedCategory) => (
                <div key={relatedCategory.id} className="min-w-[200px]">
                  <CategoryCard
                    category={relatedCategory}
                    onClick={() => handleRelatedCategoryClick(relatedCategory.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}