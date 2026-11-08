'use client';

import React, { useState } from 'react';
import {
  Plus,
  Kanban,
  List,
  Calendar as CalendarIcon,
  Clock,
  Play,
  Eye,
  CheckCircle2,
  MoreVertical,
  Flame,
  Star,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TASKS_LIST, TaskItem } from '@/lib/dashboard-data';
import { Modal } from '@/components/dashboard/Modal';

export default function TasksManagementPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(TASKS_LIST);
  const [activeView, setActiveView] = useState<'Board' | 'List' | 'Calendar' | 'Timeline'>('Board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<'To Do' | 'In Progress' | 'Review' | 'Completed'>('To Do');

  // New task form fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState('Mobile App');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: taskTitle,
      project: taskProject,
      category: 'Development',
      dueDate: 'Nov 05',
      priority: taskPriority,
      status: selectedColumn,
      assignee: {
        name: 'John Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80',
      },
      completed: selectedColumn === 'Completed',
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setIsModalOpen(false);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'Completed' : 'In Progress',
          };
        }
        return t;
      })
    );
  };

  const columns = [
    {
      id: 'To Do',
      title: 'To Do',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      icon: Play,
      items: tasks.filter((t) => t.status === 'To Do'),
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
      icon: Play,
      items: tasks.filter((t) => t.status === 'In Progress'),
    },
    {
      id: 'Review',
      title: 'Review',
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
      icon: Eye,
      items: tasks.filter((t) => t.status === 'Review'),
    },
    {
      id: 'Completed',
      title: 'Completed',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      icon: CheckCircle2,
      items: tasks.filter((t) => t.status === 'Completed'),
    },
  ];

  const priorityBadge = (p: string) => {
    switch (p) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 font-mono text-[11px] font-bold">
            <Flame className="w-3 h-3 fill-rose-500" />
            <span>High</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[11px] font-bold">
            <Star className="w-3 h-3 fill-amber-500" />
            <span>Medium</span>
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-bold">
            <Star className="w-3 h-3 fill-emerald-500" />
            <span>Low</span>
          </span>
        );
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Review':
        return 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
      case 'To Do':
      default:
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tasks
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Organize, track, and manage your team&apos;s work.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedColumn('To Do');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm shadow-glow-orange transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* 2. Controls: Views (Board/List/Calendar/Timeline) & Dropdowns */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        {/* View tabs */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs font-medium self-start">
          {(['Board', 'List', 'Calendar', 'Timeline'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeView === v
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-zinc-300 hover:text-white">
            <span>All Projects</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-zinc-300 hover:text-white">
            <span>All Members</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-zinc-300 hover:text-white">
            <span>Priority</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 3. 4 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E293B] flex flex-col justify-between min-h-[460px]"
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#151F32]">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${col.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-white">{col.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#151F32] text-[11px] font-mono font-bold text-zinc-400">
                      {col.items.length}
                    </span>
                  </div>
                  <button className="text-zinc-500 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Cards Stack */}
                <div className="space-y-3">
                  {col.items.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#10172A] border border-[#1E293B] hover:border-amber-500/40 shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            task.completed
                              ? 'bg-amber-500 border-amber-500 text-zinc-950'
                              : 'border-zinc-600 group-hover:border-amber-400'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <h4
                          className={`text-xs sm:text-sm font-medium leading-snug ${
                            task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                          }`}
                        >
                          {task.title}
                        </h4>
                      </div>

                      {/* Tags & Assignee */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#151F32]/60">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#151F32] text-zinc-300">
                            {task.category}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                            <CalendarIcon className="w-3 h-3 text-zinc-500" />
                            <span>{task.dueDate}</span>
                          </span>
                        </div>

                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Task Quick Trigger */}
              <button
                onClick={() => {
                  setSelectedColumn(col.id as any);
                  setIsModalOpen(true);
                }}
                className="mt-4 w-full py-2 rounded-xl border border-dashed border-[#1E293B] hover:border-amber-500/60 text-zinc-400 hover:text-amber-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom: All Tasks Data Table */}
      <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>All Tasks</span>
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>1–{tasks.length} of {tasks.length}</span>
            <div className="inline-flex items-center gap-1">
              <button className="p-1 rounded bg-[#10172A] hover:bg-[#1E293B] disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded bg-[#10172A] hover:bg-[#1E293B]">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1E293B] text-[11px] font-mono text-zinc-500 bg-[#10172A]">
                <th className="py-2.5 px-3 w-8">
                  <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700" />
                </th>
                <th className="py-2.5 px-3">Task</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Assignee</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F32]">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#141C32]/50 transition-colors">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="rounded bg-zinc-800 border-zinc-700"
                    />
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    <span className={task.completed ? 'line-through text-zinc-500' : ''}>
                      {task.title}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-zinc-300">
                    {task.project}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs text-zinc-300">{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">{priorityBadge(task.priority)}</td>
                  <td className="py-3 px-3 font-mono text-xs text-zinc-400">
                    {task.dueDate}, 2026
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${statusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
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

      {/* 5. Interactive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        subtitle={`Adding to column: ${selectedColumn}`}
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement webhook authentication"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Associated Project
            </label>
            <select
              value={taskProject}
              onChange={(e) => setTaskProject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Mobile App">Mobile App</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Admin Dashboard">Admin Dashboard</option>
              <option value="Landing Page">Landing Page</option>
              <option value="UI Design System">UI Design System</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Priority
            </label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
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
              Create Task
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

