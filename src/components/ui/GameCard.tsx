'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Users, Play, Swords, Gamepad2, Brain, Sparkles, Crown, Star } from 'lucide-react';
import GlassPanel from './GlassPanel';
import PrimaryButton from './PrimaryButton';
import type { FeaturedGame } from '@/lib/constants';

export interface GameCardProps {
  game: FeaturedGame | {
    id: string;
    name: string;
    description: string;
    category: string;
    slug: string;
    image?: string;
    playerCount: number;
    difficulty?: string;
    rating?: number;
  };
  className?: string;
  delay?: number;
}

// Visual thematic configurations for each category or title
function getCategoryVisuals(category: string, slug: string) {
  const normCat = category.toLowerCase();
  const normSlug = slug.toLowerCase();

  if (normCat.includes('strat') || normSlug.includes('tic-tac-toe')) {
    return {
      gradient: 'radial-gradient(circle at 35% 35%, rgba(197, 164, 109, 0.45) 0%, rgba(55, 42, 28, 0.85) 55%, rgba(16, 15, 13, 0.98) 100%)',
      glowColor: 'rgba(197, 164, 109, 0.3)',
      Icon: Swords,
      pattern: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    };
  }

  if (normCat.includes('arc') || normSlug.includes('snake')) {
    return {
      gradient: 'radial-gradient(circle at 35% 35%, rgba(78, 173, 123, 0.45) 0%, rgba(20, 52, 38, 0.85) 55%, rgba(12, 20, 16, 0.98) 100%)',
      glowColor: 'rgba(78, 173, 123, 0.3)',
      Icon: Gamepad2,
      pattern: 'circle at 50% 50%',
    };
  }

  if (normCat.includes('puzz') || normSlug.includes('memory')) {
    return {
      gradient: 'radial-gradient(circle at 35% 35%, rgba(168, 85, 247, 0.45) 0%, rgba(45, 26, 75, 0.85) 55%, rgba(16, 13, 26, 0.98) 100%)',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      Icon: Brain,
      pattern: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    };
  }

  if (normCat.includes('cas') || normCat.includes('class') || normSlug.includes('rock')) {
    return {
      gradient: 'radial-gradient(circle at 35% 35%, rgba(229, 169, 60, 0.45) 0%, rgba(75, 38, 20, 0.85) 55%, rgba(20, 14, 11, 0.98) 100%)',
      glowColor: 'rgba(229, 169, 60, 0.3)',
      Icon: Sparkles,
      pattern: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    };
  }

  return {
    gradient: 'radial-gradient(circle at 35% 35%, rgba(197, 164, 109, 0.35) 0%, rgba(43, 36, 28, 0.85) 55%, rgba(16, 15, 13, 0.98) 100%)',
    glowColor: 'rgba(197, 164, 109, 0.25)',
    Icon: Crown,
    pattern: 'circle',
  };
}

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  className = '',
  delay = 0,
}) => {
  const [imgError, setImgError] = useState(false);
  const { gradient, glowColor, Icon: ThematicIcon } = getCategoryVisuals(game.category, game.slug);

  const imageSrc = game.image || `/images/games/${game.slug}.jpg`;
  const formattedPlayers = new Intl.NumberFormat('en-US').format(game.playerCount);

  // Difficulty badge styling
  const difficultyColor = React.useMemo(() => {
    switch (game.difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-[var(--success)] bg-[var(--success-bg)] border-[rgba(78,173,123,0.3)]';
      case 'medium':
        return 'text-[var(--warning)] bg-[var(--warning-bg)] border-[rgba(224,159,62,0.3)]';
      case 'hard':
        return 'text-[var(--danger)] bg-[var(--danger-bg)] border-[rgba(214,69,69,0.3)]';
      default:
        return 'text-[var(--gold)] bg-[var(--gold-muted)] border-[var(--glass-border-gold)]';
    }
  }, [game.difficulty]);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-[var(--border-radius-lg,16px)]"
    >
      <motion.div
        variants={cardItemVariants}
        whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
        className={`flex flex-col h-full ${className}`}
      >
        <GlassPanel
          padding="none"
          className="flex flex-col h-full overflow-hidden border-[var(--glass-border)] group-hover:border-[var(--glass-border-hover)] transition-all duration-300"
        >
          {/* Top Section: Cinematic Game Artwork with Dark Overlays & Badges */}
          <div className="relative w-full h-48 md:h-52 overflow-hidden select-none bg-[var(--background-secondary)]">
            {/* Fallback ambient gradient */}
            <div
              className="absolute inset-0"
              style={{ background: gradient }}
            />

            {/* Cinematic Western Game Artwork with smooth hover zoom */}
            {!imgError && (
              <img
                src={imageSrc}
                alt={game.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            )}

            {/* Dark Cinematic Vignette Overlay for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-elevated)] via-black/35 to-black/20 pointer-events-none" />

            {/* Subtle luxury decorative grid overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top Left: Category Badge Overlay */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide backdrop-blur-md"
                style={{
                  background: 'rgba(16, 15, 13, 0.85)',
                  color: 'var(--gold-light)',
                  border: '1px solid var(--glass-border-gold)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                {game.category}
              </span>
            </div>

            {/* Top Right: Difficulty Badge */}
            {game.difficulty && (
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border ${difficultyColor}`}
                >
                  {game.difficulty}
                </span>
              </div>
            )}

            {/* Bottom Right: Thematic Emblem Badge */}
            <div className="absolute bottom-3 right-3 z-10">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--gold)]"
                style={{
                  background: 'rgba(16, 15, 13, 0.75)',
                  border: '1px solid var(--glass-border-gold)',
                  boxShadow: `0 0 16px ${glowColor}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <ThematicIcon className="w-4 h-4 text-[var(--gold-light)] drop-shadow" />
              </div>
            </div>
          </div>

          {/* Bottom Section: Details & Action */}
          <div className="p-5 flex flex-col flex-1 justify-between bg-[var(--surface-card)]">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3
                  className="font-serif text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors line-clamp-1"
                  style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
                >
                  {game.name}
                </h3>

                {game.rating && (
                  <div className="flex items-center gap-1 text-xs text-[var(--gold-light)] font-medium shrink-0 pt-0.5">
                    <Star className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                    <span>{game.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <p className="text-xs md:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Users className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span>{formattedPlayers} active</span>
              </div>

              <PrimaryButton
                variant="gold"
                size="sm"
                icon={Play}
                iconPosition="left"
                className="font-semibold shadow-sm pointer-events-none"
                tabIndex={-1}
              >
                Play Now
              </PrimaryButton>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </Link>
  );
};

export default GameCard;
