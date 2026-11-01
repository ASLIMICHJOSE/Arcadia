'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Trophy,
  Award,
  Sparkles,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { DEMO_PLAYER, DEMO_ACTIVITY, DASHBOARD_NAV, type ActivityItem } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DashboardHeaderProps {
  isSidebarCollapsed?: boolean;
  collapsed?: boolean;
  onMobileMenuToggle?: () => void;
  onOpenMobileSidebar?: () => void;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

/**
 * Derives a human-readable title and breadcrumb path from the current URL
 */
function resolvePathMeta(pathname: string): { title: string; crumbs: BreadcrumbItem[] } {
  const matchingNav = DASHBOARD_NAV.find((item) => item.href === pathname);
  if (matchingNav) {
    return {
      title: matchingNav.label,
      crumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: matchingNav.label },
      ],
    };
  }

  // Fallback for nested routes
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0 || pathname === '/dashboard') {
    return {
      title: 'Overview',
      crumbs: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Overview' }],
    };
  }

  const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];
  let accumulatedPath = '';

  segments.forEach((seg, idx) => {
    accumulatedPath += `/${seg}`;
    if (seg === 'dashboard') return;
    const formatted = seg
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    crumbs.push({
      label: formatted,
      href: idx < segments.length - 1 ? accumulatedPath : undefined,
    });
  });

  const lastCrumb = crumbs[crumbs.length - 1];
  return {
    title: lastCrumb ? lastCrumb.label : 'Dashboard',
    crumbs,
  };
}

export function DashboardHeader({
  isSidebarCollapsed = false,
  collapsed,
  onMobileMenuToggle,
  onOpenMobileSidebar,
  title: propTitle,
  breadcrumbs: propBreadcrumbs,
  className,
}: DashboardHeaderProps) {
  const sidebarIsCollapsed = collapsed !== undefined ? collapsed : isSidebarCollapsed;
  const handleMobileToggle = onOpenMobileSidebar || onMobileMenuToggle;
  const pathname = usePathname();
  const { title: autoTitle, crumbs: autoCrumbs } = resolvePathMeta(pathname);
  const activeTitle = propTitle || autoTitle;
  const activeCrumbs = propBreadcrumbs || autoCrumbs;

  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState<readonly ActivityItem[]>(
    DEMO_ACTIVITY.slice(0, 4)
  );

  const profileRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on route changes
  useEffect(() => {
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearNotifications = () => {
    setUnreadNotifications([]);
  };

  return (
    <header
      aria-label="Dashboard Top Bar"
      className={cn(
        'fixed top-0 right-0 z-30 h-20 bg-[var(--background)]/85 backdrop-blur-xl border-b border-[var(--glass-border)] transition-all duration-300 ease-in-out',
        'left-0',
        isSidebarCollapsed ? 'md:left-[72px]' : 'md:left-[260px]',
        className
      )}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* ======================================================== */}
        {/* LEFT SECTION: Mobile Toggle & Page Title/Breadcrumbs */}
        {/* ======================================================== */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile Menu Toggle Button */}
          {handleMobileToggle && (
            <button
              type="button"
              onClick={handleMobileToggle}
              aria-label="Open Navigation Sidebar"
              className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)] border border-[var(--glass-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            >
              <Menu className="w-5 h-5 text-[var(--gold)]" />
            </button>
          )}

          {/* Breadcrumbs & Title */}
          <div className="flex flex-col min-w-0">
            {/* Breadcrumb Trail */}
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
              {activeCrumbs.map((crumb, idx) => {
                const isLast = idx === activeCrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${idx}`}>
                    {idx > 0 && <span className="opacity-40">/</span>}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-[var(--gold)] transition-colors truncate max-w-[120px]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={cn('truncate max-w-[140px]', isLast ? 'text-[var(--gold)] font-medium' : '')}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            {/* Main Section Header */}
            <h1
              className="font-serif text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-wide truncate mt-0.5"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {activeTitle}
            </h1>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT SECTION: Search, Notifications, Player Profile */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Desktop Search Input (Glass Style) */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search arena, games, rivals..."
              aria-label="Search games and players"
              className="w-full pl-9 pr-12 py-2 text-xs rounded-xl bg-[var(--surface)]/70 text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--glass-border)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="text-[10px] text-[var(--text-muted)] bg-[var(--surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--glass-border)] font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle Search Bar"
            className="md:hidden p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)] border border-[var(--glass-border)] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Bell Icon & Badge */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="View notifications"
              aria-expanded={isNotificationsOpen}
              className={cn(
                'relative p-2.5 rounded-xl transition-all duration-200 border',
                isNotificationsOpen
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/40 shadow-[0_0_12px_rgba(197,164,109,0.2)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border-[var(--glass-border)]'
              )}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gold)]" />
                </span>
              )}
            </button>

            {/* Notifications Dropdown Popover */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[var(--surface-elevated)]/95 backdrop-blur-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden z-50"
                >
                  {/* Notifications Header */}
                  <div className="px-4 py-3.5 border-b border-[var(--glass-border)]/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                        Arena Alerts
                      </span>
                      {unreadNotifications.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                          {unreadNotifications.length}
                        </span>
                      )}
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearNotifications}
                        className="text-[11px] text-[var(--gold)] hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-[var(--glass-border)]/40">
                    {unreadNotifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-2">
                        <Bell className="w-6 h-6 opacity-40 text-[var(--gold)]" />
                        <span>All arena notifications cleared</span>
                      </div>
                    ) : (
                      unreadNotifications.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 hover:bg-[var(--glass-hover)] transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 rounded-lg bg-[var(--surface)] text-[var(--gold)] border border-[var(--glass-border)] flex-shrink-0 mt-0.5">
                            <Trophy className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--text-primary)] leading-snug">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 block">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Notifications Footer */}
                  <div className="p-2.5 border-t border-[var(--glass-border)]/60 bg-[var(--surface)]/50 text-center">
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] font-medium inline-flex items-center gap-1"
                    >
                      <span>View All Activity</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ======================================================== */}
          {/* Player Avatar & Profile Dropdown */}
          {/* ======================================================== */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Open player profile menu"
              aria-expanded={isProfileOpen}
              className={cn(
                'flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl transition-all duration-200 border',
                isProfileOpen
                  ? 'bg-[var(--gold)]/10 border-[var(--gold)]/40 shadow-[0_0_15px_rgba(197,164,109,0.2)]'
                  : 'bg-[var(--surface)]/70 hover:bg-[var(--surface-elevated)] border-[var(--glass-border)]'
              )}
            >
              {/* Avatar circle with gold gradient border */}
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold)] via-[var(--bronze)] to-[var(--background-secondary)] p-[1px] flex-shrink-0">
                <div className="w-full h-full rounded-lg bg-[var(--surface)] flex items-center justify-center font-serif font-bold text-xs text-[var(--gold)]">
                  FS
                </div>
                {/* Level badge dot */}
                <div className="absolute -bottom-1 -right-1 px-1 rounded bg-[var(--background)] border border-[var(--gold)] text-[9px] font-mono text-[var(--gold)] leading-none py-0.5">
                  24
                </div>
              </div>

              {/* Player Name and Level (Desktop) */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight tracking-wide">
                  {DEMO_PLAYER.username}
                </span>
                <span className="text-[10px] text-[var(--gold)] font-mono leading-none">
                  Lvl {DEMO_PLAYER.level} • {DEMO_PLAYER.title}
                </span>
              </div>

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 hidden sm:block',
                  isProfileOpen && 'rotate-180 text-[var(--gold)]'
                )}
              />
            </button>

            {/* Profile Dropdown Popover */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-3 w-72 rounded-2xl bg-[var(--surface-elevated)]/98 backdrop-blur-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden z-50 divide-y divide-[var(--glass-border)]/50"
                >
                  {/* Player Status Summary */}
                  <div className="p-4 bg-[var(--surface)]/70">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--bronze)] p-[1.5px] flex-shrink-0">
                        <div className="w-full h-full rounded-[10px] bg-[var(--background-secondary)] flex items-center justify-center font-serif text-sm font-bold text-[var(--gold)]">
                          FS
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                            {DEMO_PLAYER.username}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--gold)] font-mono block">
                          {DEMO_PLAYER.title}
                        </span>
                      </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-3 pt-3 border-t border-[var(--glass-border)]/50">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                        <span>Level {DEMO_PLAYER.level}</span>
                        <span className="text-[var(--gold)]">
                          {DEMO_PLAYER.xp} / {DEMO_PLAYER.xpToNext} XP
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--surface-elevated)] overflow-hidden border border-[var(--glass-border)]/40">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] rounded-full transition-all duration-500"
                          style={{
                            width: `${(DEMO_PLAYER.xp / DEMO_PLAYER.xpToNext) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-2 space-y-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--glass-hover)] transition-colors"
                    >
                      <User className="w-4 h-4 text-[var(--gold)]" />
                      <span>Player Profile</span>
                    </Link>

                    <Link
                      href="/dashboard/achievements"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--glass-hover)] transition-colors"
                    >
                      <Award className="w-4 h-4 text-[var(--gold)]" />
                      <span>Achievements & Badges</span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--glass-hover)] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[var(--gold)]" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="p-2 bg-[var(--surface)]/30">
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out of Arcadia</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Input Drawer (Dropdown when active on mobile) */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-4 py-3 bg-[var(--background-secondary)]/98 border-t border-[var(--glass-border)] shadow-lg overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, players, leaderboards..."
                autoFocus
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--glass-border)] focus:outline-none focus:border-[var(--gold)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default DashboardHeader;
