'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronRight, Trophy, Users, Compass, Home } from 'lucide-react';
import { NAV_LINKS, type NavLink } from '@/lib/constants';
import { cn } from '@/lib/utils';

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
      return <Sparkles {...iconProps} />;
  }
}

/**
 * Arcadia Logo with stylized 8-point compass star emblem and serif gold wordmark
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
      aria-label="Arcadia Home"
      className={cn('inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95', className)}
    >
      <div className={cn('relative flex items-center justify-center transition-transform duration-300 group-hover:rotate-12', iconSize)}>
        {/* Ambient glow behind star */}
        <div className="absolute inset-0 bg-[var(--gold)]/20 blur-md rounded-full pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[var(--gold)] drop-shadow-[0_0_8px_rgba(197,164,109,0.5)]"
        >
          <path
            d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
            fill="url(#arcadiaStarGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="12" r="2.2" fill="#100F0D" />
          <circle cx="12" cy="12" r="1.1" fill="#DFCA9B" />
          <defs>
            <linearGradient id="arcadiaStarGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DFCA9B" />
              <stop offset="50%" stopColor="#C5A46D" />
              <stop offset="100%" stopColor="#80613C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-serif font-bold tracking-[0.25em] gold-gradient-text uppercase leading-none select-none',
            textSize
          )}
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ARCADIA
        </span>
        <span className="text-[9px] tracking-[0.35em] text-[var(--text-muted)] uppercase font-sans mt-0.5 select-none hidden sm:block">
          Sanctuary of Play
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Monitor scroll offset to adjust background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Determine active nav state
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--glass-border)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-[var(--background)]/40 backdrop-blur-md border-b border-[var(--glass-border)]/60',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Arcadia Logo */}
          <div className="flex-shrink-0 flex items-center">
            <ArcadiaLogo />
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]/40 border border-[var(--glass-border)]/50 backdrop-blur-sm"
          >
            {NAV_LINKS.map((link: NavLink, index: number) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    'relative px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-200 select-none flex items-center gap-1.5',
                    active
                      ? 'text-[var(--gold)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {/* Active background pill */}
                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover underline animation (gold) */}
                  {hoveredIndex === index && !active && (
                    <motion.div
                      layoutId="navbar-hover-underline"
                      className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent rounded-full"
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border border-transparent hover:border-[var(--glass-border)] rounded-lg transition-all duration-200"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              className="gold-btn text-sm font-semibold px-4 py-2 rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#100F0D]" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Mobile: Hamburger Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)] border border-[var(--glass-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[var(--gold)]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 80px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[var(--background)]/98 backdrop-blur-2xl border-t border-[var(--glass-border)] flex flex-col justify-between overflow-y-auto z-40 px-6 py-8"
          >
            {/* Nav list */}
            <div className="flex flex-col space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
                Navigation
              </span>
              {NAV_LINKS.map((link: NavLink, idx: number) => {
                const active = isLinkActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200',
                        active
                          ? 'bg-[var(--gold)]/10 border-[var(--gold)] text-[var(--gold)] font-medium shadow-[0_0_15px_rgba(197,164,109,0.15)]'
                          : 'bg-[var(--surface)]/50 border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--glass-border-hover)]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            active ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                          )}
                        >
                          {getNavIcon(link.icon)}
                        </div>
                        <span className="text-base tracking-wide">{link.label}</span>
                      </div>
                      <ChevronRight className={cn('w-4 h-4', active ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]')} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Auth actions & Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="pt-6 border-t border-[var(--glass-border)] flex flex-col gap-3 pb-8"
            >
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-sm font-medium text-[var(--text-primary)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="gold-btn w-full py-3 text-center text-sm font-semibold rounded-xl"
              >
                <Sparkles className="w-4 h-4 text-[#100F0D]" />
                <span>Sign Up</span>
              </Link>

              <div className="mt-4 pt-4 text-center">
                <p className="text-xs text-[var(--text-muted)]">
                  Arcadia Gaming Sanctuary • Compete & Conquer
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
