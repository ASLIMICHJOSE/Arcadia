'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, Sparkles, Trophy, Gamepad2, Swords, Clock } from 'lucide-react';
import GlassPanel from './GlassPanel';
import {
  DEMO_PLAYER,
  DEMO_STATS,
  PlayerProfile as PlayerProfileData,
  PlayerStats,
} from '@/lib/constants';

export interface PlayerProfileProps {
  player?: PlayerProfileData | {
    username: string;
    level: number;
    xp: number;
    xpToNext: number;
    avatar: string;
    joinDate: string;
    title?: string;
  };
  stats?: PlayerStats;
  className?: string;
}

// Generate initials from username
function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({
  player = DEMO_PLAYER,
  stats = DEMO_STATS,
  className = '',
}) => {
  const xpPercent = Math.min(100, Math.max(0, Math.round((player.xp / player.xpToNext) * 100)));
  const initials = getInitials(player.username);

  const formattedXp = new Intl.NumberFormat('en-US').format(player.xp);
  const formattedXpToNext = new Intl.NumberFormat('en-US').format(player.xpToNext);

  return (
    <GlassPanel
      padding="lg"
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background ambient decorative glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-52 h-52 rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
        }}
      />

      {/* Top Section: Avatar, Username, Title, Join Date */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar Circle with Level Badge */}
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-serif text-2xl md:text-3xl font-bold text-[var(--gold-light)] select-none border-2 border-[var(--gold)]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #372A1C 0%, #151310 100%)',
              boxShadow: 'var(--gold-glow, 0 0 24px rgba(197, 164, 109, 0.35))',
            }}
          >
            {initials}
          </div>

          {/* Level Badge Overlay */}
          <div
            className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#100F0D] border border-white/30 shadow-md flex items-center gap-1"
            style={{
              background: 'var(--gold-gradient, linear-gradient(135deg, #C5A46D 0%, #80613C 100%))',
            }}
          >
            <Shield className="w-3 h-3 fill-current" />
            <span>LVL {player.level}</span>
          </div>
        </div>

        {/* Player Identity Information */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h2
              className="text-2xl md:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight truncate"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              {player.username}
            </h2>

            {player.title && (
              <span className="inline-flex items-center gap-1 self-center sm:self-auto text-xs font-semibold px-2.5 py-0.5 rounded-full text-[var(--gold)] bg-[var(--gold-muted)] border border-[var(--glass-border-gold)]">
                <Sparkles className="w-3 h-3" />
                <span>{player.title}</span>
              </span>
            )}
          </div>

          {/* Join Date */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[var(--text-muted)] mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Joined {player.joinDate}</span>
          </div>
        </div>
      </div>

      {/* XP Progress Section */}
      <div className="mt-7 pt-5 border-t border-[var(--glass-border)]">
        <div className="flex items-center justify-between text-xs font-medium mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-primary)] font-semibold">
              Level {player.level}
            </span>
            <span className="text-[var(--text-muted)]">&rarr;</span>
            <span className="text-[var(--gold)] font-semibold">
              Level {player.level + 1}
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--text-secondary)]">
            <span className="text-[var(--gold-light)] font-semibold">{formattedXp}</span>
            <span className="text-[var(--text-muted)]"> / {formattedXpToNext} XP</span>
            <span className="text-[var(--text-muted)] ml-1.5">({xpPercent}%)</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            className="h-full rounded-full relative"
            style={{
              background: 'var(--gold-gradient, linear-gradient(135deg, #C5A46D 0%, #80613C 100%))',
              boxShadow: 'var(--gold-glow-sm)',
            }}
          >
            {/* Shimmer light effect at the tip of the bar */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </div>

      {/* Quick Player Stats Grid (if available) */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-[var(--border-radius-md,12px)] bg-[var(--surface-card)] border border-[var(--glass-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--gold)] mb-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Played</span>
            </div>
            <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
              {stats.gamesPlayed}
            </div>
          </div>

          <div className="p-3 rounded-[var(--border-radius-md,12px)] bg-[var(--surface-card)] border border-[var(--glass-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--success)] mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Wins</span>
            </div>
            <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
              {stats.wins}
            </div>
          </div>

          <div className="p-3 rounded-[var(--border-radius-md,12px)] bg-[var(--surface-card)] border border-[var(--glass-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--gold)] mb-1">
              <Swords className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Score</span>
            </div>
            <div className="font-mono text-lg font-bold text-[var(--gold)]">
              {new Intl.NumberFormat('en-US').format(stats.totalScore)}
            </div>
          </div>

          <div className="p-3 rounded-[var(--border-radius-md,12px)] bg-[var(--surface-card)] border border-[var(--glass-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--info)] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Time</span>
            </div>
            <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
              {stats.playtime}
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

export default PlayerProfile;
