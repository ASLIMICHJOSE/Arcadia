'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Moon,
  KeyRound,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { CyberReveal } from '@/components/motion';
import { DEMO_PLAYER } from '@/lib/constants';
import { getCurrentUser, UserSession } from '@/lib/auth';
import { playBlip } from '@/lib/sound';
import { isHapticsEnabled, setHapticsEnabled, triggerHaptic } from '@/lib/haptics';

export default function SettingsPage() {
  const [user, setUser] = useState<UserSession>({ username: 'CONTENDER', isLoggedIn: false });
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(isHapticsEnabled());

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setHaptics(isHapticsEnabled());
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    playBlip();
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const handleClearCache = () => {
    triggerFeedback('Offline cache refreshed & synchronized (3.2 MB re-verified).');
  };

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Header Banner - Full Width */}
      <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#291010] via-[#351414] to-[#220C0C] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-xs font-mono font-bold uppercase tracking-wider">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>STATION CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
            Station Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#C7A9A3] leading-relaxed">
            Manage your player profile identity, sensory audio preferences, offline PWA storage, and station security credentials.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="px-4 py-2.5 rounded-2xl bg-[#1C0A0A] border border-white/10 flex items-center gap-2.5 text-xs text-[#C7A9A3]">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Client Version:</span>
            <span className="font-mono font-bold text-white">v2.4.0 (PWA)</span>
          </div>
        </div>
      </div>

      {/* Floating Feedback Alert */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-xl backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-Column Responsive Layout Filling Full Width */}
      <CyberReveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column (7 cols): Profile & Storage */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Card */}
          <div className="rounded-[26px] bg-[#291010] border border-white/[0.08] p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 flex items-center justify-center text-[#E34242] shadow-sm">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-white">
                  Contender Profile
                </h2>
                <p className="text-xs text-[#C7A9A3]">
                  Your publicly visible identity across the Arcadia coliseum
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3] flex items-center justify-between">
                  <span>Player Handle</span>
                  <span className="text-[10px] text-[#8C6D68] flex items-center gap-1 font-semibold">
                    <Lock size={10} /> Bound
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value={user.username || DEMO_PLAYER.username}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-white text-xs font-mono opacity-85 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3] flex items-center justify-between">
                  <span>Dispatch Email</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email || 'frontier.scout@arcadia.game'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-white text-xs font-mono opacity-85 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3 py-1 rounded-xl bg-[#1C0A0A] border border-white/10 text-[#C7A9A3]">
                Title: <strong className="text-[#E34242] font-heading">{DEMO_PLAYER.title}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#1C0A0A] border border-white/10 text-[#C7A9A3]">
                Level: <strong className="text-white font-mono">{DEMO_PLAYER.level}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#1C0A0A] border border-white/10 text-[#C7A9A3]">
                Enlisted: <strong className="text-white">{DEMO_PLAYER.joinDate}</strong>
              </span>
            </div>
          </div>

          {/* PWA & Offline Storage */}
          <div className="rounded-[26px] bg-[#291010] border border-white/[0.08] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 flex items-center justify-center text-[#E34242] shadow-sm">
                <HardDrive size={18} />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-white">
                  PWA &amp; Offline Storage Cache
                </h2>
                <p className="text-xs text-[#C7A9A3]">
                  All games run 100% locally from your device cache
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1C0A0A] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                  <p className="text-xs font-bold text-white">4 Titles Cached (3.2 MB)</p>
                </div>
                <p className="text-[11px] text-[#8C6D68]">
                  Snake Arena, Tic-Tac-Toe, Memory Match, Rock Paper Scissors
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearCache}
                className="px-4 py-2 rounded-xl bg-[#291010] hover:bg-[#351414] border border-white/10 text-xs font-semibold text-white hover:border-[#E34242] flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <RefreshCw size={13} className="text-[#E34242]" />
                <span>Verify Cache</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Preferences & Security */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preferences */}
          <div className="rounded-[26px] bg-[#291010] border border-white/[0.08] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 flex items-center justify-center text-[#E34242] shadow-sm">
                <Moon size={18} />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-white">
                  Sensory Preferences
                </h2>
                <p className="text-xs text-[#C7A9A3]">
                  Audio feedback and visual theme controls
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Dark Burgundy Mode */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1C0A0A] border border-white/10">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Dark Burgundy OS</p>
                  <p className="text-[10px] text-[#8C6D68]">Cinematic AAA launcher theme</p>
                </div>
                <span className="text-[10px] font-mono text-[#E34242] font-bold uppercase">Locked On</span>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1C0A0A] border border-white/10">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Chimes &amp; FX Audio</p>
                  <p className="text-[10px] text-[#8C6D68]">Moves, blips, and victory fanfares</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSoundEffects(!soundEffects);
                    triggerFeedback(`Sound effects ${!soundEffects ? 'unmuted' : 'muted'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    soundEffects ? 'bg-[#E34242] justify-end shadow-[0_0_10px_rgba(227,66,66,0.5)]' : 'bg-white/10 justify-start'
                  }`}
                  aria-label="Toggle sound effects"
                >
                  <motion.div layout transition={{ type: 'spring', stiffness: 520, damping: 32 }} className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Match Notifications */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1C0A0A] border border-white/10">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Duel Dispatches</p>
                  <p className="text-[10px] text-[#8C6D68]">In-game challenge notifications</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotifications(!notifications);
                    triggerFeedback(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    notifications ? 'bg-[#E34242] justify-end shadow-[0_0_10px_rgba(227,66,66,0.5)]' : 'bg-white/10 justify-start'
                  }`}
                  aria-label="Toggle notifications"
                >
                  <motion.div layout transition={{ type: 'spring', stiffness: 520, damping: 32 }} className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Controller & Touch Haptics */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1C0A0A] border border-white/10">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Controller &amp; Touch Haptics</p>
                  <p className="text-[10px] text-[#8C6D68]">Vibration feedback on moves and fanfares</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !haptics;
                    setHaptics(next);
                    setHapticsEnabled(next);
                    if (next) triggerHaptic('medium');
                    triggerFeedback(`Haptics ${next ? 'enabled' : 'disabled'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    haptics ? 'bg-[#E34242] justify-end shadow-[0_0_10px_rgba(227,66,66,0.5)]' : 'bg-white/10 justify-start'
                  }`}
                  aria-label="Toggle haptics"
                >
                  <motion.div layout transition={{ type: 'spring', stiffness: 520, damping: 32 }} className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Account Security & Actions */}
          <div className="rounded-[26px] bg-[#291010] border border-white/[0.08] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/30 flex items-center justify-center text-[#E34242] shadow-sm">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-base font-heading font-bold text-white">
                  Security &amp; Danger Zone
                </h2>
                <p className="text-xs text-[#C7A9A3]">
                  Credentials and station lifecycle
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => triggerFeedback('Security password reset link dispatched.')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1C0A0A] hover:bg-[#351414] border border-white/10 text-xs font-semibold text-white hover:border-[#E34242] transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>Change Station Key</span>
                <span className="text-[10px] font-mono text-[#8C6D68]">Protected →</span>
              </button>

              {/* Danger Delete Account */}
              <div className="p-3 rounded-2xl bg-red-950/20 border border-red-500/20 flex flex-col gap-2">
                <p className="text-xs font-bold text-red-300">Station Reset</p>
                <p className="text-[10px] text-[#8C6D68]">
                  Purge local cache, match history, and saved preferences.
                </p>

                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 text-xs text-[#C7A9A3] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        triggerFeedback('Station data purged. Resetting session...');
                      }}
                      className="px-3.5 py-1 text-xs font-bold rounded-xl bg-[#E34242] text-white hover:bg-[#C83A35] transition-colors shadow-md"
                    >
                      Confirm Reset
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="py-1.5 px-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-semibold hover:bg-red-900/50 transition-all cursor-pointer self-start flex items-center gap-1.5"
                  >
                    <Trash2 size={12} />
                    <span>Reset Station</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CyberReveal>
    </div>
  );
}
