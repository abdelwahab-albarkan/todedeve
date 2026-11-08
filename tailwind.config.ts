import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Navy-tinted neutrals so the whole site matches the TODEDEV dashboard palette
        zinc: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#2A3650',
          800: '#1A2338',
          900: '#0F1626',
          950: '#080C14',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        todedev: {
          bg: '#080C14',
          surface: '#0D1322',
          card: '#10172A',
          border: '#1E293B',
          subborder: '#151F32',
          orange: '#F97316',
          purple: '#A855F7',
          blue: '#38BDF8',
          green: '#22C55E',
          pink: '#EC4899',
          amber: '#F59E0B',
          red: '#EF4444',
        },
      },
      boxShadow: {
        'glow-orange': '0 0 25px -4px rgba(249, 115, 22, 0.35)',
        'glow-purple': '0 0 25px -4px rgba(168, 85, 247, 0.35)',
        'glow-blue': '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        'glow-green': '0 0 25px -4px rgba(34, 197, 94, 0.35)',
        'glow-pink': '0 0 25px -4px rgba(236, 72, 153, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '2xl': '1rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;

