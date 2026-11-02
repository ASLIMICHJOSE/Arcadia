'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronRight, Trophy, Users, Compass, Home, Gamepad2 } from 'lucide-react';
import { NAV_LINKS, type NavLink } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { playBlip } from '@/lib/sound';

// Helper icon resolver for nav items
function getNavIcon(iconName: string): React.ReactNode {
  const iconProps = { className: 'w-4 h-4' };
  switch (iconName) {
    case 'home':
      return <Home {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'trophy':
      return <Trophy {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    default:
      return <Gamepad2 {...iconProps} />;
  }
}

/**
 * Arcadia Logo with stylized 8-point compass star emblem and luminous warm amber gaming wordmark
 */
export function ArcadiaLogo({
  className = '',
  iconSize = 'w-7 h-7',
  textSize = 'text-xl sm:text-2xl',
}: {
  className?: string;
  iconSize?: string;
  textSize?: string;
}) {
  return (
    <Link
      href="/"
      onClick={() => playBlip()}
      aria-label="Arcadia Home"
      className={cn('inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95', className)}
    >
      <div className={cn('relative flex items-center justify-center transition-transform duration-300 group-hover:rotate-12', iconSize)}>
        {/* Ambient glow behind star */}
        <div className="absolute inset-0 bg-[#F0A352]/25 blur-md rounded-full pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#F0A352] drop-shadow-[0_0_8px_rgba(240,163,82,0.6)]"
        >
          <path
            d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
            fill="url(#arcadiaAmberGrad)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="12" r="2.2" fill="#0D0B09" />
          <circle cx="12" cy="12" r="1.1" fill="#FFF8F0" />
          <defs>
            <linearGradient id="arcadiaAmberGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFC078" />
              <stop offset="50%" stopColor="#F0A352" />
              <stop offset="100%" stopColor="#C96F3B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-heading font-black tracking-[0.2em] text-[#FFF8F0] uppercase leading-none select-none drop-shadow',
            textSize
          )}
        >
          ARCADIA
        </span>
        <span className="text-[9px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-mono mt-0.5 select-none hidden sm:block font-bold">
          Gaming Sanctuary
        </span>
      </div>
    </Link>
  );
}

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll offset to adjust navbar translucency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        isScrolled
          ? 'bg-[#0D0B09]/92 backdrop-blur-xl border-b border-[rgba(240,163,82,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-3'
          : 'bg-gradient-to-b from-[#0D0B09]/95 via-[#0D0B09]/50 to-transparent py-4 sm:py-5',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-8">
            <ArcadiaLogo />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link: NavLink) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => playBlip()}
                    className={cn(
                      'relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-lg flex items-center gap-2 select-none',
                      isActive
                        ? 'text-[#FFF8F0] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[#FFF8F0]'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.25)] rounded-lg -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {getNavIcon(link.icon)}
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] ml-0.5 shadow-[0_0_8px_#F0A352]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Auth / Dashboard CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dashboard"
              onClick={() => playBlip()}
              className="px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[#FFF8F0] hover:bg-[var(--surface-primary)] border border-transparent hover:border-[rgba(240,163,82,0.2)] rounded-lg transition-all duration-200"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              onClick={() => playBlip()}
              className="px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[#FFF8F0] hover:bg-[var(--surface-primary)] border border-transparent hover:border-[rgba(240,163,82,0.2)] rounded-lg transition-all duration-200"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              onClick={() => playBlip()}
              className="gaming-btn-primary text-sm font-bold px-4 py-2 rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0D0B09]" />
              <span>Join Arcadia</span>
            </Link>
          </div>

          {/* Mobile: Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/signup"
              onClick={() => playBlip()}
              className="gaming-btn-primary text-xs font-bold px-3 py-1.5 rounded-md sm:hidden"
            >
              Join
            </Link>
            <button
              type="button"
              onClick={() => {
                playBlip();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[#FFF8F0] bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[var(--accent-primary)]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-b border-[rgba(240,163,82,0.2)] bg-[#0D0B09]/98 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4 max-w-md mx-auto">
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link: NavLink) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => playBlip()}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors',
                        isActive
                          ? 'bg-[var(--surface-primary)] text-[#FFF8F0] border border-[var(--accent-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-primary)] hover:text-[#FFF8F0]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {getNavIcon(link.icon)}
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[rgba(240,163,82,0.15)] flex flex-col gap-2.5">
                <Link
                  href="/dashboard"
                  onClick={() => playBlip()}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-[#FFF8F0] bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)]"
                >
                  Player Dashboard
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => playBlip()}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[#FFF8F0] bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => playBlip()}
                    className="gaming-btn-primary w-full text-center py-2.5 rounded-lg text-sm font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
