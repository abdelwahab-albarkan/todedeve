'use client';

import * as React from 'react';
import { Activity as ActivityIcon, CalendarDays, Download, Eye, Layers, ShoppingBag, ShoppingCart, Star, Trophy, Users, UserPlus, RotateCcw, Tag, KeyRound, Mail, Package, BarChart3 } from 'lucide-react';
import { useStore } from '@/lib/digital-system/store';
import { compact, dailySeries, delta, download, inRange, isPaid, money, previousRange, rangeForDays, timeAgo, toCsv, topProducts, type Range } from '@/lib/digital-system/selectors';
import type { ActivityKind } from '@/lib/digital-system/types';
import { Button, Card, CardHeader, Input, ProductCover, Select, StatCard, Td, Th } from '@/components/digital-system/ui';
import { AreaChart, Donut, Legend } from '@/components/digital-system/charts';

const DAY = 86_400_000;
const TRAFFIC_COLORS = ['#F97316', '#3B82F6', '#A855F7', '#22C55E', '#A3A3A3'];
const activityIcon: Record<ActivityKind, { icon: typeof Star; cls: string }> = {
  order: { icon: ShoppingCart, cls: 'bg-emerald-500/15 text-emerald-400' },
  customer: { icon: UserPlus, cls: 'bg-violet-500/15 text-violet-300' },
  download: { icon: Download, cls: 'bg-blue-500/15 text-blue-400' },
  product: { icon: Package, cls: 'bg-orange-500/15 text-orange-400' },
  coupon: { icon: Tag, cls: 'bg-pink-500/15 text-pink-400' },
  refund: { icon: RotateCcw, cls: 'bg-red-500/15 text-red-400' },
  email: { icon: Mail, cls: 'bg-sky-500/15 text-sky-300' },
  license: { icon: KeyRound, cls: 'bg-amber-500/15 text-amber-300' },
};

function fmtDay(t: number) {
  return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AnalyticsPage() {
  const { db, notify } = useStore();
  const [preset, setPreset] = React.useState<string>('30');
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = React.useState(new Date(Date.now() - 29 * DAY).toISOString().slice(0, 10));
  const [to, setTo] = React.useState(today);

  const range: Range = React.useMemo(() => {
    if (preset !== 'custom') return rangeForDays(Number(preset));
    const f = new Date(`${from}T00:00:00`).getTime();
    const t = new Date(`${to}T23:59:59.999`).getTime();
    const a = Math.min(f, t);
    const b = Math.max(f, t);
    return { from: a, to: b, days: Math.max(1, Math.round((b - a) / DAY)) };
  }, [preset, from, to]);
  const prev = previousRange(range);

  const now = db.orders.filter((o) => inRange(o, range.from, range.to));
  const before = db.orders.filter((o) => inRange(o, prev.from, prev.to));
  const revenue = now.filter(isPaid).reduce((a, o) => a + o.amount, 0);
  const revenuePrev = before.filter(isPaid).reduce((a, o) => a + o.amount, 0);
  const newCustomers = db.customers.filter((c) => inRange({ createdAt: c.joinedAt }, range.from, range.to)).length;
  const newCustomersPrev = db.customers.filter((c) => inRange({ createdAt: c.joinedAt }, prev.from, prev.to)).length;
  const views = db.products.reduce((a, p) => a + p.views, 0);
  const series = dailySeries(db.orders, range);
  const top = topProducts(db, now, 5);
  const byStatus = (['completed', 'pending', 'refunded'] as const).map((s) => now.filter((o) => o.status === s).length);
  const trafficTotal = db.traffic.reduce((a, t) => a + t.visits, 0);

  const exportReport = () => {
    const rows: (string | number)[][] = [
      ['TODEDEV report', `${new Date(range.from).toISOString().slice(0, 10)} to ${new Date(range.to).toISOString().slice(0, 10)}`],
      [],
      ['Total revenue', revenue.toFixed(2)],
      ['Total orders', now.length],
      ['New customers', newCustomers],
      ['Completed', byStatus[0]],
      ['Pending', byStatus[1]],
      ['Refunded', byStatus[2]],
      [],
      ['Date', 'Revenue', 'Orders'],
      ...series.map((p) => [new Date(p.date).toISOString().slice(0, 10), p.revenue.toFixed(2), p.orders]),
      [],
      ['Top products', 'Orders', 'Revenue'],
      ...top.map((t) => [t.product.name, t.sales, t.revenue.toFixed(2)]),
    ];
    download(`todedev-report-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    notify('Report exported.');
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]">Analytics &amp; Reports</h1>
          <p className="mt-1 text-neutral-400">Track your store performance, sales, customers and growth.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-neutral-300" aria-hidden="true" />
            <Select value={preset} onChange={(e) => setPreset(e.target.value)} aria-label="Date range" className="w-44">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </Select>
          </span>
          {preset === 'custom' && (
            <span className="flex items-center gap-2">
              <Input type="date" value={from} max={today} onChange={(e) => setFrom(e.target.value)} aria-label="From" className="w-40" />
              <span className="text-neutral-500">–</span>
              <Input type="date" value={to} max={today} onChange={(e) => setTo(e.target.value)} aria-label="To" className="w-40" />
            </span>
          )}
          <Button variant="primary" size="lg" icon={Download} onClick={exportReport}>Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingBag} tone="purple" value={money(revenue)} label="Total Revenue" change={delta(revenue, revenuePrev)} />
        <StatCard icon={ShoppingCart} tone="orange" value={now.length.toLocaleString()} label="Total Orders" change={delta(now.length, before.length)} />
        <StatCard icon={Users} tone="blue" value={newCustomers.toLocaleString()} label="New Customers" change={delta(newCustomers, newCustomersPrev)} />
        <StatCard icon={Eye} tone="red" value={compact(views)} label="Product Views" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardHeader
            title="Sales Overview"
            icon={BarChart3}
            action={
              <span className="flex items-center gap-4 text-sm text-neutral-300">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Orders</span>
              </span>
            }
          />
          <div className="px-3 pb-3 pt-2">
            <AreaChart
              labels={series.map((p) => fmtDay(p.date))}
              series={[
                { key: 'rev', label: 'Revenue', color: '#F97316', values: series.map((p) => p.revenue), format: (v) => money(v) },
                { key: 'ord', label: 'Orders', color: '#A855F7', values: series.map((p) => p.orders), ownScale: true },
              ]}
              yFormat={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`)}
              dots={series.length <= 31}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Traffic Sources" icon={Layers} />
          <div className="flex flex-col items-center gap-6 p-5 sm:flex-row">
            <div className="w-48 shrink-0">
              <Donut segments={db.traffic.map((t, i) => ({ label: t.label, value: t.visits, color: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length] }))} center={compact(trafficTotal)} sub="Visits" />
            </div>
            <Legend items={db.traffic.map((t, i) => ({ label: t.label, value: t.visits, color: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length] }))} total={trafficTotal} />
          </div>
          <p className="px-5 pb-4 text-xs text-neutral-500">Sample traffic data. Connect your analytics provider to show real visits.</p>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        <Card className="min-w-0">
          <CardHeader title="Top Selling Products" icon={Trophy} />
          <div className="overflow-x-auto px-1 pb-3 pt-2">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="border-b border-white/[0.06]"><Th>#</Th><Th>Product</Th><Th>Orders</Th><Th className="text-right">Revenue</Th></tr>
              </thead>
              <tbody>
                {top.length === 0 && (
                  <tr><Td colSpan={4} className="py-6 text-neutral-500">No paid orders in this period.</Td></tr>
                )}
                {top.map((t, i) => (
                  <tr key={t.product.id} className="border-b border-white/[0.04] last:border-0">
                    <Td><span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] text-xs">{i + 1}</span></Td>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <ProductCover product={t.product} showBadge={false} iconSize="sm" className="h-8 w-8 shrink-0 rounded-lg" />
                        <span className="font-medium text-white">{t.product.name}</span>
                      </span>
                    </Td>
                    <Td>{t.sales}</Td>
                    <Td className="text-right font-semibold text-white">{money(t.revenue)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Orders by Status" icon={Layers} />
          <div className="flex flex-col items-center gap-6 p-5 sm:flex-row">
            <div className="w-48 shrink-0">
              <Donut
                segments={[
                  { label: 'Completed', value: byStatus[0], color: '#22C55E' },
                  { label: 'Pending', value: byStatus[1], color: '#F97316' },
                  { label: 'Refunded', value: byStatus[2], color: '#EF4444' },
                ]}
                center={String(now.length)}
                sub="Orders"
              />
            </div>
            <Legend
              items={[
                { label: 'Completed', value: byStatus[0], color: '#22C55E' },
                { label: 'Pending', value: byStatus[1], color: '#F97316' },
                { label: 'Refunded', value: byStatus[2], color: '#EF4444' },
              ]}
              total={now.length}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2 2xl:col-span-1">
          <CardHeader title="Recent Activity" icon={ActivityIcon} />
          <ul className="divide-y divide-white/[0.05] px-5 pb-3 pt-2">
            {db.activity.slice(0, 6).map((a) => {
              const { icon: Icon, cls } = activityIcon[a.kind];
              return (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${cls}`}><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1 truncate text-sm text-neutral-100">{a.text}</span>
                  <span className="shrink-0 text-xs text-neutral-500">{timeAgo(a.at)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
