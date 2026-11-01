'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle,
  Radio,
  Trophy,
  Shield,
  Bell,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassPanel from '@/components/ui/GlassPanel';

const UPCOMING_COMMUNITY_FEATURES = [
  {
    icon: MessageSquare,
    title: 'Strategy & Tactics Guilds',
    description:
      'Exchange opening theories for Tic-Tac-Toe, optimal turn paths in Snake, and mnemonic memory triggers with master tacticians.',
    status: 'In Development',
  },
  {
    icon: Trophy,
    title: 'Weekly Community Cups',
    description:
      'Compete in automated weekend knockout tournaments with real-time bracket tracking and exclusive seasonal profile banners.',
    status: 'Alpha Testing',
  },
  {
    icon: Radio,
    title: 'Live Spectator Amphitheater',
    description:
      'Watch high-stakes matches between top 100 contenders live with peer-to-peer sync and celebratory gilded reactions.',
    status: 'Coming Soon',
  },
  {
    icon: Shield,
    title: 'Player Guilds & Alliances',
    description:
      'Form private gaming circles, participate in guild vs. guild ladder wars, and pool trophy multipliers together.',
    status: 'Planned',
  },
];

export default function CommunityPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* ========================================================================= */}
        {/* HERO BANNER                                                              */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[38vh] md:min-h-[42vh] flex items-center justify-center overflow-hidden border-b border-[var(--glass-border)]">
          {/* Layered Dusk & Gold Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 65%, rgba(79, 134, 198, 0.16) 0%, rgba(142, 62, 18, 0.12) 40%, transparent 75%),
                linear-gradient(180deg, #10121A 0%, #17151D 40%, #251614 75%, #100F0D 100%)
              `,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/30 pointer-events-none" />

          {/* Banner Text Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30 bg-[rgba(197,164,109,0.08)] backdrop-blur-md text-[var(--gold)] font-mono text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            >
              <Users className="w-3.5 h-3.5" />
              THE ARCADIA FELLOWSHIP
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
            >
              Community
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
            >
              Where players forge alliances, challenge reigning masters, and shape
              the evolution of Arcadia&apos;s neoclassical gaming sanctuary.
            </motion.p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMING SOON CONTENT & DESCRIPTION                                        */}
        {/* ========================================================================= */}
        <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Main Coming Soon Headline Card */}
          <GlassPanel
            padding="lg"
            className="p-8 sm:p-12 mb-16 text-center border-[var(--gold)]/30 shadow-[var(--gold-glow-sm)] relative overflow-hidden"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(197,164,109,0.12)] border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Under Active Construction
              </span>

              <h2
                className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                The Arcadian Guild Hall Is Arriving
              </h2>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                We are architecting a social amphitheater tailored for pure competitive integrity.
                No algorithmic toxicity — only celebrated accomplishments, high-level theorycrafting,
                and spirited match play.
              </p>
            </div>
          </GlassPanel>

          {/* Upcoming Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {UPCOMING_COMMUNITY_FEATURES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                >
                  <GlassPanel
                    hover
                    padding="lg"
                    className="h-full flex flex-col justify-between border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] text-[var(--gold)] flex items-center justify-center shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--gold)]">
                          {item.status}
                        </span>
                      </div>

                      <h3
                        className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2"
                        style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                      >
                        {item.title}
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center text-xs text-[var(--text-muted)] font-mono">
                      <span>Feature Preview • Phase 2 Roadmap</span>
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* EMAIL SIGNUP PLACEHOLDER                                                 */}
          {/* ========================================================================= */}
          <div className="max-w-2xl mx-auto">
            <GlassPanel
              padding="lg"
              className="p-8 sm:p-10 text-center border-[var(--gold)]/30"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--gold-muted)] border border-[var(--gold)]/30 text-[var(--gold)] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Bell className="w-5 h-5" />
              </div>

              <h3
                className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                Join the Guild Dispatch
              </h3>

              <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Subscribe for private invitations to community tournaments, patch notes,
                and guild founder badges.
              </p>

              {subscribed ? (
                <div className="p-4 bg-[rgba(78,173,123,0.15)] border border-[var(--success)] text-[var(--success)] rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-5 h-5" />
                  <span>Welcome to the Vanguard. We will notify you upon launch.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row items-center gap-3"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                  <button
                    type="submit"
                    className="gold-btn px-6 py-3 text-sm font-semibold whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#100F0D]" />
                    <span>Subscribe</span>
                  </button>
                </form>
              )}
            </GlassPanel>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
