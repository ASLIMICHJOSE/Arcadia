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
      badgeColor: 'border-[#E34242]/45 text-[#FF8A8A]',
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
    badgeColor: 'border-[#E34242]/45 text-[#FF8A8A]',
  };
}

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.34, ease: [0.16, 1, 0.3, 1] as const },
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
      prefetch={true}
      onClick={() => playBlip()}
      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34242] rounded-2xl"
    >
      <motion.div
        variants={cardItemVariants}
        whileHover={{ y: -6, transition: { type: 'spring', stiffness: 360, damping: 24 } }}
        whileTap={{ scale: 0.985 }}
        className={`flex flex-col h-full ${className}`}
      >
        <div className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-[var(--surface-primary)] border border-white/[0.08] group-hover:border-[#E34242]/65 group-hover:shadow-[0_14px_32px_rgba(0,0,0,0.75)] transition-all duration-200">
          {/* Top Crimson Flare Line */}
          <div className="top-flare" />

          {/* Top Section: Cinematic Game Artwork */}
          <div className="relative w-full h-48 md:h-52 overflow-hidden select-none bg-[#140707]">
            {!imgError ? (
              <img
                src={imageSrc}
                alt={game.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#351414] to-[#140707] flex items-center justify-center">
                <ThematicIcon className="w-12 h-12 text-[#E34242]/50" />
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
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/75 border border-white/10 text-[#FFF5F0]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{game.rating.toFixed(1)}</span>
                </span>
              </div>
            )}

            {/* Bottom Right: Emblem */}
            <div className="absolute bottom-3 right-3 z-10">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-black/80 border border-white/10 group-hover:border-[#E34242] transition-colors shadow-lg">
                <ThematicIcon className="w-4 h-4 text-[#E34242]" />
              </div>
            </div>
          </div>

          {/* Bottom Section: Details & Action */}
          <div className="p-5 flex flex-col flex-1 justify-between bg-[var(--surface-primary)]">
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FFF5F0] group-hover:text-[#FF7878] transition-colors line-clamp-1 mb-2">
                {game.name}
              </h3>

              <p className="text-xs md:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <Users className="w-3.5 h-3.5 text-[#E34242]" />
                <span>{formattedPlayers} in duels</span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#E34242] to-[#C83A35] text-white group-hover:from-[#F05555] group-hover:to-[#E34242] transition-all shadow-[0_2px_12px_rgba(227,66,66,0.35)]">
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
