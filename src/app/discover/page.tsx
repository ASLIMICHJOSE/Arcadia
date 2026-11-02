'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Hourglass,
  Bell,
  ArrowRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import GameGrid from '@/components/ui/GameGrid';
import GlassPanel from '@/components/ui/GlassPanel';
import { FEATURED_GAMES } from '@/lib/constants';
import { playBlip, playEngage } from '@/lib/sound';

// Teaser games currently in production
const UPCOMING_GAMES = [
  {
    id: 'chess-tactics',
    name: 'Royal Tactics',
    category: 'Strategy',
    phase: 'Alpha Testing',
    description: 'Bite-sized tactical chess puzzles and lightning blitz endgames with Elo matchmaking.',
    eta: 'Coming Soon',
    badge: 'In Forge',
  },
  {
    id: 'space-blaster',
    name: 'Celestial Vector',
    category: 'Arcade',
    phase: 'In Development',
    description: 'Fluid retro bullet-patterns and geometric score cascades set to classical synth scores.',
    eta: 'Next Season',
    badge: 'Prototyping',
  },
  {
    id: 'word-forge',
    name: 'Lexicon Vault',
    category: 'Puzzle',
    phase: 'Concept Phase',
    description: 'Anagram trials and ancient anagrammatic cyphers against the descending hourglass.',
    eta: 'Future Expansion',
    badge: 'Planned',
  },
];

export default function DiscoverPage() {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setNotified(true);
      playEngage();
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-8 select-none">
        {/* Header Banner */}
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#291010] via-[#351414] to-[#220C0C] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative shadow-xl">
          <div className="max-w-xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-xs font-mono font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>THE ARCADIA ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Games Library &amp; Arenas
            </h1>
            <p className="text-xs sm:text-sm text-[#C7A9A3] leading-relaxed">
              Curated catalog of casual strategy, retro arcade, and tactical puzzle arenas.
              Instant browser play with offline PWA acceleration.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              href="/community"
              onClick={() => playBlip()}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <span>Suggest Title</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Available Games Grid */}
        <section>
          <GameGrid
            games={FEATURED_GAMES}
            showSearch={true}
            showFilters={true}
            title="Available Titles"
            subtitle="Choose an arena to begin your ascension."
          />
        </section>

        {/* Upcoming Titles Pipeline */}
        <section className="pt-6 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <Hourglass className="w-4 h-4 text-[#E34242]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E34242] font-semibold">
                  DEVELOPMENT PIPELINE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#FFF5F0]">
                More Games Coming Soon
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {UPCOMING_GAMES.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
              >
                <GlassPanel
                  padding="md"
                  className="h-full flex flex-col justify-between bg-[#291010]/90 border-white/[0.08] hover:border-[#E34242]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#C7A9A3]">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] font-semibold">
                        <Flame className="w-3 h-3 text-[#E34242]" />
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-heading font-bold text-white mb-1.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#C7A9A3] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#987B77] font-mono">
                    <span>Target: {item.eta}</span>
                    <span className="text-[#E34242] font-semibold">In Forge</span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          {/* Early Access Notification Callout */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-[#291010]/95 border border-white/[0.08] text-center max-w-2xl mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] flex items-center justify-center mx-auto mb-3 shadow-[0_0_16px_rgba(227,66,66,0.3)]">
              <Bell className="w-5 h-5" />
            </div>

            <h3 className="text-lg sm:text-xl font-heading font-bold text-[#FFF5F0]">
              Be First to Test New Releases
            </h3>

            <p className="text-xs sm:text-sm text-[#C7A9A3] mt-1 mb-4">
              Get invitations to closed playtests and shape the next generation of Arcadia titles.
            </p>

            {notified ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>You&apos;re on the early access priority list!</span>
              </div>
            ) : (
              <form
                onSubmit={handleNotifySubmit}
                className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-2 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs sm:text-sm text-[#FFF5F0] placeholder-[#987B77] focus:outline-none focus:border-[#E34242]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E34242] hover:bg-[#F05555] text-white text-xs font-bold shadow-md transition-all whitespace-nowrap w-full sm:w-auto cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
