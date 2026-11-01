'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, ArrowRight, Swords } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { DEMO_LEADERBOARD, LeaderboardEntry } from '@/lib/constants';

export interface LeaderboardPreviewProps {
  entries?: readonly LeaderboardEntry[] | LeaderboardEntry[];
  limit?: number;
  title?: string;
  viewAllHref?: string;
  className?: string;
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
};

function getRankBadge(rank: number) {
  if (rank === 1) {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-[#100F0D] shrink-0"
        style={{
          background: 'var(--gold-gradient, linear-gradient(135deg, #DFCA9B 0%, #C5A46D 100%))',
          boxShadow: 'var(--gold-glow-sm)',
        }}
      >
        <Crown className="w-3.5 h-3.5 fill-current" />
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-slate-300 text-slate-900 shrink-0 shadow-sm">
        <Medal className="w-3.5 h-3.5" />
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-amber-50 shrink-0 shadow-sm"
        style={{ background: 'var(--bronze-light, #A58055)' }}
      >
        <Medal className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface-elevated)] shrink-0 border border-[var(--glass-border)]">
      {rank}
    </div>
  );
}

// Generate consistent initials for avatar placeholder
function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({
  entries = DEMO_LEADERBOARD,
  limit = 5,
  title = 'Global Leaderboard',
  viewAllHref = '/leaderboard',
  className = '',
}) => {
  const displayedEntries = entries.slice(0, limit);

  return (
    <GlassPanel padding="lg" className={`flex flex-col ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[var(--border-radius-sm,8px)] flex items-center justify-center text-[var(--gold)]"
            style={{
              background: 'var(--gold-muted)',
              border: '1px solid var(--glass-border-gold)',
            }}
          >
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3
              className="text-lg font-serif font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              {title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Top arena champions</p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full text-[var(--gold-light)] bg-[var(--gold-muted)] border border-[var(--glass-border-gold)]">
          Live Standings
        </span>
      </div>

      {/* Table-like Staggered Rows */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="space-y-2 flex-1"
      >
        {displayedEntries.map((entry) => {
          const isTopThree = entry.rank <= 3;
          const initials = getInitials(entry.name);
          const formattedScore = new Intl.NumberFormat('en-US').format(entry.score);

          return (
            <motion.div
              key={entry.name + entry.rank}
              variants={rowVariants}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              className={`flex items-center justify-between p-2.5 md:p-3 rounded-[var(--border-radius-md,12px)] transition-all ${
                isTopThree
                  ? 'bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]'
                  : 'hover:bg-[var(--glass-hover)] border border-transparent'
              }`}
            >
              {/* Left Side: Rank, Avatar, Name */}
              <div className="flex items-center gap-3 min-w-0">
                {getRankBadge(entry.rank)}

                {/* Avatar Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[var(--text-primary)] shrink-0 select-none ${
                    entry.rank === 1
                      ? 'ring-2 ring-[var(--gold)] shadow-[var(--gold-glow-sm)]'
                      : entry.rank === 2
                      ? 'ring-1 ring-slate-300'
                      : entry.rank === 3
                      ? 'ring-1 ring-[#A58055]'
                      : 'border border-[var(--glass-border)]'
                  }`}
                  style={{
                    background:
                      entry.rank === 1
                        ? 'linear-gradient(135deg, #372A1C 0%, #1A1713 100%)'
                        : 'var(--surface-elevated, #2B241C)',
                  }}
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        entry.rank === 1
                          ? 'text-[var(--gold-light)]'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {entry.name}
                    </span>
                    {entry.badge && (
                      <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                        {entry.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] sm:hidden">
                    <span>{entry.wins} wins</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Wins & Score */}
              <div className="flex items-center gap-4 shrink-0 text-right">
                <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Swords className="w-3.5 h-3.5 text-[var(--gold)] opacity-70" />
                  <span>{entry.wins} wins</span>
                </div>

                <div className="text-right min-w-[70px]">
                  <span
                    className={`font-mono text-sm font-bold tracking-tight ${
                      entry.rank === 1
                        ? 'text-[var(--gold)]'
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {formattedScore}
                  </span>
                  <span className="block text-[10px] uppercase font-mono text-[var(--text-muted)]">
                    pts
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Action: View Full Leaderboard */}
      <div className="mt-5 pt-4 border-t border-[var(--glass-border)]">
        <Link
          href={viewAllHref}
          className="group flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors py-1.5 rounded-[var(--border-radius-sm,8px)] hover:bg-[var(--gold-muted)]"
        >
          <span>View Full Leaderboard</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </GlassPanel>
  );
};

export default LeaderboardPreview;
