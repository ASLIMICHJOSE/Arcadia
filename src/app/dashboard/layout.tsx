'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar, DashboardHeader } from '@/components/layout';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Close mobile sidebar automatically upon route transition
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[var(--background,#100F0D)] text-[var(--text-primary,#F3EBDD)] relative flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(197, 164, 109, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(128, 97, 60, 0.06) 0%, transparent 50%)',
        }}
      />

      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content Viewport */}
      <div
        className={`flex-1 flex flex-col transition-[padding-left] duration-300 ease-in-out ${
          isMobile ? 'pl-0' : collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Sticky Dashboard Header */}
        <DashboardHeader
          onOpenMobileSidebar={() => setMobileOpen(true)}
          collapsed={collapsed}
        />

        {/* Child Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
