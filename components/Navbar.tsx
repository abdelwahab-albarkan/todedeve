'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, PlayCircle } from 'lucide-react';
import { BRAND_NAME, PRODUCT_NAME, BUY_BUTTON_TEXT, NAV_LINKS, GUMROAD_URL } from '@/lib/constants';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-[0_6px_20px_-6px_rgba(249,115,22,0.7)] ring-1 ring-inset ring-white/25',
        className
      )}
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.55" />
        <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.55" />
        <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string>('');

  // Shrink + solidify the bar after scrolling a bit
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view
  React.useEffect(() => {
    const ids = NAV_LINKS.filter((l) => l.href.startsWith('#')).map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // The dashboard demo has its own sidebar + header
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <div
        className={cn(
          'mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 transition-all duration-300 sm:h-[3.75rem] sm:px-4',
          scrolled || open
            ? 'border-zinc-200/80 bg-white/80 shadow-[0_10px_40px_-15px_rgba(15,22,38,0.25)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-950/75 dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]'
            : 'border-transparent bg-transparent'
        )}
      >
        {/* Brand */}
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-xl"
          aria-label={`${BRAND_NAME} - ${PRODUCT_NAME}`}
          onClick={() => setOpen(false)}
        >
          <BrandMark className="transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-105" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {BRAND_NAME}
            </span>
            <span className="mt-1 hidden truncate font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 sm:block dark:text-zinc-400">
              UI Kit Pro
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav
          className="hidden items-center gap-0.5 rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-1 lg:flex dark:border-white/[0.06] dark:bg-white/[0.03]"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-white/[0.08] dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <a href={GUMROAD_URL} className="gumroad-button btn btn-primary btn-sm hidden sm:inline-flex">
            <span>{BUY_BUTTON_TEXT}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn btn-ghost h-10 w-10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-3 top-[4.75rem] z-50 origin-top rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl transition-all duration-200 sm:inset-x-4 lg:hidden dark:border-white/[0.08] dark:bg-zinc-950/95',
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        )}
      >
        <nav className="grid gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                active === link.href
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.05]'
              )}
            >
              {link.label}
              <ArrowRight className="h-4 w-4 opacity-40" />
            </a>
          ))}
        </nav>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-200 pt-3 dark:border-white/[0.08]">
          <Link href="/dashboard" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="btn btn-secondary btn-md">
            <PlayCircle className="h-4 w-4" />
            Live demo
          </Link>
          <a
            href={GUMROAD_URL}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="gumroad-button btn btn-primary btn-md"
          >
            {BUY_BUTTON_TEXT}
          </a>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 -z-10 bg-zinc-950/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </header>
  );
}
