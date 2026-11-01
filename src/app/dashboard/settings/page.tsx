'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  Moon,
  Bell,
  Volume2,
  VolumeX,
  KeyRound,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui';
import { DEMO_PLAYER } from '@/lib/constants';

export default function SettingsPage() {
  // Preferences state
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [bgMusic, setBgMusic] = useState(false);

  // Demo feedback states
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const triggerFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[var(--glass-border)] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
          <SettingsIcon size={14} />
          <span>Sanctuary Configuration</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
        >
          Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
          Manage your player profile identity, audio and sensory preferences, and frontier security credentials.
        </p>
      </div>

      {/* Floating Feedback Alert */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-[#19271E]/95 border border-[#4EAD7B]/50 text-[#A8E6CF] text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="text-[#4EAD7B]" />
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Profile */}
      <GlassPanel padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] flex items-center justify-center text-[var(--gold)]">
            <User size={18} />
          </div>
          <div>
            <h2
              className="text-lg font-serif font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              Profile Information
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Your publicly visible identity across the Arcadia coliseum
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Username (Disabled) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-between">
              <span>Username</span>
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Lock size={10} /> Locked
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={DEMO_PLAYER.username}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)]/70 border border-[var(--glass-border)] text-[var(--text-primary)] text-sm font-mono opacity-80 cursor-not-allowed focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Monikers are permanently bound to your soul. Contact support to request a change.
            </p>
          </div>

          {/* Email (Disabled) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-[#4EAD7B] flex items-center gap-1 font-semibold">
                <ShieldCheck size={11} /> Verified
              </span>
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value="frontier.scout@arcadia.game"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)]/70 border border-[var(--glass-border)] text-[var(--text-primary)] text-sm font-mono opacity-80 cursor-not-allowed focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Used for account recovery and tournament match alerts.
            </p>
          </div>
        </div>

        {/* Player Badge Details */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
          <span className="px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
            Rank Title: <strong className="text-[var(--gold)] font-serif">{DEMO_PLAYER.title}</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
            Account Level: <strong className="text-[var(--gold-light)] font-mono">Level {DEMO_PLAYER.level}</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
            Enlisted: <strong className="text-[var(--text-primary)]">{DEMO_PLAYER.joinDate}</strong>
          </span>
        </div>
      </GlassPanel>

      {/* Section 2: Preferences */}
      <GlassPanel padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] flex items-center justify-center text-[var(--gold)]">
            <Moon size={18} />
          </div>
          <div>
            <h2
              className="text-lg font-serif font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              Preferences
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Sensory, audio, and platform interface customization
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Dark Mode Toggle (Always on) */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--gold)]">
                <Moon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Dark Mode</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Arcadia is forged exclusively in obsidian darkness for maximum cinematic contrast.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-[var(--gold)] font-bold">Always On</span>
              <div
                className="w-12 h-6 rounded-full bg-[var(--gold)] p-0.5 cursor-not-allowed flex items-center justify-end"
                title="Theme locked to obsidian dark"
              >
                <div className="w-5 h-5 rounded-full bg-[#100F0D] shadow-sm" />
              </div>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--gold)]">
                <Bell size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Match & Achievement Notifications
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Receive toasts when opponents challenge you or achievements unlock.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setNotifications(!notifications);
                triggerFeedback(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                notifications ? 'bg-[var(--gold)] justify-end' : 'bg-[var(--surface-elevated)] justify-start'
              }`}
              aria-label="Toggle notifications"
            >
              <div
                className={`w-5 h-5 rounded-full shadow-sm transition-all ${
                  notifications ? 'bg-[#100F0D]' : 'bg-[var(--text-muted)]'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--gold)]">
                {soundEffects ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Tactile Sound Effects
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Audio chimes for moves, button clicks, card flips, and victory fanfares.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSoundEffects(!soundEffects);
                triggerFeedback(`Sound effects ${!soundEffects ? 'unmuted' : 'muted'}`);
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                soundEffects ? 'bg-[var(--gold)] justify-end' : 'bg-[var(--surface-elevated)] justify-start'
              }`}
              aria-label="Toggle sound effects"
            >
              <div
                className={`w-5 h-5 rounded-full shadow-sm transition-all ${
                  soundEffects ? 'bg-[#100F0D]' : 'bg-[var(--text-muted)]'
                }`}
              />
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Section 3: Account & Danger Zone */}
      <GlassPanel padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] flex items-center justify-center text-[var(--gold)]">
            <KeyRound size={18} />
          </div>
          <div>
            <h2
              className="text-lg font-serif font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              Account & Security
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage your credentials, sessions, and data lifecycle
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Change Password Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)]">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Security Password</p>
              <p className="text-xs text-[var(--text-muted)]">
                Last changed 3 months ago. We recommend refreshing periodically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => triggerFeedback('Password reset link dispatched to verified email address.')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--gold-light)] hover:border-[var(--gold)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Change Password
            </button>
          </div>

          {/* Delete Account Danger Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--danger-bg,#2A1212)] border border-[var(--danger,#D64545)]/40">
            <div>
              <p className="text-sm font-semibold text-[#FF8585] flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>Delete Account</span>
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Permanently purge your match history, earned distinctions, and coliseum leaderboard rank.
              </p>
            </div>

            {showDeleteConfirm ? (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    triggerFeedback('Account deletion request acknowledged (Demo sandbox).');
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#D64545] text-white hover:bg-[#B53535] transition-colors shadow-lg cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#D64545]/20 border border-[#D64545]/40 text-[#FF8585] hover:bg-[#D64545]/30 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete Account</span>
              </button>
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
