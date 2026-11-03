'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2, ShieldAlert, KeyRound, Eye, EyeOff } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { playBlip, playEngage } from '@/lib/sound';
import { authStore } from '@/lib/auth-store';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing or invalid reset token. Please request a new recovery link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    playEngage();

    try {
      const res = await authStore.resetPassword(token, password, confirmPassword);
      setSuccess(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials. The token may be expired or used.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] bg-[#291010] border border-white/[0.08] p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/35 text-[#E34242] flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_16px_rgba(227,66,66,0.25)]">
          <KeyRound className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
          <span>SECURITY OVERRIDE</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          Reset Security Key
        </h1>
        <p className="mt-1.5 text-xs text-[#C7A9A3]">
          Create a new passphrase. All prior active sessions across stations will be terminated immediately.
        </p>
      </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-[#1C0A0A] border border-emerald-500/30 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Credentials Updated</h3>
            <p className="text-xs text-[#C7A9A3] mt-2 leading-relaxed">{success}</p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              onClick={() => playBlip()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#E34242] hover:bg-[#C83A35] text-white text-xs font-bold transition-all shadow-[0_0_16px_rgba(227,66,66,0.4)]"
            >
              <span>Login With New Key</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#E34242] shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
              New Security Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6D68]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C6D68] hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
              Confirm New Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6D68]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
              />
            </div>
          </div>

          <p className="text-[10px] text-[#8C6D68]">
            Must contain at least 8 characters with upper, lower, and special/number.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E34242] to-[#C83A35] hover:from-[#EF5350] hover:to-[#D32F2F] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.35)] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating Security Profile...
              </span>
            ) : (
              <>
                <span>Commit New Key</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AppShell>
      <div className="min-h-[75vh] flex items-center justify-center py-6 select-none">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <Suspense
            fallback={
              <div className="rounded-[28px] bg-[#291010] p-12 text-center text-white font-mono text-xs">
                Loading Security Module...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </AppShell>
  );
}

