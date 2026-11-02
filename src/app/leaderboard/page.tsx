'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Calendar,
  Flame,
  Shield,
  Clock,
  Swords,
  Medal,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import LeaderboardPreview from '@/components/ui/LeaderboardPreview';
import GlassPanel from '@/components/ui/GlassPanel';
import { DEMO_LEADERBOARD } from '@/lib/constants';
import { playBlip } from '@/lib/sound';

type Timeframe = 'all-time' | 'month' | 'week';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Timeframe>('all-time');

  const tabsList = [
    { id: 'all-time' as Timeframe, label: 'All Time', icon: Crown },
    { id: 'month' as Timeframe, label: 'This Month', icon: Calendar },
    { id: 'week' as Timeframe, label: 'This Week', icon: Flame },
  ];

  return (
    <AppShell>
      <div className="space-y-6 pb-8 select-none">
        {/* Header Banner */}
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#291010] via-[#351414] to-[#220C0C] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-xs font-mono font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>HALL OF CHAMPIONS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Global Leaderboards
            </h1>
            <p className="text-xs sm:text-sm text-[#C7A9A3] leading-relaxed">
              The apex contenders of Arcadia. Verified deterministic matchmaking stats, ELO ratings,
              and seasonal championship medallions.
            </p>
          </div>

          {/* Timeframe Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#1C0A0A] border border-white/10">
            {tabsList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playBlip();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E34242] text-white shadow-[0_0_12px_rgba(227,66,66,0.6)]'
                      : 'text-[#C7A9A3] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Podium Highlights (Top 3 Contenders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          <div className="order-2 md:order-1">
            <div className="text-center relative pt-8 p-5 rounded-[24px] bg-[#291010]/95 border border-slate-400/25 shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-bold flex items-center justify-center text-xs shadow-md">
                2
              </div>
              <div className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-slate-300 p-0.5 bg-slate-800 flex items-center justify-center font-heading text-base font-bold text-slate-200">
                SW
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                SolonTheWise
              </h3>
              <span className="text-[11px] font-mono text-[#E34242]">Archon • 76% Win Rate</span>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-around text-xs">
                <div>
                  <span className="text-[9px] text-[#987B77] block uppercase font-mono">Score</span>
                  <span className="font-mono font-bold text-white">114,890</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#987B77] block uppercase font-mono">Wins</span>
                  <span className="font-mono font-bold text-white">589</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1st Place (Crown) */}
          <div className="order-1 md:order-2">
            <div className="text-center relative pt-9 p-6 rounded-[28px] bg-gradient-to-b from-[#351414] to-[#291010] border-2 border-[#E34242] shadow-[0_0_30px_rgba(227,66,66,0.3)]">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[#E34242] to-[#C83A35] text-white font-bold flex items-center justify-center shadow-lg border border-white/30">
                <Crown className="w-5 h-5 fill-current" />
              </div>
              <div className="w-18 h-18 rounded-full mx-auto mb-2 border-2 border-[#E34242] p-0.5 bg-[#441A1A] flex items-center justify-center font-heading text-xl font-bold text-white shadow-md">
                AP
              </div>
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-[10px] font-mono uppercase tracking-wider mb-1 font-semibold">
                CHAMPION OF THE REALM
              </div>
              <h3 className="font-heading font-black text-lg text-white">
                Aurelius_Prime
              </h3>
              <span className="text-xs font-mono text-[#E34242]">Imperator • 79% Win Rate</span>
              <div className="mt-4 pt-3 border-t border-[#E34242]/30 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[9px] text-[#987B77] block uppercase font-mono">Score</span>
                  <span className="font-mono font-bold text-base text-[#E34242]">128,450</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#987B77] block uppercase font-mono">Wins</span>
                  <span className="font-mono font-bold text-base text-white">642</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3">
            <div className="text-center relative pt-8 p-5 rounded-[24px] bg-[#291010]/95 border border-[#8D3434]/40 shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#8D3434] text-amber-100 font-bold flex items-center justify-center text-xs shadow-md">
                3
              </div>
              <div className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-[#8D3434] p-0.5 bg-[#381515] flex items-center justify-center font-heading text-base font-bold text-amber-200">
                TB
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                TheodoraB
              </h3>
              <span className="text-[11px] font-mono text-[#E34242]">Legatus • 72% Win Rate</span>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-around text-xs">
                <div>
                  <span className="text-[9px] text-[#987B77] block uppercase font-mono">Score</span>
                  <span className="font-mono font-bold text-white">98,320</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#987B77] block uppercase font-mono">Wins</span>
                  <span className="font-mono font-bold text-white">491</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <section>
          <LeaderboardPreview
            entries={DEMO_LEADERBOARD}
            limit={10}
            title="Full Arena Standings"
          />
        </section>
      </div>
    </AppShell>
  );
}
