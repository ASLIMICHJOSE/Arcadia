'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Trophy,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  Flame,
} from 'lucide-react';
import {
  GlassPanel,
  StatCard,
  GameCard,
  PlayerProfile,
  ActivityFeed,
  LeaderboardPreview,
} from '@/components/ui';
import {
  FEATURED_GAMES,
  DEMO_PLAYER,
  DEMO_STATS,
  DEMO_ACTIVITY,
  DEMO_LEADERBOARD,
} from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function DashboardOverviewPage() {
  const recentlyPlayedGames = FEATURED_GAMES.slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--glass-border)]"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
            <Sparkles size={14} />
            <span>Frontier Dispatch</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
          >
            Welcome back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7F48]">
              {DEMO_PLAYER.username}
            </span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">
            Your battlefield telemetry is synced. Challenge challengers or claim new accolades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] flex items-center gap-2 text-xs">
            <Flame size={16} className="text-[#E09F3E]" />
            <span className="text-[var(--text-secondary)]">Daily Streak:</span>
            <span className="font-bold text-[var(--gold-light)] font-mono">7 Days</span>
          </div>
        </div>
      </motion.div>

      {/* 4 StatCards in a Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        <StatCard
          label="Games Played"
          value={DEMO_STATS.gamesPlayed}
          icon={Gamepad2}
          trend="+14% this week"
          helperText="Across all active arenas"
          delay={0.05}
        />
        <StatCard
          label="Wins"
          value={DEMO_STATS.wins}
          icon={Trophy}
          trend={{ value: '74% Win Rate', isUp: true }}
          helperText="Competitive triumph tally"
          delay={0.1}
        />
        <StatCard
          label="Total Score"
          value={new Intl.NumberFormat('en-US').format(DEMO_STATS.totalScore)}
          icon={Star}
          trend="+2,450 pts"
          helperText="Frontier prestige score"
          delay={0.15}
        />
        <StatCard
          label="Playtime"
          value={DEMO_STATS.playtime}
          icon={Clock}
          trend="+6h this week"
          helperText="Total sanctuary immersion"
          delay={0.2}
        />
      </motion.div>

      {/* 2-Column Section: Recently Played & Player Profile */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left Column: Recently Played (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <GlassPanel padding="lg" className="flex flex-col h-full">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--glass-border)]">
              <div>
                <h2
                  className="text-xl font-serif font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
                >
                  Recently Played
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Continue your duel or beat your highscore
                </p>
              </div>

              <Link
                href="/dashboard/games"
                className="group flex items-center gap-1.5 text-xs font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
              >
                <span>View Library</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentlyPlayedGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  delay={0.1 * idx}
                />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Player Profile (5 cols) */}
        <div className="lg:col-span-5">
          <PlayerProfile
            player={DEMO_PLAYER}
            stats={DEMO_STATS}
          />
        </div>
      </motion.div>

      {/* Activity Feed Section */}
      <motion.div variants={itemVariants}>
        <ActivityFeed
          activities={DEMO_ACTIVITY}
          limit={6}
          title="Recent Activity"
        />
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div variants={itemVariants}>
        <LeaderboardPreview
          entries={DEMO_LEADERBOARD}
          limit={5}
          title="Arena Leaderboard"
          viewAllHref="/dashboard/leaderboard"
        />
      </motion.div>
    </motion.div>
  );
}
