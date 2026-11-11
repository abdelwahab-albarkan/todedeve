import type { Coupon, CouponStatus, Customer, DatabaseState, ID, Order, Product } from './types';

const DAY = 86_400_000;

export function money(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(n);
}

export function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '')}K` : String(n);
}

export function bytes(n: number) {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`;
  if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function dateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
}

export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

export const byId = <T extends { id: ID }>(list: T[]) => new Map(list.map((x) => [x.id, x]));

/** Revenue only counts paid (completed) orders. */
export const isPaid = (o: Order) => o.status === 'completed';

export function inRange(o: { createdAt: string }, from: number, to: number) {
  const t = new Date(o.createdAt).getTime();
  return t >= from && t <= to;
}

/** % change between the current window and the window just before it. */
export function delta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export interface Range {
  from: number;
  to: number;
  days: number;
}

export function rangeForDays(days: number, now = Date.now()): Range {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(end.getTime() - days * DAY + 1);
  start.setHours(0, 0, 0, 0);
  return { from: start.getTime(), to: end.getTime(), days };
}

export function previousRange(r: Range): Range {
  return { from: r.from - r.days * DAY, to: r.from - 1, days: r.days };
}

/** Daily revenue + order count series for charts. */
export function dailySeries(orders: Order[], r: Range) {
  const points: { date: number; revenue: number; orders: number }[] = [];
  for (let t = r.from; t <= r.to; t += DAY) points.push({ date: t, revenue: 0, orders: 0 });
  for (const o of orders) {
    const t = new Date(o.createdAt).getTime();
    if (t < r.from || t > r.to) continue;
    const i = Math.min(points.length - 1, Math.floor((t - r.from) / DAY));
    points[i].orders += 1;
    if (isPaid(o)) points[i].revenue += o.amount;
  }
  return points.map((p) => ({ ...p, revenue: Math.round(p.revenue * 100) / 100 }));
}

export function topProducts(db: DatabaseState, orders: Order[], limit = 5) {
  const stats = new Map<ID, { sales: number; revenue: number }>();
  for (const o of orders) {
    if (!isPaid(o)) continue;
    const s = stats.get(o.productId) ?? { sales: 0, revenue: 0 };
    s.sales += 1;
    s.revenue += o.amount;
    stats.set(o.productId, s);
  }
  const products = byId(db.products);
  return Array.from(stats.entries())
    .map(([id, s]) => ({ product: products.get(id), ...s }))
    .filter((x): x is { product: Product; sales: number; revenue: number } => !!x.product)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function productSales(db: DatabaseState) {
  const m = new Map<ID, number>();
  for (const o of db.orders) if (isPaid(o)) m.set(o.productId, (m.get(o.productId) ?? 0) + 1);
  return m;
}

export interface CustomerStats {
  orders: number;
  spent: number;
  lastOrder: string | null;
  products: ID[];
  downloads: number;
}

export function customerStats(db: DatabaseState): Map<ID, CustomerStats> {
  const m = new Map<ID, CustomerStats>();
  for (const c of db.customers) m.set(c.id, { orders: 0, spent: 0, lastOrder: null, products: [], downloads: 0 });
  for (const o of db.orders) {
    const s = m.get(o.customerId);
    if (!s) continue;
    s.orders += 1;
    if (isPaid(o)) {
      s.spent += o.amount;
      if (!s.products.includes(o.productId)) s.products.push(o.productId);
    }
    s.downloads += o.downloads;
    if (!s.lastOrder || o.createdAt > s.lastOrder) s.lastOrder = o.createdAt;
  }
  return m;
}

export function isRepeat(c: Customer, stats: Map<ID, CustomerStats>) {
  return (stats.get(c.id)?.orders ?? 0) > 1;
}

export function couponUses(db: DatabaseState, code: string) {
  const used = db.orders.filter((o) => o.couponCode === code && o.status !== 'refunded');
  return { uses: used.length, discount: used.reduce((a, o) => a + o.discount, 0), revenue: used.reduce((a, o) => a + o.amount, 0) };
}

export function couponStatus(c: Coupon, uses: number, now = Date.now()): CouponStatus {
  if (!c.enabled) return 'disabled';
  if (new Date(c.startsAt).getTime() > now) return 'scheduled';
  if (c.expiresAt && new Date(c.expiresAt).getTime() < now) return 'expired';
  if (c.usageLimit > 0 && uses >= c.usageLimit) return 'used-up';
  return 'active';
}

export function toCsv(rows: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    const s = v === null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(esc).join(',')).join('\n');
}

export function download(filename: string, content: Blob | string, type = 'text/csv;charset=utf-8') {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Resize an uploaded image to WebP so it fits in localStorage. */
export function imageToWebp(file: File, maxWidth = 960, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Not an image'));
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/webp', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });
}
