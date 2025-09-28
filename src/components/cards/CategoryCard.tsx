import React from 'react';
import { BookOpen } from 'lucide-react';
import { Category } from '../../types';
import { Card } from '../ui/card';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 group"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-200`}>
            {category.icon}
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-1" />
              {category.quoteCount}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="group-hover:text-primary transition-colors duration-200">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>
    </Card>
  );
}