'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  MessageSquare,
  Sparkles,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui';

export default function FriendsPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-primary)] mb-1">
          <Users size={14} />
          <span>Frontier Fellowship</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)] tracking-tight">
          Friends &amp; Guilds
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
          Connect with trusted allies, challenge honorable rivals, and forge formidable syndicates across Arcadia.
        </p>
      </div>

      {/* Main Panel */}
      <GlassPanel
        padding="lg"
        className="relative overflow-hidden text-center py-16 px-6 sm:px-12 flex flex-col items-center justify-center max-w-3xl mx-auto bg-[var(--surface-primary)] border-[rgba(227,66,66,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
      >
        {/* Decorative background glows */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #E34242 0%, transparent 70%)',
          }}
        />

        {/* Animated Central Emblem */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border border-dashed border-[rgba(227,66,66,0.4)] absolute -inset-2 pointer-events-none"
          />

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#421919] via-[#351313] to-[#260D0D] border-2 border-[var(--accent-primary)] flex items-center justify-center text-white shadow-[0_0_24px_rgba(227,66,66,0.25)]"
          >
            <Users size={38} className="text-[var(--accent-primary)]" />
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--accent-primary)] bg-[rgba(227,66,66,0.12)] border border-[rgba(227,66,66,0.3)] mb-4">
          <Sparkles size={14} className="text-[var(--accent-primary)]" />
          <span>Alliance Network</span>
        </div>

        {/* Headings */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
          Friend System Active In Next Rollout
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed">
          The Arcadia syndicate registry is currently being assembled. You can already review live friends in the right-side social rail, and full party management is rolling out this season.
        </p>

        {/* Notification CTA */}
        <div className="w-full max-w-md p-5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] backdrop-blur-md mb-8">
          {notified ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-400"
            >
              <CheckCircle2 size={18} />
              <span>We&apos;ll notify you when the syndicate system launches!</span>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[var(--text-secondary)]">
                Request instant priority notification:
              </span>
              <button
                type="button"
                onClick={() => setNotified(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#E34242] to-[#C83A35] text-white hover:from-[#EF5350] hover:to-[#D32F2F] shadow-[0_4px_16px_rgba(227,66,66,0.35)] transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <Bell size={13} />
                <span>Notify Me</span>
              </button>
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left pt-6 border-t border-[var(--border-subtle)]">
          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] mb-1">
              <UserPlus size={15} />
              <span className="text-xs font-semibold">Instant Invites</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Search by username or send one-click duel links via social channels.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] mb-1">
              <MessageSquare size={15} />
              <span className="text-xs font-semibold">Tavern Whispers</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Direct and party messaging with custom frontier emotes and duel challenges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] mb-1">
              <Shield size={15} />
              <span className="text-xs font-semibold">Guild Syndicates</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Band together with comrades for collective leaderboard glory.
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
