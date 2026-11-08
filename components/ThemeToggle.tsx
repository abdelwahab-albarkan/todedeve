'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="btn btn-ghost h-10 w-10 p-0"
        aria-label="Toggle theme"
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="btn btn-ghost group h-10 w-10 p-0"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-500 group-hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 text-zinc-700 transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
}

