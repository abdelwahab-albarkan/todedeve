'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  BookOpen,
  Code2,
  Copy,
  Check,
  Cpu,
  Layers,
  Palette,
  Layout,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  Mail,
  ExternalLink,
  ChevronRight,
  FolderGit2,
  Smartphone,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { PRODUCT_NAME, CONTACT_EMAIL, BRAND_NAME } from '@/lib/constants';

export function Docs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navItems = [
    { id: 'requirements', label: '01 Requirements' },
    { id: 'install', label: '02 Installation & Quickstart' },
    { id: 'screens', label: '03 10 Dashboard Screens' },
    { id: 'architecture', label: '04 Component Architecture' },
    { id: 'theming', label: '05 Theming & Color Tokens' },
    { id: 'license-summary', label: '06 Commercial License' },
    { id: 'updates', label: '07 Updates & Technical Support' },
  ];

  const screens = [
    { id: 'overview', name: 'Dashboard Overview', route: '/dashboard', desc: '4 KPI metric cards, Project Progress area chart, interactive task checklist, and activity stream.' },
    { id: 'analytics', name: 'Dashboard Analytics', route: '/dashboard/analytics', desc: 'Tasks overview area chart, Donut chart of task statuses, and vertical timeline events.' },
    { id: 'projects', name: 'Projects Management', route: '/dashboard/projects', desc: 'Grid/List switchable cards with tech badges, progress meters, team avatars, and New Project modal.' },
    { id: 'tasks', name: 'Tasks Management (Kanban)', route: '/dashboard/tasks', desc: '4-column Kanban board (To Do, In Progress, Review, Completed) plus comprehensive data table.' },
    { id: 'team', name: 'Team Management', route: '/dashboard/team', desc: 'Member roster, roles (Admin/Developer), permissions, active status indicators, and invite modal.' },
    { id: 'clients', name: 'Clients Management', route: '/dashboard/clients', desc: 'CRM client directory, total spend tracking, Clients Overview donut, and 4 quick action triggers.' },
    { id: 'invoices', name: 'Invoices Management', route: '/dashboard/invoices', desc: 'Revenue overview chart, invoice status donut, full invoice table with status badges and PDF export.' },
    { id: 'reports', name: 'Reports & Analytics', route: '/dashboard/reports', desc: 'Revenue trend chart, Top Performing projects, and Team Productivity vertical bar chart.' },
    { id: 'calendar', name: 'Calendar & Scheduling', route: '/dashboard/calendar', desc: 'Full 7x5 interactive calendar grid, upcoming events feed, and schedule stats.' },
    { id: 'settings', name: 'Settings & Customization', route: '/dashboard/settings', desc: 'General workspace settings, Dark/Light appearance swatches, brand color picker, and 2FA.' },
  ];

  const quickstartCode = `# 1. Extract your purchased TODEDEV package
unzip todedev-dashboard-pro.zip
cd todedev-dashboard-pro

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev

# Ready on http://localhost:3000`;

  const componentImportSnippet = `import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart, DonutChart } from '@/components/dashboard/Charts';
import { Modal } from '@/components/dashboard/Modal';

export default function MyCustomPage() {
  return (
    <div className="space-y-6">
      <StatCard
        label="Monthly Revenue"
        value="$86,420"
        change="+47%"
        color="orange"
        icon="DollarSign"
      />
      <AreaChart data={myRevenueData} />
    </div>
  );
}`;

  return (
    <section id="docs" className="relative py-20 sm:py-28 border-y border-zinc-200/70 dark:border-white/[0.05] bg-zinc-50/70 dark:bg-[#0A0F1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Documentation · v1.0.0</span>
          </div>
          <h2 className="section-title !mt-0">
            Developer-first architecture. Ready to ship.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Everything in <strong className="text-zinc-900 dark:text-white">{PRODUCT_NAME}</strong> is written in clean, modern <strong>Next.js 14 (App Router)</strong>, <strong>React 18</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>. No bloated dependencies, no mystery spaghetti code.
          </p>

          {/* Quick On This Page Anchor Navigation */}
          <div className="mt-8 p-4 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] shadow-sm">
            <span className="text-xs uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block mb-3">
              On this page
            </span>
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-[#141C32] dark:hover:bg-[#1E293B] text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 01: Requirements */}
        <div id="requirements" className="pt-10 mb-16 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">01</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Requirements & Compatibility
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-zinc-900 dark:text-zinc-100 font-semibold">
                <Cpu className="w-5 h-5 text-orange-500" />
                <span>Next.js & React Framework</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Next.js 14.2+ (App Router)</strong> with React 18 and TypeScript 5.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Compatible with standard Node.js runtimes (Node 18.17+, 20+, 22+).</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-zinc-900 dark:text-zinc-100 font-semibold">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Styling & Dependencies</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tailwind CSS 3.4+</strong> with custom neon dark theme tokens and responsive layouts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero heavy chart dependencies:</strong> Charts are built with pure, high-performance SVG vectors.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 02: Installation */}
        <div id="install" className="pt-10 mb-16 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">02</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Installation & Quickstart
            </h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-900 text-zinc-100 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <span>Terminal Setup</span>
              <button
                onClick={() => handleCopy(quickstartCode, 'quickstart')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
              >
                {copiedCode === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'quickstart' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{quickstartCode}</code>
            </pre>
          </div>
        </div>

        {/* 03: 10 Screens Registry */}
        <div id="screens" className="pt-10 mb-16 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">03</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              10 Fully Implemented Screens Registry
            </h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-[#10172A] font-mono text-zinc-500">
                    <th className="py-3 px-4 font-semibold">Screen</th>
                    <th className="py-3 px-4 font-semibold">App Route</th>
                    <th className="py-3 px-4 font-semibold">Features & UI Components</th>
                    <th className="py-3 px-4 font-semibold text-right">Demo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-[#151F32]">
                  {screens.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-[#141C32]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-white">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-orange-600 dark:text-orange-400 font-semibold">
                        {s.route}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                        {s.desc}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={s.route}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 04: Component Architecture */}
        <div id="architecture" className="pt-10 mb-16 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">04</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Reusable Component Architecture
            </h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-900 text-zinc-100 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <span>Component Usage Example</span>
              <button
                onClick={() => handleCopy(componentImportSnippet, 'comp')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
              >
                {copiedCode === 'comp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'comp' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{componentImportSnippet}</code>
            </pre>
          </div>
        </div>

        {/* 05: Theming */}
        <div id="theming" className="pt-10 mb-16 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">05</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Theming & Color Tokens
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424]">
              <span className="text-xs font-mono font-bold text-orange-500 block mb-2">Primary Brand</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                <strong>Electric Orange</strong> (<code className="font-mono text-[11px]">#F97316</code>) used for active capsules, primary CTAs, and glowing focal points.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424]">
              <span className="text-xs font-mono font-bold text-purple-400 block mb-2">Cyber Purple</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                <strong>Neon Purple</strong> (<code className="font-mono text-[11px]">#A855F7</code>) for developer metrics, project cards, and admin badges.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424]">
              <span className="text-xs font-mono font-bold text-sky-400 block mb-2">Cyber Sky Blue</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                <strong>Sky Blue</strong> (<code className="font-mono text-[11px]">#38BDF8</code>) for task boards, meetings, reviews, and client messaging.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424]">
              <span className="text-xs font-mono font-bold text-emerald-400 block mb-2">Emerald Green</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                <strong>Vibrant Emerald</strong> (<code className="font-mono text-[11px]">#22C55E</code>) for financial revenue, completed status, and success toasts.
              </p>
            </div>
          </div>
        </div>

        {/* 06: Commercial License */}
        <div id="license-summary" className="pt-10 mb-16 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">06</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Commercial License Summary
            </h3>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] shadow-sm">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              Your Gumroad purchase includes permanent ownership of every version you receive. Use in unlimited commercial end products, client work, SaaS web apps, and agency deliverables. Covers 1–4 named developer seats.
            </p>
            <a
              href="#license"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400"
            >
              <span>Read complete 10-section legal terms</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 07: Updates & Support */}
        <div id="updates" className="pt-10 scroll-mt-24 border-t border-zinc-200/60 dark:border-white/[0.07]/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">07</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Updates & Direct Technical Support
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
                <RefreshCw className="w-4 h-4 text-orange-500" />
                <span>Eligibility Window</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Receive new component drops and feature releases throughout your chosen 3, 6, or 12-month update window via your Gumroad library.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0D1424] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>Direct Engineering Support</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Reach out directly with your Gumroad license key for questions, seat upgrades, or integration assistance:
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold hover:bg-orange-500/20 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
