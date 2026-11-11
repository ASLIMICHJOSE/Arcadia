'use client';

import React from 'react';
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
      showFlare
      padding="lg"
      className={`flex flex-col justify-between overflow-hidden relative group bg-[var(--surface-primary)] border border-white/[0.08] hover:border-[rgba(227,66,66,0.55)] ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background crimson highlight on hover */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(227, 66, 66, 0.28) 0%, transparent 70%)',
        }}
      />

      {/* Top Header: Icon & Trend Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E34242]/15 border border-[#E34242]/35 text-[#E34242] transition-transform duration-300 group-hover:scale-108 shadow-[0_0_14px_rgba(227,66,66,0.28)]">
          <Icon className="w-6 h-6 shrink-0" strokeWidth={2} />
        </div>

        {parsedTrend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
              parsedTrend.isUp === true
                ? 'text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30'
                : parsedTrend.isUp === false
                ? 'text-[#E34242] bg-[#E34242]/15 border-[#E34242]/30'
                : 'text-[var(--text-secondary)] bg-[var(--surface-secondary)] border-[var(--border-subtle)]'
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

      {/* Metric Content with Manrope ExtraBold */}
      <div className="mt-1">
        <div className="text-3xl md:text-4xl font-heading font-black tracking-tight text-[#FFF8F0]">
          {value}
        </div>
        <div className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[var(--text-secondary)] mt-1.5 font-heading">
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
