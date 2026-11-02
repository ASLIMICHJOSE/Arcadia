'use client';

import React, { useState, useRef, MouseEvent, ReactNode } from 'react';

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  showGlare?: boolean;
  showTopFlare?: boolean;
  showHudCorners?: boolean;
  onClick?: () => void;
}

/**
 * 3D Interactive Tilt Card with Dynamic Specular Glare
 * Implements Section 6 of the Cinematic Engineering Specification (DESIGN.md).
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  showGlare = true,
  showTopFlare = true,
  showHudCorners = false,
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1200px',
      }}
      className={`relative group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        style={{
          transform: tilt.isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-2xl bg-[var(--surface-primary)] border border-[rgba(240,163,82,0.2)] hover:border-[var(--accent-primary)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(240,163,82,0.22)] transition-colors ${className}`}
      >
        {/* Top Amber Flare Line (DESIGN.md) */}
        {showTopFlare && <div className="top-amber-flare" />}

        {/* Tactical HUD Corner Brackets for Gaming Look */}
        {showHudCorners && (
          <>
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />
          </>
        )}

        {/* Dynamic Specular Radial Amber Glare Spotlight */}
        {showGlare && tilt.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-20"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(240, 163, 82, 0.18) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Card Content */}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    </div>
  );
}

export default TiltCard;
