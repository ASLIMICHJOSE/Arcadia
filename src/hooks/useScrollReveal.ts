'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseScrollRevealOptions {
  /**
   * Intersection threshold (0.0 to 1.0) or array of thresholds.
   * Default: 0.15 (triggers when 15% of the element is visible).
   */
  threshold?: number | number[];

  /**
   * Margin around the root element. Default: '0px 0px -50px 0px'.
   */
  rootMargin?: string;

  /**
   * Whether the reveal should trigger only once or toggle on enter/leave.
   * Default: true.
   */
  triggerOnce?: boolean;

  /**
   * Initial visibility state before intersection is evaluated.
   * Default: false.
   */
  initialVisible?: boolean;
}

export interface UseScrollRevealReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
}

/**
 * SSR-safe IntersectionObserver hook for scroll-triggered entrance animations.
 *
 * @example
 * const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
 * return (
 *   <div
 *     ref={ref}
 *     className={`transition-all duration-700 ${
 *       isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
 *     }`}
 *   >
 *     Reveal Content
 *   </div>
 * );
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): UseScrollRevealReturn<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    initialVisible = false,
  } = options;

  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    // Fallback if running on server or if IntersectionObserver is unsupported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // If already visible and only triggers once, nothing further to observe
    if (triggerOnce && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, isVisible]);

  return { ref, isVisible };
}

export default useScrollReveal;
