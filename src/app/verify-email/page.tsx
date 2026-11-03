'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Sparkles, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { playBlip, playEngage } from '@/lib/sound';
import { authStore } from '@/lib/auth-store';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setErrorMessage('No verification token provided in URL.');
      return;
    }

    let isMounted = true;
    authStore
      .verifyEmail(token)
      .then(() => {
        if (isMounted) {
          playEngage();
          setSuccess(true);
          setVerifying(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setErrorMessage(err.message || 'Verification link is invalid or has expired.');
          setVerifying(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    setResendMessage(null);
    playBlip();

    try {
      const res = await authStore.resendVerification(resendEmail);
      setResendMessage(res.message);
    } catch (err: any) {
      setResendMessage(err.message || 'Failed to dispatch verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="rounded-[28px] bg-[#291010] border border-white/[0.08] p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-center">
      {/* Header */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/35 text-[#E34242] flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_16px_rgba(227,66,66,0.25)]">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
          <span>EMAIL VERIFICATION</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          Arcadia Contender Identity
        </h1>
      </div>

      {verifying ? (
        <div className="py-8 space-y-3">
          <div className="w-8 h-8 border-3 border-[#E34242] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#C7A9A3] font-mono">Authenticating verification token...</p>
        </div>
      ) : success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 py-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Station License Activated</h3>
            <p className="text-xs text-[#C7A9A3] mt-1.5 max-w-xs mx-auto">
              Your email address has been verified. Global rankings, high-roller duels, and persistent match logs are now unlocked.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href="/dashboard"
              onClick={() => playBlip()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#E34242] hover:bg-[#C83A35] text-white text-xs font-bold transition-all shadow-[0_0_16px_rgba(227,66,66,0.4)]"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-5">
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#E34242] shrink-0" />
            <span>{errorMessage}</span>
          </div>

          <div className="border-t border-white/[0.08] pt-5 text-left">
            <h4 className="text-xs font-bold text-white mb-1">Request New Verification Link</h4>
            <p className="text-[11px] text-[#C7A9A3] mb-3">
              Enter your email address to receive a fresh verification link.
            </p>
            <form onSubmit={handleResend} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C6D68]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="contender@arcadia.gaming"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs text-white placeholder-[#8C6D68] focus:outline-none focus:border-[#E34242] transition-colors"
                />
              </div>

              {resendMessage && (
                <p className="text-[11px] text-[#E34242] font-mono">{resendMessage}</p>
              )}

              <button
                type="submit"
                disabled={resending}
                className="w-full py-2.5 rounded-xl bg-[#1C0A0A] hover:bg-[#220C0C] border border-[#E34242]/40 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {resending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Resend Verification Sequence</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
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
                Verifying Security Key...
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </motion.div>
      </div>
    </AppShell>
  );
}

