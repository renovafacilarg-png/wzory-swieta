const CACHE_NAME = 'swk-hub-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './estilos.css',
  './app.js',
  './datos.js',
  './bonus.js',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];
const MAX_IMAGE_BYTES = 600 * 1024;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        CORE_ASSETS.map(url => cache.add(new Request(url, { cache: 'reload' })))
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

function isPdfRequest(url) {
  const path = url.pathname.toLowerCase();
  return path.endsWith('.pdf') || path.includes('/pdf/');
}

function isSmallImage(url) {
  const path = url.pathname.toLowerCase();
  return path.endsWith('-thumb.jpg') || path.includes('/icon-');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache PDFs
  if (isPdfRequest(url)) return;

  // Cache-first with background refresh for icons and small thumbnails
  if (isSmallImage(url)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const networkFetch = fetch(request).then(response => {
          if (response && response.ok) {
            const len = Number(response.headers.get('content-length') || 0);
            if (!len || len <= MAX_IMAGE_BYTES) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
          }
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // Network-first for HTML, CSS, JS, datos.js and other lightweight assets
  const path = url.pathname.toLowerCase();
  const isCoreOrDoc = request.mode === 'navigate' ||
    path.endsWith('/') ||
    path.endsWith('.html') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('.webmanifest');

  if (isCoreOrDoc) {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
  }
});
