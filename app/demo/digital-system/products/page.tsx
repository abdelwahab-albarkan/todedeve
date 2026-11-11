'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, Download, Eye, LayoutGrid, List, MoreHorizontal, Package, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { useStore } from '@/lib/digital-system/store';
import { byId, compact, download, money, productSales } from '@/lib/digital-system/selectors';
import type { Product, ProductStatus } from '@/lib/digital-system/types';
import { Button, LinkButton, Card, EmptyState, FilterTabs, PageHeader, Pagination, ProductCover, SearchInput, Select, StatusPill, Td, Th, useConfirm, usePaged } from '@/components/digital-system/ui';
import { BASE } from '@/components/digital-system/Shell';
import { TYPE_LABELS } from '@/lib/digital-system/labels';
import { cn } from '@/lib/utils';

type Tab = 'all' | ProductStatus;

function ActionsMenu({ product }: { product: Product }) {
  const { setProductStatus, notify } = useStore();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const set = (s: ProductStatus) => {
    setProductStatus(product.id, s);
    notify(`${product.name} moved to ${s}.`);
    setOpen(false);
  };
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label={`More actions for ${product.name}`} onClick={() => setOpen((v) => !v)} className="grid h-8 w-8 place-items-center rounded-lg bg-black/30 text-white backdrop-blur hover:bg-black/50">
        <MoreHorizontal className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#16161F] p-1 text-sm shadow-2xl">
          {(['published', 'draft', 'archived'] as ProductStatus[])
            .filter((s) => s !== product.status)
            .map((s) => (
              <button key={s} type="button" onClick={() => set(s)} className="block w-full rounded-lg px-3 py-2 text-left capitalize text-neutral-200 hover:bg-white/[0.06]">
                {s === 'published' ? 'Publish' : s === 'draft' ? 'Move to draft' : 'Archive'}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const { db, duplicateProduct, deleteProduct, importProducts, notify } = useStore();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [tab, setTab] = React.useState<Tab>('all');
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [type, setType] = React.useState('all');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const fileInput = React.useRef<HTMLInputElement>(null);

  const categories = byId(db.categories);
  const sales = productSales(db);
  const count = (s: ProductStatus) => db.products.filter((p) => p.status === s).length;

  const filtered = db.products.filter(
    (p) =>
      (tab === 'all' || p.status === tab) &&
      (cat === 'all' || p.categoryId === cat) &&
      (type === 'all' || p.type === type) &&
      (!q.trim() || `${p.name} ${categories.get(p.categoryId)?.name ?? ''} ${p.shortDescription}`.toLowerCase().includes(q.trim().toLowerCase()))
  );
  const { page, pages, setPage, slice } = usePaged(filtered, 12, `${tab}${q}${cat}${type}`);

  const onImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      const items: Product[] = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(items)) throw new Error();
      const n = importProducts(items);
      notify(n ? `Imported ${n} product${n === 1 ? '' : 's'}.` : 'No valid products found in that file.', n ? 'success' : 'error');
    } catch {
      notify('That file is not a valid TODEDEV product export (JSON).', 'error');
    }
  };

  const onDuplicate = (p: Product) => {
    const copy = duplicateProduct(p.id);
    if (copy) notify(`Duplicated as “${copy.name}” (draft).`);
  };
  const onDelete = (p: Product) =>
    confirm('Delete product?', `“${p.name}” and its file list will be removed. Existing orders keep their records.`, 'Delete product', () => {
      deleteProduct(p.id);
      notify(`${p.name} deleted.`);
    });

  const iconBtn = 'grid h-8 w-8 place-items-center rounded-lg text-neutral-300 hover:bg-white/[0.07] hover:text-white';

  return (
    <>
      {dialog}
      <PageHeader
        title="Products"
        subtitle="Manage your digital products, files and pricing."
        actions={
          <>
            <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
            <Button icon={Download} onClick={() => fileInput.current?.click()}>Import</Button>
            <Button icon={Upload} onClick={() => download('todedev-products.json', JSON.stringify({ products: db.products }, null, 2), 'application/json')}>Export</Button>
            <LinkButton href={`${BASE}/products/new`} variant="primary" icon={Plus} size="lg">Add Product</LinkButton>
          </>
        }
      />

      <FilterTabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'all', label: 'All Products', count: db.products.length },
          { value: 'published', label: 'Published', count: count('published'), tone: 'green' },
          { value: 'draft', label: 'Draft', count: count('draft') },
          { value: 'archived', label: 'Archived', count: count('archived') },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <SearchInput value={q} onChange={setQ} placeholder="Search products..." className="sm:col-span-2 lg:col-span-1" />
        <Select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          <option value="all">All Categories</option>
          {db.categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Product type">
          <option value="all">All Types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </Select>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          {(['grid', 'list'] as const).map((v) => {
            const Icon = v === 'grid' ? LayoutGrid : List;
            return (
              <button
                key={v}
                type="button"
                aria-label={`${v} view`}
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn('grid h-11 w-14 place-items-center rounded-xl border transition', view === v ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-white/10 text-neutral-300 hover:border-white/20')}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Package} title="No products match" text="Try another search or filter, or add a new product." action={<LinkButton href={`${BASE}/products/new`} variant="primary" icon={Plus}>Add Product</LinkButton>} />
          </Card>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {slice.map((p) => (
              <Card key={p.id} className="group overflow-hidden transition hover:border-orange-500/40 hover:shadow-[0_0_40px_-18px_rgba(249,115,22,0.8)]">
                <div className="relative">
                  <Link href={`${BASE}/products/edit?id=${p.id}`} aria-label={`Edit ${p.name}`}>
                    <ProductCover product={p} className="aspect-[16/9] w-full transition duration-300 group-hover:scale-[1.02]" />
                  </Link>
                  <div className="absolute right-3 top-3">
                    <ActionsMenu product={p} />
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`${BASE}/products/edit?id=${p.id}`} className="block truncate text-lg font-bold text-white hover:text-orange-300">{p.name}</Link>
                  <p className="truncate text-sm text-neutral-400">{categories.get(p.categoryId)?.name ?? 'Uncategorized'}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-xl font-extrabold text-orange-500">{money(p.pricing.price, p.pricing.currency)}</span>
                    <StatusPill status={p.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-sm text-neutral-300">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Download className="h-4 w-4" />{sales.get(p.id) ?? 0} sales</span>
                      <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{compact(p.views)} views</span>
                    </span>
                    <span className="flex items-center">
                      <button type="button" className={iconBtn} aria-label={`Edit ${p.name}`} onClick={() => router.push(`${BASE}/products/edit?id=${p.id}`)}><Pencil className="h-4 w-4" /></button>
                      <button type="button" className={iconBtn} aria-label={`Duplicate ${p.name}`} onClick={() => onDuplicate(p)}><Copy className="h-4 w-4" /></button>
                      <button type="button" className={cn(iconBtn, 'text-red-400 hover:text-red-300')} aria-label={`Delete ${p.name}`} onClick={() => onDelete(p)}><Trash2 className="h-4 w-4" /></button>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <Th>Product</Th>
                    <Th>Category</Th>
                    <Th>Type</Th>
                    <Th>Price</Th>
                    <Th>Sales</Th>
                    <Th>Views</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((p) => (
                    <tr key={p.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <Td>
                        <Link href={`${BASE}/products/edit?id=${p.id}`} className="flex items-center gap-3">
                          <ProductCover product={p} showBadge={false} iconSize="sm" className="h-11 w-16 shrink-0 rounded-lg" />
                          <span className="font-semibold text-white">{p.name}</span>
                        </Link>
                      </Td>
                      <Td>{categories.get(p.categoryId)?.name ?? '—'}</Td>
                      <Td>{TYPE_LABELS[p.type]}</Td>
                      <Td className="font-bold text-orange-400">{money(p.pricing.price, p.pricing.currency)}</Td>
                      <Td>{sales.get(p.id) ?? 0}</Td>
                      <Td>{compact(p.views)}</Td>
                      <Td><StatusPill status={p.status} /></Td>
                      <Td className="text-right">
                        <span className="inline-flex">
                          <button type="button" className={iconBtn} aria-label={`Edit ${p.name}`} onClick={() => router.push(`${BASE}/products/edit?id=${p.id}`)}><Pencil className="h-4 w-4" /></button>
                          <button type="button" className={iconBtn} aria-label={`Duplicate ${p.name}`} onClick={() => onDuplicate(p)}><Copy className="h-4 w-4" /></button>
                          <button type="button" className={cn(iconBtn, 'text-red-400')} aria-label={`Delete ${p.name}`} onClick={() => onDelete(p)}><Trash2 className="h-4 w-4" /></button>
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {filtered.length > 0 && (
          <Card className="mt-4">
            <Pagination page={page} pages={pages} onPage={setPage} total={filtered.length} perPage={12} noun="products" />
          </Card>
        )}
      </div>
    </>
  );
}
