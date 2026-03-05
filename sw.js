/* ═══════════════════════════════════════════════
   Service Worker — Coberturas Bricolaje v1.6.0
   ═══════════════════════════════════════════════ */

const CACHE_NAME = 'bricolaje-v1.6.0';

// Solo assets locales — nunca recursos externos en addAll()
// Si un recurso externo falla, addAll() cancela TODA la instalación del SW
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Fuentes Google: Network First, sin bloquear
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Todo lo demás: Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Actualizar en background sin bloquear
        fetch(event.request).then(res => {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, res));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then(res => {
        if (res && res.ok && res.type !== 'opaque') {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
