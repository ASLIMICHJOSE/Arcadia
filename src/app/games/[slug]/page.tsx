'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Star,
  Play,
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Bookmark,
  Radio,
  Flame,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassPanel from '@/components/ui/GlassPanel';
import GameCard from '@/components/ui/GameCard';
import { FEATURED_GAMES, FeaturedGame } from '@/lib/constants';
import { formatNumber, getGameImage } from '@/lib/utils';

// Comprehensive game guides and tactical rulesets
const GAME_DETAILS: Record<
  string,
  {
    heroGradient: string;
    rules: { title: string; desc: string }[];
    tactics: string[];
    tagline: string;
    controls: string;
  }
> = {
  'tic-tac-toe': {
    tagline: 'The timeless duel of foresight and calculated geometry.',
    heroGradient:
      'radial-gradient(ellipse 90% 60% at 50% 40%, rgba(197, 164, 109, 0.28) 0%, rgba(55, 42, 28, 0.2) 45%, #100F0D 90%)',
    rules: [
      {
        title: 'Ancient 3x3 Grid',
        desc: 'The duel unfolds across a 9-tile consecrated arena where every move permanently claims territory.',
      },
      {
        title: 'Alternating Glyphs',
        desc: 'Player 1 etches the Solar Cross (X); Player 2 counters with the Lunar Ring (O).',
      },
      {
        title: 'The Victory Triad',
        desc: 'Align three identical glyphs horizontally, vertically, or diagonally to immediately claim triumph.',
      },
      {
        title: 'Stalemate Protocol',
        desc: 'If all nine slots are exhausted without a triple alignment, an honorable draw is recorded.',
      },
    ],
    tactics: [
      'Seizing the center on turn one unlocks four potential winning axes.',
      'Playing opposite corners creates fork opportunities that force unblockable double-threats.',
      'Anticipate your opponent’s second-order counter to turn their defensive blocks into offensive traps.',
    ],
    controls: 'Click / Tap to place glyph',
  },
  snake: {
    tagline: 'Guide the celestial serpent through an obsidian labyrinth of light.',
    heroGradient:
      'radial-gradient(ellipse 90% 60% at 50% 40%, rgba(78, 173, 123, 0.25) 0%, rgba(20, 52, 38, 0.2) 45%, #100F0D 90%)',
    rules: [
      {
        title: 'Navigate the Void',
        desc: 'Direct the serpent through the labyrinth using precision directional steering without reversing on itself.',
      },
      {
        title: 'Harvest Solar Orbs',
        desc: 'Each golden orb devoured extends your tail and increments your combo score multiplier.',
      },
      {
        title: 'Boundary Peril',
        desc: 'Colliding with perimeter boundary stones or your own trailing body causes an instant dissolution.',
      },
      {
        title: 'Dynamic Speed Multiplier',
        desc: 'Every milestone of orbs consumed accelerates the serpent, demanding razor-sharp reaction speeds.',
      },
    ],
    tactics: [
      'Hug the exterior walls during early stages to keep the center open for evasive maneuvering.',
      'Weave back and forth in an S-pattern when your tail grows long to conserve arena real estate.',
      'Never dash toward corner food if your tail spans more than half the board perimeter.',
    ],
    controls: 'WASD / Arrow Keys / Swipe Gestures',
  },
  'memory-match': {
    tagline: 'Uncover arcane sigils and master the art of total recall.',
    heroGradient:
      'radial-gradient(ellipse 90% 60% at 50% 40%, rgba(168, 85, 247, 0.25) 0%, rgba(45, 26, 75, 0.2) 45%, #100F0D 90%)',
    rules: [
      {
        title: 'Face-Down Relics',
        desc: 'A grid of dormant runic stones conceals matching pairs of gilded mythological sigils.',
      },
      {
        title: 'Dual Inspection',
        desc: 'Flip two stones per turn to observe and memorize their glyphs before they return to shadow.',
      },
      {
        title: 'Harmonic Lock',
        desc: 'Uncovering two identical sigils locks both into permanent gold illumination and adds to your score.',
      },
      {
        title: 'Flip Efficiency Rating',
        desc: 'Fewer total turns taken yields higher star distinctions and greater XP rewards.',
      },
    ],
    tactics: [
      'Divide the board into four mental quadrants and systematically unveil one section at a time.',
      'Assign descriptive mental names to each abstract symbol to accelerate associative recall.',
      'Use the first three turns strictly for mapping corner landmarks rather than guessing matches.',
    ],
    controls: 'Click / Tap to flip tiles',
  },
  'rock-paper-scissors': {
    tagline: 'A psychological crucible of intuition, tempo, and lightning counters.',
    heroGradient:
      'radial-gradient(ellipse 90% 60% at 50% 40%, rgba(224, 159, 62, 0.28) 0%, rgba(104, 44, 16, 0.2) 45%, #100F0D 90%)',
    rules: [
      {
        title: 'The Eternal Triangle',
        desc: 'Rock crushes Scissors; Scissors severs Paper; Paper smothers Rock. Balance governs all.',
      },
      {
        title: 'Synchronized Strike',
        desc: 'Both contenders lock their gesture within a 3-second countdown window without seeing the rival’s pick.',
      },
      {
        title: 'Best of Five Sets',
        desc: 'First tactician to register three successful counters secures the arena victory.',
      },
      {
        title: 'Streak Multipliers',
        desc: 'Consecutive accurate reads award ascending ELO bonuses and crowd prestige.',
      },
    ],
    tactics: [
      'Players who lose a round statistically switch to whatever would have beaten their opponent’s previous move.',
      'Novices overwhelmingly open with Rock on round one — lead with Paper for immediate momentum.',
      'Repeat the same choice twice to bait your opponent into an overconfident counter-gamble.',
    ],
    controls: '1 / 2 / 3 Keys or On-Screen Selection',
  },
};

function GameDetailContent() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || '';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  // Look up game by slug from FEATURED_GAMES constant
  const game = FEATURED_GAMES.find(
    (g) => g.slug.toLowerCase() === slug.toLowerCase()
  );

  // If game is not found, display a stylish 404 message
  if (!game) {
    return (
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full flex items-center justify-center px-4 py-24">
          <GlassPanel padding="lg" className="text-center max-w-lg p-10 border-[var(--gold)]/30">
            <div className="w-16 h-16 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)] flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1
              className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
            >
              Ancient Relic Lost
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              The title you seek has either vanished into legend or has not yet been transcribed
              into the Arcadia archive.
            </p>
            <Link href="/discover" className="gold-btn px-6 py-3 text-sm font-semibold">
              <ArrowLeft className="w-4 h-4 text-[#100F0D]" />
              <span>Return to Discover Games</span>
            </Link>
          </GlassPanel>
        </main>
        <Footer />
      </div>
    );
  }

  const details = GAME_DETAILS[game.slug] || {
    tagline: 'An exalted challenge awaiting your tactical prowess.',
    heroGradient:
      'radial-gradient(ellipse 90% 60% at 50% 40%, rgba(197, 164, 109, 0.25) 0%, rgba(55, 42, 28, 0.2) 45%, #100F0D 90%)',
    rules: [
      {
        title: 'Master the Fundamentals',
        desc: 'Execute moves with foresight and maintain composure under turn pressure.',
      },
      {
        title: 'Score Multipliers',
        desc: 'Chain accurate maneuvers to multiply your seasonal arena score.',
      },
    ],
    tactics: [
      'Maintain awareness of your opponent’s primary win condition.',
      'Control the spatial center to maximize future options.',
    ],
    controls: 'Standard mouse and keyboard controls',
  };

  const relatedGames = FEATURED_GAMES.filter((g) => g.slug !== game.slug);

  const handlePlayNow = () => {
    setToastMessage('Matchmaking Arena Launching Soon! Solo & Live PvP trials arrive next season.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--gold)] text-sm shadow-[var(--gold-glow)] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[var(--gold)] shrink-0 animate-pulse" />
              <p className="text-xs text-[var(--text-primary)] font-medium leading-snug">
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full">
        {/* ========================================================================= */}
        {/* GAME HERO AREA                                                           */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[50vh] sm:min-h-[58vh] flex items-center justify-center overflow-hidden border-b border-[var(--glass-border)]">
          {/* Custom Game Ambient Gradient Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                ${details.heroGradient},
                linear-gradient(180deg, #100F0D 0%, #181416 45%, #241611 75%, #100F0D 100%)
              `,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/40 pointer-events-none" />

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-14">
            {/* Back to catalog breadcrumb */}
            <div className="mb-6">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Discover</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Game Meta & Titles */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)] text-xs font-mono font-semibold uppercase tracking-wider">
                    {game.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--text-secondary)] text-xs font-mono">
                    Difficulty: {game.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--text-secondary)] text-xs font-mono">
                    <Users className="w-3 h-3 text-[var(--gold)]" />
                    {formatNumber(game.playerCount)} Contenders
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--text-primary)] tracking-tight leading-tight"
                  style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                >
                  {game.name}
                </h1>

                <p className="text-base sm:text-lg text-[var(--gold-light)] font-serif italic max-w-xl">
                  &ldquo;{details.tagline}&rdquo;
                </p>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                  {game.description}
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handlePlayNow}
                    className="gold-btn px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Play className="w-5 h-5 text-[#100F0D] fill-current" />
                    <span>Play Now</span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(197,164,109,0.12)] border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-mono font-semibold">
                    <Radio className="w-3 h-3 animate-pulse" />
                    Coming Soon
                  </span>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className="p-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--glass-hover)] text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
                    title={bookmarked ? 'Saved to Favorites' : 'Bookmark Title'}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[var(--gold)] text-[var(--gold)]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Game Emblem Art Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <GlassPanel
                  padding="none"
                  className="w-full max-w-md aspect-[16/10] overflow-hidden border-[var(--gold)]/40 shadow-[var(--gold-glow-sm)] relative group"
                >
                  <img
                    src={game.image || `/images/games/${game.slug}.jpg`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getGameImage(game.slug);
                    }}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
                    <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                      Controls: {details.controls}
                    </span>
                    <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10 flex items-center gap-1 text-[var(--amber)]">
                      <Star className="w-3 h-3 fill-current" />
                      {game.rating || 4.8} / 5
                    </span>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW TO PLAY SECTION                                                      */}
        {/* ========================================================================= */}
        <section className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Rules & Sequence */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-[var(--gold)]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--gold)] font-semibold">
                    CODEX &amp; MECHANICS
                  </span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                >
                  How to Play {game.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Familiarize yourself with the fundamental laws governing the amphitheater.
                </p>
              </div>

              {/* Rules Sequence */}
              <div className="space-y-4">
                {details.rules.map((rule, idx) => (
                  <GlassPanel
                    key={rule.title}
                    padding="md"
                    className="border-[var(--glass-border)] flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                        {rule.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {rule.desc}
                      </p>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>

            {/* Right: Tactics & Mastery Pro-Tips */}
            <div className="lg:col-span-5 space-y-6">
              <GlassPanel
                padding="lg"
                className="p-6 sm:p-8 border-[var(--gold)]/30 bg-[rgba(33,28,22,0.8)]"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--gold)] uppercase font-semibold mb-3">
                  <Flame className="w-4 h-4 text-[var(--amber)]" />
                  Tactical Mastery
                </div>

                <h3
                  className="text-xl font-serif font-bold text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                >
                  Grandmaster Pro-Tips
                </h3>

                <ul className="space-y-3.5">
                  {details.tactics.map((tactic) => (
                    <li key={tactic} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">Recommended Level:</span>
                    <span className="font-mono text-[var(--gold)] font-medium">Novice to Master</span>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RELATED GAMES SECTION                                                    */}
        {/* ========================================================================= */}
        <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--glass-border)]/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                More Handcrafted Titles
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Challenge your reflexes and wit across other Arcadia titles.
              </p>
            </div>

            <Link
              href="/discover"
              className="gold-btn-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>View All</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedGames.slice(0, 3).map((relGame) => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function GameDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--gold)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <GameDetailContent />
    </Suspense>
  );
}
