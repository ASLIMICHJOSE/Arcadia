'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Crown,
  Swords,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui';
import { DEMO_ACHIEVEMENTS, Achievement } from '@/lib/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  swords: Swords,
  award: Award,
  crown: Crown,
  zap: Zap,
  shield: Shield,
  star: Star,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function AchievementsPage() {
  const unlockedCount = DEMO_ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = DEMO_ACHIEVEMENTS.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);
  const totalXpEarned = DEMO_ACHIEVEMENTS.reduce(
    (acc, a) => (a.unlocked && a.xpReward ? acc + a.xpReward : acc),
    0
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="border-b border-[var(--glass-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
            <Award size={14} />
            <span>Honors & Distinctions</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
          >
            Achievements
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
            Battle medals and legendary accomplishments. Unlock distinctions to elevate your frontier title and earn XP rewards.
          </p>
        </div>

        {/* Overview Stats Badge */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
              Unlocked
            </span>
            <span className="text-sm font-bold font-mono text-[var(--gold-light)]">
              {unlockedCount} / {totalCount} ({overallPercent}%)
            </span>
          </div>
          <div className="h-8 w-px bg-[var(--glass-border)]" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
              Reward XP
            </span>
            <span className="text-sm font-bold font-mono text-[#4EAD7B]">
              +{totalXpEarned.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {DEMO_ACHIEVEMENTS.map((achievement: Achievement) => {
          const Icon = ICON_MAP[achievement.icon] || Award;
          const isUnlocked = achievement.unlocked;

          return (
            <motion.div key={achievement.id} variants={itemVariants}>
              <GlassPanel
                hover={isUnlocked}
                padding="lg"
                className={`relative flex flex-col justify-between h-full transition-all duration-300 ${
                  isUnlocked
                    ? 'border-[var(--gold)] shadow-[var(--gold-glow-sm)] bg-[#211C16]/85 hover:shadow-[var(--gold-glow)]'
                    : 'opacity-70 bg-[#161411]/60 border-[var(--glass-border)] hover:opacity-85'
                }`}
              >
                {/* Background Glow for Unlocked */}
                {isUnlocked && (
                  <div
                    className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-25 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
                    }}
                  />
                )}

                <div>
                  {/* Top Bar: Icon + Tier + Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-[#372A1C] to-[#1A1713] border border-[var(--gold)] text-[var(--gold)] shadow-md'
                          : 'bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--text-muted)]'
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <div className="flex items-center gap-2">
                      {achievement.tier && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            achievement.tier === 'Platinum'
                              ? 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30'
                              : achievement.tier === 'Gold'
                              ? 'text-[var(--gold-light)] border-[var(--gold)]/40 bg-[var(--gold-muted)]'
                              : achievement.tier === 'Silver'
                              ? 'text-slate-300 border-slate-400/40 bg-slate-800/30'
                              : 'text-amber-500 border-amber-700/40 bg-amber-950/30'
                          }`}
                        >
                          {achievement.tier}
                        </span>
                      )}

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#4EAD7B] bg-[#4EAD7B]/10 border border-[#4EAD7B]/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-elevated)] border border-[var(--glass-border)] px-2 py-0.5 rounded-full">
                          <Lock size={12} />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Achievement Name & Description */}
                  <h3
                    className={`text-lg font-serif font-bold tracking-tight mb-1.5 ${
                      isUnlocked ? 'text-[var(--gold-light)]' : 'text-[var(--text-secondary)]'
                    }`}
                    style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
                  >
                    {achievement.name}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    {achievement.description}
                  </p>
                </div>

                {/* Progress Bar & Reward */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[10px] uppercase text-[var(--text-muted)]">
                      Progress
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isUnlocked ? 'text-[var(--gold)]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {achievement.progress}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-2 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] shadow-[var(--gold-glow-sm)]'
                          : 'bg-[var(--gold-dark)]/60'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>

                  {/* XP Reward Label */}
                  {achievement.xpReward && (
                    <div className="mt-3.5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        Distinction Reward
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold flex items-center gap-1 ${
                          isUnlocked ? 'text-[var(--gold-light)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <Sparkles size={12} />
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
