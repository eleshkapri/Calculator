// Service Worker for CalVerse Pro (Offline-First with Background Sync)
const CACHE_NAME = 'calverse-v17';

// Core static assets required for complete offline operation
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/script.js',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// Install: Cache all core assets immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use map with individual catches so one failed asset doesn't break the entire offline installation
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

// Activate: Clean up all legacy caches and claim clients immediately
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

// Fetch: Robust Network-First with Immediate Offline Cache Fallback (ignoring query strings)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const url = new URL(request.url);

  // 1. Navigation requests (Opening the app / page load in browser or standalone PWA)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // When offline: Serve cached index.html
          return caches.match('./index.html', { ignoreSearch: true })
            .then((cached) => cached || caches.match('./', { ignoreSearch: true }));
        })
    );
    return;
  }

  // 2. Static local assets & fonts (CSS, JS, Icons, Images, Fonts)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      // If we have a cached copy, return it immediately for instant offline feel
      // and fetch fresh copy in background to update cache (Stale-While-Revalidate)
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline network failure is expected when disconnected
          return null;
        });

      // Return cached response if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
