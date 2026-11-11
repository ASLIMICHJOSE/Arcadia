'use client';

import React, { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { useLenis } from './LenisProvider';

/* ========================================================================= */
/* 1. SCROLL PARALLAX (Clean GPU Depth Travel)                               */
/* ========================================================================= */
export interface ScrollParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical pixel travel across element scroll lifecycle */
  offset?: number;
  /** If true, anchors travel smoothly relative to top-of-page hero scroll */
  heroMode?: boolean;
}

export function ScrollParallax({
  children,
  className = '',
  offset = 24,
  heroMode = false,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const { scrollY: lenisScrollY } = useLenis();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rangeY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const heroY = useTransform(lenisScrollY, [0, 480], [0, offset]);

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        y: heroMode ? heroY : rangeY,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ========================================================================= */
/* 2. CYBER REVEAL (Clean GPU Viewport Entrance)                             */
/* ========================================================================= */
export interface CyberRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}

export function CyberReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.28,
  yOffset = 10,
  once = true,
}: CyberRevealProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.05 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ========================================================================= */
/* 3. CYBER COUNTER (Zero-Rerender Direct DOM Numeric Interpolation)         */
/* ========================================================================= */
export interface CyberCounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
  className?: string;
}

export function CyberCounter({
  value,
  duration = 0.7,
  format = (v) => Math.round(v).toLocaleString(),
  className = '',
}: CyberCounterProps) {
  const shouldReduce = useReducedMotion();
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number | null>(null);
  const formatRef = useRef(format);

  useEffect(() => {
    formatRef.current = format;
  }, [format]);

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    if (shouldReduce) {
      node.textContent = formatRef.current(value);
      prevValueRef.current = value;
      return;
    }

    const from = prevValueRef.current === null ? 0 : prevValueRef.current;
    if (from === value && prevValueRef.current !== null) return;

    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (spanRef.current) {
          spanRef.current.textContent = formatRef.current(latest);
        }
      },
    });

    prevValueRef.current = value;
    return () => controls.stop();
  }, [value, duration, shouldReduce]);

  return (
    <span ref={spanRef} className={className} suppressHydrationWarning>
      {format(value)}
    </span>
  );
}
