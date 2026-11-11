'use client';

import * as React from 'react';
import { Database, Download, RotateCcw, Save, ShieldCheck, Store } from 'lucide-react';
import { useStore } from '@/lib/digital-system/store';
import { download } from '@/lib/digital-system/selectors';
import type { Currency, StoreSettings } from '@/lib/digital-system/types';
import { Button, Card, CardHeader, Field, Input, Select, useConfirm } from '@/components/digital-system/ui';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SettingsPage() {
  const { db, saveSettings, resetDemo, notify } = useStore();
  const { confirm, dialog } = useConfirm();
  const [s, setS] = React.useState<StoreSettings>(db.settings);
  const [err, setErr] = React.useState<Partial<Record<keyof StoreSettings, string>>>({});
  const dirty = JSON.stringify(s) !== JSON.stringify(db.settings);

  const submit = () => {
    const e: typeof err = {};
    if (!s.storeName.trim()) e.storeName = 'Enter a store name.';
    if (!EMAIL.test(s.supportEmail.trim())) e.supportEmail = 'Enter a valid email.';
    if (!/^[A-Z]{1,5}$/.test(s.orderPrefix)) e.orderPrefix = 'Use 1–5 capital letters.';
    setErr(e);
    if (Object.keys(e).length) return;
    saveSettings({ ...s, storeName: s.storeName.trim(), supportEmail: s.supportEmail.trim() });
    notify('Settings saved.');
  };

  const size = new Blob([JSON.stringify(db)]).size;

  return (
    <>
      {dialog}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]">Settings</h1>
        <p className="mt-1 text-neutral-400">Store details, defaults and demo data.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Store" icon={Store} />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Store name" required error={err.storeName}><Input value={s.storeName} maxLength={60} onChange={(e) => setS({ ...s, storeName: e.target.value })} /></Field>
            <Field label="Support email" required error={err.supportEmail}><Input type="email" value={s.supportEmail} onChange={(e) => setS({ ...s, supportEmail: e.target.value })} /></Field>
            <Field label="Default currency">
              <Select value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value as Currency })}>
                {(['USD', 'EUR', 'GBP', 'MAD'] as Currency[]).map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Order ID prefix" error={err.orderPrefix}><Input value={s.orderPrefix} maxLength={5} onChange={(e) => setS({ ...s, orderPrefix: e.target.value.toUpperCase() })} /></Field>
            <div className="sm:col-span-2">
              <Button variant="primary" icon={Save} disabled={!dirty} onClick={submit}>Save settings</Button>
            </div>
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Demo data" icon={Database} />
            <div className="space-y-3 p-5 text-sm text-neutral-300">
              <p>
                This demo keeps {db.products.length} products, {db.orders.length} orders, {db.customers.length} customers and {db.coupons.length} coupons in your browser ({(size / 1024).toFixed(0)} KB).
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button icon={Download} onClick={() => download('todedev-demo-data.json', JSON.stringify(db, null, 2), 'application/json')}>Export all data</Button>
                <Button variant="danger" icon={RotateCcw} onClick={() => confirm('Reset demo data?', 'All your changes in this demo are replaced with the original sample data.', 'Reset data', resetDemo)}>Reset demo data</Button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Security in the demo" icon={ShieldCheck} />
            <ul className="list-disc space-y-2 p-5 pl-9 text-sm text-neutral-300">
              <li>Sample data only – no real customers, orders or payments.</li>
              <li>Nothing is sent to a server; emails and refunds are simulated and logged.</li>
              <li>Uploaded files stay in this browser tab and are never published.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
