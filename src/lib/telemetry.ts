'use client';

/**
 * Arcadia Telemetry & Progression Engine
 * Manages persistent local match statistics, high scores, and playtime.
 */

export interface GameRecord {
  highScore: number;
  matchesPlayed: number;
  wins: number;
  lastPlayed: string;
}

export interface PlayerTelemetry {
  totalPlaytimeSeconds: number;
  gamesPlayed: number;
  challengesSolved: number;
  duelsWon: number;
  gameRecords: Record<string, GameRecord>;
}

const STORAGE_KEY = 'arcadia_telemetry';

export const DEFAULT_TELEMETRY: PlayerTelemetry = {
  totalPlaytimeSeconds: 462420, // Baseline demo ~128.45h if brand new, increases with actual play
  gamesPlayed: 142,
  challengesSolved: 189,
  duelsWon: 7243,
  gameRecords: {
    'tic-tac-toe': { highScore: 1840, matchesPlayed: 94, wins: 78, lastPlayed: 'Today' },
    'snake': { highScore: 8420, matchesPlayed: 112, wins: 68, lastPlayed: 'Today' },
    'memory-match': { highScore: 4190, matchesPlayed: 42, wins: 38, lastPlayed: 'Yesterday' },
    'rock-paper-scissors': { highScore: 2450, matchesPlayed: 56, wins: 41, lastPlayed: '2 days ago' },
  },
};

export function getTelemetry(): PlayerTelemetry {
  if (typeof window === 'undefined') return DEFAULT_TELEMETRY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_TELEMETRY,
        ...parsed,
        gameRecords: {
          ...DEFAULT_TELEMETRY.gameRecords,
          ...(parsed.gameRecords || {}),
        },
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_TELEMETRY;
}

export function saveTelemetry(telemetry: PlayerTelemetry): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(telemetry));
    window.dispatchEvent(new Event('arcadia_telemetry_updated'));
  } catch {
    // ignore
  }
}

/** Record a completed game match */
export function recordGameResult(slug: string, won: boolean, score: number = 0): void {
  const current = getTelemetry();
  const existing = current.gameRecords[slug] || {
    highScore: 0,
    matchesPlayed: 0,
    wins: 0,
    lastPlayed: 'Just now',
  };

  const updatedRecord: GameRecord = {
    highScore: Math.max(existing.highScore, score),
    matchesPlayed: existing.matchesPlayed + 1,
    wins: existing.wins + (won ? 1 : 0),
    lastPlayed: 'Just now',
  };

  const updated: PlayerTelemetry = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    duelsWon: current.duelsWon + (won ? 1 : 0),
    challengesSolved: current.challengesSolved + (won ? 1 : 0),
    gameRecords: {
      ...current.gameRecords,
      [slug]: updatedRecord,
    },
  };

  saveTelemetry(updated);
}

/** Increment playtime by N seconds */
export function addPlaytime(seconds: number): void {
  const current = getTelemetry();
  current.totalPlaytimeSeconds += seconds;
  saveTelemetry(current);
}

/** Format seconds into "128,45h" or "2,3h" */
export function formatPlaytime(seconds: number): string {
  const hours = seconds / 3600;
  return `${hours.toFixed(2).replace('.', ',')}h`;
}

