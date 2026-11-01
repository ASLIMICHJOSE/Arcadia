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
  Radio,
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
        badgeColor: 'text-[var(--success)] bg-[var(--success-bg)] border-[rgba(78,173,123,0.3)]',
        accentGlow: '0 0 12px rgba(78,173,123,0.25)',
      };
    case 'level_up':
      return {
        badgeColor: 'text-purple-300 bg-purple-900/30 border-purple-500/30',
        accentGlow: '0 0 12px rgba(168,85,247,0.25)',
      };
    case 'friend':
      return {
        badgeColor: 'text-[var(--info)] bg-[var(--info-bg)] border-[rgba(79,134,198,0.3)]',
        accentGlow: '0 0 12px rgba(79,134,198,0.25)',
      };
    case 'game_played':
    default:
      return {
        badgeColor: 'text-[var(--gold)] bg-[var(--gold-muted)] border-[var(--glass-border-gold)]',
        accentGlow: 'var(--gold-glow-sm)',
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
    <GlassPanel padding="lg" className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[var(--border-radius-sm,8px)] flex items-center justify-center text-[var(--gold)]"
            style={{
              background: 'var(--gold-muted)',
              border: '1px solid var(--glass-border-gold)',
            }}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3
              className="text-lg font-serif font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              {title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Platform timeline events</p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Live
          </span>
        </div>
      </div>

      {/* Activities Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative space-y-4 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-[1px] before:bg-[var(--glass-border)]"
      >
        {displayedActivities.map((activity, index) => {
          const IconComponent = resolveActivityIcon(activity.icon, activity.type);
          const { badgeColor, accentGlow } = getActivityTypeStyles(activity.type);

          return (
            <motion.div
              key={activity.id || `${activity.type}-${index}`}
              variants={itemVariants}
              className="relative flex items-start gap-3.5 group pl-0.5"
            >
              {/* Type Icon Badge */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border shrink-0 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 ${badgeColor}`}
                style={{ boxShadow: accentGlow }}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Activity Message and Time */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs md:text-sm text-[var(--text-primary)] leading-snug group-hover:text-[var(--text-gold)] transition-colors">
                  {activity.message}
                </p>
                <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1 block">
                  {activity.time}
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
