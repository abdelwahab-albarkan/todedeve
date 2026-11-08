import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

const DASHBOARD_PAGES = [
  '',
  '/analytics',
  '/calendar',
  '/clients',
  '/invoices',
  '/projects',
  '/reports',
  '/settings',
  '/tasks',
  '/team',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...DASHBOARD_PAGES.map((path) => ({
      url: `${SITE_URL}/dashboard${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 0.8 : 0.6,
    })),
  ];
}
