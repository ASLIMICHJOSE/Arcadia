'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Calendar,
  Sparkles,
  Users,
  Shield,
  Swords,
} from 'lucide-react';
import { GlassPanel, LeaderboardPreview } from '@/components/ui';
import { DEMO_LEADERBOARD, LeaderboardEntry } from '@/lib/constants';

type TimeFilter = 'All Time' | 'This Month' | 'This Week';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TimeFilter>('All Time');

  const topThree = DEMO_LEADERBOARD.slice(0, 3);
  const rank1 = topThree[0];
  const rank2 = topThree[1];
  const rank3 = topThree[2];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header with Time Filter Tabs */}
      <div className="border-b border-[var(--glass-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
            <Trophy size={14} />
            <span>Coliseum Pantheon</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
          >
            Leaderboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
            The hall of champions. Honor to the tacticians whose scores and victories echo across the frontier.
          </p>
        </div>

        {/* Visual Time Filter Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] self-start md:self-auto">
          {(['All Time', 'This Month', 'This Week'] as TimeFilter[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#100F0D] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="leaderboard-active-tab"
                    className="absolute inset-0 bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-dark)] rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
        {/* Rank 2 (Silver) */}
        {rank2 && (
          <GlassPanel
            hover
            padding="lg"
            className="order-2 md:order-1 text-center relative border-slate-400/30 bg-slate-900/20"
          >
            <div className="w-12 h-12 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md font-bold">
              <Medal size={24} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Rank 2 • Archon
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] mt-1">
              {rank2.name}
            </h3>
            <p className="text-xl font-mono font-bold text-slate-300 mt-2">
              {rank2.score.toLocaleString()} <span className="text-xs font-sans text-[var(--text-muted)]">pts</span>
            </p>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              {rank2.wins} wins • {rank2.winRate || '76%'}
            </span>
          </GlassPanel>
        )}

        {/* Rank 1 (Gold, elevated) */}
        {rank1 && (
          <GlassPanel
            hover
            padding="lg"
            className="order-1 md:order-2 text-center relative border-[var(--gold)] shadow-[var(--gold-glow)] bg-gradient-to-b from-[#2B241C] to-[#191713] md:-translate-y-3"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--gold)] text-[#100F0D] text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1">
              <Crown size={12} className="fill-current" />
              <span>Current Imperator</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-[#100F0D] flex items-center justify-center mx-auto mt-2 mb-3 shadow-xl font-bold">
              <Crown size={32} className="fill-current" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gold)]">
              Rank 1 • {rank1.badge || 'Imperator'}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[var(--gold-light)] mt-1">
              {rank1.name}
            </h3>
            <p className="text-2xl font-mono font-bold text-[var(--gold)] mt-2">
              {rank1.score.toLocaleString()} <span className="text-xs font-sans text-[var(--text-muted)]">pts</span>
            </p>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              {rank1.wins} wins • {rank1.winRate || '79%'}
            </span>
          </GlassPanel>
        )}

        {/* Rank 3 (Bronze) */}
        {rank3 && (
          <GlassPanel
            hover
            padding="lg"
            className="order-3 text-center relative border-amber-700/40 bg-amber-950/20"
          >
            <div className="w-12 h-12 rounded-full bg-[#A58055] text-amber-50 flex items-center justify-center mx-auto mb-3 shadow-md font-bold">
              <Medal size={24} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DFCA9B]">
              Rank 3 • Centurion
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] mt-1">
              {rank3.name}
            </h3>
            <p className="text-xl font-mono font-bold text-[#DFCA9B] mt-2">
              {rank3.score.toLocaleString()} <span className="text-xs font-sans text-[var(--text-muted)]">pts</span>
            </p>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              {rank3.wins} wins • {rank3.winRate || '74%'}
            </span>
          </GlassPanel>
        )}
      </div>

      {/* Full Leaderboard Component with limit 10 */}
      <LeaderboardPreview
        entries={DEMO_LEADERBOARD}
        limit={10}
        title={`All Contenders (${activeTab})`}
        viewAllHref="/dashboard/leaderboard"
      />
    </div>
  );
}
