// Service Worker for Mama's Kitchen
// Caches static assets and provides offline support

const CACHE_NAME = 'mamas-kitchen-v1';
const STATIC_CACHE_NAME = 'mamas-kitchen-static-v1';
const DYNAMIC_CACHE_NAME = 'mamas-kitchen-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/input.css',
  '/logo.png',
  '/hero3.jpg',
  '/hero2.jpg',
  '/hero1.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch(err => {
      console.error('[Service Worker] Cache install failed:', err);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip localhost/development requests (Vite dev server)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.port === '5173') {
    return; // Let Vite handle these requests
  }

  // Skip Firebase and external API requests
  if (url.origin.includes('firebase') || 
      url.origin.includes('googleapis') ||
      url.origin.includes('gstatic')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response for caching
        const responseToCache = response.clone();

        // Cache dynamic assets
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          // Limit cache size - remove oldest entries if needed
          cache.put(request, responseToCache).then(() => {
            // Clean up old entries if cache gets too large
            cache.keys().then((keys) => {
              if (keys.length > 50) {
                cache.delete(keys[0]);
              }
            });
          });
        });

        return response;
      }).catch(() => {
        // If network fails and it's a navigation request, return offline page
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Background sync for offline actions (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Handle background sync tasks here
      Promise.resolve()
    );
  }
});

