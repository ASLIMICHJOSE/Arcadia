'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Gamepad2, SlidersHorizontal, RotateCcw } from 'lucide-react';
import GameCard from './GameCard';
import PrimaryButton from './PrimaryButton';
import { FEATURED_GAMES, FeaturedGame } from '@/lib/constants';

export interface GameGridProps {
  games?: readonly FeaturedGame[] | FeaturedGame[];
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

const CATEGORIES = ['All', 'Strategy', 'Arcade', 'Puzzle', 'Classic', 'Casual'] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const GameGrid: React.FC<GameGridProps> = ({
  games = FEATURED_GAMES,
  title,
  subtitle,
  showSearch = true,
  showFilters = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter games based on category and search query
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category check
      const matchesCategory =
        selectedCategory === 'All' ||
        game.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Classic' &&
          (game.category.toLowerCase() === 'casual' || game.slug.includes('rock')));

      // Search query check
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [games, selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <section className={`w-full ${className}`}>
      {/* Optional Section Header */}
      {(title || subtitle || showSearch || showFilters) && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {title && (
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--text-primary)] tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
                )}
              </div>
            )}

            {/* Search Input */}
            {showSearch && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search arena games..."
                  className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-[var(--surface-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Category Filter Chips */}
          {showFilters && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
              <SlidersHorizontal className="w-4 h-4 text-[var(--accent-primary)] mr-1 shrink-0 hidden sm:block" />
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 border cursor-pointer select-none ${
                      isActive
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[0_0_14px_rgba(227,66,66,0.35)]'
                        : 'bg-[var(--surface-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Grid of Game Cards */}
      <AnimatePresence mode="wait">
        {filteredGames.length > 0 ? (
          <motion.div
            key={`${selectedCategory}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} delay={index * 0.05} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--surface-secondary)] text-[var(--accent-primary)] mb-4 border border-[var(--border-subtle)] shadow-[0_0_16px_rgba(227,66,66,0.15)]">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-heading font-bold text-[var(--text-primary)] mb-1">
              No Titles Located
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
              No games matched your query for &ldquo;{searchQuery || selectedCategory}&rdquo;. Try
              adjusting your search term or exploring another category.
            </p>
            <PrimaryButton
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleClearFilters}
            >
              Reset Filters
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GameGrid;
