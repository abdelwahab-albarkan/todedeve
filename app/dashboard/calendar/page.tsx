'use client';

import React, { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MoreVertical,
  Users,
  Rocket,
  Phone,
  Code2,
  PieChart,
} from 'lucide-react';
import { CALENDAR_EVENTS, CalendarEvent } from '@/lib/dashboard-data';
import { StatCard } from '@/components/dashboard/StatCard';
import { DonutChart } from '@/components/dashboard/Charts';
import { Modal } from '@/components/dashboard/Modal';

export default function CalendarSchedulingPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS);
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDay, setEventDay] = useState(15);
  const [eventTime, setEventTime] = useState('11:00 AM - 12:00 PM');
  const [eventType, setEventType] = useState<'Meeting' | 'Review' | 'Deadline'>('Meeting');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: eventTitle,
      day: Number(eventDay),
      time: eventTime,
      type: eventType as any,
      color: eventType === 'Meeting' ? 'purple' : eventType === 'Review' ? 'orange' : 'green',
    };

    setEvents([...events, newEvent]);
    setEventTitle('');
    setIsModalOpen(false);
  };

  const calendarStatsSegments = [
    { label: 'Meetings', count: 6, percentage: 21, color: '#22C55E' },
    { label: 'Deadlines', count: 4, percentage: 14, color: '#F97316' },
    { label: 'Reviews', count: 8, percentage: 29, color: '#A855F7' },
    { label: 'Other', count: 10, percentage: 36, color: '#38BDF8' },
  ];

  // Days in October 2026 starting Thursday (Sun=28 Sep, Mon=29 Sep, Tue=30 Sep, Wed=31 Sep, Thu=1 Oct)
  const calendarCells = [
    { num: 28, isCurrentMonth: false },
    { num: 29, isCurrentMonth: false },
    { num: 30, isCurrentMonth: false },
    { num: 1, isCurrentMonth: true },
    { num: 2, isCurrentMonth: true },
    { num: 3, isCurrentMonth: true },
    { num: 4, isCurrentMonth: true },
    { num: 5, isCurrentMonth: true },
    { num: 6, isCurrentMonth: true },
    { num: 7, isCurrentMonth: true },
    { num: 8, isCurrentMonth: true },
    { num: 9, isCurrentMonth: true },
    { num: 10, isCurrentMonth: true },
    { num: 11, isCurrentMonth: true },
    { num: 12, isCurrentMonth: true },
    { num: 13, isCurrentMonth: true },
    { num: 14, isCurrentMonth: true },
    { num: 15, isCurrentMonth: true },
    { num: 16, isCurrentMonth: true },
    { num: 17, isCurrentMonth: true },
    { num: 18, isCurrentMonth: true },
    { num: 19, isCurrentMonth: true },
    { num: 20, isCurrentMonth: true },
    { num: 21, isCurrentMonth: true },
    { num: 22, isCurrentMonth: true },
    { num: 23, isCurrentMonth: true },
    { num: 24, isCurrentMonth: true },
    { num: 25, isCurrentMonth: true },
    { num: 26, isCurrentMonth: true },
    { num: 27, isCurrentMonth: true },
    { num: 28, isCurrentMonth: true },
    { num: 29, isCurrentMonth: true },
    { num: 30, isCurrentMonth: true },
    { num: 31, isCurrentMonth: true },
    { num: 1, isCurrentMonth: false },
  ];

  const getEventForDay = (day: number, isCurrent: boolean) => {
    if (!isCurrent) return [];
    return events.filter((e) => e.day === day);
  };

  const eventColorBadge = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-950/40 text-purple-300 border border-purple-500/40';
      case 'green':
        return 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40';
      case 'orange':
        return 'bg-orange-950/40 text-orange-300 border border-orange-500/40';
      case 'blue':
        return 'bg-sky-950/40 text-sky-300 border border-sky-500/40';
      case 'red':
      default:
        return 'bg-rose-950/40 text-rose-300 border border-rose-500/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-500" />
            <span>Calendar</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Plan, schedule, and track your projects, tasks, and team events.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm shadow-glow-orange transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Event</span>
        </button>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Events"
          value="28"
          change="+40%"
          color="orange"
          icon="Calendar"
        />
        <StatCard
          label="Tasks Due"
          value="12"
          change="+33%"
          color="purple"
          icon="CheckCircle2"
        />
        <StatCard
          label="Team Meetings"
          value="6"
          change="+20%"
          color="blue"
          icon="Users"
        />
        <StatCard
          label="Project Deadlines"
          value="4"
          change="+50%"
          color="green"
          icon="Flag"
        />
      </div>

      {/* 3. Main Calendar Section (7 Cols) + Right Sidebar (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Month Grid Card (7 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          
          {/* Top Controls: View Toggle + Month Navigator + Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center p-1 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs font-medium">
              {(['Month', 'Week', 'Day'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === v
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Month title & chevrons */}
            <div className="flex items-center gap-3">
              <button className="p-1 rounded bg-[#141C32] hover:bg-[#1E293B] text-zinc-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white font-mono">{currentMonth}</span>
              <button className="p-1 rounded bg-[#141C32] hover:bg-[#1E293B] text-zinc-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7 Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-bold text-zinc-400 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* 35 Calendar Cells */}
          <div className="grid grid-cols-7 gap-1.5 flex-1">
            {calendarCells.map((cell, idx) => {
              const dayEvents = getEventForDay(cell.num, cell.isCurrentMonth);
              return (
                <div
                  key={idx}
                  className={`min-h-[72px] sm:min-h-[82px] p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth
                      ? 'bg-[#10172A] border-[#1E293B] hover:border-amber-500/40'
                      : 'bg-[#0A0F1D]/50 border-transparent text-zinc-600'
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold ${
                      cell.isCurrentMonth ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {cell.num}
                  </span>

                  <div className="space-y-1">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${eventColorBadge(
                          evt.color
                        )}`}
                        title={`${evt.title} (${evt.time})`}
                      >
                        • {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Upcoming Events + Calendar Stats Donut (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Events List */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <span>Upcoming Events</span>
              </h2>
              <button className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400">
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Team Meeting', time: 'Thu, Oct 1 · 10:00 AM - 11:00 AM', icon: Users, color: 'bg-purple-500/20 text-purple-400' },
                { title: 'Project Kickoff', time: 'Mon, Oct 6 · 2:00 PM - 3:00 PM', icon: Rocket, color: 'bg-orange-500/20 text-orange-400' },
                { title: 'Client Call', time: 'Thu, Oct 9 · 4:00 PM - 4:30 PM', icon: Phone, color: 'bg-sky-500/20 text-sky-400' },
                { title: 'Release v1.2', time: 'Thu, Oct 15 · 9:00 AM', icon: Code2, color: 'bg-emerald-500/20 text-emerald-400' },
              ].map((ev, i) => {
                const Icon = ev.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#10172A] border border-[#151F32] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ev.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{ev.time}</p>
                      </div>
                    </div>
                    <button className="text-zinc-500 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Stats Donut */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-500" />
              <span>Calendar Stats</span>
            </h2>

            <DonutChart
              totalLabel="28"
              totalSublabel="Events"
              segments={calendarStatsSegments}
              size={155}
            />
          </div>

        </div>

      </div>

      {/* 4. Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Event"
        subtitle="Add a team meeting, review session, or release milestone to your calendar."
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Design Token Sync"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Day of Month (1–31)
              </label>
              <input
                type="number"
                min={1}
                max={31}
                value={eventDay}
                onChange={(e) => setEventDay(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Meeting">Meeting</option>
                <option value="Review">Review</option>
                <option value="Deadline">Deadline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Time Range
            </label>
            <input
              type="text"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="e.g. 2:00 PM - 3:00 PM"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#141C32] hover:bg-[#1E293B] text-zinc-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-zinc-950 font-bold text-xs shadow-glow-orange transition-all"
            >
              Add to Calendar
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

