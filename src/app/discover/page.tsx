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

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GameGrid from '@/components/ui/GameGrid';
import GlassPanel from '@/components/ui/GlassPanel';
import { FEATURED_GAMES } from '@/lib/constants';

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
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* ========================================================================= */}
        {/* HERO BANNER (~40vh with Atmospheric Background)                          */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[38vh] md:min-h-[42vh] flex items-center justify-center overflow-hidden border-b border-[var(--glass-border)]">
          {/* Layered Dusk & Gold Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 65%, rgba(197, 164, 109, 0.18) 0%, rgba(142, 62, 18, 0.12) 40%, transparent 75%),
                linear-gradient(180deg, #120F16 0%, #1A1417 40%, #261611 75%, #100F0D 100%)
              `,
            }}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/30 pointer-events-none" />

          {/* Banner Text Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30 bg-[rgba(197,164,109,0.08)] backdrop-blur-md text-[var(--gold)] font-mono text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            >
              <Compass className="w-3.5 h-3.5" />
              THE ARCADIA ARCHIVE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
            >
              Discover Games
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
            >
              Explore our curated library of handcrafted casual strategy, arcade, and puzzle games.
              Pure rulesets, neoclassical aesthetics, and instant browser play.
            </motion.p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* GAME GRID WITH SEARCH & FILTERS ENABLED                                  */}
        {/* ========================================================================= */}
        <section className="relative w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <GameGrid
            games={FEATURED_GAMES}
            showSearch={true}
            showFilters={true}
            title="Available Titles"
            subtitle="Choose a game to begin your ascension."
          />
        </section>

        {/* ========================================================================= */}
        {/* MORE GAMES COMING SOON SECTION                                           */}
        {/* ========================================================================= */}
        <section className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--glass-border)]/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Hourglass className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--gold)] font-semibold">
                  DEVELOPMENT PIPELINE
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                More Games Coming Soon
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Our workshop is forging new titles. Vote on mechanics or request early playtest access.
              </p>
            </div>

            <Link
              href="/community"
              className="gold-btn-secondary self-start md:self-auto px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Suggest A Game</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Upcoming Titles 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {UPCOMING_GAMES.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <GlassPanel
                  padding="lg"
                  className="h-full flex flex-col justify-between border-[var(--glass-border)] hover:border-[var(--gold)]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--text-muted)]">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full bg-[rgba(197,164,109,0.12)] border border-[var(--gold)]/30 text-[var(--gold)]">
                        <Flame className="w-3 h-3 text-[var(--gold)]" />
                        {item.badge}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      {item.name}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                    <span>Target: {item.eta}</span>
                    <span className="text-[var(--gold)] font-medium">In Forge</span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          {/* Notification Callout Banner */}
          <GlassPanel
            padding="lg"
            className="p-8 border-[var(--gold)]/30 text-center max-w-3xl mx-auto"
          >
            <div className="max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)] flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Bell className="w-5 h-5" />
              </div>

              <h3
                className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                Be First to Test New Releases
              </h3>

              <p className="text-sm text-[var(--text-secondary)]">
                Get early invitations to closed playtests and shape the next generation of Arcadia titles.
              </p>

              {notified ? (
                <div className="p-3 bg-[rgba(78,173,123,0.15)] border border-[var(--success)] text-[var(--success)] rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>You&apos;re on the early access priority list!</span>
                </div>
              ) : (
                <form
                  onSubmit={handleNotifySubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 pt-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                  <button
                    type="submit"
                    className="gold-btn px-6 py-2.5 text-sm font-semibold whitespace-nowrap w-full sm:w-auto"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </GlassPanel>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
