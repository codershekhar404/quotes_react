import React from 'react';
import { User, Calendar, MapPin, BookOpen } from 'lucide-react';
import { Author } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface AuthorCardProps {
  author: Author;
  variant?: 'default' | 'compact';
  onClick?: () => void;
}

export function AuthorCard({ author, variant = 'default', onClick }: AuthorCardProps) {
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

  if (variant === 'compact') {
    return (
      <Card 
        className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 min-w-[200px]"
        onClick={onClick}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 opacity-70" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate">{author.name}</h3>
            <p className="text-sm text-muted-foreground">{author.quoteCount} quotes</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 opacity-70" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-2">{author.name}</h3>
            <div className="space-y-2">
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
                {author.quoteCount} quotes
              </div>
            </div>
          </div>
        </div>
        
        {author.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {author.bio}
          </p>
        )}
        
        {author.profession && author.profession.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {author.profession.slice(0, 3).map((prof, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {prof}
              </Badge>
            ))}
            {author.profession.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{author.profession.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}