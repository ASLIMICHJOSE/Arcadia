'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Calendar,
  Flame,
  Shield,
  Clock,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeaderboardPreview from '@/components/ui/LeaderboardPreview';
import GlassPanel from '@/components/ui/GlassPanel';
import { DEMO_LEADERBOARD } from '@/lib/constants';

type Timeframe = 'all-time' | 'month' | 'week';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Timeframe>('all-time');

  const tabsList = [
    { id: 'all-time' as Timeframe, label: 'All Time', icon: Crown },
    { id: 'month' as Timeframe, label: 'This Month', icon: Calendar },
    { id: 'week' as Timeframe, label: 'This Week', icon: Flame },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* ========================================================================= */}
        {/* HERO BANNER                                                              */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[38vh] md:min-h-[42vh] flex items-center justify-center overflow-hidden border-b border-[var(--glass-border)]">
          {/* Layered Cinematic Dusk / Gold Atmosphere */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 60%, rgba(224, 159, 62, 0.16) 0%, rgba(142, 62, 18, 0.12) 40%, transparent 75%),
                linear-gradient(180deg, #131018 0%, #1A141A 40%, #281711 75%, #100F0D 100%)
              `,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/30 pointer-events-none" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30 bg-[rgba(197,164,109,0.08)] backdrop-blur-md text-[var(--gold)] font-mono text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            >
              <Trophy className="w-3.5 h-3.5" />
              HALL OF CHAMPIONS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
            >
              Global Leaderboard
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
            >
              The apex tacticians of Arcadia. Triumphs recorded, scores validated,
              and legends etched into the gilded pantheon.
            </motion.p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LEADERBOARD BODY                                                         */}
        {/* ========================================================================= */}
        <section className="relative w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Podium Highlights (Top 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <GlassPanel padding="md" className="text-center relative pt-8 border-slate-400/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-bold flex items-center justify-center text-xs shadow-md">
                  2
                </div>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-slate-300 p-0.5 bg-slate-800 flex items-center justify-center font-serif text-lg font-bold text-slate-200">
                  SW
                </div>
                <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                  SolonTheWise
                </h3>
                <span className="text-xs font-mono text-[var(--gold)]">Archon • 76% Win Rate</span>
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Score</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">114,890</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Wins</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">589</span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* 1st Place (Crown) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 md:order-2 -mt-2 md:-mt-4"
            >
              <GlassPanel
                padding="lg"
                className="text-center relative pt-9 border-[var(--gold)] shadow-[var(--gold-glow)] bg-[rgba(33,28,22,0.85)]"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[#DFCA9B] to-[#C5A46D] text-[#100F0D] font-bold flex items-center justify-center shadow-lg border border-white/40">
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <div className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[var(--gold)] p-0.5 bg-[var(--surface-elevated)] flex items-center justify-center font-serif text-2xl font-bold text-[var(--gold)] shadow-md">
                  AP
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/40 text-[var(--gold)] text-[10px] font-mono uppercase tracking-wider mb-1 font-semibold">
                  CHAMPION OF THE REALM
                </div>
                <h3 className="font-serif font-bold text-xl text-[var(--text-primary)]">
                  Aurelius_Prime
                </h3>
                <span className="text-xs font-mono text-[var(--gold-light)]">Imperator • 79% Win Rate</span>
                <div className="mt-4 pt-3 border-t border-[var(--gold)]/30 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Score</span>
                    <span className="font-mono font-bold text-lg text-[var(--gold)]">128,450</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Wins</span>
                    <span className="font-mono font-bold text-lg text-[var(--text-primary)]">642</span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="order-3"
            >
              <GlassPanel padding="md" className="text-center relative pt-8 border-[#CD7F32]/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#CD7F32] text-[#100F0D] font-bold flex items-center justify-center text-xs shadow-md">
                  3
                </div>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-[#CD7F32] p-0.5 bg-amber-950/40 flex items-center justify-center font-serif text-lg font-bold text-amber-200">
                  AV
                </div>
                <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                  AthenaVanguard
                </h3>
                <span className="text-xs font-mono text-[var(--gold)]">Centurion • 74% Win Rate</span>
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Score</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">98,340</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Wins</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">497</span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Filter Tabs Bar (All Time, This Month, This Week) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[var(--surface)] p-2 rounded-2xl border border-[var(--glass-border)]">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {tabsList.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[var(--gold-gradient)] text-[#100F0D] shadow-[var(--gold-glow-sm)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Season countdown indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-muted)] font-mono">
              <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Season 1 ends in: 14d 06h</span>
            </div>
          </div>

          {/* Full LeaderboardPreview with Limit 10 */}
          <LeaderboardPreview
            entries={DEMO_LEADERBOARD}
            limit={10}
            title="Season 1 Tier Standings"
            viewAllHref="#full-rules"
          />

          {/* Competitive Rules & Scoring Glass Banner */}
          <div id="full-rules" className="mt-12">
            <GlassPanel padding="lg" className="border-[var(--glass-border)]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--gold)] uppercase font-semibold">
                    <Shield className="w-4 h-4" />
                    Ranked Competitive Protocol
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                    How Ranking Points Are Calculated
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] max-w-xl">
                    Rankings update in real time based on victory streaks, match difficulty multipliers,
                    and opponent Elo ratings. Seasonal rewards include bespoke profile titles and golden sigils.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="gold-btn px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0"
                >
                  <span>Start Climbing</span>
                </Link>
              </div>
            </GlassPanel>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
