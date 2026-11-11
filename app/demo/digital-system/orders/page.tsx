'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock,
  CreditCard,
  Download,
  Eye,
  KeyRound,
  Mail,
  Package,
  RefreshCw,
  Settings,
  ShoppingCart,
  User,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/lib/digital-system/store';
import { byId, dateTime, delta, download, inRange, money, previousRange, rangeForDays, toCsv } from '@/lib/digital-system/selectors';
import type { Order, OrderStatus } from '@/lib/digital-system/types';
import { Avatar, Button, Card, EmptyState, PageHeader, Pagination, ProductCover, SearchInput, Select, StatCard, StatusPill, Td, Th, useConfirm, usePaged } from '@/components/digital-system/ui';
import { BASE } from '@/components/digital-system/Shell';
import { cn } from '@/lib/utils';

const PER_PAGE = 8;

function Orders() {
  const { db, refundOrder, completeOrder, regenerateLicense, logOrderEvent, notify } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const { confirm, dialog } = useConfirm();
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState<'all' | OrderStatus>('all');
  const [product, setProduct] = React.useState('all');
  const [days, setDays] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState<string | null>(params?.get('id') ?? null);
  const panel = React.useRef<HTMLDivElement>(null);

  const customers = byId(db.customers);
  const products = byId(db.products);

  // KPI deltas compare the last 30 days with the 30 days before
  const r30 = rangeForDays(30);
  const p30 = previousRange(r30);
  const cnt = (s: OrderStatus | null, r: { from: number; to: number }) => db.orders.filter((o) => (s ? o.status === s : true) && inRange(o, r.from, r.to)).length;
  const total = (s: OrderStatus | null) => db.orders.filter((o) => (s ? o.status === s : true)).length;

  const term = q.trim().toLowerCase();
  const range = days ? rangeForDays(days) : null;
  const filtered = db.orders.filter((o) => {
    if (status !== 'all' && o.status !== status) return false;
    if (product !== 'all' && o.productId !== product) return false;
    if (range && !inRange(o, range.from, range.to)) return false;
    if (!term) return true;
    const c = customers.get(o.customerId);
    return `${o.id} ${c?.name ?? ''} ${c?.email ?? ''} ${products.get(o.productId)?.name ?? ''}`.toLowerCase().includes(term);
  });
  const { page, pages, setPage, slice } = usePaged(filtered, PER_PAGE, `${term}${status}${product}${days}`);

  const selected = db.orders.find((o) => o.id === selectedId) ?? slice[0] ?? null;
  const select = (o: Order) => {
    setSelectedId(o.id);
    router.replace(`${BASE}/orders?id=${o.id}`, { scroll: false });
    if (window.innerWidth < 1536) setTimeout(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const exportCsv = () => {
    const rows = [['Order ID', 'Date', 'Customer', 'Email', 'Product', 'Amount', 'Discount', 'Coupon', 'Status', 'Payment', 'License key']];
    for (const o of filtered) {
      const c = customers.get(o.customerId);
      rows.push([o.id, o.createdAt, c?.name ?? '', c?.email ?? '', products.get(o.productId)?.name ?? '', o.amount.toFixed(2), o.discount.toFixed(2), o.couponCode ?? '', o.status, o.payment, o.licenseKey ?? '']);
    }
    download(`todedev-orders-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    notify(`Exported ${filtered.length} orders.`);
  };

  const sc = selected ? customers.get(selected.customerId) : null;
  const sp = selected ? products.get(selected.productId) : null;

  const downloadFiles = (o: Order) => {
    if (o.status !== 'completed') return notify('Files are only available for paid orders.', 'error');
    if (!sp || sp.files.length === 0) return notify('This product has no files attached.', 'error');
    logOrderEvent(o.id, 'Admin downloaded the order files', 'download');
    notify(`Demo: ${sp.files.length} sample file${sp.files.length === 1 ? '' : 's'} – a real store would serve signed links here.`, 'info');
  };

  return (
    <>
      {dialog}
      <PageHeader
        title="Orders Management"
        subtitle="Track, manage and fulfill your digital product orders."
        actions={
          <>
            <Button icon={Download} onClick={exportCsv}>Export Orders</Button>
            <Button variant="primary" icon={Settings} size="lg" onClick={() => router.push(`${BASE}/settings`)}>Order Settings</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={ShoppingCart} tone="orange" value={total(null).toLocaleString()} label="Total Orders" change={delta(cnt(null, r30), cnt(null, p30))} />
            <StatCard icon={Check} tone="purple" value={total('completed').toLocaleString()} label="Completed" change={delta(cnt('completed', r30), cnt('completed', p30))} />
            <StatCard icon={Clock} tone="blue" value={total('pending').toLocaleString()} label="Pending" change={delta(cnt('pending', r30), cnt('pending', p30))} />
            <StatCard icon={X} tone="red" value={total('refunded').toLocaleString()} label="Refunded" change={delta(cnt('refunded', r30), cnt('refunded', p30))} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
            <SearchInput value={q} onChange={setQ} placeholder="Search orders (ID, customer, email...)" className="sm:col-span-2 lg:col-span-1" />
            <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Status">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </Select>
            <Select value={product} onChange={(e) => setProduct(e.target.value)} aria-label="Product">
              <option value="all">All Products</option>
              {db.products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
            <Select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Date range">
              <option value={0}>All Time</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </Select>
          </div>

          <Card className="mt-4 overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={ShoppingCart} title="No orders found" text="Try a different search or filter." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[740px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <Th>Order ID</Th>
                      <Th>Customer</Th>
                      <Th>Product</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Date</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {slice.map((o) => {
                      const c = customers.get(o.customerId);
                      const p = products.get(o.productId);
                      const active = selected?.id === o.id;
                      return (
                        <tr key={o.id} onClick={() => select(o)} className={cn('cursor-pointer border-b border-white/[0.04] last:border-0 transition', active ? 'bg-orange-500/[0.07]' : 'hover:bg-white/[0.03]')}>
                          <Td className="font-bold text-white">#{o.id}</Td>
                          <Td>
                            <span className="flex items-center gap-3">
                              <Avatar name={c?.name ?? '?'} />
                              <span className="leading-tight">
                                <span className="block font-semibold text-white">{c?.name ?? 'Unknown'}</span>
                                <span className="text-xs text-neutral-400">{c?.email}</span>
                              </span>
                            </span>
                          </Td>
                          <Td>
                            <span className="flex items-center gap-3">
                              {p && <ProductCover product={p} showBadge={false} iconSize="sm" className="h-9 w-9 shrink-0 rounded-lg" />}
                              <span className="max-w-[150px] truncate font-medium text-white">{p?.name ?? 'Deleted product'}</span>
                            </span>
                          </Td>
                          <Td className="font-semibold text-white">{money(o.amount)}</Td>
                          <Td><StatusPill status={o.status} /></Td>
                          <Td className="text-neutral-300"><span className="block">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span className="text-xs text-neutral-500">{new Date(o.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span></Td>
                          <Td className="text-right">
                            <span className="inline-flex gap-1">
                              <Button size="icon" variant="ghost" aria-label={`View order ${o.id}`} icon={Eye} onClick={(e) => { e.stopPropagation(); select(o); }} />
                              {o.status === 'completed' && <Button size="icon" variant="ghost" aria-label={`Download files for ${o.id}`} icon={Download} onClick={(e) => { e.stopPropagation(); downloadFiles(o); }} />}
                            </span>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={page} pages={pages} onPage={setPage} total={filtered.length} perPage={PER_PAGE} noun="orders" />
          </Card>
        </div>

        <div ref={panel} className="min-w-0 scroll-mt-24">
          <Card className="p-5 2xl:sticky 2xl:top-24">
            {!selected ? (
              <EmptyState icon={Package} title="Select an order" text="Order details appear here." />
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-white">Order Details</h2>
                  <span className="text-sm font-semibold text-neutral-300">#{selected.id}</span>
                </div>
                <div className="mt-3"><StatusPill status={selected.status} /></div>
                <dl className="mt-4 space-y-3.5 text-sm">
                  {[
                    { icon: User, label: 'Customer', value: <span className="text-right"><span className="block font-semibold text-white">{sc?.name}</span><span className="text-xs text-neutral-400">{sc?.email}</span></span> },
                    { icon: CalendarDays, label: 'Date', value: dateTime(selected.createdAt) },
                    { icon: CircleDollarSign, label: 'Amount', value: <span className="text-right">{money(selected.amount)}{selected.couponCode && <span className="block text-xs text-violet-300">{selected.couponCode} (−{money(selected.discount)})</span>}</span> },
                    { icon: CreditCard, label: 'Payment', value: selected.payment },
                    { icon: Package, label: 'Product', value: sp?.name ?? 'Deleted product' },
                    { icon: CheckCircle2, label: 'License', value: sp ? (sp.pricing.licenseType === 'lifetime' ? 'Lifetime' : sp.pricing.licenseType === 'subscription' ? 'Subscription' : `${sp.pricing.limitedDays} days`) : '—' },
                    { icon: KeyRound, label: 'License key', value: <code className="break-all text-xs text-orange-300">{selected.licenseKey ?? '—'}</code> },
                    { icon: Download, label: 'Downloads', value: `${selected.downloads}${sp?.pricing.maxDownloads ? ` / ${sp.pricing.maxDownloads}` : ''}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <dt className="flex shrink-0 items-center gap-2.5 text-neutral-300"><Icon className="h-4 w-4 text-neutral-400" />{label}</dt>
                      <dd className="min-w-0 text-right text-neutral-100">{value}</dd>
                    </div>
                  ))}
                </dl>
                <Button variant="primary" icon={Download} className="mt-4 w-full" disabled={selected.status !== 'completed'} onClick={() => downloadFiles(selected)}>Download Files</Button>

                <h3 className="mt-6 border-t border-white/[0.07] pt-5 font-bold text-white">Order Actions</h3>
                <div className="mt-3 space-y-2.5">
                  {selected.status === 'pending' && (
                    <Button variant="purple" icon={Check} className="w-full justify-start" onClick={() => confirm('Mark as paid?', `Only do this after confirming payment for #${selected.id} with your payment provider. Files and license will be delivered.`, 'Mark as paid', () => { completeOrder(selected.id); notify(`#${selected.id} marked as paid.`); })}>
                      Mark as Paid
                    </Button>
                  )}
                  <Button icon={Mail} className="w-full justify-start" disabled={selected.status === 'refunded'} onClick={() => { logOrderEvent(selected.id, 'Purchase email re-sent'); notify(`Demo: purchase email for #${selected.id} logged (no email is sent).`, 'info'); }}>
                    Resend Email
                  </Button>
                  <Button icon={RefreshCw} className="w-full justify-start" disabled={selected.status !== 'completed' || sp?.pricing.licenseKey === 'none'} onClick={() => { const k = regenerateLicense(selected.id); notify(`New license key: ${k}`); }}>
                    Regenerate License
                  </Button>
                  <Button variant="danger" icon={X} className="w-full justify-start" disabled={selected.status !== 'completed'} onClick={() => confirm('Refund order?', `#${selected.id} will be marked refunded and the customer loses download access. In production this calls your payment provider's refund API.`, 'Refund order', () => { refundOrder(selected.id); notify(`#${selected.id} refunded.`); })}>
                    Refund Order
                  </Button>
                </div>

                <h3 className="mt-6 border-t border-white/[0.07] pt-5 font-bold text-white">Order History</h3>
                <ol className="mt-3 space-y-3">
                  {[...selected.history].reverse().map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      <span>
                        <span className="block text-neutral-100">{h.label}</span>
                        <span className="text-xs text-neutral-500">{dateTime(h.at)}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default function OrdersPage() {
  return (
    <React.Suspense fallback={null}>
      <Orders />
    </React.Suspense>
  );
}
