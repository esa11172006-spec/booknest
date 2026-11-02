import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  type: 'rating' | 'available' | 'unavailable';
}

// ВАЖНО: должно быть именно так (export function), без слова default!
export function Badge({ children, type }: BadgeProps) {
  return <span className={`badge badge--${type}`}>{children}</span>;
}