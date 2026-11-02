'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';
import { playBlip, playEngage } from '@/lib/sound';

export type ButtonVariant = 'gold' | 'crimson' | 'outline' | 'ghost';
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
    'text-[#0D0B09] font-bold border border-white/30 ' +
    'shadow-[0_4px_16px_rgba(240,163,82,0.4)] ' +
    'hover:shadow-[0_6px_24px_rgba(240,163,82,0.6),0_0_16px_rgba(240,163,82,0.3)]',
  crimson:
    'text-white font-bold border border-white/20 ' +
    'shadow-[0_4px_16px_rgba(227,66,66,0.35)] ' +
    'hover:shadow-[0_6px_24px_rgba(227,66,66,0.5),0_0_16px_rgba(227,66,66,0.3)]',
  outline:
    'bg-[var(--surface-primary)] text-[#FFF8F0] border border-[rgba(240,163,82,0.25)] ' +
    'hover:bg-[var(--surface-secondary)] hover:border-[var(--accent-primary)] ' +
    'hover:shadow-[0_0_16px_rgba(240,163,82,0.25)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] border border-transparent ' +
    'hover:text-[#FFF8F0] hover:bg-[var(--surface-primary)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5 min-h-[32px]',
  md: 'text-sm px-5 py-2.5 rounded-xl gap-2 min-h-[42px]',
  lg: 'text-base px-7 py-3.5 rounded-xl gap-2.5 min-h-[50px] font-semibold',
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

    const baseClasses =
      'inline-flex items-center justify-center font-medium tracking-wide ' +
      'transition-all duration-200 select-none cursor-pointer outline-none ' +
      'focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 ' +
      'focus-visible:ring-offset-[#0D0B09]';

    const disabledClasses = !isInteractive
      ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none'
      : '';

    const combinedClassName = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledClasses} ${className}`.trim();

    const gradientStyle: React.CSSProperties =
      variant === 'gold'
        ? {
            background: 'var(--amber-gradient, linear-gradient(135deg, #F0A352 0%, #D97706 100%))',
          }
        : variant === 'crimson'
        ? {
            background: 'var(--crimson-gradient, linear-gradient(135deg, #E34242 0%, #B91C1C 100%))',
          }
        : {};

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (variant === 'gold' || variant === 'crimson') {
        playEngage();
      } else {
        playBlip();
      }
      onClick?.(e);
    };

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
            onClick={isInteractive ? handleClick : (e) => e.preventDefault()}
            target={target}
            rel={rel}
            className={combinedClassName}
            style={{ ...gradientStyle, ...style }}
          >
            {content}
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type as 'button' | 'submit' | 'reset'}
        disabled={disabled || loading}
        onClick={isInteractive ? handleClick : undefined}
        whileHover={isInteractive ? { scale: 1.02 } : undefined}
        whileTap={isInteractive ? { scale: 0.98 } : undefined}
        className={combinedClassName}
        style={{ ...gradientStyle, ...style }}
        {...motionProps}
      >
        {content}
      </motion.button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
