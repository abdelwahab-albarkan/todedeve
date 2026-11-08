'use client';

import React, { useState } from 'react';
import { Check, ArrowUpRight, Plus, Minus } from 'lucide-react';
import {
  PRODUCT_NAME,
  GUMROAD_URL,
  PRICING_MATRIX,
  PRICING_INCLUDED_ITEMS,
} from '@/lib/constants';

type PeriodType = 3 | 6 | 12;
type AccountsType = 1 | 2 | 3 | 4;

export function Pricing() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(12);
  const [selectedAccounts, setSelectedAccounts] = useState<AccountsType>(1);
  const [compareExpanded, setCompareExpanded] = useState<boolean>(false);

  // Retrieve dynamic pricing from constants matrix
  const currentPackage = PRICING_MATRIX[selectedPeriod]?.[selectedAccounts] || {
    price: '$79.99',
    priceNumber: 79.99,
  };

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
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* =================================================================== */}
        {/* Section Header                                                      */}
        {/* =================================================================== */}
        <div className="mb-12">
          <span className="eyebrow mb-4">Pricing · One-time payment</span>
          <h2 className="section-title">
            Pick your seats and update period.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Same kit, same files in every package. You choose how many developers may use the source and how long new versions are included. You pay once.
          </p>
        </div>

        {/* =================================================================== */}
        {/* Interactive Pricing Card                                            */}
        {/* =================================================================== */}
        <div className="relative">
        <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-500/25 via-transparent to-purple-500/20 blur-2xl" aria-hidden="true" />
        <div className="rounded-3xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/80 shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* --------------------------------------------------------------- */}
            {/* Left Column: Configuration Controls                             */}
            {/* --------------------------------------------------------------- */}
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
                          className={`relative py-3 px-2 rounded-lg text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
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
                          className={`py-3 px-2 rounded-lg text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
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

            {/* --------------------------------------------------------------- */}
            {/* Right Column: Dynamic Package Summary & Buy Action              */}
            {/* --------------------------------------------------------------- */}
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
                  href={GUMROAD_URL}
                  className="gumroad-button btn btn-primary btn-lg group w-full"
                >
                  <span>Buy now · {currentPackage.price}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-center">
                  Opens Gumroad&apos;s secure checkout for &ldquo;{PRODUCT_NAME} — {selectedPeriod} Months — {selectedAccounts} {selectedAccounts === 1 ? 'Developer' : 'Developers'}&rdquo;. Gumroad processes the payment and delivers the files.{' '}
                  <a
                    href={GUMROAD_URL}
                    className="text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:opacity-80"
                  >
                    View on Gumroad
                  </a>
                </p>
              </div>

            </div>

          </div>

          {/* ================================================================= */}
          {/* Bottom Accordion: Compare all 12 packages                         */}
          {/* ================================================================= */}
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
                    ].map(({ period, acc }) => {
                      const item = PRICING_MATRIX[period][acc];
                      const isCurrent = selectedPeriod === period && selectedAccounts === acc;
                      const perAccount = (item.priceNumber / acc).toFixed(2);

                      return (
                        <tr
                          key={`${period}-${acc}`}
                          className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors ${
                            isCurrent ? 'bg-orange-500/10 font-bold text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          <td className="py-3 pr-4 font-sans font-medium">
                            {period} Months {period === 12 && <span className="text-orange-500 text-xs font-mono font-bold ml-1">(Best Value)</span>}
                          </td>
                          <td className="py-3 px-4 font-sans">
                            {acc} {acc === 1 ? 'Developer' : 'Developers'}
                          </td>
                          <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 font-bold">
                            {item.price}
                          </td>
                          <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                            ${perAccount} / seat
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPeriod(period);
                                setSelectedAccounts(acc);
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-sans transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-orange-500 text-white font-bold'
                                  : 'border border-zinc-300 dark:border-zinc-700 hover:border-orange-500'
                              }`}
                            >
                              {isCurrent ? 'Active' : 'Choose'}
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
    </section>
  );
}
