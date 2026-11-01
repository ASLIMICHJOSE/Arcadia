'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#100F0D',
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(197, 164, 109, 0.15) 0%, rgba(16, 15, 13, 0.98) 75%)',
        color: '#F3EBDD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        margin: 0,
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient ring */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          border: '1px solid rgba(197, 164, 109, 0.1)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '740px',
          height: '740px',
          borderRadius: '50%',
          border: '1px dashed rgba(197, 164, 109, 0.05)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glass Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '540px',
          width: '100%',
          backgroundColor: 'rgba(33, 28, 22, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(197, 164, 109, 0.25)',
          borderRadius: '20px',
          padding: '48px 32px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.65), 0 0 24px rgba(197, 164, 109, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Icon Container with subtle pulsing glow */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(197, 164, 109, 0.1)',
            border: '1px solid rgba(197, 164, 109, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
            boxShadow: '0 0 20px rgba(197, 164, 109, 0.2)',
          }}
        >
          <WifiOff size={36} color="#C5A46D" strokeWidth={1.75} />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
            fontWeight: 700,
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #DFCA9B 0%, #C5A46D 50%, #9F7F48 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#C5A46D',
          }}
        >
          Lost in the Frontier
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.65,
            color: '#B8AA96',
            margin: '0 0 32px 0',
            maxWidth: '440px',
          }}
        >
          It seems you&apos;ve wandered beyond the reach of civilization. Check your connection and try again.
        </p>

        {/* Try Again Button */}
        <button
          onClick={handleReload}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #C5A46D 0%, #80613C 100%)',
            color: '#100F0D',
            fontWeight: 600,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            padding: '12px 28px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 16px rgba(197, 164, 109, 0.3)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(197, 164, 109, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 16px rgba(197, 164, 109, 0.3)';
          }}
        >
          <RefreshCw size={18} strokeWidth={2.2} />
          <span>Try Again</span>
        </button>

        {/* Small badge */}
        <span
          style={{
            marginTop: '28px',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7E7260',
          }}
        >
          Arcadia Station • Out of Range
        </span>
      </div>
    </main>
  );
}
