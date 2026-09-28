import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const D = Math.PI / 180;
const SIDES = [['sh', 'shL', 'shR'], ['el', 'elL', 'elR'], ['hip', 'hipL', 'hipR'], ['kn', 'knL', 'knR'], ['an', 'anL', 'anR']];
const DEF = { sh: [0, 0, 6], el: [-6, 0, 0], hip: [0, 0, 0], kn: [0, 0, 0] };
const JOINTS = ['spine', 'chest', 'neck', 'shL', 'shR', 'elL', 'elR', 'hipL', 'hipR', 'knL', 'knR', 'anL', 'anR'];

const pad = v => [v[0] || 0, v[1] || 0, v[2] || 0];
const mirror = v => [v[0], -v[1], -v[2]];

// Kısa poz yazımını tüm eklemler için tam açı listesine çevirir.
export function expandPose(p) {
  const rot = pad(p.rot || []);
  const o = { pos: pad(p.pos || [0, 1, 0]), rot, spine: pad(p.spine || []), chest: pad(p.chest || []), neck: pad(p.neck || []) };
  for (const [k, L, R] of SIDES) {
    const base = p[k] || DEF[k] || null;
    const l = p[L] || base, r = p[R] || base;
    o[L] = l ? pad(l) : null;
    o[R] = r ? mirror(pad(r)) : null;
  }
  // Bilek verilmezse ayak tabanı yere paralel kalsın.
  for (const s of ['L', 'R']) {
    if (!o['an' + s]) o['an' + s] = [-rot[0] - o['hip' + s][0] - o['kn' + s][0], 0, 0];
  }
  return o;
}

function lerpPose(a, b, t) {
  const o = {};
  for (const k in a) o[k] = a[k].map((v, i) => v + (b[k][i] - v) * t);
  return o;
}

function samplePose(frames, u) {
  if (frames.length === 1) return frames[0];
  // 0 → 1 → 0 yumuşak gidip-gelme
  const s = (0.5 - 0.5 * Math.cos(u * Math.PI * 2)) * (frames.length - 1);
  const i = Math.min(Math.floor(s), frames.length - 2);
  const f = s - i;
  return lerpPose(frames[i], frames[i + 1], f * f * (3 - 2 * f));
}

// ───────────────────────── Manken
class Rig {
  constructor(mats) {
    this.mats = mats;
    this.parts = {};
    this.j = {};
    this.m = {};
    const root = this.root = new THREE.Group();

    const part = (name, mesh) => { (this.parts[name] ||= []).push(mesh); mesh.castShadow = true; return mesh; };
    const cap = (r, len, mat = mats.body) => new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), mat);
    const joint = (name, parent, x, y, z, order = 'XYZ') => {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.order = order; parent.add(g); this.j[name] = g; return g;
    };
    const marker = (name, parent, x, y, z, off = 0) => {
      const o = new THREE.Object3D(); o.position.set(x, y, z); o.userData.off = off; parent.add(o); this.m[name] = o; return o;
    };

    // Pelvis / kalça
    const pelvis = part('glutes', cap(0.12, 0.12));
    pelvis.rotation.z = Math.PI / 2; pelvis.scale.set(1, 1, 0.9); pelvis.position.y = 0.01;
    root.add(pelvis);

    // Gövde
    const spine = joint('spine', root, 0, 0.06, 0);
    const abs = part('abs', cap(0.115, 0.1));
    abs.position.set(0, 0.1, 0.005); abs.scale.set(1.05, 1, 0.8); spine.add(abs);
    const chest = joint('chest', spine, 0, 0.2, 0);
    const chestM = part('chest', cap(0.14, 0.12));
    chestM.position.set(0, 0.15, 0.018); chestM.scale.set(1.3, 1, 0.72); chest.add(chestM);
    const back = part('back', cap(0.145, 0.1));
    back.position.set(0, 0.13, -0.03); back.scale.set(1.32, 1, 0.66); chest.add(back);

    // Boyun + baş
    const neck = joint('neck', chest, 0, 0.31, 0);
    const neckM = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.1, 12), mats.body);
    neckM.position.y = 0.04; neckM.castShadow = true; neck.add(neckM);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 18), mats.body);
    head.position.y = 0.16; head.scale.set(0.95, 1.15, 1); head.castShadow = true; neck.add(head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.035, 0.03), mats.dark);
    visor.position.set(0, 0.18, 0.088); neck.add(visor);

    // Kollar
    for (const [s, sx] of [['L', 1], ['R', -1]]) {
      const sh = joint('sh' + s, chest, 0.2 * sx, 0.26, 0, 'XZY');
      const delt = part('shoulder', new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 12), mats.body));
      sh.add(delt);
      const ua = part('upperArm', cap(0.05, 0.2)); ua.position.y = -0.15; sh.add(ua);
      const el = joint('el' + s, sh, 0, -0.3, 0);
      const fa = part('forearm', cap(0.042, 0.19)); fa.position.y = -0.135; el.add(fa);
      const hand = new THREE.Group(); hand.position.y = -0.27; el.add(hand); this['hand' + s] = hand;
      const hm = new THREE.Mesh(new THREE.SphereGeometry(0.043, 14, 10), mats.body);
      hm.position.y = -0.035; hm.scale.set(0.9, 1.2, 0.75); hm.castShadow = true; hand.add(hm);
      marker('grip' + s, hand, 0, -0.045, 0, 0.045);
      marker('elbow' + s, el, 0, 0, 0, 0.05);
    }

    // Bacaklar
    for (const [s, sx] of [['L', 1], ['R', -1]]) {
      const hip = joint('hip' + s, root, 0.1 * sx, -0.02, 0, 'XZY');
      const th = part('thigh', cap(0.075, 0.3)); th.position.y = -0.225; hip.add(th);
      const kn = joint('kn' + s, hip, 0, -0.45, 0);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), mats.body); knee.castShadow = true; kn.add(knee);
      const shin = part('shin', cap(0.055, 0.32)); shin.position.y = -0.22; kn.add(shin);
      const an = joint('an' + s, kn, 0, -0.45, 0);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.22), mats.dark);
      foot.position.set(0, -0.035, 0.05); foot.castShadow = true; an.add(foot);
      marker('heel' + s, an, 0, -0.065, -0.05);
      marker('toe' + s, an, 0, -0.065, 0.15);
    }
  }

  apply(p) {
    this.root.position.set(p.pos[0], p.pos[1], p.pos[2]);
    this.root.rotation.set(p.rot[0] * D, p.rot[1] * D, p.rot[2] * D);
    for (const k of JOINTS) {
      const v = p[k];
      this.j[k].rotation.set(v[0] * D, v[1] * D, v[2] * D);
    }
  }

  highlight(list = []) {
    for (const [name, meshes] of Object.entries(this.parts)) {
      const mat = list.includes(name) ? this.mats.hi : this.mats.body;
      for (const m of meshes) m.material = mat;
    }
  }
}

// ───────────────────────── Ekipman
function makeDumbbell(mats) {
  const g = new THREE.Group();
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 10), mats.steel);
  h.rotation.z = Math.PI / 2; g.add(h);
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 8), mats.iron);
    w.rotation.z = Math.PI / 2; w.position.x = s * 0.11; w.castShadow = true; g.add(w);
  }
  return g;
}

function makeBar(mats, len, plates) {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 12), mats.steel);
  bar.rotation.z = Math.PI / 2; bar.castShadow = true; g.add(bar);
  if (plates) {
    for (const s of [-1, 1]) {
      for (const [x, r, w] of [[0.66, 0.225, 0.05], [0.72, 0.19, 0.045]]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 28), mats.plate);
        p.rotation.z = Math.PI / 2; p.position.x = s * x; p.castShadow = true; g.add(p);
      }
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), mats.steel);
      c.rotation.z = Math.PI / 2; c.position.x = s * 0.61; g.add(c);
    }
  }
  return g;
}

// ───────────────────────── Görüntüleyici
export class Viewer {
  constructor(el) {
    this.el = el;
    this.playing = true;
    this.speed = 1;
    this.t = 0;
    this.extras = [];
    this.tmp = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(r.domElement);

    const scene = this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50);
    this.camera.position.set(2.3, 1.5, 2.7);
    this.controls = new OrbitControls(this.camera, r.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 7;
    this.controls.maxPolarAngle = Math.PI * 0.52;

    scene.add(new THREE.HemisphereLight(0xdde6ff, 0x1a1c22, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(2.5, 5, 3);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -2.5, right: 2.5, top: 3, bottom: -2.5, near: 0.5, far: 15 });
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.8);
    rim.position.set(-3, 2, -3);
    scene.add(rim);

    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), new THREE.MeshStandardMaterial({ color: 0x1b1e25, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(6, 24, 0x2c313c, 0x252a33);
    grid.position.y = 0.002; scene.add(grid);

    const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...o });
    this.mats = {
      body: std(0xa9b3c1, { roughness: 0.45 }),
      hi: std(0xff6a3d, { emissive: 0x5a1800, roughness: 0.4 }),
      dark: std(0x2a2f3a),
      steel: std(0xc9ced6, { metalness: 0.85, roughness: 0.3 }),
      iron: std(0x30343c, { metalness: 0.4, roughness: 0.5 }),
      plate: std(0x1d2027, { roughness: 0.7 }),
      pad: std(0x3b2530, { roughness: 0.8 }),
      frame: std(0x4a505c, { metalness: 0.6, roughness: 0.4 }),
      mat: std(0x2f4a5c, { roughness: 1 }),
      cable: std(0x111111),
    };

    this.rig = new Rig(this.mats);
    scene.add(this.rig.root);

    this.clock = new THREE.Clock();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.resize();
    r.setAnimationLoop(() => this.tick());
  }

  resize() {
    const w = this.el.clientWidth, h = this.el.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    // Dikey ekranlarda yatay görüş açısını koru ki manken kadraja sığsın.
    this.camera.fov = Math.max(38, (2 * Math.atan(Math.tan(26 * D) / this.camera.aspect)) / D);
    this.camera.updateProjectionMatrix();
  }

  setExercise(ex) {
    for (const o of this.extras) o.parent?.remove(o);
    this.extras = [];
    this.ex = ex;
    this.frames = ex.frames.map(expandPose);
    this.t = 0;
    this.rig.highlight(ex.muscles);
    this.buildEquip(ex.equip);
    for (const p of ex.props || []) this.addProp(p);
    this.resetView();
    this.update(0);
  }

  resetView() {
    const ex = this.ex;
    this.camera.position.set(...(ex.cam || [2.3, 1.5, 2.7]));
    this.controls.target.set(...(ex.look || [0, 0.9, 0]));
    this.controls.update();
  }

  add(o, parent = this.scene) { parent.add(o); this.extras.push(o); return o; }

  buildEquip(eq) {
    this.bar = this.cable = this.dbc = null;
    if (!eq) return;
    const { mats, rig } = this;
    if (eq.kind === 'barbell') this.bar = this.add(makeBar(mats, 1.9, true));
    if (eq.kind === 'cable') {
      this.bar = this.add(makeBar(mats, 1.15, false));
      this.cable = this.add(new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1, 6), mats.cable));
      this.cableTo = new THREE.Vector3(...eq.to);
    }
    if (eq.kind === 'dumbbell') {
      for (const s of ['L', 'R']) {
        const d = makeDumbbell(mats);
        d.position.y = -0.045;
        if (eq.axis === 'z') d.rotation.y = Math.PI / 2;
        this.add(d, rig['hand' + s]);
      }
    }
    if (eq.kind === 'dbCenter') this.dbc = this.add(makeDumbbell(mats));
    if (eq.kind === 'legPad') {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 16), mats.pad);
      p.rotation.z = Math.PI / 2; p.position.set(-0.1, 0.0, 0.1); p.castShadow = true;
      this.add(p, rig.j.anL);
    }
  }

  addProp(p) {
    const mat = this.mats[p.color || (p.type === 'bar' ? 'steel' : 'pad')];
    if (p.type === 'bar') {
      const a = new THREE.Vector3(...p.from), b = new THREE.Vector3(...p.to);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r, a.distanceTo(b), 12), mat);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      m.castShadow = true;
      this.add(m);
      return;
    }
    const m = new THREE.Mesh(new THREE.BoxGeometry(...p.size), mat);
    m.castShadow = m.receiveShadow = true;
    if (p.type === 'rootBox') {
      // Kök (kalça) koordinatlarında tanımlı; ilk karedeki vücut duruşuna göre yerleştirilir.
      const f = this.frames[0];
      const e = new THREE.Euler(f.rot[0] * D, f.rot[1] * D, f.rot[2] * D);
      m.position.set(...p.at).applyEuler(e).add(new THREE.Vector3(...f.pos));
      m.rotation.copy(e);
    } else {
      m.position.set(...p.pos);
      if (p.rot) m.rotation.set(p.rot[0] * D, p.rot[1] * D, p.rot[2] * D);
    }
    this.add(m);
    if (p.post) {
      const h = Math.max(0.05, m.position.y - 0.03);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.06), this.mats.frame);
      post.position.set(m.position.x, h / 2, m.position.z);
      post.castShadow = true;
      this.add(post);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.36), this.mats.frame);
      base.position.set(m.position.x, 0.015, m.position.z);
      this.add(base);
    }
  }

  wp(name, i) {
    const m = this.rig.m[name];
    const v = m.getWorldPosition(this.tmp[i]);
    v.y -= m.userData.off;
    return v;
  }

  update(u) {
    const { rig, ex } = this;
    rig.apply(samplePose(this.frames, u));
    rig.root.updateMatrixWorld(true);

    if (ex.anchor === 'feet' || ex.anchor === 'ground') {
      const names = ['heelL', 'heelR', 'toeL', 'toeR'];
      if (ex.anchor === 'ground') names.push('gripL', 'gripR', 'elbowL', 'elbowR');
      let minY = Infinity;
      for (const n of names) minY = Math.min(minY, this.wp(n, 0).y);
      const toeZ = (this.wp('toeL', 0).z + this.wp('toeR', 1).z) / 2;
      rig.root.position.y -= minY;
      rig.root.position.z += (ex.anchorZ || 0) - toeZ;
    } else if (ex.anchor === 'hands') {
      const a = this.rig.m.gripL.getWorldPosition(this.tmp[0]);
      const b = this.rig.m.gripR.getWorldPosition(this.tmp[1]);
      const mid = a.add(b).multiplyScalar(0.5);
      rig.root.position.add(new THREE.Vector3(...ex.anchorAt).sub(mid));
    }
    rig.root.updateMatrixWorld(true);

    if (this.bar) {
      const a = rig.m.gripL.getWorldPosition(this.tmp[0]);
      const b = rig.m.gripR.getWorldPosition(this.tmp[1]);
      this.bar.position.copy(a).add(b).multiplyScalar(0.5);
      this.bar.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), a.sub(b).normalize());
      if (this.cable) {
        const from = this.bar.position, to = this.cableTo;
        this.cable.position.copy(from).add(to).multiplyScalar(0.5);
        this.cable.scale.y = from.distanceTo(to);
        this.cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.tmp[2].copy(to).sub(from).normalize());
      }
    }
    if (this.dbc) {
      const g = rig.m.gripL.getWorldPosition(this.tmp[0]).add(rig.m.gripR.getWorldPosition(this.tmp[1])).multiplyScalar(0.5);
      const e = rig.m.elbowL.getWorldPosition(this.tmp[2]).add(rig.m.elbowR.getWorldPosition(this.tmp[3])).multiplyScalar(0.5);
      this.dbc.position.copy(g);
      this.dbc.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), g.clone().sub(e).normalize());
    }
  }

  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.1);
    if (this.ex) {
      if (this.playing) {
        this.t = (this.t + (dt * this.speed) / (this.ex.dur || 3.2)) % 1;
        this.update(this.t);
      }
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.ro.disconnect();
    this.controls.dispose();
    this.scene.traverse(o => { o.geometry?.dispose(); });
    Object.values(this.mats).forEach(m => m.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
