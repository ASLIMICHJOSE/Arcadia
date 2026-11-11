'use client';

import React from 'react';
import { motion, useSpring } from 'framer-motion';
import { useLenis } from './LenisProvider';

/**
 * Ultra-lightweight Top Scroll Progress Hairline.
 * Driven purely by GPU `scaleX` via Lenis MotionValues with zero React re-renders.
 */
export function ScrollHUD() {
  const { scrollProgress } = useLenis();

  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 280,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[70] pointer-events-none bg-transparent"
    >
      <motion.div
        style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
        className="h-full w-full bg-gradient-to-r from-[#8D3434] via-[#E34242] to-[#FF7B7B]"
      />
    </div>
  );
}

export default ScrollHUD;
