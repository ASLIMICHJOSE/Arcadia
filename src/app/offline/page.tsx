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
        backgroundColor: '#260D0D',
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(227, 66, 66, 0.15) 0%, rgba(38, 13, 13, 0.98) 75%)',
        color: '#FFF5F0',
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
      {/* Decorative ambient rings */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          border: '1px solid rgba(227, 66, 66, 0.12)',
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
          border: '1px dashed rgba(227, 66, 66, 0.08)',
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
          backgroundColor: 'rgba(53, 19, 19, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(227, 66, 66, 0.25)',
          borderRadius: '24px',
          padding: '48px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(227, 66, 66, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Icon Container */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: 'rgba(227, 66, 66, 0.15)',
            border: '1px solid rgba(227, 66, 66, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
            boxShadow: '0 0 24px rgba(227, 66, 66, 0.25)',
          }}
        >
          <WifiOff size={36} color="#E34242" strokeWidth={2} />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
            fontWeight: 800,
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
            color: '#FFF5F0',
          }}
        >
          Lost Connection
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.65,
            color: '#C7A9A3',
            margin: '0 0 32px 0',
            maxWidth: '440px',
          }}
        >
          You are currently detached from the Arcadia network. Check your internet connection or play offline-capable titles.
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
            background: 'linear-gradient(135deg, #E34242 0%, #C83A35 100%)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            padding: '14px 32px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(227, 66, 66, 0.4)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 8px 28px rgba(227, 66, 66, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 20px rgba(227, 66, 66, 0.4)';
          }}
        >
          <RefreshCw size={18} strokeWidth={2.4} />
          <span>Reconnect</span>
        </button>

        {/* Small badge */}
        <span
          style={{
            marginTop: '28px',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#987B77',
            fontWeight: 600,
          }}
        >
          Arcadia Client • Offline Cache Active
        </span>
      </div>
    </main>
  );
}
