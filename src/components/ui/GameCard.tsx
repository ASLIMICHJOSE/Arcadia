'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Users, Play, Swords, Gamepad2, Brain, Star, Flame } from 'lucide-react';
import type { FeaturedGame } from '@/lib/constants';
import { playBlip } from '@/lib/sound';

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

function getCategoryVisuals(category: string, slug: string) {
  const normCat = category.toLowerCase();
  const normSlug = slug.toLowerCase();

  if (normCat.includes('strat') || normSlug.includes('tic-tac-toe')) {
    return {
      Icon: Swords,
      badgeColor: 'border-[var(--accent-primary)]/40 text-[var(--accent-primary)]',
    };
  }

  if (normCat.includes('arc') || normSlug.includes('snake')) {
    return {
      Icon: Gamepad2,
      badgeColor: 'border-emerald-500/40 text-emerald-400',
    };
  }

  if (normCat.includes('puzz') || normSlug.includes('memory')) {
    return {
      Icon: Brain,
      badgeColor: 'border-amber-500/40 text-amber-400',
    };
  }

  return {
    Icon: Flame,
    badgeColor: 'border-[var(--accent-primary)]/40 text-[var(--accent-primary)]',
  };
}

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const { Icon: ThematicIcon, badgeColor } = getCategoryVisuals(game.category, game.slug);

  const imageSrc = game.image || `/images/games/${game.slug}.jpg`;
  const formattedPlayers = new Intl.NumberFormat('en-US').format(game.playerCount);

  return (
    <Link
      href={`/games/${game.slug}`}
      onClick={() => playBlip()}
      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-2xl"
    >
      <motion.div
        variants={cardItemVariants}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className={`flex flex-col h-full ${className}`}
      >
        <div className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] group-hover:border-[var(--accent-primary)] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(240,163,82,0.25)] transition-all duration-300">
          {/* Top Amber Flare Line (DESIGN.md) */}
          <div className="top-amber-flare" />

          {/* Top Section: Cinematic Game Artwork */}
          <div className="relative w-full h-48 md:h-52 overflow-hidden select-none bg-[#0D0B09]">
            {/* Cinematic Western Game Artwork with smooth hover zoom */}
            {!imgError ? (
              <img
                src={imageSrc}
                alt={game.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.85] contrast-[1.08]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#241D17] to-[#0D0B09] flex items-center justify-center">
                <ThematicIcon className="w-12 h-12 text-[var(--accent-primary)]/40" />
              </div>
            )}

            {/* Dark Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-primary)] via-black/40 to-black/20 pointer-events-none" />

            {/* Top Left: Category Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md bg-black/75 border ${badgeColor}`}>
                {game.category}
              </span>
            </div>

            {/* Top Right: Rating */}
            {game.rating && (
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/75 border border-white/10 text-[#FFF8F0]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{game.rating.toFixed(1)}</span>
                </span>
              </div>
            )}

            {/* Bottom Right: Emblem */}
            <div className="absolute bottom-3 right-3 z-10">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-black/80 border border-white/10 group-hover:border-[var(--accent-primary)] transition-colors shadow-lg">
                <ThematicIcon className="w-4 h-4 text-[var(--accent-primary)]" />
              </div>
            </div>
          </div>

          {/* Bottom Section: Details & Action */}
          <div className="p-5 flex flex-col flex-1 justify-between bg-[var(--surface-primary)]">
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FFF8F0] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1 mb-2">
                {game.name}
              </h3>

              <p className="text-xs md:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[rgba(240,163,82,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{formattedPlayers} in duels</span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent-primary)] text-[#0D0B09] group-hover:bg-[var(--gold-light)] transition-colors shadow-sm">
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default GameCard;
