'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowUp, Mail, PlayCircle, ShieldCheck, Zap, Infinity as InfinityIcon } from 'lucide-react';
import {
  BRAND_NAME,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  PRODUCT_PRICE,
  FOOTER_LINKS,
  CONTACT_EMAIL,
  PRICING_ANCHOR,
} from '@/lib/constants';
import { BrandMark } from '@/components/Navbar';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Live Demo', href: '/dashboard' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '#docs' },
      { label: 'License', href: '#license' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
      { label: 'Buy on Gumroad', href: PRICING_ANCHOR },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard')) return null;

  const currentYear = new Date().getFullYear();
  // Keep any extra link added to FOOTER_LINKS visible
  const known = new Set(COLUMNS.flatMap((c) => c.links.map((l) => l.href)));
  const extra = FOOTER_LINKS.filter((l) => !known.has(l.href));

  return (
    <footer className="relative overflow-hidden border-t border-zinc-200 bg-zinc-50 text-sm text-zinc-600 dark:border-white/[0.06] dark:bg-[#060910] dark:text-zinc-400">
      {/* Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] max-w-[150vw] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[120px] dark:bg-orange-500/15"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* CTA band */}
        <div className="relative -mb-px mt-16 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl sm:p-12 dark:border-white/[0.08] dark:bg-zinc-900/70 dark:shadow-none">
          <div className="bg-grid-pattern mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/40 to-purple-500/30 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white text-balance">
                Ship your next dashboard <span className="text-gradient">this week</span>, not next quarter.
              </h2>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-orange-500" /> Instant download
                </li>
                <li className="flex items-center gap-1.5">
                  <InfinityIcon className="h-4 w-4 text-orange-500" /> Yours forever
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-orange-500" /> One-time payment
                </li>
              </ul>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a href={PRICING_ANCHOR} className="btn btn-primary btn-lg group">
                Get it — from {PRODUCT_PRICE}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                <PlayCircle className="h-4 w-4" />
                Live demo
              </Link>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BrandMark />
              <span className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">{BRAND_NAME}</span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{PRODUCT_NAME}</span>
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed">{PRODUCT_TAGLINE}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-orange-500/50 hover:text-orange-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:text-orange-400"
            >
              <Mail className="h-4 w-4 shrink-0 text-orange-500" />
              <span className="truncate">{CONTACT_EMAIL}</span>
            </a>
          </div>

          {COLUMNS.map((col, i) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2 lg:col-start-auto">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {(i === COLUMNS.length - 1 ? [...col.links, ...extra] : col.links).map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`group inline-flex items-center transition-colors hover:text-zinc-900 dark:hover:text-white`}
                    >
                      <span className="h-px w-0 bg-orange-500 transition-all duration-200 group-hover:mr-2 group-hover:w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Giant wordmark */}
        <div
          className="pointer-events-none select-none text-center text-[22vw] font-black leading-[0.75] tracking-tighter text-transparent lg:text-[13rem]"
          style={{
            WebkitTextStroke: '1px rgb(148 163 184 / 0.28)',
            maskImage: 'linear-gradient(to bottom, #000 30%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 30%, transparent 95%)',
          }}
          aria-hidden="true"
        >
          {BRAND_NAME}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 py-6 text-xs sm:flex-row dark:border-white/[0.06]">
          <p className="text-center sm:text-left">
            © {currentYear} {BRAND_NAME} ({PRODUCT_NAME}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Payments processed securely by Gumroad.
            </span>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-secondary h-9 w-9 shrink-0 rounded-full p-0"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
