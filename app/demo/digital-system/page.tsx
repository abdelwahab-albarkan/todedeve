'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, CalendarDays, ChevronRight, FolderPlus, Plus, ShoppingCart, Tag, Users, Package } from 'lucide-react';
import { useStore } from '@/lib/digital-system/store';
import { byId, dailySeries, delta, inRange, isPaid, money, previousRange, rangeForDays, topProducts } from '@/lib/digital-system/selectors';
import { Card, CardHeader, ProductCover, Select, StatCard, StatusPill, Td, Th } from '@/components/digital-system/ui';
import { AreaChart } from '@/components/digital-system/charts';
import { BASE } from '@/components/digital-system/Shell';

export default function DashboardOverview() {
  const { db } = useStore();
  const router = useRouter();
  const [days, setDays] = React.useState(30);

  const range = React.useMemo(() => rangeForDays(days), [days]);
  const prev = previousRange(range);
  const now = db.orders.filter((o) => inRange(o, range.from, range.to));
  const before = db.orders.filter((o) => inRange(o, prev.from, prev.to));
  const revenue = now.filter(isPaid).reduce((a, o) => a + o.amount, 0);
  const revenuePrev = before.filter(isPaid).reduce((a, o) => a + o.amount, 0);
  const newCustomers = db.customers.filter((c) => inRange({ createdAt: c.joinedAt }, range.from, range.to)).length;
  const newCustomersPrev = db.customers.filter((c) => inRange({ createdAt: c.joinedAt }, prev.from, prev.to)).length;
  const newProducts = db.products.filter((p) => inRange(p, range.from, range.to)).length;
  const series = dailySeries(db.orders, range);
  const top = topProducts(db, now, 3);
  const customers = byId(db.customers);
  const products = byId(db.products);
  const recent = db.orders.slice(0, 5);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]">Welcome back, Admin 👋</h1>
          <p className="mt-1 text-neutral-400">Here&apos;s what&apos;s happening with your digital store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-neutral-300" aria-hidden="true" />
          <Select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Date range" className="w-44">
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingCart} tone="orange" value={money(revenue)} label="Total Sales" change={delta(revenue, revenuePrev)} />
        <StatCard icon={ShoppingCart} tone="purple" value={now.length.toLocaleString()} label="Total Orders" change={delta(now.length, before.length)} />
        <StatCard icon={Users} tone="blue" value={db.customers.length.toLocaleString()} label="Customers" change={delta(newCustomers, newCustomersPrev)} />
        <StatCard icon={Box} tone="green" value={db.products.length.toLocaleString()} label="Products" change={db.products.length ? (newProducts / db.products.length) * 100 : 0} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Sales Overview"
            action={
              <span className="flex items-center gap-2 text-sm">
                <span className="text-base font-bold text-white">{money(revenue)}</span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-bold text-emerald-400">
                  {delta(revenue, revenuePrev) >= 0 ? '+' : ''}
                  {delta(revenue, revenuePrev).toFixed(1)}%
                </span>
              </span>
            }
          />
          <div className="px-3 pb-3 pt-2">
            <AreaChart
              labels={series.map((p) => new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
              series={[{ key: 'rev', label: 'Revenue', color: '#F97316', values: series.map((p) => p.revenue), format: (v) => money(v) }]}
              yFormat={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Top Products"
            action={
              <Link href={`${BASE}/products`} className="flex items-center gap-0.5 text-sm font-semibold text-orange-400 hover:text-orange-300">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <ul className="divide-y divide-white/[0.06] px-5 pb-3 pt-2">
            {top.length === 0 && <li className="py-6 text-sm text-neutral-400">No paid orders in this period yet.</li>}
            {top.map(({ product, sales }) => (
              <li key={product.id}>
                <Link href={`${BASE}/products/edit?id=${product.id}`} className="flex items-center gap-4 py-3">
                  <ProductCover product={product} showBadge={false} iconSize="sm" className="h-14 w-20 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-white">{product.name}</span>
                    <span className="text-sm text-neutral-400">{sales} sales</span>
                  </span>
                  <span className="font-bold text-white">{money(product.pricing.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader
            title="Recent Orders"
            action={
              <Link href={`${BASE}/orders`} className="flex items-center gap-0.5 text-sm font-semibold text-orange-400 hover:text-orange-300">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="overflow-x-auto px-1 pb-3 pt-2">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <Th># Order</Th>
                  <Th>Customer</Th>
                  <Th>Product</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} onClick={() => router.push(`${BASE}/orders?id=${o.id}`)} className="cursor-pointer border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03]">
                    <Td className="font-bold text-white">#{o.id}</Td>
                    <Td>{customers.get(o.customerId)?.email}</Td>
                    <Td>{products.get(o.productId)?.name ?? 'Deleted product'}</Td>
                    <Td className="font-semibold text-white">{money(o.amount)}</Td>
                    <Td>
                      <StatusPill status={o.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" />
          <div className="grid grid-cols-2 gap-3 p-5">
            {[
              { href: `${BASE}/products/new`, label: 'Add Product', icon: Plus, cls: 'from-orange-500 to-orange-600 shadow-[0_8px_24px_-10px_rgba(249,115,22,0.9)]' },
              { href: `${BASE}/categories?new=1`, label: 'New Category', icon: FolderPlus, cls: 'from-violet-600/80 to-purple-800/80 border border-violet-400/30' },
              { href: `${BASE}/coupons?new=1`, label: 'Create Coupon', icon: Tag, cls: 'from-blue-600 to-blue-800' },
              { href: `${BASE}/orders`, label: 'View Orders', icon: Package, cls: 'from-emerald-600 to-green-800' },
            ].map(({ href, label, icon: Icon, cls }) => (
              <Link key={label} href={href} className={`flex min-h-[64px] items-center justify-center gap-2 rounded-xl bg-gradient-to-b px-3 text-center text-sm font-bold text-white transition hover:brightness-110 sm:text-base ${cls}`}>
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
