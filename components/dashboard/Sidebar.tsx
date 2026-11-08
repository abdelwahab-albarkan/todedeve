'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  CheckSquare,
  Users,
  UserCheck,
  CreditCard,
  MessageSquare,
  Calendar,
  BarChart2,
  Settings,
  Crown,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { CURRENT_USER, PRO_PLAN_INFO } from '@/lib/dashboard-data';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home, exact: true },
    { label: 'Projects', href: '/dashboard/projects', icon: Layers, badge: 12 },
    { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare, badge: 24 },
    { label: 'Team', href: '/dashboard/team', icon: Users },
    { label: 'Clients', href: '/dashboard/clients', icon: UserCheck },
    { label: 'Invoices', href: '/dashboard/invoices', icon: CreditCard },
    { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { label: 'Reports', href: '/dashboard/reports', icon: BarChart2 },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isItemActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080C14] border-r border-[#151F32] text-zinc-300 w-64 select-none">
      
      {/* 1. Brand Logo */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-between border-b border-[#151F32]/60">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Stylized Polygon Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M12 6V20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                TODEDEV
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-500 font-semibold">
              UI Kit Pro
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. User Profile Card */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-[#151F32]/60">
        <div className="relative">
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700/60"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#080C14]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate">
            {CURRENT_USER.name}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            {CURRENT_USER.role}
          </span>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const active = isItemActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow-orange font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#10172A]/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-zinc-400 group-hover:text-amber-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-[#151F32] text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 4. Bottom Pro Plan Card */}
      <div className="p-4 m-4 rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-950/20 to-[#0D1424] shadow-glow-orange/50">
        <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-bold text-sm">
          <Crown className="w-4 h-4" />
          <span>{PRO_PLAN_INFO.planName}</span>
        </div>
        <p className="text-xs text-zinc-400 mb-3 font-medium">
          {PRO_PLAN_INFO.duration}
        </p>
        <Link
          href="/#pricing"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-[0.98]"
        >
          <span>{PRO_PLAN_INFO.buttonText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

