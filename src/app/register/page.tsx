'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import { playBlip, playEngage } from '@/lib/sound';
import { authStore } from '@/lib/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!termsAccepted) {
      setError('Please agree to the Arcadia Terms of Service and Honor Code');
      return;
    }

    setLoading(true);
    playEngage();

    try {
      const result = await authStore.register(username, email, password, confirmPassword);
      setSuccessMessage(
        result.message || 'Contender account created! A verification link has been dispatched to your email.',
      );
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    playEngage();
    window.location.href = '/api/auth/google';
  };

  return (
    <AppShell>
      <div className="min-h-[75vh] flex items-center justify-center py-6 select-none">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-[28px] bg-[#291010] border border-white/[0.08] p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/35 text-[#E34242] flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_16px_rgba(227,66,66,0.25)]">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <span>NEW CONTENDER REGISTRATION</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Join Arcadia
              </h1>
              <p className="mt-1.5 text-xs text-[#C7A9A3]">
                Claim your contender tag and start your ascension through the competitive ranks.
              </p>
            </div>

            {/* Success State */}
            {successMessage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#1C0A0A] border border-emerald-500/40 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">License Created</h3>
                  <p className="text-xs text-[#C7A9A3] mt-1">{successMessage}</p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/login"
                    onClick={() => playBlip()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#E34242] hover:bg-[#C83A35] text-white text-xs font-bold transition-all shadow-[0_0_16px_rgba(227,66,66,0.4)]"
                  >
                    <span>Proceed to Station Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Google OAuth Quick Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1C0A0A] hover:bg-[#220C0C] border border-white/10 hover:border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-3 mb-4 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-white/[0.08] w-full" />
                  <span className="bg-[#291010] px-3 text-[10px] uppercase font-mono tracking-wider text-[#8C6D68]">
                    or create account
                  </span>
                  <div className="border-t border-white/[0.08] w-full" />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-2"
                  >
                    <ShieldAlert size={14} className="text-[#E34242] shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Username Field */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
                      Player Handle / Gamertag
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6D68]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Outlaw_Viper"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
                      Console Dispatch Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6D68]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="viper@arcadia.gaming"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C6D68]">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#8C6D68] hover:text-white transition-colors cursor-pointer"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
                        Confirm Key
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C6D68]">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#8C6D68]">
                    Must be at least 8 characters with upper, lower, and number/symbol.
                  </p>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded bg-[#1C0A0A] border-white/10 text-[#E34242] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E34242]"
                      />
                      <span className="text-[11px] text-[#C7A9A3] leading-relaxed">
                        I agree to the Arcadia Honor Code and Station Guidelines.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E34242] to-[#C83A35] hover:from-[#EF5350] hover:to-[#D32F2F] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.35)] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Forging Profile...
                      </span>
                    ) : (
                      <>
                        <span>Create Profile &amp; Enter</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Bottom Login Link */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] text-center">
              <p className="text-xs text-[#C7A9A3]">
                Already hold an active ID?{' '}
                <Link
                  href="/login"
                  onClick={() => playBlip()}
                  className="font-bold text-[#E34242] hover:text-white transition-colors ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
