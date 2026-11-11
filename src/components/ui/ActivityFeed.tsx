'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  Award,
  UserPlus,
  Gamepad2,
  Zap,
  Swords,
  Send,
  Activity,
  LucideIcon,
} from 'lucide-react';
import GlassPanel from './GlassPanel';
import { DEMO_ACTIVITY, ActivityItem, ActivityType } from '@/lib/constants';

export interface ActivityFeedProps {
  activities?: readonly ActivityItem[] | ActivityItem[];
  limit?: number;
  title?: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
};

// Map icon string identifier to Lucide component
function resolveActivityIcon(iconName: string, type: ActivityType): LucideIcon {
  switch (iconName.toLowerCase()) {
    case 'trophy':
      return Trophy;
    case 'sparkles':
      return Sparkles;
    case 'award':
      return Award;
    case 'user-plus':
    case 'userplus':
      return UserPlus;
    case 'gamepad-2':
    case 'gamepad':
      return Gamepad2;
    case 'zap':
      return Zap;
    case 'swords':
      return Swords;
    case 'send':
      return Send;
    default:
      if (type === 'game_played') return Gamepad2;
      if (type === 'achievement') return Award;
      if (type === 'level_up') return Sparkles;
      if (type === 'friend') return UserPlus;
      return Activity;
  }
}

// Visual themes for different activity types
function getActivityTypeStyles(type: ActivityType) {
  switch (type) {
    case 'achievement':
      return {
        badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
        accentGlow: '0 0 12px rgba(245,158,11,0.25)',
      };
    case 'level_up':
      return {
        badgeColor: 'text-purple-300 bg-purple-950/40 border-purple-500/30',
        accentGlow: '0 0 12px rgba(168,85,247,0.25)',
      };
    case 'friend':
      return {
        badgeColor: 'text-sky-300 bg-sky-950/40 border-sky-500/30',
        accentGlow: '0 0 12px rgba(56,189,248,0.2)',
      };
    case 'game_played':
    default:
      return {
        badgeColor: 'text-[#E34242] bg-[#E34242]/15 border-[#E34242]/35',
        accentGlow: '0 0 12px rgba(227,66,66,0.25)',
      };
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = DEMO_ACTIVITY,
  limit = 6,
  title = 'Recent Activity',
  className = '',
}) => {
  const displayedActivities = activities.slice(0, limit);

  return (
    <GlassPanel padding="lg" showFlare className={`flex flex-col bg-[var(--surface-primary)] border-white/[0.08] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#E34242] bg-[var(--surface-secondary)] border border-[#E34242]/35 shadow-[0_0_12px_rgba(227,66,66,0.25)]"
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-black text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Live feed across the arena</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full text-[#E34242] bg-[#E34242]/12 border border-[#E34242]/35 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34242]" />
          Real-Time
        </span>
      </div>

      {/* Activities list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-3 flex-1"
      >
        {displayedActivities.map((item) => {
          const Icon = resolveActivityIcon(item.icon, item.type);
          const { badgeColor, accentGlow } = getActivityTypeStyles(item.type);

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[var(--surface-secondary)]/50 transition-colors group cursor-default"
            >
              {/* Type-differentiated Icon Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${badgeColor}`}
                style={{ boxShadow: accentGlow }}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Message & Relative Timestamp */}
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-[var(--text-primary)] leading-snug group-hover:text-white transition-colors">
                  {item.message}
                </p>
                <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-1">
                  {item.time}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </GlassPanel>
  );
};

export default ActivityFeed;
