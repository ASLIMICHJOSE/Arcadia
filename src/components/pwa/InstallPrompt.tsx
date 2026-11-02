'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';
import { usePWA } from './PWAProvider';
import { playBlip, playEngage } from '@/lib/sound';

const DISMISSAL_KEY = 'arcadia_pwa_install_dismissed';

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(DISMISSAL_KEY);
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    playBlip();
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISSAL_KEY, 'true');
    }
  };

  const handleInstall = async () => {
    playEngage();
    setIsInstalling(true);
    try {
      const accepted = await installApp();
      if (accepted) {
        setIsDismissed(true);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const shouldShow = isInstallable && !isDismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 right-6 z-[75] max-w-sm w-full mx-auto p-5 rounded-2xl bg-[#191410]/95 border border-[rgba(240,163,82,0.35)] backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(240,163,82,0.2)] text-[#FFF8F0] overflow-hidden"
        >
          {/* Top amber flare line */}
          <div className="top-amber-flare" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss installation prompt"
            className="absolute top-3.5 right-3.5 p-1 text-[var(--text-muted)] hover:text-[#FFF8F0] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[rgba(240,163,82,0.15)] border border-[rgba(240,163,82,0.35)] flex items-center justify-center flex-shrink-0 text-[var(--accent-primary)] shadow-[0_0_12px_rgba(240,163,82,0.25)]">
              <Sparkles size={20} />
            </div>

            <div className="flex-1 pr-4">
              <h3 className="font-heading text-base font-black text-[#FFF8F0] tracking-tight">
                Install Arcadia App
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Install the Arcadia client for instant 60fps fullscreen play, offline support, and desktop responsiveness.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2.5">
            <button
              onClick={handleDismiss}
              type="button"
              className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[#FFF8F0] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#FFC078] via-[#F0A352] to-[#D97706] text-[#0D0B09] hover:brightness-110 shadow-[0_4px_16px_rgba(240,163,82,0.4)] transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <Download size={14} />
              <span>{isInstalling ? 'Installing...' : 'Install Client'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallPrompt;
