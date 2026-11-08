'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  BarChart2,
  PieChart,
  Zap,
  Layers,
  CheckCircle2,
  FolderPlus,
  UploadCloud,
  MoreVertical,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart, DonutChart } from '@/components/dashboard/Charts';
import { PROJECTS_LIST } from '@/lib/dashboard-data';

export default function DashboardAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Projects' | 'Team'>('Tasks');

  const taskSegments = [
    { label: 'Completed', count: 12, percentage: 50, color: '#22C55E' },
    { label: 'In Progress', count: 6, percentage: 25, color: '#F97316' },
    { label: 'To Do', count: 4, percentage: 17, color: '#A855F7' },
    { label: 'Blocked', count: 2, percentage: 8, color: '#38BDF8' },
  ];

  const tasksData = [
    { label: 'Mon', value: 5, displayValue: '5 tasks' },
    { label: 'Tue', value: 12, displayValue: '12 tasks' },
    { label: 'Wed', value: 10, displayValue: '10 tasks' },
    { label: 'Thu', value: 16, displayValue: '16 tasks' },
    { label: 'Fri', value: 19, displayValue: '19 tasks' },
    { label: 'Sat', value: 17, displayValue: '17 tasks' },
    { label: 'Sun', value: 24, displayValue: '24 tasks' },
  ];

  const timelineEvents = [
    {
      id: 1,
      title: 'New project created',
      desc: 'Mobile App Development',
      time: '5 min ago',
      icon: FolderPlus,
      color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      dot: 'bg-purple-500',
    },
    {
      id: 2,
      title: 'Task completed',
      desc: 'Design dashboard UI',
      time: '20 min ago',
      icon: CheckCircle2,
      color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    {
      id: 3,
      title: 'Files updated',
      desc: '• assets/v2.0.zip',
      time: '45 min ago',
      icon: UploadCloud,
      color: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      dot: 'bg-sky-500',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, John! 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Here is what&apos;s happening with your projects today.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1424] border border-[#1E293B] text-xs font-mono text-zinc-300 shadow-sm self-start sm:self-auto cursor-pointer hover:border-amber-500/50 transition-colors">
          <CalendarIcon className="w-4 h-4 text-amber-500" />
          <span>Oct 1, 2026 – Oct 31, 2026</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      </div>

      {/* 2. Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Projects"
          value="12"
          change="+33%"
          color="orange"
          icon="Code2"
        />
        <StatCard
          label="Team Members"
          value="4"
          change="+0%"
          color="purple"
          icon="Users"
        />
        <StatCard
          label="Total Tasks"
          value="24"
          change="+20%"
          color="blue"
          icon="CheckCircle2"
        />
        <StatCard
          label="Completion Rate"
          value="76%"
          change="+12%"
          color="green"
          icon="BarChart2"
        />
      </div>

      {/* 3. Middle: Tasks Overview + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Tasks Overview Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Tasks Overview</h2>
            </div>

            {/* Segmented control tabs */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#141C32] border border-[#1E293B] text-xs font-medium">
              {(['Tasks', 'Projects', 'Team'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <AreaChart
              data={tasksData}
              yMax={25}
              yAxisLabels={['25', '20', '15', '10', '5', '0']}
              unit=" tasks"
            />
          </div>
        </div>

        {/* Right: Tasks by Status Donut */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-white">Tasks by Status</h2>
          </div>

          <div className="py-2">
            <DonutChart
              totalLabel="24"
              totalSublabel="Tasks"
              segments={taskSegments}
              size={170}
            />
          </div>
        </div>

      </div>

      {/* 4. Bottom: Recent Activity Timeline + Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Timeline (Left 6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Recent Activity</h2>
            </div>
            <button className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400">
              View All
            </button>
          </div>

          {/* Connected Timeline list */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E293B]">
            {timelineEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div key={evt.id} className="relative flex items-start gap-4">
                  {/* Dot on line */}
                  <span
                    className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-[#0D1424] ${evt.dot}`}
                  />

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${evt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{evt.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">{evt.desc}</p>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">
                    {evt.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Projects List (Right 6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Recent Projects</h2>
            </div>
            <button className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {PROJECTS_LIST.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#10172A] border border-[#151F32] hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs ${
                      p.color === 'blue'
                        ? 'bg-sky-600'
                        : p.color === 'green'
                        ? 'bg-emerald-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    {p.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    <p className="text-[11px] font-mono text-zinc-400">{p.techStack}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 hidden sm:block">
                    <div className="text-[10px] font-mono text-right text-zinc-300 font-bold mb-1">
                      {p.progress}%
                    </div>
                    <div className="h-1.5 rounded-full bg-[#151F32] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {p.status}
                  </span>

                  <button className="p-1 rounded text-zinc-500 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

