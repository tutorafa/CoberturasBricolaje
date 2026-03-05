/* ═══════════════════════════════════════════════
   Service Worker — Coberturas Bricolaje
   Estrategia: Cache First con actualización en background
   ═══════════════════════════════════════════════ */

const CACHE_NAME = 'bricolaje-v1.5.3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-48.png',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-167.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './favicon.ico',
  './og-image.png',
  './og-image-wide.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap'
];

/* ── INSTALL: precachear todos los assets ── */
self.addEventListener('install', event => {
  console.log('[SW] Instalando v1.0.0...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Cacheando assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log('[SW] Assets cacheados correctamente');
      return self.skipWaiting();
    }).catch(err => {
      console.warn('[SW] Error al cachear:', err);
    })
  );
});

/* ── ACTIVATE: limpiar cachés antiguas ── */
self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Eliminando caché antigua:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activado. Controlando todas las pestañas.');
      return self.clients.claim();
    })
  );
});

/* ── FETCH: Cache First, fallback a red ── */
self.addEventListener('fetch', event => {
  // Solo interceptar GET
  if (event.request.method !== 'GET') return;

  // Para fuentes de Google: Network First con fallback a caché
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cache.match(event.request));
      })
    );
    return;
  }

  // Para el resto: Cache First
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Está en caché: devolver inmediatamente y actualizar en background
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // No está en caché: ir a la red
      return fetch(event.request).then(response => {
        if (!response || !response.ok || response.type === 'opaque') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Offline y sin caché: devolver página principal
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

/* ── MENSAJE: forzar actualización desde la app ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
