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
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassPanel from '@/components/ui/GlassPanel';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service and Honor Code');
      return;
    }

    setLoading(true);
    // Visual-only registration navigates to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 w-full flex items-center justify-center relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6">
        {/* Layered Atmospheric Western Dusk Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 50% 45%, rgba(197, 164, 109, 0.16) 0%, rgba(104, 44, 16, 0.14) 35%, transparent 70%),
              linear-gradient(180deg, #100F0D 0%, #191417 35%, #251610 65%, #100F0D 100%)
            `,
          }}
        />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[var(--gold)]/10 blur-[110px] pointer-events-none" />

        {/* Register Glass Panel Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg"
        >
          <GlassPanel
            padding="lg"
            className="p-8 sm:p-10 border-[var(--glass-border)] shadow-[var(--glass-shadow-lg)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--gold-muted)] border border-[var(--glass-border-gold)] text-[var(--gold)] flex items-center justify-center mx-auto mb-4 shadow-[var(--gold-glow-sm)]">
                <Sparkles className="w-6 h-6 text-[var(--gold)]" />
              </div>

              <h1
                className="text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
              >
                Join Arcadia
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Claim your player tag and begin your ascension through the ranks.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-[rgba(214,69,69,0.15)] border border-[var(--danger)] text-[var(--danger)] text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Player Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Frontier_Legend"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scout@frontier.arcadia"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded bg-[var(--surface)] border-[var(--glass-border)] text-[var(--gold)] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[var(--gold)]"
                  />
                  <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    I agree to the Arcadia{' '}
                    <Link href="#" className="text-[var(--gold)] hover:underline">
                      Honor Code
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[var(--gold)] hover:underline">
                      Terms of Service
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="gold-btn w-full py-3 text-sm font-semibold mt-4 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#100F0D] border-t-transparent rounded-full animate-spin" />
                    Forging Profile...
                  </span>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4 text-[#100F0D]" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Link */}
            <div className="mt-8 pt-6 border-t border-[var(--glass-border)] text-center">
              <p className="text-xs text-[var(--text-secondary)]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors underline-offset-4 hover:underline ml-1"
                >
                  Login
                </Link>
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
