import React from 'react';
import { GUMROAD_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BuyButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

/**
 * Gumroad checkout button. The `gumroad-button` class lets gumroad.js
 * open the overlay checkout instead of navigating away.
 */
export function BuyButton({
  children = 'Buy Now',
  className,
  variant = 'primary',
  size = 'md',
  href = GUMROAD_URL,
}: BuyButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-secondary',
  };

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  return (
    <a href={href} className={cn('gumroad-button btn group', variants[variant], sizes[size], className)}>
      {children}
    </a>
  );
}
