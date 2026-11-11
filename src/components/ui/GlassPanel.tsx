'use client';

import React, { forwardRef, ElementType } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type GlassPanelPadding = 'none' | 'sm' | 'md' | 'lg';

export interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  showFlare?: boolean;
  padding?: GlassPanelPadding;
  as?: ElementType;
}

const paddingStyles: Record<GlassPanelPadding, string> = {
  none: 'p-0',
  sm: 'p-3 md:p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      children,
      className = '',
      hover = false,
      showFlare = false,
      padding = 'md',
      as = 'div',
      initial = { opacity: 0, y: 12 },
      animate = { opacity: 1, y: 0 },
      transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      style,
      ...motionProps
    },
    ref
  ) => {
    const MotionComponent = React.useMemo(() => {
      if (typeof as === 'string') {
        return (motion as Record<string, any>)[as] || motion.div;
      }
      return motion(as as any);
    }, [as]);

    const baseStyles =
      'relative ' +
      'bg-[var(--surface-primary)] border border-white/[0.08] ' +
      'rounded-[var(--border-radius-lg,16px)] shadow-[var(--glass-shadow)] ' +
      'transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out';

    const hoverStyles = hover
      ? 'hover:bg-[var(--surface-secondary)] hover:border-[rgba(227,66,66,0.55)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(227,66,66,0.22)] cursor-pointer'
      : '';

    const selectedPadding = paddingStyles[padding] || paddingStyles.md;

    return (
      <MotionComponent
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
        className={`${baseStyles} ${hoverStyles} ${selectedPadding} ${className}`.trim()}
        style={{
          borderRadius: 'var(--border-radius-lg, 16px)',
          ...style,
        }}
        {...motionProps}
      >
        {showFlare && <div className="top-amber-flare" />}
        {children}
      </MotionComponent>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
