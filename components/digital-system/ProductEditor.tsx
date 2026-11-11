'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BarChart3,
  Bold,
  CalendarClock,
  Check,
  ChevronRight,
  CloudUpload,
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  FileText,
  FolderOpen,
  Italic,
  Link2,
  List,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Repeat,
  Save,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  X,
  File as FileIcon,
  Infinity as Lifetime,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileRecord, getFileBlob, newProduct, useStore } from '@/lib/digital-system/store';
import { bytes, download, imageToWebp, money } from '@/lib/digital-system/selectors';
import { slugify } from '@/lib/digital-system/seed';
import { TYPE_LABELS } from '@/lib/digital-system/labels';
import type { CoverTone, Currency, Product, ProductFile } from '@/lib/digital-system/types';
import { Button, Card, Field, Input, Modal, OptionCard, Pill, ProductCover, Select, Textarea, Toggle, badgeTone } from './ui';
import { BASE } from './Shell';

type TabKey = 'details' | 'files' | 'pricing' | 'seo' | 'settings';
const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'details', label: 'Product Details', icon: Pencil },
  { key: 'files', label: 'Files & Delivery', icon: FolderOpen },
  { key: 'pricing', label: 'Pricing & License', icon: Tag },
  { key: 'seo', label: 'SEO', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const BADGES = ['SaaS', 'Theme', 'Tool', 'Kit', 'E-book', 'Script', 'Bundle'];
const TONES: CoverTone[] = ['purple', 'orange', 'blue', 'pink', 'green', 'red'];
const toneSwatch: Record<CoverTone, string> = { purple: 'bg-violet-600', orange: 'bg-orange-500', blue: 'bg-blue-600', pink: 'bg-pink-600', green: 'bg-emerald-600', red: 'bg-red-600' };
const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'MAD'];
const MAX_DESC = 2000;

type Errors = Partial<Record<'name' | 'categoryId' | 'shortDescription' | 'price' | 'compareAt' | 'files' | 'externalUrl' | 'slug' | 'renewalPrice', string>>;
const errorTab: Record<keyof Errors, TabKey> = { name: 'details', categoryId: 'details', shortDescription: 'details', price: 'pricing', compareAt: 'pricing', renewalPrice: 'pricing', files: 'files', externalUrl: 'files', slug: 'seo' };

export function discountPercent(p: Product['pricing']) {
  if (!p.discountEnabled || !p.compareAt || p.compareAt <= p.price) return 0;
  return Math.round(((p.compareAt - p.price) / p.compareAt) * 100);
}

function validate(p: Product, all: Product[], publishing: boolean): Errors {
  const e: Errors = {};
  if (!p.name.trim()) e.name = 'Enter a product name.';
  if (!p.categoryId) e.categoryId = 'Choose a category.';
  if (!p.shortDescription.trim()) e.shortDescription = 'Write a short description.';
  if (!Number.isFinite(p.pricing.price) || p.pricing.price < 0) e.price = 'Enter a valid price.';
  if (p.pricing.discountEnabled && (!p.pricing.compareAt || p.pricing.compareAt <= p.pricing.price)) e.compareAt = 'Compare-at price must be higher than the price to show a discount.';
  if (p.pricing.licenseType === 'subscription' && (p.pricing.renewalPrice === null || p.pricing.renewalPrice < 0)) e.renewalPrice = 'Enter the renewal price.';
  if (p.delivery === 'external' && !/^https:\/\/\S+\.\S+/.test(p.externalUrl.trim())) e.externalUrl = 'Enter a secure https:// download link.';
  if (publishing && p.delivery === 'instant' && p.files.length === 0) e.files = 'Upload at least one file to deliver after purchase.';
  const slug = p.seo.slug || slugify(p.name);
  if (slug && all.some((x) => x.id !== p.id && (x.seo.slug || slugify(x.name)) === slug)) e.slug = 'Another product already uses this URL slug.';
  return e;
}

function fileBadge(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['zip', 'rar', '7z'].includes(ext)) return { label: ext.toUpperCase(), cls: 'bg-violet-600', Icon: FileArchive };
  if (ext === 'pdf') return { label: 'PDF', cls: 'bg-red-500', Icon: FileText };
  if (['doc', 'docx'].includes(ext)) return { label: 'DOC', cls: 'bg-blue-600', Icon: FileText };
  return { label: (ext || 'FILE').slice(0, 4).toUpperCase(), cls: 'bg-neutral-600', Icon: FileIcon };
}

/* ------------------------------------------------------------------ */
/* Upload helpers                                                      */
/* ------------------------------------------------------------------ */

function Dropzone({ onFiles, accept, multiple = true, title, hint, compact }: { onFiles: (f: File[]) => void; accept?: string; multiple?: boolean; title: React.ReactNode; hint: string; compact?: boolean }) {
  const input = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), input.current?.click())}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition',
        compact ? 'px-4 py-5' : 'px-6 py-8',
        over ? 'border-orange-500 bg-orange-500/10' : 'border-white/15 bg-white/[0.02] hover:border-orange-500/60'
      )}
    >
      <input
        ref={input}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
      <CloudUpload className={cn('text-orange-500', compact ? 'h-7 w-7' : 'h-10 w-10')} />
      <p className={cn('mt-2 font-semibold text-white', compact ? 'text-sm' : 'text-base')}>{title}</p>
      <p className="mt-1 text-xs text-neutral-400">{hint}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Right-hand previews                                                 */
/* ------------------------------------------------------------------ */

function PreviewCard({ p, cta = 'Buy Now' }: { p: Product; cta?: string }) {
  const off = discountPercent(p.pricing);
  const perks = p.features.slice(0, 3);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-lg font-bold text-white">Product Preview</h2>
        <Link href={`${BASE}/products`} className="text-neutral-400 hover:text-white" aria-label="Back to products">
          <ExternalLink className="h-5 w-5" />
        </Link>
      </div>
      <div className="p-5">
        <div className="relative">
          <ProductCover product={p} className="aspect-[16/10] w-full rounded-2xl" />
          {off > 0 && <span className="absolute right-3 top-3 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-bold text-white">{off}% OFF</span>}
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-white">{p.name || 'Untitled product'}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{p.shortDescription || 'Your short description appears here.'}</p>
        {perks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {perks.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/[0.06] px-2.5 py-1.5 text-xs font-medium text-neutral-100">
                <Check className="h-3.5 w-3.5 text-orange-400" />
                {f}
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 flex items-baseline gap-3 border-t border-white/[0.07] pt-4">
          <span className="text-3xl font-black text-orange-500">{money(p.pricing.price || 0, p.pricing.currency)}</span>
          {off > 0 && p.pricing.compareAt && <span className="text-lg text-neutral-500 line-through">{money(p.pricing.compareAt, p.pricing.currency)}</span>}
        </div>
        {p.pricing.licenseType === 'subscription' && (
          <p className="mt-1 text-xs text-neutral-400">
            Renews {p.pricing.billingCycle} at {money(p.pricing.renewalPrice ?? 0, p.pricing.currency)}
            {p.pricing.trialDays ? ` · ${p.pricing.trialDays}-day trial` : ''}
          </p>
        )}
        <Button variant="primary" size="lg" icon={ShoppingCart} className="mt-4 w-full" disabled>
          {cta}
        </Button>
      </div>
    </Card>
  );
}

function DeliveryPanel() {
  return (
    <Card className="overflow-hidden">
      <div className="relative grid h-52 place-items-center overflow-hidden bg-gradient-to-br from-[#2a0f57]/70 via-[#13131B] to-[#5a1e04]/70">
        <div className="absolute h-40 w-40 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="relative flex items-end gap-3">
          {[
            { l: 'PDF', c: 'from-red-500 to-rose-700 -rotate-12' },
            { l: 'ZIP', c: 'from-orange-400 to-orange-600 scale-125' },
            { l: '</>', c: 'from-blue-500 to-indigo-700 rotate-12' },
          ].map((f) => (
            <span key={f.l} className={cn('grid h-20 w-16 place-items-center rounded-xl bg-gradient-to-b text-lg font-black text-white shadow-2xl', f.c)}>{f.l}</span>
          ))}
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-extrabold text-white">Secure &amp; Automatic Delivery</h2>
        <ul className="mt-4 space-y-3 text-sm text-neutral-200">
          {['Instant file delivery after confirmed payment', 'Multiple files per product (ZIP, PDF, DOCX…)', 'Download limits and expiring links', 'Files never shown to unpaid visitors', 'Re-download access for customers'].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-orange-500 text-white">
                <Check className="h-3.5 w-3.5" />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-xs leading-relaxed text-neutral-400">
          Demo: uploaded files stay in this browser tab only. In production, connect file storage and your payment provider’s webhook to deliver files after payment.
        </p>
      </div>
    </Card>
  );
}

function SeoPreview({ p }: { p: Product }) {
  const title = p.seo.title || p.name || 'Product title';
  const desc = p.seo.description || p.shortDescription || 'Meta description preview.';
  const slug = p.seo.slug || slugify(p.name) || 'product-slug';
  return (
    <Card className="p-5">
      <h2 className="text-lg font-bold text-white">Search &amp; Social Preview</h2>
      <div className="mt-4 rounded-2xl bg-white p-4 text-left">
        <p className="truncate text-xs text-[#202124]">todedev.com › products › {slug}</p>
        <p className="mt-1 line-clamp-1 text-lg text-[#1a0dab]">{title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{desc}</p>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        {p.seo.socialImage || p.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.seo.socialImage ?? p.cover ?? ''} alt="Social sharing preview" className="aspect-[1200/630] w-full object-cover" />
        ) : (
          <ProductCover product={p} className="aspect-[1200/630] w-full" />
        )}
        <div className="bg-[#1c1c26] p-3">
          <p className="text-xs uppercase text-neutral-500">todedev.com</p>
          <p className="truncate font-semibold text-white">{title}</p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

export function ProductEditor({ productId }: { productId?: string }) {
  const { db, saveProduct, notify } = useStore();
  const router = useRouter();
  const existing = productId ? db.products.find((p) => p.id === productId) : undefined;
  const [p, setP] = React.useState<Product>(() => existing ?? newProduct(db.categories[0]?.id ?? ''));
  const [tab, setTab] = React.useState<TabKey>('details');
  const [errors, setErrors] = React.useState<Errors>({});
  const [dirty, setDirty] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [featureDraft, setFeatureDraft] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(!!existing?.seo.slug);
  const descRef = React.useRef<HTMLTextAreaElement>(null);
  const replaceRef = React.useRef<{ id: string } | null>(null);
  const replaceInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  if (productId && !existing) {
    return (
      <Card className="p-10 text-center">
        <p className="text-lg font-semibold text-white">Product not found</p>
        <p className="mt-1 text-sm text-neutral-400">It may have been deleted or the demo data was reset.</p>
        <Link href={`${BASE}/products`} className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-400">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
      </Card>
    );
  }

  const set = (patch: Partial<Product>) => {
    setP((prev) => {
      const next = { ...prev, ...patch };
      if (patch.name !== undefined && !slugTouched) next.seo = { ...next.seo, slug: slugify(patch.name) };
      return next;
    });
    setDirty(true);
  };
  const setPricing = (patch: Partial<Product['pricing']>) => set({ pricing: { ...p.pricing, ...patch } });
  const setSeo = (patch: Partial<Product['seo']>) => set({ seo: { ...p.seo, ...patch } });
  const setSettings = (patch: Partial<Product['settings']>) => set({ settings: { ...p.settings, ...patch } });

  const submit = (status: Product['status']) => {
    const publishing = status === 'published';
    const e = validate(p, db.products, publishing);
    setErrors(e);
    const first = Object.keys(e)[0] as keyof Errors | undefined;
    if (first) {
      setTab(errorTab[first]);
      notify(e[first] ?? 'Please fix the highlighted fields.', 'error');
      return;
    }
    saveProduct({ ...p, status, settings: { ...p.settings, visibility: publishing && p.settings.visibility === 'private' ? 'public' : p.settings.visibility } });
    setDirty(false);
    notify(publishing ? `“${p.name}” is published.` : `“${p.name}” saved as draft.`);
    router.push(`${BASE}/products`);
  };

  const addCover = async (files: File[]) => {
    try {
      set({ cover: await imageToWebp(files[0], 1200) });
    } catch {
      notify('That file is not an image we can read (PNG, JPG or WebP).', 'error');
    }
  };
  const addGallery = async (files: File[]) => {
    const room = 4 - p.gallery.length;
    if (room <= 0) return notify('You can add up to 4 additional images.', 'info');
    try {
      const imgs = await Promise.all(files.slice(0, room).map((f) => imageToWebp(f, 800, 0.78)));
      set({ gallery: [...p.gallery, ...imgs] });
    } catch {
      notify('One of those files is not a readable image.', 'error');
    }
  };
  const addFiles = (files: File[]) => {
    set({ files: [...p.files, ...files.map(fileRecord)] });
    setErrors((e) => ({ ...e, files: undefined }));
    notify(`${files.length} file${files.length === 1 ? '' : 's'} added.`);
  };
  const downloadFile = (f: ProductFile) => {
    const blob = getFileBlob(f.id);
    if (blob) download(f.name, blob);
    else notify('Sample file – the demo has no real bytes for it. Files you upload yourself can be downloaded.', 'info');
  };
  const replaceFile = (files: File[]) => {
    const target = replaceRef.current;
    if (!target || !files[0]) return;
    const rec = fileRecord(files[0]);
    set({ files: p.files.map((f) => (f.id === target.id ? rec : f)) });
    notify(`Replaced with ${rec.name}.`);
  };

  const wrapSelection = (before: string, after = before) => {
    const el = descRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const next = `${value.slice(0, s)}${before}${value.slice(s, e) || 'text'}${after}${value.slice(e)}`;
    if (next.length <= MAX_DESC) set({ description: next });
  };
  const addFeature = () => {
    const f = featureDraft.trim();
    if (!f) return;
    if (p.features.includes(f)) return setFeatureDraft('');
    set({ features: [...p.features, f].slice(0, 12) });
    setFeatureDraft('');
  };

  const off = discountPercent(p.pricing);

  return (
    <>
      <nav className="mb-3 flex items-center gap-2 text-sm text-neutral-300" aria-label="Breadcrumb">
        <Link href={`${BASE}/products`} aria-label="Back to products" className="rounded-lg p-1 hover:bg-white/[0.06]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Link href={`${BASE}/products`} className="hover:text-white">Products</Link>
        <ChevronRight className="h-4 w-4 text-neutral-500" />
        <span className="font-semibold text-white">{existing ? 'Edit Product' : 'Add New Product'}</span>
      </nav>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]">{existing ? existing.name : 'Add New Product'}</h1>
          <p className="mt-1 text-neutral-400">
            {tab === 'pricing' ? 'Set pricing, license and discount options for your digital product.' : existing ? 'Update this product in your store.' : 'Create and publish a new digital product in your store.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button icon={Eye} onClick={() => setPreview(true)}>Preview</Button>
          <Button icon={Save} onClick={() => submit('draft')}>Save as Draft</Button>
          <Button variant="primary" icon={Send} size="lg" onClick={() => submit('published')}>
            {existing?.status === 'published' ? 'Update Product' : 'Publish Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card className="min-w-0 p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Product sections">
            {TABS.map(({ key, label, icon: Icon }) => {
              const hasError = (Object.keys(errors) as (keyof Errors)[]).some((k) => errors[k] && errorTab[k] === key);
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={cn(
                    'relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition',
                    tab === key ? 'border-orange-500 bg-orange-500/10 text-white shadow-[0_0_26px_-10px_rgba(249,115,22,0.9)]' : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {hasError && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" aria-label="has errors" />}
                </button>
              );
            })}
          </div>

          {/* ---------------- Details ---------------- */}
          {tab === 'details' && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                <Field label="Product Name" required error={errors.name}>
                  <Input value={p.name} maxLength={120} onChange={(e) => set({ name: e.target.value })} placeholder="SaaS Starter Kit – Full Source Code" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Category" required error={errors.categoryId}>
                    <Select value={p.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
                      {db.categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Product Type" required>
                    <Select value={p.type} onChange={(e) => set({ type: e.target.value as Product['type'] })}>
                      {Object.entries(TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Short Description" required error={errors.shortDescription} hint={`(${p.shortDescription.length}/200)`}>
                  <Textarea value={p.shortDescription} maxLength={200} rows={2} className="min-h-[72px]" onChange={(e) => set({ shortDescription: e.target.value })} placeholder="A complete SaaS starter kit with full source code, authentication, payments and dashboard." />
                </Field>
                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-neutral-100">Full Description</span>
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0E0E14] focus-within:border-orange-500/70">
                    <div className="flex gap-1 border-b border-white/[0.07] px-2 py-1.5">
                      {[
                        { icon: Bold, label: 'Bold', run: () => wrapSelection('**') },
                        { icon: Italic, label: 'Italic', run: () => wrapSelection('_') },
                        { icon: List, label: 'Bullet list', run: () => wrapSelection('\n- ', '') },
                        { icon: Link2, label: 'Link', run: () => wrapSelection('[', '](https://)') },
                      ].map(({ icon: Icon, label, run }) => (
                        <button key={label} type="button" aria-label={label} onClick={run} className="grid h-8 w-8 place-items-center rounded-lg text-neutral-300 hover:bg-white/[0.07] hover:text-white">
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                    <textarea
                      ref={descRef}
                      value={p.description}
                      maxLength={MAX_DESC}
                      rows={7}
                      onChange={(e) => set({ description: e.target.value })}
                      placeholder={'Full Source Code (Next.js + Node.js)\nAuthentication & User Management\n...'}
                      aria-label="Full description"
                      className="block w-full resize-y bg-transparent px-3.5 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-neutral-500"
                    />
                    <p className="px-3.5 pb-2 text-right text-xs text-neutral-500">{p.description.length} / {MAX_DESC}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-neutral-100">Product Cover Image</span>
                  {p.cover ? (
                    <div className="relative">
                      <ProductCover product={p} className="aspect-[16/9] w-full rounded-2xl border border-white/10" />
                      <button type="button" aria-label="Remove cover image" onClick={() => set({ cover: null })} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-black/50 text-white backdrop-blur hover:bg-black/70">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Dropzone multiple={false} accept="image/png,image/jpeg,image/webp" onFiles={addCover} title="Upload Image" hint="PNG, JPG, WebP (1200 × 630px) – saved as optimized WebP" />
                  )}
                  {!p.cover && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span>No image yet? Cover color:</span>
                      {TONES.map((t) => (
                        <button key={t} type="button" aria-label={`${t} cover`} aria-pressed={p.coverTone === t} onClick={() => set({ coverTone: t })} className={cn('h-6 w-6 rounded-full ring-offset-2 ring-offset-[#13131B]', toneSwatch[t], p.coverTone === t && 'ring-2 ring-white')} />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-neutral-100">Additional Images <span className="font-normal text-neutral-500">(Optional, up to 4)</span></span>
                  <div className="grid grid-cols-4 gap-2.5">
                    {p.gallery.map((src, i) => (
                      <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`Additional image ${i + 1}`} className="h-full w-full object-cover" />
                        <button type="button" aria-label={`Remove image ${i + 1}`} onClick={() => set({ gallery: p.gallery.filter((_, j) => j !== i) })} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-black/60 text-white">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {p.gallery.length < 4 && (
                      <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-xl border border-dashed border-white/20 text-neutral-300 hover:border-orange-500/60 hover:text-white">
                        <Plus className="h-6 w-6" />
                        <span className="sr-only">Add images</span>
                        <input type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={(e) => { addGallery(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
                      </label>
                    )}
                  </div>
                </div>
                <Field label="Card Badge">
                  <Select value={p.badge} onChange={(e) => set({ badge: e.target.value })}>
                    <option value="">No badge</option>
                    {BADGES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="lg:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-neutral-100">Key Features <span className="font-normal text-neutral-500">(Optional)</span></span>
                <div className="flex flex-wrap gap-2.5">
                  {p.features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white">
                      <Check className="h-4 w-4 text-orange-400" />
                      {f}
                      <button type="button" aria-label={`Remove ${f}`} onClick={() => set({ features: p.features.filter((x) => x !== f) })} className="text-neutral-400 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  <span className="flex items-center gap-2">
                    <Input
                      value={featureDraft}
                      onChange={(e) => setFeatureDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add a feature"
                      maxLength={40}
                      className="h-10 w-44"
                      aria-label="New feature"
                    />
                    <Button icon={Plus} onClick={addFeature}>Add Feature</Button>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Files & Delivery ---------------- */}
          {tab === 'files' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Product Files <span className="text-orange-500">*</span></h2>
                <p className="mb-4 text-sm text-neutral-400">Upload the files that will be delivered to your customers after purchase.</p>
                <Dropzone
                  onFiles={addFiles}
                  title={<>Drag &amp; drop your files here, or click to <span className="text-orange-400">browse</span></>}
                  hint="Supported: ZIP, RAR, PDF, MP4, MP3, DOCX, EXE, etc. · Multiple files allowed"
                />
                {errors.files && <p className="mt-2 text-sm font-medium text-red-400">{errors.files}</p>}
                <input ref={replaceInput} type="file" className="hidden" onChange={(e) => { replaceFile(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
                <ul className="mt-4 space-y-2.5">
                  {p.files.map((f) => {
                    const b = fileBadge(f.name);
                    return (
                      <li key={f.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 sm:flex-nowrap">
                        <span className={cn('grid h-11 w-10 shrink-0 place-items-center rounded-lg text-[10px] font-black text-white', b.cls)}>{b.label}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-white">{f.name}</span>
                          <span className="text-xs text-neutral-400">{bytes(f.size)}{f.sample ? ' · sample file' : ''}</span>
                        </span>
                        <Pill tone="green" icon={Check}>Uploaded</Pill>
                        <span className="flex gap-1.5">
                          <Button size="icon" aria-label={`Download ${f.name}`} icon={Download} onClick={() => downloadFile(f)} />
                          <Button size="icon" aria-label={`Replace ${f.name}`} icon={RefreshCw} onClick={() => { replaceRef.current = { id: f.id }; replaceInput.current?.click(); }} />
                          <Button size="icon" variant="danger" aria-label={`Delete ${f.name}`} icon={Trash2} onClick={() => set({ files: p.files.filter((x) => x.id !== f.id) })} />
                        </span>
                      </li>
                    );
                  })}
                  {p.files.length === 0 && <li className="text-sm text-neutral-500">No files yet.</li>}
                </ul>
              </div>
              <div>
                <h2 className="mb-3 text-lg font-bold text-white">Delivery Method <span className="text-orange-500">*</span></h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <OptionCard selected={p.delivery === 'instant'} onSelect={() => set({ delivery: 'instant' })} icon={Download} title="Instant Download" subtitle="Customers get the files immediately after payment." />
                  <OptionCard selected={p.delivery === 'external'} onSelect={() => set({ delivery: 'external' })} icon={Link2} title="External Link" subtitle="Redirect to a secure download link." />
                  <OptionCard selected={p.delivery === 'manual'} onSelect={() => set({ delivery: 'manual' })} icon={Mail} title="Manual Delivery" subtitle="Send the files manually via email." />
                </div>
                {p.delivery === 'external' && (
                  <Field label="Secure download URL" required error={errors.externalUrl} className="mt-4">
                    <Input type="url" value={p.externalUrl} onChange={(e) => set({ externalUrl: e.target.value })} placeholder="https://files.example.com/your-product.zip" />
                  </Field>
                )}
                {p.delivery === 'manual' && <p className="mt-3 text-sm text-neutral-400">Orders will stay visible in Orders so you can email the files and mark them delivered.</p>}
              </div>
            </div>
          )}

          {/* ---------------- Pricing & License ---------------- */}
          {tab === 'pricing' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-5">
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-white"><Tag className="h-5 w-5 text-orange-400" /> Pricing &amp; License</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_0.9fr]">
                  <Field label="Product Price" required error={errors.price}>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                        <Input type="number" min={0} step="0.01" inputMode="decimal" value={Number.isFinite(p.pricing.price) ? p.pricing.price : ''} onChange={(e) => setPricing({ price: e.target.value === '' ? NaN : Number(e.target.value) })} className="pl-7" />
                      </div>
                      <Select value={p.pricing.currency} onChange={(e) => setPricing({ currency: e.target.value as Currency })} className="w-24" aria-label="Currency">
                        {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                      </Select>
                    </div>
                  </Field>
                  <Field label="Compare at Price" hint="(Optional)" error={errors.compareAt}>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                      <Input type="number" min={0} step="0.01" inputMode="decimal" value={p.pricing.compareAt ?? ''} onChange={(e) => setPricing({ compareAt: e.target.value === '' ? null : Number(e.target.value) })} className={cn('pl-7', p.pricing.compareAt && 'line-through decoration-neutral-500')} />
                    </div>
                  </Field>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-neutral-100">
                        Discount
                        <span className="rounded-lg bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">{off}%</span>
                      </span>
                      <Toggle checked={p.pricing.discountEnabled} onChange={(v) => setPricing({ discountEnabled: v })} label="Enable discount" />
                    </div>
                    <Field label="Valid Until">
                      <Input type="date" disabled={!p.pricing.discountEnabled} value={p.pricing.discountValidUntil?.slice(0, 10) ?? ''} onChange={(e) => setPricing({ discountValidUntil: e.target.value ? new Date(`${e.target.value}T23:59:59`).toISOString() : null })} />
                    </Field>
                  </div>
                </div>

                <h3 className="mb-2.5 mt-5 text-sm font-semibold text-neutral-100">License Type</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <OptionCard selected={p.pricing.licenseType === 'lifetime'} onSelect={() => setPricing({ licenseType: 'lifetime' })} icon={Lifetime} title="Lifetime" subtitle="(One-time Payment)" />
                  <OptionCard selected={p.pricing.licenseType === 'subscription'} onSelect={() => setPricing({ licenseType: 'subscription', renewalPrice: p.pricing.renewalPrice ?? p.pricing.price })} icon={CalendarClock} title="Subscription" subtitle="(Recurring)" />
                  <OptionCard selected={p.pricing.licenseType === 'limited'} onSelect={() => setPricing({ licenseType: 'limited' })} icon={Clock} title="Limited License" subtitle="(With Expiry)" />
                </div>

                {p.pricing.licenseType === 'subscription' && (
                  <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Repeat className="h-5 w-5 text-violet-400" /> Subscription Settings</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="Billing Cycle">
                        <Select value={p.pricing.billingCycle} onChange={(e) => setPricing({ billingCycle: e.target.value as Product['pricing']['billingCycle'] })}>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Every 3 months</option>
                          <option value="semiannual">Every 6 months</option>
                          <option value="annual">Yearly</option>
                        </Select>
                      </Field>
                      <Field label="Renewal Price" error={errors.renewalPrice}>
                        <Input type="number" min={0} step="0.01" value={p.pricing.renewalPrice ?? ''} onChange={(e) => setPricing({ renewalPrice: e.target.value === '' ? null : Number(e.target.value) })} />
                      </Field>
                      <Field label="Trial Period">
                        <Select value={p.pricing.trialDays} onChange={(e) => setPricing({ trialDays: Number(e.target.value) })}>
                          {[0, 3, 7, 14, 30].map((d) => <option key={d} value={d}>{d ? `${d} Days` : 'No trial'}</option>)}
                        </Select>
                      </Field>
                    </div>
                  </div>
                )}
                {p.pricing.licenseType === 'limited' && (
                  <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <Field label="License length" hint="(access ends after this many days)">
                      <Select value={p.pricing.limitedDays} onChange={(e) => setPricing({ limitedDays: Number(e.target.value) })}>
                        {[30, 90, 180, 365, 730].map((d) => <option key={d} value={d}>{d} days</option>)}
                      </Select>
                    </Field>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-5">
                <h2 className="mb-4 flex items-center gap-2.5 font-bold text-white"><ShieldCheck className="h-5 w-5 text-orange-400" /> Advanced Options</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Refund Policy">
                    <Select value={p.pricing.refundPolicy} onChange={(e) => setPricing({ refundPolicy: e.target.value as Product['pricing']['refundPolicy'] })}>
                      <option value="none">No refunds</option>
                      <option value="7-days">Allow Refunds (7 Days)</option>
                      <option value="14-days">Allow Refunds (14 Days)</option>
                      <option value="30-days">Allow Refunds (30 Days)</option>
                    </Select>
                  </Field>
                  <Field label="License Key">
                    <Select value={p.pricing.licenseKey} onChange={(e) => setPricing({ licenseKey: e.target.value as Product['pricing']['licenseKey'] })}>
                      <option value="auto">Auto Generate</option>
                      <option value="manual">Issue manually</option>
                      <option value="none">No license key</option>
                    </Select>
                  </Field>
                  <Field label="Max Downloads">
                    <Select value={p.pricing.maxDownloads} onChange={(e) => setPricing({ maxDownloads: Number(e.target.value) })}>
                      {[1, 3, 5, 10, 25, 0].map((n) => <option key={n} value={n}>{n ? `${n} Downloads` : 'Unlimited'}</option>)}
                    </Select>
                  </Field>
                  <div className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.07] p-3">
                    <span>
                      <span className="block text-sm font-semibold text-white">Enable Watermark</span>
                      <span className="text-xs text-neutral-400">Add your brand watermark on delivered files.</span>
                    </span>
                    <Toggle checked={p.pricing.watermark} onChange={(v) => setPricing({ watermark: v })} label="Enable watermark" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- SEO ---------------- */}
          {tab === 'seo' && (
            <div className="space-y-4">
              <Field label="SEO Title" hint={`(${(p.seo.title || '').length}/60)`}>
                <Input value={p.seo.title} maxLength={70} onChange={(e) => setSeo({ title: e.target.value })} placeholder={`${p.name || 'Product name'} | TODEDEV`} />
              </Field>
              <Field label="Meta Description" hint={`(${(p.seo.description || '').length}/160)`}>
                <Textarea value={p.seo.description} maxLength={170} rows={3} onChange={(e) => setSeo({ description: e.target.value })} placeholder={p.shortDescription || 'Describe the product in one or two sentences.'} />
              </Field>
              <Field label="URL Slug" error={errors.slug}>
                <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-[#0E0E14] focus-within:border-orange-500/70">
                  <span className="hidden whitespace-nowrap pl-3.5 text-sm text-neutral-500 sm:block">todedev.com/products/</span>
                  <input
                    value={p.seo.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSeo({ slug: slugify(e.target.value) });
                    }}
                    aria-label="URL slug"
                    className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none"
                  />
                </div>
              </Field>
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-neutral-100">Social Sharing Image <span className="font-normal text-neutral-500">(1200 × 630, defaults to the cover)</span></span>
                {p.seo.socialImage ? (
                  <div className="relative max-w-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.seo.socialImage} alt="Social sharing image" className="aspect-[1200/630] w-full rounded-2xl border border-white/10 object-cover" />
                    <button type="button" aria-label="Remove social image" onClick={() => setSeo({ socialImage: null })} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-black/50 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Dropzone compact multiple={false} accept="image/png,image/jpeg,image/webp" onFiles={async (f) => { try { setSeo({ socialImage: await imageToWebp(f[0], 1200) }); } catch { notify('Not a readable image.', 'error'); } }} title="Upload social image" hint="PNG, JPG or WebP" />
                )}
              </div>
            </div>
          )}

          {/* ---------------- Settings ---------------- */}
          {tab === 'settings' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Product Visibility">
                <Select value={p.settings.visibility} onChange={(e) => setSettings({ visibility: e.target.value as Product['settings']['visibility'] })}>
                  <option value="public">Public – listed in the store</option>
                  <option value="unlisted">Unlisted – only people with the link</option>
                  <option value="private">Private – hidden</option>
                </Select>
              </Field>
              <Field label="Purchase Limit" hint="(per customer)">
                <Select value={p.settings.purchaseLimit} onChange={(e) => setSettings({ purchaseLimit: Number(e.target.value) })}>
                  {[0, 1, 2, 5, 10].map((n) => <option key={n} value={n}>{n ? `${n} per customer` : 'Unlimited'}</option>)}
                </Select>
              </Field>
              <Field label="Download Link Expiry">
                <Select value={p.settings.downloadExpiryDays} onChange={(e) => setSettings({ downloadExpiryDays: Number(e.target.value) })}>
                  {[1, 7, 30, 90, 0].map((n) => <option key={n} value={n}>{n ? `${n} day${n === 1 ? '' : 's'}` : 'Never expires'}</option>)}
                </Select>
              </Field>
              <Field label="Max Downloads">
                <Input readOnly value={p.pricing.maxDownloads ? `${p.pricing.maxDownloads} per order (set in Pricing & License)` : 'Unlimited (set in Pricing & License)'} />
              </Field>
              <Field label="Refund Policy Note" className="md:col-span-2">
                <Textarea value={p.settings.refundNote} maxLength={300} rows={3} onChange={(e) => setSettings({ refundNote: e.target.value })} placeholder="Refunds within 7 days if the files do not work as described." />
              </Field>
            </div>
          )}
        </Card>

        <div className="min-w-0 space-y-5">
          {tab === 'files' ? <DeliveryPanel /> : tab === 'seo' ? <SeoPreview p={p} /> : <PreviewCard p={p} cta={tab === 'pricing' ? 'Add to Cart' : 'Buy Now'} />}
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title="Storefront preview" size="lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <ProductCover product={p} className="aspect-[16/10] w-full rounded-2xl" />
            {p.gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {p.gallery.map((g, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={g} alt={`Gallery image ${i + 1}`} className="aspect-[4/3] w-full rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>
          <div>
            {p.badge && <span className={cn('inline-block rounded-lg px-2.5 py-1 text-xs font-bold text-white', badgeTone[p.badge] ?? 'bg-violet-600')}>{p.badge}</span>}
            <h3 className="mt-2 text-2xl font-extrabold text-white">{p.name || 'Untitled product'}</h3>
            <p className="mt-2 text-neutral-300">{p.shortDescription}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-orange-500">{money(p.pricing.price || 0, p.pricing.currency)}</span>
              {off > 0 && p.pricing.compareAt && <span className="text-neutral-500 line-through">{money(p.pricing.compareAt, p.pricing.currency)}</span>}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-200">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-400" />{f}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-neutral-500">
              {p.pricing.licenseType === 'lifetime' ? 'Lifetime license' : p.pricing.licenseType === 'subscription' ? `Subscription, billed ${p.pricing.billingCycle}` : `${p.pricing.limitedDays}-day license`} ·{' '}
              {p.pricing.maxDownloads ? `${p.pricing.maxDownloads} downloads` : 'unlimited downloads'} · {p.files.length} file{p.files.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        {p.description && <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 font-sans text-sm leading-relaxed text-neutral-300">{p.description}</pre>}
      </Modal>
    </>
  );
}

