'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Gamepad2,
  Swords,
  Trophy,
  Award,
  Users,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  X,
  LucideIcon,
} from 'lucide-react';
import { DASHBOARD_NAV, DEMO_PLAYER, type NavLink } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  /**
   * Whether the desktop sidebar is currently collapsed to icon-only mode (72px)
   */
  isCollapsed?: boolean;
  collapsed?: boolean;
  /**
   * Toggle callback for collapse/expand
   */
  onToggle?: () => void;
  onToggleCollapse?: () => void;
  /**
   * Mobile drawer state and callbacks
   */
  isMobileOpen?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onCloseMobile?: () => void;
  isMobile?: boolean;
  className?: string;
}

/**
 * Maps items to requested icons:
 * LayoutDashboard, Compass, Gamepad2, Users, Trophy, Award, UserPlus, Settings, Swords
 */
function getSidebarIcon(iconKey: string, label: string) {
  const iconProps = { className: 'w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110' };
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes('overview')) return <LayoutDashboard {...iconProps} />;
  if (lowerLabel.includes('discover')) return <Compass {...iconProps} />;
  if (lowerLabel.includes('my games') || lowerLabel === 'games') return <Gamepad2 {...iconProps} />;
  if (lowerLabel.includes('multiplayer')) return <Swords {...iconProps} />;
  if (lowerLabel.includes('leaderboard')) return <Trophy {...iconProps} />;
  if (lowerLabel.includes('achievement')) return <Award {...iconProps} />;
  if (lowerLabel.includes('friend')) return <Users {...iconProps} />;
  if (lowerLabel.includes('setting')) return <Settings {...iconProps} />;

  switch (iconKey) {
    case 'layout-dashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'gamepad-2':
      return <Gamepad2 {...iconProps} />;
    case 'swords':
      return <Swords {...iconProps} />;
    case 'trophy':
      return <Trophy {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'user-plus':
      return <UserPlus {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    default:
      return <Gamepad2 {...iconProps} />;
  }
}

/**
 * Stylized Arcadia Star Logo Mark for the Sidebar Header
 */
function MiniArcadiaLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 overflow-hidden group focus:outline-none"
      aria-label="Arcadia Dashboard Home"
    >
      <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
        <div className="absolute inset-0 bg-[var(--gold)]/20 blur-md rounded-full pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[var(--gold)] drop-shadow-[0_0_8px_rgba(197,164,109,0.5)]"
        >
          <path
            d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
            fill="url(#sidebarMiniStarGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="12" r="2" fill="#100F0D" />
          <circle cx="12" cy="12" r="1" fill="#DFCA9B" />
          <defs>
            <linearGradient id="sidebarMiniStarGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DFCA9B" />
              <stop offset="50%" stopColor="#C5A46D" />
              <stop offset="100%" stopColor="#80613C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col whitespace-nowrap overflow-hidden"
          >
            <span
              className="font-serif font-bold tracking-[0.2em] text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7F48] uppercase leading-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              ARCADIA
            </span>
            <span className="text-[9px] tracking-[0.3em] text-[var(--text-muted)] uppercase font-sans mt-0.5">
              Arena Portal
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}

export function Sidebar({
  isCollapsed: propIsCollapsed,
  collapsed: propCollapsed,
  onToggle: propOnToggle,
  onToggleCollapse: propOnToggleCollapse,
  isMobileOpen: propIsMobileOpen,
  mobileOpen: propMobileOpen,
  onMobileClose: propOnMobileClose,
  onCloseMobile: propOnCloseMobile,
  isMobile: propIsMobile,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  // Normalize dual-syntax props for maximum compatibility
  const isCollapsed = propIsCollapsed ?? propCollapsed ?? false;
  const onToggle = propOnToggle ?? propOnToggleCollapse ?? (() => {});
  const isDrawerOpen = propIsMobileOpen ?? propMobileOpen ?? false;
  const handleCloseDrawer = propOnMobileClose ?? propOnCloseMobile ?? (() => {});

  // Responsive state if isMobile prop is not supplied
  const [internalIsMobile, setInternalIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 768px)');
    setInternalIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setInternalIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isMobileView = propIsMobile ?? internalIsMobile;

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Reusable Nav Item List
  const renderNavItems = (inDrawer: boolean) => (
    <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto" aria-label="Dashboard Navigation">
      {DASHBOARD_NAV.map((item: NavLink) => {
        const active = isLinkActive(item.href);
        const shouldShowLabel = inDrawer || !isCollapsed;

        return (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              onClick={inDrawer ? handleCloseDrawer : undefined}
              className={cn(
                'relative flex items-center h-11 rounded-xl text-sm font-medium transition-all duration-200',
                shouldShowLabel ? 'px-3.5 gap-3.5' : 'justify-center px-0',
                active
                  ? 'text-[var(--gold)] bg-[var(--gold)]/10 border border-[var(--gold)]/30 shadow-[0_0_12px_rgba(197,164,109,0.15)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border border-transparent hover:border-[var(--glass-border)]'
              )}
            >
              {/* Active Gold Indicator Pill */}
              {active && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className={active ? 'text-[var(--gold)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}>
                {getSidebarIcon(item.icon, item.label)}
              </div>

              {/* Label */}
              <AnimatePresence>
                {shouldShowLabel && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    className="truncate tracking-wide whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active Dot */}
              {active && shouldShowLabel && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]" />
              )}
            </Link>

            {/* Desktop Collapsed Tooltip */}
            {!shouldShowLabel && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs font-medium border border-[var(--glass-border)] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                {item.label}
                {active && <span className="ml-1.5 text-[var(--gold)]">• Active</span>}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP FIXED SIDEBAR */}
      {/* Width: Collapsed = 72px, Expanded = 260px */}
      {/* ======================================================== */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Dashboard Navigation Sidebar"
        className={cn(
          'hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-[var(--background-secondary)]/95 backdrop-blur-xl border-r border-[var(--glass-border)] shadow-[4px_0_24px_rgba(0,0,0,0.35)] select-none overflow-x-hidden',
          className
        )}
        style={{
          width: isCollapsed ? 72 : 260,
        }}
      >
        {/* Top Header / Logo */}
        <div
          className={cn(
            'h-20 flex items-center border-b border-[var(--glass-border)] px-4 transition-all duration-200 flex-shrink-0',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <MiniArcadiaLogo isCollapsed={isCollapsed} />
        </div>

        {/* Navigation Items */}
        {renderNavItems(false)}

        {/* Bottom Profile Preview */}
        <div className="p-3 border-t border-[var(--glass-border)]/60 bg-[var(--surface)]/30 flex-shrink-0">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)] transition-colors',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#372A1C] to-[#151310] border border-[var(--gold)] flex items-center justify-center font-bold text-xs text-[var(--gold)] flex-shrink-0">
              FS
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--background-secondary)]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {DEMO_PLAYER.username}
                </p>
                <p className="text-[10px] text-[var(--gold)] truncate font-mono">
                  Lvl {DEMO_PLAYER.level} • {DEMO_PLAYER.title}
                </p>
              </div>
            )}

            {!isCollapsed && (
              <Link
                href="/"
                title="Return to Public Hub"
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Collapse Button — when collapsed, show only icon */}
        <div className="p-2.5 border-t border-[var(--glass-border)]/40 bg-[var(--surface)]/50 flex-shrink-0">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className={cn(
              'w-full flex items-center h-9 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border border-[var(--glass-border)]/50 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]',
              isCollapsed ? 'justify-center px-0' : 'px-3 justify-between'
            )}
          >
            {!isCollapsed && (
              <span className="truncate text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] font-mono text-[11px]">
                Collapse Sidebar
              </span>
            )}
            <div className="flex items-center justify-center text-[var(--gold)]">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </motion.aside>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER OVERLAY */}
      {/* Slide-in drawer with backdrop overlay, close on backdrop click */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              aria-label="Mobile Dashboard Navigation"
              className="relative w-[280px] max-w-[85vw] h-full bg-[var(--background-secondary)] border-r border-[var(--glass-border)] backdrop-blur-2xl shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="h-20 flex items-center justify-between px-5 border-b border-[var(--glass-border)]">
                <MiniArcadiaLogo isCollapsed={false} />
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  aria-label="Close Mobile Navigation"
                  className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--glass)] border border-[var(--glass-border)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--gold)]" />
                </button>
              </div>

              {/* Drawer Nav Items */}
              {renderNavItems(true)}

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--surface)]/30 space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#372A1C] to-[#151310] border border-[var(--gold)] flex items-center justify-center font-bold text-xs text-[var(--gold)]">
                    FS
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {DEMO_PLAYER.username}
                    </p>
                    <p className="text-[10px] text-[var(--gold)] truncate font-mono">
                      Lvl {DEMO_PLAYER.level} • {DEMO_PLAYER.title}
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  onClick={handleCloseDrawer}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface)] border border-[var(--glass-border)] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Return to Public Arena</span>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
