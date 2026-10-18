// 3D hareket gösterimi: CC0 insan modeli (Quaternius) + figure.js pozları.
// 2D pozdaki her uzuv açısı (yan görünüş düzlemi) modelin ilgili kemiğine uygulanır; parmakla 360° döndürülebilir.
import * as THREE from './vendor/three/three.module.min.js';
import { GLTFLoader } from './vendor/three/GLTFLoader.js';
import { frameAt } from './figure.js';

const ACCENT = new THREE.Color('#d4f53c');
const BASE = new THREE.Color('#d9dbe0');
// Vurgu bölgeleri → kemikler
const HL_BONES = {
  core: ['spine_01', 'spine_02'], back: ['spine_02', 'spine_03'], legs: ['thigh_l', 'thigh_r', 'calf_l', 'calf_r'],
  glutes: ['pelvis', 'thigh_l', 'thigh_r'], arms: ['upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r'], shoulders: ['clavicle_l', 'clavicle_r', 'upperarm_l', 'upperarm_r'],
};
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
  const chain = { pelvis: 'neck_01', spine_02: 'neck_01', neck_01: 'Head', upperarm_l: 'lowerarm_l', lowerarm_l: 'hand_l', upperarm_r: 'lowerarm_r', lowerarm_r: 'hand_r',
    thigh_l: 'calf_l', calf_l: 'foot_l', foot_l: 'ball_l', thigh_r: 'calf_r', calf_r: 'foot_r', foot_r: 'ball_r', hand_r: 'middle_01_r', hand_l: 'middle_01_l' };
  for (const [b, c] of Object.entries(chain)) {
    rest[b] = { dir: wp(c).sub(wp(b)).normalize(), q: bones[b].getWorldQuaternion(new THREE.Quaternion()) };
  }
  return { root, bones, meshes, fwdSign, rightSign, rest, chain, restPelvis: bones.pelvis.position.clone() };
}
function paintHighlight(rig, groups) {
  const names = new Set((groups || []).flatMap(g => HL_BONES[g] || []));
  const glutesOnly = groups?.includes('glutes') && !groups.includes('legs');
  const pz = rig.bones.pelvis.getWorldPosition(new THREE.Vector3()), pos = new THREE.Vector3();
  for (const m of rig.meshes) {
    if (!m.visible || !m.isSkinnedMesh) continue;
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, P = g.attributes.position, n = si.count;
    const idx = new Set(m.skeleton.bones.map((b, i) => (names.has(b.name) ? i : -1)).filter(i => i >= 0));
    const col = new Float32Array(n * 3), c = new THREE.Color();
    for (let v = 0; v < n; v++) {
      pos.fromBufferAttribute(P, v).applyMatrix4(m.matrixWorld);
      const fwd = (pos.z - pz.z) * rig.fwdSign, dy = pos.y - pz.y;
      // Kasık bölgesi hiçbir zaman vurgulanmaz; kalçada yalnızca arka taraf boyanır
      const groin = Math.abs(pos.x - pz.x) < 0.16 && dy < 0.06 && dy > -0.26 && fwd > -0.03;
      let w = 0;
      if (!groin) for (let k = 0; k < 4; k++) if (idx.has(si.getComponent(v, k))) w += sw.getComponent(v, k);
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
function aimBone(rig, name, angle, prone = false) {
  const b = rig.bones[name], r = rig.rest[name];
  if (!b || !r || angle == null) return;
  const target = dir2(rig, angle);
  const world = _q.setFromUnitVectors(r.dir, target).multiply(r.q);
  if (prone) world.premultiply(_roll.setFromAxisAngle(target, Math.PI));
  b.parent.updateMatrixWorld(true);
  b.parent.getWorldQuaternion(_pq).invert();
  b.quaternion.copy(_pq.multiply(world));
  b.updateMatrixWorld(true);
}
// Dört ayak pozları: el ve diz aynı anda yere değsin diye gövde açısı ayarlanır (modelin kol/bacak oranı 2D'den farklı)
function applyPose(rig, p) {
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
  aimBone(rig, 'pelvis', p.t, pr);
  // ut: üst gövde açısı (sırt yerde, omuzlar kalkık gibi kıvrık omurga pozları)
  if (p.ut != null) aimBone(rig, 'spine_02', p.ut, pr);
  aimBone(rig, 'neck_01', (p.ut ?? p.t) + (p.h || 0) * (pr ? -1 : 1), pr);
  const side = (s, ua, fa, th, sh, ft) => {
    aimBone(rig, `upperarm_${s}`, ua, pr); aimBone(rig, `lowerarm_${s}`, fa, pr); aimBone(rig, `hand_${s}`, fa, pr);
    aimBone(rig, `thigh_${s}`, th, pr); aimBone(rig, `calf_${s}`, sh, pr); aimBone(rig, `foot_${s}`, ft ?? (pr ? sh + 90 : sh - 90), pr);
  };
  side('r', p.ua, p.fa, p.th, p.sh, p.ft);
  side('l', p.ua2 ?? p.ua, p.fa2 ?? p.fa, p.th2 ?? p.th, p.sh2 ?? p.sh, p.ft2 ?? p.ft);
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
  const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0x2b2d33, roughness: 0.5 }), str = new THREE.MeshStandardMaterial({ color: 0xd4f53c, roughness: 0.6, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
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
    const rim = new THREE.DirectionalLight(0xd4f53c, 0.9); rim.position.set(2, 2.5, -3); scene.add(rim);
    const pivot = new THREE.Group(); scene.add(pivot); pivot.add(rig.root);
    const reformer = move.prop === 'reformer' ? makeReformer() : null;
    if (reformer) pivot.add(reformer.g);
    const shadow = contactShadow(); if (!reformer) pivot.add(shadow);
    const mat = !reformer && move.prop !== 'floor' ? new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.012, 1.9), new THREE.MeshStandardMaterial({ color: 0x2a2b31, roughness: 0.9 })) : null;
    if (mat) { mat.position.y = -0.006; pivot.add(mat); }
    const racket = move.poses.some(p => p.rk != null) ? makeRacket() : null;
    if (racket) pivot.add(racket);
    const v = new THREE.Vector3(), v2 = new THREE.Vector3();
    // Reformer: vücut taşıyıcı yüksekliğine çıkar; bar varsa temas noktası (ayak ucu / el) z = 0'daki bara kilitlenir
    const contact = move.bar === 'hands' ? 'middle_01_r' : 'ball_r';
    const pose = p => {
      applyPose(rig, p);
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
    for (const p of move.poses) {
      pose(p); box.union(keyBounds(rig));
      if (reformer && move.bar && barY == null) barY = rig.bones[contact].getWorldPosition(v).y - (move.bar === 'hands' ? 0.03 : 0.04);
    }
    if (reformer) {
      box.expandByPoint(v.set(0, 0, box.min.z));
      const z0 = Math.min(box.min.z, move.bar ? -0.1 : box.min.z) - 0.15, z1 = Math.max(box.max.z, move.bar ? 0.1 : box.max.z) + 0.15;
      reformer.setFrame(z0, z1);
      if (move.bar) reformer.setBar(0, Math.max(barY, REF_TOP + 0.1)); else reformer.setBar(z0 + 0.05, REF_TOP + 0.25);
    }
    const ctr = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const span = Math.max(size.y, size.z, 0.9) * 1.25 + (racket ? 0.4 : 0);
    if (mat) { mat.position.z = ctr.z; mat.scale.z = Math.max(1, (size.z + 0.4) / 1.9); }
    const W = () => el.clientWidth || 300, H = () => el.clientHeight || 230;
    const camera = new THREE.PerspectiveCamera(28, W() / H(), 0.05, 50);
    const dist = span / (2 * Math.tan((28 * Math.PI) / 360)) * Math.max(1, (H() / W()) * 1.1);
    const target = new THREE.Vector3(0, ctr.y, ctr.z);
    let yaw = 0, pitch = 0.12, vel = 0, dragging = false, lastX = 0, lastY = 0;
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
    cv.addEventListener('dblclick', () => { yaw = 0; pitch = 0.12; vel = 0; });
    const ro = new ResizeObserver(() => { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); });
    ro.observe(el);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = now => {
      if (!alive) return;
      const p = still ? move.poses[move.poses.length - 1] : frameAt(move, now);
      pose(p);
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
