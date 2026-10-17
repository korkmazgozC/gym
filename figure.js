// Hareket çizimi: insan oranlarında 2D yan görünüş figürü; pozlar arasında döngüyle oynatılır.
// Açılar derece ve dünya koordinatında: 0 = sağ, 90 = aşağı, 180 = sol, 270 (veya -90) = yukarı.
// Poz alanları: t gövde (kalçadan omuza), h baş eğimi (gövdeye göre), ua/fa yakın kol üst/alt, ua2/fa2 uzak kol,
// th/sh yakın uyluk/baldır, th2/sh2 uzak bacak, ft/ft2 ayak yönü, x kalça yatay konumu, rk raket açısı.
// hl: vurgulanan bölgeler ('core', 'legs', 'arms', 'back', 'glutes', 'shoulders').

const VB = { w: 220, h: 170, ground: 158 };
const L = { torso: 46, neck: 6, head: 9.5, ua: 25, fa: 23, th: 37, sh: 35, ft: 10, rk: 30 };
const rad = d => (d * Math.PI) / 180;
const at = (p, ang, len) => [p[0] + Math.cos(rad(ang)) * len, p[1] + Math.sin(rad(ang)) * len];
const f1 = n => n.toFixed(1);

function joints(p) {
  const hip = [p.x ?? 110, 0];
  const sh = at(hip, p.t, L.torso);
  const nk = at(sh, p.t + (p.h || 0), L.neck);
  const hd = at(nk, p.t + (p.h || 0), L.head + 1);
  const arm = (ua, fa) => { const e = at(sh, ua, L.ua); return [e, at(e, fa, L.fa)]; };
  const leg = (th, s, f) => { const k = at(hip, th, L.th); const a = at(k, s, L.sh); return [k, a, at(a, f ?? s - 90, L.ft)]; };
  const [el, ha] = arm(p.ua, p.fa), [el2, ha2] = arm(p.ua2 ?? p.ua, p.fa2 ?? p.fa);
  const [kn, an, to] = leg(p.th, p.sh, p.ft), [kn2, an2, to2] = leg(p.th2 ?? p.th, p.sh2 ?? p.sh, p.ft2 ?? p.ft);
  const j = { hip, sh, nk, hd, el, ha, el2, ha2, kn, an, to, kn2, an2, to2 };
  if (p.rk != null) { j.rs = at(ha, p.rk, 2); j.rn = at(ha, p.rk, 13); j.rc = at(ha, p.rk, 13 + 12); }
  return j;
}
// En alçak noktayı (kalınlıklarıyla) zemine oturt
function ground(j, gy = VB.ground) {
  const r = { hd: L.head, hip: 9, sh: 9, kn: 6, kn2: 6, an: 4, an2: 4, to: 3, to2: 3, ha: 3.5, ha2: 3.5, el: 4.5, el2: 4.5 };
  let low = -Infinity;
  for (const k in r) low = Math.max(low, j[k][1] + r[k]);
  const dy = gy - low;
  for (const k in j) j[k] = [j[k][0], j[k][1] + dy];
  return j;
}
// Uçlara doğru incelen uzuv (yuvarlak uçlu)
function limb(a, b, wa, wb, cls) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang), ny = Math.cos(ang);
  const P = (p, w, sg) => `${f1(p[0] + nx * w / 2 * sg)} ${f1(p[1] + ny * w / 2 * sg)}`;
  return `<path class="${cls}" d="M${P(a, wa, 1)} L${P(b, wb, 1)} L${P(b, wb, -1)} L${P(a, wa, -1)}Z"/>`
    + `<circle class="${cls}" cx="${f1(a[0])}" cy="${f1(a[1])}" r="${f1(wa / 2)}"/><circle class="${cls}" cx="${f1(b[0])}" cy="${f1(b[1])}" r="${f1(wb / 2)}"/>`;
}
// Gövde: kalçadan omuza; göğüs önde, bel ince, kalça geride
function torso(j, cls, faceSign) {
  const a = j.hip, b = j.sh, ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const u = [Math.cos(ang), Math.sin(ang)], n = [-u[1] * faceSign, u[0] * faceSign]; // n: ön (göğüs) yönü
  const P = (t, off) => [a[0] + u[0] * L.torso * t + n[0] * off, a[1] + u[1] * L.torso * t + n[1] * off];
  const pts = [P(-0.05, 8), P(0.35, 6.5), P(0.72, 10), P(1.02, 7), P(1.08, 0), P(1.02, -8), P(0.6, -7.5), P(0.3, -8), P(-0.02, -10), P(-0.12, 0)];
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 1; i <= pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i % pts.length];
    const m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    d += ` Q${f1(p0[0])} ${f1(p0[1])} ${f1(m[0])} ${f1(m[1])}`;
  }
  return `<path class="${cls}" d="${d}Z"/>`;
}
function draw(p, j) {
  const hl = new Set(p.hl || []);
  const c = (part, side) => `${side}${hl.has(part) ? ' hl' : ''}`;
  // Yüz yönü: figür sağa bakar; gövde sola uzanıyorsa (sırtüstü) göğüs yukarıdadır
  const face = p.face ?? 1;
  let s = '';
  // uzak taraf
  s += limb(j.hip, j.kn2, 14, 10, c('legs', 'far')) + limb(j.kn2, j.an2, 10, 6.5, c('legs', 'far')) + limb(j.an2, j.to2, 6, 4, 'far');
  s += limb(j.sh, j.el2, 9, 7, c('arms', 'far')) + limb(j.el2, j.ha2, 7, 5.5, c('arms', 'far'));
  // gövde, boyun, baş
  s += limb(j.sh, j.nk, 7, 6.5, 'near');
  s += torso(j, c('core', 'near'), face);
  if (hl.has('glutes')) s += `<circle class="near hl" cx="${f1(j.hip[0])}" cy="${f1(j.hip[1])}" r="8"/>`;
  if (hl.has('back')) s += limb(at(j.hip, p.t, 6), at(j.hip, p.t, L.torso - 6), 7, 7, 'near hl back');
  // ab: kollar bacağın arkasında çizilir (ör. Hundred'da el kalça hizasına denk gelince)
  const nearArm = () => limb(j.sh, j.el, 9.5, 7.5, c(hl.has('shoulders') ? 'shoulders' : 'arms', 'near')) + limb(j.el, j.ha, 7.5, 5.5, c('arms', 'near'))
    + (p.ab ? '' : `<circle class="near" cx="${f1(j.ha[0])}" cy="${f1(j.ha[1])}" r="3.4"/>`);
  if (p.ab) s += nearArm();
  s += `<circle class="near head" cx="${f1(j.hd[0])}" cy="${f1(j.hd[1])}" r="${L.head}"/>`;
  // yakın taraf
  s += limb(j.hip, j.kn, 14.5, 10.5, c('legs', 'near')) + limb(j.kn, j.an, 10.5, 6.5, c('legs', 'near')) + limb(j.an, j.to, 6, 4, 'near');
  if (j.rc) s += limb(j.rs, j.rn, 3, 3, 'racket') + `<ellipse class="racket-h" cx="${f1(j.rc[0])}" cy="${f1(j.rc[1])}" rx="12" ry="8.5" transform="rotate(${f1(p.rk)} ${f1(j.rc[0])} ${f1(j.rc[1])})"/>`;
  if (!p.ab) s += nearArm();
  return s;
}
const lerpAng = (a, b, t) => a + (((b - a + 540) % 360) - 180) * t;
function mix(a, b, t) {
  const o = { hl: a.hl || b.hl, face: a.face ?? b.face, ab: a.ab || b.ab };
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (k === 'hl' || k === 'face' || k === 'ab') continue;
    const va = a[k] ?? b[k], vb = b[k] ?? a[k];
    o[k] = k === 'x' ? va + (vb - va) * t : lerpAng(va, vb, t);
  }
  return o;
}
const ease = t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
function frameAt(move, now) {
  const poses = move.poses, n = poses.length;
  if (n === 1) return poses[0];
  const dur = (move.dur || 2.5) * 1000, hold = 0.2;
  // İleri-geri: 0 → 1 → … → n-1 → … → 0 (loop: true ise sadece ileri)
  const steps = move.loop ? n : (n - 1) * 2;
  const cyc = (now % (dur * steps)) / dur;
  let i = Math.floor(cyc), t = cyc - i, a, b;
  if (move.loop) { a = poses[i]; b = poses[(i + 1) % n]; } else if (i < n - 1) { a = poses[i]; b = poses[i + 1]; } else { i -= n - 1; a = poses[n - 1 - i]; b = poses[n - 2 - i]; }
  t = t < hold ? 0 : t > 1 - hold ? 1 : (t - hold) / (1 - 2 * hold);
  return mix(a, b, ease(t));
}

// Reformer: taşıyıcı yüzeyi zeminden yüksekte; ayak/el bara kilitlenir
const REF = { top: VB.ground - 11, barX: 198, barXHands: 26 };
const barX = move => (move.bar === 'hands' ? REF.barXHands : REF.barX);
function scene(move, pose, prop) {
  const reformer = prop === 'reformer';
  let j = ground(joints(pose), reformer ? REF.top : VB.ground);
  let extra = '';
  if (reformer) {
    if (move.bar) {
      // İlk pozdaki temas noktası barın tepesi; her karede figürü yatayda bara hizala
      const j0 = ground(joints(move.poses[0]), REF.top);
      const key = move.bar === 'hands' ? 'ha' : 'to';
      const dx = barX(move) - j[key][0];
      for (const k in j) j[k] = [j[k][0] + dx, j[k][1]];
      const top = j0[key][1] + (move.bar === 'hands' ? 4 : 3);
      const bx = barX(move);
      extra += `<path class="fig-bar" d="M${bx} ${VB.ground} L${bx} ${f1(top)}"/><circle class="fig-bar-c" cx="${bx}" cy="${f1(top)}" r="3.6"/>`;
    }
    // Taşıyıcı: kalçanın altında, omuz bloklarıyla
    const cx = move.bar === 'hands' ? Math.max(j.to[0], j.kn[0]) - 60 : Math.min(j.hip[0], j.sh[0], j.kn[0]) - 14, cw = 74;
    extra = `<rect class="fig-carriage" x="${f1(cx)}" y="${REF.top}" width="${cw}" height="7" rx="3"/>` + extra;
    if (move.box) extra += `<rect class="fig-box" x="${f1(j.hip[0] - 22)}" y="${f1(j.hip[1] + 7)}" width="44" height="${f1(REF.top - j.hip[1] - 7)}" rx="3"/>`;
  }
  return extra + draw(pose, j);
}

// Hareketin tüm karelerini kapsayan, sabit en-boy oranlı görüş alanı
const ASPECT = 1.3;
function viewBox(move, prop) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = VB.ground + 7;
  const P = move.poses, samples = [];
  for (let i = 0; i < P.length; i++) { samples.push(P[i]); if (i) samples.push(mix(P[i - 1], P[i], 0.5)); }
  for (const p of samples) {
    const j = scenePoints(move, p, prop);
    for (const k in j) { x0 = Math.min(x0, j[k][0] - 12); x1 = Math.max(x1, j[k][0] + 12); y0 = Math.min(y0, j[k][1] - 12); }
  }
  if (prop === 'reformer') { x0 = Math.min(x0, 10); x1 = Math.max(x1, 210); }
  let w = Math.max(x1 - x0, 120), h = y1 - y0;
  if (w / h < ASPECT) { const nw = h * ASPECT; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ASPECT; y0 -= nh - h; h = nh; }
  if (prop === 'reformer' || x1 - x0 > w) x0 = (x0 + x1) / 2 - w / 2;
  return `${f1(x0)} ${f1(y0)} ${f1(w)} ${f1(h)}`;
}
function scenePoints(move, pose, prop) {
  const reformer = prop === 'reformer';
  const j = ground(joints(pose), reformer ? REF.top : VB.ground);
  if (reformer && move.bar) { const key = move.bar === 'hands' ? 'ha' : 'to', dx = barX(move) - j[key][0]; for (const k in j) j[k] = [j[k][0] + dx, j[k][1]]; }
  if (j.rc) { j.rt = at(j.rc, pose.rk, 12); }
  return j;
}
function baseLayer(prop, vb) {
  const [x, , w] = vb.split(' ').map(Number);
  return prop === 'mat' ? `<rect class="fig-mat" x="${f1(Math.max(x + 6, 4))}" y="${VB.ground}" width="${f1(Math.min(w - 12, 212))}" height="5" rx="2.5"/>`
    : prop === 'reformer' ? `<rect class="fig-rail" x="12" y="${VB.ground - 4}" width="196" height="5" rx="2.5"/><rect class="fig-leg" x="18" y="${VB.ground}" width="6" height="7" rx="2"/><rect class="fig-leg" x="196" y="${VB.ground}" width="6" height="7" rx="2"/>`
      : `<line class="fig-floor" x1="${f1(x)}" y1="${VB.ground + 1}" x2="${f1(x + w)}" y2="${VB.ground + 1}"/>`;
}

export function mountFigure(el, move, { still = false } = {}) {
  const prop = move.prop || 'mat', vb = viewBox(move, prop);
  el.innerHTML = `<svg class="fig" viewBox="${vb}" role="img" aria-label="Hareket çizimi">${baseLayer(prop, vb)}<g class="fig-body"></g></svg>`;
  const g = el.querySelector('.fig-body');
  if (still || matchMedia('(prefers-reduced-motion: reduce)').matches) { g.innerHTML = scene(move, move.poses[move.poses.length - 1], prop); return () => {}; }
  let raf = 0, alive = true;
  const loop = now => { if (!alive) return; g.innerHTML = scene(move, frameAt(move, now), prop); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  return () => { alive = false; cancelAnimationFrame(raf); };
}
export function figureThumb(move, pose = move.poses[move.poses.length - 1]) {
  const prop = move.prop || 'mat', vb = viewBox(move, prop);
  return `<svg class="fig" viewBox="${vb}">${baseLayer(prop, vb)}<g class="fig-body">${scene(move, pose, prop)}</g></svg>`;
}
