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
      showFlare
      className={`relative overflow-hidden bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background ambient warm amber glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-52 h-52 rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #F0A352 0%, transparent 70%)',
        }}
      />

      {/* Top Section: Avatar, Username, Title, Join Date */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar Circle with Level Badge */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-heading text-2xl md:text-3xl font-black text-[#0D0B09] select-none border-2 border-[var(--accent-primary)] bg-gradient-to-br from-[#FFC078] via-[#F0A352] to-[#C96F3B] shadow-[0_0_20px_rgba(240,163,82,0.45)]">
            {initials}
          </div>

          {/* Level Badge Overlay */}
          <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white border border-white/20 shadow-md flex items-center gap-1 bg-gradient-to-r from-[#C96F3B] to-[#F0A352]">
            <Shield className="w-3 h-3 fill-current text-white" />
            <span>LVL {player.level}</span>
          </div>
        </div>

        {/* Player Identity Information */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#FFF8F0] tracking-tight truncate">
              {player.username}
            </h2>

            {player.title && (
              <span className="inline-flex items-center gap-1 self-center sm:self-auto text-xs font-semibold px-2.5 py-0.5 rounded-full text-[#FFF8F0] bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40">
                <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
                <span>{player.title}</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[var(--text-muted)] mt-1 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Joined {player.joinDate}</span>
          </div>
        </div>
      </div>

      {/* XP Progress Section */}
      <div className="mt-7 pt-5 border-t border-[rgba(240,163,82,0.15)]">
        <div className="flex items-center justify-between text-xs font-medium mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#FFF8F0] font-semibold">
              Level {player.level}
            </span>
            <span className="text-[var(--text-muted)]">&rarr;</span>
            <span className="text-[var(--accent-primary)] font-bold">
              Level {player.level + 1}
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--text-secondary)]">
            <span className="text-[#FFF8F0] font-semibold">{formattedXp}</span>
            <span className="text-[var(--text-muted)]"> / {formattedXpToNext} XP</span>
            <span className="text-[var(--accent-primary)] ml-1.5 font-bold">({xpPercent}%)</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 rounded-full bg-[#0D0B09] border border-[rgba(240,163,82,0.2)] overflow-hidden p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#C96F3B] via-[#F0A352] to-[#FFC078] shadow-[0_0_12px_rgba(240,163,82,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[rgba(240,163,82,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(240,163,82,0.12)] border border-[rgba(240,163,82,0.25)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] font-mono uppercase">Played</div>
              <div className="font-mono font-bold text-sm text-[#FFF8F0]">{stats.gamesPlayed}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] font-mono uppercase">Victories</div>
              <div className="font-mono font-bold text-sm text-[#FFF8F0]">{stats.wins}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/12 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] font-mono uppercase">Rating</div>
              <div className="font-mono font-bold text-sm text-[#FFF8F0]">{stats.totalScore}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)] font-mono uppercase">Playtime</div>
              <div className="font-mono font-bold text-sm text-[#FFF8F0]">{stats.playtime}</div>
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

export default PlayerProfile;
