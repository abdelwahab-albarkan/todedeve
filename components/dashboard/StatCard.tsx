'use client';

import React from 'react';
import {
  Code2,
  Users,
  CheckCircle2,
  BarChart2,
  CreditCard,
  Briefcase,
  Calendar,
  Check,
  TrendingUp,
  Clock,
  Flag,
  DollarSign,
  LucideIcon,
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color?: 'orange' | 'purple' | 'blue' | 'green' | 'pink';
  icon?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Users,
  CheckCircle2,
  BarChart2,
  CreditCard,
  Briefcase,
  Calendar,
  Check,
  TrendingUp,
  Clock,
  Flag,
  DollarSign,
};

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  color = 'orange',
  icon = 'Code2',
}: StatCardProps) {
  const IconComponent = ICON_MAP[icon] || Code2;

  const colorStyles = {
    orange: {
      border: 'border-orange-500/40 hover:border-orange-500/70',
      glow: 'shadow-glow-orange',
      iconBg: 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white',
      badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      bottomLine: 'from-orange-500/60 to-transparent',
    },
    purple: {
      border: 'border-purple-500/40 hover:border-purple-500/70',
      glow: 'shadow-glow-purple',
      iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white',
      badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      bottomLine: 'from-purple-500/60 to-transparent',
    },
    blue: {
      border: 'border-sky-500/40 hover:border-sky-500/70',
      glow: 'shadow-glow-blue',
      iconBg: 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white',
      badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      bottomLine: 'from-sky-500/60 to-transparent',
    },
    green: {
      border: 'border-emerald-500/40 hover:border-emerald-500/70',
      glow: 'shadow-glow-green',
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-green-600 text-white',
      badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      bottomLine: 'from-emerald-500/60 to-transparent',
    },
    pink: {
      border: 'border-pink-500/40 hover:border-pink-500/70',
      glow: 'shadow-glow-pink',
      iconBg: 'bg-gradient-to-tr from-pink-500 to-rose-600 text-white',
      badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      bottomLine: 'from-pink-500/60 to-transparent',
    },
  }[color];

  return (
    <div
      className={`relative p-5 rounded-2xl bg-[#0D1424] border ${colorStyles.border} ${colorStyles.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
    >
      {/* Subtle Bottom Accent Gradient Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${colorStyles.bottomLine}`}
      />

      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon container */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl ${colorStyles.iconBg} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
          >
            <IconComponent className="w-6 h-6 stroke-[2]" />
          </div>

          <div>
            <span className="text-xs font-medium text-zinc-400 block mb-0.5">
              {label}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              {value}
            </span>
          </div>
        </div>

        {/* Right: Trend badge */}
        {change && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono font-bold ${colorStyles.badge}`}
          >
            {isPositive && <span className="text-[11px]">↑</span>}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}

