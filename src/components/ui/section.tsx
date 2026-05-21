import { Container } from '@/components/ui/Container';
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  background?: 'primary' | 'accent' | 'page';
  className?: string;
}

export function Section({ children, background = 'primary', className = '' }: SectionProps) {
  const bgMap = {
    primary: 'bg-[var(--surface-primary)]',
    accent: 'bg-[var(--surface-accent)]',
    page: 'bg-[var(--surface-page)]'
  };

  return (
    <section className={`${bgMap[background]} section ${className}`}>
      <Container>
        {children}
      </Container>
    </section>
  );
}
