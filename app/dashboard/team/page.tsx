'use client';

import React, { useState } from 'react';
import {
  Plus,
  Users,
  Crown,
  Code2,
  CheckCircle2,
  Search,
  Filter,
  Edit2,
  Trash2,
  Shield,
  Clock,
} from 'lucide-react';
import { TEAM_MEMBERS, TeamMember } from '@/lib/dashboard-data';
import { StatCard } from '@/components/dashboard/StatCard';
import { Modal } from '@/components/dashboard/Modal';

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'activity'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New member fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Developer' | 'Designer' | 'Admin'>('Developer');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role: role as any,
      projectsCount: 1,
      tasksCount: 3,
      status: 'Active',
      joinedDate: 'Oct 24, 2026',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop&q=80',
    };

    setMembers([...members, newMember]);
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Team
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your team members, roles, and permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm shadow-glow-orange transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Member</span>
        </button>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Members"
          value={members.length.toString()}
          change="+0%"
          color="orange"
          icon="Users"
        />
        <StatCard
          label="Admins"
          value="1"
          color="purple"
          icon="TrendingUp"
        />
        <StatCard
          label="Developers"
          value={(members.length - 1).toString()}
          color="blue"
          icon="Code2"
        />
        <StatCard
          label="Active Members"
          value={members.length.toString()}
          color="green"
          icon="CheckCircle2"
        />
      </div>

      {/* 3. Section Tabs */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#1E293B]">
        <button
          onClick={() => setActiveTab('members')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'members'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-white bg-[#10172A]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Members</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'roles'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-white bg-[#10172A]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Roles & Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'activity'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-white bg-[#10172A]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Activity Log</span>
        </button>
      </div>

      {/* 4. Main Members Table Card */}
      <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm space-y-4">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Team Members</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 w-48 sm:w-64"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs font-mono text-zinc-300 hover:text-white">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1E293B] text-[11px] font-mono text-zinc-500 bg-[#10172A]">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Tasks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F32]">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#141C32]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0D1424]" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{m.name}</span>
                        <span className="text-xs text-zinc-400 font-mono">{m.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {m.role === 'Admin' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Crown className="w-3 h-3 fill-amber-500" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        <Code2 className="w-3 h-3" />
                        <span>{m.role}</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-200">
                    {m.projectsCount}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-200">
                    {m.tasksCount}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono text-zinc-400">
                    {m.joinedDate}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="p-1.5 rounded-lg bg-[#141C32] hover:bg-[#1E293B] text-zinc-400 hover:text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Team Member"
        subtitle="Invite a developer or designer to collaborate on your projects."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@todedev.com"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Assign Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Admin">Admin</option>
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
              Invite Member
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

