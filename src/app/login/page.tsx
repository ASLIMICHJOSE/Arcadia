'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import { playBlip, playEngage } from '@/lib/sound';
import { authStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    playEngage();

    try {
      await authStore.login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or security key. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    playEngage();
    // Redirect to backend Google OAuth 2.0 flow
    window.location.href = '/api/auth/google';
  };

  return (
    <AppShell>
      <div className="min-h-[75vh] flex items-center justify-center py-6 select-none">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="rounded-[28px] bg-[#291010] border border-white/[0.08] p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/35 text-[#E34242] flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_16px_rgba(227,66,66,0.25)]">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={12} />
                CONSOLE AUTHENTICATION
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-xs text-[#C7A9A3]">
                Enter your credentials to access your player profile and match records.
              </p>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 shadow-[0_0_15px_rgba(227,66,66,0.2)]"
              >
                <AlertCircle className="w-4 h-4 text-[#E34242] shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Google OAuth Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#291010] px-3 text-[10px] uppercase font-mono tracking-wider text-[#8C6D68]">
                or credentials
              </span>
              <div className="border-t border-white/[0.08] w-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
                  Player Email
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
                    placeholder="contender@arcadia.gaming"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C7A9A3]">
                    Security Key
                  </label>
                  <Link
                    href="/forgot-password"
                    onClick={() => playBlip()}
                    className="text-[11px] text-[#E34242] hover:text-white transition-colors"
                  >
                    Forgot Key?
                  </Link>
                </div>
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                    Connecting Station...
                  </span>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register Link */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
              <p className="text-xs text-[#C7A9A3]">
                Need a new license?{' '}
                <Link
                  href="/register"
                  onClick={() => playBlip()}
                  className="font-bold text-[#E34242] hover:text-white transition-colors ml-1"
                >
                  Create Contender ID
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
