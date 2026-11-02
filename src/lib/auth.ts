'use client';

export interface UserSession {
  username: string;
  email?: string;
  isLoggedIn: boolean;
}

export function getCurrentUser(): UserSession {
  if (typeof window === 'undefined') {
    return { username: 'CONTENDER', isLoggedIn: false };
  }
  try {
    const raw = localStorage.getItem('arcadia_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.username) {
        return { username: parsed.username, email: parsed.email, isLoggedIn: true };
      }
    }
  } catch {
    // ignore json errors
  }
  return { username: 'CONTENDER', isLoggedIn: false };
}

export function saveUserSession(username: string, email?: string) {
  if (typeof window === 'undefined') return;
  const user = { username: username.trim() || 'CONTENDER', email, isLoggedIn: true };
  localStorage.setItem('arcadia_user', JSON.stringify(user));
  window.dispatchEvent(new Event('arcadia_auth_change'));
}

export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('arcadia_user');
  window.dispatchEvent(new Event('arcadia_auth_change'));
}

export function getDynamicGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Good night';
}

