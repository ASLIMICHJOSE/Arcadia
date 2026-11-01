'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Play,
  Calendar,
  RotateCcw,
  Trophy,
  Sparkles,
  Swords,
  Brain,
  Clock,
  Star,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui';
import { FEATURED_GAMES, FeaturedGame } from '@/lib/constants';

interface GameLibraryMeta {
  lastPlayed: string;
  playCount: number;
  highScore: number;
  winRate: string;
}

const DEMO_LIBRARY_DATA: Record<string, GameLibraryMeta> = {
  'tic-tac-toe': {
    lastPlayed: 'Today, 4:15 PM',
    playCount: 94,
    highScore: 1840,
    winRate: '78%',
  },
  snake: {
    lastPlayed: 'Yesterday, 9:30 PM',
    playCount: 112,
    highScore: 8420,
    winRate: '68%',
  },
  'memory-match': {
    lastPlayed: '3 days ago',
    playCount: 42,
    highScore: 4190,
    winRate: '82%',
  },
  'rock-paper-scissors': {
    lastPlayed: '5 days ago',
    playCount: 56,
    highScore: 2450,
    winRate: '71%',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function MyGamesPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-[var(--glass-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
            <Gamepad2 size={14} />
            <span>Player Vault</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
          >
            My Games
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
            Your personal collection of frontier trials. Launch straight into combat, review career duel records, and set new personal bests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/discover"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] text-[var(--gold-light)] hover:bg-[var(--glass-hover)] transition-all flex items-center gap-2"
          >
            <Sparkles size={14} className="text-[var(--gold)]" />
            <span>Discover More</span>
          </Link>
        </div>
      </div>

      {/* Library Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {FEATURED_GAMES.map((game: FeaturedGame) => {
          const meta = DEMO_LIBRARY_DATA[game.slug] || {
            lastPlayed: 'Recently',
            playCount: 18,
            highScore: 1200,
            winRate: '65%',
          };

          return (
            <motion.div key={game.id} variants={itemVariants}>
              <GlassPanel
                hover
                padding="none"
                className="overflow-hidden border-[var(--glass-border)] group flex flex-col sm:flex-row h-full transition-all duration-300 hover:border-[var(--glass-border-hover)]"
              >
                {/* Artwork Column / Graphic Accent */}
                <div className="sm:w-48 h-44 sm:h-auto relative overflow-hidden bg-[var(--surface-elevated)] flex items-center justify-center p-6 flex-shrink-0">
                  <div
                    className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at center, rgba(197, 164, 109, 0.3) 0%, rgba(16, 15, 13, 0.95) 100%)',
                    }}
                  />
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#100F0D]/80 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold-light)] shadow-lg group-hover:rotate-6 transition-transform">
                    {game.category === 'Strategy' ? (
                      <Swords size={30} />
                    ) : game.category === 'Arcade' ? (
                      <Gamepad2 size={30} />
                    ) : (
                      <Brain size={30} />
                    )}
                  </div>
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-black/60 text-[var(--gold-light)] border border-[var(--glass-border-gold)]">
                      {game.category}
                    </span>
                  </div>
                </div>

                {/* Details Column */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h2
                        className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
                      >
                        {game.name}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-[var(--gold-light)]">
                        <Star size={13} className="fill-[var(--gold)] text-[var(--gold)]" />
                        <span>{game.rating?.toFixed(1) || '4.8'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                      {game.description}
                    </p>

                    {/* Stats Metrics: Last Played & Play Count */}
                    <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-[var(--glass-border)] mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                          <Calendar size={11} />
                          Last Played
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                          {meta.lastPlayed}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                          <RotateCcw size={11} />
                          Total Matches
                        </span>
                        <span className="text-xs font-semibold text-[var(--gold-light)] mt-0.5 font-mono">
                          {meta.playCount} played ({meta.winRate} win)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
                      <Trophy size={13} className="text-[var(--gold)]" />
                      <span>Best: {meta.highScore.toLocaleString()}</span>
                    </div>

                    <Link
                      href={`/games/${game.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--bronze)] text-[#100F0D] hover:from-[var(--gold-light)] hover:to-[var(--gold-dark)] shadow-[var(--gold-glow-sm)] transition-all active:scale-95 cursor-pointer"
                    >
                      <Play size={13} className="fill-current" />
                      <span>Launch Duel</span>
                    </Link>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
