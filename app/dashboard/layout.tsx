'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C14] text-zinc-100 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        
        {/* Sticky Desktop & Mobile Drawer Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}

