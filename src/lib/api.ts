/**
 * Arcadia Unified API Client (Phase 3 Production Auth)
 * Handles in-memory Bearer token injection, silent HTTP-only refresh rotation, and 401 interception.
 */

let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (inMemoryAccessToken) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  // Include credentials for HTTP-only SameSite cookie exchange
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    // If 401 Unauthorized and not already refreshing or calling refresh/login
    if (
      response.status === 401 &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/register') &&
      !url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue pending requests while refresh token is being rotated
        return new Promise<T>((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              headers['Authorization'] = `Bearer ${token}`;
              fetch(url, { ...config, headers })
                .then((res) => res.json())
                .then(resolve)
                .catch(reject);
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt silent rotation with HTTP-only cookie
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setAccessToken(refreshData.accessToken);
          processQueue(null, refreshData.accessToken);

          // Retry initial failed request with new access token
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          const retryRes = await fetch(url, { ...config, headers });
          return await retryRes.json();
        } else {
          // Refresh failed / expired: invalidate state
          setAccessToken(null);
          processQueue(new Error('Session expired'), null);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('arcadia_session_expired'));
          }
          throw new Error('Session expired. Please log in again.');
        }
      } catch (refreshErr) {
        setAccessToken(null);
        processQueue(refreshErr, null);
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.message || (Array.isArray(data.message) ? data.message.join(', ') : data.error) || 'Network response was not ok';
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error) {
    throw error;
  }
}

