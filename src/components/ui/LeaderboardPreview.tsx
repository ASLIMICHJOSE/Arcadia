'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, ArrowRight } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { DEMO_LEADERBOARD, LeaderboardEntry } from '@/lib/constants';
import { playBlip } from '@/lib/sound';

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
        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-[#0D0B09] shrink-0 shadow-[0_0_12px_rgba(240,163,82,0.6)]"
        style={{
          background: 'linear-gradient(135deg, #FFC078 0%, #F0A352 50%, #D97706 100%)',
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
        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-amber-100 shrink-0 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #C96F3B 0%, #8D542E 100%)' }}
      >
        <Medal className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface-secondary)] shrink-0 border border-[var(--border-subtle)]">
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
  title = 'Global Standings',
  viewAllHref = '/leaderboard',
  className = '',
}) => {
  const displayedEntries = entries.slice(0, limit);

  return (
    <GlassPanel padding="lg" showFlare className={`flex flex-col bg-[var(--surface-primary)] border-white/[0.08] ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#E34242] bg-[var(--surface-secondary)] border border-[#E34242]/35 shadow-[0_0_12px_rgba(227,66,66,0.25)]"
          >
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-black text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Top arena champions</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full text-[#E34242] bg-[#E34242]/12 border border-[#E34242]/35 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34242]" />
          Live Standings
        </span>
      </div>

      {/* Table-like Staggered Rows */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
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
              whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
              className={`flex items-center justify-between p-2.5 md:p-3 rounded-xl transition-all ${
                isTopThree
                  ? 'bg-[var(--surface-secondary)]/85 border border-[#E34242]/25 shadow-sm hover:border-[#E34242]/60'
                  : 'hover:bg-[var(--surface-secondary)]/55 border border-transparent hover:border-white/[0.08]'
              }`}
            >
              {/* Left Side: Rank, Avatar, Name */}
              <div className="flex items-center gap-3 min-w-0">
                {getRankBadge(entry.rank)}

                {/* Avatar Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[var(--text-primary)] shrink-0 select-none ${
                    entry.rank === 1
                      ? 'ring-2 ring-[var(--accent-primary)] shadow-[0_0_10px_rgba(240,163,82,0.5)]'
                      : entry.rank === 2
                      ? 'ring-1 ring-slate-300'
                      : entry.rank === 3
                      ? 'ring-1 ring-[#C96F3B]'
                      : 'border border-[var(--border-subtle)]'
                  }`}
                  style={{
                    background:
                      entry.rank === 1
                        ? 'linear-gradient(135deg, #241D17 0%, #14100D 100%)'
                        : 'var(--surface-secondary)',
                  }}
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
                      {entry.name}
                    </span>
                    {entry.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-elevated)] border border-[rgba(240,163,82,0.2)] text-[var(--accent-primary)] shrink-0 hidden sm:inline">
                        {entry.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono block">
                    {entry.wins} wins {entry.winRate && `• ${entry.winRate}`}
                  </span>
                </div>
              </div>

              {/* Right Side: Score Metric */}
              <div className="text-right shrink-0 pl-3">
                <span className="font-mono font-bold text-sm sm:text-base text-[var(--accent-primary)] block">
                  {formattedScore}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                  ELO Points
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer Link to Full Hall of Champions */}
      {viewAllHref && (
        <div className="pt-4 mt-3 border-t border-[rgba(240,163,82,0.15)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">
            Rankings reset in 4d 18h
          </span>
          <Link
            href={viewAllHref}
            onClick={() => playBlip()}
            className="text-xs font-semibold text-[var(--accent-primary)] hover:text-white transition-colors inline-flex items-center gap-1.5 group font-mono uppercase tracking-wider ml-auto"
          >
            <span>View Full Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </GlassPanel>
  );
};

export default LeaderboardPreview;
