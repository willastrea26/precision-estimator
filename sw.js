const CACHE = 'ap-cache-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Clear all old caches so the next load always fetches fresh HTML
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
      .then(() => {
        // Tell all open tabs to reload so they get the new version
        return self.clients.matchAll({type:'window'}).then(cls => {
          cls.forEach(c => c.postMessage({type:'SW_UPDATED'}));
        });
      })
  );
});

// Network-first: always fetch latest, fall back to cache if offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
