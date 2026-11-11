'use client';

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  MessageSquare,
} from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import FriendsRail from './FriendsRail';
import { PageTransition } from '@/components/motion';
import { playBlip } from '@/lib/sound';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  children: React.ReactNode;
}

// Persistent Shell Context: Ensures the console frame mounts once and behaves like a React SPA
const InsideAppShellContext = createContext<boolean>(false);

export function AppShell({ children }: AppShellProps) {
  const isInside = useContext(InsideAppShellContext);
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If already rendered inside the persistent root shell, bypass duplicate mounting
  if (isInside) {
    return <>{children}</>;
  }

  // Mobile bottom touch navigation
  const MOBILE_NAV = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Games', href: '/discover', icon: Gamepad2 },
    { label: 'Rankings', href: '/leaderboard', icon: Trophy },
    { label: 'Community', href: '/community', icon: MessageSquare },
  ];

  return (
    <InsideAppShellContext.Provider value={true}>
      <div className="min-h-screen bg-[#140707] text-[#FFF5F0] flex justify-center items-start p-0 md:p-3 lg:p-4 selection:bg-[#E34242]/40 selection:text-white font-sans relative">
        {/* Console Launcher Frame (overflow-clip preserves rounded corners AND sticky HUD panels without compositor lag) */}
        <div className="w-full max-w-[1720px] min-h-screen md:min-h-[920px] bg-[#1C0A0A] md:rounded-[36px] border border-white/[0.08] shadow-2xl flex overflow-clip relative">
          {/* 1. Left Vertical Console Dock (76px) */}
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* 2. Center Column: Header & Page Viewport */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-clip">
            <DashboardHeader
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />

            <main className="flex-1 p-3 sm:p-5 lg:p-6 pb-24 md:pb-8 relative">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>

          {/* 3. Right Vertical Social Presence Rail (70px) */}
          <div className="hidden xl:block">
            <FriendsRail />
          </div>

          {/* 4. Mobile Bottom Touch Dock */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1C0A0A]/96 border-t border-white/[0.08] px-4 py-2 flex items-center justify-around shadow-2xl">
            {MOBILE_NAV.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  onClick={() => playBlip()}
                  className={cn(
                    'flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-xl text-[10px] font-medium transition-colors relative z-10',
                    isActive
                      ? 'text-[#FFF5F0] font-bold'
                      : 'text-[#C7A9A3] hover:text-white'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-xl bg-[#E34242]/20 border border-[#E34242]/45 shadow-[0_0_14px_rgba(227,66,66,0.35)]"
                    />
                  )}
                  <Icon className={cn('w-5 h-5 transition-colors', isActive && 'text-[#E34242]')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </InsideAppShellContext.Provider>
  );
}

export default AppShell;
