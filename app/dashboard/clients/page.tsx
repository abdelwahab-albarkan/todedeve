'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Briefcase,
  MessageSquare,
  FileText,
  UserPlus,
  Zap,
} from 'lucide-react';
import { CLIENTS_LIST, ClientItem } from '@/lib/dashboard-data';
import { StatCard } from '@/components/dashboard/StatCard';
import { DonutChart } from '@/components/dashboard/Charts';
import { Modal } from '@/components/dashboard/Modal';

export default function ClientsManagementPage() {
  const [clients, setClients] = useState<ClientItem[]>(CLIENTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New client fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newClient: ClientItem = {
      id: `c-${Date.now()}`,
      name: clientName,
      email: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@company.com`,
      company: clientCompany || 'Acme Corp',
      projectsCount: 1,
      status: 'Active',
      totalSpent: '$1,500',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80',
    };

    setClients([newClient, ...clients]);
    setClientName('');
    setClientEmail('');
    setClientCompany('');
    setIsModalOpen(false);
  };

  const clientSegments = [
    { label: 'Active', count: 12, percentage: 67, color: '#22C55E' },
    { label: 'In Progress', count: 4, percentage: 22, color: '#F97316' },
    { label: 'Completed', count: 2, percentage: 11, color: '#A855F7' },
  ];

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (s: string) => {
    switch (s) {
      case 'Active':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Completed':
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
            Clients
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your clients, projects, and communications in one place.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm shadow-glow-orange transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Client</span>
        </button>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Clients"
          value="18"
          change="+38%"
          color="orange"
          icon="Users"
        />
        <StatCard
          label="Active Projects"
          value="12"
          change="+20%"
          color="purple"
          icon="Briefcase"
        />
        <StatCard
          label="Completed"
          value="26"
          change="+44%"
          color="blue"
          icon="CheckCircle2"
        />
        <StatCard
          label="Total Revenue"
          value="$24,750"
          change="+31%"
          color="green"
          icon="DollarSign"
        />
      </div>

      {/* 3. Middle Section: Clients List + Right Side Column (Overview Donut + Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Clients List Table (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Clients List</span>
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
                />
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs font-mono text-zinc-300 hover:text-white">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#1E293B] text-[11px] font-mono text-zinc-500 bg-[#10172A]">
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Projects</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Total Spent</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151F32]">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#141C32]/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                        />
                        <div>
                          <span className="font-bold text-white block">{client.name}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">{client.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-zinc-300 font-medium">
                      {client.company}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-zinc-200">
                      {client.projectsCount}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${statusBadge(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {client.totalSpent}
                    </td>

                    <td className="py-3 px-2 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button className="p-1 rounded text-zinc-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded text-zinc-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Clients Overview (Donut) + Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Donut Card */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
            <h2 className="text-base font-bold text-white mb-4">Clients Overview</h2>
            <DonutChart
              totalLabel="18"
              totalSublabel="Clients"
              segments={clientSegments}
              size={155}
            />
          </div>

          {/* Quick Actions (4 clickable cards matching PNG) */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Quick Actions</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-500/60 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zinc-200">Add New Client</span>
              </button>

              <Link
                href="/dashboard/projects"
                className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30 hover:border-orange-500/60 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zinc-200">Create Project</span>
              </Link>

              <button
                onClick={() => alert('Message center: Instant messaging active in Pro Plan.')}
                className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 hover:border-sky-500/60 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zinc-200">Send Message</span>
              </button>

              <Link
                href="/dashboard/invoices"
                className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zinc-200">Create Invoice</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Add Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
        subtitle="Record contact and company details for a new client relationship."
      >
        <form onSubmit={handleAddClient} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Client Name
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              placeholder="e.g. Apex Digital Corp"
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="e.g. alex@apexdigital.com"
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
              Save Client
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

