'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Bell,
  Sparkles,
  Users,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui';

export default function MultiplayerPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() || !email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="border-b border-[var(--glass-border)] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
          <Swords size={14} />
          <span>Combat Guilds</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
        >
          Multiplayer Rooms
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
          Real-time matchmaking, custom duel lobbies, and competitive wagering amphitheaters.
        </p>
      </div>

      {/* Main Coming Soon Panel */}
      <GlassPanel
        padding="lg"
        className="relative overflow-hidden text-center py-16 px-6 sm:px-12 flex flex-col items-center justify-center max-w-3xl mx-auto border-[var(--glass-border-gold)]"
      >
        {/* Background Radial Glow */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--amber) 0%, transparent 70%)',
          }}
        />

        {/* Animated Central Icon */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border border-dashed border-[var(--gold)]/40 absolute -inset-2 pointer-events-none"
          />

          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#372A1C] via-[#211C16] to-[#151310] border-2 border-[var(--gold)] flex items-center justify-center text-[var(--gold-light)] shadow-[var(--gold-glow)]"
          >
            <Swords size={38} className="text-[var(--gold)]" />
          </motion.div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--gold)] bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] mb-4">
          <Flame size={14} className="text-[#E09F3E]" />
          <span>Under Heavy Blacksmithing</span>
        </div>

        {/* Heading & Description */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
        >
          Real-time Multiplayer Rooms Are Being Forged
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed">
          Real-time multiplayer rooms are being forged in the fires of the frontier. Soon you will challenge friends to synchronized, low-latency duels with live spectator galleries.
        </p>

        {/* Notification Opt-in Box */}
        <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--glass-border)] backdrop-blur-md mb-8">
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-sm font-medium text-[#4EAD7B]"
            >
              <CheckCircle2 size={20} />
              <span>We&apos;ll notify you the instant multiplayer launches!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-[var(--gold-light)] font-medium mb-1">
                <Bell size={14} />
                <span>We&apos;ll notify you when multiplayer launches</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="frontier.scout@arcadia.game"
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--bronze)] text-[#100F0D] hover:from-[var(--gold-light)] hover:to-[var(--gold-dark)] shadow-[var(--gold-glow-sm)] transition-all whitespace-nowrap cursor-pointer"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Upcoming Features Teaser */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left pt-6 border-t border-[var(--glass-border)]">
          <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/60 border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 text-[var(--gold)] mb-1">
              <Radio size={15} />
              <span className="text-xs font-semibold">WebRTC Duels</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Direct peer-to-peer architecture for zero perceptible input lag.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/60 border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 text-[var(--gold)] mb-1">
              <Users size={15} />
              <span className="text-xs font-semibold">Private Rooms</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Share 6-character room codes with friends or host open lobbies.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/60 border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 text-[var(--gold)] mb-1">
              <Sparkles size={15} />
              <span className="text-xs font-semibold">Live Spectating</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Cheer on tournament finalists with live reaction cheers and glyphs.
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
