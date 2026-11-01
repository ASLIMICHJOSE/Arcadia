'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Trophy,
  ChevronDown,
  Sparkles,
  Gamepad2,
  Swords,
  Zap,
  Globe,
  Radio,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassPanel from '@/components/ui/GlassPanel';
import GameGrid from '@/components/ui/GameGrid';
import LeaderboardPreview from '@/components/ui/LeaderboardPreview';
import { FEATURED_GAMES, DEMO_LEADERBOARD } from '@/lib/constants';

// Dust / ambient embers particle configuration
const DUST_PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  x: (i * 17) % 100,
  y: (i * 29) % 100,
  size: (i % 3) + 2,
  duration: 8 + (i % 7) * 2,
  delay: (i * 0.4) % 5,
  opacity: 0.2 + (i % 5) * 0.12,
}));

// Framer Motion entrance variants
const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (100vh Cinematic Dusk Landscape)                         */}
        {/* ========================================================================= */}
        <section className="relative w-full h-screen min-h-[640px] max-h-[1200px] flex items-center justify-center overflow-hidden">
          {/* Multi-layered Western Dusk Cinematic Sky Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 90% 60% at 50% 62%, rgba(229, 169, 60, 0.22) 0%, rgba(142, 62, 18, 0.18) 35%, transparent 75%),
                radial-gradient(ellipse 120% 80% at 50% 100%, rgba(197, 164, 109, 0.25) 0%, rgba(104, 44, 16, 0.2) 45%, rgba(16, 15, 13, 0.95) 90%),
                linear-gradient(180deg, #120F16 0%, #1D151D 24%, #321B19 46%, #4A2314 62%, #2B160F 78%, #100F0D 100%)
              `,
            }}
          />

          {/* Secondary atmospheric horizon glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[55%] pointer-events-none blur-3xl opacity-40"
            style={{
              background: 'radial-gradient(ellipse at 50% 80%, rgba(223, 202, 155, 0.35) 0%, rgba(197, 164, 109, 0.2) 35%, rgba(128, 97, 60, 0.05) 70%, transparent 100%)',
            }}
          />

          {/* Dark Overlay Vignette for High Text Legibility */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-[#100F0D]"
          />

          {/* Floating Subtle Ambient Dust Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {DUST_PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-[var(--gold)]"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: '0 0 6px rgba(197, 164, 109, 0.7)',
                }}
                animate={{
                  y: [0, -60, -120],
                  x: [0, (particle.id % 2 === 0 ? 15 : -15), 0],
                  opacity: [0, particle.opacity, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: particle.delay,
                }}
              />
            ))}
          </div>

          {/* Centered Hero Content */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-16 sm:pt-20"
          >
            {/* Small Gold Tagline */}
            <motion.div variants={heroItem} className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30 bg-[rgba(197,164,109,0.08)] backdrop-blur-md text-[var(--gold)] font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase shadow-[var(--gold-glow-sm)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] animate-pulse" />
                THE FRONTIER OF GAMING
              </span>
            </motion.div>

            {/* Large Serif Headline */}
            <motion.h1
              variants={heroItem}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-[var(--text-primary)] tracking-tight leading-[1.08] sm:leading-[1.05] drop-shadow-2xl mb-6 whitespace-pre-line"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
            >
              Where Legends{'\n'}Are Forged
            </motion.h1>

            {/* Subtitle Paragraph */}
            <motion.p
              variants={heroItem}
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10 text-balance"
            >
              Enter a world of premium casual gaming. Compete, explore, and rise through
              the ranks in Arcadia&apos;s cinematic universe.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={heroItem}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/discover"
                className="gold-btn w-full sm:w-auto px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Gamepad2 className="w-5 h-5 text-[#100F0D]" />
                <span>Explore Games</span>
              </Link>
              <Link
                href="/register"
                className="gold-btn-secondary w-full sm:w-auto px-8 py-3.5 text-base font-medium transition-all"
              >
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <span>Join Arcadia</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Bouncing Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer group"
            onClick={() => {
              const target = document.getElementById('featured-games');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)] group-hover:text-[var(--gold)] transition-colors">
              Descend
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--gold)] group-hover:border-[var(--gold)]/40 transition-colors shadow-sm"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FEATURED GAMES SECTION                                                */}
        {/* ========================================================================= */}
        <section id="featured-games" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-[var(--gold)]/50" />
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[var(--gold)] font-semibold">
                FEATURED GAMES
              </span>
              <span className="h-px w-8 bg-[var(--gold)]/50" />
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
            >
              Handcrafted gaming experiences
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl">
              Immerse yourself in timeless rulesets forged with contemporary visual depth,
              tactical mastery, and instant responsiveness.
            </p>
          </div>

          {/* GameGrid without search or filters on homepage */}
          <GameGrid
            games={FEATURED_GAMES}
            showSearch={false}
            showFilters={false}
          />
        </section>

        {/* ========================================================================= */}
        {/* 3. WHY ARCADIA SECTION (3-Column Value Props)                            */}
        {/* ========================================================================= */}
        <section className="relative w-full py-20 sm:py-24 bg-gradient-to-b from-transparent via-[var(--surface)]/30 to-transparent border-y border-[var(--glass-border)]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-2">
                THE ARCADIA STANDARD
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                Why Play In Our Arena
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)]">
                A handcrafted refuge built for players who appreciate elegance, strategic depth,
                and zero unnecessary friction.
              </p>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: Premium Experience */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassPanel
                  hover
                  padding="lg"
                  className="h-full flex flex-col justify-between group border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] text-[var(--gold)] mb-6 transition-transform group-hover:scale-105 shadow-[var(--gold-glow-sm)]">
                      <Shield className="w-7 h-7" />
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] mb-3"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      Premium Experience
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Handcrafted with obsessive attention to craft. Enjoy obsidian glass aesthetics,
                      gilded accents, fluid 60fps animations, and zero intrusive ads or dark patterns.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center gap-2 text-xs font-medium text-[var(--gold)]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pure, distraction-free gameplay</span>
                  </div>
                </GlassPanel>
              </motion.div>

              {/* Card 2: Multiplayer Magic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassPanel
                  hover
                  padding="lg"
                  className="h-full flex flex-col justify-between group border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[rgba(79,134,198,0.15)] border border-[rgba(79,134,198,0.3)] text-[var(--info)] mb-6 transition-transform group-hover:scale-105 shadow-sm">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] mb-3"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      Multiplayer Magic
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Connect instantly with players worldwide. Our lightweight peer infrastructure
                      guarantees low-latency turns, live spectator duels, and seamless party invitations.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center gap-2 text-xs font-medium text-[var(--info)]">
                    <Zap className="w-4 h-4" />
                    <span>Instant matchmaking &amp; low latency</span>
                  </div>
                </GlassPanel>
              </motion.div>

              {/* Card 3: Rise Through Ranks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassPanel
                  hover
                  padding="lg"
                  className="h-full flex flex-col justify-between group border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[rgba(224,159,62,0.15)] border border-[rgba(224,159,62,0.3)] text-[var(--warning)] mb-6 transition-transform group-hover:scale-105 shadow-sm">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] mb-3"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      Rise Through Ranks
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Scale the seasonal leaderboard, claim gilded medallions, and unlock prestigious
                      achievements. Every triumph leaves your mark in the annals of Arcadia.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center gap-2 text-xs font-medium text-[var(--warning)]">
                    <Star className="w-4 h-4" />
                    <span>Seasonal leagues &amp; tiered badges</span>
                  </div>
                </GlassPanel>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MULTIPLAYER SECTION (Split Layout with Matchmaking Preview)           */}
        {/* ========================================================================= */}
        <section className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & Features */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(197,164,109,0.12)] border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-mono font-semibold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[var(--gold)]" />
                Coming Soon • Next Season
              </div>

              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                Real-Time Multiplayer
              </h2>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                Step into the amphitheater where true tacticians meet. Battle live rivals across
                all titles with synchronised turns, real-time spectator modes, and global ranking.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)] font-medium">Sub-50ms Latency:</strong> Optimized edge routing ensures responsive play from any device.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)] font-medium">Custom Lobbies &amp; Direct Duels:</strong> Create private invite links to challenge friends in seconds.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)] font-medium">Anti-Cheat Architecture:</strong> Verifiable deterministic game states prevent foul play.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="gold-btn px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"
                >
                  <Swords className="w-4 h-4 text-[#100F0D]" />
                  <span>Reserve Early Access</span>
                </Link>
                <Link
                  href="/community"
                  className="text-xs uppercase font-mono tracking-wider text-[var(--gold)] hover:text-[var(--gold-light)] flex items-center gap-1.5 transition-colors px-3 py-2"
                >
                  <span>Learn in Community</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Fake Matchmaking UI Preview */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6"
            >
              <GlassPanel
                padding="lg"
                className="relative overflow-hidden border-[var(--gold)]/30 shadow-[var(--gold-glow-sm)]"
              >
                {/* Atmospheric gradient overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[rgba(197,164,109,0.15)] to-transparent pointer-events-none blur-2xl" />

                {/* Matchmaking Header Status */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)] mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--gold)]" />
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--gold)] font-semibold">
                      Matchmaking in Progress
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                    <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>00:14</span>
                  </div>
                </div>

                {/* Match Details Banner */}
                <div className="bg-[var(--surface-elevated)]/60 rounded-xl p-3.5 border border-[var(--glass-border)] mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Queue</span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">Ranked Strategy Duel</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Region</span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--success)] flex items-center gap-1">
                      <Globe className="w-3 h-3" /> US-East (18ms)
                    </span>
                  </div>
                </div>

                {/* Head-to-Head Duel Preview */}
                <div className="grid grid-cols-7 items-center gap-2 my-6">
                  {/* Player 1 (You) */}
                  <div className="col-span-3 flex flex-col items-center text-center p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
                    <div className="w-14 h-14 rounded-full border-2 border-[var(--gold)] p-0.5 mb-2 relative">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#DFCA9B] to-[#80613C] flex items-center justify-center font-serif font-bold text-sm text-[#100F0D]">
                        FS
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-[var(--gold)] text-[#100F0D] text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        Lv.24
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[100px]">
                      Frontier_Scout
                    </span>
                    <span className="text-[10px] text-[var(--gold)] font-mono">1,840 ELO</span>
                  </div>

                  {/* VS Badge */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] text-xs font-serif font-bold shadow-sm">
                      VS
                    </div>
                  </div>

                  {/* Player 2 (Searching...) */}
                  <div className="col-span-3 flex flex-col items-center text-center p-3 rounded-xl bg-[var(--glass)] border border-dashed border-[var(--glass-border)]">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[var(--gold)]/40 p-0.5 mb-2 flex items-center justify-center animate-spin [animation-duration:6s]">
                      <Radio className="w-6 h-6 text-[var(--gold)]/70" />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)] animate-pulse">
                      Searching...
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">1,800 - 1,880 ELO</span>
                  </div>
                </div>

                {/* Queue Activity Indicator Bar */}
                <div className="pt-2">
                  <div className="w-full bg-[var(--surface)] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-light)]"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mt-2">
                    <span>Active Queue: 142 Tacticians</span>
                    <span className="text-[var(--gold)]">Est. wait: ~8s</span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. LEADERBOARD PREVIEW SECTION (Top 5 Roster)                            */}
        {/* ========================================================================= */}
        <section className="relative w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--gold)] font-semibold">
                  HALL OF CHAMPIONS
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                Global Leaderboard
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
                The fiercest contenders immortalized in gold. Ascend through tactical precision.
              </p>
            </div>

            <Link
              href="/leaderboard"
              className="gold-btn-secondary self-start md:self-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Join The Competition</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Leaderboard Preview (Top 5) */}
          <div className="max-w-4xl mx-auto">
            <LeaderboardPreview
              entries={DEMO_LEADERBOARD}
              limit={5}
              title="Arcadia Top 5 Contenders"
              viewAllHref="/leaderboard"
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. COMMUNITY SECTION (Full-Width Glass Panel with Stats)                 */}
        {/* ========================================================================= */}
        <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <GlassPanel
              padding="lg"
              className="relative overflow-hidden text-center p-8 sm:p-14 md:p-16 border-[var(--gold)]/30 shadow-[var(--glass-shadow-lg)]"
            >
              {/* Radial ambient glow behind card */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle at 50% 20%, rgba(197, 164, 109, 0.25) 0%, rgba(16, 15, 13, 0) 70%)',
                }}
              />

              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--gold-muted)] text-[var(--gold)] text-xs font-mono uppercase tracking-[0.2em] font-semibold border border-[var(--gold)]/30">
                  <Users className="w-3.5 h-3.5" />
                  THE GUILD OF ARCADIA
                </span>

                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
                  style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                >
                  Join Our Community
                </h2>

                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
                  Thousands of tacticians, puzzle solvers, and arcade masters gather daily.
                  Share strategies, challenge tournament winners, and leave your legacy.
                </p>

                {/* Key Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 pb-8 border-y border-[var(--glass-border)] my-6">
                  <div className="space-y-1">
                    <div
                      className="text-3xl sm:text-4xl font-serif font-bold text-[var(--gold)]"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      10K+
                    </div>
                    <div className="text-xs uppercase font-mono tracking-wider text-[var(--text-secondary)]">
                      Active Players
                    </div>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-[var(--glass-border)] pt-4 sm:pt-0">
                    <div
                      className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      50K+
                    </div>
                    <div className="text-xs uppercase font-mono tracking-wider text-[var(--text-secondary)]">
                      Games Played
                    </div>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 border-[var(--glass-border)] pt-4 sm:pt-0">
                    <div
                      className="text-3xl sm:text-4xl font-serif font-bold text-[var(--amber)] flex items-center justify-center gap-1"
                      style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                    >
                      <Star className="w-6 h-6 fill-current text-[var(--amber)]" />
                      4.9
                    </div>
                    <div className="text-xs uppercase font-mono tracking-wider text-[var(--text-secondary)]">
                      Player Rating
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="gold-btn px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    <Sparkles className="w-5 h-5 text-[#100F0D]" />
                    <span>Claim Your Player Tag</span>
                  </Link>
                  <Link
                    href="/community"
                    className="gold-btn-secondary px-8 py-3.5 text-base font-medium w-full sm:w-auto"
                  >
                    <span>Explore Community Hub</span>
                  </Link>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
