'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Swords, Hourglass } from 'lucide-react';
import { GameGrid, GlassPanel } from '@/components/ui';
import { FEATURED_GAMES } from '@/lib/constants';

export default function DiscoverPage() {
  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="border-b border-[var(--glass-border)] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
          <Compass size={14} />
          <span>Arcadia Coliseum</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
        >
          Discover Games
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl">
          Explore tactical turn-based matches, high-reflex arcade runs, and psychological card battles. Pick your title and step into the arena.
        </p>
      </div>

      {/* Main GameGrid with Search and Category Filters */}
      <GameGrid
        games={FEATURED_GAMES}
        showSearch={true}
        showFilters={true}
      />

      {/* "More games coming soon" Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        <GlassPanel
          padding="lg"
          className="relative overflow-hidden border border-[var(--glass-border-gold)] bg-gradient-to-r from-[#211C16]/90 via-[#2B241C]/80 to-[#191713]/90 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute -right-10 -bottom-10 w-60 h-60 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
            }}
          />

          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--bronze)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold-light)] flex-shrink-0 shadow-[var(--gold-glow-sm)]">
              <Hourglass size={26} className="animate-pulse" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)] bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] mb-1.5">
                <Sparkles size={11} />
                <span>Frontier Pipeline</span>
              </div>
              <h2
                className="text-xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
              >
                More Games Arriving at the Frontier Soon
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
                Our blacksmiths and game theorists are forging Chess Blitz, Texas Hold&apos;em, Word Scramble, and Minesweeper Duel. New arena drops occur fortnightly.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[var(--gold)] px-3.5 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              Phase II: Winter 2026
            </span>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
