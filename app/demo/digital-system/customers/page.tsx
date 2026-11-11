'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Ban, CalendarDays, ChevronDown, Crown, Download, Eye, FileText, Globe, IdCard, Mail, Pencil, Plus, ShoppingCart, Upload, User, UserCheck, UserPlus, Users, UserX, Wallet } from 'lucide-react';
import { useStore, uid } from '@/lib/digital-system/store';
import { byId, customerStats, delta, download, inRange, money, previousRange, rangeForDays, shortDate, toCsv } from '@/lib/digital-system/selectors';
import type { Customer, CustomerStatus } from '@/lib/digital-system/types';
import { Avatar, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Pagination, Pill, SearchInput, Select, StatCard, StatusPill, Td, Textarea, Th, useConfirm, usePaged } from '@/components/digital-system/ui';
import { BASE } from '@/components/digital-system/Shell';
import { cn } from '@/lib/utils';

const PER_PAGE = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function CustomerForm({ initial, onClose }: { initial: Customer | null; onClose: () => void }) {
  const { db, saveCustomer, notify } = useStore();
  const [c, setC] = React.useState<Customer>(
    () => initial ?? { id: `C-${String(db.customers.length + 1).padStart(3, '0')}-${uid('x').slice(-3)}`, name: '', email: '', country: '', status: 'active', joinedAt: new Date().toISOString(), notes: '' }
  );
  const [err, setErr] = React.useState<{ name?: string; email?: string }>({});
  const submit = () => {
    const e: typeof err = {};
    if (!c.name.trim()) e.name = 'Enter a name.';
    if (!EMAIL.test(c.email.trim())) e.email = 'Enter a valid email address.';
    else if (db.customers.some((x) => x.id !== c.id && x.email.toLowerCase() === c.email.trim().toLowerCase())) e.email = 'A customer with this email already exists.';
    setErr(e);
    if (Object.keys(e).length) return;
    saveCustomer({ ...c, name: c.name.trim(), email: c.email.trim().toLowerCase() });
    notify(initial ? 'Customer updated.' : `${c.name} added.`);
    onClose();
  };
  return (
    <Modal
      open
      onClose={onClose}
      title={initial ? 'Edit customer' : 'Add customer'}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>{initial ? 'Save changes' : 'Add customer'}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={err.name}><Input value={c.name} maxLength={80} onChange={(e) => setC({ ...c, name: e.target.value })} /></Field>
        <Field label="Email" required error={err.email}><Input type="email" value={c.email} maxLength={120} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
        <Field label="Country"><Input value={c.country} maxLength={60} onChange={(e) => setC({ ...c, country: e.target.value })} /></Field>
        <Field label="Status">
          <Select value={c.status} onChange={(e) => setC({ ...c, status: e.target.value as CustomerStatus })}>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </Select>
        </Field>
        <Field label="Notes" className="sm:col-span-2"><Textarea value={c.notes} maxLength={1000} onChange={(e) => setC({ ...c, notes: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

function Section({ icon: Icon, title, children, defaultOpen = false }: { icon: typeof User; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-[15px] font-medium text-white">
        <span className="flex items-center gap-3"><Icon className="h-5 w-5 text-neutral-300" />{title}</span>
        <ChevronDown className={cn('h-5 w-5 text-neutral-400 transition', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function Customers() {
  const { db, saveCustomer, notify } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const { confirm, dialog } = useConfirm();
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState<'all' | CustomerStatus | 'repeat'>('all');
  const [country, setCountry] = React.useState('all');
  const [days, setDays] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState<string | null>(params?.get('id') ?? null);
  const [form, setForm] = React.useState<Customer | null | 'new'>(null);
  const [notes, setNotes] = React.useState('');
  const panel = React.useRef<HTMLDivElement>(null);

  const stats = customerStats(db);
  const products = byId(db.products);
  const countries = Array.from(new Set(db.customers.map((c) => c.country).filter(Boolean))).sort();

  const r30 = rangeForDays(30);
  const p30 = previousRange(r30);
  const joined = (r: { from: number; to: number }) => db.customers.filter((c) => inRange({ createdAt: c.joinedAt }, r.from, r.to)).length;
  const repeat = db.customers.filter((c) => (stats.get(c.id)?.orders ?? 0) > 1).length;
  const active = db.customers.filter((c) => c.status === 'active' || c.status === 'vip').length;
  const blocked = db.customers.filter((c) => c.status === 'blocked').length;

  const term = q.trim().toLowerCase();
  const range = days ? rangeForDays(days) : null;
  const filtered = db.customers
    .filter((c) => {
      if (status === 'repeat' ? (stats.get(c.id)?.orders ?? 0) < 2 : status !== 'all' && c.status !== status) return false;
      if (country !== 'all' && c.country !== country) return false;
      if (range && !inRange({ createdAt: c.joinedAt }, range.from, range.to)) return false;
      return !term || `${c.id} ${c.name} ${c.email}`.toLowerCase().includes(term);
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  const { page, pages, setPage, slice } = usePaged(filtered, PER_PAGE, `${term}${status}${country}${days}`);

  const selected = db.customers.find((c) => c.id === selectedId) ?? slice[0] ?? null;
  const ss = selected ? stats.get(selected.id) : undefined;
  React.useEffect(() => setNotes(selected?.notes ?? ''), [selected?.id, selected?.notes]);

  const select = (c: Customer) => {
    setSelectedId(c.id);
    router.replace(`${BASE}/customers?id=${c.id}`, { scroll: false });
    if (window.innerWidth < 1536) setTimeout(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const exportCsv = () => {
    const rows = [['Customer ID', 'Name', 'Email', 'Country', 'Status', 'Joined', 'Orders', 'Total spent', 'Last order']];
    for (const c of filtered) {
      const s = stats.get(c.id);
      rows.push([c.id, c.name, c.email, c.country, c.status, c.joinedAt.slice(0, 10), String(s?.orders ?? 0), (s?.spent ?? 0).toFixed(2), s?.lastOrder?.slice(0, 10) ?? '']);
    }
    download(`todedev-customers-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    notify(`Exported ${filtered.length} customers.`);
  };

  const orders = selected ? db.orders.filter((o) => o.customerId === selected.id) : [];

  return (
    <>
      {dialog}
      {form && <CustomerForm initial={form === 'new' ? null : form} onClose={() => setForm(null)} />}
      <PageHeader
        title="Customers Management"
        subtitle="Manage your customers, their orders, licenses and activity."
        actions={
          <>
            <Button icon={Upload} onClick={exportCsv}>Export Customers</Button>
            <Button variant="primary" icon={Plus} size="lg" onClick={() => setForm('new')}>Add Customer</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} tone="purple" value={db.customers.length.toLocaleString()} label="Total Customers" change={delta(joined(r30), joined(p30))} />
            <StatCard icon={UserPlus} tone="green" value={active.toLocaleString()} label="Active Customers" />
            <StatCard icon={Crown} tone="orange" value={repeat.toLocaleString()} label="Repeat Customers" />
            <StatCard icon={UserX} tone="red" value={blocked.toLocaleString()} label="Blocked Customers" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <SearchInput value={q} onChange={setQ} placeholder="Search customers (name, email, ID...)" className="sm:col-span-2 lg:col-span-1" />
            <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Customer status">
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="vip">VIP</option>
              <option value="repeat">Repeat buyers</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </Select>
            <Select value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
              <option value="all">All Countries</option>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Joined">
              <option value={0}>All Time</option>
              <option value={30}>Joined last 30 days</option>
              <option value={90}>Joined last 90 days</option>
              <option value={365}>Joined this year</option>
            </Select>
          </div>

          <Card className="mt-4 overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={Users} title="No customers found" text="Try a different search or filter." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <Th>#</Th>
                      <Th>Customer</Th>
                      <Th>Orders</Th>
                      <Th>Total Spent</Th>
                      <Th>Status</Th>
                      <Th>Joined</Th>
                      <Th>Last Order</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {slice.map((c) => {
                      const s = stats.get(c.id);
                      return (
                        <tr key={c.id} onClick={() => select(c)} className={cn('cursor-pointer border-b border-white/[0.04] last:border-0', selected?.id === c.id ? 'bg-orange-500/[0.07]' : 'hover:bg-white/[0.03]')}>
                          <Td className="text-neutral-300">#{c.id.replace('C-', '').split('-')[0]}</Td>
                          <Td>
                            <span className="flex items-center gap-3">
                              <Avatar name={c.name} />
                              <span className="leading-tight">
                                <span className="block font-semibold text-white">{c.name}</span>
                                <span className="text-xs text-neutral-400">{c.email}</span>
                              </span>
                            </span>
                          </Td>
                          <Td>{s?.orders ?? 0}</Td>
                          <Td className="font-semibold text-white">{money(s?.spent ?? 0)}</Td>
                          <Td><StatusPill status={c.status} /></Td>
                          <Td>{shortDate(c.joinedAt)}</Td>
                          <Td>{s?.lastOrder ? shortDate(s.lastOrder) : '—'}</Td>
                          <Td className="text-right">
                            <span className="inline-flex gap-1">
                              <Button size="icon" variant="ghost" aria-label={`View ${c.name}`} icon={Eye} onClick={(e) => { e.stopPropagation(); select(c); }} />
                              <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} aria-label={`Email ${c.name}`} className="grid h-9 w-9 place-items-center rounded-xl text-neutral-300 hover:bg-white/[0.06] hover:text-white">
                                <Mail className="h-4 w-4" />
                              </a>
                              <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} icon={Pencil} onClick={(e) => { e.stopPropagation(); setForm(c); }} />
                            </span>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={page} pages={pages} onPage={setPage} total={filtered.length} perPage={PER_PAGE} noun="customers" />
          </Card>
        </div>

        <div ref={panel} className="min-w-0 scroll-mt-24">
          <Card className="p-5 2xl:sticky 2xl:top-24">
            {!selected ? (
              <EmptyState icon={User} title="Select a customer" />
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-white">Customer Profile</h2>
                  {selected.status === 'vip' && <Pill tone="purple" icon={Crown}>VIP</Pill>}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Avatar name={selected.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-bold text-white">{selected.name}</p>
                    <p className="truncate text-sm text-neutral-300">{selected.email}</p>
                  </div>
                  <Button size="icon" aria-label="Edit customer" icon={Pencil} onClick={() => setForm(selected)} />
                </div>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    { icon: IdCard, label: 'Customer ID', value: `#${selected.id}` },
                    { icon: CalendarDays, label: 'Joined', value: shortDate(selected.joinedAt) },
                    { icon: Globe, label: 'Country', value: selected.country || '—' },
                    { icon: UserCheck, label: 'Status', value: <StatusPill status={selected.status} /> },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <dt className="flex items-center gap-2.5 text-neutral-300"><Icon className="h-4 w-4 text-neutral-400" />{label}</dt>
                      <dd className="text-neutral-100">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <ShoppingCart className="h-6 w-6 text-violet-400" />
                    <span><span className="block text-lg font-bold text-white">{ss?.orders ?? 0}</span><span className="text-xs text-neutral-400">Orders</span></span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <Wallet className="h-6 w-6 text-orange-400" />
                    <span className="min-w-0"><span className="block truncate text-lg font-bold text-white">{money(ss?.spent ?? 0)}</span><span className="text-xs text-neutral-400">Total Spent</span></span>
                  </div>
                </div>

                <div className="mt-4">
                  <Section icon={ShoppingCart} title="Order History" defaultOpen>
                    {orders.length === 0 ? (
                      <p className="text-sm text-neutral-500">No orders yet.</p>
                    ) : (
                      <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                        {orders.map((o) => (
                          <li key={o.id}>
                            <button type="button" onClick={() => router.push(`${BASE}/orders?id=${o.id}`)} className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left text-sm hover:bg-white/[0.04]">
                              <span className="min-w-0">
                                <span className="block truncate text-white">#{o.id} · {products.get(o.productId)?.name ?? 'Deleted product'}</span>
                                <span className="text-xs text-neutral-500">{shortDate(o.createdAt)}</span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block font-semibold text-white">{money(o.amount)}</span>
                                <StatusPill status={o.status} />
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Section>
                  <Section icon={Download} title="Downloads & Licenses">
                    <p className="mb-2 text-xs text-neutral-400">{ss?.downloads ?? 0} downloads across {ss?.products.length ?? 0} purchased products.</p>
                    <ul className="space-y-2">
                      {orders.filter((o) => o.status === 'completed').map((o) => (
                        <li key={o.id} className="rounded-xl border border-white/[0.06] p-2.5 text-xs">
                          <span className="block font-semibold text-white">{products.get(o.productId)?.name ?? 'Deleted product'}</span>
                          <code className="text-orange-300">{o.licenseKey ?? 'No license key'}</code>
                          <span className="block text-neutral-500">{o.downloads} downloads</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                  <Section icon={User} title="Personal Information">
                    <dl className="space-y-1.5 text-sm">
                      <div className="flex justify-between gap-3"><dt className="text-neutral-400">Name</dt><dd className="text-white">{selected.name}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-neutral-400">Email</dt><dd className="truncate text-white">{selected.email}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-neutral-400">Country</dt><dd className="text-white">{selected.country || '—'}</dd></div>
                    </dl>
                  </Section>
                  <Section icon={FileText} title="Notes">
                    <Textarea value={notes} maxLength={1000} onChange={(e) => setNotes(e.target.value)} placeholder="Private notes about this customer" aria-label="Customer notes" />
                    <Button size="sm" variant="primary" className="mt-2" disabled={notes === selected.notes} onClick={() => { saveCustomer({ ...selected, notes }); notify('Notes saved.'); }}>
                      Save notes
                    </Button>
                  </Section>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a href={`mailto:${selected.email}`} className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-violet-400/50 bg-violet-500/10 px-3 py-3 text-sm font-semibold text-white hover:bg-violet-500/20">
                    <Mail className="h-5 w-5" /> Send Email
                  </a>
                  {selected.status === 'blocked' ? (
                    <button type="button" onClick={() => { saveCustomer({ ...selected, status: 'active' }); notify(`${selected.name} unblocked.`); }} className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500/20">
                      <UserCheck className="h-5 w-5" /> Unblock
                    </button>
                  ) : (
                    <button type="button" onClick={() => confirm('Block customer?', `${selected.name} won't be able to buy or download until unblocked.`, 'Block customer', () => { saveCustomer({ ...selected, status: 'blocked' }); notify(`${selected.name} blocked.`); })} className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-red-500/50 bg-red-500/10 px-3 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20">
                      <Ban className="h-5 w-5" /> Block Customer
                    </button>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default function CustomersPage() {
  return (
    <React.Suspense fallback={null}>
      <Customers />
    </React.Suspense>
  );
}
