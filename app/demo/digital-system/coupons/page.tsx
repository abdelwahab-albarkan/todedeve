'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3, Copy, Percent, Pencil, Plus, Power, Ticket, Trash2, TrendingUp, Wallet, DollarSign } from 'lucide-react';
import { useStore, uid } from '@/lib/digital-system/store';
import { byId, couponStatus, couponUses, money, shortDate } from '@/lib/digital-system/selectors';
import type { Coupon, CouponStatus } from '@/lib/digital-system/types';
import { Button, Card, CardHeader, EmptyState, Field, FilterTabs, Input, Modal, OptionCard, PageHeader, SearchInput, Select, StatCard, StatusPill, Td, Th, Toggle, useConfirm } from '@/components/digital-system/ui';
import { BASE } from '@/components/digital-system/Shell';
import { cn } from '@/lib/utils';

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');

function CouponForm({ initial, onClose }: { initial: Coupon | null; onClose: () => void }) {
  const { db, saveCoupon, notify } = useStore();
  const [c, setC] = React.useState<Coupon>(
    () => initial ?? { id: uid('cp'), code: '', type: 'percent', value: 10, usageLimit: 0, startsAt: new Date().toISOString(), expiresAt: null, productIds: [], enabled: true, createdAt: new Date().toISOString() }
  );
  const [err, setErr] = React.useState<Partial<Record<'code' | 'value' | 'dates', string>>>({});

  const submit = () => {
    const e: typeof err = {};
    const code = c.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) e.code = 'Use 3–24 letters, numbers, - or _.';
    else if (db.coupons.some((x) => x.id !== c.id && x.code === code)) e.code = 'This code already exists.';
    if (!Number.isFinite(c.value) || c.value <= 0) e.value = 'Enter a discount above 0.';
    else if (c.type === 'percent' && c.value > 100) e.value = 'A percentage cannot exceed 100%.';
    if (c.expiresAt && new Date(c.expiresAt) <= new Date(c.startsAt)) e.dates = 'The expiry date must be after the start date.';
    setErr(e);
    if (Object.keys(e).length) return;
    saveCoupon({ ...c, code });
    notify(initial ? `${code} updated.` : `${code} created.`);
    onClose();
  };

  const toggleProduct = (id: string) => setC({ ...c, productIds: c.productIds.includes(id) ? c.productIds.filter((x) => x !== id) : [...c.productIds, id] });

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={initial ? `Edit ${initial.code}` : 'Create coupon'}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>{initial ? 'Save coupon' : 'Create coupon'}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label="Coupon Code" required error={err.code}>
            <Input value={c.code} maxLength={24} onChange={(e) => setC({ ...c, code: e.target.value.toUpperCase().replace(/\s/g, '') })} placeholder="WELCOME10" className="font-mono tracking-wider" />
          </Field>
          <Button onClick={() => setC({ ...c, code: `TDV${Math.random().toString(36).slice(2, 8).toUpperCase()}` })}>Generate</Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OptionCard selected={c.type === 'percent'} onSelect={() => setC({ ...c, type: 'percent' })} icon={Percent} title="Percentage Discount" subtitle="e.g. 20% off the price" />
          <OptionCard selected={c.type === 'fixed'} onSelect={() => setC({ ...c, type: 'fixed' })} icon={DollarSign} title="Fixed Discount" subtitle="e.g. $10 off the price" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={c.type === 'percent' ? 'Discount (%)' : 'Discount ($)'} required error={err.value}>
            <Input type="number" min={0} max={c.type === 'percent' ? 100 : undefined} step="0.01" value={Number.isFinite(c.value) ? c.value : ''} onChange={(e) => setC({ ...c, value: e.target.value === '' ? NaN : Number(e.target.value) })} />
          </Field>
          <Field label="Usage Limit" hint="(0 = unlimited)">
            <Input type="number" min={0} step={1} value={c.usageLimit} onChange={(e) => setC({ ...c, usageLimit: Math.max(0, Math.floor(Number(e.target.value) || 0)) })} />
          </Field>
          <Field label="Starts">
            <Input type="date" value={toDateInput(c.startsAt)} onChange={(e) => e.target.value && setC({ ...c, startsAt: new Date(`${e.target.value}T00:00:00`).toISOString() })} />
          </Field>
          <Field label="Expires" hint="(optional)" error={err.dates}>
            <Input type="date" value={toDateInput(c.expiresAt)} onChange={(e) => setC({ ...c, expiresAt: e.target.value ? new Date(`${e.target.value}T23:59:59`).toISOString() : null })} />
          </Field>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-semibold text-neutral-100">Product Restrictions <span className="font-normal text-neutral-500">({c.productIds.length ? `${c.productIds.length} selected` : 'applies to all products'})</span></span>
          <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto rounded-xl border border-white/[0.07] p-3">
            {db.products.map((p) => {
              const on = c.productIds.includes(p.id);
              return (
                <button key={p.id} type="button" aria-pressed={on} onClick={() => toggleProduct(p.id)} className={cn('rounded-lg border px-3 py-1.5 text-xs font-medium transition', on ? 'border-orange-500 bg-orange-500/15 text-white' : 'border-white/10 text-neutral-300 hover:border-white/25')}>
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] p-3">
          <span>
            <span className="block text-sm font-semibold text-white">Enabled</span>
            <span className="text-xs text-neutral-400">Disabled coupons can&apos;t be used at checkout.</span>
          </span>
          <Toggle checked={c.enabled} onChange={(v) => setC({ ...c, enabled: v })} label="Coupon enabled" />
        </div>
      </div>
    </Modal>
  );
}

type Tab = 'all' | CouponStatus;

function Coupons() {
  const { db, saveCoupon, deleteCoupon, notify } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const { confirm, dialog } = useConfirm();
  const [tab, setTab] = React.useState<Tab>('all');
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState<'recent' | 'uses' | 'expiry'>('recent');
  const [form, setForm] = React.useState<Coupon | null | 'new'>(params?.get('new') ? 'new' : null);

  const products = byId(db.products);
  const rows = db.coupons.map((c) => {
    const u = couponUses(db, c.code);
    return { c, ...u, status: couponStatus(c, u.uses) };
  });
  const count = (s: CouponStatus) => rows.filter((r) => r.status === s).length;
  const term = q.trim().toLowerCase();
  const filtered = rows
    .filter((r) => (tab === 'all' || r.status === tab) && (!term || r.c.code.toLowerCase().includes(term)))
    .sort((a, b) => (sort === 'uses' ? b.uses - a.uses : sort === 'expiry' ? (a.c.expiresAt ?? '9999').localeCompare(b.c.expiresAt ?? '9999') : b.c.createdAt.localeCompare(a.c.createdAt)));

  const totals = rows.reduce((a, r) => ({ uses: a.uses + r.uses, discount: a.discount + r.discount, revenue: a.revenue + r.revenue }), { uses: 0, discount: 0, revenue: 0 });
  const maxUses = Math.max(1, ...rows.map((r) => r.uses));

  const close = () => {
    setForm(null);
    if (params?.get('new')) router.replace(`${BASE}/coupons`, { scroll: false });
  };

  return (
    <>
      {dialog}
      {form && <CouponForm initial={form === 'new' ? null : form} onClose={close} />}
      <PageHeader
        title="Coupons & Discounts"
        subtitle="Create discount codes, limit their use and track how they perform."
        actions={<Button variant="primary" size="lg" icon={Plus} onClick={() => setForm('new')}>Create Coupon</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Ticket} tone="orange" value={String(count('active'))} label="Active Coupons" />
        <StatCard icon={TrendingUp} tone="purple" value={totals.uses.toLocaleString()} label="Total Uses" />
        <StatCard icon={Percent} tone="blue" value={money(totals.discount)} label="Discounts Given" />
        <StatCard icon={Wallet} tone="green" value={money(totals.revenue)} label="Revenue with Coupons" />
      </div>

      <div className="mt-5">
        <FilterTabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'all', label: 'All Coupons', count: rows.length },
            { value: 'active', label: 'Active', count: count('active'), tone: 'green' },
            { value: 'scheduled', label: 'Scheduled', count: count('scheduled') },
            { value: 'expired', label: 'Expired', count: count('expired') },
            { value: 'disabled', label: 'Disabled', count: count('disabled') },
          ]}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <SearchInput value={q} onChange={setQ} placeholder="Search coupon codes..." />
        <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort coupons">
          <option value="recent">Newest first</option>
          <option value="uses">Most used</option>
          <option value="expiry">Expiring soonest</option>
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="min-w-0 overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={Ticket} title="No coupons here" text="Create a coupon to offer a discount at checkout." action={<Button variant="primary" icon={Plus} onClick={() => setForm('new')}>Create Coupon</Button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <Th>Code</Th>
                    <Th>Discount</Th>
                    <Th>Usage</Th>
                    <Th>Valid</Th>
                    <Th>Products</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(({ c, uses, status }) => (
                    <tr key={c.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <Td>
                        <span className="flex items-center gap-2">
                          <code className="rounded-lg border border-dashed border-orange-500/50 bg-orange-500/10 px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-orange-300">{c.code}</code>
                          <button type="button" aria-label={`Copy ${c.code}`} onClick={() => navigator.clipboard?.writeText(c.code).then(() => notify(`${c.code} copied.`), () => notify('Could not copy.', 'error'))} className="text-neutral-400 hover:text-white">
                            <Copy className="h-4 w-4" />
                          </button>
                        </span>
                      </Td>
                      <Td className="font-semibold text-white">{c.type === 'percent' ? `${c.value}% off` : `${money(c.value)} off`}</Td>
                      <Td>
                        <span className="block text-white">{uses}{c.usageLimit ? ` / ${c.usageLimit}` : ' / ∞'}</span>
                        {c.usageLimit > 0 && (
                          <span className="mt-1 block h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                            <span className="block h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, (uses / c.usageLimit) * 100)}%` }} />
                          </span>
                        )}
                      </Td>
                      <Td className="text-neutral-300">
                        {shortDate(c.startsAt)} – {c.expiresAt ? shortDate(c.expiresAt) : 'No expiry'}
                      </Td>
                      <Td className="max-w-[180px] truncate text-neutral-300" title={c.productIds.map((id) => products.get(id)?.name).join(', ')}>
                        {c.productIds.length ? c.productIds.map((id) => products.get(id)?.name ?? 'Deleted').join(', ') : 'All products'}
                      </Td>
                      <Td><StatusPill status={status} /></Td>
                      <Td className="text-right">
                        <span className="inline-flex gap-1">
                          <Button size="icon" variant="ghost" aria-label={`Edit ${c.code}`} icon={Pencil} onClick={() => setForm(c)} />
                          <Button size="icon" variant="ghost" aria-label={c.enabled ? `Disable ${c.code}` : `Enable ${c.code}`} icon={Power} className={c.enabled ? 'text-emerald-400' : 'text-neutral-500'} onClick={() => { saveCoupon({ ...c, enabled: !c.enabled }); notify(`${c.code} ${c.enabled ? 'disabled' : 'enabled'}.`); }} />
                          <Button size="icon" variant="ghost" aria-label={`Delete ${c.code}`} icon={Trash2} className="text-red-400" onClick={() => confirm('Delete coupon?', `${c.code} will stop working immediately. Past orders keep their discount.`, 'Delete coupon', () => { deleteCoupon(c.id); notify(`${c.code} deleted.`); })} />
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Coupon Usage" icon={BarChart3} />
          <ul className="space-y-4 p-5">
            {rows
              .slice()
              .sort((a, b) => b.uses - a.uses)
              .map((r) => (
                <li key={r.c.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-mono font-semibold text-white">{r.c.code}</span>
                    <span className="text-neutral-400">{r.uses} uses · {money(r.discount)} off</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-violet-500" style={{ width: `${(r.uses / maxUses) * 100}%` }} />
                  </div>
                </li>
              ))}
            {rows.length === 0 && <li className="text-sm text-neutral-500">No coupons yet.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}

export default function CouponsPage() {
  return (
    <React.Suspense fallback={null}>
      <Coupons />
    </React.Suspense>
  );
}
