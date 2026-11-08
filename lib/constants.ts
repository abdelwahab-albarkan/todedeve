/**
 * Product Data & Configuration
 * ---------------------------------------------------------------------
 * All text, links, and pricing are defined here.
 * To customize for your product, simply change the values below!
 */

export const BRAND_NAME = "TODEDEV";
export const DOMAIN_NAME = "TODEDEV.COM";
export const SITE_URL = "https://todedev.com";
export const PRODUCT_NAME = "Developer Dashboard UI Kit Pro";
export const PRODUCT_TAGLINE = "The ultimate dark SaaS admin dashboard UI kit for modern developers & teams.";
export const PRODUCT_PRICE = "$39.99";
export const PRICE_NUMBER = "39.99";
export const BUY_BUTTON_TEXT = "Buy · from $39.99";
export const VERSION_BADGE = "v1.0.0 · Now available";

/**
 * Default Gumroad direct checkout link (?wanted=true skips the product page).
 * Used by the generic "Buy · from $39.99" buttons, so it points to the
 * $39.99 package (3 months · 1 developer). Per-package links live in
 * PRICING_MATRIX[period][seats].checkoutUrl.
 */
export const GUMROAD_URL = "https://digitalservice02001.gumroad.com/l/wbcem?wanted=true";

/** In-page target for the generic "Buy" buttons: they scroll to the pricing card. */
export const PRICING_ANCHOR = "#pricing";

/** Anchor props for every Gumroad checkout link. */
export const CHECKOUT_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

export const HERO_HEADLINE = "The ultimate SaaS dashboard UI kit for modern developers.";
export const HERO_SUBHEADLINE = 
  "A complete, production-ready dark admin dashboard with 10 responsive screens, zero-dependency SVG charts, and interactive task & project management workflows built in Next.js 14 and Tailwind CSS.";

export const TRUST_LINE = "One-time payment. Instant download.";

export const NAV_LINKS = [
  { label: "Live Demo", href: "/dashboard" },
  { label: "Showcase", href: "#showcase" },
  { label: "Docs", href: "#docs" },
  { label: "License", href: "#license" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
];

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: "Zap" | "Code2" | "Layers" | "Palette" | "ShieldCheck" | "Smartphone";
}

export const FEATURES_LIST: FeatureItem[] = [
  {
    id: "ready-to-ship",
    title: "Production Architecture",
    description: "Built with modular, well-documented code so you can plug in your logic and ship with total confidence.",
    icon: "Code2",
  },
  {
    id: "blazing-fast",
    title: "Blazing Fast Performance",
    description: "Optimized for speed and SEO out of the box with zero runtime bloat and instant load times.",
    icon: "Zap",
  },
  {
    id: "design-system",
    title: "Complete Design Tokens",
    description: "Consistent spacing, typography scales, and customizable CSS variables for seamless re-branding.",
    icon: "Palette",
  },
  {
    id: "adaptive-layout",
    title: "100% Adaptive & Responsive",
    description: "Pixel-perfect experience across mobile phones, tablets, laptops, and ultra-wide desktop monitors.",
    icon: "Smartphone",
  },
  {
    id: "type-safe",
    title: "Strict Type Safety",
    description: "Full TypeScript integration with strict type definitions prevents bugs before they ever reach production.",
    icon: "ShieldCheck",
  },
  {
    id: "reusable-components",
    title: "Composable Components",
    description: "Over 30 plug-and-play components designed to fit together naturally without unnecessary wrappers.",
    icon: "Layers",
  },
];

export interface ScreenshotItem {
  id: string;
  title: string;
  caption: string;
  imageSrc: string;
  route: string;
}

export const SCREENSHOTS_LIST: ScreenshotItem[] = [
  {
    id: "overview-dashboard",
    title: "1. Dashboard Overview",
    caption: "High-density metrics, neon glowing stat cards, and interactive activity feeds.",
    imageSrc: "/theme/TODEDEV Neon Dashboard Overview.png",
    route: "/dashboard",
  },
  {
    id: "analytics-dashboard",
    title: "2. Dashboard Analytics",
    caption: "Task breakdown, weekly performance area chart, and donut status distribution.",
    imageSrc: "/theme/Neon Purple Developer Dashboard.png",
    route: "/dashboard/analytics",
  },
  {
    id: "projects-management",
    title: "3. Projects Management",
    caption: "Grid & list project workflows, progress gauges, and multi-team avatars.",
    imageSrc: "/theme/TODEDEV Theme Projects Dashboard.png",
    route: "/dashboard/projects",
  },
  {
    id: "tasks-kanban",
    title: "4. Tasks Management (Kanban)",
    caption: "4-column Kanban board (To Do, In Progress, Review, Completed) and task list table.",
    imageSrc: "/theme/TODEDEV Neon Task Dashboard.png",
    route: "/dashboard/tasks",
  },
  {
    id: "team-management",
    title: "5. Team Management",
    caption: "Roles, developer seats, active statuses, and member invitation workflow.",
    imageSrc: "/theme/Neon Dark Team Management Dashboard.png",
    route: "/dashboard/team",
  },
  {
    id: "clients-crm",
    title: "6. Clients Management",
    caption: "Client CRM directory, total revenue generated, and quick action cards.",
    imageSrc: "/theme/Neon Dark Client Dashboard.png",
    route: "/dashboard/clients",
  },
  {
    id: "invoices-billing",
    title: "7. Invoices Management",
    caption: "Billing summaries, revenue overview chart, and downloadable invoice tables.",
    imageSrc: "/theme/TODEDEV Dark Invoice Dashboard.png",
    route: "/dashboard/invoices",
  },
  {
    id: "reports-analytics",
    title: "8. Reports & Analytics",
    caption: "Revenue trends, top performing initiatives, and team productivity bar charts.",
    imageSrc: "/theme/Neon Reports & Analytics Dashboard.png",
    route: "/dashboard/reports",
  },
  {
    id: "calendar-scheduling",
    title: "9. Calendar & Scheduling",
    caption: "Full 7x5 month/week calendar grid with milestone pills and meeting trackers.",
    imageSrc: "/theme/TODEDEV Neon Calendar Dashboard.png",
    route: "/dashboard/calendar",
  },
  {
    id: "settings-customization",
    title: "10. Settings & Customization",
    caption: "Workspace preferences, Dark/Light appearance, brand palettes, and 2FA security.",
    imageSrc: "/theme/TODEDEV Theme Settings Dashboard.png",
    route: "/dashboard/settings",
  },
];

export const PRICING_MATRIX: Record<number, Record<number, { price: string; priceNumber: number; checkoutUrl: string }>> = {
  3: {
    1: { price: "$39.99", priceNumber: 39.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/wbcem?wanted=true" },
    2: { price: "$59.99", priceNumber: 59.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/ngqqte?wanted=true" },
    3: { price: "$79.99", priceNumber: 79.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/fhcyij?wanted=true" },
    4: { price: "$99.99", priceNumber: 99.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/lrcxxj?wanted=true" },
  },
  6: {
    1: { price: "$56.99", priceNumber: 56.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/dqprug?wanted=true" },
    2: { price: "$84.99", priceNumber: 84.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/ykeoy?wanted=true" },
    3: { price: "$109.99", priceNumber: 109.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/oqhryi?wanted=true" },
    4: { price: "$134.99", priceNumber: 134.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/dhiqop?wanted=true" },
  },
  12: {
    1: { price: "$79.99", priceNumber: 79.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/pszilt?wanted=true" },
    2: { price: "$119.99", priceNumber: 119.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/gnbvsds?wanted=true" },
    3: { price: "$149.99", priceNumber: 149.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/niitbf?wanted=true" },
    4: { price: "$179.99", priceNumber: 179.99, checkoutUrl: "https://digitalservice02001.gumroad.com/l/pmrkx?wanted=true" },
  },
};

export const PRICING_INCLUDED_ITEMS = [
  "Every version you receive stays yours to use, permanently",
  "Unlimited apps and client projects within the license terms",
  "Instant download from Gumroad: source ZIP + license certificate PDF",
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_LIST: FaqItem[] = [
  {
    id: "subscription",
    question: "Is this a subscription?",
    answer: "No. This is a one-time payment, not a subscription. You pay once and you are never charged again. You own and can use every version of the source code you receive permanently.",
  },
  {
    id: "update-period-ends",
    question: "What happens when my update period ends?",
    answer: "When your chosen update period (3, 6, or 12 months) ends, you continue to own and use the source code forever. You can ship unlimited commercial products and client apps with the versions you downloaded. If you want access to new releases or components released later, you can optionally extend your updates with an upgrade discount.",
  },
  {
    id: "how-updates-delivered",
    question: "How are updates delivered?",
    answer: "Updates are delivered directly through your Gumroad account library and email notifications. Whenever we release a new version, component, or Next.js/React framework update, you can immediately download the updated ZIP package from your Gumroad library with a single click.",
  },
  {
    id: "developer-seat",
    question: "What counts as a developer seat?",
    answer: "A developer seat is required for each individual developer who opens, edits, or builds with the raw source code. Team members who do not write code—such as designers, product managers, QA testers, clients, or end-users of your compiled applications—do not need a seat.",
  },
  {
    id: "client-projects",
    question: "Can I use it in client projects and commercial apps?",
    answer: "Yes, 100%! You have full commercial rights to build and deploy an unlimited number of proprietary applications, client websites, SaaS platforms, or internal tools. The only restriction is that you cannot resell the raw source code or package it into a competing UI kit or template.",
  },
  {
    id: "framework-version",
    question: "Which Next.js version is used?",
    answer: "Developer Dashboard UI Kit Pro is built and tested against Next.js 14.2+ (App Router) with React 18 and TypeScript 5. It utilizes standard Tailwind CSS 3.4 utility classes and zero-dependency SVG charts without obscure plugins, ensuring effortless upgrades as Next.js evolves.",
  },
  {
    id: "supported-browsers",
    question: "Which browsers and screen sizes does it support?",
    answer: "It supports all modern evergreen browsers (Chrome, Safari, Firefox, Edge) with full mobile, tablet, and desktop responsive layouts. The dashboard sidebar and navigation gracefully collapse from desktop monitors down to mobile touch screens.",
  },
  {
    id: "backend-auth",
    question: "Does it include a backend or database?",
    answer: "The kit is focused on providing 10 production-ready dashboard frontend screens, clean TypeScript interfaces, state models, and reusable components. You can connect it seamlessly to any backend of your choice, such as Next.js Server Actions, Supabase, Firebase, Node.js, GraphQL, Prisma, or REST APIs.",
  },
  {
    id: "how-receive-files",
    question: "How do I receive the files?",
    answer: "Immediately upon checkout on Gumroad, you are redirected to your download page where you can get the full source ZIP file and your official PDF license certificate. A backup download receipt is also sent straight to your email address.",
  },
  {
    id: "refund-policy",
    question: "Can I get a refund?",
    answer: "We want you to be completely satisfied with your purchase. If the source code has a critical bug or fails to compile as documented and our support team cannot help you resolve it within 14 days, you are eligible for a full refund through Gumroad.",
  },
  {
    id: "need-more-seats",
    question: "I need more seats or a longer update period later. Can I upgrade?",
    answer: "Yes! You can easily upgrade your license to add more developer seats or extend your update window at any time. Simply contact us at abdelwahabalbarkan2018@gmail.com with your Gumroad license key, and we will issue an upgrade invoice charging only the price difference.",
  },
  {
    id: "state-management",
    question: "Which state management or data libraries can I use with this kit?",
    answer: "The kit is architected with pure React state and standard TypeScript props, making it seamless to integrate with TanStack Query (React Query), Zustand, Redux Toolkit, SWR, or Next.js server components.",
  },
  {
    id: "design-files",
    question: "Does the package include design assets and screenshots?",
    answer: "Yes! In addition to the clean Next.js/React source code, the package includes all 10 high-resolution dashboard PNG design previews, design token specifications, color palettes, spacing variables, and vector icons to help you customize quickly.",
  },
  {
    id: "seat-transfer",
    question: "Can I transfer seats between team members?",
    answer: "Yes. Developer seats are floating per team. If a developer leaves your project or organization, their seat can be reassigned to another developer working on the codebase.",
  },
  {
    id: "support-contact",
    question: "How do I get technical support if I encounter an issue?",
    answer: "Every customer receives direct technical support from our engineering team. You can reach out directly via email at abdelwahabalbarkan2018@gmail.com with your license key or questions, and we typically respond within 24 hours on business days.",
  },
];

export const CONTACT_EMAIL = "abdelwahabalbarkan2018@gmail.com";

export const FOOTER_LINKS = [
  { label: "Showcase", href: "#showcase" },
  { label: "Docs", href: "#docs" },
  { label: "License", href: "#license" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
];

