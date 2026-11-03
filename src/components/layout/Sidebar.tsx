'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Briefcase,
  Moon,
  ShoppingBag,
  MessageSquare,
  Plus,
  Compass,
  X,
} from 'lucide-react';
import { playBlip } from '@/lib/sound';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isCollapsed?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onCloseMobile?: () => void;
  className?: string;
}

export function Sidebar({
  isMobileOpen: propIsMobileOpen,
  mobileOpen,
  onMobileClose,
  onCloseMobile,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const isMobileOpen = mobileOpen !== undefined ? mobileOpen : (propIsMobileOpen ?? false);
  const handleMobileClose = onCloseMobile || onMobileClose;

  // Primary navigation items matching the reference gaming launcher
  const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Games', href: '/discover', icon: Gamepad2 },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Discover', href: '/dashboard/discover', icon: Briefcase },
    { label: 'Settings', href: '/dashboard/settings', icon: Moon },
    { label: 'Shop', href: '/dashboard/achievements', icon: ShoppingBag },
    { label: 'Community', href: '/community', icon: MessageSquare },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col items-center justify-between h-full py-4 select-none">
      {/* Top: Stylized Gaming Emblem Logo */}
      <div className="flex flex-col items-center">
        <Link
          href="/"
          prefetch={true}
          onClick={() => playBlip()}
          aria-label="Arcadia Home"
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group mb-6"
        >
          {/* Custom Stylized Gaming Logo (Matching the top emblem in screenshot) */}
          <div className="relative flex items-center justify-center w-10 h-10">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <path
                d="M16 3L20 12L29 16L20 20L16 29L12 20L3 16L12 12L16 3Z"
                fill="#FFF5F0"
              />
              <path
                d="M16 8L18.5 13.5L24 16L18.5 18.5L16 24L13.5 18.5L8 16L13.5 13.5L16 8Z"
                fill="#E34242"
              />
            </svg>
          </div>
        </Link>

        {/* Center Navigation Icons Stack */}
        <nav className="flex flex-col items-center gap-3">
          {NAV_ITEMS.map((item) => {
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
                title={item.label}
                className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative group',
                  isActive
                    ? 'bg-[#E34242] text-white shadow-[0_0_20px_rgba(227,66,66,0.65)] scale-105'
                    : 'text-[#C7A9A3] hover:text-white hover:bg-white/[0.08]'
                )}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

                {/* Tooltip on hover */}
                <span className="absolute left-16 px-2.5 py-1 rounded-lg bg-[#291010] text-xs font-semibold text-white border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Red Dashed Square with Plus Button */}
      <div className="flex flex-col items-center mt-auto pt-4">
        <Link
          href="/dashboard/multiplayer"
          prefetch={true}
          onClick={() => playBlip()}
          title="New Match / Add Game"
          className="w-11 h-11 rounded-2xl border-2 border-dashed border-[#E34242]/50 text-[#E34242] hover:bg-[#E34242]/15 hover:border-[#E34242] flex items-center justify-center transition-all group active:scale-95 shadow-sm"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleMobileClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Console Left Dock (Fixed 76px on Desktop) */}
      <aside
        className={cn(
          'h-screen sticky top-0 flex-shrink-0 z-40 transition-all duration-300 ease-in-out',
          'bg-[#1C0A0A] border-r border-white/[0.07] flex flex-col',
          'w-[76px]',
          // Mobile drawer behavior
          'fixed lg:sticky inset-y-0 left-0',
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {isMobileOpen && (
          <button
            type="button"
            onClick={handleMobileClose}
            className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg text-[#C7A9A3] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {renderNavContent()}
      </aside>
    </>
  );
}

export default Sidebar;
