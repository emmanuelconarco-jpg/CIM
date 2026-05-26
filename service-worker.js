const CACHE_NAME = 'cim-cache-v2';

const ASSETS = [
  '/CIM/',
  '/CIM/index.html',
  '/CIM/style.css',
  '/CIM/script.js',
  '/CIM/manifest.json',
];

// Install — cache all assets
self.addEventListener('install', event => {
  self.skipWaiting(); // activate immediately, don't wait
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate — delete old caches automatically
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('Deleting old cache:', key);
              return caches.delete(key);
            })
      )
    ).then(() => self.clients.claim()) // take control immediately
  );
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
