import React from 'react';
import { PRICING_ANCHOR, CHECKOUT_LINK_PROPS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BuyButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

/**
 * Primary purchase CTA. Scrolls to the pricing card by default, where the
 * buyer picks a package and checks out on Gumroad.
 */
export function BuyButton({
  children = 'Buy Now',
  className,
  variant = 'primary',
  size = 'md',
  href = PRICING_ANCHOR,
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
    <a href={href} {...(href.startsWith('http') ? CHECKOUT_LINK_PROPS : {})} className={cn('btn group', variants[variant], sizes[size], className)}>
      {children}
    </a>
  );
}
