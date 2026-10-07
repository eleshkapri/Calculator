// Service Worker for CalVerse Pro — Network-First for Fast Sync
const CACHE_NAME = 'calverse-v38';

// Core static assets required for complete offline operation
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './favicon.ico',
  './manifest.json',
  './assets/css/style.css',
  './assets/css/responsive.css',
  './assets/css/core/variables.css',
  './assets/css/core/reset.css',
  './assets/css/ui/layout.css',
  './assets/css/ui/header.css',
  './assets/css/ui/sidebar.css',
  './assets/css/ui/display.css',
  './assets/css/ui/keypad.css',
  './assets/css/ui/modals.css',
  './assets/css/ui/footer.css',
  './assets/css/features/standard.css',
  './assets/css/features/graphing.css',
  './assets/css/features/financial.css',
  './assets/css/features/programmer.css',
  './assets/css/features/health.css',
  './assets/css/features/date.css',
  './assets/css/features/time.css',
  './assets/css/features/discount.css',
  './assets/css/features/equations.css',
  './assets/css/features/statistics.css',
  './assets/css/features/converter.css',
  './assets/icons/favicon.svg',
  './assets/icons/favicon.ico',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './src/main.js',
  './src/core/constants.js',
  './src/core/dom.js',
  './src/core/format.js',
  './src/core/math.js',
  './src/core/sound.js',
  './src/core/state.js',
  './src/core/storage.js',
  './src/features/base.js',
  './src/features/converter.js',
  './src/features/date.js',
  './src/features/discount.js',
  './src/features/equations.js',
  './src/features/financial.js',
  './src/features/graphing.js',
  './src/features/health.js',
  './src/features/programmer.js',
  './src/features/scientific.js',
  './src/features/standard.js',
  './src/features/statistics.js',
  './src/features/time.js',
  './src/ui/clock.js',
  './src/ui/keyboard.js',
  './src/ui/navigation.js',
  './src/ui/pwa.js',
  './src/ui/theme.js'
];

// Install: Cache all core assets immediately, activate without waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Failed to cache ${url}:`, err);
          })
        )
      );
    })
  );
});

// Activate: Delete ALL old caches and claim all open tabs immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First strategy (fast sync) with offline cache fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  // Navigation requests (opening the app / page load)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('./index.html', { ignoreSearch: true })
            .then((cached) => cached || caches.match('./', { ignoreSearch: true }));
        })
    );
    return;
  }

  const url = new URL(request.url);

  // Local app assets (CSS, JS, icons) — Network-First for fast updates
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline: serve from cache (ignoring query params like ?v=4.1)
          return caches.match(request, { ignoreSearch: true });
        })
    );
    return;
  }

  // External resources (fonts, APIs) — Cache-First for performance
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => null);
    })
  );
});
