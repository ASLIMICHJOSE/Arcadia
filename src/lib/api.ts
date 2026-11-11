/**
 * Arcadia Unified API Client (Phase 3 Production Auth)
 * Handles in-memory Bearer token injection, silent HTTP-only refresh rotation,
 * concurrent 401 queuing, and uniform non-2xx error propagation.
 */

let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const rawMsg = data?.message;
    const errorMessage = Array.isArray(rawMsg)
      ? rawMsg.join(', ')
      : rawMsg || data?.error || `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }
  return data as T;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : endpoint.startsWith('/api')
      ? endpoint
      : `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'fetch',
    ...(options.headers as Record<string, string>),
  };

  if (inMemoryAccessToken) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(url, config);

  if (
    response.status === 401 &&
    !url.includes('/auth/login') &&
    !url.includes('/auth/register') &&
    !url.includes('/auth/refresh')
  ) {
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (!token) {
              reject(new Error('Session expired. Please log in again.'));
              return;
            }
            const retryHeaders = { ...headers, Authorization: `Bearer ${token}` };
            fetch(url, { ...config, headers: retryHeaders })
              .then((res) => parseJsonOrThrow<T>(res))
              .then(resolve)
              .catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;

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
        processQueue(null, refreshData.accessToken);

        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${refreshData.accessToken}`,
        };
        const retryRes = await fetch(url, { ...config, headers: retryHeaders });
        return await parseJsonOrThrow<T>(retryRes);
      }

      setAccessToken(null);
      const err = new Error('Session expired. Please log in again.');
      processQueue(err, null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('arcadia_session_expired'));
      }
      throw err;
    } catch (refreshErr) {
      setAccessToken(null);
      processQueue(refreshErr, null);
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  return parseJsonOrThrow<T>(response);
}
