'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  Sparkles,
  LogIn,
  Maximize,
  Minimize,
  Gamepad2,
} from 'lucide-react';
import { playBlip } from '@/lib/sound';
import { cn } from '@/lib/utils';
import { getCurrentUser, clearUserSession, getDynamicGreeting, UserSession } from '@/lib/auth';
import { useGamepad } from '@/lib/gamepad';
import { triggerHaptic } from '@/lib/haptics';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DashboardHeaderProps {
  onOpenMobileSidebar?: () => void;
  onMobileMenuToggle?: () => void;
  onToggleFriendsRail?: () => void;
  isFriendsRailOpen?: boolean;
  className?: string;
}

export function DashboardHeader({
  onOpenMobileSidebar,
  onMobileMenuToggle,
  className,
}: DashboardHeaderProps) {
  const router = useRouter();
  const handleMobileSidebar = onOpenMobileSidebar || onMobileMenuToggle;
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // HTML5 Gamepad connection state
  const gamepad = useGamepad();

  // Dynamic user session and greeting state
  const [user, setUser] = useState<UserSession>({ username: 'CONTENDER', isLoggedIn: false });
  const [greeting, setGreeting] = useState<string>('Good evening');

  useEffect(() => {
    setUser(getCurrentUser());
    setGreeting(getDynamicGreeting());

    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('arcadia_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('arcadia_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    triggerHaptic('light');
    playBlip();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback or ignore rejection
    }
  };

  const handleLogout = () => {
    triggerHaptic('medium');
    clearUserSession();
    setProfileOpen(false);
    setUser({ username: 'CONTENDER', isLoggedIn: false });
    playBlip();
    router.push('/login');
  };

  return (
    <header
      className={cn(
        'h-18 px-4 sm:px-6 lg:px-8 bg-[#1C0A0A]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between z-20 sticky top-0 select-none',
        className
      )}
    >
      {/* Left: Mobile Toggle & Player Greeting */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            handleMobileSidebar?.();
          }}
          aria-label="Open Navigation Menu"
          className="lg:hidden p-2 rounded-xl bg-[#291010] border border-white/10 text-[#C7A9A3] hover:text-[#FFF5F0]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg md:text-xl font-heading font-normal text-[#C7A9A3]">
            {greeting},
          </span>
          <span className="text-base sm:text-lg md:text-xl font-heading font-extrabold text-[#FFF5F0] tracking-wide uppercase drop-shadow-sm">
            {user.username}
          </span>
        </div>
      </div>

      {/* Center: Search Bar (Rounded Pill matching screenshot) */}
      <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-6">
        <div
          className={cn(
            'w-full flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#291010]/85 border transition-all duration-200 shadow-inner',
            searchFocused
              ? 'border-[#E34242] shadow-[0_0_16px_rgba(227,66,66,0.3)] bg-[#351414]'
              : 'border-white/10 hover:border-white/20'
          )}
        >
          <Search className="w-4 h-4 text-[#C7A9A3] shrink-0" />
          <input
            type="text"
            placeholder="Search titles, tournaments, friends..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent text-xs sm:text-sm text-[#FFF5F0] placeholder-[#C7A9A3]/70 focus:outline-none"
          />
        </div>
      </div>

      {/* Right: Controller Status, Fullscreen, Cart, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Hardware Controller Status Badge */}
        {gamepad.isConnected && (
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{gamepad.name}</span>
          </div>
        )}

        {/* Console Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Console Fullscreen'}
          className="w-9 h-9 rounded-full bg-[#291010] border border-white/10 flex items-center justify-center text-[#C7A9A3] hover:text-white hover:border-[#E34242] transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Shopping Cart */}
        <Link
          href="/discover"
          prefetch={true}
          onClick={() => {
            triggerHaptic('light');
            playBlip();
          }}
          title="Game Store"
          className="w-9 h-9 rounded-full bg-[#291010] border border-white/10 flex items-center justify-center text-[#C7A9A3] hover:text-white hover:border-[#E34242] transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
        </Link>

        {/* Notifications Bell with Red Alert Dot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              playBlip();
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label="View notifications"
            className="w-9 h-9 rounded-full bg-[#291010] border border-white/10 flex items-center justify-center text-[#C7A9A3] hover:text-white hover:border-[#E34242] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#E34242] shadow-[0_0_8px_#E34242]" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 p-3.5 rounded-2xl bg-[#220C0C] border border-white/10 shadow-2xl z-50 space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-heading text-xs font-bold text-[#FFF5F0]">Station Dispatches</span>
                  <span className="text-[10px] font-mono text-[#E34242] font-semibold">1 New</span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded-xl bg-[#2E1010] text-xs space-y-0.5">
                    <p className="font-semibold text-white">Station Ready</p>
                    <p className="text-[11px] text-[#C7A9A3]">Offline cache active for all 4 arcade titles.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar with Online Badge & Dropdown */}
        <div className="relative">
          {user.isLoggedIn ? (
            <div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  playBlip();
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="relative block w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#E34242] transition-colors shadow-sm cursor-pointer"
                aria-label="Open User Menu"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1C0A0A] shadow-sm" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-[#220C0C] border border-white/10 shadow-2xl z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white uppercase">{user.username}</p>
                      <p className="text-[10px] font-mono text-[#C7A9A3] truncate">{user.email || 'Online Contender'}</p>
                    </div>

                    <Link
                      href="/dashboard/settings"
                      prefetch={true}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#C7A9A3] hover:text-white hover:bg-[#351414] transition-colors"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#E34242] hover:bg-[#351414] transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              prefetch={true}
              onClick={() => {
                triggerHaptic('light');
                playBlip();
              }}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E34242] to-[#C83A35] hover:from-[#EF5350] hover:to-[#D32F2F] text-white text-xs font-bold shadow-[0_2px_12px_rgba(227,66,66,0.35)] flex items-center gap-1.5 transition-all"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
