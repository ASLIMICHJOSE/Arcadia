'use client';

import { useSyncExternalStore, useCallback } from 'react';

/**
 * SSR-safe React hook to subscribe to CSS media query status.
 *
 * @param query - The media query string to evaluate (e.g., '(min-width: 768px)')
 * @param defaultValue - Fallback value used during SSR (defaults to false)
 * @returns boolean indicating whether the query currently matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined' || !('matchMedia' in window)) {
        return () => {};
      }

      const mediaQueryList = window.matchMedia(query);

      // Support both modern addEventListener and legacy addListener
      if (typeof mediaQueryList.addEventListener === 'function') {
        mediaQueryList.addEventListener('change', callback);
        return () => {
          mediaQueryList.removeEventListener('change', callback);
        };
      } else {
        const legacyList = mediaQueryList as MediaQueryList & {
          addListener?: (listener: () => void) => void;
          removeListener?: (listener: () => void) => void;
        };
        if (typeof legacyList.addListener === 'function') {
          legacyList.addListener(callback);
          return () => {
            legacyList.removeListener?.(callback);
          };
        }
      }

      return () => {};
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  }, [query, defaultValue]);

  const getServerSnapshot = useCallback(() => {
    return defaultValue;
  }, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
