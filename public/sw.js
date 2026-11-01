/**
 * Arcadia Service Worker
 * Production-ready caching strategy, offline support, and lifecycle handling.
 */

const CACHE_VERSION = 'arcadia-v1';
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
];

// Pre-cache App Shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_SHELL)
      .then((cache) => {
        // Precache essential URLs; ignore failures for pages not yet visited/rendered during build
        return Promise.allSettled(
          APP_SHELL_URLS.map((url) =>
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch((err) => {
                // Ignore precache failure during initial install
                console.warn(`[SW] Precache failed for ${url}:`, err);
              })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_SHELL, CACHE_STATIC, CACHE_IMAGES];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (!currentCaches.includes(name)) {
              console.log(`[SW] Deleting stale cache: ${name}`);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event listener
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Non-GET or internal schemes (e.g., chrome-extension)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. API requests & Auth endpoints: Network-Only (never cache)
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/auth') ||
    request.headers.get('accept')?.includes('application/json')
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network unavailable. You are currently offline.' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // 3. Navigation requests: Network-First -> Cache -> /offline
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
          // Fallback to root or offline placeholder
          return new Response(
            '<!DOCTYPE html><html><body><h1>Offline</h1><p>You are offline. Please reconnect to continue exploring Arcadia.</p></body></html>',
            {
              headers: { 'Content-Type': 'text/html' },
            }
          );
        })
    );
    return;
  }

  // 4. Image assets: Stale-While-Revalidate
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
            // Fail silently or handle missing asset
            return new Response('', { status: 408 });
          });
      })
    );
    return;
  }

  // Default: Network with cache fallback
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

// Handle explicit skipWaiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
