'use client';

import * as React from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Crown,
  Layers,
  PauseCircle,
  Ban,
  X,
  BookOpen,
  Package,
  ShoppingBag,
  Sparkles,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { CoverTone, Product } from '@/lib/digital-system/types';

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.07] bg-[#13131B]/80 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_20px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ title, icon: Icon, action, className }: { title: React.ReactNode; icon?: LucideIcon; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-5 pt-5', className)}>
      <h2 className="flex min-w-0 items-center gap-2.5 text-base font-bold text-white sm:text-lg">
        {Icon && <Icon className="h-5 w-5 shrink-0 text-orange-400" />}
        <span className="truncate">{title}</span>
      </h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: { title: string; subtitle?: string; actions?: React.ReactNode; breadcrumb?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {breadcrumb}
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-400 sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons & inputs                                                    */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'purple' | 'outline-orange';

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.75)] hover:from-orange-400 hover:to-orange-500',
  secondary: 'border border-white/10 bg-white/[0.03] text-neutral-100 hover:border-white/20 hover:bg-white/[0.06]',
  ghost: 'text-neutral-300 hover:bg-white/[0.06] hover:text-white',
  danger: 'border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20',
  purple: 'border border-violet-400/40 bg-violet-500/15 text-violet-200 hover:bg-violet-500/25',
  'outline-orange': 'border border-orange-500/70 text-white hover:bg-orange-500/10',
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' | 'lg' | 'icon'; icon?: LucideIcon }
>(function Button({ variant = 'secondary', size = 'md', icon: Icon, className, children, type = 'button', ...props }, ref) {
  const sizes = { sm: 'h-8 px-3 text-xs gap-1.5', md: 'h-10 px-4 text-sm gap-2', lg: 'h-12 px-6 text-base gap-2.5', icon: 'h-9 w-9 justify-center' };
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 disabled:pointer-events-none disabled:opacity-50',
        buttonStyles[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />}
      {children}
    </button>
  );
});

const buttonBase =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70';
const linkSizes = { sm: 'h-8 px-3 text-xs gap-1.5', md: 'h-10 px-4 text-sm gap-2', lg: 'h-12 px-6 text-base gap-2.5' };

/** A link styled as a button (no <button> nested inside <a>). */
export function LinkButton({ href, variant = 'secondary', size = 'md', icon: Icon, className, children }: { href: string; variant?: ButtonVariant; size?: 'sm' | 'md' | 'lg'; icon?: LucideIcon; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn(buttonBase, buttonStyles[variant], linkSizes[size], className)}>
      {Icon && <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />}
      {children}
    </Link>
  );
}

export const inputClass =
  'h-11 w-full rounded-xl border border-white/10 bg-[#0E0E14] px-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...props} />;
});

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, 'h-auto min-h-[96px] py-3 leading-relaxed', className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select className={cn(inputClass, 'appearance-none pr-10 [&>option]:bg-[#13131B]')} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  );
}

export function Field({ label, required, hint, error, children, className }: { label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-sm font-semibold text-neutral-100">
        {label}
        {required && <span className="text-orange-500"> *</span>}
        {hint && <span className="font-normal text-neutral-500"> {hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-400">{error}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70',
        checked ? 'bg-orange-500 shadow-[0_0_16px_-2px_rgba(249,115,22,0.8)]' : 'bg-white/15'
      )}
    >
      <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-6' : 'left-1')} />
    </button>
  );
}

/** Large radio card used for license type / delivery method. */
export function OptionCard({ selected, onSelect, icon: Icon, title, subtitle }: { selected: boolean; onSelect: () => void; icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all',
        selected ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_28px_-10px_rgba(249,115,22,0.9)]' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
      )}
    >
      <Icon className={cn('mt-0.5 h-6 w-6 shrink-0', selected ? 'text-orange-400' : 'text-neutral-300')} />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-sm text-neutral-400">{subtitle}</span>
      </span>
      <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-orange-500' : 'border-neutral-500')}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Status pills                                                        */
/* ------------------------------------------------------------------ */

const pillTone = {
  green: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
  orange: 'border-orange-500/40 bg-orange-500/15 text-orange-400',
  red: 'border-red-500/35 bg-red-500/15 text-red-400',
  gray: 'border-white/10 bg-white/[0.06] text-neutral-300',
  purple: 'border-violet-400/40 bg-violet-500/15 text-violet-300',
  blue: 'border-sky-400/35 bg-sky-500/15 text-sky-300',
};

export function Pill({ tone, icon: Icon, children, className }: { tone: keyof typeof pillTone; icon?: LucideIcon; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-semibold', pillTone[tone], className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <Pill tone="green" icon={Check}>Completed</Pill>;
    case 'pending':
      return <Pill tone="orange" icon={Clock}>Pending</Pill>;
    case 'refunded':
      return <Pill tone="red" icon={X}>Refunded</Pill>;
    case 'published':
      return <Pill tone="green">Published</Pill>;
    case 'draft':
      return <Pill tone="gray">Draft</Pill>;
    case 'archived':
      return <Pill tone="purple">Archived</Pill>;
    case 'active':
      return <Pill tone="green" icon={Check}>Active</Pill>;
    case 'vip':
      return <Pill tone="orange" icon={Crown}>VIP</Pill>;
    case 'inactive':
      return <Pill tone="gray" icon={PauseCircle}>Inactive</Pill>;
    case 'blocked':
      return <Pill tone="red" icon={Ban}>Blocked</Pill>;
    case 'expired':
      return <Pill tone="red">Expired</Pill>;
    case 'scheduled':
      return <Pill tone="blue" icon={Clock}>Scheduled</Pill>;
    case 'disabled':
      return <Pill tone="gray">Disabled</Pill>;
    case 'used-up':
      return <Pill tone="purple">Limit reached</Pill>;
    default:
      return <Pill tone="gray">{status}</Pill>;
  }
}

/* ------------------------------------------------------------------ */
/* Stat card (the four KPI tiles at the top of each page)             */
/* ------------------------------------------------------------------ */

const statTone = {
  orange: 'from-orange-500 to-orange-600 shadow-[0_8px_30px_-8px_rgba(249,115,22,0.8)]',
  purple: 'from-violet-500 to-purple-700 shadow-[0_8px_30px_-8px_rgba(139,92,246,0.8)]',
  blue: 'from-blue-500 to-blue-700 shadow-[0_8px_30px_-8px_rgba(59,130,246,0.8)]',
  green: 'from-emerald-500 to-green-700 shadow-[0_8px_30px_-8px_rgba(34,197,94,0.7)]',
  red: 'from-rose-500 to-red-700 shadow-[0_8px_30px_-8px_rgba(244,63,94,0.7)]',
};

export function StatCard({ icon: Icon, tone, value, label, change }: { icon: LucideIcon; tone: keyof typeof statTone; value: string; label: string; change?: number }) {
  const up = (change ?? 0) >= 0;
  return (
    <Card className="flex items-center gap-4 p-4 sm:p-5">
      <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white sm:h-14 sm:w-14', statTone[tone])}>
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xl font-extrabold text-white sm:text-2xl">{value}</div>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="truncate text-sm text-neutral-400">{label}</span>
          {change !== undefined && Number.isFinite(change) && (
            <span className={cn('rounded-md px-1.5 py-0.5 text-xs font-bold', up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
              {up ? '↑' : '↓'} {up ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Product cover art (used when no cover image is uploaded)           */
/* ------------------------------------------------------------------ */

const coverGradient: Record<CoverTone, string> = {
  purple: 'from-[#2a0f57] via-[#4c1d95] to-[#120726]',
  orange: 'from-[#5a1e04] via-[#c2410c] to-[#1c0a02]',
  blue: 'from-[#0b1f4d] via-[#1d4ed8] to-[#060d22]',
  pink: 'from-[#4a0a2e] via-[#be185d] to-[#1a0410]',
  green: 'from-[#053524] via-[#047857] to-[#02140d]',
  red: 'from-[#4c0a0a] via-[#b91c1c] to-[#1a0303]',
};

const typeIcon: Record<Product['type'], LucideIcon> = {
  'digital-download': Sparkles,
  'source-code': Code2,
  template: Layers,
  ebook: BookOpen,
  bundle: Package,
  course: Megaphone,
};

export const badgeTone: Record<string, string> = {
  SaaS: 'bg-violet-600',
  Theme: 'bg-orange-500',
  Tool: 'bg-purple-600',
  Kit: 'bg-orange-500',
  'E-book': 'bg-pink-600',
  Script: 'bg-rose-600',
  Bundle: 'bg-orange-600',
};

export function ProductCover({ product, className, showBadge = true, iconSize = 'lg' }: { product: Pick<Product, 'cover' | 'coverTone' | 'name' | 'type' | 'badge'>; className?: string; showBadge?: boolean; iconSize?: 'sm' | 'lg' }) {
  const Icon = typeIcon[product.type] ?? ShoppingBag;
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br', coverGradient[product.coverTone], className)}>
      {product.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.cover} alt={`${product.name} cover`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 left-6 h-28 w-40 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(255,255,255,0.06)_100%)] bg-[length:100%_22px]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className={cn('grid place-items-center rounded-2xl border border-white/25 bg-white/10 text-white shadow-[0_0_40px_-6px_rgba(255,255,255,0.35)] backdrop-blur', iconSize === 'lg' ? 'h-16 w-16' : 'h-9 w-9 rounded-xl')}>
              <Icon className={iconSize === 'lg' ? 'h-8 w-8' : 'h-4 w-4'} />
            </div>
          </div>
        </>
      )}
      {showBadge && product.badge && (
        <span className={cn('absolute left-3 top-3 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-lg', badgeTone[product.badge] ?? 'bg-violet-600')}>{product.badge}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avatars, tables, pagination                                         */
/* ------------------------------------------------------------------ */

const avatarColors = ['bg-orange-500', 'bg-violet-500', 'bg-sky-500', 'bg-pink-500', 'bg-teal-500', 'bg-amber-600', 'bg-blue-600', 'bg-emerald-600'];

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const color = avatarColors[(name.charCodeAt(0) + name.length) % avatarColors.length];
  const s = { sm: 'h-8 w-8 text-sm', md: 'h-9 w-9 text-sm', lg: 'h-16 w-16 text-2xl' }[size];
  return <span className={cn('grid shrink-0 place-items-center rounded-full font-bold text-white', color, s)}>{name.trim().charAt(0).toUpperCase() || '?'}</span>;
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('whitespace-nowrap px-3 py-3 text-left text-sm font-semibold text-neutral-300 first:pl-4 last:pr-4', className)} {...props} />;
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('whitespace-nowrap px-3 py-3 text-sm text-neutral-200 first:pl-4 last:pr-4', className)} {...props} />;
}

export function Pagination({ page, pages, onPage, total, perPage, noun }: { page: number; pages: number; onPage: (p: number) => void; total: number; perPage: number; noun: string }) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);
  const list: (number | '…')[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) list.push(p);
    else if (list[list.length - 1] !== '…') list.push('…');
  }
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-4 sm:flex-row">
      <span className="text-sm text-neutral-400">
        Showing {from}–{to} of {total.toLocaleString()} {noun}
      </span>
      {pages > 1 && (
        <div className="flex items-center gap-1.5">
          <Button size="icon" variant="secondary" aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)} icon={ChevronLeft} />
          {list.map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} className="px-1 text-neutral-500">…</span>
            ) : (
              <Button key={p} size="icon" variant={p === page ? 'primary' : 'secondary'} onClick={() => onPage(p)} aria-current={p === page ? 'page' : undefined}>
                {p}
              </Button>
            )
          )}
          <Button size="icon" variant="secondary" aria-label="Next page" disabled={page === pages} onClick={() => onPage(page + 1)} icon={ChevronRight} />
        </div>
      )}
    </div>
  );
}

export function usePaged<T>(items: T[], perPage: number, resetKey: unknown) {
  const [page, setPage] = React.useState(1);
  React.useEffect(() => setPage(1), [resetKey]);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(page, pages);
  return { page: current, pages, setPage, slice: items.slice((current - 1) * perPage, current * perPage) };
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-orange-400">
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-4 font-semibold text-white">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-neutral-400">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function Modal({ open, onClose, title, children, footer, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size];
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-white/10 bg-[#14141C] shadow-2xl sm:rounded-3xl', width)}>
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <Button size="icon" variant="ghost" aria-label="Close" onClick={onClose} icon={X} />
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2.5 border-t border-white/[0.07] px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/** Confirm dialog for destructive actions. */
export function useConfirm() {
  const [state, setState] = React.useState<{ title: string; text: string; action: string; run: () => void } | null>(null);
  const confirm = (title: string, text: string, action: string, run: () => void) => setState({ title, text, action, run });
  const dialog = (
    <Modal
      open={!!state}
      onClose={() => setState(null)}
      title={state?.title ?? ''}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => setState(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              state?.run();
              setState(null);
            }}
          >
            {state?.action}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-300">{state?.text}</p>
    </Modal>
  );
  return { confirm, dialog };
}

/** Segmented tab buttons with counts (All / Published / Draft …). */
export function FilterTabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: { value: T; label: string; count?: number; tone?: 'orange' | 'green' | 'gray' }[] }) {
  return (
    <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all',
              active ? 'border-orange-500 bg-orange-500/10 text-white shadow-[0_0_24px_-8px_rgba(249,115,22,0.9)]' : 'border-white/10 bg-white/[0.02] text-neutral-200 hover:border-white/20'
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-xs font-bold',
                  t.tone === 'green' ? 'bg-emerald-500/20 text-emerald-300' : active ? 'bg-orange-500/25 text-orange-200' : 'bg-white/10 text-neutral-300'
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className={cn(inputClass, 'pl-10')} />
    </div>
  );
}
