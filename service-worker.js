const CACHE_NAME = 'cim-cache-v1';

// All files your map needs to work offline
const FILES_TO_CACHE = [
  '/CIM/',
  '/CIM/index.html',
  '/CIM/Calbayog_Boundary.js',
  '/CIM/residential_data.js',
  '/CIM/road_network_data.js'
];

// Install — cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching all map files...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch — serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
