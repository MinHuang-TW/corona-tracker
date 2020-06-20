const cacheName = 'version_1';
const cacheAssets = ['index.html', 'offline.html'];

self.addEventListener('install', (event) => {
  // console.log('Service Worker: Installed!')
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
})

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching...');
  event.respondWith(
    caches
      .match(event.request)
      .then(() => {
        return fetch(event.request)
          .catch(() => caches.match('offline.html'));
      })
  )
})

self.addEventListener('activate', (event) => {
  // console.log('Service Worker: Activated!');
  const cacheWhitelist = [];
  cacheWhitelist.push(cacheName);

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  )
})