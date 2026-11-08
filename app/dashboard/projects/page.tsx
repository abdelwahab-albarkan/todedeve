'use client';

import React, { useState } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Star,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PROJECTS_LIST, ProjectItem } from '@/lib/dashboard-data';
import { Modal } from '@/components/dashboard/Modal';

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_LIST);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed' | 'on_hold'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject: ProjectItem = {
      id: `p-${Date.now()}`,
      title: newTitle,
      techStack: newTech || 'React · Next.js',
      description: newDesc || 'Custom developer workspace project.',
      progress: 10,
      priority: newPriority,
      status: 'In Progress',
      dueDate: 'Due: Nov 25, 2026',
      color: 'orange',
      team: [
        { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
      ],
    };

    setProjects([newProject, ...projects]);
    setNewTitle('');
    setNewTech('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'in_progress') return p.status === 'In Progress';
    if (activeFilter === 'completed') return p.status === 'Completed';
    if (activeFilter === 'on_hold') return p.status === 'On Hold';
    return true;
  });

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Low':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage, track, and organize all your projects in one place.
          </p>
        </div>

        {/* Action Button: + New Project */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm shadow-glow-orange transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* 2. Filter Bar & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold transition-colors ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'bg-[#10172A] text-zinc-400 hover:text-white'
            }`}
          >
            <span>All Projects</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold transition-colors ${
              activeFilter === 'in_progress'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'bg-[#10172A] text-zinc-400 hover:text-white'
            }`}
          >
            <span>In Progress</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
              {projects.filter((p) => p.status === 'In Progress').length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('completed')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold transition-colors ${
              activeFilter === 'completed'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'bg-[#10172A] text-zinc-400 hover:text-white'
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
              {projects.filter((p) => p.status === 'Completed').length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('on_hold')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold transition-colors ${
              activeFilter === 'on_hold'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'bg-[#10172A] text-zinc-400 hover:text-white'
            }`}
          >
            <span>On Hold</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">0</span>
          </button>
        </div>

        {/* Grid vs List View Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#10172A] border border-[#1E293B]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Projects Grid Layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] hover:border-amber-500/50 shadow-sm hover:shadow-glow-orange/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Row: Icon, Title, Priority, More */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md ${
                        project.color === 'blue'
                          ? 'bg-sky-600'
                          : project.color === 'green'
                          ? 'bg-emerald-600'
                          : project.color === 'purple'
                          ? 'bg-purple-600'
                          : project.color === 'cyan'
                          ? 'bg-cyan-600'
                          : project.color === 'orange'
                          ? 'bg-orange-600'
                          : 'bg-pink-600'
                      }`}
                    >
                      {project.title.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-mono text-zinc-400">{project.techStack}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${priorityColor(
                        project.priority
                      )}`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>{project.priority}</span>
                    </span>
                    <button className="text-zinc-500 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-6">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-white font-bold">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#151F32] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        project.color === 'green'
                          ? 'bg-emerald-500'
                          : project.color === 'blue'
                          ? 'bg-sky-500'
                          : project.color === 'purple'
                          ? 'bg-purple-500'
                          : project.color === 'cyan'
                          ? 'bg-cyan-500'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer: Team Avatars & Due Date */}
              <div className="pt-4 border-t border-[#151F32] flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden items-center">
                  {project.team.map((member, i) => (
                    <img
                      key={i}
                      src={member.avatar}
                      alt={member.name}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0D1424] object-cover"
                    />
                  ))}
                  {project.extraTeamCount && (
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#151F32] text-[10px] font-mono text-zinc-300 ring-2 ring-[#0D1424]">
                      +{project.extraTeamCount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{project.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl bg-[#0D1424] border border-[#1E293B] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1E293B] text-xs font-mono text-zinc-500 bg-[#10172A]">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F32]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[#141C32]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{p.title}</span>
                    <span className="text-xs text-zinc-400 font-mono">{p.techStack}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${priorityColor(p.priority)}`}>
                      {p.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex -space-x-1.5">
                      {p.team.map((m, i) => (
                        <img key={i} src={m.avatar} alt={m.name} className="h-6 w-6 rounded-full object-cover ring-2 ring-[#0D1424]" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">{p.progress}%</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-zinc-400">{p.dueDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Interactive New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        subtitle="Add a new client or internal development initiative to your dashboard."
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. AI SaaS Workflow"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Tech Stack
            </label>
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="e.g. Next.js 14 · Tailwind · Supabase"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief summary of the goals and deliverables..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Priority
            </label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

