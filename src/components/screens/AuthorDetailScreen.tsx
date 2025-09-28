import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  BookOpen, 
  TrendingUp,
  Heart
} from 'lucide-react';
import { QuoteCard } from '../cards/QuoteCard';
import { AuthorCard } from '../cards/AuthorCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { getAuthorById, getQuotesByAuthor, mockAuthors } from '../../data/mockData';

export function AuthorDetailScreen() {
  const { state, dispatch } = useAppContext();
  
  const author = useMemo(() => {
    if (!state.selectedAuthorId) return null;
    return getAuthorById(state.selectedAuthorId);
  }, [state.selectedAuthorId]);

  const authorQuotes = useMemo(() => {
    if (!author) return [];
    return getQuotesByAuthor(author.name);
  }, [author]);

  const relatedAuthors = useMemo(() => {
    if (!author) return [];
    // Get authors with similar professions or time periods
    return mockAuthors
      .filter(a => a.id !== author.id)
      .filter(a => 
        a.profession?.some(p => author.profession?.includes(p)) ||
        (a.nationality === author.nationality)
      )
      .slice(0, 3);
  }, [author]);

  const authorStats = useMemo(() => {
    const quotes = authorQuotes;
    const totalLikes = quotes.reduce((sum, quote) => sum + (quote.likes || 0), 0);
    const avgLikes = quotes.length > 0 ? Math.round(totalLikes / quotes.length) : 0;
    const favoriteCount = quotes.filter(quote => 
      state.favorites.some(fav => fav.id === quote.id)
    ).length;
    
    return {
      totalQuotes: quotes.length,
      totalLikes,
      avgLikes,
      favoriteCount
    };
  }, [authorQuotes, state.favorites]);

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'discover' } });
  };

  const handleRelatedAuthorClick = (authorId: string) => {
    dispatch({ type: 'SET_SCREEN', payload: { screen: 'author', authorId } });
  };

  if (!author) {
    return (
      <div className="pb-20">
        <div className="px-6 pt-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl">Author Not Found</h1>
          </div>
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3>Author not found</h3>
                <p className="text-muted-foreground">
                  The author you're looking for doesn't exist or has been removed.
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

  const getLifeSpan = () => {
    if (author.birthYear && author.deathYear) {
      const birthYear = author.birthYear < 0 ? `${Math.abs(author.birthYear)} BC` : author.birthYear.toString();
      const deathYear = author.deathYear < 0 ? `${Math.abs(author.deathYear)} BC` : author.deathYear.toString();
      return `${birthYear} - ${deathYear}`;
    } else if (author.birthYear) {
      const birthYear = author.birthYear < 0 ? `${Math.abs(author.birthYear)} BC` : author.birthYear.toString();
      return `Born ${birthYear}`;
    }
    return null;
  };

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="px-6 pt-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl">{author.name}</h1>
        </div>
      </div>

      {/* Author Profile */}
      <section className="px-6 space-y-4">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 opacity-70" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl">{author.name}</h2>
                  <div className="space-y-2 mt-2">
                    {getLifeSpan() && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {getLifeSpan()}
                      </div>
                    )}
                    {author.nationality && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {author.nationality}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {authorStats.totalQuotes} quotes available
                    </div>
                  </div>
                </div>
                
                {author.profession && author.profession.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {author.profession.map((prof, index) => (
                      <Badge key={index} variant="secondary">
                        {prof}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {author.bio && (
              <div className="pt-4 border-t">
                <p className="text-muted-foreground leading-relaxed">
                  {author.bio}
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Author Statistics */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-primary">{authorStats.totalQuotes}</p>
              <p className="text-xs text-muted-foreground">Total Quotes</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-green-500">{authorStats.favoriteCount}</p>
              <p className="text-xs text-muted-foreground">Your Favorites</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-orange-500">{authorStats.totalLikes}</p>
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl text-purple-500">{authorStats.avgLikes}</p>
              <p className="text-xs text-muted-foreground">Avg Likes</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Popular Quotes */}
      {authorQuotes.length > 0 && (
        <section className="px-6 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-lg">Popular Quotes</h2>
          </div>
          <div className="space-y-4">
            {authorQuotes
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
      {authorQuotes.length > 3 && (
        <section className="px-6 space-y-4">
          <h2 className="text-lg">All Quotes by {author.name}</h2>
          <div className="space-y-4">
            {authorQuotes
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
      {authorQuotes.length === 0 && (
        <section className="px-6">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3>No quotes available</h3>
                <p className="text-muted-foreground">
                  We don't have any quotes from {author.name} in our collection yet.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => dispatch({ type: 'SET_SCREEN', payload: { screen: 'discover' } })}
              >
                Explore Other Authors
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Related Authors */}
      {relatedAuthors.length > 0 && (
        <section className="space-y-4">
          <div className="px-6">
            <h2 className="text-lg">Related Authors</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 px-6">
              {relatedAuthors.map((relatedAuthor) => (
                <AuthorCard
                  key={relatedAuthor.id}
                  author={relatedAuthor}
                  variant="compact"
                  onClick={() => handleRelatedAuthorClick(relatedAuthor.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}