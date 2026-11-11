'use client';

import React, { useRef, MouseEvent, ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  showGlare?: boolean;
  showTopFlare?: boolean;
  onClick?: () => void;
}

/**
 * 3D Interactive Cyber Tilt Card with Spring Physics & Zero-Rerender Spotlight.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  showGlare = true,
  showTopFlare = true,
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 280, damping: 24, mass: 0.35 });
  const rotateY = useSpring(rawRotateY, { stiffness: 280, damping: 24, mass: 0.35 });
  const spotlightOpacity = useSpring(glareOpacity, { stiffness: 260, damping: 28 });

  const glareBackground = useMotionTemplate`radial-gradient(280px circle at ${rawGlareX}% ${rawGlareY}%, rgba(227, 66, 66, 0.22) 0%, transparent 70%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rawRotateX.set(((y - centerY) / centerY) * -maxTilt);
    rawRotateY.set(((x - centerX) / centerX) * maxTilt);
    rawGlareX.set((x / rect.width) * 100);
    rawGlareY.set((y / rect.height) * 100);
    glareOpacity.set(1);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: '1200px' }}
      className={`relative group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <motion.div
        style={{
          rotateX: shouldReduce ? 0 : rotateX,
          rotateY: shouldReduce ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        whileHover={shouldReduce ? undefined : { scale: 1.018 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className={`relative overflow-hidden rounded-2xl bg-[var(--surface-primary)] border border-white/[0.08] hover:border-[rgba(227,66,66,0.55)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_28px_rgba(227,66,66,0.25)] transition-colors ${className}`}
      >
        {/* Top Crimson Flare Line */}
        {showTopFlare && <div className="top-flare" />}

        {/* Dynamic Specular Radial Crimson Glare Spotlight */}
        {showGlare && !shouldReduce && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl z-20"
            style={{
              background: glareBackground,
              opacity: spotlightOpacity,
            }}
          />
        )}

        {/* Card Content */}
        <div className="relative z-10 w-full h-full">{children}</div>
      </motion.div>
    </div>
  );
}

export default TiltCard;
