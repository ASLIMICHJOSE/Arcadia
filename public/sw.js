/**
 * Arcadia Service Worker — Phase 2 Production Implementation
 * High-performance multi-tier caching, game artwork pre-caching, offline support, and lifecycle handling.
 */

const CACHE_VERSION = 'arcadia-v2';
const CACHE_SHELL = `${CACHE_VERSION}-shell`;
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

const APP_SHELL_URLS = [
  '/',
  '/discover',
  '/leaderboard',
  '/community',
  '/login',
  '/register',
  '/dashboard',
  '/offline',
  '/images/hero-western.jpg',
  '/images/games/tic-tac-toe.jpg',
  '/images/games/snake.jpg',
  '/images/games/memory-match.jpg',
  '/images/games/rock-paper-scissors.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
];

// Pre-cache App Shell and Essential Game Assets on install
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
              console.log(`[SW] Cleaning up obsolete cache: ${name}`);
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

  // 1. Non-GET or internal schemes (e.g. chrome-extension)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. Sensitive Endpoints & APIs: STRICT NETWORK-ONLY (Never cached publicly)
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/auth') ||
    url.pathname.includes('/payment') ||
    request.headers.get('accept')?.includes('application/json')
  ) {
    event.respondWith(
      fetch(request).catch(() => {
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

  // 3. Navigation requests: Network-First with /offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
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

  // 4. Image & Media Assets: Stale-While-Revalidate
  const isImage =
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|avif|ico)$/i.test(url.pathname);

  if (isImage) {
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

  // 5. Static Assets (CSS, JS, Fonts, _next/static): Cache-First
  const isStatic =
    url.pathname.startsWith('/_next/static') ||
    /\.(css|js|woff|woff2|ttf|otf|eot)$/i.test(url.pathname);

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

  // Default: Network with Cache fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).catch(() => {
          return new Response('', { status: 408 });
        })
      );
    })
  );
});

// Skip waiting message handler for seamless app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
