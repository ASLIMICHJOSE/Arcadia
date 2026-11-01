'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassPanel from './GlassPanel';

export interface StatTrend {
  value: string | number;
  isUp?: boolean;
  label?: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: StatTrend | string | number;
  className?: string;
  helperText?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  className = '',
  helperText,
  delay = 0,
}) => {
  // Parse trend data whether provided as an object or primitive string/number
  const parsedTrend = React.useMemo(() => {
    if (!trend && trend !== 0) return null;

    if (typeof trend === 'object' && 'value' in trend) {
      const isUp =
        trend.isUp !== undefined
          ? trend.isUp
          : String(trend.value).startsWith('+') || Number(trend.value) > 0;
      return {
        value: trend.value,
        isUp,
        label: trend.label,
      };
    }

    const strVal = String(trend);
    const numVal = parseFloat(strVal);
    const isUp = strVal.startsWith('+') || (!strVal.startsWith('-') && numVal > 0);
    const isNeutral = numVal === 0 || strVal === '0%';

    return {
      value: strVal,
      isUp: isNeutral ? undefined : isUp,
      label: undefined,
    };
  }, [trend]);

  return (
    <GlassPanel
      hover
      padding="lg"
      className={`flex flex-col justify-between overflow-hidden relative group ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background radial highlight on hover */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(197, 164, 109, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Top Header: Icon & Optional Trend Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-[var(--border-radius-md,12px)] flex items-center justify-center text-[var(--gold)] transition-transform duration-300 group-hover:scale-105"
          style={{
            background: 'var(--gold-muted, rgba(197, 164, 109, 0.18))',
            border: '1px solid var(--glass-border-gold, rgba(197, 164, 109, 0.25))',
            boxShadow: 'var(--gold-glow-sm)',
          }}
        >
          <Icon className="w-6 h-6 shrink-0" strokeWidth={2} />
        </div>

        {parsedTrend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border transition-colors ${
              parsedTrend.isUp === true
                ? 'text-[var(--success)] bg-[var(--success-bg)] border-[rgba(78,173,123,0.3)]'
                : parsedTrend.isUp === false
                ? 'text-[var(--danger)] bg-[var(--danger-bg)] border-[rgba(214,69,69,0.3)]'
                : 'text-[var(--text-secondary)] bg-[var(--glass)] border-[var(--glass-border)]'
            }`}
          >
            {parsedTrend.isUp === true && <TrendingUp className="w-3.5 h-3.5" />}
            {parsedTrend.isUp === false && <TrendingDown className="w-3.5 h-3.5" />}
            {parsedTrend.isUp === undefined && <Minus className="w-3.5 h-3.5" />}
            <span>{parsedTrend.value}</span>
            {parsedTrend.label && (
              <span className="text-[10px] font-normal opacity-80">{parsedTrend.label}</span>
            )}
          </div>
        )}
      </div>

      {/* Metric Content */}
      <div className="mt-1">
        <div
          className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
        >
          {value}
        </div>
        <div className="text-xs md:text-sm font-medium tracking-wider uppercase text-[var(--text-secondary)] mt-1.5">
          {label}
        </div>
        {helperText && (
          <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-1">{helperText}</p>
        )}
      </div>
    </GlassPanel>
  );
};

export default StatCard;
