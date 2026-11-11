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
  MessageCircle,
  Flame,
  UserPlus,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import {
  CyberReveal,
  CyberCounter,
} from '@/components/motion';
import { playBlip, playEngage } from '@/lib/sound';

const UPCOMING_COMMUNITY_FEATURES = [
  {
    icon: MessageSquare,
    title: 'Strategy & Tactics Guilds',
    description:
      'Exchange opening theories for Tic-Tac-Toe, optimal turn paths in Snake, and mnemonic memory triggers with master tacticians.',
    status: 'In Development',
    members: '1.4K active',
  },
  {
    icon: Trophy,
    title: 'Weekly Community Cups',
    description:
      'Compete in automated weekend knockout tournaments with real-time bracket tracking and exclusive seasonal profile banners.',
    status: 'Alpha Testing',
    members: 'Registration open',
  },
  {
    icon: Radio,
    title: 'Live Spectator Amphitheater',
    description:
      'Watch high-stakes matches between top 100 contenders live with peer-to-peer sync and celebratory crimson reactions.',
    status: 'Coming Soon',
    members: 'P2P Sync',
  },
  {
    icon: Shield,
    title: 'Player Guilds & Alliances',
    description:
      'Form private gaming circles, participate in guild vs. guild ladder wars, and pool trophy multipliers together.',
    status: 'Planned',
    members: 'Frontier Clans',
  },
];

const RECENT_DISCUSSIONS = [
  {
    id: 1,
    title: 'Corner Gambit strategies in Tic-Tac-Toe vs Master AI',
    author: 'Vanguard_01',
    replies: 42,
    tag: 'Guide',
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Breaking 10,000 points in Snake: wall hugging vs zig-zag pathing',
    author: 'ShadowStrike',
    replies: 88,
    tag: 'Tactics',
    time: '4h ago',
  },
  {
    id: 3,
    title: 'Seasonal Tournament #4 announcement and qualification rules',
    author: 'Arcadia_Staff',
    replies: 156,
    tag: 'Official',
    time: '1d ago',
  },
];

export default function CommunityPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      playEngage();
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-8 select-none">
        {/* ========================================================================= */}
        {/* HERO BANNER                                                              */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#291010] via-[#351414] to-[#220C0C] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative">
          <div className="max-w-xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-xs font-mono font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>THE ARCADIA FELLOWSHIP</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Community &amp; Guilds
            </h1>
            <p className="text-xs sm:text-sm text-[#C7A9A3] leading-relaxed">
              Where players forge alliances, challenge reigning masters, and shape
              the evolution of Arcadia&apos;s casual multiplayer gaming universe.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="px-4 py-2.5 rounded-2xl bg-[#1C0A0A] border border-white/10 flex items-center gap-2 text-xs text-[#C7A9A3]">
              <Flame size={15} className="text-[#E34242]" />
              <span>Online Contenders:</span>
              <span className="font-mono font-bold text-white">
                <CyberCounter value={4812} />
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN GUILD DISCUSSIONS & UPCOMING MODULES GRID                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Upcoming Community Features (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E34242] font-semibold">
                <Sparkles size={14} />
                <span>Guild Chambers</span>
              </div>
              <span className="text-xs font-mono text-[#8C6D68]">Active Construction</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {UPCOMING_COMMUNITY_FEATURES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.28, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    className="rounded-[24px] bg-[#291010] border border-white/[0.08] hover:border-[#E34242]/50 p-5 flex flex-col justify-between transition-colors duration-200 hover:shadow-[0_12px_28px_rgba(227,66,66,0.2)] group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center transition-transform group-hover:scale-108">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#1C0A0A] border border-white/10 text-[#E34242] font-semibold">
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-base font-heading font-bold text-white mb-1.5 group-hover:text-[#FF7878] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#C7A9A3] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#8C6D68] font-mono">
                      <span>{item.members}</span>
                      <span className="text-[#E34242] font-semibold">Roadmap</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Live Discussions List */}
            <CyberReveal className="rounded-[24px] bg-[#291010] border border-white/[0.08] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <MessageCircle size={15} className="text-[#E34242]" />
                  <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                    Recent Arena Dispatches
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#E34242]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E34242]" />
                  Live Feed
                </span>
              </div>

              <div className="space-y-2.5">
                {RECENT_DISCUSSIONS.map((disc) => (
                  <motion.div
                    key={disc.id}
                    whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
                    onClick={() => playBlip()}
                    className="p-3.5 rounded-2xl bg-[#1C0A0A]/70 hover:bg-[#351414] border border-white/[0.04] hover:border-[#E34242]/35 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#E34242]/20 text-[#E34242] font-bold">
                          {disc.tag}
                        </span>
                        <span className="text-xs font-semibold text-white group-hover:text-[#FF7878] transition-colors">
                          {disc.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#8C6D68] font-mono">
                        <span>By {disc.author}</span>
                        <span>•</span>
                        <span>{disc.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#C7A9A3] shrink-0">
                      <MessageSquare size={13} className="text-[#E34242]" />
                      <span>{disc.replies}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CyberReveal>
          </div>

          {/* Right: Guild Dispatch Newsletter & Clan Founder Callout (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[24px] bg-[#291010] border border-[#E34242]/30 p-6 shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/35 text-[#E34242] flex items-center justify-center mb-4 shadow-[0_0_16px_rgba(227,66,66,0.2)]">
                <Bell className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-heading font-extrabold text-white mb-2">
                Join the Guild Dispatch
              </h3>

              <p className="text-xs text-[#C7A9A3] leading-relaxed mb-5">
                Subscribe for exclusive tournament access, seasonal balance patches, and early tester founder badges.
              </p>

              {subscribed ? (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Welcome to the Vanguard. Dispatch confirmed.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your console email..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E34242] to-[#C83A35] hover:from-[#EF5350] hover:to-[#D32F2F] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Join Vanguard</span>
                  </button>
                </form>
              )}
            </div>

            {/* Frontier Guild Callout Card */}
            <div className="rounded-[24px] bg-gradient-to-br from-[#291010] to-[#1C0A0A] border border-white/[0.08] p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E34242] font-semibold">
                <UserPlus size={14} />
                <span>Founding Guilds</span>
              </div>
              <h4 className="text-sm font-heading font-bold text-white">
                Register Your Clan
              </h4>
              <p className="text-xs text-[#C7A9A3] leading-relaxed">
                Arcadia clans will receive reserved tags, dedicated voice frequency channels, and private tournaments.
              </p>
              <div className="pt-1">
                <span className="inline-block text-[11px] font-mono text-[#E34242] font-bold">
                  Applications open in Season 2 →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
