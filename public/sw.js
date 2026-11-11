/**
 * Arcadia Service Worker — Hardened Production Caching
 * Public shell pre-caching, offline fallback, zero caching of API/auth/tokenized/private pages.
 */

const CACHE_VERSION = 'arcadia-v3';
const CACHE_SHELL = `${CACHE_VERSION}-shell`;
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

const APP_SHELL_URLS = [
  '/',
  '/discover',
  '/leaderboard',
  '/community',
  '/offline',
  '/images/hero-character.jpg',
  '/images/games/tic-tac-toe.jpg',
  '/images/games/snake.jpg',
  '/images/games/memory-match.jpg',
  '/images/games/rock-paper-scissors.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
];

const SENSITIVE_ROUTE_PREFIXES = [
  '/dashboard',
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/',
];

function isSensitiveUrl(url) {
  if (url.searchParams.has('token') || url.searchParams.has('code') || url.searchParams.has('auth')) {
    return true;
  }
  return SENSITIVE_ROUTE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
}

// Pre-cache only public App Shell and Essential Game Assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_SHELL)
      .then((cache) => {
        return Promise.allSettled(
          APP_SHELL_URLS.map((url) =>
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch((err) => {
                console.warn(`[SW] Precache skipped for ${url}:`, err);
              })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Clean up old obsolete caches on activation
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_SHELL, CACHE_STATIC, CACHE_IMAGES];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (!currentCaches.includes(name)) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event listener with strict security & performance routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Non-GET, cross-origin non-HTTPS, or internal browser schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. Sensitive Endpoints & Authenticated/Tokenized Requests: STRICT NETWORK-ONLY
  if (
    url.origin === self.location.origin &&
    (isSensitiveUrl(url) ||
      request.headers.get('authorization') ||
      request.headers.get('accept')?.includes('application/json'))
  ) {
    event.respondWith(
      fetch(request).catch(async () => {
        if (request.mode === 'navigate') {
          const offlineFallback = await caches.match('/offline');
          if (offlineFallback) return offlineFallback;
        }
        return new Response(
          JSON.stringify({
            error: 'Network unavailable. Live matchmaking and account actions require an active connection.',
            offline: true,
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // 3. Public Navigation requests: Network-First with /offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cacheControl = response.headers.get('cache-control') || '';
          if (
            response &&
            response.status === 200 &&
            url.origin === self.location.origin &&
            !cacheControl.includes('no-store') &&
            !cacheControl.includes('private')
          ) {
            const copy = response.clone();
            caches.open(CACHE_SHELL).then((cache) => {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlineFallback = await caches.match('/offline');
          if (offlineFallback) {
            return offlineFallback;
          }
          return new Response(
            '<!DOCTYPE html><html><body><h1>Arcadia Offline</h1><p>You have wandered beyond network range. Please reconnect to continue.</p></body></html>',
            {
              headers: { 'Content-Type': 'text/html' },
            }
          );
        })
    );
    return;
  }

  // 4. Same-origin Image & Media Assets: Stale-While-Revalidate
  const isImage =
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|avif|ico)$/i.test(url.pathname);

  if (isImage && url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_IMAGES).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. Same-origin Static Assets (CSS, JS, Fonts, _next/static): Cache-First
  const isStatic =
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/static') ||
      /\.(css|js|woff|woff2|ttf|otf|eot)$/i.test(url.pathname)) &&
    url.pathname !== '/sw.js';

  if (isStatic) {
    event.respondWith(
      caches.open(CACHE_STATIC).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response('', { status: 408 });
          });
      })
    );
    return;
  }
});

// Lifecycle & logout cleanup messages
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data.type === 'CLEAR_PRIVATE_CACHE') {
    event.waitUntil(
      caches.open(CACHE_SHELL).then(async (cache) => {
        const requests = await cache.keys();
        await Promise.all(
          requests
            .filter((req) => isSensitiveUrl(new URL(req.url)))
            .map((req) => cache.delete(req))
        );
      })
    );
  }
});
