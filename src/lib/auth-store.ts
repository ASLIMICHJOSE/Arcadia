'use client';

import { useSyncExternalStore } from 'react';
import { apiClient, setAccessToken } from './api';
import { saveUserSession, clearUserSession } from './auth';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  emailVerified: boolean;
  createdAt?: string;
}

export interface PlayerProfile {
  id: string;
  rank: string;
  level: number;
  xp: number;
  title: string;
  reputationScore: number;
  duelsWon: number;
  matchesPlayed: number;
}

export interface AuthState {
  user: User | null;
  profile: PlayerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

let state: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

let inFlightCheckAuth: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function updateState(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  emitChange();
}

function purgeServiceWorkerPrivateCache() {
  if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_PRIVATE_CACHE' });
  }
}

export const authStore = {
  getState: () => state,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setUser: (user: User | null, profile?: PlayerProfile | null) => {
    if (user) {
      saveUserSession(user.username, user.email);
      updateState({
        user,
        profile: profile !== undefined ? profile : state.profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      clearUserSession();
      setAccessToken(null);
      updateState({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  login: async (email: string, password: string) => {
    updateState({ isLoading: true, error: null });
    try {
      const data = await apiClient<{
        accessToken: string;
        user: User;
        profile: PlayerProfile;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAccessToken(data.accessToken);
      authStore.setUser(data.user, data.profile);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      updateState({ isLoading: false, error: msg });
      throw err;
    }
  },

  register: async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    updateState({ isLoading: true, error: null });
    try {
      const data = await apiClient<{
        message: string;
        user: User;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      updateState({ isLoading: false, error: null });
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      updateState({ isLoading: false, error: msg });
      throw err;
    }
  },

  /**
   * Deduplicated silent session bootstrap using HTTP-only refresh cookie.
   * Prevents parallel mounts from racing one-time rotated refresh tokens.
   */
  checkAuth: async (force = false) => {
    if (typeof window === 'undefined') return;
    if (inFlightCheckAuth && !force) {
      return inFlightCheckAuth;
    }

    const runner = (async () => {
      updateState({ isLoading: true });
      try {
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'fetch',
          },
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setAccessToken(refreshData.accessToken);

          const meData = await apiClient<{
            user: User;
            profile: PlayerProfile;
          }>('/auth/me');

          authStore.setUser(meData.user, meData.profile);
        } else {
          authStore.setUser(null);
        }
      } catch {
        authStore.setUser(null);
      } finally {
        inFlightCheckAuth = null;
      }
    })();

    inFlightCheckAuth = runner;
    return runner;
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // ignore logout network errors
    } finally {
      authStore.setUser(null);
      purgeServiceWorkerPrivateCache();
    }
  },

  forgotPassword: async (email: string) => {
    return apiClient<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword: string) => {
    return apiClient<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
  },

  verifyEmail: async (token: string) => {
    return apiClient<{ message: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`,
    );
  },

  resendVerification: async (email: string) => {
    return apiClient<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

export function useAuthStore<T>(selector?: (state: AuthState) => T): T | AuthState {
  const current = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    () => state,
  );

  return selector ? selector(current) : current;
}
