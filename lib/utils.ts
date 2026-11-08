import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Maps an original `/theme/*.png` screenshot to its optimized WebP versions
 * (generated at 800px and 1600px wide, ~95% smaller than the PNGs).
 * Falls back to the original path for anything else.
 */
export function optimizedImage(src: string) {
  const match = src.match(/^\/theme\/(.+)\.png$/i);
  if (!match) return { src, srcSet: undefined as string | undefined };
  const slug = match[1]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return {
    src: `/theme/${slug}-1600.webp`,
    srcSet: `/theme/${slug}-800.webp 800w, /theme/${slug}-1600.webp 1600w`,
  };
}
