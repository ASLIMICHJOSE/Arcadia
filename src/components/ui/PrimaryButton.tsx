'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';

export type ButtonVariant = 'gold' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface PrimaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'style'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<ButtonVariant, string> = {
  gold:
    'text-[#100F0D] font-semibold border border-[rgba(255,255,255,0.25)] ' +
    'shadow-[0_4px_16px_rgba(197,164,109,0.28)] ' +
    'hover:shadow-[0_6px_24px_rgba(197,164,109,0.45),var(--gold-glow-sm)]',
  outline:
    'bg-transparent text-[var(--gold)] border border-[var(--gold)] ' +
    'hover:bg-[rgba(197,164,109,0.12)] hover:border-[var(--gold-light)] ' +
    'hover:shadow-[var(--gold-glow-sm)] hover:text-[var(--gold-light)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] border border-transparent ' +
    'hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3.5 py-1.5 rounded-[var(--border-radius-sm,8px)] gap-1.5 min-h-[32px]',
  md: 'text-sm px-5 py-2.5 rounded-[var(--border-radius-md,12px)] gap-2 min-h-[42px]',
  lg: 'text-base px-7 py-3.5 rounded-[var(--border-radius-md,12px)] gap-2.5 min-h-[50px] font-semibold',
};

export const PrimaryButton = forwardRef<HTMLElement, PrimaryButtonProps>(
  (
    {
      children,
      variant = 'gold',
      size = 'md',
      href,
      onClick,
      className = '',
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      type = 'button',
      target,
      rel,
      style,
      ...motionProps
    },
    ref
  ) => {
    const isInteractive = !disabled && !loading;

    // Base button classes
    const baseClasses =
      'inline-flex items-center justify-center font-medium tracking-wide ' +
      'transition-all duration-200 select-none cursor-pointer outline-none ' +
      'focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 ' +
      'focus-visible:ring-offset-[var(--background)]';

    const disabledClasses = !isInteractive
      ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none'
      : '';

    const combinedClassName = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledClasses} ${className}`.trim();

    // Inline style specifically handling the gold gradient background
    const goldGradientStyle: React.CSSProperties =
      variant === 'gold'
        ? {
            background: 'var(--gold-gradient, linear-gradient(135deg, #C5A46D 0%, #80613C 100%))',
          }
        : {};

    const content = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        ) : (
          Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
        )}
        <span className="truncate">{children}</span>
        {!loading && Icon && iconPosition === 'right' && (
          <Icon className="w-4 h-4 shrink-0" />
        )}
      </>
    );

    // If href is specified, render as a Next.js Link wrapped with motion
    if (href && !disabled) {
      const isFullWidth = className.includes('w-full');
      return (
        <motion.div
          whileHover={isInteractive ? { scale: 1.02 } : undefined}
          whileTap={isInteractive ? { scale: 0.98 } : undefined}
          className={isFullWidth ? 'w-full block' : 'inline-block'}
        >
          <Link
            href={href}
            ref={ref as React.Ref<HTMLAnchorElement>}
            onClick={isInteractive ? onClick : (e) => e.preventDefault()}
            target={target}
            rel={rel}
            aria-disabled={!isInteractive}
            className={combinedClassName}
            style={{ ...goldGradientStyle, ...style }}
          >
            {content}
          </Link>
        </motion.div>
      );
    }

    // Default button rendering
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={!isInteractive}
        aria-busy={loading}
        onClick={isInteractive ? onClick : undefined}
        whileHover={isInteractive ? { scale: 1.02 } : undefined}
        whileTap={isInteractive ? { scale: 0.98 } : undefined}
        className={combinedClassName}
        style={{ ...goldGradientStyle, ...style }}
        {...motionProps}
      >
        {content}
      </motion.button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
