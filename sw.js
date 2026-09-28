// Çevrimdışı çalışma: uygulama dosyaları ve Three.js önbelleğe alınır.
// Dosyaları değiştirdiğinde VERSION'u artır ki telefondaki eski sürüm yenilensin.
const VERSION = 'gymtakip-v1';
const SHELL = [
  './', './index.html', './styles.css', './app.js', './exercises.js', './viewer3d.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];
const CDN = [
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    await Promise.all(CDN.map(u => c.add(new Request(u, { mode: 'cors' })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // CDN: önce önbellek
  if (url.origin !== location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) caches.open(VERSION).then(c => c.put(req, res.clone()));
      return res;
    })));
    return;
  }

  // Uygulama dosyaları: önbellekten hemen ver, arkada güncelle
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || (await cache.match('./index.html'));
  })());
});
