import React from 'react';
import { cn } from '@/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'ultra' | 'none';
}

const Container = ({ 
  children, 
  className, 
  size = 'default',
  ...props 
}: ContainerProps) => {
  const maxWidths = {
    none: 'max-w-none',
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-6xl',
    ultra: 'max-w-[1440px]',
  };

  return (
    <div 
      className={cn(
        "mx-auto w-full px-6 md:px-10 xl:px-16",
        maxWidths[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
