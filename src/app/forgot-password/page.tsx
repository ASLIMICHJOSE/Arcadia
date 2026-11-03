'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, KeyRound, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { playBlip, playEngage } from '@/lib/sound';
import { authStore } from '@/lib/auth-store';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playEngage();

    try {
      const res = await authStore.forgotPassword(email);
      setMessage(res.message);
      setSubmitted(true);
    } catch {
      // Uniform generic response to avoid user enumeration
      setMessage('If an account exists for this email, password reset instructions have been sent.');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
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
                <KeyRound className="w-6 h-6" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={12} />
                CREDENTIAL RECOVERY
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Recover Key
              </h1>
              <p className="mt-1.5 text-xs text-[#C7A9A3]">
                Enter your verified player email address. We will dispatch a single-use authorization sequence.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#1C0A0A] border border-white/10 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#E34242]/20 text-[#E34242] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Transmission Dispatched</h3>
                  <p className="text-xs text-[#C7A9A3] mt-2 leading-relaxed">{message}</p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/login"
                    onClick={() => playBlip()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#E34242] hover:bg-[#C83A35] text-white text-xs font-bold transition-all shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Station Login</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E34242] to-[#C83A35] hover:from-[#EF5350] hover:to-[#D32F2F] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.35)] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Dispatching Sequence...
                    </span>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-5 pt-4 border-t border-white/[0.08] text-center">
                  <Link
                    href="/login"
                    onClick={() => playBlip()}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C7A9A3] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Login</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}

