'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, PlayCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import {
  PRODUCT_NAME,
  PRODUCT_PRICE,
  VERSION_BADGE,
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
  TRUST_LINE,
} from '@/lib/constants';
import { BuyButton } from '@/components/BuyButton';
import { optimizedImage } from '@/lib/utils';
import { useDemoModal } from '@/components/DemoModalContext';

const STATS = [
  { value: '10', label: 'Responsive screens' },
  { value: '30+', label: 'Components' },
  { value: '0', label: 'Chart dependencies' },
  { value: '100%', label: 'TypeScript' },
];

const STACK = ['Next.js 14', 'React 18', 'TypeScript 5', 'Tailwind CSS', 'App Router', 'Dark & Light'];

export function Hero() {
  const { openDemoModal } = useDemoModal();
  const heroImg = optimizedImage('/theme/TODEDEV Neon Dashboard Overview.png');

  return (
    <section className="relative -mt-[4.5rem] overflow-hidden pb-16 pt-32 sm:pt-36 md:pb-24">
      {/* Background */}
      <div className="bg-grid-pattern mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[36rem] w-[64rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.28),transparent)] dark:bg-[radial-gradient(closest-side,rgba(249,115,22,0.22),transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-10rem] top-40 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.18),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Copy */}
        <div className="mx-auto flex max-w-4xl animate-fade-up flex-col items-center text-center">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            {VERSION_BADGE}
          </span>

          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-white text-balance">
            <span className="text-gradient">{PRODUCT_NAME}</span>
            <span className="mt-2 block text-[0.62em] font-bold leading-tight text-zinc-700 dark:text-zinc-300">
              {HERO_HEADLINE}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400 text-pretty">
            {HERO_SUBHEADLINE}
          </p>

          <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <BuyButton size="lg">
              <span>Buy Now — {PRODUCT_PRICE}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </BuyButton>
            <button
              type="button"
              onClick={openDemoModal}
              className="btn btn-secondary btn-lg group cursor-pointer"
            >
              <PlayCircle className="h-4 w-4 text-orange-500" />
              <span>Explore Live Demo</span>
            </button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {TRUST_LINE}
          </p>
        </div>

        {/* Product shot */}
        <div className="relative mx-auto mt-14 max-w-5xl animate-fade-up [animation-delay:150ms] sm:mt-20">
          <div
            className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2.5rem] bg-gradient-to-b from-orange-500/30 via-purple-500/10 to-transparent blur-2xl"
            aria-hidden="true"
          />
          <div className="rounded-2xl border border-zinc-200 bg-white/60 p-1.5 shadow-2xl backdrop-blur sm:rounded-3xl sm:p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-2.5 pb-2 pt-1 sm:px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="mx-auto hidden rounded-md bg-zinc-100 px-16 py-1 font-mono text-[10px] text-zinc-500 sm:block dark:bg-white/[0.05] dark:text-zinc-400">
                app.todedev.com/dashboard
              </span>
            </div>
            <button
              type="button"
              onClick={openDemoModal}
              className="group relative block w-full text-left overflow-hidden rounded-xl border border-zinc-200/80 bg-[#0D1424] sm:rounded-2xl dark:border-white/[0.06] cursor-pointer"
              aria-label="Open the live dashboard demo chooser"
            >
              <img
                src={heroImg.src}
                srcSet={heroImg.srcSet}
                sizes="(min-width: 1024px) 1000px, 100vw"
                width={1600}
                height={900}
                alt={`${PRODUCT_NAME} application dashboard interface preview`}
                fetchPriority="high"
                decoding="async"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
              />
            </button>
          </div>

          {/* Floating chips */}
          <div className="absolute -left-6 top-[62%] hidden lg:-left-14 animate-float items-center gap-3 rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 shadow-xl backdrop-blur md:flex dark:border-white/10 dark:bg-zinc-900/90">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-bold text-zinc-900 dark:text-white">Pure SVG charts</span>
              <span className="text-xs text-zinc-500">zero extra dependencies</span>
            </span>
          </div>
          <div className="absolute -right-6 top-[22%] hidden lg:-right-14 animate-float items-center gap-3 rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 shadow-xl backdrop-blur [animation-delay:1.5s] md:flex dark:border-white/10 dark:bg-zinc-900/90">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/15 text-orange-500">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-bold text-zinc-900 dark:text-white">Production-ready</span>
              <span className="text-xs text-zinc-500">10 screens included</span>
            </span>
          </div>
        </div>

        {/* Stats */}
        <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4 dark:border-white/[0.07] dark:bg-white/[0.07]">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white px-4 py-5 text-center dark:bg-zinc-950">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">{s.value}</dd>
              <dd className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{s.label}</dd>
            </div>
          ))}
        </dl>

        {/* Tech stack marquee */}
        <div className="mask-fade-x mx-auto mt-10 max-w-3xl overflow-hidden" aria-label="Built with">
          <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {[...STACK, ...STACK].map((t, i) => (
              <span
                key={i}
                aria-hidden={i >= STACK.length}
                className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-1.5 font-mono text-xs text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
