'use client';

import { useEffect, useRef } from 'react';

/**
 * Screen Wake Lock Hook for Arcadia Gaming PWA
 * Keeps the display awake during active gameplay.
 */
export function useWakeLock(enabled: boolean = true) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    let isCancelled = false;

    async function requestLock() {
      try {
        if (!isCancelled && !sentinelRef.current) {
          sentinelRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        // WakeLock can be rejected if low battery or tab hidden
        console.debug('[WakeLock] Request skipped:', err);
      }
    }

    requestLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isCancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, [enabled]);
}

