'use client';

import React, { useState } from 'react';
import {
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
  BarChart2,
  PieChart,
  Trophy,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart, DonutChart, ProductivityBarChart } from '@/components/dashboard/Charts';

export default function ReportsAndAnalyticsPage() {
  const [activeReportTab, setActiveReportTab] = useState<'Overview' | 'Projects' | 'Team' | 'Clients' | 'Revenue'>('Overview');

  const reportMetrics = [
    { label: 'Total Projects', value: '48', change: '+32%', color: 'orange' as const, icon: 'Layers' },
    { label: 'Total Revenue', value: '$86,420', change: '+47%', color: 'purple' as const, icon: 'DollarSign' },
    { label: 'Completed', value: '36', change: '+38%', color: 'blue' as const, icon: 'CheckCircle2' },
    { label: 'Active Clients', value: '18', change: '+20%', color: 'green' as const, icon: 'Users' },
  ];

  const projectsStatusSegments = [
    { label: 'Completed', count: 36, percentage: 75, color: '#22C55E' },
    { label: 'In Progress', count: 7, percentage: 15, color: '#F97316' },
    { label: 'On Hold', count: 2, percentage: 4, color: '#A855F7' },
    { label: 'Cancelled', count: 3, percentage: 6, color: '#38BDF8' },
  ];

  const revenueTrendData = [
    { label: 'Apr', value: 28, displayValue: '$28K' },
    { label: 'May', value: 45, displayValue: '$45K' },
    { label: 'Jun', value: 40, displayValue: '$40K' },
    { label: 'Jul', value: 58, displayValue: '$58K' },
    { label: 'Aug', value: 70, displayValue: '$70K' },
    { label: 'Sep', value: 76, displayValue: '$76K' },
    { label: 'Oct', value: 86.4, displayValue: '$86.4K' },
  ];

  const topProjects = [
    { name: 'E-Commerce Platform', progress: 100, revenue: '$24,500', color: 'bg-emerald-500' },
    { name: 'Mobile Application', progress: 95, revenue: '$18,200', color: 'bg-emerald-500' },
    { name: 'Admin Dashboard', progress: 85, revenue: '$12,800', color: 'bg-purple-500' },
    { name: 'Landing Page', progress: 80, revenue: '$7,500', color: 'bg-sky-500' },
    { name: 'API Integration', progress: 75, revenue: '$6,900', color: 'bg-orange-500' },
  ];

  const teamProductivity = [
    { name: 'John', percentage: 92, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80', color: 'linear-gradient(to top, #ea580c, #f97316)' },
    { name: 'Sarah', percentage: 88, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80', color: 'linear-gradient(to top, #7c3aed, #a855f7)' },
    { name: 'Ahmed', percentage: 76, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80', color: 'linear-gradient(to top, #0284c7, #38bdf8)' },
    { name: 'Youssef', percentage: 84, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80', color: 'linear-gradient(to top, #16a34a, #22c55e)' },
    { name: 'Sophia', percentage: 79, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80', color: 'linear-gradient(to top, #db2777, #ec4899)' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Track performance, revenue, and project progress with detailed insights.
          </p>
        </div>

        {/* Date dropdown + Export Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E293B] text-xs font-mono text-zinc-300 hover:text-white">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => alert('Exporting comprehensive PDF & CSV report summary...')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141C32] hover:bg-[#1E293B] border border-[#1E293B] text-zinc-200 text-xs font-mono font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Category Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B] overflow-x-auto">
        {(['Overview', 'Projects', 'Team', 'Clients', 'Revenue'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveReportTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeReportTab === tab
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white bg-[#10172A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {reportMetrics.map((m, idx) => (
          <StatCard
            key={idx}
            label={m.label}
            value={m.value}
            change={m.change}
            color={m.color}
            icon={m.icon}
          />
        ))}
      </div>

      {/* 4. Middle Section: Revenue Trend (Area Chart) + Projects by Status (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Revenue Trend */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-500" />
              <span>Revenue Trend</span>
            </h2>

            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141C32] border border-[#1E293B] text-xs font-mono text-zinc-300">
              <span>Monthly</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          <div className="pt-2">
            <AreaChart
              data={revenueTrendData}
              yMax={100}
              yAxisLabels={['100K', '80K', '60K', '40K', '20K', '0']}
              unit="K"
            />
          </div>
        </div>

        {/* Right: Projects by Status Donut */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            <span>Projects by Status</span>
          </h2>

          <DonutChart
            totalLabel="48"
            totalSublabel="Projects"
            segments={projectsStatusSegments}
            size={170}
          />
        </div>

      </div>

      {/* 5. Bottom Section: Top Performing Projects + Team Productivity Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Performing Projects (Left 6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Top Performing Projects</span>
            </h2>

            <button className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {topProjects.map((p, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{p.name}</span>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-zinc-400">{p.progress}%</span>
                    <span className="text-amber-400 font-bold w-16 text-right">{p.revenue}</span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-[#151F32] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Productivity Bar Chart (Right 6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <span>Team Productivity</span>
            </h2>

            <button className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <ProductivityBarChart data={teamProductivity} />
        </div>

      </div>

    </div>
  );
}

