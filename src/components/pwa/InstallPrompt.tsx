'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';
import { usePWA } from './PWAProvider';

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
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISSAL_KEY, 'true');
    }
  };

  const handleInstall = async () => {
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
          className="fixed bottom-6 right-6 z-[75] max-w-sm w-full mx-auto p-5 rounded-2xl bg-[#211C16]/90 border border-[#C5A46D]/30 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(197,164,109,0.15)] text-[#F3EBDD]"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss installation prompt"
            className="absolute top-3.5 right-3.5 p-1 text-[#7E7260] hover:text-[#DFCA9B] transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A46D]/20 to-[#80613C]/20 border border-[#C5A46D]/30 flex items-center justify-center flex-shrink-0 text-[#DFCA9B]">
              <Sparkles size={20} />
            </div>

            <div className="flex-1 pr-4">
              <h3 className="font-serif text-base font-semibold text-[#DFCA9B] tracking-tight">
                Install Arcadia
              </h3>
              <p className="mt-1 text-xs text-[#B8AA96] leading-relaxed">
                Add Arcadia to your desktop or home screen for fullscreen gameplay, offline access, and lightning-fast loading.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2.5">
            <button
              onClick={handleDismiss}
              type="button"
              className="px-3 py-1.5 text-xs font-medium text-[#B8AA96] hover:text-[#F3EBDD] transition-colors rounded-lg hover:bg-white/5"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#80613C] text-[#100F0D] hover:from-[#DFCA9B] hover:to-[#9F7F48] shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <Download size={14} />
              <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallPrompt;
