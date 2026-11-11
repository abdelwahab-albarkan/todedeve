import type { Metadata } from 'next';
import { DigitalStoreProvider } from '@/lib/digital-system/store';
import { Shell } from '@/components/digital-system/Shell';

export const metadata: Metadata = {
  title: {
    default: 'Live Demo — TODEDEV Digital Product Management System',
    template: '%s — TODEDEV Digital Product Management System (Demo)',
  },
  description:
    'Live demo of the TODEDEV Digital Product Management System: products, files & delivery, pricing & licenses, orders, customers, coupons and analytics. Sample data only.',
  alternates: { canonical: '/demo/digital-system' },
};

export default function DigitalSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <DigitalStoreProvider>
      <Shell>{children}</Shell>
    </DigitalStoreProvider>
  );
}
