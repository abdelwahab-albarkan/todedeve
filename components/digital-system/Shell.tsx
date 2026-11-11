'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  ExternalLink,
  FolderKanban,
  Home,
  LayoutGrid,
  LineChart,
  Menu,
  RotateCcw,
  Settings,
  ShoppingCart,
  Ticket,
  Users,
  X,
  Package,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/digital-system/store';
import { timeAgo } from '@/lib/digital-system/selectors';
import { Button } from './ui';

export const BASE = '/demo/digital-system';

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: BASE, label: 'Dashboard', icon: Home },
  { href: `${BASE}/products`, label: 'Products', icon: Package },
  { href: `${BASE}/categories`, label: 'Categories', icon: LayoutGrid },
  { href: `${BASE}/orders`, label: 'Orders', icon: ShoppingCart },
  { href: `${BASE}/customers`, label: 'Customers', icon: Users },
  { href: `${BASE}/coupons`, label: 'Coupons', icon: Ticket },
  { href: `${BASE}/analytics`, label: 'Analytics', icon: LineChart },
  { href: `${BASE}/settings`, label: 'Settings', icon: Settings },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-10 w-10 shrink-0 -skew-x-6 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-[15px] font-black text-[#1a0a00] shadow-[0_6px_20px_-6px_rgba(249,115,22,0.9)]">
        <span className="skew-x-6">&lt;/&gt;</span>
      </span>
      <span className="text-[1.6rem] font-black italic leading-none tracking-tight">
        <span className="text-white">TODE</span>
        <span className="text-orange-500">DEV</span>
      </span>
    </span>
  );
}

function isActive(pathname: string, href: string) {
  return href === BASE ? pathname === BASE : pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? '';
  return (
    <div className="relative flex h-full flex-col overflow-hidden border-r border-white/[0.06] bg-[#0B0B10]">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-600/25 blur-[90px]" aria-hidden="true" />
      <div className="relative px-6 pb-6 pt-6">
        <Link href={BASE} onClick={onNavigate} aria-label="TODEDEV dashboard home">
          <Logo />
        </Link>
      </div>
      <nav className="relative flex-1 space-y-1.5 overflow-y-auto px-4" aria-label="Dashboard navigation">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all',
                active
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600/80 text-white shadow-[0_8px_26px_-10px_rgba(249,115,22,0.9)]'
                  : 'text-neutral-300 hover:bg-white/[0.05] hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="relative p-5">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 rounded-xl border border-orange-500/80 px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-orange-500/10"
        >
          <ExternalLink className="h-5 w-5 text-orange-400" />
          View Store
        </Link>
      </div>
    </div>
  );
}

/** Header search across products, orders and customers. */
function GlobalSearch() {
  const { db } = useStore();
  const router = useRouter();
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const term = q.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (term.length < 2) return [];
    const customers = new Map(db.customers.map((c) => [c.id, c]));
    return [
      ...db.products.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 4).map((p) => ({ key: p.id, label: p.name, kind: 'Product', href: `${BASE}/products/edit?id=${p.id}` })),
      ...db.orders
        .filter((o) => o.id.toLowerCase().includes(term) || customers.get(o.customerId)?.email.toLowerCase().includes(term))
        .slice(0, 4)
        .map((o) => ({ key: o.id, label: `#${o.id} · ${customers.get(o.customerId)?.email ?? ''}`, kind: 'Order', href: `${BASE}/orders?id=${o.id}` })),
      ...db.customers
        .filter((c) => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
        .slice(0, 4)
        .map((c) => ({ key: c.id, label: `${c.name} · ${c.email}`, kind: 'Customer', href: `${BASE}/customers?id=${c.id}` })),
    ];
  }, [db, term]);

  return (
    <div className="relative w-full max-w-xl">
      <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search products, orders, customers..."
        aria-label="Search products, orders, customers"
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-sm text-white placeholder:text-neutral-400 outline-none transition focus:border-orange-500/60"
      />
      {open && term.length >= 2 && (
        <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#16161F] shadow-2xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-400">No results for “{q}”.</p>
          ) : (
            results.map((r) => (
              <button
                key={`${r.kind}-${r.key}`}
                type="button"
                onMouseDown={() => {
                  router.push(r.href);
                  setQ('');
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-neutral-200 hover:bg-white/[0.05]"
              >
                <span className="truncate">{r.label}</span>
                <span className="shrink-0 rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-neutral-400">{r.kind}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function useClickOutside(ref: React.RefObject<HTMLElement>, onOutside: () => void) {
  React.useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && onOutside();
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, onOutside]);
}

function Notifications() {
  const { db } = useStore();
  const [open, setOpen] = React.useState(false);
  const [seen, setSeen] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  const latest = db.activity.slice(0, 8);
  const unread = seen ? db.activity.filter((a) => a.at > seen).length : latest.length;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setSeen(new Date().toISOString());
        }}
        aria-label={`Notifications${unread ? ` (${unread} new)` : ''}`}
        className="relative grid h-11 w-11 place-items-center rounded-xl text-neutral-200 hover:bg-white/[0.06]"
      >
        <Bell className="h-6 w-6" />
        {unread > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-[#0B0B10]" />}
      </button>
      {open && (
        <div className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#16161F] shadow-2xl">
          <p className="border-b border-white/[0.07] px-4 py-3 text-sm font-bold text-white">Recent activity</p>
          <ul className="max-h-80 overflow-y-auto">
            {latest.map((a) => (
              <li key={a.id} className="border-b border-white/[0.04] px-4 py-3 text-sm last:border-0">
                <p className="text-neutral-200">{a.text}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{timeAgo(a.at)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AdminMenu() {
  const { resetDemo, db } = useStore();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 hover:bg-white/[0.05]" aria-expanded={open} aria-haspopup="menu">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-base font-black text-[#2a1200]">A</span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-bold text-white">Admin</span>
          <span className="block text-xs text-neutral-400">{db.settings.storeName}</span>
        </span>
        <ChevronDown className="hidden h-5 w-5 text-neutral-300 sm:block" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#16161F] p-1.5 shadow-2xl">
          <Link role="menuitem" href={`${BASE}/settings`} onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-neutral-200 hover:bg-white/[0.06]">
            <Settings className="h-4 w-4" /> Store settings
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              resetDemo();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-neutral-200 hover:bg-white/[0.06]"
          >
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </button>
          <Link role="menuitem" href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-neutral-200 hover:bg-white/[0.06]">
            <ArrowLeft className="h-4 w-4" /> Back to TODEDEV
          </Link>
        </div>
      )}
    </div>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const Icon = t.tone === 'error' ? AlertTriangle : t.tone === 'info' ? Info : CheckCircle2;
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur',
              t.tone === 'error' ? 'border-red-500/40 bg-[#2a1013]/95 text-red-200' : t.tone === 'info' ? 'border-sky-400/30 bg-[#0f1c2a]/95 text-sky-100' : 'border-emerald-500/30 bg-[#0f2318]/95 text-emerald-100'
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{t.text}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dismissToast(t.id)} className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DemoNotice() {
  const { resetDemo } = useStore();
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    try {
      setHidden(window.sessionStorage.getItem('tdds-notice') === '1');
    } catch {
      /* storage blocked */
    }
  }, []);
  if (hidden) return null;
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-violet-400/25 bg-violet-500/[0.08] px-4 py-3 text-sm text-violet-100 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-start gap-2.5">
        <FolderKanban className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
        <span>
          <strong className="font-semibold text-white">Live demo.</strong> All data is sample data saved only in your browser – nothing here touches real customers or payments.
        </span>
      </span>
      <span className="flex shrink-0 gap-2">
        <Button size="sm" variant="purple" icon={RotateCcw} onClick={resetDemo}>Reset data</Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setHidden(true);
            try {
              window.sessionStorage.setItem('tdds-notice', '1');
            } catch {
              /* ignore */
            }
          }}
        >
          Hide
        </Button>
      </span>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { ready } = useStore();
  const [drawer, setDrawer] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => setDrawer(false), [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  return (
    <div className="min-h-screen bg-[#09090D] font-sans text-neutral-100 antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.10),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.06),transparent_60%)]" aria-hidden="true" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-[60] lg:hidden', drawer ? 'visible' : 'invisible')} aria-hidden={!drawer}>
        <div className={cn('absolute inset-0 bg-black/70 transition-opacity', drawer ? 'opacity-100' : 'opacity-0')} onClick={() => setDrawer(false)} />
        <div className={cn('absolute inset-y-0 left-0 w-[280px] max-w-[85vw] transition-transform duration-200', drawer ? 'translate-x-0' : '-translate-x-full')}>
          <Sidebar onNavigate={() => setDrawer(false)} />
          <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-6 grid h-9 w-9 place-items-center rounded-lg text-neutral-300 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-white/[0.06] bg-[#09090D]/85 px-4 backdrop-blur-xl sm:gap-5 sm:px-6">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-neutral-200 hover:bg-white/[0.06] lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <span className="hidden h-11 w-11 shrink-0 place-items-center text-neutral-200 lg:grid" aria-hidden="true">
            <Menu className="h-6 w-6" />
          </span>
          <div className="hidden min-w-0 flex-1 sm:block">
            <GlobalSearch />
          </div>
          <Link href={BASE} className="min-w-0 flex-1 sm:hidden" aria-label="Dashboard">
            <Logo className="scale-[0.8] origin-left" />
          </Link>
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <Notifications />
            <AdminMenu />
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:py-8">
          <DemoNotice />
          {ready ? children : <div className="h-[60vh] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" aria-label="Loading demo" />}
        </main>
      </div>
      <Toasts />
    </div>
  );
}
