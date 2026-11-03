'use client';

import { useSyncExternalStore } from 'react';
import { apiClient, setAccessToken, getAccessToken } from './api';
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

// In-memory store state
let state: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

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
    } catch (err: any) {
      updateState({ isLoading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  register: async (username: string, email: string, password: string, confirmPassword: string) => {
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
    } catch (err: any) {
      updateState({ isLoading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  checkAuth: async () => {
    // Only run on client
    if (typeof window === 'undefined') return;

    updateState({ isLoading: true });
    try {
      // First try silent refresh with HTTP-only cookie
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setAccessToken(refreshData.accessToken);

        // Fetch user profile and game stats
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
    }
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // ignore logout network errors
    } finally {
      authStore.setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
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
    return apiClient<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  resendVerification: async (email: string) => {
    return apiClient<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// React Hook (Zustand style selector pattern)
export function useAuthStore<T>(selector?: (state: AuthState) => T): T | AuthState {
  const current = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    () => state, // SSR fallback
  );

  return selector ? selector(current) : current;
}

