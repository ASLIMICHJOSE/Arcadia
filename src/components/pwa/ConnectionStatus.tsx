'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from './PWAProvider';

export function ConnectionStatus() {
  const { isOnline } = usePWA();
  const [showReconnected, setShowReconnected] = useState<boolean>(false);
  const prevOnlineRef = useRef<boolean>(isOnline);

  useEffect(() => {
    // If was offline and now is online, trigger temporary "Back online" banner
    if (!prevOnlineRef.current && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  const isVisible = !isOnline || showReconnected;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed top-0 left-0 right-0 z-[100] h-9 px-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide uppercase shadow-lg border-b backdrop-blur-md ${
            !isOnline
              ? 'bg-[#E34242] text-white border-white/20'
              : 'bg-[#2E7D32] text-white border-white/20'
          }`}
          role="status"
          aria-live="polite"
        >
          {!isOnline ? (
            <>
              <WifiOff size={15} strokeWidth={2.4} />
              <span>You are currently offline. Running in local cached client mode.</span>
            </>
          ) : (
            <>
              <Wifi size={15} strokeWidth={2.4} />
              <span>Back online. Syncing multiplayer lobbies and standings...</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConnectionStatus;
