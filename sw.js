/* ═══════════════════════════════════════════════
   Service Worker — Coberturas Bricolaje v1.7.0
   Compatible: Chrome, Firefox, Safari iOS/macOS
   ═══════════════════════════════════════════════ */

const CACHE_NAME = 'bricolaje-v1.7.0';

// IMPORTANTE: No incluir './' — en GitHub Pages puede devolver
// un redirect 301 que rompe addAll() en Safari iOS
const LOCAL_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* ── INSTALL: cachear solo lo esencial, nunca fallar ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cachear cada asset individualmente para que un fallo
        // no cancele toda la instalación (crítico en Safari iOS)
        return Promise.allSettled(
          LOCAL_ASSETS.map(url =>
            cache.add(url).catch(err => {
              console.warn('[SW] No se pudo cachear:', url, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: limpiar cachés antiguas ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH: Network First para navegación, Cache First para assets ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Ignorar peticiones que no son del mismo origen (extensiones, analytics, etc.)
  if (!url.startsWith(self.location.origin) &&
      !url.includes('fonts.googleapis.com') &&
      !url.includes('fonts.gstatic.com')) {
    return;
  }

  // Fuentes Google: intentar red, caché como fallback
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Peticiones de navegación (HTML): Network First
  // Crítico en iOS: Safari necesita la respuesta real del servidor
  // para la primera carga, no una copia en caché
  if (event.request.mode === 'navigate' ||
      event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets estáticos (imágenes, CSS, JS): Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Refrescar en background
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
      }).catch(() => undefined);
    })
  );
});
