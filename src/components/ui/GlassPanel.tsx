'use client';

import React, { forwardRef, ElementType } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type GlassPanelPadding = 'none' | 'sm' | 'md' | 'lg';

export interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
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
    // Polymorphic motion element
    const MotionComponent = React.useMemo(() => {
      if (typeof as === 'string') {
        return (motion as Record<string, any>)[as] || motion.div;
      }
      return motion(as as any);
    }, [as]);

    const baseStyles =
      'relative backdrop-blur-[16px] -webkit-backdrop-blur-[16px] ' +
      'bg-[var(--glass)] border border-[var(--glass-border)] ' +
      'rounded-[var(--border-radius-lg,16px)] shadow-[var(--glass-shadow)] ' +
      'transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out';

    const hoverStyles = hover
      ? 'hover:bg-[var(--glass-hover)] hover:border-[var(--glass-border-hover)] hover:shadow-[var(--glass-shadow-lg)] cursor-pointer'
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
          background: 'var(--glass)',
          backdropFilter: 'blur(var(--glass-blur, 16px))',
          WebkitBackdropFilter: 'blur(var(--glass-blur, 16px))',
          borderColor: 'var(--glass-border)',
          borderRadius: 'var(--border-radius-lg, 16px)',
          boxShadow: 'var(--glass-shadow)',
          ...style,
        }}
        {...motionProps}
      >
        {children}
      </MotionComponent>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
