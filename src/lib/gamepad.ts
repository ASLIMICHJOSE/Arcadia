'use client';

import { useState, useEffect } from 'react';

export interface GamepadState {
  isConnected: boolean;
  name: string;
}

/**
 * HTML5 Gamepad API Hook for Arcadia
 * Detects connected controllers (Xbox, PlayStation, Nintendo Switch)
 */
export function useGamepad(): GamepadState {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    isConnected: false,
    name: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if gamepads are already connected on mount
    const checkInitialGamepads = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const pad of pads) {
        if (pad) {
          setGamepadState({
            isConnected: true,
            name: cleanGamepadName(pad.id),
          });
          return;
        }
      }
    };

    checkInitialGamepads();

    const handleConnected = (e: GamepadEvent) => {
      setGamepadState({
        isConnected: true,
        name: cleanGamepadName(e.gamepad.id),
      });
    };

    const handleDisconnected = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const anyPad = Array.from(pads).find((p) => p !== null);
      if (anyPad) {
        setGamepadState({
          isConnected: true,
          name: cleanGamepadName(anyPad.id),
        });
      } else {
        setGamepadState({
          isConnected: false,
          name: '',
        });
      }
    };

    window.addEventListener('gamepadconnected', handleConnected);
    window.addEventListener('gamepaddisconnected', handleDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      window.removeEventListener('gamepaddisconnected', handleDisconnected);
    };
  }, []);

  return gamepadState;
}

function cleanGamepadName(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('xbox')) return 'Xbox Controller';
  if (lower.includes('dualsense') || lower.includes('dualshock') || lower.includes('054c')) return 'PlayStation Controller';
  if (lower.includes('switch') || lower.includes('nintendo')) return 'Switch Controller';
  return 'Gamepad Connected';
}

