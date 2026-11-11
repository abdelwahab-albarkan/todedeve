'use client';

import * as React from 'react';
import { createSeed, DB_VERSION, licenseKey, slugify } from './seed';
import type {
  Activity,
  ActivityKind,
  Category,
  Coupon,
  Customer,
  DatabaseState,
  ID,
  Order,
  Product,
  ProductFile,
  StoreSettings,
} from './types';

/**
 * Demo data layer. Everything lives in the visitor's browser (localStorage),
 * so the live demo never touches real customers, orders or payments.
 * A production backend can replace these actions with API calls.
 */

const STORAGE_KEY = 'todedev-digital-system:v1';

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

/** Bytes of files uploaded in this session (too big for localStorage). */
const sessionBlobs = new Map<ID, Blob>();
export function rememberFileBlob(id: ID, blob: Blob) {
  sessionBlobs.set(id, blob);
}
export function getFileBlob(id: ID) {
  return sessionBlobs.get(id);
}

function load(): DatabaseState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const db = JSON.parse(raw) as DatabaseState;
    return db.version === DB_VERSION ? db : null;
  } catch {
    return null;
  }
}

function save(db: DatabaseState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch {
    return false; // quota exceeded or storage blocked: keep working in memory
  }
}

export interface Toast {
  id: string;
  text: string;
  tone: 'success' | 'error' | 'info';
}

interface StoreApi {
  db: DatabaseState;
  ready: boolean;
  toasts: Toast[];
  notify: (text: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
  resetDemo: () => void;
  // products
  saveProduct: (p: Product) => void;
  duplicateProduct: (id: ID) => Product | null;
  deleteProduct: (id: ID) => void;
  setProductStatus: (id: ID, status: Product['status']) => void;
  importProducts: (items: Product[]) => number;
  // categories
  saveCategory: (c: Category) => void;
  deleteCategory: (id: ID) => boolean;
  // orders
  refundOrder: (id: ID) => void;
  completeOrder: (id: ID) => void;
  regenerateLicense: (id: ID) => string;
  logOrderEvent: (id: ID, label: string, kind?: ActivityKind) => void;
  // customers
  saveCustomer: (c: Customer) => void;
  // coupons
  saveCoupon: (c: Coupon) => void;
  deleteCoupon: (id: ID) => void;
  // settings
  saveSettings: (s: StoreSettings) => void;
}

const StoreContext = React.createContext<StoreApi | null>(null);

export function DigitalStoreProvider({ children }: { children: React.ReactNode }) {
  // Seed with a fixed "now" on the server render, then swap in persisted data.
  const [db, setDb] = React.useState<DatabaseState>(() => createSeed());
  const [ready, setReady] = React.useState(false);
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const stored = load();
    if (stored) setDb(stored);
    else save(db);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notify = React.useCallback((text: string, tone: Toast['tone'] = 'success') => {
    const id = uid('t');
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  const dismissToast = React.useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  /** Apply a change, persist it, and warn once if the browser refuses to store it. */
  const update = React.useCallback(
    (fn: (d: DatabaseState) => DatabaseState) => {
      setDb((prev) => {
        const next = fn(prev);
        if (!save(next)) notify('Browser storage is full – this change is kept until you reload.', 'error');
        return next;
      });
    },
    [notify]
  );

  const activity = (kind: ActivityKind, text: string): Activity => ({ id: uid('a'), kind, text, at: new Date().toISOString() });
  const withActivity = (d: DatabaseState, a: Activity) => ({ ...d, activity: [a, ...d.activity].slice(0, 60) });

  const api: StoreApi = {
    db,
    ready,
    toasts,
    notify,
    dismissToast,
    resetDemo: () => {
      const fresh = createSeed();
      save(fresh);
      setDb(fresh);
      notify('Demo data reset.');
    },

    saveProduct: (p) =>
      update((d) => {
        const exists = d.products.some((x) => x.id === p.id);
        const next = { ...p, updatedAt: new Date().toISOString(), seo: { ...p.seo, slug: p.seo.slug || slugify(p.name) } };
        return withActivity(
          { ...d, products: exists ? d.products.map((x) => (x.id === p.id ? next : x)) : [next, ...d.products] },
          activity('product', `${exists ? 'Product updated' : 'Product created'} – ${p.name}`)
        );
      }),
    duplicateProduct: (id) => {
      const src = db.products.find((p) => p.id === id);
      if (!src) return null;
      const now = new Date().toISOString();
      const copy: Product = {
        ...src,
        id: uid('p'),
        name: `${src.name} (Copy)`,
        status: 'draft',
        views: 0,
        files: src.files.map((f) => ({ ...f, id: uid('f') })),
        seo: { ...src.seo, slug: `${src.seo.slug}-copy` },
        createdAt: now,
        updatedAt: now,
      };
      update((d) => withActivity({ ...d, products: [copy, ...d.products] }, activity('product', `Product duplicated – ${src.name}`)));
      return copy;
    },
    deleteProduct: (id) =>
      update((d) => {
        const p = d.products.find((x) => x.id === id);
        return withActivity({ ...d, products: d.products.filter((x) => x.id !== id) }, activity('product', `Product deleted – ${p?.name ?? id}`));
      }),
    setProductStatus: (id, status) =>
      update((d) => ({
        ...d,
        products: d.products.map((p) =>
          p.id === id
            ? { ...p, status, settings: { ...p.settings, visibility: status === 'published' ? 'public' : p.settings.visibility }, updatedAt: new Date().toISOString() }
            : p
        ),
      })),
    importProducts: (items) => {
      const valid = items.filter((p) => p && typeof p.name === 'string' && p.pricing && typeof p.pricing.price === 'number');
      update((d) => {
        const ids = new Set(d.products.map((p) => p.id));
        const fresh = valid.map((p) => (ids.has(p.id) ? { ...p, id: uid('p') } : p));
        return withActivity({ ...d, products: [...fresh, ...d.products] }, activity('product', `Imported ${fresh.length} products`));
      });
      return valid.length;
    },

    saveCategory: (c) =>
      update((d) => ({
        ...d,
        categories: d.categories.some((x) => x.id === c.id) ? d.categories.map((x) => (x.id === c.id ? c : x)) : [...d.categories, c],
      })),
    deleteCategory: (id) => {
      if (db.products.some((p) => p.categoryId === id)) return false;
      update((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== id) }));
      return true;
    },

    refundOrder: (id) =>
      update((d) =>
        withActivity(
          {
            ...d,
            orders: d.orders.map((o) =>
              o.id === id ? { ...o, status: 'refunded', history: [...o.history, { at: new Date().toISOString(), label: 'Order refunded – download access revoked' }] } : o
            ),
          },
          activity('refund', `Order #${id} refunded`)
        )
      ),
    completeOrder: (id) =>
      update((d) =>
        withActivity(
          {
            ...d,
            orders: d.orders.map((o) => {
              if (o.id !== id) return o;
              const p = d.products.find((x) => x.id === o.productId);
              const now = new Date().toISOString();
              return {
                ...o,
                status: 'completed',
                licenseKey: o.licenseKey ?? (p?.pricing.licenseKey === 'none' ? null : licenseKey()),
                history: [...o.history, { at: now, label: 'Payment confirmed manually' }, { at: now, label: 'Files delivered by email' }],
              };
            }),
          },
          activity('order', `Order #${id} marked as paid`)
        )
      ),
    regenerateLicense: (id) => {
      const key = licenseKey();
      update((d) =>
        withActivity(
          { ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, licenseKey: key, history: [...o.history, { at: new Date().toISOString(), label: 'License key regenerated' }] } : o)) },
          activity('license', `License regenerated for #${id}`)
        )
      );
      return key;
    },
    logOrderEvent: (id, label, kind = 'email') =>
      update((d) =>
        withActivity(
          { ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, history: [...o.history, { at: new Date().toISOString(), label }] } : o)) },
          activity(kind, `${label} – #${id}`)
        )
      ),

    saveCustomer: (c) =>
      update((d) => {
        const exists = d.customers.some((x) => x.id === c.id);
        return exists
          ? { ...d, customers: d.customers.map((x) => (x.id === c.id ? c : x)) }
          : withActivity({ ...d, customers: [c, ...d.customers] }, activity('customer', `New customer registered – ${c.name}`));
      }),

    saveCoupon: (c) =>
      update((d) => {
        const exists = d.coupons.some((x) => x.id === c.id);
        return withActivity(
          { ...d, coupons: exists ? d.coupons.map((x) => (x.id === c.id ? c : x)) : [c, ...d.coupons] },
          activity('coupon', `${exists ? 'Coupon updated' : 'Coupon created'} – ${c.code}`)
        );
      }),
    deleteCoupon: (id) =>
      update((d) => {
        const c = d.coupons.find((x) => x.id === id);
        return withActivity({ ...d, coupons: d.coupons.filter((x) => x.id !== id) }, activity('coupon', `Coupon deleted – ${c?.code ?? id}`));
      }),

    saveSettings: (s) => update((d) => ({ ...d, settings: s })),
  };

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <DigitalStoreProvider>');
  return ctx;
}

/** Helpers for creating new records with sane defaults. */
export function newProduct(categoryId: ID): Product {
  const now = new Date().toISOString();
  return {
    id: uid('p'),
    name: '',
    categoryId,
    type: 'digital-download',
    status: 'draft',
    shortDescription: '',
    description: '',
    cover: null,
    coverTone: 'purple',
    badge: '',
    gallery: [],
    features: [],
    files: [],
    delivery: 'instant',
    externalUrl: '',
    pricing: {
      price: 0,
      compareAt: null,
      currency: 'USD',
      discountEnabled: false,
      discountValidUntil: null,
      licenseType: 'lifetime',
      billingCycle: 'monthly',
      renewalPrice: null,
      trialDays: 0,
      limitedDays: 365,
      refundPolicy: '7-days',
      licenseKey: 'auto',
      maxDownloads: 5,
      watermark: false,
    },
    seo: { title: '', description: '', slug: '', socialImage: null },
    settings: { visibility: 'private', purchaseLimit: 0, downloadExpiryDays: 30, refundNote: '' },
    views: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function fileRecord(file: File): ProductFile {
  const rec: ProductFile = { id: uid('f'), name: file.name, size: file.size, mime: file.type || 'application/octet-stream', uploadedAt: new Date().toISOString() };
  rememberFileBlob(rec.id, file);
  return rec;
}

export type { Order };
