import React from 'react';
import { Heart, Share2, Copy, MoreHorizontal } from 'lucide-react';
import { Quote } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface QuoteCardProps {
  quote: Quote;
  variant?: 'default' | 'hero' | 'compact' | 'favorite';
  showActions?: boolean;
  onClick?: () => void;
}

export function QuoteCard({ quote, variant = 'default', showActions = true, onClick }: QuoteCardProps) {
  const { state, dispatch } = useAppContext();
  const isFavorite = state.favorites.some(fav => fav.id === quote.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: quote.id });
      toast.success('Removed from favorites');
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: quote });
      toast.success('Added to favorites');
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
      toast.success('Quote copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy quote');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'Quote',
        text: `"${quote.text}" - ${quote.author}`,
      });
    } else {
      handleCopy(e);
    }
  };

  const getCardClasses = () => {
    switch (variant) {
      case 'hero':
        return 'p-8 bg-gradient-to-br from-primary/5 to-accent/10 border-2 hover:shadow-lg transition-all duration-300';
      case 'compact':
        return 'p-4 hover:shadow-md transition-all duration-200';
      case 'favorite':
        return 'p-6 border-l-4 border-l-primary hover:shadow-md transition-all duration-200';
      default:
        return 'p-6 hover:shadow-md transition-all duration-200';
    }
  };

  const getQuoteClasses = () => {
    switch (variant) {
      case 'hero':
        return 'text-lg md:text-xl leading-relaxed mb-6';
      case 'compact':
        return 'text-sm leading-relaxed mb-3';
      default:
        return 'text-base leading-relaxed mb-4';
    }
  };

  return (
    <Card 
      className={`cursor-pointer ${getCardClasses()}`}
      onClick={onClick}
    >
      <div className="space-y-4">
        <blockquote className={getQuoteClasses()}>
          "{quote.text}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <cite className="not-italic opacity-90">— {quote.author}</cite>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-accent rounded-full text-xs">
                {quote.category}
              </span>
              {quote.likes && (
                <span className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{quote.likes}</span>
                </span>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={isFavorite ? 'text-red-500 hover:text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {variant === 'hero' && quote.tags && quote.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {quote.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary/50 rounded-full text-xs text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}