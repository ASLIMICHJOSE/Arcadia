'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play,
  ChevronRight,
  Bookmark,
  Flame,
  ArrowRight,
  Trophy,
  Zap,
  Swords,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import {
  ScrollParallax,
  CyberReveal,
  CyberCounter,
} from '@/components/motion';
import { playBlip, playEngage } from '@/lib/sound';
import {
  getTelemetry,
  formatPlaytime,
  addPlaytime,
  PlayerTelemetry,
  DEFAULT_TELEMETRY,
} from '@/lib/telemetry';

const QUICK_ROSTER = [
  {
    slug: 'tic-tac-toe',
    title: 'Arcane Gambit',
    subtitle: 'Tic-Tac-Toe Arena (Turn-Based Strategy)',
    image: '/images/games/tic-tac-toe.jpg',
    alt: 'Tic-Tac-Toe Arena',
  },
  {
    slug: 'memory-match',
    title: 'Rune Archive',
    subtitle: 'Memory Match (Concentration & Recall)',
    image: '/images/games/memory-match.jpg',
    alt: 'Memory Match Arena',
  },
  {
    slug: 'rock-paper-scissors',
    title: 'Elemental Duel',
    subtitle: 'Rock Paper Scissors (Tactical Mindgames)',
    image: '/images/games/rock-paper-scissors.jpg',
    alt: 'Elemental Duel',
  },
] as const;

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [telemetry, setTelemetry] = useState<PlayerTelemetry>(DEFAULT_TELEMETRY);

  useEffect(() => {
    setMounted(true);
    setTelemetry(getTelemetry());

    const handleUpdate = () => {
      setTelemetry(getTelemetry());
    };

    window.addEventListener('arcadia_telemetry_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Active playtime tracker (60s intervals to minimize CPU re-render overhead)
    const interval = setInterval(() => {
      addPlaytime(60);
    }, 60000);

    return () => {
      window.removeEventListener('arcadia_telemetry_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const storyProgressPct = mounted
    ? Math.min(99, Math.max(50, Math.round((telemetry.gamesPlayed / 150) * 100)))
    : 92;

  return (
    <AppShell>
      <div className="space-y-6 pb-6 select-none">
        {/* ========================================================================= */}
        {/* ROW 1: FEATURED GAME HERO BANNER (LEFT) & QUICK GAMES ROSTER (RIGHT)      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-8 md:pt-10">
          {/* 1.1 Left: Major Featured Game Hero Banner (8 Cols) with Character Popping Out */}
          <div className="lg:col-span-8 relative group">
            {/* Character Cutout Breaking Top/Right Frame with Subtle Lenis Scroll Depth */}
            <ScrollParallax
              heroMode
              offset={-24}
              className="absolute -top-10 sm:-top-14 md:-top-18 lg:-top-20 right-0 sm:right-4 lg:right-6 w-[260px] sm:w-[330px] md:w-[380px] lg:w-[420px] h-[340px] sm:h-[410px] md:h-[460px] lg:h-[490px] z-20 pointer-events-none select-none"
            >
              {/* Soft radial ember halo behind the character */}
              <div
                className="absolute inset-0 -top-6 rounded-full opacity-60 blur-3xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(227, 66, 66, 0.65) 0%, rgba(139, 26, 26, 0.35) 40%, transparent 70%)',
                }}
              />

              <img
                src="/images/hero-character.jpg"
                alt="Cyber Serpent Titan Warrior"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.9)]"
              />
            </ScrollParallax>

            {/* Inner Hero Card Container */}
            <div className="relative rounded-[28px] overflow-hidden border border-white/[0.08] group-hover:border-[#E34242]/45 transition-colors duration-200 bg-gradient-to-r from-[#220C0C] via-[#2D1010] to-[#1C0A0A] min-h-[340px] sm:min-h-[380px] md:min-h-[400px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl z-10">
              {/* Glowing Red Sun Disk & Ambient Gradient Background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(circle at 68% 42%, rgba(227, 66, 66, 0.42) 0%, rgba(180, 45, 45, 0.22) 35%, transparent 70%),
                    linear-gradient(90deg, rgba(28, 10, 10, 0.98) 0%, rgba(28, 10, 10, 0.8) 45%, rgba(28, 10, 10, 0.25) 85%, transparent 100%),
                    linear-gradient(180deg, transparent 40%, rgba(28, 10, 10, 0.95) 100%)
                  `,
                }}
              />

              {/* Top Row: Badges */}
              <div className="relative z-10 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E34242] text-white text-xs font-bold tracking-wide shadow-[0_0_16px_rgba(227,66,66,0.6)]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Featured
                </span>

                <div className="w-7 h-7 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-amber-400 font-black text-[11px] font-mono">
                  A*
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-emerald-400 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>PWA OFFLINE READY</span>
                </div>
              </div>

              {/* Center Content: Title, Subtitle, & Social Proof */}
              <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg my-auto py-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-[1.05] uppercase drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
                  CYBER SERPENT <br />
                  <span className="text-[#E34242]">TITAN ARENA</span>
                </h1>

                <p className="mt-2.5 text-xs sm:text-sm text-[#C7A9A3] leading-relaxed max-w-sm line-clamp-2">
                  High-octane reflex trials on the digital grid. Outmaneuver shifting laser barriers, harvest core shards, and outlast rival AI.
                </p>

                {/* Social Proof & Play Now Button */}
                <div className="mt-5 flex flex-wrap items-center gap-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80"
                        alt="Player"
                        className="w-7 h-7 rounded-full border-2 border-[#1C0A0A] object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80"
                        alt="Player"
                        className="w-7 h-7 rounded-full border-2 border-[#1C0A0A] object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80"
                        alt="Player"
                        className="w-7 h-7 rounded-full border-2 border-[#1C0A0A] object-cover"
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs text-white font-medium">
                      👍 +18K Contenders
                    </span>
                  </div>

                  <Link
                    href="/games/snake"
                    prefetch={true}
                    onClick={() => playEngage()}
                    className="px-6 py-2.5 rounded-full bg-white hover:bg-[#FFF5F0] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(227,66,66,0.28)] hover:shadow-[0_10px_28px_rgba(227,66,66,0.45)] active:scale-95 transition-all cursor-pointer group/cta"
                  >
                    <Play className="w-4 h-4 fill-current text-[#E34242] transition-transform group-hover/cta:scale-110" />
                    <span>Play Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 1.2 Right: 3 Quick Game Cards (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3 h-full">
            {QUICK_ROSTER.map((item, idx) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.28,
                  delay: 0.04 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 4, transition: { type: 'spring', stiffness: 420, damping: 28 } }}
                className="flex-1 flex"
              >
                <Link
                  href={`/games/${item.slug}`}
                  prefetch={true}
                  onClick={() => playBlip()}
                  className="w-full flex-1 rounded-[22px] bg-[#291010] hover:bg-[#351414] border border-white/[0.08] hover:border-[#E34242]/55 p-3.5 sm:p-4 flex items-center justify-between transition-colors duration-200 group shadow-lg"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-13 h-13 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10 group-hover:border-[#E34242]/50 transition-colors relative">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-white group-hover:text-[#FF7878] transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#C7A9A3] truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#E34242] text-[#C7A9A3] group-hover:text-white flex items-center justify-center shrink-0 transition-colors ml-2">
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: LATEST ACTIVITIES (LEFT 8 COLS) & YOUR STATISTICS (RIGHT 4 COLS)   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 2.1 Left: Latest Activities (8 Cols) */}
          <CyberReveal className="lg:col-span-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-heading font-extrabold text-[#FFF5F0]">
                Latest Activities
              </h2>
              <Link
                href="/discover"
                prefetch={true}
                onClick={() => playBlip()}
                className="text-xs font-semibold text-[#E34242] hover:text-white transition-colors inline-flex items-center gap-1 group"
              >
                <span>See More</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
              {/* Activity Card 1: Master Tactician */}
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 360, damping: 24 } }}
                className="relative rounded-[22px] overflow-hidden bg-[#291010] border border-white/[0.07] hover:border-[#E34242]/50 h-[196px] flex flex-col justify-between p-4 group shadow-lg transition-colors"
              >
                <img
                  src="/images/games/tic-tac-toe.jpg"
                  alt="Master Tactician"
                  className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/50 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <Link
                    href="/games/tic-tac-toe"
                    prefetch={true}
                    onClick={() => playEngage()}
                    className="w-8 h-8 rounded-full bg-[#E34242] flex items-center justify-center text-white shadow-[0_0_12px_rgba(227,66,66,0.55)] cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                  <div className="w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white cursor-pointer hover:border-[#E34242] transition-colors">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-sm text-white drop-shadow">
                    Master Tactician
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] mt-0.5">5-win streak against AI</p>
                  <p className="text-[10px] text-[#8C6D68] mt-1 font-mono">1 hour ago</p>
                </div>
              </motion.div>

              {/* Activity Card 2: Speed Viper */}
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 360, damping: 24 } }}
                className="relative rounded-[22px] overflow-hidden bg-[#291010] border border-white/[0.07] hover:border-[#E34242]/50 h-[196px] flex flex-col justify-between p-4 group shadow-lg transition-colors"
              >
                <img
                  src="/images/games/snake.jpg"
                  alt="Speed Viper"
                  className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/50 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <Link
                    href="/games/snake"
                    prefetch={true}
                    onClick={() => playEngage()}
                    className="w-8 h-8 rounded-full bg-[#E34242] flex items-center justify-center text-white shadow-[0_0_12px_rgba(227,66,66,0.55)] cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[9px] font-bold">
                    HIGH SCORE
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-sm text-white drop-shadow">
                    Speed Viper
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] mt-0.5 line-clamp-1">
                    Reached 8,420 grid score
                  </p>
                  <p className="text-[10px] text-[#8C6D68] mt-1 font-mono">3 hours ago</p>
                </div>
              </motion.div>

              {/* Activity Card 3: Arcane Archive Completion */}
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 360, damping: 24 } }}
                className="relative rounded-[22px] overflow-hidden bg-[#291010] border border-white/[0.07] hover:border-[#E34242]/50 h-[196px] flex flex-col justify-between p-4 group shadow-lg transition-colors"
              >
                <img
                  src="/images/games/memory-match.jpg"
                  alt="Rune Completion"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/50 to-transparent" />

                <div className="relative z-10 flex items-center justify-center pt-2">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#E34242"
                        strokeWidth="4"
                        strokeDasharray="163.36"
                        initial={{ strokeDashoffset: 163.36 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-white">
                      100%
                    </span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-sm text-white drop-shadow">
                    Arcane Archive
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] mt-0.5">All 8 glyph pairs solved</p>
                  <p className="text-[10px] text-[#8C6D68] mt-1 font-mono">Yesterday</p>
                </div>
              </motion.div>
            </div>
          </CyberReveal>

          {/* 2.2 Right: Your Statistics Panel */}
          <CyberReveal
            delay={0.05}
            className="lg:col-span-4 rounded-[26px] bg-[#291010]/95 border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-heading font-extrabold text-[#FFF5F0]">
                Your Statistics
              </h2>
              <Link
                href="/dashboard"
                prefetch={true}
                onClick={() => playBlip()}
                aria-label="View Full Statistics"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E34242] flex items-center justify-center text-[#C7A9A3] hover:text-white transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Center: Clean Playtime Progress Ring */}
            <div className="relative flex items-center justify-center my-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#E34242"
                    strokeWidth="8"
                    strokeDasharray="364.4"
                    initial={{ strokeDashoffset: 364.4 }}
                    whileInView={{ strokeDashoffset: 65 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-medium text-[#C7A9A3] uppercase tracking-wider">
                    Total Playtime
                  </span>
                  <span
                    className="text-xl font-heading font-black text-white tracking-tight mt-0.5"
                    suppressHydrationWarning
                  >
                    {mounted ? formatPlaytime(telemetry.totalPlaytimeSeconds) : '128,45h'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: 3 Stat Columns */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-center">
              <div className="flex flex-col items-center group">
                <div className="w-9 h-9 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-sm text-white">
                  <CyberCounter
                    value={storyProgressPct}
                    format={(v) => `${Math.round(v)}%`}
                  />
                </span>
                <span className="text-[9px] text-[#C7A9A3] uppercase tracking-wider leading-tight">
                  Story Progress
                </span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-9 h-9 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-sm text-white">
                  <CyberCounter value={mounted ? telemetry.challengesSolved : 189} />
                </span>
                <span className="text-[9px] text-[#C7A9A3] uppercase tracking-wider leading-tight">
                  Challenges
                </span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-9 h-9 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <Swords className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-sm text-white">
                  <CyberCounter value={mounted ? telemetry.duelsWon : 7243} />
                </span>
                <span className="text-[9px] text-[#C7A9A3] uppercase tracking-wider leading-tight">
                  Duels Won
                </span>
              </div>
            </div>
          </CyberReveal>
        </div>
      </div>
    </AppShell>
  );
}
