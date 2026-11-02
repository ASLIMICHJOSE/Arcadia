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
import { NAV_LINKS } from '@/lib/constants';
import { playBlip } from '@/lib/sound';

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
  { label: 'Memory Match', href: '/games/memory-match', tag: 'Tactical' },
  { label: 'Rock Paper Scissors', href: '/games/rock-paper-scissors', tag: 'Mindgame' },
];

const SUPPORT_LINKS = [
  { label: 'Community Hub', href: '/community' },
  { label: 'Leaderboards', href: '/leaderboard' },
  { label: 'Game Discovery', href: '/discover' },
  { label: 'Player Dashboard', href: '/dashboard' },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0D0B09] border-t border-[rgba(240,163,82,0.18)] text-[var(--text-secondary)] relative overflow-hidden font-sans">
      {/* Top amber flare line */}
      <div className="top-amber-flare" />

      {/* Subtle background ambient warm amber glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-[radial-gradient(ellipse_at_top,_#F0A352_0%,_transparent_70%)] opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[rgba(240,163,82,0.12)]">
          {/* Column 1: Brand & Social Links */}
          <div className="flex flex-col space-y-5 lg:pr-4">
            <ArcadiaLogo />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-normal">
              The premier cinematic gaming arena. Reimagining timeless strategy and arcade classics for a new era of competitive prestige and global duels.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Arcadia on ${item.name}`}
                    className="w-9 h-9 rounded-lg bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[#FFF8F0] hover:border-[var(--accent-primary)] hover:bg-[var(--surface-secondary)] transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#FFF8F0] uppercase tracking-wider mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => playBlip()}
                    className="text-sm text-[var(--text-secondary)] hover:text-[#FFF8F0] transition-colors duration-150 inline-flex items-center gap-1.5 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-primary)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Featured Games */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#FFF8F0] uppercase tracking-wider mb-5">
              Featured Titles
            </h4>
            <ul className="space-y-3">
              {GAMES_LINKS.map((game) => (
                <li key={game.label}>
                  <Link
                    href={game.href}
                    onClick={() => playBlip()}
                    className="text-sm text-[var(--text-secondary)] hover:text-[#FFF8F0] transition-colors duration-150 flex items-center justify-between group"
                  >
                    <span>{game.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] text-[var(--text-muted)] group-hover:border-[var(--accent-primary)] group-hover:text-[#FFF8F0] transition-colors">
                      {game.tag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Sanctuary Overview */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#FFF8F0] uppercase tracking-wider mb-5">
              Player Hub
            </h4>
            <ul className="space-y-3 mb-6">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => playBlip()}
                    className="text-sm text-[var(--text-secondary)] hover:text-[#FFF8F0] transition-colors duration-150 inline-flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Fair Play Emblem */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FFF8F0]">Fair Play Guaranteed</span>
                <span className="text-[11px] text-[var(--text-muted)]">Verified deterministic matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            &copy; {new Date().getFullYear()} Arcadia Gaming Hub. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>PWA Ready &bull; Offline Supported</span>
            <span className="flex items-center gap-1.5">
              Crafted for players <Heart className="w-3 h-3 text-[var(--accent-primary)] fill-[var(--accent-primary)]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
