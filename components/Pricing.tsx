'use client';

import React, { useState } from 'react';
import {
  Check,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  PlayCircle,
  Clock,
  Key,
} from 'lucide-react';
import {
  PRODUCT_NAME,
  PRICING_MATRIX,
  PRICING_INCLUDED_ITEMS,
  DIGITAL_SYSTEM_NAME,
  DIGITAL_SYSTEM_PLANS,
  DIGITAL_SYSTEM_INCLUDED_ITEMS,
  CHECKOUT_LINK_PROPS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useDemoModal } from '@/components/DemoModalContext';

type PeriodType = 3 | 6 | 12;
type AccountsType = 1 | 2 | 3 | 4;

export function Pricing() {
  const { openDemoModal } = useDemoModal();
  const [activeProduct, setActiveProduct] = useState<'digital-system' | 'developer-pro'>('digital-system');

  // Developer Pro state
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(12);
  const [selectedAccounts, setSelectedAccounts] = useState<AccountsType>(1);
  const [compareExpanded, setCompareExpanded] = useState<boolean>(false);

  // Digital System state (12 months = Best Value by default)
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    (DIGITAL_SYSTEM_PLANS.find((p) => p.recommended) ?? DIGITAL_SYSTEM_PLANS[0]).id
  );
  const [compareDigital, setCompareDigital] = useState<boolean>(false);
  const selectedPlan = DIGITAL_SYSTEM_PLANS.find((p) => p.id === selectedPlanId) ?? DIGITAL_SYSTEM_PLANS[0];
  // Placeholder Gumroad links are not real products yet: show a disabled button instead of a broken checkout
  const checkoutReady = /^https:\/\//.test(selectedPlan.checkoutUrl) && !selectedPlan.checkoutUrl.includes('placeholder');

  // Retrieve dynamic pricing from constants matrix
  const currentPackage = PRICING_MATRIX[selectedPeriod]?.[selectedAccounts] || PRICING_MATRIX[12][1];

  const periodOptions: { value: PeriodType; label: string; recommended?: boolean }[] = [
    { value: 3, label: 'months' },
    { value: 6, label: 'months' },
    { value: 12, label: 'months', recommended: true },
  ];

  const accountOptions: { value: AccountsType; singular: string; plural: string }[] = [
    { value: 1, singular: 'account', plural: 'account' },
    { value: 2, singular: 'accounts', plural: 'accounts' },
    { value: 3, singular: 'accounts', plural: 'accounts' },
    { value: 4, singular: 'accounts', plural: 'accounts' },
  ];

  return (
    <section id="pricing" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 h-[32rem] w-[50rem] rounded-full bg-orange-600/15 blur-[120px]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* =================================================================== */}
        {/* Section Header                                                      */}
        {/* =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="eyebrow mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Flexible Pricing · One-Time Payment
          </span>
          <h2 className="section-title">
            Simple, transparent pricing. Pay once, use forever.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">
            Choose the dashboard system that fits your project. Every plan includes full source code, permanent ownership, and instant download via Gumroad.
          </p>
        </div>

        {/* =================================================================== */}
        {/* Product Switcher Pill                                              */}
        {/* =================================================================== */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/[0.08] shadow-lg">
            <button
              type="button"
              onClick={() => setActiveProduct('digital-system')}
              className={cn(
                'flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-bold transition-all cursor-pointer',
                activeProduct === 'digital-system'
                  ? 'bg-orange-500 text-zinc-950 shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Digital Store System</span>
              <span className={cn(
                'rounded-md px-1.5 py-0.5 text-[10px] uppercase font-black tracking-wider',
                activeProduct === 'digital-system' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-orange-500/15 text-orange-400'
              )}>
                NEW · 9 Screens
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveProduct('developer-pro')}
              className={cn(
                'flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-bold transition-all cursor-pointer',
                activeProduct === 'developer-pro'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Developer Dashboard Pro</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider opacity-70">
                10 Screens
              </span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* PRODUCT A: DIGITAL STORE SYSTEM (4 CONFIRMED PLANS)                 */}
        {/* =================================================================== */}
        {activeProduct === 'digital-system' && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Lead Card */}
            <div className="mb-8 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-500 text-zinc-950 font-black shadow-lg">
                  <ShoppingBag className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    {DIGITAL_SYSTEM_NAME}
                    <span className="text-xs font-mono font-semibold text-orange-500">v1.0.0</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Includes all 9 responsive screens: Products, Orders, Customers CRM, Coupons, Analytics & Settings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openDemoModal}
                className="btn btn-secondary btn-sm shrink-0 whitespace-nowrap cursor-pointer"
              >
                <PlayCircle className="h-4 w-4 text-orange-500" />
                <span>Test Live Demo</span>
              </button>
            </div>

            {/* Interactive Pricing Card (same premium layout as Developer Dashboard Pro) */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-500/25 via-transparent to-purple-500/20 blur-2xl" aria-hidden="true" />
              <div className="rounded-3xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

                  {/* Left Column: Plan selector + features */}
                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Access period
                      </label>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-1.5 gap-y-4 sm:gap-y-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 relative">
                        {DIGITAL_SYSTEM_PLANS.map((plan) => {
                          const isSelected = selectedPlan.id === plan.id;
                          return (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setSelectedPlanId(plan.id)}
                              aria-pressed={isSelected}
                              className={`relative py-3 px-2 rounded-lg text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer ${
                                isSelected
                                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold'
                                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium'
                              }`}
                            >
                              {plan.badge && (
                                <span
                                  className={cn(
                                    'absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider whitespace-nowrap',
                                    plan.recommended ? 'bg-orange-500 text-white' : 'bg-purple-600 text-white'
                                  )}
                                >
                                  {plan.badge}
                                </span>
                              )}
                              <div className="text-lg leading-none font-extrabold">{plan.months}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                                {plan.months === 1 ? 'month' : 'months'}
                              </div>
                              <div className={cn('mt-1.5 text-xs font-bold', isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 dark:text-zinc-400')}>
                                {plan.price}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {selectedPlan.description}
                      </p>

                      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        {selectedPlan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Included in every plan */}
                    <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-white/[0.07]">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-3.5">
                        EVERY DIGITAL SYSTEM PACKAGE INCLUDES
                      </span>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        {DIGITAL_SYSTEM_INCLUDED_ITEMS.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-orange-500 shrink-0 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Package summary & buy action */}
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-zinc-50/70 dark:bg-zinc-950/40 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-white/[0.07] flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        YOUR PACKAGE
                      </span>
                      <h3 className="mt-1.5 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center gap-2">
                        {selectedPlan.name}
                        {selectedPlan.badge && (
                          <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white', selectedPlan.recommended ? 'bg-orange-500' : 'bg-purple-600')}>
                            {selectedPlan.badge}
                          </span>
                        )}
                      </h3>

                      <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                          {selectedPlan.price}
                        </span>
                        <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                          USD
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        One-time payment · <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">{selectedPlan.perMonth}</span>
                      </p>

                      <dl className="mt-8 space-y-2 text-xs border-t border-zinc-200 dark:border-white/[0.07] pt-6">
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Access period</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedPlan.period}</dd>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Screens</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">all 9 dashboards</dd>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">License key</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">issued by Gumroad</dd>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Delivery</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">instant via Gumroad</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-8 pt-4">
                      {checkoutReady ? (
                        <a href={selectedPlan.checkoutUrl} {...CHECKOUT_LINK_PROPS} className="btn btn-primary btn-lg group w-full">
                          <span>Buy now · {selectedPlan.price}</span>
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        </a>
                      ) : (
                        <button type="button" disabled className="btn btn-primary btn-lg w-full cursor-not-allowed opacity-60">
                          <Clock className="w-4 h-4" />
                          <span>Checkout coming soon · {selectedPlan.price}</span>
                        </button>
                      )}
                      <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-center">
                        {checkoutReady ? (
                          <>Opens Gumroad&apos;s secure checkout for &ldquo;{DIGITAL_SYSTEM_NAME} — {selectedPlan.period}&rdquo;. Instant ZIP download + license key.</>
                        ) : (
                          <>
                            The Gumroad checkout for this plan isn&apos;t connected yet.{' '}
                            <button type="button" onClick={openDemoModal} className="text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:opacity-80 cursor-pointer">
                              Try the live demo
                            </button>{' '}
                            in the meantime.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Accordion: Compare all 4 plans */}
                <div className="border-t border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/90">
                  <button
                    type="button"
                    onClick={() => setCompareDigital(!compareDigital)}
                    aria-expanded={compareDigital}
                    className="w-full px-6 sm:px-8 py-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer"
                  >
                    <span>Compare all 4 plans</span>
                    {compareDigital ? <Minus className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-orange-500" />}
                  </button>
                  {compareDigital && (
                    <div className="px-6 sm:px-8 pb-8 pt-2 overflow-x-auto border-t border-zinc-100 dark:border-white/[0.07]">
                      <table className="w-full min-w-[460px] text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-200 dark:border-white/[0.07] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                            <th className="py-3 pr-4 font-semibold">Access</th>
                            <th className="py-3 px-4 font-semibold">Total Price</th>
                            <th className="py-3 px-4 font-semibold">Per Month</th>
                            <th className="py-3 pl-4 text-right font-semibold">Select</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                          {DIGITAL_SYSTEM_PLANS.map((plan) => {
                            const isCurrent = selectedPlan.id === plan.id;
                            return (
                              <tr key={plan.id} className={isCurrent ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'}>
                                <td className="py-3 pr-4">
                                  {plan.period}
                                  {plan.recommended && <span className="text-orange-500 text-xs font-bold ml-1">(Best Value)</span>}
                                </td>
                                <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">{plan.price}</td>
                                <td className="py-3 px-4 text-zinc-500">{plan.perMonth}</td>
                                <td className="py-3 pl-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    className={`px-3 py-1 rounded-md text-xs font-sans transition-colors cursor-pointer ${isCurrent ? 'bg-orange-500 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                                  >
                                    {isCurrent ? 'Selected' : 'Select'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PRODUCT B: DEVELOPER DASHBOARD PRO (SEATS & PERIOD MATRIX)          */}
        {/* =================================================================== */}
        {activeProduct === 'developer-pro' && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-purple-500/20 via-transparent to-orange-500/20 blur-2xl" aria-hidden="true" />
              <div className="rounded-3xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 shadow-2xl overflow-hidden">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  
                  {/* Left Column: Configuration Controls */}
                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      {/* 1. Update Period Selector */}
                      <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          Update period
                        </label>

                        <div className="mt-3 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 relative">
                          {periodOptions.map((opt) => {
                            const isSelected = selectedPeriod === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedPeriod(opt.value)}
                                className={`relative py-3 px-2 rounded-lg text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer ${
                                  isSelected
                                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium'
                                }`}
                              >
                                {opt.recommended && (
                                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider whitespace-nowrap">
                                    Recommended
                                  </span>
                                )}
                                <div className="text-lg leading-none font-extrabold">{opt.value}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                                  {opt.label}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <p className="mt-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                          Includes every new version released within {selectedPeriod} months of your purchase date.
                        </p>
                      </div>

                      {/* 2. Developer Seats / Accounts Selector */}
                      <div className="mt-8">
                        <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          Developer seats
                        </label>

                        <div className="mt-3 grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60">
                          {accountOptions.map((opt) => {
                            const isSelected = selectedAccounts === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedAccounts(opt.value)}
                                className={`py-3 px-2 rounded-lg text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer ${
                                  isSelected
                                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium'
                                }`}
                              >
                                <div className="text-lg leading-none font-extrabold">{opt.value}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                                  {opt.value === 1 ? 'seat' : 'seats'}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <p className="mt-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                          One seat per named person who works with the source code. Designers, testers and your users need none.
                        </p>
                      </div>
                    </div>

                    {/* 3. Included Features Checklist */}
                    <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-white/[0.07]">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-3.5">
                        EVERY PACKAGE INCLUDES
                      </span>

                      <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        {PRICING_INCLUDED_ITEMS.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-orange-500 shrink-0 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Column: Dynamic Package Summary & Buy Action */}
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-zinc-50/70 dark:bg-zinc-950/40 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-white/[0.07] flex flex-col justify-between">
                    
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        YOUR PACKAGE
                      </span>

                      <h3 className="mt-1.5 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {selectedPeriod} months of updates · {selectedAccounts}{' '}
                        {selectedAccounts === 1 ? 'developer' : 'developers'}
                      </h3>

                      {/* Big Dynamic Price */}
                      <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                          {currentPackage.price}
                        </span>
                        <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                          USD
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        One-time payment. Not a subscription — you are never charged again.
                      </p>

                      {/* Key-Value Details */}
                      <dl className="mt-8 space-y-2 text-xs border-t border-zinc-200 dark:border-white/[0.07]/80 pt-6">
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Seats</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedAccounts} {selectedAccounts === 1 ? 'developer' : 'developers'}
                          </dd>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Updates</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedPeriod} months of releases
                          </dd>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">License</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">
                            permanent
                          </dd>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Delivery</dt>
                          <dd className="font-semibold text-zinc-800 dark:text-zinc-200">
                            instant via Gumroad
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Action Button & Note */}
                    <div className="mt-8 pt-4">
                      <a
                        href={currentPackage.checkoutUrl}
                        {...CHECKOUT_LINK_PROPS}
                        className="btn btn-primary btn-lg group w-full"
                      >
                        <span>Buy now · {currentPackage.price}</span>
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </a>

                      <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-center">
                        Opens Gumroad&apos;s secure checkout for &ldquo;{PRODUCT_NAME} — {selectedPeriod} Months — {selectedAccounts} {selectedAccounts === 1 ? 'Developer' : 'Developers'}&rdquo;.{' '}
                        <a
                          href={currentPackage.checkoutUrl}
                          {...CHECKOUT_LINK_PROPS}
                          className="text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:opacity-80"
                        >
                          View on Gumroad
                        </a>
                      </p>
                    </div>

                  </div>

                </div>

                {/* Bottom Accordion: Compare all 12 packages */}
                <div className="border-t border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/90">
                  <button
                    type="button"
                    onClick={() => setCompareExpanded(!compareExpanded)}
                    className="w-full px-6 sm:px-8 py-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer"
                  >
                    <span>Compare all 12 packages</span>
                    {compareExpanded ? (
                      <Minus className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-orange-500" />
                    )}
                  </button>

                  {compareExpanded && (
                    <div className="px-6 sm:px-8 pb-8 pt-2 overflow-x-auto border-t border-zinc-100 dark:border-white/[0.07]">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-200 dark:border-white/[0.07] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                            <th className="py-3 pr-4 font-semibold">Update Window</th>
                            <th className="py-3 px-4 font-semibold">Accounts / Seats</th>
                            <th className="py-3 px-4 font-semibold">Total Price</th>
                            <th className="py-3 px-4 font-semibold">Price per Account</th>
                            <th className="py-3 pl-4 text-right font-semibold">Select</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                          {[
                            { period: 3 as PeriodType, acc: 1 as AccountsType },
                            { period: 3 as PeriodType, acc: 2 as AccountsType },
                            { period: 3 as PeriodType, acc: 3 as AccountsType },
                            { period: 3 as PeriodType, acc: 4 as AccountsType },
                            { period: 6 as PeriodType, acc: 1 as AccountsType },
                            { period: 6 as PeriodType, acc: 2 as AccountsType },
                            { period: 6 as PeriodType, acc: 3 as AccountsType },
                            { period: 6 as PeriodType, acc: 4 as AccountsType },
                            { period: 12 as PeriodType, acc: 1 as AccountsType },
                            { period: 12 as PeriodType, acc: 2 as AccountsType },
                            { period: 12 as PeriodType, acc: 3 as AccountsType },
                            { period: 12 as PeriodType, acc: 4 as AccountsType },
                          ].map((item, idx) => {
                            const pkg = PRICING_MATRIX[item.period][item.acc];
                            const isCurrent = selectedPeriod === item.period && selectedAccounts === item.acc;
                            const perAcc = (pkg.priceNumber / item.acc).toFixed(2);
                            return (
                              <tr
                                key={idx}
                                className={`transition-colors ${
                                  isCurrent
                                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold'
                                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                                }`}
                              >
                                <td className="py-3 pr-4">{item.period} months</td>
                                <td className="py-3 px-4">
                                  {item.acc} {item.acc === 1 ? 'account' : 'accounts'}
                                </td>
                                <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                                  {pkg.price}
                                </td>
                                <td className="py-3 px-4 text-zinc-500">${perAcc}</td>
                                <td className="py-3 pl-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedPeriod(item.period);
                                      setSelectedAccounts(item.acc);
                                    }}
                                    className={`px-3 py-1 rounded-md text-xs font-sans transition-colors cursor-pointer ${
                                      isCurrent
                                        ? 'bg-orange-500 text-white font-bold'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }`}
                                  >
                                    {isCurrent ? 'Selected' : 'Select'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
