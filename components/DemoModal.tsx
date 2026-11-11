'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Tag,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B12] p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] text-white animate-in zoom-in-95 duration-200"
      >
        {/* Glow accents */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-orange-600/20 blur-[90px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-600/20 blur-[90px]" aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-400 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Live Demo Chooser
          </span>
          <h2 id="demo-modal-title" className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white text-balance">
            Which Live Demo do you want to explore?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-400 text-pretty">
            Choose between the new Digital Products & Store System or the Agency & Developer Dashboard:
          </p>
        </div>

        {/* Two Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* OPTION 1: Digital Store System (NEW) */}
          <Link
            href="/demo/digital-system"
            onClick={onClose}
            className="group relative flex flex-col justify-between rounded-2xl border-2 border-orange-500/40 bg-gradient-to-b from-[#14141F] to-[#0D0D14] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:shadow-[0_15px_40px_-10px_rgba(249,115,22,0.35)]"
          >
            {/* Recommended / New Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-black">
                ✨ NEW SYSTEM
              </span>
              <span className="font-mono text-xs font-semibold text-orange-400">
                9 Screens
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    Digital Store System
                  </h3>
                  <span className="text-xs text-neutral-400">
                    SaaS & Digital Downloads Admin
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                Full-featured ecommerce dashboard for selling digital products, software licenses, coupons, and tracking revenue analytics.
              </p>

              {/* Highlights Checklist */}
              <ul className="space-y-2 text-xs text-neutral-300 border-t border-white/[0.08] pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span><strong>Products:</strong> Cover tones, categories, license keys</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span><strong>Coupons:</strong> Promo codes & automatic discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span><strong>Customers:</strong> CRM, LTV tracking & order history</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span><strong>Analytics:</strong> Pure SVG area chart & traffic donut</span>
                </li>
              </ul>
            </div>

            {/* Launch CTA */}
            <div className="pt-2">
              <span className="flex items-center justify-center gap-2 w-full rounded-xl bg-orange-500 py-3 px-4 text-sm font-bold text-zinc-950 transition-all group-hover:bg-orange-400 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.6)]">
                <span>Explore Digital System (9 Pages)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* OPTION 2: Developer Dashboard (PRO) */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className="group relative flex flex-col justify-between rounded-2xl border-2 border-purple-500/30 bg-gradient-to-b from-[#14141F] to-[#0D0D14] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.3)]"
          >
            {/* Pro Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/20 border border-purple-500/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-300">
                ⚡ DEVELOPER SUITE
              </span>
              <span className="font-mono text-xs font-semibold text-purple-400">
                10 Screens
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-black transition-colors">
                  <LayoutDashboard className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Developer Dashboard Pro
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Agency, Projects & Team Workspace
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                SaaS admin dashboard for developer teams, agency workflows, project deliverables, Kanban boards, and client billing.
              </p>

              {/* Highlights Checklist */}
              <ul className="space-y-2 text-xs text-neutral-300 border-t border-white/[0.08] pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span><strong>Projects:</strong> Deliverables, timelines & budgets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span><strong>Tasks:</strong> 4-column drag & drop Kanban board</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span><strong>Team:</strong> Member roles, seats & invites</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span><strong>Invoices:</strong> Financial ledger & PDF exports</span>
                </li>
              </ul>
            </div>

            {/* Launch CTA */}
            <div className="pt-2">
              <span className="flex items-center justify-center gap-2 w-full rounded-xl border border-purple-500/40 bg-purple-500/10 py-3 px-4 text-sm font-bold text-purple-300 transition-all group-hover:bg-purple-500 group-hover:text-black">
                <span>Explore Developer Dashboard (10 Pages)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2 text-neutral-400">
            <Zap className="h-4 w-4 text-orange-400" />
            <span>Both live demos are 100% functional with client-side interactive state.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
}

