'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { INVOICES_LIST, InvoiceItem } from '@/lib/dashboard-data';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart, DonutChart } from '@/components/dashboard/Charts';
import { Modal } from '@/components/dashboard/Modal';

export default function InvoicesManagementPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INVOICES_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New invoice state
  const [clientName, setClientName] = useState('Michael Brown');
  const [projectName, setProjectName] = useState('Mobile App');
  const [amount, setAmount] = useState('4,500');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-00${43 + invoices.length}`,
      client: {
        name: clientName,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80',
      },
      project: projectName,
      amount: `$${amount}`,
      status: 'Pending',
      issueDate: 'Oct 24, 2026',
      dueDate: 'Oct 31, 2026',
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
  };

  const invoiceSegments = [
    { label: 'Paid', count: 28, percentage: 67, color: '#22C55E' },
    { label: 'Pending', count: 8, percentage: 19, color: '#F97316' },
    { label: 'Overdue', count: 4, percentage: 10, color: '#A855F7' },
    { label: 'Cancelled', count: 2, percentage: 4, color: '#38BDF8' },
  ];

  const revenueData = [
    { label: 'Apr', value: 3.2, displayValue: '$3,200' },
    { label: 'May', value: 5.8, displayValue: '$5,800' },
    { label: 'Jun', value: 4.9, displayValue: '$4,900' },
    { label: 'Jul', value: 7.2, displayValue: '$7,200' },
    { label: 'Aug', value: 8.5, displayValue: '$8,500' },
    { label: 'Sep', value: 9.1, displayValue: '$9,100' },
    { label: 'Oct', value: 12.0, displayValue: '$12,000' },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (s: string) => {
    switch (s) {
      case 'Paid':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Overdue':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      case 'Cancelled':
      default:
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Create, manage, and track your invoices and payments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm shadow-glow-orange transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Invoices"
          value="42"
          change="+37%"
          color="orange"
          icon="FileText"
        />
        <StatCard
          label="Total Amount"
          value="$56,420"
          change="+28%"
          color="purple"
          icon="CreditCard"
        />
        <StatCard
          label="Paid"
          value="$41,300"
          change="+42%"
          color="blue"
          icon="CheckCircle2"
        />
        <StatCard
          label="Pending"
          value="$11,620"
          change="+18%"
          color="green"
          icon="Clock"
        />
      </div>

      {/* 3. Middle: Revenue Overview + Invoice Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Revenue Overview (Area Chart) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Revenue Overview</span>
            </h2>

            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141C32] border border-[#1E293B] text-xs font-mono text-zinc-300">
              <span>Last 6 Months</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          <div className="pt-2">
            <AreaChart
              data={revenueData}
              yMax={12}
              yAxisLabels={['12K', '10K', '8K', '6K', '4K', '2K', '0']}
              unit="K"
            />
          </div>
        </div>

        {/* Right: Invoice Status Donut */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-bold text-white mb-4">Invoice Status</h2>
          <DonutChart
            totalLabel="42"
            totalSublabel="Invoices"
            segments={invoiceSegments}
            size={165}
          />
        </div>

      </div>

      {/* 4. Bottom: Invoices List Table */}
      <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Invoices List</span>
          </h2>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 w-full sm:w-56"
              />
            </div>

            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-xs font-mono text-zinc-300 hover:text-white">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1E293B] text-[11px] font-mono text-zinc-500 bg-[#10172A]">
                <th className="py-2.5 px-3 w-8">
                  <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700" />
                </th>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Issue Date</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F32]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#141C32]/60 transition-colors">
                  <td className="py-3 px-3">
                    <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700" />
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {inv.invoiceNumber}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={inv.client.avatar}
                        alt={inv.client.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-zinc-200 font-medium">{inv.client.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-xs text-zinc-300">
                    {inv.project}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {inv.amount}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${statusBadge(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-xs text-zinc-400">
                    {inv.issueDate}
                  </td>

                  <td className="py-3 px-3 font-mono text-xs text-zinc-400">
                    {inv.dueDate}
                  </td>

                  <td className="py-3 px-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button className="p-1 rounded text-zinc-400 hover:text-white" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading PDF for invoice ${inv.invoiceNumber}`)}
                        className="p-1 rounded text-zinc-400 hover:text-amber-400"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
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

      {/* 5. Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
        subtitle="Issue an invoice to your client with itemized amounts."
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Select Client
            </label>
            <select
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Michael Brown">Michael Brown (TechVision)</option>
              <option value="Emma Wilson">Emma Wilson (Bright Labs)</option>
              <option value="David Miller">David Miller (NextApp)</option>
              <option value="James Taylor">James Taylor (Creative Studio)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

