// 3D hareket gösterimi: CC0 insan modeli (Quaternius) + figure.js pozları.
// 2D pozdaki her uzuv açısı (yan görünüş düzlemi) modelin ilgili kemiğine uygulanır; parmakla 360° döndürülebilir.
import * as THREE from './vendor/three/three.module.min.js';
import { GLTFLoader } from './vendor/three/GLTFLoader.js';
import { frameAt } from './figure.js';

const ACCENT = new THREE.Color('#b38cff');
const BASE = new THREE.Color('#d9dbe0');
// Vurgu bölgeleri → kemikler
const HL_BONES = {
  core: ['spine_01', 'spine_02'], back: ['spine_02', 'spine_03'], legs: ['thigh_l', 'thigh_r', 'calf_l', 'calf_r'],
  glutes: ['pelvis', 'thigh_l', 'thigh_r'], arms: ['upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r'], shoulders: ['clavicle_l', 'clavicle_r', 'upperarm_l', 'upperarm_r'],
  chest: ['spine_03', 'clavicle_l', 'clavicle_r'], lats: ['spine_02', 'spine_03'], traps: ['clavicle_l', 'clavicle_r', 'neck_01', 'spine_03'],
  biceps: ['upperarm_l', 'upperarm_r'], triceps: ['upperarm_l', 'upperarm_r'], forearms: ['lowerarm_l', 'lowerarm_r', 'hand_l', 'hand_r'],
  quads: ['thigh_l', 'thigh_r'], hams: ['thigh_l', 'thigh_r'], calves: ['calf_l', 'calf_r'], delts: ['clavicle_l', 'clavicle_r', 'upperarm_l', 'upperarm_r'],
};
// Yalnızca ön (f) ya da arka (b) yüzü boyanan gruplar; y: pelvise göre yükseklik sınırı
const HL_SIDE = { chest: ['f', 0.28], lats: ['b'], traps: ['b', 0.38], biceps: ['f'], triceps: ['b'], quads: ['f'], hams: ['b'], calves: ['b'], core: ['f'] };
let normalTex = null;
const loader = new GLTFLoader();

function setup(gltf) {
  const root = gltf.scene;
  const bones = {};
  root.traverse(o => { if (o.isBone) bones[o.name] = o; });
  const meshes = [];
  root.traverse(o => { if (o.isSkinnedMesh || o.isMesh) meshes.push(o); });
  normalTex ||= new THREE.TextureLoader().load('models/athlete_normal.jpg');
  for (const m of meshes) {
    // Saç ve gözler gizlenir; vücut tek renk "heykel" malzemesiyle çizilir
    if (m.name.startsWith('Face')) { m.visible = false; continue; }
    m.frustumCulled = false;
    m.castShadow = false;
    m.material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0.04, normalMap: normalTex, vertexColors: true });
    m.material.normalScale.set(0.9, 0.9);
  }
  root.updateMatrixWorld(true);
  // Model ekseni: ileri (ayak ucu yönü) ve sağ taraf
  const wp = n => bones[n].getWorldPosition(new THREE.Vector3());
  const fwdSign = Math.sign(wp('ball_r').z - wp('foot_r').z) || 1;
  const rightSign = Math.sign(wp('thigh_r').x) || -1;
  // Dinlenme pozunda kemik yönleri ve dünya dönüşleri
  const rest = {};
  const chain = { clavicle_l: 'upperarm_l', clavicle_r: 'upperarm_r', pelvis: 'neck_01', spine_02: 'neck_01', neck_01: 'Head', upperarm_l: 'lowerarm_l', lowerarm_l: 'hand_l', upperarm_r: 'lowerarm_r', lowerarm_r: 'hand_r',
    thigh_l: 'calf_l', calf_l: 'foot_l', foot_l: 'ball_l', thigh_r: 'calf_r', calf_r: 'foot_r', foot_r: 'ball_r', hand_r: 'middle_01_r', hand_l: 'middle_01_l' };
  for (const [b, c] of Object.entries(chain)) {
    rest[b] = { dir: wp(c).sub(wp(b)).normalize(), q: bones[b].getWorldQuaternion(new THREE.Quaternion()) };
  }
  const restLocal = { clavicle_l: bones.clavicle_l.quaternion.clone(), clavicle_r: bones.clavicle_r.quaternion.clone() };
  return { root, bones, meshes, fwdSign, rightSign, rest, chain, restLocal, restPelvis: bones.pelvis.position.clone() };
}
function paintHighlight(rig, groups) {
  const gs = (groups || []).filter(g => HL_BONES[g]);
  const glutesOnly = groups?.includes('glutes') && !groups.includes('legs');
  const pz = rig.bones.pelvis.getWorldPosition(new THREE.Vector3()), pos = new THREE.Vector3();
  for (const m of rig.meshes) {
    if (!m.visible || !m.isSkinnedMesh) continue;
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, P = g.attributes.position, n = si.count;
    const sets = gs.map(k => ({ idx: new Set(m.skeleton.bones.map((b, i) => (HL_BONES[k].includes(b.name) ? i : -1)).filter(i => i >= 0)), side: HL_SIDE[k] }));
    const col = new Float32Array(n * 3), c = new THREE.Color();
    for (let v = 0; v < n; v++) {
      pos.fromBufferAttribute(P, v).applyMatrix4(m.matrixWorld);
      const fwd = (pos.z - pz.z) * rig.fwdSign, dy = pos.y - pz.y;
      // Kasık bölgesi hiçbir zaman vurgulanmaz; kalçada yalnızca arka taraf boyanır
      const groin = Math.abs(pos.x - pz.x) < 0.16 && dy < 0.06 && dy > -0.26 && fwd > -0.03;
      let w = 0;
      if (!groin) for (const st of sets) {
        if (st.side) {
          const [f, y] = st.side;
          if ((f === 'f' && fwd < -0.01) || (f === 'b' && fwd > 0.01) || (y && dy < y)) continue;
        }
        let ww = 0;
        for (let k = 0; k < 4; k++) if (st.idx.has(si.getComponent(v, k))) ww += sw.getComponent(v, k);
        w = Math.max(w, ww);
      }
      if (glutesOnly && fwd > -0.02) w = 0;
      if (glutesOnly && dy < -0.3) w = 0;
      c.copy(BASE).lerp(ACCENT, Math.min(1, w * 1.15));
      col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }
}
// 2D açı (0 ileri, 90 aşağı, 180 geri, -90 yukarı) → model uzayında yön
const dir2 = (rig, a) => new THREE.Vector3(0, -Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180) * rig.fwdSign);
const _q = new THREE.Quaternion(), _pq = new THREE.Quaternion();
const _roll = new THREE.Quaternion();
// prone: yüzüstü pozlarda kemik kendi ekseni etrafında 180° çevrilir (yüz, diz ve dirsek doğru yöne baksın)
function aimBone(rig, name, angle, prone = false, side = 0, out = 1) {
  const b = rig.bones[name], r = rig.rest[name];
  if (!b || !r || angle == null) return;
  const target = dir2(rig, angle);
  if (side) {
    const k = (side * Math.PI) / 180;
    target.multiplyScalar(Math.cos(k)).add(new THREE.Vector3(out * rig.rightSign * Math.sin(k), 0, 0)).normalize();
  }
  const world = _q.setFromUnitVectors(r.dir, target).multiply(r.q);
  if (prone) world.premultiply(_roll.setFromAxisAngle(target, Math.PI));
  b.parent.updateMatrixWorld(true);
  b.parent.getWorldQuaternion(_pq).invert();
  b.quaternion.copy(_pq.multiply(world));
  b.updateMatrixWorld(true);
}
// Dört ayak pozları: el ve diz aynı anda yere değsin diye gövde açısı ayarlanır (modelin kol/bacak oranı 2D'den farklı)
function applyPose(rig, p) {
  if (p.plank) {
    // Şınav/plank: eller (ya da dirsekler) ve ayak uçları aynı anda yere değsin diye gövde eğimi bulunur
    const v = new THREE.Vector3(), [bn, r] = p.plank === 'elbows' ? ['lowerarm_r', 0.045] : ['middle_01_r', 0.03];
    const gap = t => { applyPose1(rig, { ...p, t }); return (rig.bones[bn].getWorldPosition(v).y - r) - (Math.min(rig.bones.ball_leaf_r.getWorldPosition(new THREE.Vector3()).y, rig.bones.ball_leaf_l.getWorldPosition(new THREE.Vector3()).y) - 0.02); };
    let lo = 150, hi = 240;
    const up = gap(hi) > gap(lo);
    for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if ((gap(mid) > 0) === up) hi = mid; else lo = mid; }
    return applyPose1(rig, { ...p, t: (lo + hi) / 2 });
  }
  if (!p.kneel) return applyPose1(rig, p);
  const v = new THREE.Vector3();
  const gap = t => { applyPose1(rig, { ...p, t }); return (rig.bones.hand_r.getWorldPosition(v).y - 0.035) - (rig.bones.calf_r.getWorldPosition(new THREE.Vector3()).y - 0.06); };
  let lo = 170, hi = 240;
  for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if (gap(mid) < 0) lo = mid; else hi = mid; }
  applyPose1(rig, { ...p, t: (lo + hi) / 2 });
}
// Pozu uygula; yakın taraf (kameraya bakan) modelin sağ uzuvları
function applyPose1(rig, p) {
  rig.root.position.set(0, 0, 0);
  rig.bones.pelvis.position.copy(rig.restPelvis);
  const pr = p.face === -1;
  aimBone(rig, 'pelvis', p.t, pr, p.ts || 0, pr ? -1 : 1);
  for (const k in rig.restLocal) rig.bones[k].quaternion.copy(rig.restLocal[k]);
  if (p.shrug) for (const [s, o] of [['r', 1], ['l', -1]]) {
    const r = rig.rest[`clavicle_${s}`], b = rig.bones[`clavicle_${s}`];
    b.parent.updateMatrixWorld(true);
    const ax = new THREE.Vector3().crossVectors(r.dir, new THREE.Vector3(0, 1, 0)).normalize();
    const w = new THREE.Quaternion().setFromAxisAngle(ax, (p.shrug * Math.PI) / 180).multiply(b.parent.getWorldQuaternion(new THREE.Quaternion()).multiply(b.quaternion.clone()));
    b.quaternion.copy(b.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(w));
    b.updateMatrixWorld(true);
  }
  // ut: üst gövde açısı (sırt yerde, omuzlar kalkık gibi kıvrık omurga pozları)
  if (p.ut != null) aimBone(rig, 'spine_02', p.ut, pr);
  aimBone(rig, 'neck_01', (p.ut ?? p.t) + (p.h || 0) * (pr ? -1 : 1), pr);
  // uas/fas: kolun yana açılma açısı (0 = yan görünüş düzleminde, 90 = tam yana); ths/shs: bacak için
  const side = (s, o, ua, fa, th, sh, ft, uas, fas, ths, shs) => {
    if (pr) o = -o;
    aimBone(rig, `upperarm_${s}`, ua, pr, uas, o); aimBone(rig, `lowerarm_${s}`, fa, pr, fas, o); aimBone(rig, `hand_${s}`, p.wr ?? fa, pr, fas, o);
    aimBone(rig, `thigh_${s}`, th, pr, ths, o); aimBone(rig, `calf_${s}`, sh, pr, shs, o); aimBone(rig, `foot_${s}`, ft ?? (pr ? sh + 90 : sh - 90), pr, shs, o);
  };
  const uas = p.uas || 0, fas = p.fas ?? uas, ths = p.ths || 0, shs = p.shs ?? ths;
  side('r', 1, p.ua, p.fa, p.th, p.sh, p.ft, uas, fas, ths, shs);
  side('l', -1, p.ua2 ?? p.ua, p.fa2 ?? p.fa, p.th2 ?? p.th, p.sh2 ?? p.sh, p.ft2 ?? p.ft, p.uas2 ?? uas, p.fas2 ?? p.uas2 ?? fas, p.ths2 ?? ths, p.shs2 ?? p.ths2 ?? shs);
  rig.root.updateMatrixWorld(true);
  // Zemine oturt: en alçak temas noktası y = 0
  const pts = [['ball_leaf_l', 0.02], ['ball_leaf_r', 0.02], ['foot_l', 0.06], ['foot_r', 0.06], ['middle_04_leaf_l', 0.015], ['middle_04_leaf_r', 0.015],
    ['Head', 0.12], ['pelvis', 0.11], ['spine_03', 0.13], ['calf_l', 0.06], ['calf_r', 0.06], ['lowerarm_l', 0.045], ['lowerarm_r', 0.045], ['hand_l', 0.035], ['hand_r', 0.035]];
  let low = Infinity;
  const v = new THREE.Vector3();
  for (const [n, r] of pts) { const b = rig.bones[n]; if (b) low = Math.min(low, b.getWorldPosition(v).y - r); }
  rig.root.position.y = -low;
  rig.root.updateMatrixWorld(true);
}
function keyBounds(rig) {
  const box = new THREE.Box3(), v = new THREE.Vector3();
  for (const n of ['Head', 'ball_leaf_l', 'ball_leaf_r', 'middle_04_leaf_l', 'middle_04_leaf_r', 'pelvis', 'calf_l', 'calf_r']) box.expandByPoint(rig.bones[n].getWorldPosition(v));
  return box;
}
function makeRacket() {
  const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0x2b2d33, roughness: 0.5 }), str = new THREE.MeshStandardMaterial({ color: 0xb38cff, roughness: 0.6, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.3, 12), mat); handle.position.y = 0.15; g.add(handle);
  const head = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 32), mat); head.scale.set(0.82, 1.05, 1); head.position.y = 0.42; g.add(head);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.125, 32), str); face.scale.set(0.82, 1.05, 1); face.position.y = 0.42; g.add(face);
  return g;
}
function contactShadow() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ═══ Salon ekipmanı: halter, dambıl, sehpa, kablo, barlar, makine parçaları
const M = {
  steel: () => new THREE.MeshStandardMaterial({ color: 0xb9bcc6, roughness: 0.28, metalness: 0.85 }),
  dark: () => new THREE.MeshStandardMaterial({ color: 0x23242e, roughness: 0.55, metalness: 0.3 }),
  pad: () => new THREE.MeshStandardMaterial({ color: 0x3a3450, roughness: 0.8 }),
  plate: () => new THREE.MeshStandardMaterial({ color: 0x15161d, roughness: 0.5, metalness: 0.25 }),
  accent: () => new THREE.MeshStandardMaterial({ color: 0x8f6bff, roughness: 0.45, metalness: 0.2 }),
};
const cyl = (r, h, m, seg = 20) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m);
const boxm = (x, y, z, m) => new THREE.Mesh(new THREE.BoxGeometry(x, y, z), m);
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);
// Silindiri iki nokta arasına yerleştir
function span(mesh, a, b) {
  const d = new THREE.Vector3().subVectors(b, a), L = d.length() || 1e-4;
  mesh.position.copy(a).addScaledVector(d, 0.5);
  mesh.quaternion.setFromUnitVectors(Y, d.divideScalar(L));
  mesh.scale.set(1, L, 1);
}
function makeBarbell(kind) {
  const g = new THREE.Group(), st = M.steel(), pl = M.plate();
  const bar = cyl(0.014, kind === 'ez' ? 1.25 : 1.9, st); bar.rotation.z = Math.PI / 2; g.add(bar);
  const big = kind === 'ez' ? 0.13 : 0.2;
  for (const sx of [-1, 1]) {
    for (const [o, r, t] of [[0.62, big, 0.045], [0.67, big * 0.82, 0.035]]) {
      const x = (kind === 'ez' ? 0.52 : 0.68) + (o - 0.62);
      const d = cyl(r, t, pl, 32); d.rotation.z = Math.PI / 2; d.position.x = sx * x; g.add(d);
    }
    const c = cyl(0.03, 0.04, st); c.rotation.z = Math.PI / 2; c.position.x = sx * (kind === 'ez' ? 0.47 : 0.62); g.add(c);
  }
  return g;
}
function makeDumbbell() {
  const g = new THREE.Group(), st = M.steel(), pl = M.plate();
  const h = cyl(0.016, 0.16, st); h.rotation.z = Math.PI / 2; g.add(h);
  for (const sx of [-1, 1]) { const w = cyl(0.058, 0.07, pl, 6); w.rotation.z = Math.PI / 2; w.position.x = sx * 0.11; g.add(w); }
  return g;
}
function makeGym(move, rig) {
  const fig = move, g = new THREE.Group(), parts = [];
  const v = new THREE.Vector3(), v2 = new THREE.Vector3();
  const P = n => rig.bones[n].getWorldPosition(new THREE.Vector3());
  const grip = s => P(`hand_${s}`).lerp(P(`middle_01_${s}`), 0.55);
  const fwd = new THREE.Vector3(0, 0, rig.fwdSign);
  // Ekipman ellerde: her karede ellerin konumuna taşınır
  const eq = fig.eq;
  if (eq === 'barbell' || eq === 'ez' || eq === 'smith') {
    const b = makeBarbell(eq); g.add(b);
    parts.push(() => { b.position.copy(grip('l')).add(grip('r')).multiplyScalar(0.5); });
  } else if (eq === 'dumbbell' || eq === 'dumbbell1') {
    for (const s of eq === 'dumbbell1' ? ['r'] : ['l', 'r']) { const d = makeDumbbell(); g.add(d); parts.push(() => d.position.copy(grip(s))); }
  } else if (eq === 'kettlebell') {
    const k = new THREE.Group(), pl = M.plate();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 16), pl); ball.position.y = -0.1; k.add(ball);
    const hd = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 20, Math.PI), M.steel()); hd.position.y = -0.02; k.add(hd);
    g.add(k); parts.push(() => k.position.copy(grip('l')).add(grip('r')).multiplyScalar(0.5));
  } else if (eq === 'ball' || eq === 'plate' || eq === 'wheel') {
    const m = eq === 'ball' ? new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), M.accent())
      : eq === 'plate' ? cyl(0.22, 0.035, M.plate(), 32) : cyl(0.09, 0.06, M.dark(), 28);
    if (eq === 'plate') m.rotation.x = Math.PI / 2; else if (eq === 'wheel') m.rotation.z = Math.PI / 2;
    g.add(m);
    parts.push(() => { m.position.copy(grip('l')).add(grip('r')).multiplyScalar(0.5); if (eq === 'ball') m.position.addScaledVector(fwd, 0.08); if (eq === 'wheel') m.position.y -= 0.05; });
  } else if (eq === 'latbar' || eq === 'handle') {
    const m = cyl(0.014, 1, M.steel()); g.add(m);
    const L = eq === 'latbar' ? 1.25 : 0;
    parts.push(() => {
      const a = grip('l'), b = grip('r');
      if (L) { const c = a.clone().add(b).multiplyScalar(0.5); a.copy(c).addScaledVector(X, -L / 2); b.copy(c).addScaledVector(X, L / 2); }
      else { a.addScaledVector(X, -0.05 * Math.sign(b.x - a.x)); b.addScaledVector(X, 0.05 * Math.sign(b.x - a.x)); }
      span(m, a, b);
    });
  } else if (eq === 'dbmid') {
    const d = makeDumbbell(); d.rotation.z = Math.PI / 2; g.add(d);
    parts.push(() => d.position.copy(grip('l')).add(grip('r')).multiplyScalar(0.5));
  } else if (eq === 'plates2') {
    for (const s of ['l', 'r']) { const m = cyl(0.16, 0.03, M.plate(), 28); m.rotation.z = Math.PI / 2; g.add(m); parts.push(() => { m.position.copy(grip(s)); m.position.y -= 0.1; }); }
  } else if (eq === 'band' || eq === 'rope') {
    const m = cyl(eq === 'band' ? 0.008 : 0.012, 1, eq === 'band' ? M.accent() : M.dark()); g.add(m);
    parts.push(() => span(m, grip('l'), grip('r')));
  }
  // Kablo: makaradan ellerin ortasına uzanan tel + kule
  if (fig.cable) {
    const c = fig.cable;
    const sides = c.split ? [['l', -1], ['r', 1]] : [[null, 0]];
    for (const [s, sx] of sides) {
      const a = new THREE.Vector3(0, c.y, 0), line = cyl(0.005, 1, M.steel(), 8), tower = boxm(0.14, 2.25, 0.14, M.dark());
      tower.userData.nb = line.userData.nb = true;
      const pul = cyl(0.045, 0.03, M.steel(), 20); pul.rotation.z = Math.PI / 2;
      g.add(line, tower, pul);
      parts.push(first => {
        if (first) {
          a.z = P('pelvis').z + rig.fwdSign * (c.z ?? 0.6);
          a.x = s ? sx * rig.rightSign * (c.w ?? 0.9) : (c.x ?? 0) * rig.rightSign;
          const back = c.z ? Math.sign(c.z) : (a.x ? 0 : -1);
          const tz = c.tz ?? 0.1;
          tower.position.set(a.x + (back ? 0 : Math.sign(a.x) * 0.1), 1.125, a.z + rig.fwdSign * tz * back); pul.position.copy(a);
          if (c.tz) { const beam = boxm(0.06, 0.06, Math.abs(tz) + 0.05, M.dark()); beam.userData.nb = true; beam.position.set(a.x, c.y + 0.06, a.z + rig.fwdSign * tz * back / 2); g.add(beam); }
        }
        const h = s ? grip(s === 'l' ? 'l' : 'r') : eq ? grip('l').add(grip('r')).multiplyScalar(0.5) : grip('r');
        span(line, a, h);
      });
    }
  }
  // Sehpa / makine oturağı: ilk pozdan bir kez hesaplanır
  const once = [];
  if (fig.bench) once.push(() => {
    const pel = P('pelvis'), nk = P('neck_01'), b = fig.bench;
    if (b.back) {
      const d = new THREE.Vector3().subVectors(nk, pel), L = d.length(), dir = d.clone().normalize();
      const back = new THREE.Vector3().crossVectors(dir, X).multiplyScalar(rig.fwdSign); // gövdenin arkası
      if (back.dot(new THREE.Vector3(0, -1, 0)) < 0 && Math.abs(dir.y) > 0.9) back.negate();
      const pad = boxm(0.3, 0.07, L + (b.long ?? 0.3), M.pad());
      pad.position.copy(pel).addScaledVector(d, 0.5).addScaledVector(dir, (b.shift ?? 0)).addScaledVector(back, b.off ?? 0.15);
      pad.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
      g.add(pad);
      // Ayaklar: pedin uçlarından yere
      for (const t of [-0.42, 0.42]) {
        const e = pad.position.clone().addScaledVector(dir, t * (L + 0.3));
        const leg = cyl(0.025, 1, M.dark(), 10); span(leg, new THREE.Vector3(e.x, 0, e.z), new THREE.Vector3(e.x, e.y - 0.035, e.z)); g.add(leg);
      }
    }
    if (b.seat) {
      const top = pel.y - 0.1, seat = boxm(0.34, 0.07, 0.36, M.pad());
      seat.position.set(0, top - 0.035, pel.z - rig.fwdSign * (b.seatBack ?? 0.02)); g.add(seat);
      const post = cyl(0.03, 1, M.dark(), 10); span(post, new THREE.Vector3(0, 0, seat.position.z), new THREE.Vector3(0, top - 0.07, seat.position.z)); g.add(post);
      const foot = boxm(0.4, 0.03, 0.4, M.dark()); foot.position.set(0, 0.015, seat.position.z); g.add(foot);
    }
  });
  // Barfiks / paralel bar: ellerin ilk konumuna sabit
  if (fig.bars) once.push(() => {
    const l = grip('l'), r = grip('r'), y = (l.y + r.y) / 2, z = (l.z + r.z) / 2;
    if (fig.bars === 'pullup') {
      const bar = cyl(0.016, 1.3, M.steel()); bar.rotation.z = Math.PI / 2; bar.position.set(0, y + 0.01, z); g.add(bar);
      for (const sx of [-0.65, 0.65]) { const p2 = cyl(0.03, 1, M.dark(), 12); span(p2, new THREE.Vector3(sx, 0, z), new THREE.Vector3(sx, y + 0.05, z)); g.add(p2); }
    } else {
      for (const x of [l.x, r.x]) {
        const bar = cyl(0.02, 0.7, M.steel()); bar.rotation.x = Math.PI / 2; bar.position.set(x + Math.sign(x) * 0.02, y - 0.02, z); g.add(bar);
        for (const dz of [-0.3, 0.3]) { const p2 = cyl(0.025, 1, M.dark(), 10); span(p2, new THREE.Vector3(x + Math.sign(x) * 0.02, 0, z + dz), new THREE.Vector3(x + Math.sign(x) * 0.02, y - 0.02, z + dz)); g.add(p2); }
      }
    }
  });
  // Smith makinesi rayları
  if (eq === 'smith') once.push(() => {
    const z = (grip('l').z + grip('r').z) / 2;
    for (const sx of [-0.8, 0.8]) { const r2 = cyl(0.025, 2.2, M.steel(), 12); r2.position.set(sx, 1.1, z); g.add(r2); }
  });
  // Basamak / kutu
  if (fig.box) once.push(() => {
    const b = fig.box;
    let h = b.h, z = P('pelvis').z + rig.fwdSign * (b.z || 0);
    if (b.auto) {
      const q = b.auto === 'hands' ? grip('l').add(grip('r')).multiplyScalar(0.5) : b.auto === 'rear' ? P('ball_l') : P('ball_r').add(P('ball_l')).multiplyScalar(0.5);
      h = q.y - (b.auto === 'hands' ? 0.03 : 0.03); z = q.z;
    }
    const bx = boxm(b.w ?? 0.5, h, b.d ?? 0.4, M.pad());
    bx.position.set(0, h / 2, z); g.add(bx);
  });
  // Bacak presi ayak plakası, makine silindir minderi
  if (fig.footplate) {
    const fp = boxm(0.62, 0.5, 0.03, M.dark()); g.add(fp);
    parts.push(() => {
      const f = P('foot_r').lerp(P('ball_r'), 0.5), dir = f.clone().sub(P('thigh_r')).normalize();
      fp.position.copy(f).addScaledVector(dir, 0.05); fp.position.x = 0;
      fp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    });
  }
  if (fig.roller) {
    const r = cyl(0.055, 0.42, M.pad(), 20); r.rotation.z = Math.PI / 2; g.add(r);
    parts.push((first, p) => {
      const a = fig.roller === 'thigh' ? P('thigh_r').lerp(P('calf_r'), 0.85) : P('calf_r').lerp(P('foot_r'), 0.85);
      const ang = fig.roller === 'thigh' ? p.th : p.sh, pr = p.face === -1;
      const n = dir2(rig, ang + ((fig.rollerSide ?? 'front') === 'front' ? -90 : 90) * (pr ? -1 : 1));
      r.position.copy(a).addScaledVector(n, 0.085); r.position.x = 0;
    });
  }
  return {
    g,
    init() { once.forEach(f => f()); parts.forEach(f => f(true, move.poses[0])); },
    update(p) { parts.forEach(f => f(false, p)); },
  };
}

// Reformer aleti: zemin çerçevesi, kayan taşıyıcı, ayak/el barı ve isteğe bağlı kutu
const REF_TOP = 0.34;
function makeReformer() {
  const g = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x34353c, roughness: 0.6, metalness: 0.2 });
  const pad = new THREE.MeshStandardMaterial({ color: 0x4c4d57, roughness: 0.85 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9a9ba4, roughness: 0.3, metalness: 0.7 });
  const frame = new THREE.Group(); g.add(frame);
  const rails = [new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.1, 1), dark)];
  rails[0].position.set(0, 0.23, 0); frame.add(rails[0]);
  const legs = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.06), dark); l.position.set(sx * 0.31, 0.09, 0); frame.add(l); legs.push([l, sz]); }
  const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.8), pad); g.add(carriage);
  const bar = new THREE.Group(); g.add(bar);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.6, 12), steel); rod.rotation.z = Math.PI / 2; bar.add(rod);
  const posts = [-1, 1].map(sx => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1, 10), steel); m.position.x = sx * 0.28; bar.add(m); return m; });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), pad); box.visible = false; g.add(box);
  return {
    g, carriage, box,
    setFrame(z0, z1) {
      frame.position.z = (z0 + z1) / 2;
      rails.forEach(r => { r.scale.z = z1 - z0; });
      legs.forEach(([l, sz]) => { l.position.z = sz * ((z1 - z0) / 2 - 0.05); });
    },
    setBar(z, y) { bar.position.set(0, y, z); posts.forEach(m => { m.scale.y = y - 0.22; m.position.y = -(y - 0.22) / 2; }); },
  };
}

// WebGL yoksa veya model yüklenemezse onFail çağrılır (uygulama 2D çizime döner).
// Hemen bir durdurma fonksiyonu döner; yükleme arka planda sürer.
export function mountFigure3D(el, move, { onFail } = {}) {
  let alive = true, raf = 0, cleanup = () => {};
  el.innerHTML = '<div class="f3d-load"><span class="spinner"></span></div>';
  start().catch(e => { console.warn('3D', e); if (alive) onFail?.(e); });
  return () => { alive = false; cancelAnimationFrame(raf); cleanup(); };

  async function start() {
    // d3: yalnızca 3D'ye özel poz düzeltmeleri (modelin oranları 2D çizimden farklı)
    move = { ...move, poses: move.poses.map(({ d3, ...p }) => ({ ...p, ...d3 })) };
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl'))) throw new Error('WebGL yok');
    const gltf = await loader.loadAsync('models/athlete.gltf');
    if (!alive) return;
    const rig = setup(gltf);
    paintHighlight(rig, move.poses[0].hl);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x30323a, 1.25));
    const key = new THREE.DirectionalLight(0xffffff, 2.1); key.position.set(-2, 4, 3); scene.add(key);
    const rim = new THREE.DirectionalLight(0xa070ff, 1.1); rim.position.set(2, 2.5, -3); scene.add(rim);
    const pivot = new THREE.Group(); scene.add(pivot); pivot.add(rig.root);
    const reformer = move.prop === 'reformer' ? makeReformer() : null;
    if (reformer) pivot.add(reformer.g);
    const shadow = contactShadow(); if (!reformer) pivot.add(shadow);
    const gymScene = move.prop === 'gym';
    const mat = !reformer && !gymScene && move.prop !== 'floor' ? new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.012, 1.9), new THREE.MeshStandardMaterial({ color: 0x2a2b31, roughness: 0.9 })) : null;
    if (mat) { mat.position.y = -0.006; pivot.add(mat); }
    const racket = move.poses.some(p => p.rk != null) ? makeRacket() : null;
    if (racket) pivot.add(racket);
    if (gymScene) { const fl = boxm(1.7, 0.02, 2.4, new THREE.MeshStandardMaterial({ color: 0x1b1c27, roughness: 0.95 })); fl.position.y = -0.01; pivot.add(fl); }
    const v = new THREE.Vector3(), v2 = new THREE.Vector3();
    // Reformer: vücut taşıyıcı yüksekliğine çıkar; bar varsa temas noktası (ayak ucu / el) z = 0'daki bara kilitlenir
    const contact = move.bar === 'hands' ? 'middle_01_r' : 'ball_r';
    let hangAt = null, gym = null;
    const pose = p => {
      applyPose(rig, p);
      if (p.lift || p.dz) { rig.root.position.y += p.lift || 0; rig.root.position.z += (p.dz || 0) * rig.fwdSign; rig.root.updateMatrixWorld(true); }
      if (move.pin) { rig.root.position.y += move.pin.y - rig.bones[move.pin.bone].getWorldPosition(v).y; rig.root.updateMatrixWorld(true); }
      if (move.seat != null) {
        // Sehpaya yatma / oturma: sırt ya da kalça verilen yüksekliğe oturur
        const sup = Math.min(rig.bones.pelvis.getWorldPosition(v).y - 0.11, move.lying ? rig.bones.spine_03.getWorldPosition(v2).y - 0.13 : Infinity);
        rig.root.position.y += move.seat - sup; rig.root.updateMatrixWorld(true);
      }
      if (move.hang) {
        // Barfiks / paralel bar: eller ilk pozdaki yerde sabit kalır
        const h = rig.bones.hand_r.getWorldPosition(v).add(rig.bones.hand_l.getWorldPosition(v2)).multiplyScalar(0.5);
        if (!hangAt) { rig.root.position.y += move.lift || 0; rig.root.updateMatrixWorld(true); hangAt = h.clone().add(new THREE.Vector3(0, move.lift || 0, 0)); }
        else { rig.root.position.add(hangAt.clone().sub(h)); rig.root.updateMatrixWorld(true); }
      }
      if (!reformer) return;
      rig.root.position.y += REF_TOP;
      rig.root.updateMatrixWorld(true);
      if (move.bar) { rig.root.position.z -= rig.bones[contact].getWorldPosition(v).z; rig.root.updateMatrixWorld(true); }
      const pz = rig.bones.pelvis.getWorldPosition(v).z, nz = rig.bones.neck_01.getWorldPosition(v2).z;
      // El barda ise taşıyıcı ayakların altındadır (long stretch, elephant…)
      const fz = rig.bones.ball_r.getWorldPosition(v2).z;
      reformer.carriage.position.set(0, REF_TOP - 0.04, move.bar === 'hands' ? fz + Math.sign(pz - fz) * 0.3 : (pz + nz) / 2);
      if (move.box) {
        const top = rig.bones.pelvis.getWorldPosition(v).y - 0.1;
        reformer.box.visible = top > REF_TOP + 0.05;
        reformer.box.scale.y = Math.max(0.01, top - REF_TOP); reformer.box.position.set(0, (top + REF_TOP) / 2, v.z);
      }
    };
    // Kamera: tüm pozları kapsayacak şekilde, modelin sağ yanından
    const box = new THREE.Box3();
    let barY = null;
    if (gymScene || move.eq || move.bench || move.cable) {
      gym = makeGym(move, rig); pivot.add(gym.g);
      pose(move.poses[0]); gym.init();
    }
    for (const p of move.poses) {
      pose(p); box.union(keyBounds(rig));
      if (gym) { gym.update(p); gym.g.traverse(o => { if (o.isMesh && !o.userData.nb) box.union(new THREE.Box3().setFromObject(o)); }); }
      if (reformer && move.bar && barY == null) barY = rig.bones[contact].getWorldPosition(v).y - (move.bar === 'hands' ? 0.03 : 0.04);
    }
    if (reformer) {
      box.expandByPoint(v.set(0, 0, box.min.z));
      const z0 = Math.min(box.min.z, move.bar ? -0.1 : box.min.z) - 0.15, z1 = Math.max(box.max.z, move.bar ? 0.1 : box.max.z) + 0.15;
      reformer.setFrame(z0, z1);
      if (move.bar) reformer.setBar(0, Math.max(barY, REF_TOP + 0.1)); else reformer.setBar(z0 + 0.05, REF_TOP + 0.25);
    }
    const ctr = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const horiz = gymScene ? size.z * Math.cos(move.yaw ?? 0.62) + size.x * Math.sin(move.yaw ?? 0.62) * 0.8 : size.z;
    const span = Math.max(size.y, horiz, 0.9) * (gymScene ? 1.12 : 1.25) + (racket ? 0.4 : 0);
    if (mat) { mat.position.z = ctr.z; mat.scale.z = Math.max(1, (size.z + 0.4) / 1.9); }
    const W = () => el.clientWidth || 300, H = () => el.clientHeight || 230;
    const camera = new THREE.PerspectiveCamera(28, W() / H(), 0.05, 50);
    const dist = span / (2 * Math.tan((28 * Math.PI) / 360)) * Math.max(1, (H() / W()) * 1.1);
    const target = new THREE.Vector3(0, ctr.y, ctr.z);
    const yaw0 = gymScene ? (move.yaw ?? 0.62) : 0, pitch0 = gymScene ? 0.16 : 0.12;
    let yaw = yaw0, pitch = pitch0, vel = 0, dragging = false, lastX = 0, lastY = 0;
    const placeCam = () => {
      const base = new THREE.Vector3(rig.rightSign, 0, 0);
      const d = base.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      camera.position.copy(target).add(d.multiplyScalar(dist * Math.cos(pitch))).add(new THREE.Vector3(0, dist * Math.sin(pitch), 0));
      camera.lookAt(target);
    };
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.innerHTML = '';
    el.appendChild(renderer.domElement);
    renderer.domElement.className = 'f3d-canvas';
    const hint = document.createElement('div'); hint.className = 'f3d-hint'; hint.textContent = '360° döndürmek için kaydır';
    el.appendChild(hint);
    // Parmakla döndürme
    const cv = renderer.domElement;
    cv.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; vel = 0; cv.setPointerCapture(e.pointerId); hint.remove(); });
    cv.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      vel = dx * 0.012; yaw -= vel; pitch = Math.max(-0.2, Math.min(0.9, pitch + dy * 0.006));
    });
    const end = () => { dragging = false; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('dblclick', () => { yaw = yaw0; pitch = pitch0; vel = 0; });
    const ro = new ResizeObserver(() => { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); });
    ro.observe(el);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = now => {
      if (!alive) return;
      const p = still ? move.poses[move.poses.length - 1] : frameAt(move, now);
      pose(p);
      gym?.update(p);
      shadow.position.set(0, 0.002, rig.bones.pelvis.getWorldPosition(v).z);
      const s = rig.bones.Head.getWorldPosition(v).y > 1.2 ? 0.75 : 1.6; shadow.scale.set(0.7, 1, s);
      if (racket && p.rk != null) {
        racket.position.copy(rig.bones.hand_r.getWorldPosition(v));
        racket.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir2(rig, p.rk));
        racket.visible = true;
      }
      if (!dragging && Math.abs(vel) > 0.0005) { yaw -= vel; vel *= 0.94; }
      placeCam();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    cleanup = () => {
      ro.disconnect();
      scene.traverse(o => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach(m => m.dispose()); });
      renderer.dispose(); renderer.forceContextLoss?.();
    };
  }
}
