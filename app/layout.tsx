import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';
import { PRODUCT_NAME, PRODUCT_TAGLINE } from '@/lib/constants';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — ${PRODUCT_TAGLINE}`,
  description:
    'A complete, production-ready landing page and digital starter kit built with Next.js 14, TypeScript, and Tailwind CSS. One-time payment via Gumroad.',
  icons: {
    icon: '/mockup-hero.svg',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080C14' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Gumroad Overlay Checkout Script */}
        <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />
      </head>
      <body id="top" className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

