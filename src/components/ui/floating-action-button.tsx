import React from 'react';
import { Button } from './button';
import { cn } from './utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  className,
  size = 'md',
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16'
  };

  const positionClasses = {
    'bottom-right': 'bottom-20 right-6',
    'bottom-left': 'bottom-20 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed z-40 rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
        sizeClasses[size],
        positionClasses[position],
        className
      )}
      aria-label={label}
    >
      {icon}
    </Button>
  );
}