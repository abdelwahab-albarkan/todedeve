'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  BarChart2,
  CheckSquare,
  Layers,
  Activity,
  MoreVertical,
  Check,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart } from '@/components/dashboard/Charts';
import {
  OVERVIEW_METRICS,
  PROJECTS_LIST,
  ACTIVITY_FEED,
} from '@/lib/dashboard-data';

export default function DashboardOverviewPage() {
  const [selectedRange, setSelectedRange] = useState('Oct 1, 2026 – Oct 31, 2026');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup project repository', status: 'Done', color: 'green', completed: true },
    { id: 2, title: 'Design dashboard UI', status: 'In Progress', color: 'purple', completed: false },
    { id: 3, title: 'Integrate API endpoints', status: 'To Do', color: 'blue', completed: false },
    { id: 4, title: 'Run testing & fixes', status: 'To Do', color: 'blue', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'Done' : 'In Progress', color: !t.completed ? 'green' : 'purple' } : t
      )
    );
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'Done':
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'To Do':
      default:
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Welcome back, John! 👋
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1424] border border-[#1E293B] text-xs font-mono text-zinc-300 shadow-sm self-start sm:self-auto cursor-pointer hover:border-amber-500/50 transition-colors">
          <CalendarIcon className="w-4 h-4 text-amber-500" />
          <span>{selectedRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      </div>

      {/* 2. Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {OVERVIEW_METRICS.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* 3. Middle Section: Project Progress (Area Chart) + My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Progress Chart (Left 7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Project Progress</h2>
            </div>
            
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141C32] border border-[#1E293B] text-xs text-zinc-300 font-mono hover:text-white">
              <span>This Week</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>
          </div>

          <div className="pt-2">
            <AreaChart />
          </div>
        </div>

        {/* My Tasks Interactive Card (Right 5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-white">My Tasks</h2>
              </div>
              <Link
                href="/dashboard/tasks"
                className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#10172A] border border-[#151F32] hover:border-amber-500/40 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                        task.completed
                          ? 'bg-amber-500 border-amber-500 text-zinc-950'
                          : 'border-zinc-600 group-hover:border-amber-400'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${statusBadgeClass(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Section: Recent Projects + Team Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Projects Table (Left 7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Recent Projects</h2>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#1E293B] text-[11px] font-mono text-zinc-500">
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151F32]">
                {PROJECTS_LIST.slice(0, 3).map((project) => (
                  <tr key={project.id} className="hover:bg-[#141C32]/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {project.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {project.techStack}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {project.team.map((member, i) => (
                          <img
                            key={i}
                            src={member.avatar}
                            alt={member.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0D1424] object-cover"
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-28">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-zinc-300 font-bold">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#151F32] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              project.color === 'green'
                                ? 'bg-emerald-500'
                                : project.color === 'blue'
                                ? 'bg-sky-500'
                                : project.color === 'orange'
                                ? 'bg-orange-500'
                                : 'bg-purple-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${statusBadgeClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right">
                      <button className="p-1 rounded text-zinc-500 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Activity Feed (Right 5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Team Activity</h2>
            </div>
            <Link
              href="/dashboard/team"
              className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 mt-4">
            {ACTIVITY_FEED.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#10172A] transition-colors"
              >
                <div className="relative shrink-0">
                  <img
                    src={act.user.avatar}
                    alt={act.user.name}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#0D1424] ${
                      act.color === 'orange'
                        ? 'bg-orange-500'
                        : act.color === 'green'
                        ? 'bg-emerald-500'
                        : 'bg-sky-500'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-zinc-300 leading-snug">
                    <strong className="text-white font-semibold">{act.user.name}</strong>{' '}
                    {act.action}{' '}
                    <span className="text-amber-400 font-semibold">{act.target}</span>
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

