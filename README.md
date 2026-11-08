# TODEDEV – Developer Dashboard UI Kit Pro

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, high-performance SaaS Admin Dashboard UI Kit & digital product landing page built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed specifically for developers, freelancers, agencies, and SaaS founders.

---

## 🚀 Features

- **Full SaaS Admin Suite:** 10 complete, responsive, functional dashboard pages.
- **Modern Dark & Light UI:** Built with `next-themes` with seamless mode switching and brand orange accents.
- **Zero-Dependency SVG Charts:** Lightweight custom charts (Revenue Area Chart, Traffic Donut Chart, Performance Bar Chart) without heavy chart library bloat.
- **Interactive UI Components:**
  - Responsive collapsible sidebar with active route detection.
  - Interactive modal dialogs (Add Project, New Task, Invite Team Member, Create Invoice, Schedule Event).
  - Search, filter, and sorting across tables and lists.
  - Kanban board with drag-and-drop task workflow.
- **High-Converting Landing Page:**
  - Interactive pricing matrix with seat selection (1–4 developers) and update terms (3, 6, 12 months).
  - Direct Gumroad modal checkout integration.
  - Interactive FAQ accordion, live showcase previews, and documentation section.

---

## 📱 Dashboard Screens (All 10 Routes)

1. **Dashboard Overview** (`/dashboard`): High-level KPI metrics, live revenue trend area chart, recent project status, and quick action shortcuts.
2. **Analytics & Performance** (`/dashboard/analytics`): Traffic sources, conversion rates, visitor trends, and browser breakdowns.
3. **Projects Management** (`/dashboard/projects`): Grid & list view of active client deliverables with progress bars, due dates, and budget tracking.
4. **Tasks & Kanban** (`/dashboard/tasks`): Multi-column Kanban board (Backlog, In Progress, Review, Done) with priority badges and member avatars.
5. **Team Management** (`/dashboard/team`): Member roster, roles, permission levels, and status indicators.
6. **Clients CRM** (`/dashboard/clients`): Client portfolio, lifetime contract values, stage pipelines, and direct contact actions.
7. **Invoices & Billing** (`/dashboard/invoices`): Financial ledger with payment status filters (Paid, Pending, Overdue) and invoice generation.
8. **Reports & Exports** (`/dashboard/reports`): Financial breakdown summaries, growth rates, and CSV/PDF export actions.
9. **Calendar & Scheduling** (`/dashboard/calendar`): Interactive monthly calendar with event scheduling and deadline tracking.
10. **Settings & Customization** (`/dashboard/settings`): Account profiles, security controls, notification preferences, and branding theme options.

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Node.js**: `18.17.0` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 2. Installation
```bash
# Clone repository
git clone https://github.com/abdelwahab-albarkan/todedeve.git
cd todedeve

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Landing Page:** `http://localhost:3000/`
- **Dashboard Overview:** `http://localhost:3000/dashboard`

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```text
├── app/
│   ├── layout.tsx                # Root layout with ThemeProvider & Gumroad script
│   ├── globals.css               # Tailwind CSS & global theme tokens
│   ├── page.tsx                  # Public marketing & pricing landing page
│   └── dashboard/                # Admin Dashboard Routes
│       ├── page.tsx              # 01 Overview
│       ├── analytics/            # 02 Analytics
│       ├── projects/             # 03 Projects
│       ├── tasks/                # 04 Tasks Kanban
│       ├── team/                 # 05 Team Directory
│       ├── clients/              # 06 Clients CRM
│       ├── invoices/             # 07 Invoices & Billing
│       ├── reports/              # 08 Financial Reports
│       ├── calendar/             # 09 Calendar & Deadlines
│       └── settings/             # 10 Settings & Customization
├── components/
│   ├── dashboard/                # Reusable dashboard components (Sidebar, Header, StatCard, Charts, Modals)
│   ├── landing/                  # Landing page sections (Hero, Showcase, Pricing, FAQ, Docs)
│   └── ui/                       # Core UI primitives
├── lib/
│   ├── dashboard-data.ts         # Centralized mock data & types
│   ├── constants.ts              # Brand metadata & Gumroad configurations
│   └── utils.ts                  # Classname merging & utility helpers
└── public/                       # High-res icons, preview banners, and mockups
```

---

## 📄 License & Commercial Rights

Commercial license provided under TODEDEV terms. See [LICENSE.md](LICENSE.md) for full terms.

**Support Contact:** [abdelwahabalbarkan2018@gmail.com](mailto:abdelwahabalbarkan2018@gmail.com)
