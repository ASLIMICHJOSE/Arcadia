'use client';

/**
 * Haptic Vibration Engine for Arcadia Gaming PWA
 * Provides physical feedback pulses for console controllers and touch devices.
 */

export type HapticType = 'light' | 'medium' | 'success' | 'error';

export function isHapticsSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}

export function isHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('arcadia_haptics_enabled');
  return stored !== 'false';
}

export function setHapticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('arcadia_haptics_enabled', String(enabled));
}

export function triggerHaptic(type: HapticType = 'light'): void {
  if (!isHapticsSupported() || !isHapticsEnabled()) return;

  try {
    switch (type) {
      case 'light':
        // Short subtle tap for menu navigation and buttons
        navigator.vibrate(12);
        break;
      case 'medium':
        // Distinct tactile pulse for in-game moves, turns, and flips
        navigator.vibrate(28);
        break;
      case 'success':
        // Double pulse fanfare for round won, trophy unlocked
        navigator.vibrate([25, 45, 35]);
        break;
      case 'error':
        // Deep warning vibration for collision, loss, or invalid move
        navigator.vibrate([40, 40, 50]);
        break;
    }
  } catch {
    // Ignore any vibration errors
  }
}

