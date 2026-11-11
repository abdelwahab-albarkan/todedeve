import type {
  Activity,
  Category,
  Coupon,
  Customer,
  DatabaseState,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductFile,
  ProductPricing,
} from './types';

export const DB_VERSION = 3;

/** Small deterministic PRNG so every fresh demo looks the same. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
const MB = 1024 * 1024;

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function licenseKey(random: () => number = Math.random) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(random() * chars.length)]).join('');
  return `TDV-${block()}-${block()}-${block()}-${block()}`;
}

export const CATEGORIES: Category[] = [
  { id: 'cat-saas', name: 'SaaS Scripts', slug: 'saas-scripts', description: 'Full-stack SaaS starters and scripts with source code.' },
  { id: 'cat-templates', name: 'Website Templates', slug: 'website-templates', description: 'Landing pages, shops and portfolio themes.' },
  { id: 'cat-tools', name: 'Digital Tools', slug: 'digital-tools', description: 'Utilities, generators and AI toolkits.' },
  { id: 'cat-business', name: 'Business Resources', slug: 'business-resources', description: 'Marketing kits, planners and templates.' },
  { id: 'cat-ebooks', name: 'E-books & Guides', slug: 'ebooks-guides', description: 'Guides and e-books in PDF and EPUB.' },
  { id: 'cat-source', name: 'Source Code', slug: 'source-code', description: 'Starter projects and boilerplates.' },
  { id: 'cat-bundles', name: 'Bundles', slug: 'bundles', description: 'Discounted packs of several products.' },
];

function pricing(price: number, compareAt: number | null, extra: Partial<ProductPricing> = {}): ProductPricing {
  return {
    price,
    compareAt,
    currency: 'USD',
    discountEnabled: compareAt !== null,
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
    ...extra,
  };
}

function files(now: number, list: [string, number][]): ProductFile[] {
  return list.map(([name, size], i) => ({
    id: `f-${slugify(name)}-${i}`,
    name,
    size: Math.round(size * MB),
    mime: name.endsWith('.pdf') ? 'application/pdf' : name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/zip',
    uploadedAt: new Date(now - (40 + i) * DAY).toISOString(),
    sample: true,
  }));
}

type ProductSeed = Omit<Product, 'seo' | 'settings' | 'createdAt' | 'updatedAt' | 'gallery' | 'cover' | 'externalUrl'>;

function product(now: number, p: ProductSeed, ageDays: number): Product {
  const created = new Date(now - ageDays * DAY).toISOString();
  return {
    ...p,
    cover: null,
    gallery: [],
    externalUrl: '',
    seo: {
      title: `${p.name} | TODEDEV`,
      description: p.shortDescription.slice(0, 155),
      slug: slugify(p.name),
      socialImage: null,
    },
    settings: { visibility: p.status === 'published' ? 'public' : 'private', purchaseLimit: 0, downloadExpiryDays: 30, refundNote: 'Refunds within 7 days if the files do not work as described.' },
    createdAt: created,
    updatedAt: created,
  };
}

function seedProducts(now: number): Product[] {
  const base = (p: Partial<ProductSeed> & Pick<ProductSeed, 'id' | 'name' | 'categoryId' | 'type' | 'badge' | 'coverTone' | 'shortDescription' | 'pricing' | 'views'>): ProductSeed => ({
    status: 'published',
    description: p.shortDescription,
    features: [],
    files: [],
    delivery: 'instant',
    ...p,
  });
  return [
    product(now, base({
      id: 'p-saas-starter', name: 'SaaS Starter Kit', categoryId: 'cat-saas', type: 'source-code', badge: 'SaaS', coverTone: 'purple',
      shortDescription: 'A complete SaaS starter kit with full source code, authentication, payments and dashboard.',
      description: 'Full Source Code (Next.js + Node.js)\nAuthentication & User Management\nPayment Integration (Stripe)\nAdmin Dashboard\nSetup Documentation\nLifetime Updates',
      features: ['Full Source Code', 'Authentication', 'Payments (Stripe)', 'Admin Dashboard'],
      files: files(now, [['saas-starter-kit.zip', 248.5], ['Installation-Guide.pdf', 4.2], ['Documentation.docx', 2.1]]),
      pricing: pricing(399, 499), views: 3400,
    }), 120),
    product(now, base({
      id: 'p-ecommerce', name: 'E-Commerce Theme', categoryId: 'cat-templates', type: 'template', badge: 'Theme', coverTone: 'orange',
      shortDescription: 'A modern, conversion-focused storefront theme with cart, checkout pages and product grids.',
      features: ['12 Page Layouts', 'Cart & Checkout', 'Responsive', 'Figma File'],
      files: files(now, [['ecommerce-theme.zip', 86.3], ['Theme-Guide.pdf', 3.1]]),
      pricing: pricing(249, null), views: 2800,
    }), 110),
    product(now, base({
      id: 'p-portfolio', name: 'Portfolio Template', categoryId: 'cat-templates', type: 'template', badge: 'Theme', coverTone: 'blue',
      shortDescription: 'A clean portfolio template for designers and developers, with case-study pages.',
      features: ['Case Studies', 'Blog', 'Dark & Light'],
      files: files(now, [['portfolio-template.zip', 42.7]]),
      pricing: pricing(99, 129), views: 1900,
    }), 95),
    product(now, base({
      id: 'p-ai-tools', name: 'AI Tools Collection', categoryId: 'cat-tools', type: 'digital-download', badge: 'Tool', coverTone: 'purple',
      shortDescription: 'A collection of AI prompt packs, scripts and automation templates for creators.',
      features: ['500+ Prompts', 'Automation Scripts', 'Monthly Additions'],
      files: files(now, [['ai-tools-collection.zip', 120.4], ['Quick-Start.pdf', 1.8]]),
      pricing: pricing(149, null, { licenseType: 'subscription', billingCycle: 'monthly', renewalPrice: 19 }), views: 1200,
    }), 80),
    product(now, base({
      id: 'p-marketing-kit', name: 'Marketing Kit Pro', categoryId: 'cat-business', type: 'digital-download', badge: 'Kit', coverTone: 'orange',
      shortDescription: 'Social media templates, ad creatives and launch checklists for digital products.',
      features: ['300 Templates', 'Canva & Figma', 'Launch Checklist'],
      files: files(now, [['marketing-kit-pro.zip', 310.2]]),
      pricing: pricing(59, 79), views: 3100,
    }), 70),
    product(now, base({
      id: 'p-freelancer-guide', name: 'Freelancer Success Guide', categoryId: 'cat-ebooks', type: 'ebook', badge: 'E-book', coverTone: 'pink',
      shortDescription: 'A practical guide to pricing, finding clients and running a freelance business.',
      features: ['180 Pages', 'Pricing Worksheets', 'Contract Templates'],
      files: files(now, [['Freelancer-Success-Guide.pdf', 18.4], ['Worksheets.zip', 6.2]]),
      pricing: pricing(29, null, { maxDownloads: 10 }), views: 4900,
    }), 60),
    product(now, base({
      id: 'p-laravel', name: 'Laravel Starter Project', categoryId: 'cat-source', type: 'source-code', badge: 'Script', coverTone: 'red',
      shortDescription: 'A Laravel 11 starter with roles, billing, admin panel and API scaffolding.',
      features: ['Roles & Permissions', 'Billing', 'REST API'],
      files: files(now, [['laravel-starter.zip', 64.9], ['Setup.pdf', 2.4]]),
      pricing: pricing(149, null), views: 1700,
    }), 55),
    product(now, base({
      id: 'p-premium-bundle', name: 'Premium Bundle', categoryId: 'cat-bundles', type: 'bundle', badge: 'Bundle', coverTone: 'orange',
      shortDescription: 'Themes, scripts and tools in one bundle at a fraction of the separate price.',
      features: ['6 Products', 'Lifetime Updates', 'Priority Support'],
      files: files(now, [['premium-bundle.zip', 702.6]]),
      pricing: pricing(499, 899), views: 1100,
    }), 40),
    product(now, base({
      id: 'p-agency', name: 'Agency Template', categoryId: 'cat-templates', type: 'template', badge: 'Theme', coverTone: 'blue',
      shortDescription: 'A multi-page agency website template with services, team and pricing sections.',
      features: ['8 Pages', 'Animations', 'CMS Ready'],
      files: files(now, [['agency-template.zip', 58.1]]),
      pricing: pricing(59, null), views: 1500,
    }), 35),
    product(now, base({
      id: 'p-nextjs-boilerplate', name: 'Next.js Boilerplate', categoryId: 'cat-source', type: 'source-code', badge: 'Script', coverTone: 'green',
      shortDescription: 'A typed Next.js 14 boilerplate with auth, i18n, testing and CI preconfigured.',
      status: 'draft',
      features: ['App Router', 'Auth', 'Testing & CI'],
      files: files(now, [['nextjs-boilerplate.zip', 22.3]]),
      pricing: pricing(89, null), views: 0,
    }), 12),
    product(now, base({
      id: 'p-notion-planner', name: 'Notion Business Planner', categoryId: 'cat-business', type: 'digital-download', badge: 'Kit', coverTone: 'green',
      shortDescription: 'A Notion workspace for planning launches, content and finances.',
      status: 'draft',
      features: ['Content Calendar', 'Finance Tracker'],
      pricing: pricing(19, null), views: 0,
    }), 8),
    product(now, base({
      id: 'p-flutter-kit', name: 'Flutter UI Kit (v1)', categoryId: 'cat-source', type: 'source-code', badge: 'Kit', coverTone: 'blue',
      shortDescription: 'The first version of the Flutter UI kit, replaced by v2.',
      status: 'archived',
      files: files(now, [['flutter-ui-kit-v1.zip', 38.0]]),
      pricing: pricing(49, null), views: 640,
    }), 300),
  ];
}

const PEOPLE: [string, string, string][] = [
  ['Ahmed M.', 'ahmed.m@gmail.com', 'Morocco'],
  ['Sara K.', 'sara.k@outlook.com', 'France'],
  ['Yassine B.', 'yassine.b@gmail.com', 'Morocco'],
  ['Leila H.', 'leila.h@hotmail.com', 'Tunisia'],
  ['Mohamed R.', 'm.r@gmail.com', 'Egypt'],
  ['Omar E.', 'omar.e@icloud.com', 'UAE'],
  ['Fatima Z.', 'fatima.z@gmail.com', 'Morocco'],
  ['Rachid A.', 'rachid.a@gmail.com', 'Algeria'],
  ['Youssef T.', 'youssef@gmail.com', 'Morocco'],
  ['Amina S.', 'amina@mail.com', 'Belgium'],
  ['Karim D.', 'karim@gmail.com', 'Canada'],
  ['Nadia L.', 'nadia.l@proton.me', 'Spain'],
  ['Lucas P.', 'lucas.p@gmail.com', 'Germany'],
  ['Emma W.', 'emma.w@outlook.com', 'United Kingdom'],
  ['Hamza N.', 'hamza.n@gmail.com', 'Morocco'],
  ['Ines F.', 'ines.f@gmail.com', 'France'],
  ['David C.', 'david.c@icloud.com', 'United States'],
  ['Salma R.', 'salma.r@gmail.com', 'Saudi Arabia'],
];

function seedCustomers(now: number, random: () => number): Customer[] {
  return PEOPLE.map(([name, email, country], i) => ({
    id: `C-${String(i + 1).padStart(3, '0')}`,
    name,
    email,
    country,
    status: i === 2 || i === 6 ? 'vip' : i === 5 || i === 13 ? 'inactive' : i === 16 ? 'blocked' : 'active',
    joinedAt: new Date(now - Math.round(2 + random() * 70) * DAY).toISOString(),
    notes: i === 2 ? 'Bought the bundle for his agency team. Prefers email support.' : '',
  }));
}

function seedCoupons(now: number): Coupon[] {
  return [
    { id: 'cp-welcome', code: 'WELCOME10', type: 'percent', value: 10, usageLimit: 0, startsAt: new Date(now - 90 * DAY).toISOString(), expiresAt: null, productIds: [], enabled: true, createdAt: new Date(now - 90 * DAY).toISOString() },
    { id: 'cp-black', code: 'BLACKFRIDAY', type: 'percent', value: 30, usageLimit: 500, startsAt: new Date(now - 10 * DAY).toISOString(), expiresAt: new Date(now + 20 * DAY).toISOString(), productIds: [], enabled: true, createdAt: new Date(now - 12 * DAY).toISOString() },
    { id: 'cp-saas50', code: 'SAAS50', type: 'fixed', value: 50, usageLimit: 25, startsAt: new Date(now - 30 * DAY).toISOString(), expiresAt: new Date(now + 30 * DAY).toISOString(), productIds: ['p-saas-starter'], enabled: true, createdAt: new Date(now - 30 * DAY).toISOString() },
    { id: 'cp-summer', code: 'SUMMER25', type: 'percent', value: 25, usageLimit: 200, startsAt: new Date(now - 150 * DAY).toISOString(), expiresAt: new Date(now - 60 * DAY).toISOString(), productIds: [], enabled: true, createdAt: new Date(now - 150 * DAY).toISOString() },
    { id: 'cp-newyear', code: 'NEWYEAR', type: 'percent', value: 20, usageLimit: 300, startsAt: new Date(now + 45 * DAY).toISOString(), expiresAt: new Date(now + 60 * DAY).toISOString(), productIds: [], enabled: true, createdAt: new Date(now - 2 * DAY).toISOString() },
  ];
}

function seedOrders(now: number, random: () => number, products: Product[], customers: Customer[], coupons: Coupon[]): Order[] {
  const sellable = products.filter((p) => p.status !== 'draft');
  // Popular products sell more often
  const weights = sellable.map((p) => (p.status === 'archived' ? 0.3 : 1 + p.views / 1500));
  const total = weights.reduce((a, b) => a + b, 0);
  const pick = () => {
    let r = random() * total;
    for (let i = 0; i < sellable.length; i++) {
      r -= weights[i];
      if (r <= 0) return sellable[i];
    }
    return sellable[0];
  };
  const payments: PaymentMethod[] = ['Stripe', 'Stripe', 'PayPal', 'Gumroad', 'Card'];
  const orders: Order[] = [];
  const count = 170;
  for (let i = 0; i < count; i++) {
    const p = pick();
    const buyers = customers.filter((c) => c.status !== 'blocked');
    const c = buyers[Math.floor(random() * buyers.length)];
    // More recent days get slightly more orders (growth trend)
    const ageDays = Math.floor(Math.pow(random(), 1.25) * 60);
    const created = now - ageDays * DAY - Math.floor(random() * DAY);
    const r = random();
    const status: OrderStatus = ageDays < 2 && r < 0.35 ? 'pending' : r < 0.06 ? 'refunded' : r < 0.12 ? 'pending' : 'completed';
    const useCoupon = random() < 0.18;
    const coupon = useCoupon ? coupons.find((cp) => cp.code === (random() < 0.6 ? 'WELCOME10' : 'BLACKFRIDAY')) ?? null : null;
    const gross = p.pricing.price;
    const discount = coupon ? Math.round((coupon.type === 'percent' ? (gross * coupon.value) / 100 : coupon.value) * 100) / 100 : 0;
    const at = new Date(created).toISOString();
    orders.push({
      id: '',
      customerId: c.id,
      productId: p.id,
      amount: Math.max(0, Math.round((gross - discount) * 100) / 100),
      discount,
      couponCode: coupon?.code ?? null,
      status,
      payment: payments[Math.floor(random() * payments.length)],
      licenseKey: status === 'completed' && p.pricing.licenseKey !== 'none' ? licenseKey(random) : null,
      downloads: status === 'completed' ? Math.floor(random() * 4) : 0,
      createdAt: at,
      history: [
        { at, label: 'Order placed' },
        ...(status !== 'pending' ? [{ at, label: 'Payment confirmed' }, { at, label: 'Files delivered by email' }] : [{ at, label: 'Awaiting payment confirmation' }]),
        ...(status === 'refunded' ? [{ at: new Date(created + 2 * DAY).toISOString(), label: 'Order refunded' }] : []),
      ],
    });
  }
  orders.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  orders.forEach((o, i) => (o.id = `TD-${1153 + i}`));
  return orders.reverse();
}

function seedActivity(now: number, orders: Order[], products: Product[], customers: Customer[]): Activity[] {
  const name = (id: string) => products.find((p) => p.id === id)?.name ?? 'Product';
  const latest = orders.slice(0, 3);
  const list: Activity[] = [
    ...latest.map((o, i) => ({ id: `a-o-${o.id}`, kind: 'order' as const, text: `New order #${o.id} – $${o.amount.toFixed(2)}`, at: new Date(now - (2 + i * 7) * 60_000).toISOString() })),
    { id: 'a-c-1', kind: 'customer', text: `New customer registered – ${customers[11].name}`, at: new Date(now - 5 * 60_000).toISOString() },
    { id: 'a-d-1', kind: 'download', text: `Product downloaded – ${name('p-saas-starter')}`, at: new Date(now - 8 * 60_000).toISOString() },
    { id: 'a-p-1', kind: 'product', text: `Product updated – ${name('p-agency')}`, at: new Date(now - 3 * 3_600_000).toISOString() },
  ];
  return list.sort((a, b) => b.at.localeCompare(a.at));
}

export function createSeed(now = Date.now()): DatabaseState {
  const random = rng(20261111);
  const products = seedProducts(now);
  const customers = seedCustomers(now, random);
  const coupons = seedCoupons(now);
  const orders = seedOrders(now, random, products, customers, coupons);
  // The last few customers are recent sign-ups; their older orders belong to earlier customers
  customers.slice(-4).forEach((c, i) => {
    c.joinedAt = new Date(now - (3 + i * 6) * DAY).toISOString();
    orders.forEach((o, j) => {
      if (o.customerId === c.id && o.createdAt < c.joinedAt) o.customerId = customers[j % (customers.length - 4)].id;
    });
  });
  // A customer must have joined before their first order
  for (const c of customers) {
    const first = orders.filter((o) => o.customerId === c.id).reduce<string | null>((m, o) => (!m || o.createdAt < m ? o.createdAt : m), null);
    if (first && first < c.joinedAt && !customers.slice(-4).includes(c)) c.joinedAt = new Date(new Date(first).getTime() - Math.round(1 + random() * 5) * DAY).toISOString();
  }
  return {
    version: DB_VERSION,
    seededAt: new Date(now).toISOString(),
    categories: CATEGORIES,
    products,
    orders,
    customers,
    coupons,
    activity: seedActivity(now, orders, products, customers),
    traffic: [
      { label: 'Direct', visits: 5580 },
      { label: 'Google', visits: 4170 },
      { label: 'Social Media', visits: 2210 },
      { label: 'Referral', visits: 1760 },
      { label: 'Others', visits: 800 },
    ],
    settings: { storeName: 'TODEDEV', supportEmail: 'support@todedev.com', currency: 'USD', orderPrefix: 'TD' },
  };
}
