// Tam çevrimdışı çalışma.
//  - Uygulama dosyaları, fotoğraflar ve video kapakları ilk açılışta önbelleğe alınır.
//  - Videolar (vid/*.mp4) uygulama içinden "İnternetsiz kullanım için indir" ile ayrı önbelleğe (gym-media-*) kaydedilir.
// Dosyaları değiştirdiğinde VERSION'u artır ki telefondaki eski sürüm yenilensin.
const VERSION = 'gymtakip-v7';
const MEDIA = 'gym-media-v1';
const SHELL = [
  './', './index.html', './styles.css', './app.js', './exercises.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];
const IMAGES = ["./img/ab-machine-0.jpg","./img/ab-machine-1.jpg","./img/ab-roller-0.jpg","./img/ab-roller-1.jpg","./img/alt-curl-0.jpg","./img/alt-curl-1.jpg","./img/arnold-press-0.jpg","./img/arnold-press-1.jpg","./img/barbell-curl-0.jpg","./img/barbell-curl-1.jpg","./img/barbell-shrug-0.jpg","./img/barbell-shrug-1.jpg","./img/bb-row-0.jpg","./img/bb-row-1.jpg","./img/bench-0.jpg","./img/bench-1.jpg","./img/bench-dips-0.jpg","./img/bench-dips-1.jpg","./img/biceps-curl-0.jpg","./img/biceps-curl-1.jpg","./img/bicycle-crunch-0.jpg","./img/bicycle-crunch-1.jpg","./img/bodyweight-squat-0.jpg","./img/bodyweight-squat-1.jpg","./img/box-squat-0.jpg","./img/box-squat-1.jpg","./img/bulgarian-0.jpg","./img/bulgarian-1.jpg","./img/cable-crossover-0.jpg","./img/cable-crossover-1.jpg","./img/cable-crunch-0.jpg","./img/cable-crunch-1.jpg","./img/cable-curl-0.jpg","./img/cable-curl-1.jpg","./img/cable-lateral-0.jpg","./img/cable-lateral-1.jpg","./img/cable-oh-ext-0.jpg","./img/cable-oh-ext-1.jpg","./img/calf-raise-0.jpg","./img/calf-raise-1.jpg","./img/chest-press-0.jpg","./img/chest-press-1.jpg","./img/chinup-0.jpg","./img/chinup-1.jpg","./img/close-grip-bench-0.jpg","./img/close-grip-bench-1.jpg","./img/close-grip-pulldown-0.jpg","./img/close-grip-pulldown-1.jpg","./img/close-pushup-0.jpg","./img/close-pushup-1.jpg","./img/concentration-curl-0.jpg","./img/concentration-curl-1.jpg","./img/crunch-0.jpg","./img/crunch-1.jpg","./img/db-bench-0.jpg","./img/db-bench-1.jpg","./img/db-bent-row-0.jpg","./img/db-bent-row-1.jpg","./img/db-fly-0.jpg","./img/db-fly-1.jpg","./img/db-row-0.jpg","./img/db-row-1.jpg","./img/db-shoulder-press-0.jpg","./img/db-shoulder-press-1.jpg","./img/db-upright-row-0.jpg","./img/db-upright-row-1.jpg","./img/dead-bug-0.jpg","./img/dead-bug-1.jpg","./img/deadlift-0.jpg","./img/deadlift-1.jpg","./img/decline-bench-0.jpg","./img/decline-bench-1.jpg","./img/decline-crunch-0.jpg","./img/decline-crunch-1.jpg","./img/decline-pushup-0.jpg","./img/decline-pushup-1.jpg","./img/dips-0.jpg","./img/dips-1.jpg","./img/dips-triceps-0.jpg","./img/dips-triceps-1.jpg","./img/ez-curl-0.jpg","./img/ez-curl-1.jpg","./img/face-pull-0.jpg","./img/face-pull-1.jpg","./img/front-raise-0.jpg","./img/front-raise-1.jpg","./img/front-squat-0.jpg","./img/front-squat-1.jpg","./img/glute-bridge-0.jpg","./img/glute-bridge-1.jpg","./img/glute-kickback-0.jpg","./img/glute-kickback-1.jpg","./img/goblet-squat-0.jpg","./img/goblet-squat-1.jpg","./img/good-morning-0.jpg","./img/good-morning-1.jpg","./img/hack-squat-0.jpg","./img/hack-squat-1.jpg","./img/hammer-curl-0.jpg","./img/hammer-curl-1.jpg","./img/hanging-leg-raise-0.jpg","./img/hanging-leg-raise-1.jpg","./img/hip-thrust-0.jpg","./img/hip-thrust-1.jpg","./img/hyperextension-0.jpg","./img/hyperextension-1.jpg","./img/incline-bench-0.jpg","./img/incline-bench-1.jpg","./img/incline-curl-0.jpg","./img/incline-curl-1.jpg","./img/incline-db-0.jpg","./img/incline-db-1.jpg","./img/incline-fly-0.jpg","./img/incline-fly-1.jpg","./img/incline-pushup-0.jpg","./img/incline-pushup-1.jpg","./img/inverted-row-0.jpg","./img/inverted-row-1.jpg","./img/kb-swing-0.jpg","./img/kb-swing-1.jpg","./img/kickback-0.jpg","./img/kickback-1.jpg","./img/knee-raise-0.jpg","./img/knee-raise-1.jpg","./img/lat-pulldown-0.jpg","./img/lat-pulldown-1.jpg","./img/lateral-raise-0.jpg","./img/lateral-raise-1.jpg","./img/leg-curl-0.jpg","./img/leg-curl-1.jpg","./img/leg-ext-0.jpg","./img/leg-ext-1.jpg","./img/leg-press-0.jpg","./img/leg-press-1.jpg","./img/leg-raise-0.jpg","./img/leg-raise-1.jpg","./img/low-cable-crossover-0.jpg","./img/low-cable-crossover-1.jpg","./img/lunge-0.jpg","./img/lunge-1.jpg","./img/lying-db-ext-0.jpg","./img/lying-db-ext-1.jpg","./img/machine-bench-0.jpg","./img/machine-bench-1.jpg","./img/machine-shoulder-press-0.jpg","./img/machine-shoulder-press-1.jpg","./img/mountain-climber-0.jpg","./img/mountain-climber-1.jpg","./img/oblique-crunch-0.jpg","./img/oblique-crunch-1.jpg","./img/ohp-0.jpg","./img/ohp-1.jpg","./img/pec-deck-0.jpg","./img/pec-deck-1.jpg","./img/plank-0.jpg","./img/plank-1.jpg","./img/plate-raise-0.jpg","./img/plate-raise-1.jpg","./img/preacher-curl-0.jpg","./img/preacher-curl-1.jpg","./img/pullover-0.jpg","./img/pullover-1.jpg","./img/pullup-0.jpg","./img/pullup-1.jpg","./img/push-press-0.jpg","./img/push-press-1.jpg","./img/pushup-0.jpg","./img/pushup-1.jpg","./img/rack-pull-0.jpg","./img/rack-pull-1.jpg","./img/rdl-0.jpg","./img/rdl-1.jpg","./img/rear-delt-machine-0.jpg","./img/rear-delt-machine-1.jpg","./img/rear-lunge-0.jpg","./img/rear-lunge-1.jpg","./img/reverse-crunch-0.jpg","./img/reverse-crunch-1.jpg","./img/reverse-curl-0.jpg","./img/reverse-curl-1.jpg","./img/reverse-fly-0.jpg","./img/reverse-fly-1.jpg","./img/rope-pushdown-0.jpg","./img/rope-pushdown-1.jpg","./img/russian-twist-0.jpg","./img/russian-twist-1.jpg","./img/seated-bb-press-0.jpg","./img/seated-bb-press-1.jpg","./img/seated-calf-0.jpg","./img/seated-calf-1.jpg","./img/seated-leg-curl-0.jpg","./img/seated-leg-curl-1.jpg","./img/seated-row-0.jpg","./img/seated-row-1.jpg","./img/shrug-0.jpg","./img/shrug-1.jpg","./img/side-bend-0.jpg","./img/side-bend-1.jpg","./img/side-plank-0.jpg","./img/side-plank-1.jpg","./img/single-leg-bridge-0.jpg","./img/single-leg-bridge-1.jpg","./img/sit-up-0.jpg","./img/sit-up-1.jpg","./img/skull-crusher-0.jpg","./img/skull-crusher-1.jpg","./img/sldl-db-0.jpg","./img/sldl-db-1.jpg","./img/squat-0.jpg","./img/squat-1.jpg","./img/step-up-0.jpg","./img/step-up-1.jpg","./img/straight-arm-pd-0.jpg","./img/straight-arm-pd-1.jpg","./img/sumo-dl-0.jpg","./img/sumo-dl-1.jpg","./img/tbar-row-0.jpg","./img/tbar-row-1.jpg","./img/triceps-oh-0.jpg","./img/triceps-oh-1.jpg","./img/triceps-pushdown-0.jpg","./img/triceps-pushdown-1.jpg","./img/upright-row-0.jpg","./img/upright-row-1.jpg","./img/vbar-pulldown-0.jpg","./img/vbar-pulldown-1.jpg","./img/walking-lunge-0.jpg","./img/walking-lunge-1.jpg","./img/wide-pushup-0.jpg","./img/wide-pushup-1.jpg","./img/wrist-curl-0.jpg","./img/wrist-curl-1.jpg","./vid/assisted-pullup-0.jpg","./vid/barbell-curl-0.jpg","./vid/barbell-shrug-0.jpg","./vid/bench-0.jpg","./vid/bench-1.jpg","./vid/bench-2.jpg","./vid/biceps-curl-0.jpg","./vid/cable-curl-0.jpg","./vid/cable-hammer-0.jpg","./vid/calf-raise-0.jpg","./vid/calf-raise-1.jpg","./vid/db-bench-0.jpg","./vid/db-bench-1.jpg","./vid/db-bench-2.jpg","./vid/db-shoulder-press-0.jpg","./vid/dips-0.jpg","./vid/dips-1.jpg","./vid/dips-2.jpg","./vid/face-pull-0.jpg","./vid/face-pull-1.jpg","./vid/front-squat-0.jpg","./vid/front-squat-1.jpg","./vid/front-squat-2.jpg","./vid/hack-squat-0.jpg","./vid/hack-squat-1.jpg","./vid/hammer-curl-0.jpg","./vid/hip-adduction-0.jpg","./vid/hip-thrust-0.jpg","./vid/hip-thrust-1.jpg","./vid/incline-bench-0.jpg","./vid/incline-db-0.jpg","./vid/kickback-0.jpg","./vid/kickback-1.jpg","./vid/kickback-2.jpg","./vid/lateral-raise-0.jpg","./vid/leg-curl-0.jpg","./vid/leg-curl-1.jpg","./vid/leg-press-0.jpg","./vid/leg-press-1.jpg","./vid/leg-press-2.jpg","./vid/lunge-0.jpg","./vid/lunge-1.jpg","./vid/lunge-2.jpg","./vid/lying-db-ext-0.jpg","./vid/machine-shoulder-press-0.jpg","./vid/one-arm-cable-row-0.jpg","./vid/preacher-curl-0.jpg","./vid/preacher-curl-1.jpg","./vid/preacher-curl-2.jpg","./vid/pullup-0.jpg","./vid/rdl-0.jpg","./vid/rdl-1.jpg","./vid/rdl-2.jpg","./vid/reverse-fly-0.jpg","./vid/reverse-fly-1.jpg","./vid/reverse-fly-2.jpg","./vid/seated-calf-0.jpg","./vid/seated-leg-curl-0.jpg","./vid/seated-row-0.jpg","./vid/shrug-0.jpg","./vid/skull-crusher-0.jpg","./vid/skull-crusher-1.jpg","./vid/skull-crusher-2.jpg","./vid/smith-squat-0.jpg","./vid/standing-leg-curl-0.jpg","./vid/standing-leg-curl-1.jpg","./vid/triceps-oh-0.jpg","./vid/triceps-pushdown-0.jpg","./vid/triceps-pushdown-1.jpg","./vid/triceps-pushdown-2.jpg","./vid/walking-lunge-0.jpg","./vid/walking-lunge-1.jpg"];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    const olds = (await caches.keys()).filter(k => k !== VERSION && !k.startsWith('gym-media'));
    for (let i = 0; i < IMAGES.length; i += 12) {
      await Promise.all(IMAGES.slice(i, i + 12).map(async u => {
        for (const k of olds) {
          const hit = await (await caches.open(k)).match(u);
          if (hit) return c.put(u, hit);
        }
        for (let t = 0; t < 3; t++) {
          try { const r = await fetch(u); if (r.ok) return c.put(u, r); } catch { /* tekrar dene */ }
        }
      }));
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION && !k.startsWith('gym-media')) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('.mp4')) {
    // Videolar sayfa tarafından yönetilir (blob); burada yalnızca önbellekte varsa oradan ver.
    e.respondWith(caches.open(MEDIA).then(c => c.match(req, { ignoreSearch: true })).then(hit => hit || fetch(req)));
    return;
  }
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit && (url.pathname.includes('/img/') || url.pathname.includes('/vid/'))) return hit; // görseller değişmez
    // Uygulama dosyaları: önce internet (en güncel sürüm), 4 sn içinde cevap yoksa veya internet yoksa önbellek
    const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; });
    net.catch(() => {});
    const timeout = new Promise(r => setTimeout(() => r(null), 4000));
    try {
      const res = await Promise.race([net, timeout]);
      if (res) return res;
    } catch { /* çevrimdışı */ }
    return hit || (await cache.match('./index.html')) || net;
  })());
});
