'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play,
  ChevronRight,
  Bookmark,
  Sparkles,
  Flame,
  ArrowRight,
  Trophy,
  Zap,
  Swords,
  HardDrive,
  CheckCircle2,
  Gamepad2,
  Shield,
  Star,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import { playBlip, playEngage } from '@/lib/sound';

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6 pb-6 select-none">
        {/* ========================================================================= */}
        {/* ROW 1: FEATURED GAME HERO BANNER (LEFT) & QUICK GAMES ROSTER (RIGHT)      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-8 md:pt-10">
          {/* 1.1 Left: Major Featured Game Hero Banner (8 Cols) with Character Popping Out */}
          <div className="lg:col-span-8 relative">
            {/* The Character Image Popping Out Over the Card Top/Right Edge */}
            <div className="absolute -top-10 sm:-top-14 md:-top-18 lg:-top-20 right-0 sm:right-4 lg:right-6 w-[260px] sm:w-[330px] md:w-[380px] lg:w-[420px] h-[340px] sm:h-[410px] md:h-[460px] lg:h-[490px] z-20 pointer-events-none select-none">
              {/* Radial fiery ember glow behind the character */}
              <div
                className="absolute inset-0 -top-6 rounded-full opacity-65 blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(227, 66, 66, 0.7) 0%, rgba(139, 26, 26, 0.4) 40%, transparent 70%)',
                }}
              />

              {/* Character Cutout Graphic */}
              <img
                src="/images/hero-character.jpg"
                alt="Cyber Serpent Titan Warrior"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] filter contrast-[1.15] saturate-[1.25]"
              />
            </div>

            {/* Inner Card Container */}
            <div className="relative rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-r from-[#220C0C] via-[#2D1010] to-[#1C0A0A] min-h-[340px] sm:min-h-[380px] md:min-h-[400px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl z-10">
              {/* Glowing Red Sun Disk & Ambient Gradient Background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(circle at 68% 42%, rgba(227, 66, 66, 0.45) 0%, rgba(180, 45, 45, 0.25) 35%, transparent 70%),
                    linear-gradient(90deg, rgba(28, 10, 10, 0.98) 0%, rgba(28, 10, 10, 0.8) 45%, rgba(28, 10, 10, 0.25) 85%, transparent 100%),
                    linear-gradient(180deg, transparent 40%, rgba(28, 10, 10, 0.95) 100%)
                  `,
                }}
              />

              {/* Top Row: Badges (Featured, A*, PWA Offline) */}
              <div className="relative z-10 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E34242] text-white text-xs font-bold tracking-wide shadow-[0_0_14px_rgba(227,66,66,0.6)]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Featured
                </span>

                {/* Arcadia Emblem */}
                <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-400 font-black text-[11px] font-mono shadow-sm">
                  A*
                </div>

                {/* Offline Ready Badge */}
                <div className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-emerald-400 text-[10px] font-bold font-mono">
                  PWA OFFLINE READY
                </div>
              </div>

              {/* Center Content: Title, Subtitle, & Social Proof */}
              <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg my-auto py-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-[1.05] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  CYBER SERPENT <br />
                  <span className="text-[#E34242]">TITAN ARENA</span>
                </h1>

                <p className="mt-2.5 text-xs sm:text-sm text-[#C7A9A3] leading-relaxed max-w-sm drop-shadow line-clamp-2">
                  High-octane reflex trials on the digital grid. Outmaneuver shifting laser barriers, harvest core shards, and outlast rival AI.
                </p>

                {/* Social Proof & Play Now Button */}
                <div className="mt-5 flex flex-wrap items-center gap-3.5">
                  {/* Reviewers Avatar Stack */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-7 h-7 rounded-full border-2 border-[#1C0A0A] object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-7 h-7 rounded-full border-2 border-[#1C0A0A] object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80"
                        alt="User"
                        className="w-7 h-7 rounded-full border-2 border-[#1C0A0A] object-cover"
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 text-xs text-white font-medium">
                      👍 +18K Contenders
                    </span>
                  </div>

                  {/* Instant Play Action Button */}
                  <Link
                    href="/games/snake"
                    onClick={() => playEngage()}
                    className="px-6 py-2.5 rounded-full bg-white hover:bg-[#FFF5F0] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.6)] active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 1.2 Right: Quick Games Roster (4 Cols) - Tightly Fitted Without Awkward Gaps */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3 h-full">
            {/* Card 1: Tic-Tac-Toe Arena (Arcane Gambit) */}
            <Link
              href="/games/tic-tac-toe"
              onClick={() => playBlip()}
              className="flex-1 rounded-[22px] bg-[#291010] hover:bg-[#351414] border border-white/[0.08] hover:border-[#E34242]/50 p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 group shadow-lg"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10 relative shadow-inner">
                  <img
                    src="/images/games/tic-tac-toe.jpg"
                    alt="Tic-Tac-Toe Arena"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#E34242]/10" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white group-hover:text-[#E34242] transition-colors truncate">
                    Arcane Gambit
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] truncate">
                    Tic-Tac-Toe Arena (Turn-Based Strategy)
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#E34242] text-[#C7A9A3] group-hover:text-white flex items-center justify-center shrink-0 transition-colors ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Card 2: Memory Match (Rune Archive) */}
            <Link
              href="/games/memory-match"
              onClick={() => playBlip()}
              className="flex-1 rounded-[22px] bg-[#291010] hover:bg-[#351414] border border-white/[0.08] hover:border-[#E34242]/50 p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 group shadow-lg"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10 relative shadow-inner">
                  <img
                    src="/images/games/memory-match.jpg"
                    alt="Memory Match Arena"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#E34242]/10" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white group-hover:text-[#E34242] transition-colors truncate">
                    Rune Archive
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] truncate">
                    Memory Match (Concentration &amp; Recall)
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#E34242] text-[#C7A9A3] group-hover:text-white flex items-center justify-center shrink-0 transition-colors ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Card 3: Rock Paper Scissors (Elemental Duel) */}
            <Link
              href="/games/rock-paper-scissors"
              onClick={() => playBlip()}
              className="flex-1 rounded-[22px] bg-[#291010] hover:bg-[#351414] border border-white/[0.08] hover:border-[#E34242]/50 p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 group shadow-lg"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10 relative shadow-inner">
                  <img
                    src="/images/games/rock-paper-scissors.jpg"
                    alt="Elemental Duel"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#E34242]/10" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white group-hover:text-[#E34242] transition-colors truncate">
                    Elemental Duel
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] truncate">
                    Rock Paper Scissors (Tactical Mindgames)
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#E34242] text-[#C7A9A3] group-hover:text-white flex items-center justify-center shrink-0 transition-colors ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: LATEST ACTIVITIES (LEFT 8 COLS) & YOUR STATISTICS (RIGHT 4 COLS)   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 2.1 Left: Latest Activities (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-heading font-extrabold text-[#FFF5F0]">
                Latest Activities
              </h2>
              <Link
                href="/discover"
                onClick={() => playBlip()}
                className="text-xs font-semibold text-[#E34242] hover:text-white transition-colors"
              >
                See More
              </Link>
            </div>

            {/* 3 Activity Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
              {/* Activity Card 1: Master Tactician (Tic-Tac-Toe Duel) */}
              <div className="relative rounded-[22px] overflow-hidden bg-[#291010] border border-white/[0.07] h-[190px] flex flex-col justify-between p-4 group shadow-lg">
                <img
                  src="/images/games/tic-tac-toe.jpg"
                  alt="Master Tactician"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] contrast-[1.2] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/50 to-transparent" />

                {/* Overlays: Play & Bookmark */}
                <div className="relative z-10 flex items-center justify-between">
                  <Link
                    href="/games/tic-tac-toe"
                    onClick={() => playEngage()}
                    className="w-8 h-8 rounded-full bg-[#E34242] flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white cursor-pointer hover:border-[#E34242] transition-colors">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-sm text-white drop-shadow">
                    Master Tactician
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] mt-0.5">5-win streak against AI</p>
                  <p className="text-[10px] text-[#8C6D68] mt-1 font-mono">1 hour ago</p>
                </div>
              </div>

              {/* Activity Card 2: Speed Viper (Snake Arena) */}
              <div className="relative rounded-[22px] overflow-hidden bg-[#291010] border border-white/[0.07] h-[190px] flex flex-col justify-between p-4 group shadow-lg">
                <img
                  src="/images/games/snake.jpg"
                  alt="Speed Viper"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] contrast-[1.2] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/50 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <Link
                    href="/games/snake"
                    onClick={() => playEngage()}
                    className="w-8 h-8 rounded-full bg-[#E34242] flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[9px] font-bold">
                    HIGH SCORE
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-sm text-white drop-shadow">
                    Speed Viper
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] mt-0.5 line-clamp-1">
                    Reached 8,420 grid score
                  </p>
                  <p className="text-[10px] text-[#8C6D68] mt-1 font-mono">3 hours ago</p>
                </div>
              </div>

              {/* Activity Card 3: Rune Archive Completion (100% Circular Progress Meter) */}
              <div className="relative rounded-[22px] overflow-hidden bg-[#291010] border border-white/[0.07] h-[190px] flex flex-col justify-between p-4 group shadow-lg">
                <img
                  src="/images/games/memory-match.jpg"
                  alt="Rune Completion"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] contrast-[1.2] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/50 to-transparent" />

                {/* 100% Progress Ring */}
                <div className="relative z-10 flex items-center justify-center pt-2">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#E34242"
                        strokeWidth="4"
                        strokeDasharray="163.36"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        fill="transparent"
                        className="drop-shadow-[0_0_8px_rgba(227,66,66,0.8)]"
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-white">
                      100%
                    </span>
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-sm text-white drop-shadow">
                    Arcane Archive
                  </h3>
                  <p className="text-[11px] text-[#C7A9A3] mt-0.5">All 8 glyph pairs solved</p>
                  <p className="text-[10px] text-[#8C6D68] mt-1 font-mono">Yesterday</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2.2 Right: Your Statistics Panel with Large Glowing Radial Meter */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#291010]/95 border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-heading font-extrabold text-[#FFF5F0]">
                Your Statistics
              </h2>
              <Link
                href="/dashboard"
                onClick={() => playBlip()}
                aria-label="View Full Statistics"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E34242] flex items-center justify-center text-[#C7A9A3] hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Center: Large Glowing Red Circular Playtime Ring */}
            <div className="relative flex items-center justify-center my-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Glowing Red Progress Track */}
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#E34242"
                    strokeWidth="8"
                    strokeDasharray="364.4"
                    strokeDashoffset="65"
                    strokeLinecap="round"
                    fill="transparent"
                    className="drop-shadow-[0_0_12px_rgba(227,66,66,0.9)]"
                  />
                </svg>

                {/* Inner Text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-medium text-[#C7A9A3] uppercase tracking-wider">
                    Total Playtime
                  </span>
                  <span className="text-xl font-heading font-black text-white tracking-tight mt-0.5">
                    128,45h
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: 3 Icon Metric Columns (Story Progress, Challenges, Duels Won) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-center">
              {/* Stat 1: Story Progress */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(227,66,66,0.3)]">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-sm text-white">92%</span>
                <span className="text-[9px] text-[#C7A9A3] uppercase tracking-wider leading-tight">
                  Story Progress
                </span>
              </div>

              {/* Stat 2: Challenges */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(227,66,66,0.3)]">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-sm text-white">189</span>
                <span className="text-[9px] text-[#C7A9A3] uppercase tracking-wider leading-tight">
                  Challenges
                </span>
              </div>

              {/* Stat 3: Duels Won */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(227,66,66,0.3)]">
                  <Swords className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-sm text-white">7,243</span>
                <span className="text-[9px] text-[#C7A9A3] uppercase tracking-wider leading-tight">
                  Duels Won
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: INSTALLED & OFFLINE READY (REPLACED MOCK DOWNLOAD DATA)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8">
            <div className="rounded-[24px] bg-[#291010]/95 border border-white/[0.08] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 text-[#E34242] flex items-center justify-center shadow-sm shrink-0">
                  <HardDrive size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-heading font-bold text-white">
                      Installed &amp; Offline Ready
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                      <CheckCircle2 size={11} /> Active PWA Cache
                    </span>
                  </div>
                  <p className="text-xs text-[#C7A9A3] mt-0.5">
                    All 4 titles (Snake, Tic-Tac-Toe, Memory Match, Rock Paper Scissors) are saved locally on this device.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Link
                  href="/discover"
                  onClick={() => playBlip()}
                  className="px-4 py-2 rounded-xl bg-[#1C0A0A] hover:bg-[#351414] border border-white/10 text-xs font-semibold text-white hover:border-[#E34242] transition-colors whitespace-nowrap"
                >
                  Browse Catalog
                </Link>
                <Link
                  href="/games/snake"
                  onClick={() => playEngage()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E34242] to-[#C83A35] hover:from-[#EF5350] hover:to-[#D32F2F] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.35)] flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                >
                  <Play size={13} className="fill-current" />
                  <span>Instant Play</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-[24px] bg-[#291010]/95 border border-white/[0.08] p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E34242] font-bold">
                  Local Device Storage
                </span>
                <p className="text-sm font-heading font-extrabold text-white">
                  3.2 MB / Instant Launch
                </p>
                <p className="text-[11px] text-[#8C6D68]">0 network latency required</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
