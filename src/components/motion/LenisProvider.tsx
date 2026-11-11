'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig, MotionValue, useMotionValue } from 'framer-motion';

export interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
  /** Higher values settle faster; default ~8.2 for buttery lenis.dev glide */
  damping?: number;
}

export interface LenisContextValue {
  scrollY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  velocity: MotionValue<number>;
  direction: MotionValue<number>;
  scrollTo: (target: number | string | HTMLElement, options?: ScrollToOptions) => void;
}

const LenisContext = createContext<LenisContextValue | null>(null);

/**
 * Access real-time Lenis smooth scroll MotionValues & programmatic scrollTo
 * without triggering React re-renders per scroll frame.
 */
export function useLenis(): LenisContextValue {
  const ctx = useContext(LenisContext);
  const fallbackY = useMotionValue(0);
  const fallbackProgress = useMotionValue(0);
  const fallbackVelocity = useMotionValue(0);
  const fallbackDirection = useMotionValue(0);

  return (
    ctx ?? {
      scrollY: fallbackY,
      scrollProgress: fallbackProgress,
      velocity: fallbackVelocity,
      direction: fallbackDirection,
      scrollTo: (target) => {
        if (typeof window === 'undefined') return;
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else {
          const el =
            typeof target === 'string' ? document.querySelector(target) : target;
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }
  );
}

/**
 * Checks whether the wheel event originated inside an independently scrollable
 * sub-container or an element marked with `data-lenis-prevent`.
 */
function shouldPreventLenis(target: EventTarget | null, deltaY: number): boolean {
  let node = target as HTMLElement | null;

  while (node && node !== document.documentElement && node !== document.body) {
    if (node.hasAttribute('data-lenis-prevent')) {
      return true;
    }

    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 2;

    if (isScrollable) {
      const canScrollDown =
        deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 2;
      const canScrollUp = deltaY < 0 && node.scrollTop > 2;
      if (canScrollDown || canScrollUp) {
        return true;
      }
    }

    node = node.parentElement;
  }

  return false;
}

function getMaxScroll(): number {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;
  return Math.max(
    0,
    Math.max(
      document.documentElement.scrollHeight,
      document.body?.scrollHeight || 0
    ) - window.innerHeight
  );
}

export interface LenisProviderProps {
  children: React.ReactNode;
  /** Exponential damping coefficient (default 0.115 -> crisp weighted lenis.dev glide) */
  lerp?: number;
  /** Wheel sensitivity multiplier */
  wheelMultiplier?: number;
}

/**
 * Frame-rate independent exponential smooth momentum scroll engine (lenis.dev inspired).
 * Tracks written step spans so browser async scroll events never cancel in-flight momentum.
 */
export function LenisProvider({
  children,
  lerp = 0.115,
  wheelMultiplier = 1,
}: LenisProviderProps) {
  const pathname = usePathname();

  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const velocity = useMotionValue(0);
  const direction = useMotionValue(0);

  // Convert normalized 60fps lerp factor to continuous seconds-based lambda
  const baseLambda = useMemo(
    () => -Math.log(Math.max(0.01, 1 - Math.min(0.4, Math.max(0.03, lerp)))) * 60,
    [lerp]
  );

  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const writtenSpanRef = useRef<{ min: number; max: number }>({ min: 0, max: 0 });
  const activeLambdaRef = useRef(baseLambda);
  const rafIdRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
  const tickRef = useRef<(now: number) => void>(() => {});

  const syncProgress = useCallback(
    (y: number) => {
      const maxScroll = getMaxScroll();
      scrollY.set(y);
      scrollProgress.set(maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0);
    },
    [scrollY, scrollProgress]
  );

  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    prevTimeRef.current = 0;
    activeLambdaRef.current = baseLambda;
  }, [baseLambda]);

  const applyWindowScroll = useCallback((fromY: number, toY: number) => {
    const pad = 16;
    writtenSpanRef.current = {
      min: Math.min(fromY, toY) - pad,
      max: Math.max(fromY, toY) + pad,
    };
    window.scrollTo({ top: toY, left: window.scrollX, behavior: 'auto' });
  }, []);

  const tick = useCallback(
    (now: number) => {
      const prevTime = prevTimeRef.current || now;
      prevTimeRef.current = now;

      // Continuous time delta in seconds, capped to avoid jumps after tab wake
      const dtSeconds = Math.min(Math.max((now - prevTime) / 1000, 0.001), 0.05);

      const current = currentScrollRef.current;
      const target = targetScrollRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.08) {
        currentScrollRef.current = target;
        applyWindowScroll(current, target);
        syncProgress(target);
        velocity.set(0);
        direction.set(0);
        stopLoop();
        return;
      }

      const factor = 1 - Math.exp(-activeLambdaRef.current * dtSeconds);
      const next = current + diff * factor;
      const step = next - current;

      currentScrollRef.current = next;
      applyWindowScroll(current, next);

      syncProgress(next);
      // Normalize velocity to px per 60Hz frame for consistent consumer curves
      velocity.set(step / (dtSeconds * 60));
      direction.set(Math.sign(step));

      rafIdRef.current = requestAnimationFrame((t) => tickRef.current(t));
    },
    [applyWindowScroll, syncProgress, velocity, direction, stopLoop]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const startLoop = useCallback(() => {
    if (rafIdRef.current === null) {
      prevTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame((t) => tickRef.current(t));
    }
  }, []);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options: ScrollToOptions = {}) => {
      if (typeof window === 'undefined') return;

      const { offset = 0, immediate = false, damping } = options;
      let dest = 0;

      if (typeof target === 'number') {
        dest = target;
      } else {
        const el =
          typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        dest = rect.top + window.scrollY;
      }

      const maxScroll = getMaxScroll();
      dest = Math.min(maxScroll, Math.max(0, dest + offset));

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (immediate || prefersReduced) {
        stopLoop();
        const prev = window.scrollY;
        currentScrollRef.current = dest;
        targetScrollRef.current = dest;
        applyWindowScroll(prev, dest);
        syncProgress(dest);
        velocity.set(0);
        direction.set(0);
        return;
      }

      activeLambdaRef.current = damping ?? baseLambda;
      currentScrollRef.current = window.scrollY;
      targetScrollRef.current = dest;
      startLoop();
    },
    [baseLambda, startLoop, stopLoop, applyWindowScroll, syncProgress, velocity, direction]
  );

  // Reset scroll cleanly when switching routes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    stopLoop();
    currentScrollRef.current = 0;
    targetScrollRef.current = 0;
    writtenSpanRef.current = { min: -16, max: 16 };
    window.scrollTo({ top: 0, behavior: 'auto' });
    scrollY.set(0);
    scrollProgress.set(0);
    velocity.set(0);
    direction.set(0);
  }, [pathname, stopLoop, scrollY, scrollProgress, velocity, direction]);

  // Attach smooth wheel, scrollbar, resize & hash link listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.classList.add('lenis', 'lenis-smooth');

    const initialY = window.scrollY;
    currentScrollRef.current = initialY;
    targetScrollRef.current = initialY;
    writtenSpanRef.current = { min: initialY - 16, max: initialY + 16 };
    syncProgress(initialY);

    const handleWheel = (e: WheelEvent) => {
      // Allow browser zoom (Ctrl/Meta + wheel) or horizontal-only scroll
      if (e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaY) < 0.01) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      if (shouldPreventLenis(e.target, e.deltaY)) return;

      const maxScroll = getMaxScroll();
      if (maxScroll <= 1) return;

      // Sync from browser scroll position cleanly when awakening from rest
      if (rafIdRef.current === null) {
        const y = window.scrollY;
        currentScrollRef.current = y;
        targetScrollRef.current = y;
      }

      // Normalize deltaMode (0: pixel, 1: line (~33.3px), 2: page)
      let pixelDelta = e.deltaY;
      if (e.deltaMode === 1) pixelDelta *= 33.3333;
      else if (e.deltaMode === 2) pixelDelta *= window.innerHeight;

      const base = targetScrollRef.current;
      const atTop = base <= 0 && pixelDelta < 0;
      const atBottom = base >= maxScroll && pixelDelta > 0;
      if (atTop || atBottom) {
        return;
      }

      const nextTarget = Math.min(
        maxScroll,
        Math.max(0, base + pixelDelta * wheelMultiplier)
      );

      e.preventDefault();
      activeLambdaRef.current = baseLambda;
      targetScrollRef.current = nextTarget;
      startLoop();
    };

    const handleNativeScroll = () => {
      const actualY = window.scrollY;

      // Ignore async scroll events that originate from our active RAF glide span
      if (rafIdRef.current !== null) {
        const { min, max } = writtenSpanRef.current;
        if (actualY >= min && actualY <= max) {
          return;
        }
        // Genuine external jump (scrollbar drag / Home / End / keyboard scroll)
        stopLoop();
      }

      currentScrollRef.current = actualY;
      targetScrollRef.current = actualY;
      writtenSpanRef.current = { min: actualY - 16, max: actualY + 16 };
      syncProgress(actualY);
      velocity.set(0);
      direction.set(0);
    };

    const handleResize = () => {
      const maxScroll = getMaxScroll();
      if (targetScrollRef.current > maxScroll) {
        targetScrollRef.current = maxScroll;
      }
      if (currentScrollRef.current > maxScroll) {
        currentScrollRef.current = maxScroll;
      }
      syncProgress(window.scrollY);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetEl = document.querySelector<HTMLElement>(href);
      if (targetEl) {
        e.preventDefault();
        scrollTo(targetEl);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(document.body);
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('click', handleAnchorClick);

    return () => {
      root.classList.remove('lenis', 'lenis-smooth');
      resizeObserver?.disconnect();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleAnchorClick);
      stopLoop();
    };
  }, [
    baseLambda,
    wheelMultiplier,
    startLoop,
    stopLoop,
    syncProgress,
    scrollTo,
    velocity,
    direction,
  ]);

  const contextValue = useMemo<LenisContextValue>(
    () => ({
      scrollY,
      scrollProgress,
      velocity,
      direction,
      scrollTo,
    }),
    [scrollY, scrollProgress, velocity, direction, scrollTo]
  );

  return (
    <MotionConfig reducedMotion="user">
      <LenisContext.Provider value={contextValue}>
        {children}
      </LenisContext.Provider>
    </MotionConfig>
  );
}

export default LenisProvider;
