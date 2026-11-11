'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FolderPlus, LayoutGrid, Pencil, Plus, Trash2 } from 'lucide-react';
import { useStore, uid } from '@/lib/digital-system/store';
import { money, productSales } from '@/lib/digital-system/selectors';
import { slugify } from '@/lib/digital-system/seed';
import type { Category } from '@/lib/digital-system/types';
import { Button, Card, EmptyState, Field, Input, Modal, PageHeader, SearchInput, Textarea, useConfirm } from '@/components/digital-system/ui';
import { BASE } from '@/components/digital-system/Shell';

function CategoryForm({ initial, onClose }: { initial: Category | null; onClose: () => void }) {
  const { db, saveCategory, notify } = useStore();
  const [c, setC] = React.useState<Category>(() => initial ?? { id: uid('cat'), name: '', slug: '', description: '' });
  const [err, setErr] = React.useState('');
  const submit = () => {
    const name = c.name.trim();
    if (!name) return setErr('Enter a category name.');
    const slug = slugify(c.slug || name);
    if (db.categories.some((x) => x.id !== c.id && (x.slug === slug || x.name.toLowerCase() === name.toLowerCase()))) return setErr('A category with this name already exists.');
    saveCategory({ ...c, name, slug });
    notify(initial ? 'Category updated.' : `${name} created.`);
    onClose();
  };
  return (
    <Modal open onClose={onClose} title={initial ? 'Edit category' : 'New category'} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={submit}>{initial ? 'Save' : 'Create category'}</Button></>}>
      <div className="space-y-4">
        <Field label="Name" required error={err}><Input value={c.name} maxLength={60} onChange={(e) => { setErr(''); setC({ ...c, name: e.target.value }); }} /></Field>
        <Field label="Slug" hint="(used in store URLs)"><Input value={c.slug} placeholder={slugify(c.name)} onChange={(e) => setC({ ...c, slug: slugify(e.target.value) })} /></Field>
        <Field label="Description"><Textarea value={c.description} maxLength={240} onChange={(e) => setC({ ...c, description: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

function Categories() {
  const { db, deleteCategory, notify } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const { confirm, dialog } = useConfirm();
  const [q, setQ] = React.useState('');
  const [form, setForm] = React.useState<Category | null | 'new'>(params?.get('new') ? 'new' : null);
  const sales = productSales(db);
  const term = q.trim().toLowerCase();
  const list = db.categories.filter((c) => !term || c.name.toLowerCase().includes(term));

  const close = () => {
    setForm(null);
    if (params?.get('new')) router.replace(`${BASE}/categories`, { scroll: false });
  };

  return (
    <>
      {dialog}
      {form && <CategoryForm initial={form === 'new' ? null : form} onClose={close} />}
      <PageHeader title="Categories" subtitle="Group your products so customers find them faster." actions={<Button variant="primary" size="lg" icon={Plus} onClick={() => setForm('new')}>New Category</Button>} />
      <SearchInput value={q} onChange={setQ} placeholder="Search categories..." className="max-w-md" />
      {list.length === 0 ? (
        <Card className="mt-5"><EmptyState icon={LayoutGrid} title="No categories" action={<Button variant="primary" icon={FolderPlus} onClick={() => setForm('new')}>New Category</Button>} /></Card>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => {
            const items = db.products.filter((p) => p.categoryId === c.id);
            const revenue = db.orders.filter((o) => o.status === 'completed' && items.some((p) => p.id === o.productId)).reduce((a, o) => a + o.amount, 0);
            const sold = items.reduce((a, p) => a + (sales.get(p.id) ?? 0), 0);
            return (
              <Card key={c.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-[0_8px_30px_-8px_rgba(139,92,246,0.8)]">
                    <LayoutGrid className="h-6 w-6" />
                  </span>
                  <span className="flex gap-1">
                    <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} icon={Pencil} onClick={() => setForm(c)} />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${c.name}`}
                      icon={Trash2}
                      className="text-red-400"
                      onClick={() =>
                        items.length
                          ? notify(`Move or delete the ${items.length} product${items.length === 1 ? '' : 's'} in ${c.name} first.`, 'error')
                          : confirm('Delete category?', `${c.name} will be removed.`, 'Delete', () => { if (deleteCategory(c.id)) notify(`${c.name} deleted.`); })
                      }
                    />
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">{c.name}</h2>
                <p className="mt-1 flex-1 text-sm text-neutral-400">{c.description || 'No description.'}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center text-sm">
                  <span><span className="block font-bold text-white">{items.length}</span><span className="text-xs text-neutral-400">Products</span></span>
                  <span><span className="block font-bold text-white">{sold}</span><span className="text-xs text-neutral-400">Sales</span></span>
                  <span><span className="block font-bold text-orange-400">{money(revenue)}</span><span className="text-xs text-neutral-400">Revenue</span></span>
                </div>
                <Button className="mt-4" onClick={() => router.push(`${BASE}/products`)}>View products</Button>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function CategoriesPage() {
  return (
    <React.Suspense fallback={null}>
      <Categories />
    </React.Suspense>
  );
}
