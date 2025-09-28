import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  recentSearches?: string[];
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  suggestions = [],
  recentSearches = [],
  className = ""
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(value, 300);

  const allSuggestions = [
    ...recentSearches.slice(0, 3).map(search => ({ text: search, type: 'recent' as const })),
    ...suggestions.slice(0, 5).map(suggestion => ({ text: suggestion, type: 'suggestion' as const }))
  ].filter(item => 
    item.text.toLowerCase().includes(value.toLowerCase()) && 
    item.text.toLowerCase() !== value.toLowerCase()
  );

  useEffect(() => {
    if (debouncedValue && onSubmit) {
      onSubmit(debouncedValue);
    }
  }, [debouncedValue, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(allSuggestions[highlightedIndex].text);
        } else if (value.trim()) {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay closing to allow clicks on suggestions
            setTimeout(() => setIsOpen(false), 200);
          }}
          placeholder={placeholder}
          className="pl-10 pr-12"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && allSuggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 p-2 z-50 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {allSuggestions.map((item, index) => (
              <button
                key={`${item.type}-${item.text}`}
                onClick={() => handleSuggestionClick(item.text)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 flex items-center space-x-2 ${
                  index === highlightedIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                {item.type === 'recent' ? (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="flex-1">{item.text}</span>
                {item.type === 'recent' && (
                  <Badge variant="outline" className="text-xs">
                    Recent
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}