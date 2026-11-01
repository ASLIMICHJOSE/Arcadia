'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  Gamepad2,
  ArrowUpRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { ArcadiaLogo } from './Navbar';
import { NAV_LINKS, FEATURED_GAMES } from '@/lib/constants';

// Clean SVG Brand Icons
const TwitterIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const YoutubeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface FooterSocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SOCIAL_LINKS: readonly FooterSocialLink[] = [
  { name: 'Discord', href: 'https://discord.gg', icon: MessageSquare },
  { name: 'Twitter', href: 'https://twitter.com', icon: TwitterIcon },
  { name: 'GitHub', href: 'https://github.com', icon: GithubIcon },
  { name: 'YouTube', href: 'https://youtube.com', icon: YoutubeIcon },
  { name: 'Twitch', href: 'https://twitch.tv', icon: Gamepad2 },
];

const GAMES_LINKS = [
  { label: 'Tic-Tac-Toe', href: '/games/tic-tac-toe', tag: 'Turn-based' },
  { label: 'Snake', href: '/games/snake', tag: 'Fast-paced' },
  { label: 'Memory Match', href: '/games/memory-match', tag: 'Puzzle' },
  { label: 'Rock Paper Scissors', href: '/games/rock-paper-scissors', tag: 'Mindgame' },
];

const SUPPORT_LINKS = [
  { label: 'Help Center', href: '/help' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="w-full bg-[var(--background-secondary)] border-t border-[var(--glass-border)] text-[var(--text-secondary)] relative overflow-hidden">
      {/* Subtle background ambient radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-[radial-gradient(ellipse_at_top,_var(--gold)_0%,_transparent_70%)] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[var(--glass-border)]/60">
          {/* Column 1: Arcadia Logo, Tagline & Social Links */}
          <div className="flex flex-col space-y-5 lg:pr-4">
            <ArcadiaLogo />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-normal">
              The premier neoclassical gaming arena. Reimagining timeless strategy and arcade classics for a new era of competitive prestige and global glory.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Arcadia on ${item.name}`}
                    className="w-9 h-9 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] hover:border-[var(--gold)]/50 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--gold)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(197,164,109,0.2)]"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col space-y-4">
            <h3
              className="font-serif text-sm font-semibold tracking-wider text-[var(--text-primary)] uppercase flex items-center gap-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              Platform
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] hover:translate-x-1 transition-all duration-200"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] hover:translate-x-1 transition-all duration-200"
                >
                  <span>Player Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Games Links */}
          <div className="flex flex-col space-y-4">
            <h3
              className="font-serif text-sm font-semibold tracking-wider text-[var(--text-primary)] uppercase flex items-center gap-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              Classic Games
            </h3>
            <ul className="space-y-2.5">
              {GAMES_LINKS.map((game) => (
                <li key={game.href}>
                  <Link
                    href={game.href}
                    className="group inline-flex items-center justify-between w-full max-w-[200px] text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] hover:translate-x-1 transition-all duration-200"
                  >
                    <span>{game.label}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--text-muted)] group-hover:text-[var(--gold)] group-hover:bg-[var(--gold)]/10 transition-colors">
                      {game.tag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support Links */}
          <div className="flex flex-col space-y-4">
            <h3
              className="font-serif text-sm font-semibold tracking-wider text-[var(--text-primary)] uppercase flex items-center gap-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              Support & Legal
            </h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] hover:translate-x-1 transition-all duration-200"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Fair play commitment badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-xs text-[var(--text-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Fair Play Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright 2024 Arcadia, "Crafted with passion for gaming" */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© 2024 Arcadia. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span>Crafted with passion for gaming</span>
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] inline-block" />
          </div>

          {/* Operational status */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[var(--text-muted)] text-[11px] font-mono">Arena Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
