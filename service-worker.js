// Update the cache version each time you make a change to your files
const CACHE_NAME = 'typing-practice-v3'; 
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/sentences.js',
    // Add other files you need to cache
];

// Install event: cache files on first load
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    self.skipWaiting(); // Forces waiting service worker to activate
});

// Activate event: clear old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
                          .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim(); // Claim clients to update immediately
});

// Fetch event: update cache and return network request, falling back to cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(event.request)) // Return from cache if offline
    );
});
