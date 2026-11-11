/**
 * TODEDEV Digital Product Management System — domain types.
 * The demo persists these to localStorage (see store.tsx); a backend can
 * implement the same shapes behind an API later.
 */

export type ID = string;
export type ISODate = string;

export type ProductStatus = 'published' | 'draft' | 'archived';
export type ProductType = 'digital-download' | 'source-code' | 'template' | 'ebook' | 'bundle' | 'course';
export type LicenseType = 'lifetime' | 'subscription' | 'limited';
export type BillingCycle = 'monthly' | 'quarterly' | 'semiannual' | 'annual';
export type DeliveryMethod = 'instant' | 'external' | 'manual';
export type Visibility = 'public' | 'unlisted' | 'private';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'MAD';
export type CoverTone = 'purple' | 'orange' | 'blue' | 'pink' | 'green' | 'red';

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description: string;
}

export interface ProductFile {
  id: ID;
  name: string;
  size: number; // bytes
  mime: string;
  uploadedAt: ISODate;
  /** True for seeded sample files whose bytes don't exist in the demo. */
  sample?: boolean;
}

export interface ProductPricing {
  price: number;
  compareAt: number | null;
  currency: Currency;
  discountEnabled: boolean;
  discountValidUntil: ISODate | null;
  licenseType: LicenseType;
  billingCycle: BillingCycle;
  renewalPrice: number | null;
  trialDays: number;
  /** For "limited" licenses: access length in days. */
  limitedDays: number;
  refundPolicy: 'none' | '7-days' | '14-days' | '30-days';
  licenseKey: 'auto' | 'manual' | 'none';
  maxDownloads: number; // 0 = unlimited
  watermark: boolean;
}

export interface ProductSeo {
  title: string;
  description: string;
  slug: string;
  socialImage: string | null; // data URL
}

export interface ProductSettings {
  visibility: Visibility;
  purchaseLimit: number; // per customer, 0 = unlimited
  downloadExpiryDays: number; // link lifetime, 0 = never
  refundNote: string;
}

export interface Product {
  id: ID;
  name: string;
  categoryId: ID;
  type: ProductType;
  status: ProductStatus;
  shortDescription: string;
  description: string;
  cover: string | null; // data URL (WebP)
  coverTone: CoverTone; // fallback art when no cover is uploaded
  badge: string;
  gallery: string[];
  features: string[];
  files: ProductFile[];
  delivery: DeliveryMethod;
  externalUrl: string;
  pricing: ProductPricing;
  seo: ProductSeo;
  settings: ProductSettings;
  views: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type OrderStatus = 'completed' | 'pending' | 'refunded';
export type PaymentMethod = 'Stripe' | 'PayPal' | 'Gumroad' | 'Card';

export interface OrderEvent {
  at: ISODate;
  label: string;
}

export interface Order {
  id: ID; // e.g. TD-1248
  customerId: ID;
  productId: ID;
  amount: number;
  discount: number;
  couponCode: string | null;
  status: OrderStatus;
  payment: PaymentMethod;
  licenseKey: string | null;
  downloads: number;
  createdAt: ISODate;
  history: OrderEvent[];
}

export type CustomerStatus = 'active' | 'inactive' | 'vip' | 'blocked';

export interface Customer {
  id: ID; // e.g. C-003
  name: string;
  email: string;
  country: string;
  status: CustomerStatus;
  joinedAt: ISODate;
  notes: string;
}

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: ID;
  code: string;
  type: CouponType;
  value: number;
  usageLimit: number; // 0 = unlimited
  startsAt: ISODate;
  expiresAt: ISODate | null;
  productIds: ID[]; // empty = all products
  enabled: boolean;
  createdAt: ISODate;
}

export type CouponStatus = 'active' | 'expired' | 'scheduled' | 'disabled' | 'used-up';

export type ActivityKind = 'order' | 'customer' | 'download' | 'product' | 'coupon' | 'refund' | 'email' | 'license';

export interface Activity {
  id: ID;
  kind: ActivityKind;
  text: string;
  at: ISODate;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: Currency;
  orderPrefix: string;
}

export interface TrafficSource {
  label: string;
  visits: number;
}

export interface DatabaseState {
  version: number;
  seededAt: ISODate;
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  activity: Activity[];
  traffic: TrafficSource[];
  settings: StoreSettings;
}
