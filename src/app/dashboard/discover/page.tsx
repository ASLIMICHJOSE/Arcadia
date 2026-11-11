'use client';

import React from 'react';
import { Compass, Sparkles, Hourglass } from 'lucide-react';
import { GameGrid, GlassPanel } from '@/components/ui';
import { CyberReveal } from '@/components/motion';
import { FEATURED_GAMES } from '@/lib/constants';

export default function DiscoverPage() {
  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-primary)] mb-1">
          <Compass size={14} />
          <span>Arcadia Coliseum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)] tracking-tight">
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
      <CyberReveal delay={0.1}>
        <GlassPanel
          padding="lg"
          className="relative overflow-hidden bg-[var(--surface-primary)] border border-[rgba(227,66,66,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(227,66,66,0.15)] border border-[rgba(227,66,66,0.35)] flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
              <Hourglass size={26} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-primary)] bg-[rgba(227,66,66,0.12)] border border-[rgba(227,66,66,0.3)] mb-1.5">
                <Sparkles size={11} />
                <span>Tactical Pipeline</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-[var(--text-primary)]">
                More Games Arriving Soon
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
                Our architects and game theorists are forging Chess Blitz, Texas Hold&apos;em, Word Scramble, and Minesweeper Duel. New arena drops occur regularly.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] px-4 py-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
              Phase II: Active Season
            </span>
          </div>
        </GlassPanel>
      </CyberReveal>
    </div>
  );
}
