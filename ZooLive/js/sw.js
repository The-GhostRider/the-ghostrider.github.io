// Installa il service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/ZooLive/index.html',
        '/ZooLive/CSS-ZooLive/ZooLive.css',
        // aggiungi qui altri file statici
      ]);
    })
  );
});

// Usa il service worker per servire i file dalla cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Aggiorna la cache ogni volta che viene attivato il service worker
self.addEventListener('activate', event => {
  var cacheWhitelist = ['my-cache'];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
