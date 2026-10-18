import { REGIONS, EXERCISES, EX_BY_ID, REGION_BY_ID, VIDEO_MB, SUBS, EQUIPMENT } from './exercises.js';
import { FOODS, DIETS, HEALTH, HEALTH_BY_ID, buildDayMenu } from './nutrition.js';
import { bodyMap } from './bodymap.js';
import { mountFigure, figureThumb } from './figure.js';
import { FOOD_DB, FOOD_BY_ID, FOOD_CATS, srcText } from './foods.js';
import { SPORTS, TENNIS_TYPES, SURFACES, INTENSITY, STROKES, TENNIS_PROGRAMS, ROUTINE_MOVES, ROUTINES, PFOCUS, PILATES, PILATES_BY_ID, PILATES_SESSIONS } from './sports.js';

// ═════════════════════════ Yardımcılar
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const fmtN = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('tr-TR');
const fmtInt = n => Math.round(n).toLocaleString('tr-TR');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2 = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseDay = k => new Date(k + 'T12:00:00');
const fmtDay = (k, opts = { weekday: 'long', day: 'numeric', month: 'long' }) => parseDay(k).toLocaleDateString('tr-TR', opts);
const e1rm = (w, r) => (r <= 1 ? w : w * (1 + r / 30));
const norm = s => s.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');
// En fazla 1 yazım hatası: ekleme, silme, değiştirme veya yan yana iki harfin yer değiştirmesi
function near1(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const diff = [];
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff.push(i);
    return diff.length <= 1 || (diff.length === 2 && diff[1] === diff[0] + 1 && a[diff[0]] === b[diff[1]] && a[diff[1]] === b[diff[0]]);
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  for (let i = 0; i < l.length; i++) if (l.slice(0, i) + l.slice(i + 1) === s) return true;
  return false;
}
// Arama sıralaması: ad ve takma adlar, kas/ekipman eşleşmelerinden önce gelir; ifadenin tamamı geçiyorsa ek puan.
// Tüm kelimeler eşleşmeli; 4+ harfli kelimelerde 1 yazım hatası tolere edilir.
function rankSearch(items, query, primaryOf, secondaryOf, nameOf) {
  const full = norm(query).trim().replace(/\s+/g, ' ');
  const qs = full.split(' ').filter(Boolean);
  if (!qs.length) return items;
  const toks = t => t.split(/[^a-z0-9]+/).filter(Boolean);
  const out = [];
  items.forEach((it, idx) => {
    const name = norm(nameOf(it)), pri = norm(primaryOf(it)), sec = norm(secondaryOf(it));
    const pw = toks(pri), sw = toks(sec);
    let score = pri.includes(full) && qs.length > 1 ? 4 : 0;
    for (const q of qs) {
      const typo = w => q.length >= 4 && (near1(q, w) || near1(q, w.slice(0, q.length)));
      const sc = name.startsWith(q) ? 5 : pw.some(w => w.startsWith(q)) ? 3 : pri.includes(q) ? 2
        : sw.some(w => w.startsWith(q)) ? 1.5 : sec.includes(q) ? 1 : pw.some(typo) ? 0.8 : sw.some(typo) ? 0.4 : 0;
      if (!sc) return;
      score += sc;
    }
    out.push([score, idx, it]);
  });
  return out.sort((a, b) => b[0] - a[0] || a[1] - b[1]).map(x => x[2]);
}
function fmtDur(ms) {
  const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${pad2(m)}:${pad2(s % 60)}` : `${m}:${pad2(s % 60)}`;
}
function daysAgo(k) {
  const diff = Math.round((parseDay(dayKey()) - parseDay(k)) / 864e5);
  if (diff === 0) return 'bugün';
  if (diff === 1) return 'dün';
  if (diff < 7) return `${diff} gün önce`;
  if (diff < 30) return `${Math.floor(diff / 7)} hafta önce`;
  return fmtDay(k, { day: 'numeric', month: 'short' });
}
function weekStart(d = new Date()) {
  const m = new Date(d); m.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return m;
}

// ═════════════════════════ İkonlar
const P = {
  home: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-6h4v6"/>',
  swap: '<path d="M7 4 3.5 7.5 7 11"/><path d="M3.5 7.5h13"/><path d="M17 13l3.5 3.5L17 20"/><path d="M20.5 16.5h-13"/>',
  barcode: '<path d="M4 6v12M7 6v12M10.5 6v12M13 6v12M16.5 6v12M20 6v12" stroke-width="1.6"/>',
  volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  tennis: '<circle cx="12" cy="12" r="8.5"/><path d="M5.2 7.2c2.6 1.4 4 3 4 4.8s-1.4 3.4-4 4.8M18.8 7.2c-2.6 1.4-4 3-4 4.8s1.4 3.4 4 4.8"/>',
  pilates: '<circle cx="12" cy="5" r="2.2"/><path d="M3.5 11.5c3 .8 5.6 1.2 8.5 1.2s5.5-.4 8.5-1.2M12 12.7V16l-3.5 4.5M12 16l3.5 4.5"/>',
  dumbbell: '<path d="M6.5 6v12M17.5 6v12M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.8 4.3-5.5 7.5-5.5s6.1 1.7 7.5 5.5"/>',
  flame: '<path d="M12 3c.8 3.2 5 5.4 5 10.2a5 5 0 0 1-10 0c0-2.4 1.3-3.6 2-5 .7 1.2 1.3 1.8 2.3 2.1C10.8 8 11.4 5.6 12 3Z"/>',
  bars: '<path d="M5 20V11M12 20V5M19 20v-6"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M7 7l10 10M17 7 7 17"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13"/>',
  play: '<path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5.5a2.5 2.5 0 0 0 2.8 4M16 6h2.5a2.5 2.5 0 0 1-2.8 4M12 13v3.5M8.5 20.5h7M9.5 16.5h5v4h-5z"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
  drop: '<path d="M12 3.5c3 4 6 7.3 6 10.5a6 6 0 0 1-12 0c0-3.2 3-6.5 6-10.5Z"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>',
  download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3Z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"/>',
  pulse: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  fork: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17.5 3C15.5 4.5 14.5 7 14.5 10h3v11"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10.5 5-3v9l-5-3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  trend: '<path d="m3.5 16.5 6-6 4 4 7-7"/><path d="M15 7.5h5.5V13"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  ruler: '<path d="m4 16 12-12 4 4L8 20z"/><path d="m8 12 2 2M11 9l2 2M14 6l2 2"/>',
  run: '<circle cx="14.5" cy="4.5" r="1.8"/><path d="m6 20 3.5-5 3 2V21M7 11l3-3.5 4 1.5 2 3.5h3.5M10 8.5 8.5 14"/>',
  shield: '<path d="M12 3.5 5 6v5.5c0 4.3 3 7.8 7 9 4-1.2 7-4.7 7-9V6l-7-2.5Z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/>',
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${P[n]}</svg>`;

// ═════════════════════════ Veri
const KEY = 'gymtakip.v1';
const DEFAULT_SETTINGS = { rest: 90, step: 2.5, useRoutines: true, lastBackup: 0, backupSnooze: 0, onboarded: false, awake: true, voice: true, lockTimer: false };
const DEFAULT_PROFILE = { sex: null, age: null, height: null, activity: 1.55, goal: 'maintain', days: 3, target: null };
let db = load();

function normalize(d) {
  d = d && Array.isArray(d.sets) ? d : {};
  return {
    sets: d.sets || [], custom: d.custom || [], weights: d.weights || [],
    routines: d.routines || [], workouts: d.workouts || [], session: d.session || null,
    measures: d.measures || [], cardio: d.cardio || [], food: d.food || {}, menu: d.menu || {}, notes: d.notes || {}, activities: d.activities || [], opponents: d.opponents || {}, foodLog: d.foodLog || {}, offCache: d.offCache || {}, recipes: d.recipes || [],
    settings: { ...DEFAULT_SETTINGS, ...d.settings },
    profile: { ...DEFAULT_PROFILE, ...d.profile },
  };
}
function load() {
  try { return normalize(JSON.parse(localStorage.getItem(KEY))); } catch { return normalize(null); }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { toast('Kaydedilemedi', 'x'); }
}
navigator.storage?.persist?.().catch(() => {});

const allExercises = () => [...EXERCISES, ...db.custom.map(c => ({ ...c, custom: true }))];
const exPrimary = e => [e.name, e.alt, ...(e.aka || [])].filter(Boolean).join(' ');
const exSecondary = e => [...(e.primary || []), ...(e.secondary || []), REGION_BY_ID[e.region]?.name,
  SUBS[e.region]?.find(x => x[0] === e.sub)?.[1], EQUIPMENT.find(x => x[0] === e.equip)?.[1]].filter(Boolean).join(' ');
const searchEx = (list, q) => rankSearch(list, q, exPrimary, exSecondary, e => e.name);
function getEx(id) {
  if (EX_BY_ID[id]) return EX_BY_ID[id];
  const c = db.custom.find(x => x.id === id);
  return c ? { ...c, custom: true } : null;
}
const animOf = ex => (ex?.img ? ex : ex?.animFrom ? EX_BY_ID[ex.animFrom] || null : null);
const working = sets => sets.filter(s => !s.warm);
const setsOf = exId => db.sets.filter(s => s.exId === exId);
const setsOn = day => db.sets.filter(s => s.date === day).sort((a, b) => a.ts - b.ts);
function groupByDay(sets) {
  const m = new Map();
  for (const s of sets) (m.get(s.date) || m.set(s.date, []).get(s.date)).push(s);
  return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([d, ss]) => [d, ss.sort((a, b) => a.ts - b.ts)]);
}
function fmtSet(ex, s) {
  const type = ex?.type || 'weight';
  if (type === 'time') return s.w ? `${s.r} sn · +${fmtN(s.w)} kg` : `${s.r} sn`;
  if (type === 'bodyweight') return s.w ? `+${fmtN(s.w)} kg × ${s.r}` : `${s.r} tekrar`;
  return `${fmtN(s.w)} kg × ${s.r}`;
}
const setScore = (ex, s) => (!ex?.type || ex.type === 'weight' ? e1rm(s.w, s.r) : ex.type === 'time' ? s.r + s.w * 10 : s.r + s.w * 2);
function bestSet(ex, sets) {
  let best = null;
  for (const s of working(sets)) if (!best || setScore(ex, s) > setScore(ex, best)) best = s;
  return best;
}
const isPR = (ex, s) => {
  if (s.warm) return false;
  const prev = bestSet(ex, setsOf(ex.id).filter(x => x.ts < s.ts));
  return !!prev && setScore(ex, s) > setScore(ex, prev);
};

// ═════════════════════════ Vücut, kalori, kardiyo
const ACTIVITY = [
  [1.2, 'Hareketsiz'], [1.375, 'Az hareketli (1–3 gün)'], [1.55, 'Orta (3–5 gün)'],
  [1.725, 'Çok hareketli (6–7 gün)'], [1.9, 'Aşırı (günde 2 antrenman)'],
];
const GOALS = { lose: 'Yağ yak', maintain: 'Formu koru', gain: 'Kas kazan' };
const GOAL_SHORT = { lose: 'Yağ yak', maintain: 'Koru', gain: 'Kas' };
const CARDIO = [
  ['walk', 'Tempolu yürüyüş', 4.3], ['run', 'Koşu', 9.8], ['bike', 'Bisiklet', 7.5], ['elliptical', 'Eliptik', 5],
  ['row', 'Kürek', 7], ['stairs', 'Merdiven', 9], ['swim', 'Yüzme', 6], ['rope', 'İp atlama', 11],
];
const MEASURES = [['waist', 'Bel'], ['chest', 'Göğüs'], ['arm', 'Kol'], ['hip', 'Kalça'], ['thigh', 'Uyluk'], ['neck', 'Boyun']];

function currentWeight() {
  const w = [...db.weights].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  return w?.kg || null;
}
const bodyKg = () => currentWeight() || 70;
const profileReady = () => { const p = db.profile; return !!(p.sex && p.age && p.height && currentWeight()); };

function metrics() {
  if (!profileReady()) return null;
  const p = db.profile, w = currentWeight();
  const h = p.height / 100;
  const bmi = w / (h * h);
  const bmiCat = bmi < 18.5 ? ['Zayıf', 'var(--blue)'] : bmi < 25 ? ['Normal', 'var(--good)'] : bmi < 30 ? ['Fazla kilolu', 'var(--warn)'] : ['Obez', 'var(--danger)'];
  const bmr = 10 * w + 6.25 * p.height - 5 * p.age + (p.sex === 'm' ? 5 : -161); // Mifflin-St Jeor
  const tdee = bmr * p.activity;
  const floor = p.sex === 'm' ? 1500 : 1200;
  const health = (p.health || []).map(h => HEALTH_BY_ID[h]).filter(Boolean);
  const noDeficit = health.some(h => h.noDeficit);
  const goalKcal = p.goal === 'lose' && !noDeficit ? Math.max(floor, tdee - 500) : p.goal === 'gain' ? tdee + 300 : tdee;
  const capPerKg = Math.min(...health.map(h => h.proteinPerKg || Infinity));
  const protein = w * Math.min(capPerKg, p.goal === 'maintain' ? 1.6 : p.goal === 'gain' ? 1.8 : 2.0);
  let fat = w * 0.9;
  let carbs = Math.max(0, (goalKcal - protein * 4 - fat * 9) / 4);
  // Diyabette karbonhidrat enerjinin en fazla %40'ı; kalan enerji yağdan
  if (health.some(h => h.lowCarb) && carbs * 4 > goalKcal * 0.4) {
    carbs = (goalKcal * 0.4) / 4;
    fat = (goalKcal - protein * 4 - carbs * 4) / 9;
  }
  const water = w * 0.035;
  const idealMin = 18.5 * h * h, idealMax = 24.9 * h * h;
  const bodyFat = clamp(1.2 * bmi + 0.23 * p.age - 10.8 * (p.sex === 'm' ? 1 : 0) - 5.4, 3, 60); // Deurenberg (kaba)
  let weeks = null;
  if (p.target && Math.abs(p.target - w) > 0.2) weeks = Math.ceil(Math.abs(p.target - w) / (p.target < w ? 0.5 : 0.25));
  return { w, bmi, bmiCat, bmr, tdee, goalKcal, protein, fat, carbs, water, idealMin, idealMax, bodyFat, weeks, health };
}

// Setin süresi (sn): tekrar başına ~3,5 sn + hazırlık; süreli hareketlerde girilen süre.
const workSec = (ex, s) => (ex?.type === 'time' ? s.r : s.r * 3.5 + 10);
// Kalori = MET × kg × saat (Compendium of Physical Activities). Dinlenme, setler arasındaki gerçek süreden alınır.
function setStats(sets) {
  const ss = [...sets].sort((a, b) => a.ts - b.ts);
  const kg = bodyKg();
  let kcal = 0, sec = 0, volume = 0;
  ss.forEach((s, i) => {
    const ex = getEx(s.exId);
    let rest = 60;
    if (i < ss.length - 1) {
      const gap = (ss[i + 1].ts - s.ts) / 1000 - workSec(getEx(ss[i + 1].exId), ss[i + 1]);
      rest = gap > 0 && gap < 1200 ? clamp(gap, 20, 240) : db.settings.rest || 90;
    }
    const t = workSec(ex, s) + rest;
    kcal += (ex?.met || 5) * kg * t / 3600;
    sec += t;
    if (!s.warm && (!ex?.type || ex.type === 'weight')) volume += s.w * s.r;
  });
  return { kcal, min: sec / 60, volume, sets: working(ss).length };
}
const cardioOn = day => db.cardio.filter(c => c.date === day);
function dayStats(day) {
  const st = setStats(setsOn(day));
  for (const c of cardioOn(day)) { st.kcal += c.kcal; st.min += c.min; }
  for (const a of db.activities) if (a.date === day) { st.kcal += a.kcal || 0; st.min += a.min || 0; }
  return st;
}

// ═════════════════════════ Program
const SPLITS = {
  full: { name: 'Tüm Vücut', days: [
    { n: 'Tüm Vücut A', ex: ['squat', 'bench', 'bb-row', 'ohp', 'plank'] },
    { n: 'Tüm Vücut B', ex: ['deadlift', 'incline-db', 'lat-pulldown', 'lunge', 'hanging-leg-raise'] },
  ] },
  ul: { name: 'Üst / Alt', days: [
    { n: 'Üst Vücut', ex: ['bench', 'bb-row', 'ohp', 'lat-pulldown', 'biceps-curl', 'triceps-pushdown'] },
    { n: 'Alt Vücut', ex: ['squat', 'rdl', 'leg-press', 'leg-curl', 'calf-raise', 'plank'] },
  ] },
  ppl: { name: 'İtme / Çekme / Bacak', days: [
    { n: 'İtme (Push)', ex: ['bench', 'incline-db', 'ohp', 'lateral-raise', 'triceps-pushdown'] },
    { n: 'Çekme (Pull)', ex: ['pullup', 'bb-row', 'lat-pulldown', 'face-pull', 'hammer-curl'] },
    { n: 'Bacak', ex: ['squat', 'rdl', 'leg-press', 'leg-curl', 'calf-raise'] },
  ] },
};
const splitKey = days => (days <= 3 ? 'full' : days === 4 ? 'ul' : 'ppl');
function schemeObj(i, exId) {
  const t = getEx(exId)?.type;
  if (t === 'time') return { sets: 3, min: 30, max: 60 };
  const g = db.profile.goal;
  if (g === 'gain') return i === 0 ? { sets: 4, min: 6, max: 8 } : { sets: 3, min: 8, max: 12 };
  if (g === 'lose') return i === 0 ? { sets: 3, min: 8, max: 10 } : { sets: 3, min: 12, max: 15 };
  return { sets: 3, min: 8, max: 12 };
}
const schemeText = (it, ex) => `${it.sets} × ${it.min}–${it.max}${ex?.type === 'time' ? ' sn' : ''}`;
const usingRoutines = () => db.routines.length > 0 && db.settings.useRoutines !== false;
function autoDays() {
  const k = splitKey(db.profile.days || 3);
  return SPLITS[k].days.map((d, i) => ({ key: `auto-${k}-${i}`, name: d.n, items: d.ex.map((id, j) => ({ exId: id, ...schemeObj(j, id) })) }));
}
const planDays = () => (usingRoutines() ? db.routines.map(r => ({ key: r.id, name: r.name, items: r.items })) : autoDays());
const programName = () => (usingRoutines() ? 'Kendi programın' : SPLITS[splitKey(db.profile.days || 3)].name);
function nextPlanDay() {
  const days = planDays();
  if (!days.length) return null;
  const last = [...db.workouts].sort((a, b) => b.end - a.end).find(w => days.some(d => d.key === w.key));
  const idx = last ? (days.findIndex(d => d.key === last.key) + 1) % days.length : 0;
  return days[idx];
}
function withProgress(day, since) {
  const items = day.items.filter(it => getEx(it.exId)).map(it => {
    const done = working(db.sets.filter(s => s.exId === it.exId && s.ts >= since)).length;
    return { ...it, ex: getEx(it.exId), done, complete: done >= it.sets };
  });
  return { ...day, items };
}
function planItemFor(exId) {
  if (db.session) return db.session.items.find(i => i.exId === exId) || null;
  const d = nextPlanDay();
  return d?.items.find(i => i.exId === exId) || null;
}

// ═════════════════════════ Otomatik ilerleme önerisi
function lastSessionSets(ex, excludeIds) {
  const prev = setsOf(ex.id).filter(s => !excludeIds.has(s.id) && !s.warm);
  return groupByDay(prev)[0]?.[1] || [];
}
function suggest(ex, t, last) {
  const type = ex.type || 'weight';
  t = t || { sets: 3, min: 8, max: 12 };
  if (!last.length) return { w: null, r: type === 'time' ? 30 : t.min, title: 'İlk kez yapıyorsun', sub: 'Rahatça 2–3 tekrar daha yapabileceğin bir ağırlıkla başla' };
  const maxR = Math.max(...last.map(s => s.r));
  if (type === 'time') return { w: last.at(-1).w, r: maxR + 5, title: `${maxR + 5} sn dene`, sub: `Geçen sefer en uzun ${maxR} sn` };
  if (type === 'bodyweight') {
    const allTop = last.length >= t.sets && last.every(s => s.r >= t.max);
    return allTop
      ? { w: (last.at(-1).w || 0) + db.settings.step, r: t.min, title: 'Ek ağırlık zamanı', sub: `Tüm setlerde ${t.max}+ tekrar yaptın; ağırlık yeleği/dambıl ekle` }
      : { w: last.at(-1).w || 0, r: maxR + 1, title: `${maxR + 1} tekrar hedefle`, sub: `Geçen sefer en çok ${maxR} tekrar` };
  }
  const topW = Math.max(...last.map(s => s.w));
  const atTop = last.filter(s => s.w === topW);
  if (atTop.length >= t.sets && atTop.every(s => s.r >= t.max)) {
    const w = Math.round((topW + db.settings.step) * 100) / 100;
    return { w, r: t.min, up: true, title: `${fmtN(w, 2)} kg × ${t.min}–${t.max}`, sub: `Geçen sefer ${atTop.length}×${t.max}+ yaptın, ağırlığı artırma zamanı` };
  }
  if (atTop.filter(s => s.r < t.min).length > atTop.length / 2) {
    return { w: topW, r: t.min, title: `${fmtN(topW, 2)} kg × ${t.min}`, sub: 'Tekrarlar hedefin altında kaldı; aynı ağırlıkla hedefe ulaş' };
  }
  const r = clamp(Math.min(...atTop.map(s => s.r)) + 1, t.min, t.max);
  return { w: topW, r, title: `${fmtN(topW, 2)} kg × ${r}`, sub: 'Aynı ağırlıkla her sette 1 tekrar fazla dene' };
}

// ═════════════════════════ Arayüz iskeleti
const view = $('#view');
const top = $('#top');
let toastTimer;
function toast(msg, ic = 'check') {
  const t = $('#toast');
  t.innerHTML = `${icon(ic)}<span>${esc(msg)}</span>`;
  t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2400);
}
function setHeader(title, { back = false, action = '', always = false, chip = false } = {}) {
  $('#top-title').textContent = title;
  $('#top-left').innerHTML = chip && !back ? sportChipHTML() : '';
  if (chip && !back) bindSportChip();
  $('#back').hidden = !back;
  $('#top-action').innerHTML = action;
  top.classList.toggle('always', always);
}
$('#back').innerHTML = icon('back');
$('#back').addEventListener('click', () => (history.length > 1 ? history.back() : (location.hash = '#/today')));
addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 30), { passive: true });


function thumb(ex) {
  const a = animOf(ex);
  if (!a) return `<div class="badge">${esc((ex?.name || '?').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toLocaleUpperCase('tr-TR'))}</div>`;
  return `<div class="thumb"><img src="${a.videos?.[0]?.poster || a.img[1]}" alt="" loading="lazy">${a.videos ? `<span class="vid"><svg viewBox="0 0 10 10"><path d="M2 1v8l7-4z"/></svg></span>` : ''}</div>`;
}
const pageHead = (eyebrow, title, sub = '') =>
  `<div class="page-head"><div class="eyebrow">${esc(eyebrow)}</div><h1 class="large-title">${esc(title)}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
const emptyBox = (ic, title, text) => `<div class="card empty"><div class="ic">${icon(ic)}</div><b>${esc(title)}</b>${esc(text)}</div>`;

// Alttan açılan panel
const sheetEl = $('#sheet');
let sheetOnClose = null;
function openSheet(html, onClose) {
  const panel = $('.sheet-panel', sheetEl);
  sheetOnClose?.(); sheetOnClose = onClose || null;
  panel.innerHTML = html;
  sheetEl.hidden = false;
  const close = () => { sheetEl.hidden = true; panel.innerHTML = ''; const f = sheetOnClose; sheetOnClose = null; f?.(); };
  $('.sheet-bg', sheetEl).onclick = close;
  return { el: panel, close };
}
const closeSheet = () => { sheetEl.hidden = true; const f = sheetOnClose; sheetOnClose = null; f?.(); };
const switchHTML = (id, on) => `<button class="switch ${on ? 'on' : ''}" id="${id}" role="switch" aria-checked="${on}"></button>`;

// ═════════════════════════ Yönlendirme
let cleanup = null;
const routes = {
  today: renderToday, lib: renderLib, pick: renderPick, ex: renderEx, hist: renderHist, profile: renderProfile, new: renderNew,
  workout: renderWorkout, summary: renderSummary, programs: renderPrograms, routine: renderRoutine,
  nutrition: renderNutrition, settings: renderSettings, welcome: renderWelcome,
  credits: renderCredits, records: renderRecords, report: renderReport, recap: renderRecap, tennis: renderTennis, stroke: renderStroke, pilates: renderPilates, pmove: renderPMove, player: renderPlayer,
};
const TAB_OF = { recap: 'hist', records: 'hist', report: 'hist', credits: 'profile', workout: 'today', summary: 'today', programs: 'profile', routine: 'profile', settings: 'profile', welcome: 'today', player: 'today', stroke: 'tennis', pmove: 'pilates' };
function route() {
  const [name = 'today', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const fn = routes[name] || renderToday;
  if (cleanup) { cleanup(); cleanup = null; }
  closeSheet();
  document.body.classList.remove('bare');
  const second = SPORT_TAB[sport()][0];
  const tab = ['ex', 'new', 'pick', 'lib'].includes(name) ? (sport() === 'gym' ? 'lib' : second) : TAB_OF[name] || (routes[name] ? name : 'today');
  $$('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  currentRoute = name;
  view.innerHTML = '';
  view.classList.remove('fade-in'); void view.offsetWidth; view.classList.add('fade-in');
  scrollTo(0, 0);
  top.classList.remove('scrolled');
  cleanup = fn(...args) || null;
  updateSessionBar();
}
let currentRoute = 'today';
document.addEventListener('visibilitychange', () => { if (!document.hidden && currentRoute === 'workout' && db.settings.awake) keepAwake(true); });
addEventListener('hashchange', route);

// Devam eden antrenman çubuğu
function updateSessionBar() {
  const bar = $('#session-bar');
  const show = !!db.session && currentRoute !== 'workout';
  bar.hidden = !show;
  document.body.classList.toggle('has-session', show);
  if (db.session) {
    $('#sb-name').textContent = db.session.name;
    $('#sb-time').textContent = fmtDur(Date.now() - db.session.start);
  }
}
setInterval(() => {
  if (!db.session) return;
  const t = fmtDur(Date.now() - db.session.start);
  $('#sb-time').textContent = t;
  const wt = $('#w-time');
  if (wt) wt.textContent = t;
}, 1000);

// ═════════════════════════ Antrenman oturumu
function startSession(day) {
  if (db.session && !confirm('Devam eden bir antrenman var. Onu bitirmeden yenisini başlatmak ister misin?')) { location.hash = '#/workout'; return; }
  db.session = { id: uid(), start: Date.now(), key: day?.key || 'free', name: day?.name || 'Serbest antrenman', items: (day?.items || []).map(i => ({ exId: i.exId, sets: i.sets, min: i.min, max: i.max })), cur: 0 };
  save();
  location.hash = '#/workout';
}
const sessionSets = () => (db.session ? db.sets.filter(s => s.ts >= db.session.start) : []);
function finishSession() {
  const s = db.session;
  const sets = sessionSets();
  if (!sets.length) {
    if (!confirm('Bu antrenmanda hiç set yok. Antrenman iptal edilsin mi?')) return;
    db.session = null; save(); location.hash = '#/today'; return;
  }
  const planned = s.items.reduce((a, i) => a + (i.sets || 0), 0);
  const done = sets.filter(x => !x.warm).length;
  if (done < planned && !confirm(`${planned} setin ${done} tanesini yaptın. Antrenman bitirilsin mi?`)) return;
  const w = { id: uid(), date: dayKey(new Date(s.start)), start: s.start, end: Date.now(), key: s.key, name: s.name };
  db.workouts.push(w);
  db.session = null;
  save();
  stopRest();
  location.hash = '#/summary/' + w.id;
}
function addToSession(exId) {
  if (!db.session || db.session.items.some(i => i.exId === exId)) return;
  db.session.items.push({ exId, ...schemeObj(1, exId) });
  save();
}

function renderWorkout() {
  const s = db.session;
  if (!s) { location.replace('#/today'); return; }
  setHeader(s.name, { always: true, action: `<button class="top-btn" id="w-finish">Bitir</button>` });
  const sets = sessionSets();
  const st = setStats(sets);
  const day = withProgress(s, s.start);
  if (s.cur >= day.items.length) s.cur = Math.max(0, day.items.length - 1);
  const ssl = ssLabels(s);
  view.innerHTML = pageHead(`Başladı ${new Date(s.start).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`, s.name) + `
    <div class="w-hero">
      <div class="time"><b id="w-time">${fmtDur(Date.now() - s.start)}</b><span>Süre</span></div>
      <div><b>${st.sets}</b><span>Set</span></div>
      <div><b>${fmtInt(st.kcal)}</b><span>kcal</span></div>
    </div>
    <div style="margin-top:14px">${day.items.map((it, i) => `
      <div class="wex ${i === s.cur ? 'open' : ''} ${it.complete ? 'done' : ''} ${it.ss ? 'ss' : ''} ${it.ss && day.items[i + 1]?.ss === it.ss ? 'ss-next' : ''} ${it.ss && day.items[i - 1]?.ss === it.ss ? 'ss-prev' : ''}" data-i="${i}">
        <div class="wex-head">${thumb(it.ex)}<div class="grow"><div class="name">${esc(it.ex.name)}</div>
          <div class="meta">${it.ss ? `<b class="ss-tag">Süperset ${ssl[it.ss]}</b> · ` : ''}${schemeText(it, it.ex)} · ${it.done}/${it.sets} set</div>
          <div class="dots">${[...Array(Math.max(it.sets, it.done))].map((_, k) => `<i class="${k < it.done ? 'on' : ''}"></i>`).join('')}</div></div>
          ${it.complete ? `<span class="wex-done">${icon('check')}</span>` : icon(i === s.cur ? 'down' : 'chev', 'chev')}</div>
        ${i === s.cur ? `<div class="wex-body">
          <div class="wex-actions"><a href="#/ex/${encodeURIComponent(it.exId)}">${icon('video')} Video</a>
            <button data-swap="${i}">${icon('swap')} Değiştir</button><button data-note="${i}">${icon('edit')} Not</button>
            <button data-ss="${i}" class="${it.ss ? 'on' : ''}">${icon('bolt')} Süperset</button></div>
          ${noteBox(it.ex, 'w-note')}<div class="w-editor"></div></div>` : ''}
      </div>`).join('') || emptyBox('dumbbell', 'Hareket yok', 'Aşağıdan antrenmanına hareket ekle.')}</div>
    <button class="btn ghost" id="w-add" style="margin-top:12px">${icon('plus')} Hareket ekle</button>
    <button class="btn" id="w-finish2" style="margin-top:10px">${icon('check')} Antrenmanı bitir</button>
    <div style="text-align:center;margin-top:14px"><button class="faint small" id="w-cancel">Antrenmanı iptal et</button></div>`;

  $$('.wex-head', view).forEach(h => h.addEventListener('click', () => {
    const i = +h.parentElement.dataset.i;
    s.cur = s.cur === i ? -1 : i; save(); rerenderWorkout();
  }));
  const open = day.items[s.cur];
  $('[data-swap]', view)?.addEventListener('click', () => swapSheet(s.cur, () => rerenderWorkout(true)));
  $('[data-note]', view)?.addEventListener('click', () => noteSheet(open.ex, () => rerenderWorkout()));
  $('#w-note', view)?.addEventListener('click', () => noteSheet(open.ex, () => rerenderWorkout()));
  $('[data-ss]', view)?.addEventListener('click', () => supersetSheet(s.cur, () => rerenderWorkout(true)));
  if (open) {
    renderSetEditor($('.w-editor', view), open.ex, {
      target: open, since: s.start,
      onSaved: saved => {
        const d = withProgress(s, s.start);
        const it = d.items[s.cur];
        const advance = () => {
          const nextIdx = d.items.findIndex((x, k) => k > s.cur && !x.complete);
          const idx = nextIdx >= 0 ? nextIdx : d.items.findIndex(x => !x.complete);
          if (idx >= 0) { s.cur = idx; toast(`Sıradaki: ${d.items[idx].ex.name}`, 'chev'); }
          else toast('Tüm hareketler tamam! Antrenmanı bitirebilirsin', 'trophy');
        };
        if (it && saved && !saved.warm && db.sets.includes(saved)) {
          if (it.ss) {
            // Süperset: turun sıradaki hareketine dinlenmeden geç, tur bitince dinlen
            const mem = ssMembers(s, it.ss), pos = mem.indexOf(s.cur);
            const nextInRound = mem.slice(pos + 1).find(i => !d.items[i]?.complete);
            const first = mem.find(i => !d.items[i]?.complete);
            if (nextInRound !== undefined) { stopRest(); s.cur = nextInRound; toast(`Dinlenmeden: ${d.items[nextInRound].ex.name}`, 'bolt'); }
            else if (first !== undefined) { s.cur = first; toast('Tur tamam · şimdi dinlen', 'pause'); }
            else advance();
          } else if (it.done === it.sets) advance();
          save();
        }
        rerenderWorkout(true);
      },
    });
  }
  const addEx = () => pickExercise('Antrenmana hareket ekle', id => { addToSession(id); s.cur = s.items.findIndex(i => i.exId === id); save(); });
  $('#w-add').addEventListener('click', addEx);
  $('#w-finish').addEventListener('click', finishSession);
  $('#w-finish2').addEventListener('click', finishSession);
  $('#w-cancel').addEventListener('click', () => {
    if (!confirm('Antrenman iptal edilsin mi? Kaydettiğin setler silinmez, sadece oturum kapanır.')) return;
    db.session = null; save(); location.hash = '#/today';
  });
  if (db.settings.awake) keepAwake(true);
  return () => keepAwake(false);
}
function rerenderWorkout(scrollToOpen) {
  const y = scrollY;
  renderWorkout();
  const open = scrollToOpen && $('.wex.open', view);
  if (open) scrollTo({ top: open.getBoundingClientRect().top + scrollY - top.offsetHeight - 10, behavior: 'smooth' });
  else scrollTo(0, y);
}

function renderSummary(id) {
  const w = db.workouts.find(x => x.id === id);
  if (!w) { location.replace('#/today'); return; }
  setHeader('Özet', { always: true, action: `<a class="top-btn" href="#/today">Bitti</a>` });
  const sets = db.sets.filter(s => s.ts >= w.start && s.ts <= w.end + 1000);
  const st = setStats(sets);
  const prev = [...db.workouts].filter(x => x.key === w.key && x.end < w.start).sort((a, b) => b.end - a.end)[0];
  const pst = prev ? setStats(db.sets.filter(s => s.ts >= prev.start && s.ts <= prev.end + 1000)) : null;
  const delta = (a, b, unit = '') => {
    if (!pst || !b) return '<span class="faint small">İlk kez</span>';
    const d = ((a - b) / b) * 100;
    return `<span class="delta ${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'} %${fmtInt(Math.abs(d))}${unit}</span>`;
  };
  const prs = sets.filter(s => isPR(getEx(s.exId), s));
  const prEx = [...new Map(prs.map(s => [s.exId, s])).values()];
  const byEx = new Map();
  for (const s of sets) (byEx.get(s.exId) || byEx.set(s.exId, []).get(s.exId)).push(s);
  view.innerHTML = `
    <div class="summary-hero"><div class="ok">${icon('check')}</div><h1>Antrenman tamamlandı</h1>
      <div class="sub">${esc(w.name)} · ${esc(fmtDay(w.date))}</div></div>
    <div class="metric-grid">
      <div class="metric"><div class="lbl">Süre</div><b class="num">${fmtInt((w.end - w.start) / 60000)}<small>dk</small></b><div class="note">${pst ? delta(w.end - w.start, prev.end - prev.start) : ''}</div></div>
      <div class="metric"><div class="lbl">Kalori</div><b class="num">${fmtInt(st.kcal)}<small>kcal</small></b><div class="note">${delta(st.kcal, pst?.kcal)}</div></div>
      <div class="metric"><div class="lbl">Set</div><b class="num">${st.sets}</b><div class="note">${delta(st.sets, pst?.sets)}</div></div>
      <div class="metric"><div class="lbl">Toplam kaldırılan</div><b class="num">${fmtInt(st.volume)}<small>kg</small></b><div class="note">${delta(st.volume, pst?.volume)}</div></div>
    </div>
    ${prEx.length ? `<div class="sec"><h2>Yeni rekorlar</h2><span class="pill accent">${icon('trophy')}${prEx.length}</span></div>
      <div class="list">${prEx.map(s => { const ex = getEx(s.exId); return `<a class="item" href="#/ex/${encodeURIComponent(s.exId)}">${thumb(ex)}<div class="grow"><div class="name">${esc(ex?.name)}</div><div class="meta num">${esc(fmtSet(ex, s))}</div></div>${icon('trophy', 'chev')}</a>`; }).join('')}</div>` : ''}
    <div class="sec"><h2>Hareketler</h2></div>
    <div class="list">${[...byEx.entries()].map(([exId, list]) => { const ex = getEx(exId); return `<a class="item" href="#/ex/${encodeURIComponent(exId)}" style="display:block">
      <div class="name">${esc(ex?.name || 'Silinmiş hareket')}</div>
      <div class="set-chips">${list.map(s => `<span class="set-chip">${s.warm ? 'Isınma · ' : ''}${esc(fmtSet(ex, s))}</span>`).join('')}</div></a>`; }).join('')}</div>
    <div class="sec"><h2>Antrenman notu</h2></div>
    <textarea class="note-in" id="w-note-in" maxlength="400" placeholder="Nasıl geçti? Örn. enerjim düşüktü, omzumda hafif ağrı vardı…">${esc(w.note || '')}</textarea>
    <a class="btn" href="#/today" style="margin-top:18px">Tamam</a>`;
  let tmr;
  $('#w-note-in').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { w.note = e.target.value.trim() || undefined; save(); }, 400); });
  $('#w-note-in').addEventListener('blur', e => { w.note = e.target.value.trim() || undefined; save(); });
}

// ═════════════════════════ Set girişi (antrenman ekranında)
const drafts = {};
function renderSetEditor(box, ex, { target = null, since = null, onSaved = null } = {}) {
  const type = ex.type || 'weight';
  const today = dayKey();
  const list = setsOf(ex.id).filter(s => (since ? s.ts >= since : s.date === today)).sort((a, b) => a.ts - b.ts);
  const ids = new Set(list.map(s => s.id));
  const last = lastSessionSets(ex, ids);
  const sug = suggest(ex, target, last);
  const work = working(list);
  if (!drafts[ex.id]) {
    const ref = work.at(-1);
    drafts[ex.id] = ref ? { w: ref.w, r: ref.r, warm: false }
      : { w: sug.w ?? (last.at(-1)?.w ?? (type === "weight" ? ((ex.met || 5) >= 6 ? 20 : 8) : 0)), r: sug.r, warm: false };
  }
  const d = drafts[ex.id];
  const rStep = type === 'time' ? 5 : 1;
  let wi = 0;
  const prevFor = s => (s.warm ? '—' : last[wi] ? fmtSet(ex, last[wi++]) : (wi++, '—'));

  box.innerHTML = `
    ${!work.length ? (last.length
      ? `<button class="sug" id="sug-apply" style="margin-bottom:10px"><span class="ic">${icon(sug.up ? 'trend' : 'bulb')}</span>
          <div class="grow"><b>Öneri: ${esc(sug.title)}</b><span>${esc(sug.sub)}</span></div><span class="go">Uygula</span></button>`
      : `<div class="target-hint">${icon('bulb')} İlk kez: rahatça 2–3 tekrar daha yapabileceğin bir ağırlıkla başla.</div>`) : ''}
    <div class="sets">
      <div class="sets-h"><span>Set</span><span>Önceki</span><span>${type === 'time' ? 'Süre' : 'Kg'}</span><span>${type === 'time' ? 'Kg' : 'Tekrar'}</span><span></span></div>
      ${list.length ? (() => { let n = 0; return list.map(s => `<div class="set-r" data-edit="${s.id}">
        <span class="n ${s.warm ? 'warm' : ''}">${s.warm ? 'I' : ++n}</span><span class="p">${esc(prevFor(s))}</span>
        <span class="v">${type === 'time' ? `${s.r} sn` : fmtN(s.w)}</span>
        <span class="v">${type === 'time' ? (s.w ? fmtN(s.w) : '—') : s.r}${isPR(ex, s) ? `<span class="pr">${icon('trophy')}</span>` : ''}</span>
        <span class="del" aria-label="Düzenle">${icon('edit')}</span></div>`).join(''); })()
      : `<div class="sets-empty">${target ? `Hedef: <b>${schemeText(target, ex)}</b>. ` : ''}Aşağıdan ilk setini gir.</div>`}
    </div>
    <div class="composer card">
      <div class="steppers">
        <div class="stepper"><label>${type === 'weight' ? 'Ağırlık · kg' : 'Ek ağırlık · kg'}</label><div class="ctl"><button data-s="w" data-d="-1" aria-label="Azalt">${icon('minus')}</button>
          <input class="in-w" inputmode="decimal" value="${fmtN(d.w, 2)}"><button data-s="w" data-d="1" aria-label="Artır">${icon('plus')}</button></div></div>
        <div class="stepper"><label>${type === 'time' ? 'Süre · sn' : 'Tekrar'}</label><div class="ctl"><button data-s="r" data-d="-1" aria-label="Azalt">${icon('minus')}</button>
          <input class="in-r" inputmode="numeric" value="${d.r}"><button data-s="r" data-d="1" aria-label="Artır">${icon('plus')}</button></div></div>
      </div>
      <div class="composer-foot">
        <button class="chip-toggle ${d.warm ? 'on' : ''}" id="warm-sw" aria-pressed="${d.warm}">${icon('flame')} Isınma</button>
        <button class="btn add-set">${icon('check')} ${d.warm ? 'Isınma setini kaydet' : 'Seti tamamla'}</button>
      </div>
    </div>`;

  const inW = $('.in-w', box), inR = $('.in-r', box);
  const redraw = () => renderSetEditor(box, ex, { target, since, onSaved });
  inW.addEventListener('change', () => { d.w = Math.max(0, num(inW.value)); inW.value = fmtN(d.w, 2); });
  inR.addEventListener('change', () => { d.r = Math.max(0, Math.round(num(inR.value))); inR.value = d.r; });
  $$('.stepper button', box).forEach(b => b.addEventListener('click', () => {
    const dir = +b.dataset.d;
    if (b.dataset.s === 'w') { d.w = Math.max(0, Math.round((num(inW.value) + dir * db.settings.step) * 100) / 100); inW.value = fmtN(d.w, 2); }
    else { d.r = Math.max(0, Math.round(num(inR.value)) + dir * rStep); inR.value = d.r; }
  }));
  $('#warm-sw', box).addEventListener('click', () => { d.w = num(inW.value); d.r = Math.round(num(inR.value)); d.warm = !d.warm; redraw(); });
  $('#sug-apply', box)?.addEventListener('click', () => { if (sug.w != null) d.w = sug.w; d.r = sug.r; d.warm = false; redraw(); });
  $('.add-set', box).addEventListener('click', () => {
    d.w = Math.max(0, num(inW.value));
    d.r = Math.max(0, Math.round(num(inR.value)));
    if (!d.r) return toast(type === 'time' ? 'Süre gir' : 'Tekrar sayısı gir', 'info');
    const s = { id: uid(), exId: ex.id, date: today, ts: Date.now(), w: d.w, r: d.r };
    if (d.warm) s.warm = true;
    db.sets.push(s);
    if (db.session) addToSession(ex.id);
    save();
    if (isPR(ex, s)) celebratePR(ex, s);
    else if (!onSaved) toast(s.warm ? 'Isınma seti kaydedildi' : 'Set kaydedildi');
    unlockAudio(); unlockSpeech();
    startRest(s.warm ? Math.min(db.settings.rest, 60) : db.settings.rest);
    d.warm = false;
    onSaved ? onSaved(s) : redraw();
  });
  $$('.set-r[data-edit]', box).forEach(row => row.addEventListener('click', () => {
    const s = db.sets.find(x => x.id === row.dataset.edit);
    if (s) editSetSheet(ex, s, () => (onSaved ? onSaved(null) : redraw()));
  }));
}

function editSetSheet(ex, s, after) {
  const type = ex.type || 'weight';
  let warm = !!s.warm;
  const { el, close } = openSheet(`
    <div class="sheet-title">Seti düzenle</div>
    <div class="in-row">
      <div class="in-box"><label>${type === 'time' ? 'Ek ağırlık · kg' : 'Kg'}</label><input id="e-w" inputmode="decimal" value="${fmtN(s.w, 2)}"></div>
      <div class="in-box"><label>${type === 'time' ? 'Süre · sn' : 'Tekrar'}</label><input id="e-r" inputmode="numeric" value="${s.r}"></div>
    </div>
    <div class="warm-toggle" style="margin-top:14px"><span>Isınma seti <span class="faint small">(rekor ve önerilere sayılmaz)</span></span>${switchHTML('e-warm', warm)}</div>
    <div class="sheet-actions"><button class="btn danger" id="e-del">Sil</button><button class="btn" id="e-save">Kaydet</button></div>`);
  $('#e-warm', el).addEventListener('click', e => { warm = !warm; e.currentTarget.classList.toggle('on', warm); });
  $('#e-save', el).addEventListener('click', () => {
    const r = Math.round(num($('#e-r', el).value));
    if (!r) return toast('Tekrar gir', 'info');
    s.w = Math.max(0, num($('#e-w', el).value)); s.r = r;
    if (warm) s.warm = true; else delete s.warm;
    save(); close(); toast('Set güncellendi'); after();
  });
  $('#e-del', el).addEventListener('click', () => {
    db.sets = db.sets.filter(x => x.id !== s.id);
    save(); close(); toast('Set silindi', 'x'); after();
  });
}

// ═════════════════════════ Bugün
function renderToday() {
  if (sport() === 'tennis') return renderTodayTennis();
  if (sport() === 'pilates') return renderTodayPilates();
  const today = dayKey();
  setHeader('Bugün', { chip: true });
  const st = dayStats(today);
  const m = metrics();
  const hour = new Date().getHours();
  const hello = hour < 6 ? 'İyi geceler' : hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';
  const ws = weekStart();
  const weekDays = [...Array(7)].map((_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return dayKey(d); });
  const weekKcal = weekDays.map(d => dayStats(d).kcal);
  const trained = weekDays.filter(d => setsOn(d).length).length;
  const goalDays = db.profile.days || 3;
  const maxK = Math.max(...weekKcal, 1);
  const doneToday = db.workouts.filter(w => w.date === today).sort((a, b) => b.end - a.end);

  let html = pageHead(fmtDay(today), hello);

  // 1) Ana eylem: antrenman
  if (db.session) {
    const d = withProgress(db.session, db.session.start);
    const done = d.items.filter(i => i.complete).length;
    html += `<div class="next"><div class="eyebrow">Devam eden antrenman</div><h2>${esc(db.session.name)}</h2>
      <div class="meta"><span class="pill accent num">${icon('pulse')}${fmtDur(Date.now() - db.session.start)}</span><span class="pill">${done}/${d.items.length} hareket tamam</span></div>
      <a class="btn" href="#/workout">Antrenmana devam et</a></div>`;
  } else {
    if (doneToday.length) {
      const w = doneToday[0];
      html += `<a class="slim" href="#/summary/${w.id}" style="margin:0 0 10px"><div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('check')}</div>
        <div class="grow"><b>Bugünkü antrenman tamamlandı</b><span>${esc(w.name)} · ${fmtInt((w.end - w.start) / 60000)} dk · özeti gör</span></div>${icon('chev', 'chev')}</a>`;
    }
    const plan = nextPlanDay();
    if (plan) {
      const items = plan.items.filter(i => getEx(i.exId));
      const estMin = Math.round(items.reduce((a, i) => a + i.sets, 0) * 2.5);
      html += `<div class="next"><div class="eyebrow">${doneToday.length ? 'Sıradaki antrenman' : 'Bugünün antrenmanı'}</div><h2>${esc(plan.name)}</h2>
        <div class="meta"><span class="pill">${items.length} hareket</span><span class="pill">~${estMin} dk</span><span class="pill">${esc(programName())}</span></div>
        <div class="ex-strip">${items.slice(0, 5).map(i => thumb(getEx(i.exId))).join('')}${items.length > 5 ? `<div class="more">+${items.length - 5}</div>` : ''}</div>
        <button class="btn" id="start-plan">${icon('play')} Antrenmana başla</button>
        <div class="row" style="justify-content:center;gap:22px;margin-top:12px">
          <button class="alt" id="plan-see" style="width:auto;margin:0">Hareketleri gör</button>
          <button class="alt" id="start-free" style="width:auto;margin:0">Serbest antrenman</button></div></div>`;
    } else {
      html += `<div class="next"><div class="eyebrow">Program</div><h2>Programında gün yok</h2>
        <div class="muted small" style="margin:10px 0 16px">Programlar bölümünden gün ekle ya da serbest antrenman yap.</div>
        <button class="btn" id="start-free">${icon('play')} Serbest antrenman</button></div>`;
    }
  }

  // 2) Özet sayılar
  html += `<div class="mini-stats">
      <div><span>${icon('flame')} Yakılan</span><b>${fmtInt(st.kcal)}<small>kcal</small></b></div>
      <div><span>${icon('pulse')} Süre</span><b>${fmtInt(st.min)}<small>dk</small></b></div>
      <a href="#/hist"><span>${icon('calendar')} Bu hafta</span><b>${trained}/${goalDays}<small>gün</small></b></a>
    </div>`;

  html += `<div style="margin-top:10px">${streakCard()}</div>`;
  if (!profileReady()) {
    html += `<a class="slim" href="#/profile"><div class="ic" style="background:var(--blue-soft);color:var(--blue)">${icon('user')}</div>
      <div class="grow"><b>Profilini tamamla</b><span>Kalori ihtiyacın ve beslenme planın hesaplansın</span></div>${icon('chev', 'chev')}</a>`;
  }
  html += backupReminder();

  // 3) Beslenme özeti
  if (m) {
    const f = db.food[today] || { kcal: 0, protein: 0, water: 0 };
    const kcalT = m.goalKcal + st.kcal, waterT = (m.water + (setsOn(today).length ? 0.5 : 0)) * 1000;
    const bar = (v, t, c) => `<div class="bar" style="margin-top:6px"><i style="width:${clamp((v / t) * 100, 0, 100)}%;background:${c}"></i></div>`;
    html += `<div class="sec"><h2>Beslenme</h2><a href="#/nutrition">Menüyü gör</a></div>
      <a class="card" href="#/nutrition" style="display:block">
        <div class="row"><div class="grow"><div class="card-label">Kalori</div><div class="kcal-big" style="margin-top:4px"><b>${fmtInt(f.kcal)}</b><span>/ ${fmtInt(kcalT)} kcal</span></div></div>${icon('chev', 'chev')}</div>
        ${bar(f.kcal, kcalT, 'var(--fire)')}
        <div class="targets" style="grid-template-columns:1fr 1fr;margin-top:14px">
          <div><div class="card-label">Protein</div><b class="num" style="font-size:16px">${fmtInt(f.protein)} / ${fmtInt(m.protein)} g</b>${bar(f.protein, m.protein, 'var(--accent)')}</div>
          <div><div class="card-label">Su</div><b class="num" style="font-size:16px">${fmtN(f.water / 1000)} / ${fmtN(waterT / 1000)} L</b>${bar(f.water, waterT, 'var(--blue)')}</div>
        </div></a>`;
  }

  // 4) Kardiyo
  const cardio = cardioOn(today);
  html += `<div class="sec"><h2>Kardiyo</h2><button id="add-cardio">${icon('plus')} Ekle</button></div>`;
  html += cardio.length ? `<div class="card">${cardio.map(c => `<div class="cardio-row" data-id="${c.id}">
      <div class="plan-icon" style="width:38px;height:38px;border-radius:12px;background:var(--blue-soft);color:var(--blue)">${icon('run')}</div>
      <div class="grow"><div style="font-weight:600">${esc(CARDIO.find(x => x[0] === c.type)?.[1] || 'Kardiyo')}</div><div class="faint small num">${c.min} dk · silmek için dokun</div></div>
      <span class="pill fire num">${icon('flame')}${fmtInt(c.kcal)}</span></div>`).join('')}</div>`
    : `<button class="slim" id="add-cardio2" style="margin-top:0"><div class="ic" style="background:var(--blue-soft);color:var(--blue)">${icon('run')}</div>
        <div class="grow"><b>Koşu, bisiklet, yürüyüş…</b><span>Süreyi gir, kalorisi günlük toplama eklensin</span></div>${icon('plus', 'chev')}</button>`;

  // 5) Hafta
  html += `<div class="sec"><h2>Bu hafta</h2><span class="faint small num">${fmtInt(weekKcal.reduce((a, b) => a + b, 0))} kcal</span></div>
    <div class="card"><div class="week">${weekDays.map((d, i) => `<div class="d ${d === today ? 'today' : ''}">
      <div class="b ${weekKcal[i] ? 'on' : ''}" style="height:${weekKcal[i] ? Math.max(14, (weekKcal[i] / maxK) * 70) : 6}px"></div>
      <span>${['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'][i]}</span></div>`).join('')}</div></div>`;
  view.innerHTML = html;

  $('#start-plan')?.addEventListener('click', () => startSession(nextPlanDay()));
  $('#start-free')?.addEventListener('click', () => startSession(null));
  $('#plan-see')?.addEventListener('click', () => {
    const p = nextPlanDay();
    const { el, close } = openSheet(`<div class="sheet-title">${esc(p.name)}</div>
      <div class="list">${p.items.filter(i => getEx(i.exId)).map(i => `<a class="item" href="#/ex/${encodeURIComponent(i.exId)}">${thumb(getEx(i.exId))}
        <div class="grow"><div class="name">${esc(getEx(i.exId).name)}</div><div class="meta">${schemeText(i, getEx(i.exId))}</div></div>${icon('chev', 'chev')}</a>`).join('')}</div>
      <div class="sheet-actions"><a class="btn ghost" href="#/programs">Programı düzenle</a><button class="btn" id="ps-start">Başla</button></div>`);
    $('#ps-start', el).addEventListener('click', () => { close(); startSession(p); });
  });
  $('#add-cardio')?.addEventListener('click', () => cardioSheet(rerender));
  $('#add-cardio2')?.addEventListener('click', () => cardioSheet(rerender));
  $$('.cardio-row', view).forEach(r => r.addEventListener('click', () => {
    if (!confirm('Bu kardiyo kaydı silinsin mi?')) return;
    db.cardio = db.cardio.filter(c => c.id !== r.dataset.id); save(); rerender();
  }));
  bindBackupReminder();
  function rerender() { const y = scrollY; renderToday(); scrollTo(0, y); }
}

function addFood(kcal, protein, water, carbs = 0, fat = 0) {
  const k = dayKey();
  const f = db.food[k] || { kcal: 0, protein: 0, water: 0 };
  f.kcal = Math.max(0, f.kcal + kcal); f.protein = Math.max(0, f.protein + protein); f.water = Math.max(0, f.water + water);
  f.c = Math.max(0, (f.c || 0) + carbs); f.f = Math.max(0, (f.f || 0) + fat);
  db.food[k] = f;
  save();
}
function mealSheet(after) {
  const presets = [['Kahvaltı', 450, 25], ['Ana öğün', 700, 40], ['Ara öğün', 250, 10], ['Protein shake', 150, 25]];
  const { el, close } = openSheet(`
    <div class="sheet-title">Hızlı ekle</div>
    <div class="opt-grid">${presets.map(([n, k, p]) => `<button class="opt" data-k="${k}" data-p="${p}">${n}<span class="faint small"> · ${k} kcal</span></button>`).join('')}</div>
    <div class="in-row" style="margin-top:10px">
      <div class="in-box"><label>Kalori · kcal</label><input id="m-k" inputmode="numeric" placeholder="0"></div>
      <div class="in-box"><label>Protein · g</label><input id="m-p" inputmode="numeric" placeholder="0"></div>
    </div>
    <div class="sheet-actions"><button class="btn ghost" id="m-reset">Bugünü sıfırla</button><button class="btn" id="m-add">Ekle</button></div>
    <div class="faint small" style="margin-top:12px;text-align:center">Hazır seçenekler ortalama değerlerdir; biliyorsan kendi değerlerini yaz.</div>`);
  $$('.opt', el).forEach(b => b.addEventListener('click', () => { $('#m-k', el).value = b.dataset.k; $('#m-p', el).value = b.dataset.p; }));
  $('#m-add', el).addEventListener('click', () => {
    const k = num($('#m-k', el).value), p = num($('#m-p', el).value);
    if (!k && !p) return toast('Kalori veya protein gir', 'info');
    logFood({ name: 'Hızlı ekleme', portion: '', kcal: k, p, c: 0, f: 0 }); close(); toast('Eklendi', 'fork'); after();
  });
  $('#m-reset', el).addEventListener('click', () => {
    if (!confirm('Bugünkü kalori, protein ve su kayıtları sıfırlansın mı?')) return;
    delete db.food[dayKey()]; delete db.foodLog[dayKey()];
    if (db.menu[dayKey()]) db.menu[dayKey()].eaten = {};
    save(); close(); after();
  });
}
function cardioSheet(after) {
  let type = 'walk';
  const { el, close } = openSheet(`
    <div class="sheet-title">Kardiyo ekle</div>
    <div class="opt-grid">${CARDIO.map(([k, n]) => `<button class="opt ${k === type ? 'on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="in-row" style="margin-top:10px">
      <div class="in-box"><label>Süre · dk</label><input id="c-min" inputmode="numeric" value="30"></div>
      <div class="in-box"><label>Yakılan · kcal</label><input id="c-kcal" inputmode="numeric" disabled></div>
    </div>
    <div class="sheet-actions"><button class="btn ghost" id="c-cancel">Vazgeç</button><button class="btn" id="c-save">Kaydet</button></div>`);
  const calc = () => { const met = CARDIO.find(c => c[0] === type)[2]; $('#c-kcal', el).value = fmtInt(met * bodyKg() * num($('#c-min', el).value) / 60); };
  calc();
  $$('.opt', el).forEach(b => b.addEventListener('click', () => { type = b.dataset.k; $$('.opt', el).forEach(x => x.classList.toggle('on', x === b)); calc(); }));
  $('#c-min', el).addEventListener('input', calc);
  $('#c-cancel', el).addEventListener('click', close);
  $('#c-save', el).addEventListener('click', () => {
    const min = Math.round(num($('#c-min', el).value));
    if (!min) return toast('Süre gir', 'info');
    const met = CARDIO.find(c => c[0] === type)[2];
    db.cardio.push({ id: uid(), date: dayKey(), ts: Date.now(), type, min, kcal: met * bodyKg() * min / 60 });
    save(); close(); toast('Kardiyo eklendi', 'run'); after();
  });
}

// Yedek hatırlatması: 2 haftada bir, yeterince veri varsa
function backupReminder() {
  const s = db.settings, now = Date.now();
  const items = db.sets.length + db.activities.length * 3 + Object.keys(db.food).length;
  if (items < 10 || now < s.backupSnooze || now - s.lastBackup < 7 * 864e5) return '';
  return `<div class="slim" id="bk-card"><div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('shield')}</div>
    <button class="grow" id="bk-now" style="text-align:left"><b>Kayıtlarını yedekle</b><span>${s.lastBackup ? `Son yedek ${daysAgo(dayKey(new Date(s.lastBackup)))}` : 'Henüz yedek yok'} · dokun, "Dosyalar'a Kaydet"i seç</span></button>
    <button class="ibtn" id="bk-later" aria-label="Sonra hatırlat">${icon('x')}</button></div>`;
}
function bindBackupReminder() {
  $('#bk-later')?.addEventListener('click', () => { db.settings.backupSnooze = Date.now() + 3 * 864e5; save(); $('#bk-card').remove(); });
  $('#bk-now')?.addEventListener('click', async () => { if (await exportData()) $('#bk-card')?.remove(); });
}

// ═════════════════════════ Hareketler ve seçici
let libRegion = 'all', libQuery = '', picking = null;
function pickExercise(title, onPick) { picking = { title, onPick }; location.hash = '#/pick'; }
function renderPick() {
  if (!picking) { location.replace('#/lib'); return; }
  setHeader('Hareket seç', { back: true, always: true });
  view.innerHTML = `<div class="pick-banner">${icon('plus')} ${esc(picking.title)}</div>
    <label class="search">${icon('search')}<input id="lib-q" type="search" placeholder="Hareket veya kas ara" value="${esc(libQuery)}" autocomplete="off"></label>
    <div class="chips" id="lib-chips"></div>
    <div id="lib-body"></div>`;
  $('#lib-q').addEventListener('input', e => { libQuery = e.target.value; renderLibBody(true); });
  renderLibBody(true);
  return () => { picking = null; };
}
// Bölgelerin kapak fotoğrafı: [hareket, görsel sırası]
const REGION_COVER = { gogus: ['bench', 1], sirt: ['pullup', 0], bacak: ['front-squat', 1], omuz: ['db-shoulder-press', 1], kol: ['biceps-curl', 1], karin: ['hanging-leg-raise', 0] };
const regionGoal = id => (id === 'karin' ? [6, 15] : [10, 20]);
const subName = (region, sub) => SUBS[region]?.find(x => x[0] === sub)?.[1] || '';
// Son 7 günde bölge başına çalışma seti
function weeklyRegionSets() {
  const since = dayKey(new Date(Date.now() - 6 * 864e5));
  const out = Object.fromEntries(REGIONS.map(r => [r.id, 0]));
  for (const s of working(db.sets.filter(x => x.date >= since))) { const r = getEx(s.exId)?.region; if (r in out) out[r]++; }
  return out;
}
const setLevel = (id, n) => (!n ? 0 : n < regionGoal(id)[0] / 2 ? 1 : n < regionGoal(id)[0] ? 2 : 3);

// Bir bölgenin hareketleri: alt grup ve ekipman filtresi
function renderRegion(reg, sub) {
  if (sub && !SUBS[reg.id]?.some(x => x[0] === sub)) sub = '';
  const all = allExercises().filter(e => e.region === reg.id);
  const wk = weeklyRegionSets()[reg.id];
  let equip = db.settings.equip || 'all';
  setHeader(sub ? subName(reg.id, sub) : reg.name, { back: true, always: true, action: `<a class="top-btn" href="#/new" aria-label="Özel hareket ekle">${icon('plus')}</a>` });
  view.innerHTML = pageHead(`${reg.name} · ${all.length} hareket${wk ? ` · bu hafta ${wk} set` : ''}`, sub ? subName(reg.id, sub) : reg.name) + `
    <label class="search">${icon('search')}<input id="lib-q" type="search" placeholder="${esc(reg.name)} hareketlerinde ara" autocomplete="off"></label>
    <div class="subtabs">${[['', 'Tümü'], ...SUBS[reg.id]].map(([k, n]) => `<button class="${k === sub ? 'on' : ''}" data-s="${k}">${n}<span>${k ? all.filter(e => e.sub === k).length : all.length}</span></button>`).join('')}</div>
    <div class="chips eq-chips">${[['all', 'Tüm ekipman'], ...EQUIPMENT].map(([k, n]) => `<button class="chip ${k === equip ? 'on' : ''}" data-e="${k}">${n}</button>`).join('')}</div>
    <div id="lib-body"></div>`;
  let q = '';
  const draw = () => {
    const list = searchEx(all.filter(e => (!sub || e.sub === sub) && (equip === 'all' || e.equip === equip)), q);
    const groups = sub || q.trim() ? [[sub || 'q', list]] : [...SUBS[reg.id].map(([k]) => [k, list.filter(e => e.sub === k)]), ['', list.filter(e => !e.sub)]];
    const html = groups.filter(([, l]) => l.length).map(([k, l]) =>
      `${sub || q.trim() ? '<div style="height:12px"></div>' : `<div class="group-title">${k ? subName(reg.id, k) : 'Kendi hareketlerin'} · ${l.length}</div>`}<div class="list">${l.map(e => libItem(e)).join('')}</div>`).join('');
    $('#lib-body').innerHTML = html || `<div style="margin-top:14px">${emptyBox('search', 'Sonuç yok', equip !== 'all' ? 'Bu ekipmanla hareket yok; başka bir ekipman seç.' : 'Farklı bir arama dene.')}</div>`;
  };
  $$('.subtabs button', view).forEach(b => b.addEventListener('click', () => location.replace(`#/lib/${reg.id}${b.dataset.s ? '/' + b.dataset.s : ''}`)));
  $$('.eq-chips .chip', view).forEach(b => b.addEventListener('click', () => {
    equip = db.settings.equip = b.dataset.e; save();
    $$('.eq-chips .chip', view).forEach(x => x.classList.toggle('on', x === b));
    draw();
  }));
  $('#lib-q').addEventListener('input', e => { q = e.target.value; draw(); });
  $('.subtabs .on', view)?.scrollIntoView({ inline: 'center', block: 'nearest' });
  draw();
}

function renderLib(region, sub) {
  const reg = REGION_BY_ID[region];
  if (reg) return renderRegion(reg, sub);
  // Ana sayfa: bölge kareleri veya vücut haritası
  setHeader('Hareketler', { chip: true, action: `<a class="top-btn" href="#/new" aria-label="Özel hareket ekle">${icon('plus')}</a>` });
  const mode = db.settings.libView === 'map' ? 'map' : 'tiles';
  const wk = weeklyRegionSets();
  const levels = Object.fromEntries(REGIONS.map(r => [r.id, setLevel(r.id, wk[r.id])]));
  const count = id => allExercises().filter(e => e.region === id).length;
  const tiles = `<div class="rtiles">${REGIONS.map(r => {
    const [exId, i] = REGION_COVER[r.id], img = EX_BY_ID[exId]?.img?.[i];
    return `<a class="rtile" href="#/lib/${r.id}">${img ? `<img src="${img}" alt="">` : ''}
      ${wk[r.id] ? `<span class="rt-badge l${levels[r.id]}">Bu hafta ${wk[r.id]} set</span>` : ''}
      <div class="rt-text"><b>${r.name}</b><span>${count(r.id)} hareket</span></div></a>`;
  }).join('')}</div>`;
  const map = `<div class="card bm-card">${bodyMap(levels)}
      <div class="bm-hint">Bir kasa dokun, o kasın hareketleri açılsın.</div>
      <div class="bm-legend"><span><i class="l0"></i>Hiç</span><span><i class="l1"></i>Az</span><span><i class="l2"></i>Orta</span><span><i class="l3"></i>Hedefte</span></div>
      <div class="faint small" style="text-align:center;margin-top:8px">Renkler son 7 gündeki set sayına göre</div>
    </div>
    <div class="list bm-list">${REGIONS.map(r => `<a class="link-row" href="#/lib/${r.id}"><i class="dot l${levels[r.id]}"></i>
      <div class="grow" style="font-weight:600">${r.name}</div><span class="faint small num">${wk[r.id]} / ${regionGoal(r.id)[0]} set</span>${icon('chev', 'chev')}</a>`).join('')}</div>`;
  view.innerHTML = pageHead(`${allExercises().length} hareket · ${EXERCISES.filter(e => e.videos).length} videolu`, 'Hareketler') + `
    <label class="search">${icon('search')}<input id="lib-q" type="search" placeholder="Hareket veya kas ara" value="${esc(libQuery)}" autocomplete="off"></label>
    <div id="lib-home">
      <div class="seg"><button data-v="tiles" class="${mode === 'tiles' ? 'on' : ''}">Bölgeler</button><button data-v="map" class="${mode === 'map' ? 'on' : ''}">Vücut haritası</button></div>
      ${mode === 'map' ? map : tiles}
    </div>
    <div id="lib-body"></div>`;
  $$('#lib-home .seg button').forEach(b => b.addEventListener('click', () => {
    db.settings.libView = b.dataset.v; save(); renderLib();
  }));
  $$('.bodymap .mm', view).forEach(m => m.addEventListener('click', () => { location.hash = `#/lib/${m.dataset.r.replace(':', '/')}`; }));
  const sync = () => {
    const q = libQuery.trim();
    $('#lib-home').hidden = !!q;
    if (q) renderLibBody(false, 'all', q); else $('#lib-body').innerHTML = '';
  };
  $('#lib-q').addEventListener('input', e => { libQuery = e.target.value; sync(); });
  sync();
}
function libItem(ex, pickMode) {
  const ss = setsOf(ex.id);
  const eqName = EQUIPMENT.find(x => x[0] === ex.equip)?.[1];
  let meta = [ex.alt, eqName].filter(Boolean).join(' · ') || (animOf(ex)?.primary || []).join(', ') || REGION_BY_ID[ex.region]?.name || '';
  if (ss.length) {
    const last = ss.reduce((a, b) => (a.ts > b.ts ? a : b));
    meta = `${fmtSet(ex, last)} · ${daysAgo(last.date)}`;
  }
  const inner = `${thumb(ex)}<div class="grow"><div class="name">${esc(ex.name)}</div><div class="meta">${esc(meta)}${ex.custom ? ' · özel' : ''}</div></div>${icon(pickMode ? 'plus' : 'chev', 'chev')}`;
  return pickMode ? `<button class="item" data-pick="${esc(ex.id)}" style="width:100%;text-align:left">${inner}</button>`
    : `<a class="item" href="#/ex/${encodeURIComponent(ex.id)}">${inner}</a>`;
}
function renderLibBody(pickMode, scope = libRegion, query = libQuery) {
  if (pickMode) {
    $('#lib-chips').innerHTML = `<button class="chip ${libRegion === 'all' ? 'on' : ''}" data-r="all">Tümü</button>` +
      REGIONS.map(r => `<button class="chip ${libRegion === r.id ? 'on' : ''}" data-r="${r.id}">${r.name}</button>`).join('');
    $$('#lib-chips .chip').forEach(c => c.addEventListener('click', () => { libRegion = c.dataset.r; renderLibBody(true); }));
  }
  const exs = searchEx(allExercises().filter(e => scope === 'all' || e.region === scope), query);
  const regions = scope === 'all' ? REGIONS : REGIONS.filter(r => r.id === scope);
  const html = query.trim() ? (exs.length ? `<div class="group-title">Sonuçlar · ${exs.length}</div><div class="list">${exs.map(e => libItem(e, pickMode)).join('')}</div>` : '') : regions.map(r => {
    const list = exs.filter(e => e.region === r.id);
    if (!list.length) return '';
    return `${regions.length > 1 ? `<div class="group-title">${r.name} · ${list.length}</div>` : '<div style="height:12px"></div>'}<div class="list">${list.map(e => libItem(e, pickMode)).join('')}</div>`;
  }).join('');
  $('#lib-body').innerHTML = html || `<div style="margin-top:14px">${emptyBox('search', 'Sonuç yok', 'Farklı bir arama dene.')}</div>`;
  if (pickMode) $$('[data-pick]', view).forEach(b => b.addEventListener('click', () => {
    const p = picking; picking = null;
    p?.onPick(b.dataset.pick);
    history.back();
  }));
}

function renderNew() {
  setHeader('Yeni hareket', { back: true, always: true });
  view.innerHTML = pageHead('Kendi hareketin', 'Yeni hareket') + `
    <div class="form-row"><label>Hareket adı</label><input class="text-in" id="n-name" placeholder="örn. Landmine Press" maxlength="60"></div>
    <div class="form-row"><label>Bölge</label><select class="text-in" id="n-region">${REGIONS.map(r => `<option value="${r.id}" ${r.id === libRegion ? 'selected' : ''}>${r.name}</option>`).join('')}</select></div>
    <div class="form-row"><label>Takip türü</label><select class="text-in" id="n-type">
      <option value="weight">Ağırlık × tekrar</option><option value="bodyweight">Vücut ağırlığı</option><option value="time">Süre (saniye)</option></select></div>
    <div class="form-row"><label>Görsel (benzer hareket)</label><select class="text-in" id="n-anim">
      <option value="">Görsel yok</option>${REGIONS.map(r => `<optgroup label="${r.name}">${EXERCISES.filter(e => e.region === r.id).map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('')}</optgroup>`).join('')}</select></div>
    <button class="btn" id="n-save">Kaydet</button>`;
  $('#n-save').addEventListener('click', () => {
    const name = $('#n-name').value.trim();
    if (!name) return toast('Hareket adı gir', 'info');
    const id = 'c-' + uid();
    db.custom.push({ id, name, region: $('#n-region').value, type: $('#n-type').value, animFrom: $('#n-anim').value || null });
    save();
    location.replace('#/ex/' + id);
  });
}

// ═════════════════════════ Programlar
function renderPrograms() {
  setHeader('Programlar', { back: true, always: true });
  const auto = autoDays();
  const custom = db.routines;
  view.innerHTML = pageHead(usingRoutines() ? 'Kendi programın aktif' : 'Otomatik program aktif', 'Programlar',
    'Bugün ekranı bu programdaki günleri sırayla önerir.') + `
    <div class="sec"><h2>Kendi programın</h2>${custom.length ? `<span class="row small muted">Kullan ${switchHTML('use-r', usingRoutines())}</span>` : ''}</div>
    ${custom.length ? `<div class="list">${custom.map((r, i) => `<div class="ritem">
        <a class="grow row" href="#/routine/${r.id}"><div class="badge" style="width:40px;height:40px">${i + 1}</div>
        <div class="grow"><div class="name">${esc(r.name)}</div><div class="meta">${r.items.length} hareket · ${r.items.slice(0, 3).map(it => getEx(it.exId)?.name).filter(Boolean).join(', ')}${r.items.length > 3 ? '…' : ''}</div></div></a>
        <button class="ibtn" data-up="${i}" ${i ? '' : 'disabled'} aria-label="Yukarı taşı">${icon('up')}</button>
        <button class="ibtn" data-down="${i}" ${i < custom.length - 1 ? '' : 'disabled'} aria-label="Aşağı taşı">${icon('down')}</button></div>`).join('')}</div>`
      : `<div class="card muted small">Kendi antrenman günlerini oluştur: hareketleri, set ve tekrar hedeflerini sen seç. Örneğin "Pazartesi · Göğüs & Arka kol".</div>`}
    <button class="btn" id="r-new" style="margin-top:10px">${icon('plus')} Yeni gün ekle</button>
    ${custom.length ? '' : `<button class="btn ghost" id="r-copy" style="margin-top:10px">Otomatik programı kopyala ve düzenle</button>`}
    <div class="sec"><h2>Otomatik program</h2><span class="faint small">${SPLITS[splitKey(db.profile.days || 3)].name}</span></div>
    <div class="card">
      <div class="muted small" style="margin-bottom:10px">Profilindeki hedefe (${GOALS[db.profile.goal]}) ve haftalık gün sayısına (${db.profile.days}) göre otomatik oluşturulur.</div>
      ${auto.map(d => `<div class="kv"><span>${esc(d.name)}</span><span class="small">${d.items.map(i => getEx(i.exId)?.name).join(', ')}</span></div>`).join('')}
    </div>`;
  $('#use-r')?.addEventListener('click', () => { db.settings.useRoutines = !usingRoutines(); save(); renderPrograms(); });
  $('#r-new').addEventListener('click', () => {
    const r = { id: 'r-' + uid(), name: `Gün ${db.routines.length + 1}`, items: [] };
    db.routines.push(r); db.settings.useRoutines = true; save();
    location.hash = '#/routine/' + r.id;
  });
  $('#r-copy')?.addEventListener('click', () => {
    db.routines = auto.map(d => ({ id: 'r-' + uid(), name: d.name, items: d.items.map(i => ({ ...i })) }));
    db.settings.useRoutines = true; save(); toast('Program kopyalandı'); renderPrograms();
  });
  const move = (i, d) => { const r = db.routines; [r[i], r[i + d]] = [r[i + d], r[i]]; save(); renderPrograms(); };
  $$('[data-up]', view).forEach(b => b.addEventListener('click', () => move(+b.dataset.up, -1)));
  $$('[data-down]', view).forEach(b => b.addEventListener('click', () => move(+b.dataset.down, 1)));
}

function renderRoutine(id) {
  const r = db.routines.find(x => x.id === id);
  if (!r) { location.replace('#/programs'); return; }
  setHeader(r.name, { back: true, always: true });
  view.innerHTML = `
    <div class="form-row" style="margin-top:8px"><label>Gün adı</label><input class="text-in" id="r-name" value="${esc(r.name)}" maxlength="40"></div>
    <div class="sec" style="margin-top:18px"><h2>Hareketler</h2><span class="faint small">${r.items.length}</span></div>
    ${r.items.length ? `<div class="list">${r.items.map((it, i) => { const ex = getEx(it.exId); return `<div class="ritem">
        ${thumb(ex)}<button class="grow" data-edit="${i}" style="text-align:left"><div class="name">${esc(ex?.name || 'Silinmiş hareket')}</div><div class="meta">${schemeText(it, ex)}</div></button>
        <button class="ibtn" data-up="${i}" ${i ? '' : 'disabled'} aria-label="Yukarı">${icon('up')}</button>
        <button class="ibtn" data-down="${i}" ${i < r.items.length - 1 ? '' : 'disabled'} aria-label="Aşağı">${icon('down')}</button>
        <button class="ibtn" data-rm="${i}" aria-label="Kaldır">${icon('x')}</button></div>`; }).join('')}</div>`
      : emptyBox('dumbbell', 'Henüz hareket yok', 'Bu güne hareket ekleyerek başla.')}
    <button class="btn ghost" id="r-add" style="margin-top:10px">${icon('plus')} Hareket ekle</button>
    ${r.items.length ? `<button class="btn" id="r-start" style="margin-top:10px">${icon('play')} Bu günü şimdi başlat</button>` : ''}
    <div style="margin-top:22px"><button class="btn danger" id="r-del">Günü sil</button></div>`;
  const rerender = () => { const y = scrollY; renderRoutine(id); scrollTo(0, y); };
  $('#r-name').addEventListener('change', e => { r.name = e.target.value.trim() || r.name; save(); setHeader(r.name, { back: true, always: true }); });
  $('#r-add').addEventListener('click', () => pickExercise(`"${r.name}" gününe hareket ekle`, exId => {
    r.items.push({ exId, ...schemeObj(r.items.length ? 1 : 0, exId) }); save();
  }));
  $('#r-start')?.addEventListener('click', () => startSession({ key: r.id, name: r.name, items: r.items }));
  $('#r-del').addEventListener('click', () => {
    if (!confirm(`"${r.name}" silinsin mi?`)) return;
    db.routines = db.routines.filter(x => x.id !== id); save(); location.replace('#/programs');
  });
  const move = (i, d) => { const a = r.items; [a[i], a[i + d]] = [a[i + d], a[i]]; save(); rerender(); };
  $$('[data-up]', view).forEach(b => b.addEventListener('click', () => move(+b.dataset.up, -1)));
  $$('[data-down]', view).forEach(b => b.addEventListener('click', () => move(+b.dataset.down, 1)));
  $$('[data-rm]', view).forEach(b => b.addEventListener('click', () => { r.items.splice(+b.dataset.rm, 1); save(); rerender(); }));
  $$('[data-edit]', view).forEach(b => b.addEventListener('click', () => {
    const it = r.items[+b.dataset.edit];
    const ex = getEx(it.exId);
    const { el, close } = openSheet(`
      <div class="sheet-title">${esc(ex?.name || '')}</div>
      <div class="in-row"><div class="in-box"><label>Set</label><input id="s-sets" inputmode="numeric" value="${it.sets}"></div><div class="in-box"><label>&nbsp;</label><input disabled value=""></div></div>
      <div class="in-row"><div class="in-box"><label>En az ${ex?.type === 'time' ? 'sn' : 'tekrar'}</label><input id="s-min" inputmode="numeric" value="${it.min}"></div>
        <div class="in-box"><label>En çok ${ex?.type === 'time' ? 'sn' : 'tekrar'}</label><input id="s-max" inputmode="numeric" value="${it.max}"></div></div>
      <div class="faint small" style="margin-top:10px">Tüm setlerde "en çok" tekrara ulaşınca uygulama ağırlığı artırmanı önerir.</div>
      <div class="sheet-actions"><button class="btn ghost" id="s-cancel">Vazgeç</button><button class="btn" id="s-ok">Kaydet</button></div>`);
    $('#s-cancel', el).addEventListener('click', close);
    $('#s-ok', el).addEventListener('click', () => {
      it.sets = clamp(Math.round(num($('#s-sets', el).value)) || 3, 1, 10);
      it.min = Math.max(1, Math.round(num($('#s-min', el).value)) || 8);
      it.max = Math.max(it.min, Math.round(num($('#s-max', el).value)) || it.min);
      save(); close(); rerender();
    });
  }));
}

// ═════════════════════════ Video / fotoğraf oynatıcı
const MEDIA_CACHE = 'gym-media-v1';
const videoCount = () => EXERCISES.reduce((n, e) => n + (e.videos?.length || 0), 0);
// Video önce telefondaki önbellekten, yoksa internetten alınır ve kaydedilir; iOS için blob URL döner.
async function mediaURL(src) {
  try {
    const cache = await caches.open(MEDIA_CACHE);
    let res = await cache.match(src);
    if (!res) {
      res = await fetch(src);
      if (!res.ok) throw new Error(res.status);
      await cache.put(src, res.clone());
    }
    return URL.createObjectURL(await res.blob());
  } catch {
    return src;
  }
}
function mountMedia(box, anim) {
  if (anim.videos?.length) {
    const vids = anim.videos;
    box.innerHTML = `<div class="media">
      <video playsinline muted loop autoplay preload="auto" poster="${vids[0].poster}"></video>
      <span class="credit glass">Goulart · wger · CC BY-SA</span>
      <div class="media-ctl">
        <button class="mbtn glass" id="m-play" aria-label="Durdur">${icon('pause')}</button>
        <button class="mbtn glass" id="m-speed">1×</button>
        <span class="grow"></span>
        ${vids.length > 1 ? `<span class="mseg glass">${vids.map((v, i) => `<b data-i="${i}" class="${i ? '' : 'on'}">Açı ${i + 1}</b>`).join('')}</span>` : ''}
      </div>
      <div class="mload glass" hidden>Yükleniyor…</div>
    </div>`;
    const player = $('.media', box), video = $('video', player), load = $('.mload', player), playBtn = $('#m-play', player);
    const urls = [];
    let speed = 1, alive = true;
    const pick = async i => {
      $$('.mseg b', player).forEach(b => b.classList.toggle('on', +b.dataset.i === i));
      video.poster = vids[i].poster;
      const t = setTimeout(() => (load.hidden = false), 300);
      const url = await mediaURL(vids[i].src);
      clearTimeout(t); load.hidden = true;
      if (!alive) return URL.revokeObjectURL(url);
      if (url.startsWith('blob:')) urls.push(url);
      video.src = url;
      video.playbackRate = speed;
      video.play().catch(() => {});
      if (url === vids[i].src && !navigator.onLine) { load.textContent = 'Bu video henüz indirilmedi'; load.hidden = false; }
    };
    const toggle = () => (video.paused ? video.play().catch(() => {}) : video.pause());
    video.addEventListener('play', () => (playBtn.innerHTML = icon('pause')));
    video.addEventListener('pause', () => (playBtn.innerHTML = icon('play')));
    playBtn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    player.addEventListener('click', toggle);
    $('#m-speed', player).addEventListener('click', e => {
      e.stopPropagation();
      speed = speed === 1 ? 0.5 : speed === 0.5 ? 0.25 : 1;
      video.playbackRate = speed;
      e.currentTarget.textContent = String(speed).replace('.', ',') + '×';
    });
    $$('.mseg b', player).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); pick(+b.dataset.i); }));
    pick(0);
    return () => { alive = false; video.pause(); video.removeAttribute('src'); urls.forEach(u => URL.revokeObjectURL(u)); };
  }
  box.innerHTML = `<div class="media">
    <img class="ph" src="${anim.img[0]}" alt="">
    <img class="ph ph1" src="${anim.img[1]}" alt="">
    <div class="media-ctl">
      <button class="mbtn glass" id="m-play" aria-label="Durdur">${icon('pause')}</button>
      <span class="grow"></span>
      <span class="mseg glass"><b data-f="0" class="on">Başlangıç</b><b data-f="1">Bitiş</b></span>
    </div>
  </div>`;
  const photo = $('.media', box), playBtn = $('#m-play', photo);
  let frame = 0, playing = true, timer = null;
  const setFrame = f => {
    frame = f;
    photo.classList.toggle('f1', f === 1);
    $$('.mseg b', photo).forEach(b => b.classList.toggle('on', +b.dataset.f === f));
  };
  const loop = () => { timer = setTimeout(() => { setFrame(1 - frame); loop(); }, 1300); };
  const setPlaying = p => { playing = p; playBtn.innerHTML = icon(p ? 'pause' : 'play'); clearTimeout(timer); if (p) loop(); };
  loop();
  playBtn.addEventListener('click', e => { e.stopPropagation(); setPlaying(!playing); });
  $$('.mseg b', photo).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); setPlaying(false); setFrame(+b.dataset.f); }));
  photo.addEventListener('click', () => { setPlaying(false); setFrame(1 - frame); });
  return () => clearTimeout(timer);
}

// ═════════════════════════ Hareket değiştirme ve notlar
// Aynı kası çalıştıran alternatifler: önce aynı alt grup, sonra aynı bölge
function alternatives(ex, exclude = []) {
  const pool = allExercises().filter(e => e.id !== ex.id && !exclude.includes(e.id) && e.region === ex.region);
  const same = pool.filter(e => ex.sub && e.sub === ex.sub);
  const rank = e => (e.videos ? 0 : 1) + (e.equip === ex.equip ? 0.5 : 0);
  return { same: same.sort((a, b) => rank(a) - rank(b)), other: pool.filter(e => !same.includes(e)).sort((a, b) => rank(a) - rank(b)) };
}
function swapSheet(idx, after) {
  const s = db.session, it = s.items[idx], ex = getEx(it.exId);
  const done = working(db.sets.filter(x => x.exId === it.exId && x.ts >= s.start)).length;
  const { same, other } = alternatives(ex, s.items.map(i => i.exId));
  const eqName = e => EQUIPMENT.find(x => x[0] === e.equip)?.[1] || '';
  const row = e => `<button class="item" data-alt="${esc(e.id)}" style="width:100%;text-align:left">${thumb(e)}
    <div class="grow"><div class="name">${esc(e.name)}</div><div class="meta">${esc([eqName(e), subName(e.region, e.sub)].filter(Boolean).join(' · '))}</div></div>${icon('swap', 'chev')}</button>`;
  const { el, close } = openSheet(`
    <div class="sheet-title">${esc(ex.name)} yerine</div>
    <div class="faint small" style="margin:-6px 2px 12px">${done ? `Bu hareketle ${done} set yaptın; seçtiğin hareket antrenmana ayrıca eklenecek.` : 'Makine doluysa ya da ekipman yoksa aynı kası çalıştıran bir hareket seç.'}</div>
    ${same.length ? `<div class="group-title" style="margin-top:4px">Aynı kas · ${esc(subName(ex.region, ex.sub))}</div><div class="list">${same.map(row).join('')}</div>` : ''}
    ${other.length ? `<details class="alt-more"${same.length ? '' : ' open'}><summary class="group-title">${esc(REGION_BY_ID[ex.region]?.name || '')} bölgesinden diğerleri · ${other.length}</summary><div class="list">${other.map(row).join('')}</div></details>` : ''}`);
  $$('[data-alt]', el).forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.alt, nex = getEx(id);
    if (done) { s.items.splice(idx + 1, 0, { ...it, exId: id }); s.cur = idx + 1; }
    else { s.items[idx] = { ...it, exId: id }; s.cur = idx; }
    if (nex.type !== ex.type) Object.assign(s.items[s.cur], schemeObj(1, id), { sets: it.sets });
    save(); close(); toast(`${nex.name} ile devam`, 'swap'); after();
  }));
}
const exNote = id => (db.notes[id] || '').trim();
function noteSheet(ex, after) {
  const { el, close } = openSheet(`
    <div class="sheet-title">${esc(ex.name)} · not</div>
    <textarea class="note-in" id="n-text" maxlength="300" placeholder="Örn. makine koltuğu 4. kademe, dar tutuşta bileğim ağrıyor…">${esc(db.notes[ex.id] || '')}</textarea>
    <div class="faint small" style="margin-top:8px">Bu hareketi her açtığında ve antrenmanda görünür.</div>
    <div class="sheet-actions"><button class="btn ghost" id="n-del">${exNote(ex.id) ? 'Notu sil' : 'Vazgeç'}</button><button class="btn" id="n-save">Kaydet</button></div>`);
  const t = $('#n-text', el);
  setTimeout(() => t.focus(), 250);
  $('#n-del', el).addEventListener('click', () => { if (exNote(ex.id)) { delete db.notes[ex.id]; save(); after(); } close(); });
  $('#n-save', el).addEventListener('click', () => {
    const v = t.value.trim();
    if (v) db.notes[ex.id] = v; else delete db.notes[ex.id];
    save(); close(); toast(v ? 'Not kaydedildi' : 'Not silindi', 'edit'); after();
  });
}
const noteBox = (ex, id = 'ex-note') => exNote(ex.id)
  ? `<button class="note-box" id="${id}">${icon('edit')}<span>${esc(exNote(ex.id))}</span></button>` : '';

// ═════════════════════════ Rekor kutlaması
let prTimer;
function celebratePR(ex, s) {
  const prev = bestSet(ex, setsOf(ex.id).filter(x => x.ts < s.ts));
  if (!prev) return;
  const type = ex.type || 'weight';
  let detail = `Önceki en iyi: ${fmtSet(ex, prev)}`;
  if (type === 'weight') {
    const gain = e1rm(s.w, s.r) - e1rm(prev.w, prev.r);
    if (s.w > prev.w) detail += ` · en ağır setin +${fmtN(s.w - prev.w)} kg`;
    else if (gain >= 0.5) detail += ` · tahmini maksimum +${fmtN(gain, 1)} kg`;
  }
  let el = $('#pr');
  if (!el) { el = document.createElement('div'); el.id = 'pr'; document.body.appendChild(el); el.addEventListener('click', () => el.classList.remove('show')); }
  el.innerHTML = `<div class="pr-card">
    <div class="pr-burst">${[...Array(12)].map((_, i) => `<i style="--a:${i * 30}deg;--d:${(i % 3) * 60}ms"></i>`).join('')}</div>
    <div class="pr-ic">${icon('trophy')}</div>
    <div class="pr-t">Yeni rekor!</div>
    <div class="pr-v num">${esc(fmtSet(ex, s))}</div>
    <div class="pr-ex">${esc(ex.name)}</div>
    <div class="pr-d">${esc(detail)}</div></div>`;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  chime();
  clearTimeout(prTimer);
  prTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
function chime() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  [[0, 523], [0.12, 659], [0.24, 784], [0.36, 1047]].forEach(([i, f]) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.0001, t + i); g.gain.exponentialRampToValueAtTime(0.25, t + i + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i + 0.35);
    o.start(t + i); o.stop(t + i + 0.4);
  });
}

// ═════════════════════════ Süperset: art arda yapılan, aralarında dinlenilmeyen hareketler
const ssMembers = (s, tag) => s.items.map((it, i) => (it.ss === tag ? i : -1)).filter(i => i >= 0);
function ssLabels(s) {
  // Grupları sırayla A, B, C… olarak adlandır
  const out = {}; let n = 0;
  for (const it of s.items) if (it.ss && !(it.ss in out)) out[it.ss] = String.fromCharCode(65 + n++);
  return out;
}
function cleanSupersets(s) {
  // Tek kalan üyeleri gruptan çıkar
  for (const it of s.items) if (it.ss && ssMembers(s, it.ss).length < 2) delete it.ss;
}
function supersetSheet(idx, after) {
  const s = db.session, it = s.items[idx], ex = getEx(it.exId);
  if (it.ss) {
    const names = ssMembers(s, it.ss).map(i => getEx(s.items[i].exId)?.name).join(' + ');
    const { el, close } = openSheet(`
      <div class="sheet-title">Süperset</div>
      <div class="muted" style="margin-bottom:14px">${esc(names)}</div>
      <div class="faint small" style="margin-bottom:6px">Süpersette bir hareketin setini bitirince dinlenmeden diğerine geçersin; tur bitince dinlenirsin.</div>
      <div class="sheet-actions"><button class="btn ghost" id="ss-close">Kapat</button><button class="btn danger" id="ss-remove">Süperseti kaldır</button></div>`);
    $('#ss-close', el).addEventListener('click', close);
    $('#ss-remove', el).addEventListener('click', () => {
      const tag = it.ss; for (const i of ssMembers(s, tag)) delete s.items[i].ss;
      save(); close(); toast('Süperset kaldırıldı', 'x'); after();
    });
    return;
  }
  const others = s.items.map((x, i) => ({ x, i })).filter(({ x, i }) => i !== idx && getEx(x.exId));
  const join = j => {
    const partner = s.items[j];
    const tag = partner.ss || uid();
    if (partner.ss) {
      // Mevcut bir süperset grubuna katıl: bu hareketi grubun sonuna taşı
      s.items.splice(s.items.indexOf(it), 1);
      s.items.splice(Math.max(...ssMembers(s, tag)) + 1, 0, it);
    } else {
      // Seçilen hareketi bu hareketin hemen altına taşı
      s.items.splice(j, 1);
      s.items.splice(s.items.indexOf(it) + 1, 0, partner);
    }
    it.ss = tag; partner.ss = tag;
    s.cur = s.items.indexOf(it);
    cleanSupersets(s); save(); after();
    toast('Süperset oluşturuldu', 'bolt');
  };
  const { el, close } = openSheet(`
    <div class="sheet-title">${esc(ex.name)} ile süperset</div>
    <div class="faint small" style="margin:-6px 2px 12px">İki hareketi art arda yap, ikisi bitince dinlen. Zamandan kazandırır; genelde zıt kaslarla (göğüs + sırt, biceps + triceps) yapılır.</div>
    ${others.length ? `<div class="group-title" style="margin-top:4px">Antrenmandaki hareketler</div><div class="list">${others.map(({ x, i }) => {
      const e = getEx(x.exId);
      return `<button class="item" data-j="${i}" style="width:100%;text-align:left">${thumb(e)}<div class="grow"><div class="name">${esc(e.name)}</div>
        <div class="meta">${esc(subName(e.region, e.sub) || REGION_BY_ID[e.region]?.name || '')}${x.ss ? ' · süpersette' : ''}</div></div>${icon('plus', 'chev')}</button>`;
    }).join('')}</div>` : ''}
    <button class="btn ghost" id="ss-new" style="margin-top:12px">${icon('plus')} Yeni hareket seç</button>`);
  $$('[data-j]', el).forEach(b => b.addEventListener('click', () => { close(); join(+b.dataset.j); }));
  $('#ss-new', el).addEventListener('click', () => {
    close();
    pickExercise(`${ex.name} ile süperset`, id => {
      if (!s.items.some(i => i.exId === id)) s.items.push({ exId: id, ...schemeObj(1, id), sets: it.sets });
      join(s.items.findIndex(i => i.exId === id));
    });
  });
}

// ═════════════════════════ Spor modları (gym / tenis / pilates)
const sport = () => (SPORTS[db.settings.sport] ? db.settings.sport : 'gym');
const SPORT_TAB = { gym: ['lib', 'Hareketler', 'dumbbell'], tennis: ['tennis', 'Tenis', 'tennis'], pilates: ['pilates', 'Pilates', 'pilates'] };
function renderTabs() {
  const tabs = [['today', 'Bugün', 'home'], SPORT_TAB[sport()], ['nutrition', 'Beslenme', 'fork'], ['hist', 'Geçmiş', 'calendar'], ['profile', 'Profil', 'user']];
  $('#tabs').innerHTML = tabs.map(([id, t, ic]) => `<a href="#/${id}" data-tab="${id}">${icon(ic)}<span>${t}</span></a>`).join('');
}
// Üst çubuktaki spor çipi: tek dokunuşla spor değiştirme
function sportChipHTML() {
  const sp = SPORTS[sport()];
  const tip = !db.settings.tipSport && db.settings.onboarded ? `<div class="chip-tip" id="chip-tip">Sporu buradan değiştirebilirsin<button aria-label="Kapat">${icon('x')}</button></div>` : '';
  return `<button class="sport-chip" id="sport-chip" aria-label="Spor değiştir">${icon(sp.icon)}<b>${sp.name}</b>${icon('down')}</button>${tip}`;
}
function bindSportChip() {
  const dismiss = () => { if (!db.settings.tipSport) { db.settings.tipSport = true; save(); } $('#chip-tip')?.remove(); };
  $('#chip-tip')?.addEventListener('click', e => { e.stopPropagation(); dismiss(); });
  $('#sport-chip').addEventListener('click', () => { dismiss(); sportSheet(); });
}
function sportSheet() {
  const { el, close } = openSheet(`
    <div class="sheet-title">Spor seç</div>
    ${Object.entries(SPORTS).map(([k, sp]) => `<button class="choice ${sport() === k ? 'on' : ''}" data-sport="${k}"><div class="ic">${icon(sp.icon)}</div><div><b>${sp.name}</b><span>${sp.desc}</span></div></button>`).join('')}
    <div class="faint small" style="text-align:center;margin-top:12px">Kayıtların silinmez; istediğin zaman geri dönebilirsin.</div>`);
  $$('[data-sport]', el).forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.sport;
    close();
    if (k === sport()) return;
    db.settings.sport = k; save(); renderTabs();
    toast(`${SPORTS[k].name} moduna geçildi`, SPORTS[k].icon);
    const second = SPORT_TAB[k][0];
    if (location.hash === '#/today' || location.hash === '#/' || !location.hash) route(); else location.hash = currentRoute === 'today' ? '#/today' : `#/${second}`;
  }));
}
const LEVEL_NAMES = { tennis: ['Yeni başlıyorum', 'Bir süredir oynuyorum', 'İleri / turnuva'], pilates: ['Başlangıç', 'Orta', 'İleri'] };
const levelOf = () => clamp(db.profile.level || 1, 1, 3);

// Etkinlik kayıtları (tenis maçı/antrenmanı, rutin, pilates seansı)
const actOn = day => db.activities.filter(a => a.date === day);
const actKcal = (met, min, factor = 1) => met * factor * bodyKg() * (min / 60);
const typeName = a => a.sport === 'tennis' && a.kind !== 'routine' ? (TENNIS_TYPES.find(t => t[0] === a.kind)?.[1] || 'Tenis') : (a.name || 'Etkinlik');
function addActivity(a) {
  db.activities.push({ id: uid(), date: dayKey(), ts: Date.now(), ...a });
  save();
}
function activityRow(a, { del = false } = {}) {
  const ic = a.sport === 'tennis' ? 'tennis' : a.sport === 'pilates' ? 'pilates' : 'run';
  const res = a.result === 'win' ? '<span class="pill good">Galibiyet</span>' : a.result === 'loss' ? '<span class="pill fire">Mağlubiyet</span>' : '';
  const meta = [a.min ? `${fmtInt(a.min)} dk` : '', a.score ? esc(a.score) : '', a.opp ? `vs ${esc(a.opp)}` : '', a.focus ? esc(a.focus.join(', ')) : '', a.surface ? SURFACES.find(s => s[0] === a.surface)?.[1] : ''].filter(Boolean).join(' · ');
  return `<div class="act-row" ${del ? `data-act="${a.id}"` : ''}><div class="plan-icon act-ic ${a.sport}">${icon(ic)}</div>
    <div class="grow"><div style="font-weight:600">${esc(typeName(a))}</div><div class="faint small num">${meta}${a.note ? ` · ${esc(a.note)}` : ''}</div></div>
    ${res}<span class="pill fire num">${icon('flame')}${fmtInt(a.kcal)}</span></div>`;
}
function bindActivityDelete(root, after) {
  $$('[data-act]', root).forEach(r => r.addEventListener('click', () => {
    if (!confirm('Bu kayıt silinsin mi?')) return;
    db.activities = db.activities.filter(a => a.id !== r.dataset.act); save(); after();
  }));
}

// Tenis maçı / antrenmanı kaydı: set set skor, rakip ve seviyesi, isteğe bağlı istatistikler
const OPP_REL = [['weak', 'Benden zayıf', -1.5], ['eq', 'Benzer', 0], ['strong', 'Benden güçlü', 1.5]];
const FOCUS = ['Servis', 'Forehand', 'Backhand', 'Vole', 'Smaç', 'Return', 'Ayak çalışması', 'Maç oyunu'];
const STAT_FIELDS = [['ace', 'Ace'], ['df', 'Çift hata'], ['win', 'Winner'], ['ue', 'Unforced error']];
// Set dizisi → "6-4 7-6(5) [10-8]"
function fmtScore(sets) {
  return sets.map(([m, o, tm, to, st]) => st ? `[${m}-${o}]` : `${m}-${o}${tm != null && to != null && (m + o === 13) ? `(${Math.min(tm, to)})` : ''}`).join(' ');
}
const setWinner = ([m, o]) => (m > o ? 1 : o > m ? -1 : 0);
function setsResult(sets) {
  let w = 0, l = 0;
  for (const s of sets) { const r = setWinner(s); if (r > 0) w++; else if (r < 0) l++; }
  return { w, l, result: w > l ? 'win' : l > w ? 'loss' : '' };
}
function tennisLogSheet(after, preset = {}) {
  let type = preset.kind || 'single', intensity = 'medium', surface = db.settings.surface || 'hard', resultOverride = null;
  let sets = [[0, 0]], superTb = false, rel = 'eq';
  const focus = new Set(preset.focus || []);
  const opps = [...new Set(db.activities.filter(a => a.opp).map(a => a.opp))];
  const isMatch = () => type === 'single' || type === 'double';
  const { el, close } = openSheet(`
    <div class="sheet-title">Tenis kaydı</div>
    <div class="opt-grid" id="tl-type">${TENNIS_TYPES.map(([k, n]) => `<button class="opt ${k === type ? 'on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="in-row" style="margin-top:10px">
      <div class="in-box"><label>Süre · dk</label><input id="tl-min" inputmode="numeric" value="${preset.min || (isMatch() ? 90 : 60)}"></div>
      <div class="in-box"><label>Yoğunluk</label><div class="mini-seg" id="tl-int">${INTENSITY.map(([k, n]) => `<button data-v="${k}" class="${k === intensity ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    </div>
    <div id="tl-match">
      <div class="card-label" style="margin:16px 4px 8px">Rakip</div>
      <div class="in-row"><div class="in-box" style="flex:1"><label>İsim (isteğe bağlı)</label><input id="tl-opp" list="tl-opps" placeholder="—" autocomplete="off"></div></div>
      <datalist id="tl-opps">${opps.map(o => `<option value="${esc(o)}">`).join('')}</datalist>
      <div class="mini-seg" id="tl-rel" style="margin-top:8px">${OPP_REL.map(([k, n]) => `<button data-v="${k}" class="${k === rel ? 'on' : ''}">${n}</button>`).join('')}</div>
      <div class="in-row" id="tl-partner-row" style="margin-top:8px"><div class="in-box" style="flex:1"><label>Partnerin (çiftler)</label><input id="tl-partner" placeholder="—" autocomplete="off"></div></div>
      <div class="card-label" style="margin:16px 4px 8px">Skor <span class="faint" style="text-transform:none;letter-spacing:0;font-weight:600">· ben – rakip</span></div>
      <div id="tl-sets"></div>
      <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">
        <button class="chip" id="tl-add-set">${icon('plus')} Set ekle</button>
        <button class="chip" id="tl-del-set">Son seti sil</button>
        <button class="chip" id="tl-stb">Süper tie-break</button>
      </div>
      <div class="tl-result" id="tl-result"></div>
      <div class="mini-seg" id="tl-res" style="margin-top:8px"><button data-v="auto" class="on">Otomatik</button><button data-v="win">Kazandım</button><button data-v="loss">Kaybettim</button><button data-v="">Yarım kaldı</button></div>
      <details class="tl-more"><summary>Detaylı istatistik (isteğe bağlı)</summary>
        <div class="stat-grid">${STAT_FIELDS.map(([k, n]) => `<div class="in-box"><label>${n}</label><input data-stat="${k}" inputmode="numeric" placeholder="—"></div>`).join('')}
          <div class="in-box"><label>1. servis %</label><input data-stat="fs" inputmode="numeric" placeholder="—"></div></div>
      </details>
    </div>
    <div id="tl-practice">
      <div class="card-label" style="margin:16px 4px 8px">Neye çalıştın?</div>
      <div class="chip-wrap" id="tl-focus">${FOCUS.map(f => `<button class="chip ${focus.has(f) ? 'on' : ''}" data-f="${f}">${f}</button>`).join('')}</div>
    </div>
    <div class="card-label" style="margin:16px 4px 8px">Kort</div>
    <div class="mini-seg" id="tl-surf">${SURFACES.map(([k, n]) => `<button data-v="${k}" class="${k === surface ? 'on' : ''}">${n}</button>`).join('')}</div>
    <textarea class="note-in" id="tl-note" style="min-height:60px;margin-top:12px" maxlength="200" placeholder="Not: ör. servis iyiydi, backhand hatası çoktu">${esc(preset.note || '')}</textarea>
    <div class="sheet-actions sticky"><button class="btn ghost" id="tl-cancel">Vazgeç</button><button class="btn" id="tl-save">Kaydet</button></div>`);
  const drawSets = () => {
    $('#tl-sets', el).innerHTML = sets.map((s, i) => {
      const stb = superTb && i === sets.length - 1, tb = !stb && s[0] + s[1] === 13;
      const step = (k, v) => `<div class="sc"><button data-i="${i}" data-k="${k}" data-d="-1">${icon('minus')}</button><b class="num">${v}</b><button data-i="${i}" data-k="${k}" data-d="1">${icon('plus')}</button></div>`;
      return `<div class="set-row ${setWinner(s) > 0 ? 'won' : setWinner(s) < 0 ? 'lost' : ''}"><span>${stb ? 'Süper TB' : `${i + 1}. set`}</span>${step(0, s[0])}<i>–</i>${step(1, s[1])}</div>
        ${tb ? `<div class="tb-row"><span>Tie-break</span><input data-tb="${i}" data-k="2" inputmode="numeric" placeholder="ben" value="${s[2] ?? ''}"><i>–</i><input data-tb="${i}" data-k="3" inputmode="numeric" placeholder="rakip" value="${s[3] ?? ''}"></div>` : ''}`;
    }).join('');
    $$('#tl-sets [data-d]', el).forEach(b => b.addEventListener('click', () => {
      const s = sets[+b.dataset.i], k = +b.dataset.k, max = superTb && +b.dataset.i === sets.length - 1 ? 30 : 13;
      s[k] = clamp(s[k] + +b.dataset.d, 0, max); drawSets();
    }));
    $$('#tl-sets [data-tb]', el).forEach(inp => inp.addEventListener('input', () => { sets[+inp.dataset.tb][+inp.dataset.k] = inp.value === '' ? undefined : Math.round(num(inp.value)); }));
    $('#tl-stb', el).classList.toggle('on', superTb);
    const r = setsResult(sets), any = sets.some(s => s[0] || s[1]);
    $('#tl-result', el).innerHTML = any ? `${r.result === 'win' ? '<b class="good">Kazandın</b>' : r.result === 'loss' ? '<b class="bad">Kaybettin</b>' : '<b>Berabere / yarım</b>'} <span class="num">${r.w}–${r.l}</span> · ${esc(fmtScore(sets.map((s, i) => [s[0], s[1], s[2], s[3], superTb && i === sets.length - 1])))}` : '<span class="faint">Oyun sayılarını gir</span>';
  };
  const sync = () => {
    $('#tl-match', el).hidden = !isMatch();
    $('#tl-practice', el).hidden = isMatch();
    $('#tl-partner-row', el).hidden = type !== 'double';
  };
  const seg = (sel, set) => $$(`${sel} button`, el).forEach(b => b.addEventListener('click', () => { set(b.dataset.v); $$(`${sel} button`, el).forEach(x => x.classList.toggle('on', x === b)); }));
  $$('#tl-type .opt', el).forEach(b => b.addEventListener('click', () => {
    type = b.dataset.k; $$('#tl-type .opt', el).forEach(x => x.classList.toggle('on', x === b));
    if (isMatch() && num($('#tl-min', el).value) === 60) $('#tl-min', el).value = 90;
    sync();
  }));
  seg('#tl-int', v => (intensity = v)); seg('#tl-surf', v => (surface = v)); seg('#tl-rel', v => (rel = v));
  seg('#tl-res', v => (resultOverride = v === 'auto' ? null : v));
  $('#tl-opp', el).addEventListener('change', e => {
    const r = db.opponents[e.target.value.trim()]?.rel;
    if (r) { rel = r; $$('#tl-rel button', el).forEach(x => x.classList.toggle('on', x.dataset.v === r)); }
  });
  $('#tl-add-set', el).addEventListener('click', () => { if (sets.length < 5) { sets.push([0, 0]); drawSets(); } });
  $('#tl-del-set', el).addEventListener('click', () => { if (sets.length > 1) { sets.pop(); drawSets(); } });
  $('#tl-stb', el).addEventListener('click', () => { superTb = !superTb; drawSets(); });
  $$('#tl-focus .chip', el).forEach(b => b.addEventListener('click', () => { focus.has(b.dataset.f) ? focus.delete(b.dataset.f) : focus.add(b.dataset.f); b.classList.toggle('on', focus.has(b.dataset.f)); }));
  sync(); drawSets();
  $('#tl-cancel', el).addEventListener('click', close);
  $('#tl-save', el).addEventListener('click', () => {
    const min = clamp(Math.round(num($('#tl-min', el).value)), 1, 600);
    const met = TENNIS_TYPES.find(t => t[0] === type)[2], f = INTENSITY.find(i => i[0] === intensity)[2];
    const a = { sport: 'tennis', kind: type, min, intensity, surface, kcal: actKcal(met, min, f), note: $('#tl-note', el).value.trim() || undefined };
    if (isMatch()) {
      const played = sets.filter(s => s[0] || s[1]).map((s, i, arr) => {
        const o = [s[0], s[1]];
        if (superTb && i === arr.length - 1) o.push(null, null, 1);
        else if (s[0] + s[1] === 13 && s[2] != null && s[3] != null) o.push(s[2], s[3]);
        return o;
      });
      const r = setsResult(played);
      if (played.length) { a.sets = played; a.score = fmtScore(played); }
      a.result = (resultOverride ?? r.result) || undefined;
      const opp = $('#tl-opp', el).value.trim();
      if (opp) { a.opp = opp; db.opponents[opp] = { rel }; }
      a.oppRel = rel;
      if (type === 'double') a.partner = $('#tl-partner', el).value.trim() || undefined;
      const st = {};
      $$('[data-stat]', el).forEach(inp => { if (inp.value !== '') st[inp.dataset.stat] = Math.max(0, Math.round(num(inp.value))); });
      if (Object.keys(st).length) a.stats = st;
    } else if (focus.size) a.focus = [...focus];
    db.settings.surface = surface;
    addActivity(a); close();
    toast(a.result === 'win' ? 'Tebrikler! Galibiyet kaydedildi' : 'Kaydedildi', a.result === 'win' ? 'trophy' : 'check');
    after();
  });
}

// Kişisel seviye tahmini (1–10): her maçta rakip seviyesi + oyun kazanma oranından bir performans puanı; son maçların ağırlıklı ortalaması
function tennisLevel() {
  const start = { 1: 3, 2: 5, 3: 7 }[levelOf()];
  const matches = db.activities.filter(a => a.sport === 'tennis' && a.sets?.length).sort((a, b) => a.ts - b.ts);
  let cur = start;
  const perfs = [], pts = [];
  for (const m of matches) {
    let my = 0, op = 0;
    for (const s of m.sets) { if (s[4]) { my += s[0] > s[1] ? 1 : 0; op += s[1] > s[0] ? 1 : 0; } else { my += s[0]; op += s[1]; } }
    if (my + op === 0) continue;
    const oppLvl = cur + (OPP_REL.find(r => r[0] === (m.oppRel || 'eq'))?.[2] || 0);
    const perf = clamp(oppLvl + (my / (my + op) - 0.5) * 6, 1, 10);
    perfs.push(perf);
    const recent = perfs.slice(-20);
    const wsum = recent.reduce((t, _, i) => t + i + 1, 0) + 3;
    cur = (recent.reduce((t, p, i) => t + p * (i + 1), 0) + start * 3) / wsum;
    pts.push({ d: m.date, v: cur });
  }
  const prev5 = perfs.length > 5 ? perfs.slice(-10, -5) : [];
  const last5 = perfs.slice(-5);
  const avg = l => l.reduce((a, b) => a + b, 0) / (l.length || 1);
  return { level: cur, n: perfs.length, trend: prev5.length ? avg(last5) - avg(prev5) : 0, perfs, pts };
}

// Tenis istatistikleri
function tennisStatsHTML() {
  const all = db.activities.filter(a => a.sport === 'tennis' && a.kind !== 'routine');
  if (!all.length) return emptyBox('tennis', 'Henüz kayıt yok', 'Maç veya antrenman kaydettiğinde istatistiklerin burada oluşur.');
  const matches = all.filter(a => a.kind === 'single' || a.kind === 'double');
  const dec = matches.filter(a => a.result), wins = dec.filter(a => a.result === 'win').length;
  let gw = 0, gl = 0, tbw = 0, tbl = 0, d3w = 0, d3l = 0;
  for (const m of matches) {
    for (const s of m.sets || []) {
      if (s[4] || s[0] + s[1] === 13) { if (s[0] > s[1]) tbw++; else tbl++; }
      if (!s[4]) { gw += s[0]; gl += s[1]; }
    }
    if (m.sets?.length === 3 && m.result) { if (m.result === 'win') d3w++; else d3l++; }
  }
  const lv = tennisLevel();
  const form = dec.slice(-5).map(a => `<i class="${a.result === 'win' ? 'w' : 'l'}">${a.result === 'win' ? 'G' : 'M'}</i>`).join('');
  const byOpp = new Map();
  for (const m of dec.filter(a => a.opp)) { const o = byOpp.get(m.opp) || { w: 0, l: 0, last: '' }; m.result === 'win' ? o.w++ : o.l++; o.last = m.date; byOpp.set(m.opp, o); }
  const bySurf = SURFACES.map(([k, n]) => [n, dec.filter(a => a.surface === k)]).filter(([, l]) => l.length);
  const withStats = matches.filter(m => m.stats);
  const avgStat = k => { const l = withStats.filter(m => m.stats[k] != null); return l.length ? l.reduce((t, m) => t + m.stats[k], 0) / l.length : null; };
  const focusMin = new Map();
  for (const a of all.filter(x => x.focus)) for (const f of a.focus) focusMin.set(f, (focusMin.get(f) || 0) + a.min / a.focus.length);
  const hours = all.reduce((s, a) => s + a.min, 0) / 60;
  const stat = (lbl, val, sub = '') => `<div class="metric"><div class="lbl">${lbl}</div><b class="num">${val}</b>${sub ? `<div class="note">${sub}</div>` : ''}</div>`;
  return `
    <div class="card level-card">
      <div class="row"><div class="grow"><div class="card-label">Kişisel seviye tahmini ${helpBtn('tlevel')}</div>
        <div class="lv-big"><b class="num">${fmtN(lv.level, 1)}</b><span>/ 10</span>${lv.n >= 6 && Math.abs(lv.trend) >= 0.1 ? `<em class="${lv.trend > 0 ? 'up' : 'down'}">${lv.trend > 0 ? '▲' : '▼'} ${fmtN(Math.abs(lv.trend), 1)}</em>` : ''}</div>
        <div class="faint small">${lv.n ? `${lv.n} maçtan hesaplandı` : 'Set skoru girdiğin maçlarla hesaplanır'}</div></div>
        ${form ? `<div class="form-chips">${form}</div>` : ''}</div>
      ${lv.perfs.length > 1 ? `<canvas class="chart" id="lv-chart" style="height:110px;margin-top:10px"></canvas>` : ''}
    </div>
    <div class="metric-grid" style="margin-top:10px">
      ${stat('Maç', `${wins}G ${dec.length - wins}M`, dec.length ? `%${fmtInt((wins / dec.length) * 100)} galibiyet` : '')}
      ${stat('Oyun kazanma', gw + gl ? `%${fmtInt((gw / (gw + gl)) * 100)}` : '—', gw + gl ? `${gw}–${gl} oyun` : '')}
      ${stat('Tie-break', tbw + tbl ? `${tbw}–${tbl}` : '—')}
      ${stat('3 setlik maçlar', d3w + d3l ? `${d3w}–${d3l}` : '—')}
      ${stat('Toplam süre', fmtN(hours, hours < 10 ? 1 : 0), 'saat')}
      ${stat('Antrenman', all.filter(a => !matches.includes(a)).length, 'seans')}
    </div>
    ${withStats.length ? `<div class="sec"><h2>Maç başına ortalama</h2><span class="faint small">${withStats.length} maç</span></div>
      <div class="metric-grid">${[['ace', 'Ace'], ['df', 'Çift hata'], ['win', 'Winner'], ['ue', 'Unforced error'], ['fs', '1. servis %']].map(([k, n]) => { const v = avgStat(k); return v == null ? '' : stat(n, k === 'fs' ? `%${fmtInt(v)}` : fmtN(v, 1)); }).join('')}</div>` : ''}
    ${byOpp.size ? `<div class="sec"><h2>Rakiplere karşı</h2></div><div class="list">${[...byOpp].sort((a, b) => (b[1].w + b[1].l) - (a[1].w + a[1].l)).map(([n, o]) => `<div class="item"><div class="badge">${esc(n[0].toLocaleUpperCase('tr-TR'))}</div>
      <div class="grow"><div class="name">${esc(n)}</div><div class="meta">Son maç ${daysAgo(o.last)}</div></div><b class="num ${o.w >= o.l ? 'good' : 'bad'}">${o.w}–${o.l}</b></div>`).join('')}</div>` : ''}
    ${bySurf.length ? `<div class="sec"><h2>Zemine göre</h2></div><div class="card">${bySurf.map(([n, l]) => { const w = l.filter(a => a.result === 'win').length; return `<div class="track-row"><div class="top"><b>${n}</b><span>${w}G · ${l.length - w}M</span></div>
      <div class="bar"><i style="width:${(w / l.length) * 100}%;background:var(--good)"></i></div></div>`; }).join('')}</div>` : ''}
    ${focusMin.size ? `<div class="sec"><h2>Antrenman odakları</h2></div><div class="card">${[...focusMin].sort((a, b) => b[1] - a[1]).map(([f, mn]) => `<div class="track-row"><div class="top"><b>${f}</b><span>${fmtInt(mn)} dk</span></div>
      <div class="bar"><i style="width:${(mn / Math.max(...focusMin.values())) * 100}%;background:var(--accent)"></i></div></div>`).join('')}</div>` : ''}`;
}

// Pilates stüdyo / ev seansı kaydı (rehberli akış dışında)
function pilatesLogSheet(after) {
  const kinds = [['reformer', 'Reformer (stüdyo)', 3.5], ['mat-studio', 'Mat (stüdyo / ders)', 3.0], ['home', 'Evde', 3.0]];
  let kind = db.profile.place === 'mat' ? 'mat-studio' : 'reformer', intensity = 'medium';
  const { el, close } = openSheet(`
    <div class="sheet-title">Pilates seansı kaydet</div>
    <div class="opt-grid" id="pl-kind" style="grid-template-columns:1fr">${kinds.map(([k, n]) => `<button class="opt ${k === kind ? 'on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="in-row" style="margin-top:10px">
      <div class="in-box"><label>Süre · dk</label><input id="pl-min" inputmode="numeric" value="50"></div>
      <div class="in-box"><label>Yoğunluk</label><div class="mini-seg" id="pl-int">${INTENSITY.map(([k, n]) => `<button data-v="${k}" class="${k === intensity ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    </div>
    <textarea class="note-in" id="pl-note" style="min-height:64px;margin-top:12px" maxlength="200" placeholder="Not: ör. yay ayarı, eğitmen önerisi"></textarea>
    <div class="sheet-actions"><button class="btn ghost" id="pl-cancel">Vazgeç</button><button class="btn" id="pl-save">Kaydet</button></div>`);
  $$('#pl-kind .opt', el).forEach(b => b.addEventListener('click', () => { kind = b.dataset.k; $$('#pl-kind .opt', el).forEach(x => x.classList.toggle('on', x === b)); }));
  $$('#pl-int button', el).forEach(b => b.addEventListener('click', () => { intensity = b.dataset.v; $$('#pl-int button', el).forEach(x => x.classList.toggle('on', x === b)); }));
  $('#pl-cancel', el).addEventListener('click', close);
  $('#pl-save', el).addEventListener('click', () => {
    const min = clamp(Math.round(num($('#pl-min', el).value)), 1, 300);
    const k = kinds.find(x => x[0] === kind), f = INTENSITY.find(i => i[0] === intensity)[2];
    addActivity({ sport: 'pilates', kind, name: `Pilates · ${k[1]}`, min, intensity, kcal: actKcal(k[2], min, f), note: $('#pl-note', el).value.trim() || undefined });
    close(); toast('Seans kaydedildi', 'check'); after();
  });
}

// Bugün ekranının ortak parçaları
function nutritionSummary(m, st, today) {
  if (!m) return '';
  const f = db.food[today] || { kcal: 0, protein: 0, water: 0 };
  const kcalT = m.goalKcal + st.kcal, waterT = (m.water + (st.min > 20 ? 0.5 : 0)) * 1000;
  const bar = (v, t, c) => `<div class="bar" style="margin-top:6px"><i style="width:${clamp((v / t) * 100, 0, 100)}%;background:${c}"></i></div>`;
  return `<div class="sec"><h2>Beslenme</h2><a href="#/nutrition">Menüyü gör</a></div>
    <a class="card" href="#/nutrition" style="display:block">
      <div class="row"><div class="grow"><div class="card-label">Kalori</div><div class="kcal-big" style="margin-top:4px"><b>${fmtInt(f.kcal)}</b><span>/ ${fmtInt(kcalT)} kcal</span></div></div>${icon('chev', 'chev')}</div>
      ${bar(f.kcal, kcalT, 'var(--fire)')}
      <div class="targets" style="grid-template-columns:1fr 1fr;margin-top:14px">
        <div><div class="card-label">Protein</div><b class="num" style="font-size:16px">${fmtInt(f.protein)} / ${fmtInt(m.protein)} g</b>${bar(f.protein, m.protein, 'var(--accent)')}</div>
        <div><div class="card-label">Su</div><b class="num" style="font-size:16px">${fmtN(f.water / 1000)} / ${fmtN(waterT / 1000)} L</b>${bar(f.water, waterT, 'var(--blue)')}</div>
      </div></a>`;
}
function weekBlock(today) {
  const ws = weekStart();
  const days = [...Array(7)].map((_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return dayKey(d); });
  const kc = days.map(d => dayStats(d).kcal), maxK = Math.max(...kc, 1);
  return `<div class="sec"><h2>Bu hafta</h2><span class="faint small num">${fmtInt(kc.reduce((a, b) => a + b, 0))} kcal</span></div>
    <div class="card"><div class="week">${days.map((d, i) => `<div class="d ${d === today ? 'today' : ''}">
      <div class="b ${kc[i] ? 'on' : ''}" style="height:${kc[i] ? Math.max(14, (kc[i] / maxK) * 70) : 6}px"></div>
      <span>${['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'][i]}</span></div>`).join('')}</div></div>`;
}
function activeDaysThisWeek() {
  const ws = dayKey(weekStart());
  return new Set([...db.sets.map(s => s.date), ...db.cardio.map(c => c.date), ...db.activities.map(a => a.date)].filter(d => d >= ws)).size;
}
const helloText = () => { const h = new Date().getHours(); return h < 6 ? 'İyi geceler' : h < 12 ? 'Günaydın' : h < 18 ? 'İyi günler' : 'İyi akşamlar'; };
function miniStats(st) {
  return `<div class="mini-stats">
    <div><span>${icon('flame')} Yakılan</span><b>${fmtInt(st.kcal)}<small>kcal</small></b></div>
    <div><span>${icon('pulse')} Süre</span><b>${fmtInt(st.min)}<small>dk</small></b></div>
    <a href="#/hist"><span>${icon('calendar')} Bu hafta</span><b>${activeDaysThisWeek()}/${db.profile.days || 3}<small>gün</small></b></a>
  </div>`;
}
// Sıradaki tenis kondisyon programı
function nextTennisProgram() {
  const last = [...db.workouts].sort((a, b) => b.end - a.end).find(w => w.key?.startsWith('tennis-'));
  const i = last ? (TENNIS_PROGRAMS.findIndex(p => p.key === last.key) + 1) % TENNIS_PROGRAMS.length : 0;
  return TENNIS_PROGRAMS[i];
}
const programDay = p => ({ key: p.key, name: `Tenis kondisyonu · ${p.name}`, items: p.items.filter(i => getEx(i.exId)) });

// ═════════════════════════ Tenis: Bugün
function renderTodayTennis() {
  const today = dayKey(), st = dayStats(today), m = metrics();
  setHeader('Bugün', { chip: true });
  const ws = dayKey(weekStart());
  const tennis = db.activities.filter(a => a.sport === 'tennis' && a.kind !== 'routine');
  const week = tennis.filter(a => a.date >= ws);
  const hours = week.reduce((s, a) => s + a.min, 0) / 60;
  const matches = tennis.filter(a => a.result);
  const recent = matches.slice(-20), wins = recent.filter(a => a.result === 'win').length;
  const prog = nextTennisProgram();
  let html = pageHead(fmtDay(today), helloText());
  html += `<div class="next tennis-hero"><div class="eyebrow">Tenis · bu hafta</div>
    <h2>${week.length ? `${fmtN(hours, 1)} saat · ${week.length} seans` : 'Korta çıkmaya hazır mısın?'}</h2>
    <div class="meta">${recent.length ? `<span class="pill accent">${icon('trophy')}Galibiyet %${fmtInt((wins / recent.length) * 100)}</span>` : ''}<span class="pill">${matches.length} maç</span>
      <a class="pill" href="#/tennis/istatistik">Seviye ${fmtN(tennisLevel().level, 1)}</a></div>
    <button class="btn" id="t-log">${icon('plus')} Maç / antrenman kaydet</button>
    <div class="row" style="justify-content:center;gap:22px;margin-top:12px">
      <a class="alt" href="#/player/routine/tennis-warmup" style="width:auto;margin:0">Maç öncesi ısınma</a>
      <a class="alt" href="#/player/routine/tennis-stretch" style="width:auto;margin:0">Maç sonrası esneme</a></div></div>`;
  html += miniStats(st) + `<div style="margin-top:10px">${streakCard()}</div>`;
  html += `<div class="sec"><h2>Kondisyon</h2><a href="#/tennis/kondisyon">Programlar</a></div>
    <div class="card prog-card"><div class="row"><div class="grow"><div class="card-label">Sıradaki program</div><div class="card-title" style="margin-top:4px">${esc(prog.name)}</div><div class="faint small">${esc(prog.desc)} · ${prog.items.length} hareket</div></div></div>
      <div class="ex-strip" style="margin-top:12px">${prog.items.slice(0, 5).map(i => thumb(getEx(i.exId))).join('')}</div>
      <button class="btn ghost" id="t-prog" style="margin-top:12px">${icon('play')} Başla</button></div>`;
  if (!profileReady()) html += `<a class="slim" href="#/profile"><div class="ic" style="background:var(--blue-soft);color:var(--blue)">${icon('user')}</div><div class="grow"><b>Profilini tamamla</b><span>Kalori ihtiyacın ve beslenme planın hesaplansın</span></div>${icon('chev', 'chev')}</a>`;
  html += backupReminder();
  const last = [...db.activities].filter(a => a.sport === 'tennis').slice(-5).reverse();
  if (last.length) html += `<div class="sec"><h2>Son kayıtlar</h2><a href="#/hist">Tümü</a></div><div class="card">${last.map(a => activityRow(a, { del: true })).join('')}</div>`;
  html += nutritionSummary(m, st, today) + weekBlock(today);
  view.innerHTML = html;
  const rerender = () => { const y = scrollY; renderTodayTennis(); scrollTo(0, y); };
  $('#t-log').addEventListener('click', () => tennisLogSheet(rerender));
  $('#t-prog').addEventListener('click', () => startSession(programDay(prog)));
  bindActivityDelete(view, rerender);
  bindBackupReminder();
}

// ═════════════════════════ Tenis sekmesi
function renderTennis(seg = 'teknik') {
  if (!['teknik', 'kondisyon', 'rutinler', 'istatistik'].includes(seg)) seg = 'teknik';
  setHeader('Tenis', { chip: true, action: `<button class="top-btn" id="t-log2" aria-label="Kayıt ekle">${icon('plus')}</button>` });
  let body = '';
  if (seg === 'teknik') {
    body = `<div class="list">${STROKES.map(s => `<a class="item" href="#/stroke/${s.id}"><div class="fig-thumb">${figureThumb(s.fig, s.fig.poses[1] || s.fig.poses[0])}</div>
      <div class="grow"><div class="name">${esc(s.name)}</div><div class="meta">${['', 'Temel', 'Orta', 'İleri'][s.level]} · ${esc(s.summary.split('.')[0])}</div></div>${icon('chev', 'chev')}</a>`).join('')}</div>`;
  } else if (seg === 'kondisyon') {
    const next = nextTennisProgram();
    body = `<div class="faint small" style="margin:0 2px 12px">Haftada 1–2 kondisyon antrenmanı; kortta hız, güç ve sakatlıklardan korunma sağlar.</div>
      ${TENNIS_PROGRAMS.map(p => `<div class="card prog-card" style="margin-bottom:10px">
        <div class="row"><div class="grow"><div class="card-title">${esc(p.name)}</div><div class="faint small">${esc(p.desc)} · ${p.items.length} hareket</div></div>${p === next ? '<span class="pill accent">Sıradaki</span>' : ''}</div>
        <div class="ex-strip" style="margin-top:12px">${p.items.slice(0, 6).map(i => thumb(getEx(i.exId))).join('')}</div>
        <div class="row" style="gap:8px;margin-top:12px"><button class="btn ghost" data-see="${p.key}" style="margin:0">Hareketler</button><button class="btn" data-go="${p.key}" style="margin:0">${icon('play')} Başla</button></div></div>`).join('')}`;
  } else if (seg === 'istatistik') {
    body = tennisStatsHTML();
  } else {
    body = ROUTINES.filter(r => r.sport !== 'pilates').map(routineCard).join('');
  }
  view.innerHTML = pageHead('Teknik, kondisyon ve rutinler', 'Tenis') + `
    <div class="seg">${[['teknik', 'Teknik'], ['kondisyon', 'Kondisyon'], ['rutinler', 'Rutinler'], ['istatistik', 'İstatistik']].map(([k, n]) => `<button data-s="${k}" class="${k === seg ? 'on' : ''}">${n}</button>`).join('')}</div>${body}`;
  $$('.seg button', view).forEach(b => b.addEventListener('click', () => location.replace(`#/tennis/${b.dataset.s}`)));
  if (seg === 'istatistik') {
    bindHelp();
    const cv = $('#lv-chart');
    if (cv) drawChart(cv, tennisLevel().pts, '');
  }
  $('#t-log2').addEventListener('click', () => tennisLogSheet(() => (seg === 'istatistik' ? renderTennis(seg) : toast('Geçmiş\'te görebilirsin', 'calendar'))));
  $$('[data-go]', view).forEach(b => b.addEventListener('click', () => startSession(programDay(TENNIS_PROGRAMS.find(p => p.key === b.dataset.go)))));
  $$('[data-see]', view).forEach(b => b.addEventListener('click', () => {
    const p = TENNIS_PROGRAMS.find(x => x.key === b.dataset.see);
    const { el, close } = openSheet(`<div class="sheet-title">${esc(p.name)}</div>
      <div class="list">${p.items.filter(i => getEx(i.exId)).map(i => `<a class="item" href="#/ex/${encodeURIComponent(i.exId)}">${thumb(getEx(i.exId))}
        <div class="grow"><div class="name">${esc(getEx(i.exId).name)}</div><div class="meta">${schemeText(i, getEx(i.exId))}</div></div>${icon('chev', 'chev')}</a>`).join('')}</div>
      <div class="sheet-actions"><button class="btn ghost" id="ps-close">Kapat</button><button class="btn" id="ps-start">Başla</button></div>`);
    $('#ps-close', el).addEventListener('click', close);
    $('#ps-start', el).addEventListener('click', () => { close(); startSession(programDay(p)); });
  }));
}
function routineCard(r) {
  const moves = r.items.map(i => ROUTINE_MOVES[i.m]);
  const sec = r.items.reduce((s, i) => s + i.sec * (i.sides ? 2 : 1), 0);
  return `<div class="card prog-card" style="margin-bottom:10px">
    <div class="row"><div class="grow"><div class="card-title">${esc(r.name)}</div><div class="faint small">~${Math.round(sec / 60 + r.items.length * 0.08)} dk · ${r.items.length} hareket</div></div></div>
    <div class="muted small" style="margin-top:8px">${esc(r.desc)}</div>
    <div class="ex-strip" style="margin-top:12px">${moves.slice(0, 6).map(mv => mv.img ? `<div class="thumb"><img src="${mv.img[1]}" alt="" loading="lazy"></div>` : `<div class="thumb fig-thumb">${figureThumb(STROKES.find(s => s.id === mv.fig).fig)}</div>`).join('')}</div>
    <a class="btn" href="#/player/routine/${r.id}" style="margin-top:12px">${icon('play')} Rutini başlat</a></div>`;
}

// Hareket çizimi kartı: 3D model (parmakla döndürülür) veya 2D çizim, normal/yavaş hız
// three.js ve model yalnızca ilk 3D gösterimde yüklenir; WebGL yoksa veya yükleme başarısızsa 2D'ye düşer.
let fig3dMod = null;
const fig3dOn = () => db.settings.fig3d !== false;
function figurePlayer(box, fig) {
  let speed = 1, stop = () => {}, token = 0, failed = false;
  box.innerHTML = `<div class="fig-stage"></div><div class="fig-ctl"><button class="glass" data-sp="1">Normal</button><button class="glass" data-sp="0.5">Yavaş</button></div>
    <div class="fig-ctl left"><button class="glass" data-dim="3">3D</button><button class="glass" data-dim="2">2D</button></div>`;
  const stage = $('.fig-stage', box);
  const mark = () => {
    $$('[data-sp]', box).forEach(x => x.classList.toggle('on', +x.dataset.sp === speed));
    $$('[data-dim]', box).forEach(x => x.classList.toggle('on', (x.dataset.dim === '3') === (fig3dOn() && !failed)));
  };
  const play2d = f => { stop = mountFigure(stage, f); };
  const play = async () => {
    stop(); stop = () => {};
    const my = ++token, f = { ...fig, dur: (fig.dur || 2) / speed };
    box.classList.toggle('is3d', fig3dOn() && !failed);
    mark();
    if (!fig3dOn() || failed) return play2d(f);
    try { fig3dMod ||= await import('./figure3d.js'); } catch { failed = true; mark(); box.classList.remove('is3d'); return play2d(f); }
    if (my !== token) return;
    stop = fig3dMod.mountFigure3D(stage, f, { onFail: () => { if (my !== token) return; failed = true; mark(); box.classList.remove('is3d'); play2d(f); } });
  };
  $$('[data-sp]', box).forEach(b => b.addEventListener('click', () => { speed = +b.dataset.sp; play(); }));
  $$('[data-dim]', box).forEach(b => b.addEventListener('click', () => {
    if (failed && b.dataset.dim === '3') return toast('Bu cihazda 3D gösterim açılamadı', 'info');
    db.settings.fig3d = b.dataset.dim === '3'; save(); play();
  }));
  play();
  return () => { token++; stop(); };
}

function renderStroke(id) {
  const s = STROKES.find(x => x.id === id);
  if (!s) { location.replace('#/tennis'); return; }
  setHeader(s.name, { back: true, always: true });
  view.innerHTML = `<div class="fig-card" id="fig"></div>
    <div class="ex-head"><h1>${esc(s.name)}</h1><div class="ex-tags"><span class="pill">${['', 'Temel', 'Orta', 'İleri'][s.level]}</span><span class="pill accent">${icon('tennis')}Teknik</span></div></div>
    <div class="muted" style="margin:6px 2px 0;line-height:1.5">${esc(s.summary)}</div>
    <button class="btn ex-cta" id="st-log">${icon('plus')} Pratik kaydet</button>
    <div class="seg"><button data-t="how" class="on">Nasıl yapılır</button><button data-t="fix">Hatalar ve alıştırmalar</button></div>
    <div id="pane"></div>`;
  const stop = figurePlayer($('#fig'), s.fig);
  const pane = $('#pane');
  const show = t => {
    $$('.seg button', view).forEach(b => b.classList.toggle('on', b.dataset.t === t));
    pane.innerHTML = t === 'how'
      ? `<div class="card"><ol class="steps phase">${s.phases.map(([h, d]) => `<li><b>${esc(h)}</b><span>${esc(d)}</span></li>`).join('')}</ol></div>`
      : `<div class="sec"><h2>Sık yapılan hatalar</h2></div><div class="card">${s.mistakes.map(x => `<div class="tip">${icon('x')}<span>${esc(x)}</span></div>`).join('')}</div>
        <div class="sec"><h2>Alıştırmalar</h2></div>${s.drills.map(([h, d]) => `<div class="card drill"><b>${esc(h)}</b><p>${esc(d)}</p></div>`).join('')}`;
  };
  $$('.seg button', view).forEach(b => b.addEventListener('click', () => show(b.dataset.t)));
  show('how');
  $('#st-log').addEventListener('click', () => tennisLogSheet(() => {}, { kind: 'practice', note: `${s.name} çalışması` }));
  return stop;
}

// ═════════════════════════ Pilates: Bugün
function recommendedSession() {
  const lvl = levelOf(), place = db.profile.place || 'mat';
  let pool = PILATES_SESSIONS.filter(s => s.level <= lvl && (place === 'both' || s.kind === place || (place === 'reformer' && s.kind === 'mat' && false)));
  if (!pool.length) pool = PILATES_SESSIONS.filter(s => s.level <= lvl);
  pool.sort((a, b) => b.level - a.level || 0);
  const last = [...db.activities].reverse().find(a => a.sport === 'pilates' && a.ref);
  const i = last ? (pool.findIndex(s => s.id === last.ref) + 1) % pool.length : 0;
  return pool[Math.max(0, i)];
}
function renderTodayPilates() {
  const today = dayKey(), st = dayStats(today), m = metrics();
  setHeader('Bugün', { chip: true });
  const ses = recommendedSession();
  const moves = ses.items.map(i => PILATES_BY_ID[i.p]);
  const ws = dayKey(weekStart());
  const weekMin = db.activities.filter(a => a.sport === 'pilates' && a.date >= ws).reduce((s, a) => s + a.min, 0);
  let html = pageHead(fmtDay(today), helloText());
  html += `<div class="next"><div class="eyebrow">Bugünün seansı</div><h2>${esc(ses.name)}</h2>
    <div class="meta"><span class="pill">${moves.length} hareket</span><span class="pill">~${ses.min} dk</span><span class="pill">${esc(LEVEL_NAMES.pilates[ses.level - 1])}</span>${ses.kind === 'reformer' ? '<span class="pill blue">Reformer</span>' : ''}</div>
    <div class="ex-strip">${moves.slice(0, 4).map(p => `<div class="thumb fig-thumb">${figureThumb(p.fig)}</div>`).join('')}${moves.length > 4 ? `<div class="more">+${moves.length - 4}</div>` : ''}</div>
    <a class="btn" href="#/player/pilates/${ses.id}">${icon('play')} Seansa başla</a>
    <div class="row" style="justify-content:center;gap:22px;margin-top:12px">
      <a class="alt" href="#/pilates/seanslar" style="width:auto;margin:0">Diğer seanslar</a>
      <button class="alt" id="p-log" style="width:auto;margin:0">Stüdyo seansı kaydet</button></div></div>`;
  html += miniStats(st) + `<div style="margin-top:10px">${streakCard()}</div>`;
  html += `<div class="card" style="margin-top:10px"><div class="row"><div class="grow"><div class="card-label">Bu hafta pilates</div><div class="kcal-big" style="margin-top:4px"><b>${fmtInt(weekMin)}</b><span>/ 150 dk</span></div></div></div>
    <div class="bar" style="margin-top:8px"><i style="width:${clamp((weekMin / 150) * 100, 0, 100)}%;background:var(--violet)"></i></div>
    <div class="faint small" style="margin-top:8px">Haftada 2–3 seans (toplam 120–150 dk) core gücü ve duruşta belirgin fark yaratır.</div></div>`;
  if (!profileReady()) html += `<a class="slim" href="#/profile"><div class="ic" style="background:var(--blue-soft);color:var(--blue)">${icon('user')}</div><div class="grow"><b>Profilini tamamla</b><span>Kalori ihtiyacın ve beslenme planın hesaplansın</span></div>${icon('chev', 'chev')}</a>`;
  html += backupReminder();
  const last = db.activities.filter(a => a.sport === 'pilates').slice(-5).reverse();
  if (last.length) html += `<div class="sec"><h2>Son seanslar</h2><a href="#/hist">Tümü</a></div><div class="card">${last.map(a => activityRow(a, { del: true })).join('')}</div>`;
  html += nutritionSummary(m, st, today) + weekBlock(today);
  view.innerHTML = html;
  const rerender = () => { const y = scrollY; renderTodayPilates(); scrollTo(0, y); };
  $('#p-log').addEventListener('click', () => pilatesLogSheet(rerender));
  bindActivityDelete(view, rerender);
  bindBackupReminder();
}

// ═════════════════════════ Pilates sekmesi
function renderPilates(seg = 'seanslar') {
  if (!['seanslar', 'mat', 'reformer'].includes(seg)) seg = 'seanslar';
  setHeader('Pilates', { chip: true, action: `<button class="top-btn" id="p-log2" aria-label="Seans kaydet">${icon('plus')}</button>` });
  const lvl = levelOf(), rec = recommendedSession();
  let body = '';
  if (seg === 'seanslar') {
    body = PILATES_SESSIONS.map(s => {
      const moves = s.items.map(i => PILATES_BY_ID[i.p]);
      return `<div class="card prog-card" style="margin-bottom:10px">
        <div class="row"><div class="grow"><div class="card-title">${esc(s.name)}</div><div class="faint small">~${s.min} dk · ${moves.length} hareket · ${esc(LEVEL_NAMES.pilates[s.level - 1])}${s.kind === 'reformer' ? ' · Reformer' : ''}</div></div>
          ${s.id === rec.id ? '<span class="pill accent">Önerilen</span>' : s.level > lvl ? '<span class="pill">Zorlayıcı</span>' : ''}</div>
        <div class="muted small" style="margin-top:8px">${esc(s.desc)}</div>
        <div class="ex-strip" style="margin-top:12px">${moves.slice(0, 5).map(p => `<div class="thumb fig-thumb">${figureThumb(p.fig)}</div>`).join('')}</div>
        <div class="row" style="gap:8px;margin-top:12px"><button class="btn ghost" data-see="${s.id}" style="margin:0">Hareketler</button><a class="btn" href="#/player/pilates/${s.id}" style="margin:0">${icon('play')} Başla</a></div></div>`;
    }).join('') + ROUTINES.filter(r => r.sport === 'all').map(routineCard).join('');
  } else {
    const list = PILATES.filter(p => p.kind === (seg === 'mat' ? 'mat' : 'reformer'));
    body = (seg === 'reformer' ? `<button class="slim" id="p-log3" style="margin-top:0"><div class="ic" style="background:rgba(167,139,250,.14);color:var(--violet)">${icon('plus')}</div>
      <div class="grow"><b>Stüdyo seansını kaydet</b><span>Süre ve yoğunluk gir, kalorisi günlük toplama eklensin</span></div>${icon('chev', 'chev')}</button>` : '')
      + [1, 2, 3].map(l => {
        const ls = list.filter(p => p.level === l);
        return ls.length ? `<div class="group-title">${LEVEL_NAMES.pilates[l - 1]} · ${ls.length}</div><div class="list">${ls.map(p => `<a class="item" href="#/pmove/${p.id}">
          <div class="fig-thumb">${figureThumb(p.fig)}</div><div class="grow"><div class="name">${esc(p.name)}</div><div class="meta">${esc(p.tr)} · ${p.focus.map(f => PFOCUS[f]).join(', ')}</div></div>${icon('chev', 'chev')}</a>`).join('')}</div>` : '';
      }).join('');
  }
  view.innerHTML = pageHead('Mat, reformer ve rehberli seanslar', 'Pilates') + `
    <div class="seg">${[['seanslar', 'Seanslar'], ['mat', 'Mat'], ['reformer', 'Reformer']].map(([k, n]) => `<button data-s="${k}" class="${k === seg ? 'on' : ''}">${n}</button>`).join('')}</div>${body}`;
  $$('.seg button', view).forEach(b => b.addEventListener('click', () => location.replace(`#/pilates/${b.dataset.s}`)));
  const logged = () => toast('Geçmiş\'te görebilirsin', 'calendar');
  $('#p-log2').addEventListener('click', () => pilatesLogSheet(logged));
  $('#p-log3')?.addEventListener('click', () => pilatesLogSheet(logged));
  $$('[data-see]', view).forEach(b => b.addEventListener('click', () => {
    const s = PILATES_SESSIONS.find(x => x.id === b.dataset.see);
    const { el, close } = openSheet(`<div class="sheet-title">${esc(s.name)}</div>
      <div class="list">${s.items.map(i => { const p = PILATES_BY_ID[i.p]; return `<a class="item" href="#/pmove/${p.id}"><div class="fig-thumb">${figureThumb(p.fig)}</div>
        <div class="grow"><div class="name">${esc(p.name)}</div><div class="meta">${esc(repText(p, i))}</div></div>${icon('chev', 'chev')}</a>`; }).join('')}</div>
      <div class="sheet-actions"><button class="btn ghost" id="ps-close">Kapat</button><a class="btn" href="#/player/pilates/${s.id}">Başla</a></div>`);
    $('#ps-close', el).addEventListener('click', close);
  }));
}
const repText = (p, it = {}) => (p.sec ? `${it.sec || p.reps} sn${p.unit?.includes('her') ? ' her taraf' : ''}` : `${it.n || p.reps} ${p.unit || 'tekrar'}`);

function renderPMove(id) {
  const p = PILATES_BY_ID[id];
  if (!p) { location.replace('#/pilates'); return; }
  setHeader(p.name, { back: true, always: true });
  const inSessions = PILATES_SESSIONS.filter(s => s.items.some(i => i.p === id));
  view.innerHTML = `<div class="fig-card" id="fig"></div>
    <div class="ex-head"><h1>${esc(p.name)}</h1><div class="muted" style="margin-top:2px">${esc(p.tr)}</div>
      <div class="ex-tags" style="margin-top:10px"><span class="pill">${LEVEL_NAMES.pilates[p.level - 1]}</span>${p.kind === 'reformer' ? '<span class="pill blue">Reformer</span>' : '<span class="pill">Mat</span>'}
        ${p.focus.map(f => `<span class="pill accent">${PFOCUS[f]}</span>`).join('')}<span class="pill">${esc(repText(p))}</span></div></div>
    <div class="sec"><h2>Adım adım</h2></div>
    <div class="card"><ol class="steps">${p.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
    <div class="card breath" style="margin-top:10px">${icon('drop')}<div><b>Nefes</b><span>${esc(p.breath)}</span></div></div>
    <div class="sec"><h2>İpuçları</h2></div><div class="card">${p.tips.map(t => `<div class="tip">${icon('bulb')}<span>${esc(t)}</span></div>`).join('')}</div>
    <div class="metric-grid" style="margin-top:10px">
      <div class="metric"><div class="lbl">Kolaylaştır</div><div class="note" style="font-size:14px;color:var(--text-2);margin-top:6px">${esc(p.easier)}</div></div>
      <div class="metric"><div class="lbl">Zorlaştır</div><div class="note" style="font-size:14px;color:var(--text-2);margin-top:6px">${esc(p.harder)}</div></div></div>
    ${inSessions.length ? `<div class="sec"><h2>Bu hareketin olduğu seanslar</h2></div><div class="list">${inSessions.map(s => `<a class="item" href="#/player/pilates/${s.id}">
      <div class="badge">${icon('play')}</div><div class="grow"><div class="name">${esc(s.name)}</div><div class="meta">~${s.min} dk · ${s.items.length} hareket</div></div>${icon('chev', 'chev')}</a>`).join('')}</div>` : ''}`;
  return figurePlayer($('#fig'), p.fig);
}

// ═════════════════════════ Rehberli oynatıcı (rutinler ve pilates seansları)
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) { if (wakeLock && !wakeLock.released) return; wakeLock = await navigator.wakeLock.request('screen'); }
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* desteklenmiyor */ }
}
function tick(freq = 660) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.frequency.value = freq; o.connect(g); g.connect(audioCtx.destination);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.start(t); o.stop(t + 0.13);
}
function buildSteps(kind, id) {
  if (kind === 'routine') {
    const r = ROUTINES.find(x => x.id === id);
    if (!r) return null;
    const steps = [];
    for (const it of r.items) {
      const mv = ROUTINE_MOVES[it.m];
      const media = mv.img ? { img: mv.img } : { fig: STROKES.find(s => s.id === mv.fig)?.fig };
      if (it.sides) ['Sağ taraf', 'Sol taraf'].forEach(side => steps.push({ name: mv.name, side, sec: it.sec, cue: mv.cue, ...media }));
      else steps.push({ name: mv.name, sec: it.sec, cue: mv.cue, ...media });
    }
    return { title: r.name, met: r.met, sport: r.sport === 'tennis' ? 'tennis' : 'pilates', ref: r.id, kind: 'routine', steps };
  }
  const s = PILATES_SESSIONS.find(x => x.id === id);
  if (!s) return null;
  const steps = s.items.map(it => {
    const p = PILATES_BY_ID[it.p];
    const perRep = p.unit === 'nefes' ? 5 : 4;
    const twoSide = /her (bacak|taraf|yön)/.test(p.unit || '');
    const sec = p.sec ? (it.sec || p.reps) * (twoSide ? 2 : 1) + 5 : Math.round((it.n || p.reps) * perRep * (twoSide ? 2 : 1));
    return { name: p.name, tr: p.tr, sec: clamp(sec, 20, 150), reps: repText(p, it), cue: p.steps.slice(0, 2).join(' '), breath: p.breath, fig: p.fig, pid: p.id };
  });
  return { title: s.name, met: s.kind === 'reformer' ? 3.5 : 3.0, sport: 'pilates', ref: s.id, kind: s.kind, steps };
}
function renderPlayer(kind, id) {
  const plan = buildSteps(kind, id);
  if (!plan) { location.replace('#/today'); return; }
  document.body.classList.add('bare', 'playing');
  const READY = 6;
  let i = 0, phase = 'intro', left = 0, paused = false, timer = 0, startedAt = 0, activeMs = 0, lastTick = 0, stopMedia = () => {};
  const total = plan.steps.reduce((s, x) => s + x.sec + READY, 0);
  view.innerHTML = `<div class="player">
    <div class="pl-top"><button class="pl-x" id="pl-x" aria-label="Kapat">${icon('x')}</button>
      <button class="pl-x pl-voice ${voiceOn() ? 'on' : ''}" id="pl-voice" aria-label="Sesli rehber">${icon(voiceOn() ? 'volume' : 'mute')}</button>
      <div class="pl-prog"><i id="pl-bar"></i></div><span class="pl-count num" id="pl-count"></span></div>
    <div class="pl-media" id="pl-media"></div>
    <div class="pl-info"><div class="pl-phase" id="pl-phase"></div><h1 id="pl-name"></h1><div class="pl-sub" id="pl-sub"></div><p class="pl-cue" id="pl-cue"></p></div>
    <div class="pl-timer"><svg viewBox="0 0 120 120"><circle class="trk" cx="60" cy="60" r="52"/><circle class="val" id="pl-ring" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="0"/></svg>
      <div class="pl-time num" id="pl-time"></div></div>
    <div class="pl-ctl"><button id="pl-prev" aria-label="Önceki">${icon('back')}</button><button class="main" id="pl-play" aria-label="Başlat">${icon('play')}</button><button id="pl-next" aria-label="Sonraki">${icon('chev')}</button></div>
    <div class="pl-next" id="pl-upnext"></div></div>`;
  const $p = s => $(s, view);
  const media = step => {
    stopMedia();
    const box = $p('#pl-media');
    if (step.fig) { stopMedia = mountFigure(box, step.fig); return; }
    box.innerHTML = `<div class="pl-photos"><img src="${step.img[0]}" class="on" alt=""><img src="${step.img[1]}" alt=""></div>`;
    const imgs = $$('img', box); let k = 0;
    const t = setInterval(() => { k ^= 1; imgs.forEach((im, n) => im.classList.toggle('on', n === k)); }, 1300);
    stopMedia = () => clearInterval(t);
  };
  const doneSec = () => plan.steps.slice(0, i).reduce((s, x) => s + x.sec + READY, 0) + (phase === 'work' ? READY + (plan.steps[i].sec - left) : phase === 'ready' ? READY - left : 0);
  const paint = () => {
    const st = plan.steps[i], nx = plan.steps[i + 1];
    $p('#pl-count').textContent = phase === 'done' ? '' : `${i + 1} / ${plan.steps.length}`;
    $p('#pl-bar').style.width = `${clamp((doneSec() / total) * 100, 0, 100)}%`;
    if (phase === 'done') return;
    $p('#pl-phase').textContent = phase === 'intro' ? plan.title : phase === 'ready' ? 'Hazırlan' : st.side || (st.reps ? st.reps : 'Şimdi');
    $p('#pl-name').textContent = st.name;
    $p('#pl-sub').textContent = [st.tr, phase === 'ready' && st.side ? st.side : '', phase !== 'work' && st.reps ? st.reps : ''].filter(Boolean).join(' · ');
    $p('#pl-cue').textContent = st.cue + (st.breath && phase === 'work' ? ` Nefes: ${st.breath}` : '');
    const dur = phase === 'ready' ? READY : st.sec;
    $p('#pl-time').textContent = phase === 'intro' ? `${Math.round(total / 60)} dk` : fmtClock(left);
    $p('#pl-ring').style.strokeDashoffset = phase === 'intro' ? 0 : 326.7 * (1 - left / dur);
    $p('#pl-ring').classList.toggle('ready', phase === 'ready');
    $p('#pl-play').innerHTML = icon(paused || phase === 'intro' ? 'play' : 'pause');
    $p('#pl-upnext').innerHTML = nx ? `Sıradaki: <b>${esc(nx.name)}</b>${nx.side ? ` · ${nx.side}` : ''}` : 'Son hareket';
  };
  const go = (n, ph = 'ready') => {
    if (n >= plan.steps.length) return finish();
    i = clamp(n, 0, plan.steps.length - 1); phase = ph;
    left = ph === 'ready' ? READY : plan.steps[i].sec;
    const st = plan.steps[i];
    if (ph === 'ready') speak(`${i === 0 ? '' : 'Sıradaki: '}${st.name}${st.side ? ', ' + st.side : ''}${st.reps ? ', ' + st.reps : ''}`);
    media(st); paint();
  };
  const loop = () => {
    const now = Date.now();
    if (!paused && phase !== 'intro' && phase !== 'done') {
      activeMs += now - lastTick;
      left -= (now - lastTick) / 1000;
      const sec = Math.ceil(left);
      if (sec <= 3 && sec >= 1 && sec !== loop.last) { tick(phase === 'ready' ? 520 : 660); loop.last = sec; }
      if (phase === 'work' && plan.steps[i].sec >= 40 && sec === Math.round(plan.steps[i].sec / 2) && loop.half !== i) { loop.half = i; speak('Yarısı bitti', { interrupt: false }); }
      if (left <= 0) {
        loop.last = null;
        if (phase === 'ready') { phase = 'work'; left = plan.steps[i].sec; if (!speak('Başla')) beep(); else tick(880); paint(); }
        else go(i + 1);
      } else paint();
    }
    lastTick = now;
  };
  const finish = () => {
    phase = 'done'; stopMedia(); keepAwake(false);
    speak('Tebrikler, tamamladın.');
    const min = Math.max(1, Math.round(activeMs / 60000));
    const kcal = actKcal(plan.met, min);
    $p('#pl-bar').style.width = '100%';
    view.querySelector('.player').innerHTML = `<div class="pl-done">
      <div class="ok">${icon('check')}</div><h1>Tebrikler!</h1><div class="muted">${esc(plan.title)} tamamlandı</div>
      <div class="metric-grid" style="margin-top:22px">
        <div class="metric"><div class="lbl">Süre</div><b class="num">${min}<small>dk</small></b></div>
        <div class="metric"><div class="lbl">Kalori</div><b class="num">${fmtInt(kcal)}<small>kcal</small></b></div></div>
      <button class="btn" id="pl-save" style="margin-top:22px">Kaydet ve bitir</button>
      <button class="alt" id="pl-skip" style="margin-top:10px">Kaydetmeden çık</button></div>`;
    $p('#pl-save').addEventListener('click', () => {
      addActivity({ sport: plan.sport, kind: plan.kind === 'routine' ? 'routine' : 'session', name: plan.title, ref: plan.ref, min, kcal });
      toast('Kaydedildi', 'check'); location.hash = '#/today';
    });
    $p('#pl-skip').addEventListener('click', () => (location.hash = '#/today'));
  };
  const start = () => { unlockAudio(); unlockSpeech(); keepAwake(true); startedAt = Date.now(); lastTick = Date.now(); paused = false; go(0); };
  $p('#pl-play').addEventListener('click', () => {
    if (phase === 'intro') return start();
    paused = !paused; lastTick = Date.now(); paint();
  });
  $p('#pl-next').addEventListener('click', () => { if (phase === 'intro') return start(); go(i + 1); });
  $p('#pl-prev').addEventListener('click', () => { if (phase !== 'intro') go(phase === 'work' && left < plan.steps[i].sec - 3 ? i : i - 1); });
  $p('#pl-voice').addEventListener('click', e => {
    db.settings.voice = !voiceOn(); save();
    if (!db.settings.voice) { try { speechSynthesis.cancel(); } catch { /* yok */ } }
    else { unlockSpeech(); if (!trVoice && !pickVoice()) toast('Telefonda Türkçe ses bulunamadı; Ayarlar > Erişilebilirlik > Seslendirme\'den indirilebilir', 'info'); }
    e.currentTarget.classList.toggle('on', voiceOn()); e.currentTarget.innerHTML = icon(voiceOn() ? 'volume' : 'mute');
  });
  $p('#pl-x').addEventListener('click', () => {
    if (phase !== 'intro' && phase !== 'done' && activeMs > 60000 && confirm('Seansı bitirmek ister misin? Yaptığın kısım kaydedilebilir.')) return finish();
    history.length > 1 ? history.back() : (location.hash = '#/today');
  });
  media(plan.steps[0]); paint();
  timer = setInterval(loop, 200);
  const onVis = () => { if (!document.hidden && phase !== 'done' && phase !== 'intro') keepAwake(true); };
  document.addEventListener('visibilitychange', onVis);
  return () => { clearInterval(timer); stopMedia(); keepAwake(false); try { speechSynthesis.cancel(); } catch { /* yok */ } document.removeEventListener('visibilitychange', onVis); document.body.classList.remove('bare', 'playing'); };
}
const fmtClock = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${pad2(s % 60)}`; };

// ═════════════════════════ Rekorlar
const REP_RECORDS = [1, 3, 5, 8, 10];
// Hareketin tüm rekorları (ağırlıklı: en ağır, tahmini maksimum, en yüksek set ve seans hacmi, tekrar rekorları)
function exerciseRecords(ex) {
  const ss = working(setsOf(ex.id));
  if (!ss.length) return null;
  const type = ex.type || 'weight';
  const best = (fn, list = ss) => list.reduce((a, s) => (!a || fn(s) > fn(a) ? s : a), null);
  if (type !== 'weight') {
    const top = best(s => s.r + s.w / 100);
    const byDay = groupByDay(ss).map(([d, l]) => [d, l.reduce((t, s) => t + s.r, 0)]);
    const day = byDay.reduce((a, x) => (!a || x[1] > a[1] ? x : a), null);
    return { type, top, sessionTotal: day };
  }
  const heaviest = best(s => s.w + s.r / 1000);
  const e1 = best(s => (s.r <= 12 ? e1rm(s.w, s.r) : 0));
  const setVol = best(s => s.w * s.r);
  const byDay = groupByDay(ss).map(([d, l]) => [d, l.reduce((t, s) => t + s.w * s.r, 0)]);
  const sessionVol = byDay.reduce((a, x) => (!a || x[1] > a[1] ? x : a), null);
  const reps = REP_RECORDS.map(n => [n, best(s => (s.r >= n ? s.w + s.r / 1000 : -1))]).map(([n, s]) => [n, s && s.r >= n ? s : null]);
  return { type, heaviest, e1, setVol, sessionVol, reps };
}
// Rekor olayları: setleri zaman sırasıyla gezip her harekette önceki en iyiyi aşan setleri bulur
function prEvents() {
  const bestBy = {}, out = [];
  for (const s of [...db.sets].filter(x => !x.warm).sort((a, b) => a.ts - b.ts)) {
    const ex = getEx(s.exId); if (!ex) continue;
    const sc = setScore(ex, s), prev = bestBy[s.exId];
    if (prev != null && sc > prev) out.push(s);
    if (prev == null || sc > prev) bestBy[s.exId] = sc;
  }
  return out;
}
function recordTable(ex, rec) {
  if (!rec) return '';
  const cell = (label, val, sub) => `<div class="rec-cell"><span>${label}</span><b class="num">${val}</b>${sub ? `<i>${sub}</i>` : ''}</div>`;
  if (rec.type !== 'weight') {
    return `<div class="rec-grid">${cell(rec.type === 'time' ? 'En uzun' : 'En çok tekrar', esc(fmtSet(ex, rec.top)), daysAgo(rec.top.date))}
      ${cell(rec.type === 'time' ? 'En uzun seans' : 'Seansta toplam', `${fmtInt(rec.sessionTotal[1])}${rec.type === 'time' ? ' sn' : ''}`, daysAgo(rec.sessionTotal[0]))}</div>`;
  }
  return `<div class="rec-grid">
      ${cell('En ağır', `${fmtN(rec.heaviest.w)} kg`, `× ${rec.heaviest.r} · ${daysAgo(rec.heaviest.date)}`)}
      ${rec.e1 ? cell('Tahmini maksimum', `${fmtN(e1rm(rec.e1.w, rec.e1.r), 1)} kg`, `${esc(fmtSet(ex, rec.e1))}`) : ''}
      ${cell('En iyi set', `${fmtInt(rec.setVol.w * rec.setVol.r)} kg`, esc(fmtSet(ex, rec.setVol)))}
      ${cell('En iyi seans', `${fmtInt(rec.sessionVol[1])} kg`, daysAgo(rec.sessionVol[0]))}</div>
    <div class="rep-recs">${rec.reps.map(([n, s]) => `<div><span>${n} tekrar</span><b class="num">${s ? fmtN(s.w) + ' kg' : '—'}</b></div>`).join('')}</div>`;
}
function renderRecords() {
  setHeader('Rekorlar', { back: true, always: true });
  const ids = [...new Set(db.sets.filter(s => !s.warm).sort((a, b) => b.ts - a.ts).map(s => s.exId))].filter(id => getEx(id));
  const events = prEvents().slice(-12).reverse();
  if (!ids.length) { view.innerHTML = pageHead('Kişisel rekorların', 'Rekorlar') + emptyBox('trophy', 'Henüz rekor yok', 'Set kaydettikçe her hareketteki en iyilerin burada toplanır.'); return; }
  view.innerHTML = pageHead(`${ids.length} hareket · ${prEvents().length} rekor kırıldı`, 'Rekorlar') + `
    ${events.length ? `<div class="sec"><h2>Son kırılan rekorlar</h2></div><div class="list">${events.map(s => { const ex = getEx(s.exId); return `<a class="item" href="#/ex/${encodeURIComponent(s.exId)}">${thumb(ex)}
      <div class="grow"><div class="name">${esc(ex.name)}</div><div class="meta num">${esc(fmtSet(ex, s))} · ${daysAgo(s.date)}</div></div>${icon('trophy', 'chev')}</a>`; }).join('')}</div>` : ''}
    <div class="sec"><h2>Hareket bazında</h2></div>
    ${ids.map(id => { const ex = getEx(id); return `<details class="card rec-card"><summary><div class="row">${thumb(ex)}<div class="grow"><div class="name">${esc(ex.name)}</div>
      <div class="faint small num">${esc(recSummary(ex))}</div></div>${icon('down', 'chev')}</div></summary>${recordTable(ex, exerciseRecords(ex))}
      <a class="lnk small" href="#/ex/${encodeURIComponent(id)}" style="display:inline-block;margin-top:10px">Grafiği gör ›</a></details>`; }).join('')}`;
}
function recSummary(ex) {
  const r = exerciseRecords(ex);
  if (!r) return '';
  return r.type === 'weight' ? `En ağır ${fmtN(r.heaviest.w)} kg${r.e1 ? ` · tahmini maks. ${fmtN(e1rm(r.e1.w, r.e1.r), 1)} kg` : ''}` : `En iyi ${fmtSet(ex, r.top)}`;
}

// ═════════════════════════ Haftalık seri (kırılınca bir sonraki hafta 2 günle kurtarılabilir)
function activeDaySet() {
  return new Set([...db.sets.map(s => s.date), ...db.cardio.map(c => c.date), ...db.activities.map(a => a.date)]);
}
function streakInfo() {
  const days = activeDaySet(), perWeek = new Map();
  for (const d of days) { const w = dayKey(weekStart(parseDay(d))); perWeek.set(w, (perWeek.get(w) || 0) + 1); }
  const wk = off => { const d = weekStart(); d.setDate(d.getDate() - 7 * off); return dayKey(d); };
  const n = off => perWeek.get(wk(off)) || 0;
  // Geriye doğru say: bu hafta henüz boşsa seriyi bozmaz; tek boş hafta, ardından gelen hafta 2+ günse kurtarılmış sayılır
  let cur = 0, off = n(0) ? 0 : 1, repaired = false;
  while (off < 520) {
    if (n(off)) { cur++; off++; continue; }
    if (!n(off + 1)) break;
    if (off >= 1 && n(off - 1) >= 2) { repaired = true; off++; continue; }
    break;
  }
  // En uzun seri (tüm geçmiş)
  const weeks = [...perWeek.keys()].sort();
  let longest = 0;
  if (weeks.length) {
    let run = 0, d = parseDay(weeks[0]);
    const end = weekStart();
    let gapOk = false;
    while (d <= end) {
      const k = dayKey(d), c = perWeek.get(k) || 0;
      if (c) { run++; gapOk = false; } else {
        const nx = new Date(d); nx.setDate(nx.getDate() + 7);
        if (!gapOk && (perWeek.get(dayKey(nx)) || 0) >= 2 && run) gapOk = true; else run = 0;
      }
      longest = Math.max(longest, run);
      d.setDate(d.getDate() + 7);
    }
  }
  longest = Math.max(longest, cur);
  const lastMissed = !n(1) && n(2) > 0;
  let hint;
  if (!cur && !n(0)) hint = 'Bu hafta bir antrenmanla yeni bir seri başlat.';
  else if (!n(0)) hint = `Bu hafta bir gün spor yaparsan serin ${cur + 1} haftaya çıkar.`;
  else if (lastMissed && n(0) < 2) hint = 'Geçen haftayı kaçırdın: bu hafta 1 gün daha yaparsan serin kurtulur.';
  else hint = n(0) >= (db.profile.days || 3) ? 'Bu haftanın hedefi tamam. Harika gidiyorsun!' : `Bu hafta ${n(0)}/${db.profile.days || 3} gün. Seri güvende.`;
  return { cur, longest, thisWeek: n(0), hint, repaired };
}
function streakCard() {
  const s = streakInfo();
  const goal = db.profile.days || 3;
  return `<a class="card streak-card" href="#/report/week/0">
    <div class="st-flame ${s.cur ? 'on' : ''}">${icon('flame')}</div>
    <div class="grow"><div class="st-top"><b class="num">${s.cur}</b><span>haftalık seri</span>${s.longest > s.cur ? `<em>en uzun ${s.longest}</em>` : ''}</div>
      <div class="st-hint">${esc(s.hint)}</div>
      <div class="st-dots">${[...Array(goal)].map((_, i) => `<i class="${i < s.thisWeek ? 'on' : ''}"></i>`).join('')}</div></div>
    ${icon('chev', 'chev')}</a>`;
}

// ═════════════════════════ Haftalık / aylık rapor
function periodRange(kind, off) {
  const now = new Date();
  let a, b;
  if (kind === 'month') { a = new Date(now.getFullYear(), now.getMonth() - off, 1); b = new Date(a.getFullYear(), a.getMonth() + 1, 0); }
  else { a = weekStart(); a.setDate(a.getDate() - 7 * off); b = new Date(a); b.setDate(a.getDate() + 6); }
  return [dayKey(a), dayKey(b), a, b];
}
function periodStats(from, to) {
  const inR = d => d >= from && d <= to;
  const sets = db.sets.filter(s => inR(s.date)), ws = working(sets);
  const days = [...activeDaySet()].filter(inR);
  let kcal = 0, min = 0;
  for (const d of days) { const st = dayStats(d); kcal += st.kcal; min += st.min; }
  const acts = db.activities.filter(a => inR(a.date));
  const tennis = acts.filter(a => a.sport === 'tennis' && a.kind !== 'routine'), pil = acts.filter(a => a.sport === 'pilates');
  const prs = prEvents().filter(s => inR(s.date));
  const vol = ws.reduce((t, s) => { const ex = getEx(s.exId); return t + (!ex?.type || ex.type === 'weight' ? s.w * s.r : 0); }, 0);
  const perRegion = REGIONS.map(r => [r, ws.filter(s => getEx(s.exId)?.region === r.id).length]);
  const topEx = [...ws.reduce((m, s) => m.set(s.exId, (m.get(s.exId) || 0) + 1), new Map())].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { days: days.length, workouts: db.workouts.filter(w => inR(w.date)).length, kcal, min, sets: ws.length, vol, prs, perRegion, topEx,
    tennisH: tennis.reduce((t, a) => t + a.min, 0) / 60, matches: tennis.filter(a => a.result).length, wins: tennis.filter(a => a.result === 'win').length, pilMin: pil.reduce((t, a) => t + a.min, 0) };
}
function renderReport(kind = 'week', off = '0') {
  if (kind !== 'month') kind = 'week';
  off = Math.max(0, +off || 0);
  setHeader('Rapor', { back: true, always: true });
  const [from, to, a, b] = periodRange(kind, off), [pf, pt] = periodRange(kind, off + 1);
  const st = periodStats(from, to), pv = periodStats(pf, pt);
  const title = kind === 'month' ? a.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : `${a.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} – ${b.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}`;
  const delta = (x, y) => { if (!y) return x ? '<span class="delta up">yeni</span>' : ''; const d = ((x - y) / y) * 100; return Math.abs(d) < 1 ? '<span class="delta">=</span>' : `<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} %${fmtInt(Math.abs(d))}</span>`; };
  const m = (lbl, val, unit, x, y) => `<div class="metric"><div class="lbl">${lbl}</div><b class="num">${val}${unit ? `<small>${unit}</small>` : ''}</b><div class="note">${delta(x, y)}</div></div>`;
  const maxR = Math.max(1, ...st.perRegion.map(x => x[1]));
  const s = streakInfo();
  view.innerHTML = pageHead(kind === 'month' ? 'Aylık rapor' : 'Haftalık rapor', title) + `
    <div class="seg"><button data-k="week" class="${kind === 'week' ? 'on' : ''}">Hafta</button><button data-k="month" class="${kind === 'month' ? 'on' : ''}">Ay</button></div>
    <div class="period-nav"><a href="#/report/${kind}/${off + 1}">${icon('back')} Önceki</a><span>${off ? `${off} ${kind === 'month' ? 'ay' : 'hafta'} önce` : kind === 'month' ? 'Bu ay' : 'Bu hafta'}</span>${off ? `<a href="#/report/${kind}/${off - 1}">Sonraki ${icon('chev')}</a>` : '<span style="width:70px"></span>'}</div>
    ${!st.days ? emptyBox('calendar', 'Bu dönemde kayıt yok', 'Antrenman, maç veya seans kaydettiğinde raporun burada oluşur.') : `
    <div class="metric-grid">
      ${m('Aktif gün', st.days, '', st.days, pv.days)}
      ${m('Süre', fmtInt(st.min), 'dk', st.min, pv.min)}
      ${m('Kalori', fmtInt(st.kcal), 'kcal', st.kcal, pv.kcal)}
      ${st.sets || pv.sets ? m('Set', st.sets, '', st.sets, pv.sets) : ''}
      ${st.vol || pv.vol ? m('Toplam kaldırılan', st.vol >= 10000 ? fmtN(st.vol / 1000, 1) : fmtInt(st.vol), st.vol >= 10000 ? 't' : 'kg', st.vol, pv.vol) : ''}
      ${st.tennisH || pv.tennisH ? m('Tenis', fmtN(st.tennisH, 1), 'saat', st.tennisH, pv.tennisH) : ''}
      ${st.matches ? `<div class="metric"><div class="lbl">Maç</div><b class="num">${st.wins}G ${st.matches - st.wins}M</b><div class="note">%${fmtInt((st.wins / st.matches) * 100)} galibiyet</div></div>` : ''}
      ${st.pilMin || pv.pilMin ? m('Pilates', fmtInt(st.pilMin), 'dk', st.pilMin, pv.pilMin) : ''}
    </div>
    ${kind === 'week' && !off ? `<div style="margin-top:10px">${streakCard()}</div>` : ''}
    ${st.prs.length ? `<div class="sec"><h2>Kırılan rekorlar</h2><span class="pill accent">${icon('trophy')}${st.prs.length}</span></div>
      <div class="list">${st.prs.slice(-8).reverse().map(x => { const ex = getEx(x.exId); return `<a class="item" href="#/ex/${encodeURIComponent(x.exId)}">${thumb(ex)}<div class="grow"><div class="name">${esc(ex.name)}</div><div class="meta num">${esc(fmtSet(ex, x))}</div></div>${icon('trophy', 'chev')}</a>`; }).join('')}</div>` : ''}
    ${st.sets ? `<div class="sec"><h2>Kas gruplarına göre set</h2></div><div class="card">${st.perRegion.map(([r, n]) => `<div class="track-row"><div class="top"><b>${r.name}</b><span class="num">${n} set</span></div>
      <div class="bar"><i style="width:${(n / maxR) * 100}%;background:var(--accent)"></i></div></div>`).join('')}</div>
    <div class="sec"><h2>En çok yaptığın hareketler</h2></div><div class="list">${st.topEx.map(([id, n]) => { const ex = getEx(id); return ex ? `<a class="item" href="#/ex/${encodeURIComponent(id)}">${thumb(ex)}<div class="grow"><div class="name">${esc(ex.name)}</div><div class="meta">${n} set</div></div>${icon('chev', 'chev')}</a>` : ''; }).join('')}</div>` : ''}`}
    <div class="faint small" style="text-align:center;margin-top:14px">Seri: ${s.cur} hafta · en uzun ${s.longest} hafta</div>`;
  $$('.seg button', view).forEach(btn => btn.addEventListener('click', () => location.replace(`#/report/${btn.dataset.k}/0`)));
}

// ═════════════════════════ Sesli rehber (Türkçe)
let trVoice = null;
function pickVoice() {
  try {
    const vs = speechSynthesis.getVoices();
    trVoice = vs.find(v => /^tr/i.test(v.lang) && /yelda|enhanced|premium/i.test(v.name)) || vs.find(v => /^tr/i.test(v.lang)) || null;
  } catch { trVoice = null; }
  return trVoice;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.addEventListener?.('voiceschanged', pickVoice); }
const voiceOn = () => db.settings.voice !== false && 'speechSynthesis' in window;
function speak(text, { interrupt = true } = {}) {
  if (!voiceOn()) return false;
  try {
    if (!trVoice) pickVoice();
    if (interrupt) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR'; if (trVoice) u.voice = trVoice;
    u.rate = 1.02; u.pitch = 1;
    speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
// iOS sesi ilk dokunuşla açar
function unlockSpeech() { if (voiceOn()) { try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch { /* yok */ } } }

// ═════════════════════════ Kilit ekranında dinlenme sayacı (ses dosyası + Media Session)
// Dinlenme süresi kadar sessiz bir WAV üretilir; son 3 saniyede kısa bipler, sonunda uzun bip çalar.
// Ses çaldığı için iPhone ekran kilitliyken de sayar ve kilit ekranında görünür. Müziği durdurur, bu yüzden isteğe bağlı.
let restAudio = null, restAudioUrl = null;
function makeRestWav(sec) {
  const rate = 8000, n = Math.max(1, Math.round(sec * rate)) + rate, data = new Uint8Array(44 + n);
  const v = new DataView(data.buffer);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate, true);
  v.setUint16(32, 1, true); v.setUint16(34, 8, true); str(36, 'data'); v.setUint32(40, n, true);
  data.fill(128, 44);
  // Çok kısık bir taban sinyal: tamamen sessiz dosyayı iOS'un durdurmasını önler
  for (let i = 0; i < n; i += 400) data[44 + i] = 129;
  const tone = (start, dur, freq, amp) => {
    for (let i = 0; i < dur * rate; i++) {
      const k = Math.round(start * rate) + i; if (k >= n) break;
      const env = Math.min(1, i / 80, (dur * rate - i) / 80);
      data[44 + k] = 128 + Math.round(Math.sin((2 * Math.PI * freq * i) / rate) * amp * env);
    }
  };
  for (const t of [3, 2, 1]) if (sec - t > 0) tone(sec - t, 0.12, 880, 60);
  tone(sec, 0.25, 880, 90); tone(sec + 0.3, 0.45, 1320, 90);
  return new Blob([data], { type: 'audio/wav' });
}
function restAudioStart(sec) {
  if (!db.settings.lockTimer || sec <= 0) return;
  try {
    restAudioStop();
    restAudioUrl = URL.createObjectURL(makeRestWav(sec));
    restAudio = new Audio(restAudioUrl);
    restAudio.play().catch(() => {});
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: `Dinlenme · ${Math.floor(sec / 60)}:${pad2(Math.round(sec) % 60)}`, artist: 'Gym Takip', album: db.session?.name || 'Antrenman',
        artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }] });
      navigator.mediaSession.setActionHandler?.('pause', () => {});
      navigator.mediaSession.setActionHandler?.('stop', () => stopRest());
    }
  } catch { /* desteklenmiyor */ }
}
function restAudioStop() {
  if (restAudio) { try { restAudio.pause(); } catch { /* yok */ } restAudio = null; }
  if (restAudioUrl) { URL.revokeObjectURL(restAudioUrl); restAudioUrl = null; }
}

// ═════════════════════════ Yemek kaydı: arama, porsiyon, öğün
const SLOTS = [['breakfast', 'Kahvaltı'], ['lunch', 'Öğle'], ['snack', 'Ara öğün'], ['dinner', 'Akşam']];
const defaultSlot = () => { const h = new Date().getHours(); return h < 11 ? 'breakfast' : h < 15 ? 'lunch' : h < 18 ? 'snack' : 'dinner'; };
const foodMacros = (f, grams) => ({ kcal: (f.kcal * grams) / 100, p: (f.p * grams) / 100, c: (f.c * grams) / 100, f: (f.f * grams) / 100 });
function logFood(entry, day = dayKey()) {
  const e = { id: uid(), ts: Date.now(), slot: entry.slot || defaultSlot(), ...entry };
  (db.foodLog[day] ||= []).push(e);
  addFood(e.kcal, e.p, 0, e.c || 0, e.f || 0);
  return e;
}
function unlogFood(id, day = dayKey()) {
  const list = db.foodLog[day] || [], e = list.find(x => x.id === id);
  if (!e) return;
  db.foodLog[day] = list.filter(x => x !== e);
  addFood(-e.kcal, -e.p, 0, -(e.c || 0), -(e.f || 0));
  if (e.menu && db.menu[day]?.eaten) delete db.menu[day].eaten[e.menu];
}
const foodSearchFn = (list, q) => rankSearch(list, q, f => [f.n, ...f.aka].join(' '), f => FOOD_CATS[f.cat] || '', f => f.n);
function recentFoods() {
  const seen = new Map();
  for (const day of Object.keys(db.foodLog).sort().reverse()) for (const e of [...db.foodLog[day]].reverse()) {
    if (e.fid && getFood(e.fid) && !seen.has(e.fid)) seen.set(e.fid, e);
    if (e.off && !seen.has('off:' + e.off.code)) seen.set('off:' + e.off.code, e);
    if (seen.size >= 12) return [...seen.values()];
  }
  return [...seen.values()];
}
function foodLogHTML(day) {
  const list = db.foodLog[day] || [];
  if (!list.length) return '';
  return `<div class="sec"><h2>Bugün yediklerin</h2><span class="faint small num">${list.length} kayıt</span></div>
    <div class="card food-log">${SLOTS.map(([k, n]) => {
      const items = list.filter(e => e.slot === k);
      if (!items.length) return '';
      const sum = items.reduce((t, e) => t + e.kcal, 0);
      return `<div class="fl-slot"><div class="fl-head"><b>${n}</b><span class="num">${fmtInt(sum)} kcal</span></div>
        ${items.map(e => `<div class="fl-row"><div class="grow"><div>${esc(e.name)}</div><div class="faint small num">${esc(e.portion || '')}${e.portion ? ' · ' : ''}${fmtInt(e.p)} g protein</div></div>
          <span class="num">${fmtInt(e.kcal)}</span><button class="ibtn" data-unlog="${e.id}" aria-label="Sil">${icon('x')}</button></div>`).join('')}</div>`;
    }).join('')}</div>`;
}
// Yiyecek ekleme paneli: arama → porsiyon → öğün
function foodSheet(after, { slot = defaultSlot(), food = null } = {}) {
  let q = '';
  const { el, close } = openSheet(`
    <div class="sheet-title">Yiyecek ekle</div>
    <div class="row" style="gap:8px"><label class="search grow" style="margin:0">${icon('search')}<input id="fs-q" type="search" placeholder="Ara: mercimek çorbası, simit, ayran…" autocomplete="off"></label>
      <button class="top-btn fs-scan" id="fs-scan" aria-label="Barkod okut">${icon('barcode')}</button></div>
    <div id="fs-body" class="fs-body"></div>
    <button class="alt" id="fs-quick" style="margin-top:10px">Kalori ve proteini elle gir</button>`);
  const body = $('#fs-body', el);
  const row = f => {
    const u = f.units[0], m = foodMacros(f, u[1]);
    return `<button class="item fs-item" data-fid="${f.id}" style="width:100%;text-align:left"><div class="grow"><div class="name">${esc(f.n)}</div>
      <div class="meta num">1 ${esc(u[0])} · ${fmtInt(m.kcal)} kcal · ${fmtN(m.p, 1)} g protein</div></div>${icon('plus', 'chev')}</button>`;
  };
  const list = () => {
    if (q.trim()) {
      const res = foodSearchFn([...myFoods(), ...FOOD_DB.filter(f => f.cat !== 'malzeme'), ...FOOD_DB.filter(f => f.cat === 'malzeme')], q).slice(0, 40);
      body.innerHTML = res.length ? `<div class="list">${res.map(row).join('')}</div>` : `<div class="faint small" style="text-align:center;margin:18px 0">Bulunamadı. Barkod okutabilir veya elle girebilirsin.</div>`;
    } else {
      const rec = recentFoods();
      body.innerHTML = (rec.length ? `<div class="group-title" style="margin-top:12px">Son yediklerin</div><div class="list">${rec.map(e => e.fid
        ? `<button class="item fs-item" data-fid="${e.fid}" data-qty="${e.qty}" data-unit="${esc(e.unit)}" style="width:100%;text-align:left"><div class="grow"><div class="name">${esc(e.name)}</div><div class="meta num">${esc(e.portion)} · ${fmtInt(e.kcal)} kcal</div></div><span class="fs-again">${icon('plus')}</span></button>`
        : `<button class="item fs-item" data-off="${esc(e.off.code)}" style="width:100%;text-align:left"><div class="grow"><div class="name">${esc(e.name)}</div><div class="meta num">${esc(e.portion)} · ${fmtInt(e.kcal)} kcal</div></div><span class="fs-again">${icon('plus')}</span></button>`).join('')}</div>` : '')
        + `<details class="fs-cat" ${db.recipes.length ? 'open' : ''}><summary>Tariflerim<span class="faint small">${db.recipes.length}</span></summary><div class="list">${myFoods().map(f => row(f).replace('</button>', `<span class="fs-edit" data-edit="${f.id}">${icon('edit')}</span></button>`)).join('')}
          <button class="item" id="fs-new-recipe" style="width:100%;text-align:left"><div class="badge">${icon('plus')}</div><div class="grow"><div class="name">Yeni tarif oluştur</div><div class="meta">Malzemeleri gir, porsiyon değerleri hesaplansın</div></div></button></div></details>`
        + Object.entries(FOOD_CATS).map(([k, n]) => `<details class="fs-cat"><summary>${n}<span class="faint small">${FOOD_DB.filter(f => f.cat === k).length}</span></summary><div class="list">${FOOD_DB.filter(f => f.cat === k).map(row).join('')}</div></details>`).join('');
    }
    $$('[data-fid]', body).forEach(b => b.addEventListener('click', e => {
      if (e.target.closest('[data-edit]')) { const r = db.recipes.find(x => x.id === e.target.closest('[data-edit]').dataset.edit); close(); return recipeSheet(() => foodSheet(after, { slot }), r); }
      portion(getFood(b.dataset.fid), b.dataset.unit, +b.dataset.qty || 1);
    }));
    $('#fs-new-recipe', body)?.addEventListener('click', () => { close(); recipeSheet(() => foodSheet(after, { slot })); });
    $$('[data-off]', body).forEach(b => b.addEventListener('click', () => portion(offFood(db.offCache[b.dataset.off]))));
  };
  // Porsiyon seçimi
  const portion = (f, unit, qty = 1) => {
    if (!f) return;
    let u = f.units.find(x => x[0] === unit) || f.units[0], n = qty, s = slot;
    if (u[1] === 1 && n === 1) n = 100;
    const draw = () => {
      const g = u[1] * n, m = foodMacros(f, g);
      body.innerHTML = `<div class="fs-portion">
        <button class="lnk small" id="fs-back">${icon('back')} Geri</button>
        <h3>${esc(f.n)}</h3>
        <div class="chip-wrap" id="fs-units">${f.units.map(x => `<button class="chip ${x === u ? 'on' : ''}" data-u="${esc(x[0])}">${esc(x[0])}${x[1] !== 1 ? ` <span class="faint">${x[1]} ${f.liquid ? 'ml' : 'g'}</span>` : ''}</button>`).join('')}</div>
        <div class="fs-qty"><button id="fs-minus">${icon('minus')}</button><input id="fs-n" inputmode="decimal" value="${fmtN(n, 2)}"><span>${esc(u[0])}</span><button id="fs-plus">${icon('plus')}</button></div>
        <div class="fs-macros"><div><b class="num">${fmtInt(m.kcal)}</b><span>kcal</span></div><div><b class="num">${fmtN(m.p, 1)}</b><span>protein</span></div><div><b class="num">${fmtN(m.c, 1)}</b><span>karb.</span></div><div><b class="num">${fmtN(m.f, 1)}</b><span>yağ</span></div></div>
        <div class="faint small" style="text-align:center;margin-top:6px">${fmtInt(g)} ${f.liquid ? 'ml' : 'g'} · Kaynak: ${esc(foodSrcText(f))}</div>
        <div class="mini-seg" id="fs-slot" style="margin-top:14px">${SLOTS.map(([k, nm]) => `<button data-v="${k}" class="${k === s ? 'on' : ''}">${nm}</button>`).join('')}</div>
        <button class="btn" id="fs-add" style="margin-top:14px">${icon('plus')} Ekle</button></div>`;
      $('#fs-back', body).addEventListener('click', list);
      $$('#fs-units .chip', body).forEach(b => b.addEventListener('click', () => {
        const nu = f.units.find(x => x[0] === b.dataset.u);
        if (nu[1] === 1 && u[1] !== 1) n = Math.round(u[1] * n); else if (nu[1] !== 1 && u[1] === 1) n = 1;
        u = nu; draw();
      }));
      const stepQ = d => { const st = u[1] === 1 ? (f.liquid ? 50 : 10) : 0.5; n = Math.max(st, Math.round((n + d * st) / st) * st); draw(); };
      $('#fs-minus', body).addEventListener('click', () => stepQ(-1));
      $('#fs-plus', body).addEventListener('click', () => stepQ(1));
      $('#fs-n', body).addEventListener('change', e => { n = Math.max(0.1, num(e.target.value)); draw(); });
      $$('#fs-slot button', body).forEach(b => b.addEventListener('click', () => { s = b.dataset.v; $$('#fs-slot button', body).forEach(x => x.classList.toggle('on', x === b)); }));
      $('#fs-add', body).addEventListener('click', () => {
        const g = u[1] * n, m = foodMacros(f, g);
        logFood({ fid: f.off ? undefined : f.id, off: f.off, name: f.n, unit: u[0], qty: n, grams: g, portion: `${fmtN(n, 2)} ${u[0]}`, slot: s, ...m });
        close(); toast(`${f.n} eklendi`, 'fork'); after();
      });
    };
    draw();
  };
  $('#fs-q', el).addEventListener('input', e => { q = e.target.value; list(); });
  if (!food) setTimeout(() => $('#fs-q', el)?.focus(), 300);
  $('#fs-quick', el).addEventListener('click', () => { close(); mealSheet(after); });
  $('#fs-scan', el).addEventListener('click', () => scanBarcode(prod => foodSheet(after, { slot, food: offFood(prod) })));
  if (food) portion(food); else list();
}

// ═════════════════════════ Barkod okuma (paketli ürünler, Open Food Facts)
// iPhone'da yerleşik BarcodeDetector kapalı; MIT lisanslı barcode-detector (ZXing wasm) uygulamayla birlikte gelir.
async function getDetector() {
  const formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
  try {
    if ('BarcodeDetector' in window && (await BarcodeDetector.getSupportedFormats()).includes('ean_13')) return new BarcodeDetector({ formats });
  } catch { /* yerleşik yok */ }
  if (!window.BarcodeDetectionAPI) {
    await new Promise((ok, fail) => { const s = document.createElement('script'); s.src = 'vendor/barcode-detector.js'; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
    BarcodeDetectionAPI.setZXingModuleOverrides({ locateFile: p => (p.endsWith('.wasm') ? new URL('vendor/zxing_reader.wasm', location.href).href : p) });
  }
  return new BarcodeDetectionAPI.BarcodeDetector({ formats });
}
// Open Food Facts ürününü yiyecek nesnesine çevir (100 g değerleri)
function offFood(p) {
  if (!p) return null;
  const units = [];
  if (p.serving > 0) units.push(['porsiyon', p.serving]);
  units.push([p.liquid ? 'ml' : 'g', 1]);
  if (p.pack > 0 && p.pack !== p.serving) units.push(['paket', p.pack]);
  return { id: 'off:' + p.code, n: p.name, kcal: p.kcal, p: p.p, c: p.c, f: p.f, units, liquid: p.liquid, off: { code: p.code }, aka: [] };
}
async function lookupOFF(code) {
  if (db.offCache[code]) return db.offCache[code];
  const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=code,product_name,product_name_tr,brands,nutriments,serving_quantity,product_quantity,quantity`);
  if (!r.ok) throw new Error('net');
  const d = await r.json();
  if (d.status !== 1 || !d.product) return null;
  const pr = d.product, n = pr.nutriments || {};
  const kcal = n['energy-kcal_100g'] ?? (n.energy_100g ? n.energy_100g / 4.184 : null);
  if (kcal == null) return { code, name: pr.product_name_tr || pr.product_name || code, missing: true };
  const prod = {
    code, name: (() => { const nm = pr.product_name_tr || pr.product_name || '', br = pr.brands?.split(',')[0]?.trim() || '';
      return (br && !norm(nm).includes(norm(br)) ? `${nm} · ${br}` : nm) || `Ürün ${code}`; })(),
    kcal: +kcal, p: +(n.proteins_100g || 0), c: +(n.carbohydrates_100g || 0), f: +(n.fat_100g || 0),
    serving: +pr.serving_quantity || 0, pack: +pr.product_quantity || 0, liquid: /ml|l\b|lt/i.test(pr.quantity || ''),
  };
  db.offCache[code] = prod; save();
  return prod;
}
function scanBarcode(onProduct) {
  let stream = null, timer = 0, busy = false, done = false;
  const stop = () => { done = true; clearInterval(timer); stream?.getTracks().forEach(t => t.stop()); stream = null; };
  const { el, close } = openSheet(`
    <div class="sheet-title">Barkod okut</div>
    <div class="scan-box"><video id="sc-v" playsinline muted autoplay></video><div class="scan-frame"></div><div class="scan-msg" id="sc-msg">Kamera açılıyor…</div></div>
    <div class="row" style="gap:8px;margin-top:12px"><div class="in-box grow"><label>Ya da barkod numarasını yaz</label><input id="sc-code" inputmode="numeric" placeholder="8690000000000"></div>
      <button class="btn" id="sc-go" style="width:auto;margin:0;padding:0 18px;align-self:stretch">Ara</button></div>
    <div class="faint small" style="margin-top:10px;text-align:center">Ürün bilgileri Open Food Facts'ten gelir (internet gerekir). Bulunan ürünler telefonda saklanır.</div>`, stop);
  const msg = t => { const m = $('#sc-msg', el); if (m) m.textContent = t; };
  const found = async code => {
    if (busy || done) return; busy = true;
    navigator.vibrate?.(60); msg(`${code} aranıyor…`);
    try {
      const prod = await lookupOFF(code);
      if (!prod) { msg('Ürün bulunamadı. Elle ekleyebilirsin.'); toast('Ürün Open Food Facts\'te yok', 'info'); busy = false; return; }
      if (prod.missing) { msg('Üründe besin değeri yok. Elle ekleyebilirsin.'); busy = false; return; }
      stop(); close(); onProduct(prod);
    } catch { msg('İnternet bağlantısı gerekiyor.'); busy = false; }
  };
  $('#sc-go', el).addEventListener('click', () => { const c = $('#sc-code', el).value.replace(/\D/g, ''); if (c.length >= 8) found(c); else toast('Barkod en az 8 haneli olmalı', 'info'); });
  (async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false });
      if (done) return stop();
      const v = $('#sc-v', el); v.srcObject = stream; await v.play().catch(() => {});
      msg('Barkodu çerçevenin içine getir');
      const det = await getDetector();
      timer = setInterval(async () => {
        if (busy || done || v.readyState < 2) return;
        try { const r = await det.detect(v); if (r[0]?.rawValue) found(r[0].rawValue); } catch { /* sonraki kare */ }
      }, 300);
    } catch { msg('Kameraya erişilemedi. Barkod numarasını aşağıya yazabilirsin.'); }
  })();
}

// ═════════════════════════ Kendi tarifim: malzemelerden yemek oluşturma
function recipeFood(r) {
  const tot = { kcal: 0, p: 0, c: 0, f: 0 };
  let raw = 0;
  for (const it of r.items) {
    const f = getFood(it.fid); if (!f) continue;
    const m = foodMacros(f, it.g);
    for (const k in tot) tot[k] += m[k];
    raw += it.g;
  }
  const cooked = r.cooked > 0 ? r.cooked : raw;
  if (!cooked) return null;
  const k = 100 / cooked;
  return { id: r.id, n: r.n, kcal: tot.kcal * k, p: tot.p * k, c: tot.c * k, f: tot.f * k, units: [['porsiyon', cooked / (r.portions || 1)], ['g', 1]],
    cat: 'tariflerim', aka: [], src: 'my', mine: true, recipe: r, total: tot, cooked };
}
const myFoods = () => db.recipes.map(recipeFood).filter(Boolean);
function getFood(id) {
  if (!id) return null;
  if (FOOD_BY_ID[id]) return FOOD_BY_ID[id];
  if (id.startsWith('off:')) return offFood(db.offCache[id.slice(4)]);
  const r = db.recipes.find(x => x.id === id);
  return r ? recipeFood(r) : null;
}
const foodSrcText = f => (f.mine ? 'Kendi tarifin' : f.off ? 'Open Food Facts (ODbL)' : srcText(f.src));

function recipeSheet(after, existing = null) {
  const r = existing ? JSON.parse(JSON.stringify(existing)) : { id: 'my-' + uid(), n: '', items: [], cooked: 0, portions: 4 };
  let q = '';
  const { el, close } = openSheet(`
    <div class="sheet-title">${existing ? 'Tarifi düzenle' : 'Yeni tarif'}</div>
    <div class="in-box"><label>Yemeğin adı</label><input id="rc-name" maxlength="50" placeholder="Örn. Annemin mercimek köftesi" value="${esc(r.n)}"></div>
    <div class="card-label" style="margin:16px 4px 8px">Malzemeler</div>
    <div id="rc-items"></div>
    <label class="search" style="margin-top:8px">${icon('search')}<input id="rc-q" type="search" placeholder="Malzeme ekle: bulgur, kıyma, soğan…" autocomplete="off"></label>
    <div id="rc-res"></div>
    <div class="in-row" style="margin-top:14px">
      <div class="in-box"><label>Pişmiş ağırlık · g</label><input id="rc-cooked" inputmode="numeric" placeholder="çiğ ağırlık" value="${r.cooked || ''}"></div>
      <div class="in-box"><label>Porsiyon sayısı</label><input id="rc-portions" inputmode="numeric" value="${r.portions || 4}"></div>
    </div>
    <div class="faint small" style="margin:6px 4px 0">Pişmiş ağırlığı bilmiyorsan boş bırak; çiğ malzemelerin toplamı kullanılır. Tencereyi tartmak en doğru sonucu verir.</div>
    <div id="rc-sum"></div>
    <div class="sheet-actions sticky">${existing ? '<button class="btn ghost danger" id="rc-del">Sil</button>' : '<button class="btn ghost" id="rc-cancel">Vazgeç</button>'}<button class="btn" id="rc-save">Kaydet</button></div>`);
  const pool = () => FOOD_DB.filter(f => f.id !== r.id);
  const draw = () => {
    $('#rc-items', el).innerHTML = r.items.length ? `<div class="list">${r.items.map((it, i) => {
      const f = getFood(it.fid);
      return `<div class="item rc-item"><div class="grow"><div class="name">${esc(f?.n || '?')}</div><div class="meta num">${f ? fmtInt(foodMacros(f, it.g).kcal) : 0} kcal</div></div>
        <input class="rc-g" data-i="${i}" inputmode="decimal" value="${fmtN(it.g)}"><span class="faint small">g</span><button class="ibtn" data-del="${i}" aria-label="Çıkar">${icon('x')}</button></div>`;
    }).join('')}</div>` : '<div class="faint small" style="margin:0 4px">Henüz malzeme yok. Aşağıdan ara ve ekle.</div>';
    $$('.rc-g', el).forEach(inp => inp.addEventListener('change', () => { r.items[+inp.dataset.i].g = Math.max(0, num(inp.value)); draw(); }));
    $$('[data-del]', el).forEach(b => b.addEventListener('click', () => { r.items.splice(+b.dataset.del, 1); draw(); }));
    r.cooked = num($('#rc-cooked', el).value); r.portions = Math.max(1, Math.round(num($('#rc-portions', el).value)) || 1);
    const food = recipeFood(r);
    $('#rc-sum', el).innerHTML = food ? `<div class="fs-macros" style="margin-top:14px">${[['kcal', 'kcal / porsiyon'], ['p', 'protein'], ['c', 'karb.'], ['f', 'yağ']].map(([k, n]) => `<div><b class="num">${k === 'kcal' ? fmtInt(food.total[k] / r.portions) : fmtN(food.total[k] / r.portions, 1)}</b><span>${n}</span></div>`).join('')}</div>
      <div class="faint small" style="text-align:center;margin-top:6px">Porsiyon ${fmtInt(food.cooked / r.portions)} g · 100 g'da ${fmtInt(food.kcal)} kcal</div>` : '';
  };
  const results = () => {
    const res = q.trim() ? rankSearch(pool(), q, f => [f.n, ...f.aka].join(' '), f => FOOD_CATS[f.cat] || '', f => f.n)
      .sort((a, b) => (b.cat === 'malzeme') - (a.cat === 'malzeme')).slice(0, 8) : [];
    $('#rc-res', el).innerHTML = res.length ? `<div class="list" style="margin-top:6px">${res.map(f => `<button class="item" data-add="${f.id}" style="width:100%;text-align:left"><div class="grow"><div class="name">${esc(f.n)}</div><div class="meta">${FOOD_CATS[f.cat] || ''} · 100 g ${fmtInt(f.kcal)} kcal</div></div>${icon('plus', 'chev')}</button>`).join('')}</div>` : '';
    $$('[data-add]', el).forEach(b => b.addEventListener('click', () => {
      const f = FOOD_BY_ID[b.dataset.add];
      r.items.push({ fid: f.id, g: f.units[0][1] > 1 ? f.units[0][1] : 100 });
      q = ''; $('#rc-q', el).value = ''; results(); draw();
    }));
  };
  $('#rc-q', el).addEventListener('input', e => { q = e.target.value; results(); });
  $('#rc-cooked', el).addEventListener('change', draw);
  $('#rc-portions', el).addEventListener('change', draw);
  $('#rc-cancel', el)?.addEventListener('click', close);
  $('#rc-del', el)?.addEventListener('click', () => {
    if (!confirm(`"${r.n}" tarifi silinsin mi?`)) return;
    db.recipes = db.recipes.filter(x => x.id !== r.id); save(); close(); after();
  });
  $('#rc-save', el).addEventListener('click', () => {
    r.n = $('#rc-name', el).value.trim();
    if (!r.n) return toast('Yemeğe bir ad ver', 'info');
    if (!r.items.length) return toast('En az bir malzeme ekle', 'info');
    draw();
    const i = db.recipes.findIndex(x => x.id === r.id);
    if (i >= 0) db.recipes[i] = r; else db.recipes.push(r);
    save(); close(); toast('Tarif kaydedildi', 'check'); after();
  });
  draw();
}

// ═════════════════════════ Yıl özeti
function yearStats(year) {
  const from = `${year}-01-01`, to = `${year}-12-31`;
  const st = periodStats(from, to);
  const inY = d => d >= from && d <= to;
  const ws = working(db.sets.filter(s => inY(s.date)));
  const byEx = new Map();
  for (const s of ws) (byEx.get(s.exId) || byEx.set(s.exId, []).get(s.exId)).push(s);
  const fav = [...byEx].sort((a, b) => b[1].length - a[1].length)[0];
  // En çok gelişen ağırlık hareketleri: yılın ilk ve son ayındaki en iyi tahmini maksimum
  const gains = [...byEx].map(([id, l]) => {
    const ex = getEx(id); if (!ex || (ex.type && ex.type !== 'weight') || l.length < 6) return null;
    const sorted = [...l].sort((a, b) => a.ts - b.ts), first = sorted.slice(0, Math.max(3, Math.floor(l.length / 5))), last = sorted.slice(-Math.max(3, Math.floor(l.length / 5)));
    const best = arr => Math.max(...arr.map(s => (s.r <= 12 ? e1rm(s.w, s.r) : 0)));
    const a = best(first), b = best(last);
    return a > 0 && b > a ? { ex, a, b, pct: ((b - a) / a) * 100 } : null;
  }).filter(Boolean).sort((x, y) => y.pct - x.pct).slice(0, 3);
  const months = [...Array(12)].map((_, m) => [...activeDaySet()].filter(d => d.startsWith(`${year}-${pad2(m + 1)}`)).length);
  const bestM = months.indexOf(Math.max(...months));
  const pil = db.activities.filter(a => a.sport === 'pilates' && inY(a.date));
  return { ...st, fav: fav ? [getEx(fav[0]), fav[1].length] : null, gains, months, bestM, pilN: pil.length, longest: streakInfo().longest };
}
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
function renderRecap(year) {
  const now = new Date().getFullYear();
  year = +year || now;
  setHeader(`${year} özeti`, { back: true, always: true });
  const y = yearStats(year);
  const years = [...new Set([...activeDaySet()].map(d => +d.slice(0, 4)))].sort();
  const maxM = Math.max(1, ...y.months);
  if (!y.days) { view.innerHTML = pageHead('Yıl özeti', String(year)) + emptyBox('calendar', 'Bu yıl kayıt yok', 'Spor yaptıkça yılın özeti burada oluşur.'); return; }
  view.innerHTML = `<div class="recap-hero"><div class="eyebrow">${year} yılın</div><h1><b class="num">${y.days}</b> gün spor</h1>
      <div class="sub">${fmtInt(y.min / 60)} saat · ${fmtInt(y.kcal)} kcal yakıldı</div></div>
    ${years.length > 1 ? `<div class="chips" style="margin:12px 0">${years.map(v => `<button class="chip ${v === year ? 'on' : ''}" data-y="${v}">${v}</button>`).join('')}</div>` : ''}
    <div class="metric-grid">
      ${y.workouts ? `<div class="metric"><div class="lbl">Antrenman</div><b class="num">${y.workouts}</b></div>` : ''}
      ${y.sets ? `<div class="metric"><div class="lbl">Set</div><b class="num">${fmtInt(y.sets)}</b></div>` : ''}
      ${y.vol ? `<div class="metric"><div class="lbl">Toplam kaldırılan</div><b class="num">${fmtN(y.vol / 1000, 1)}<small>ton</small></b></div>` : ''}
      ${y.prs.length ? `<div class="metric"><div class="lbl">Kırılan rekor</div><b class="num">${y.prs.length}</b></div>` : ''}
      ${y.matches ? `<div class="metric"><div class="lbl">Tenis maçı</div><b class="num">${y.wins}G ${y.matches - y.wins}M</b><div class="note">${fmtN(y.tennisH, 0)} saat kortta</div></div>` : ''}
      ${y.pilN ? `<div class="metric"><div class="lbl">Pilates</div><b class="num">${y.pilN}<small>seans</small></b><div class="note">${fmtInt(y.pilMin)} dk</div></div>` : ''}
      <div class="metric"><div class="lbl">En uzun seri</div><b class="num">${y.longest}<small>hafta</small></b></div>
      <div class="metric"><div class="lbl">En aktif ay</div><b class="num" style="font-size:22px">${MONTHS[y.bestM]}</b><div class="note">${y.months[y.bestM]} gün</div></div>
    </div>
    <div class="sec"><h2>Aylara göre</h2></div>
    <div class="card"><div class="week recap-months">${y.months.map((n, i) => `<div class="d"><div class="b ${n ? 'on' : ''}" style="height:${n ? Math.max(10, (n / maxM) * 80) : 5}px"></div><span>${MONTHS[i].slice(0, 3)}</span></div>`).join('')}</div></div>
    ${y.fav ? `<div class="sec"><h2>En çok yaptığın hareket</h2></div><a class="item card" href="#/ex/${encodeURIComponent(y.fav[0].id)}" style="display:flex">${thumb(y.fav[0])}<div class="grow"><div class="name">${esc(y.fav[0].name)}</div><div class="meta">${y.fav[1]} set</div></div>${icon('chev', 'chev')}</a>` : ''}
    ${y.gains.length ? `<div class="sec"><h2>En çok güçlendiğin hareketler</h2></div><div class="list">${y.gains.map(g => `<a class="item" href="#/ex/${encodeURIComponent(g.ex.id)}">${thumb(g.ex)}<div class="grow"><div class="name">${esc(g.ex.name)}</div>
      <div class="meta num">Tahmini maksimum ${fmtN(g.a, 1)} → ${fmtN(g.b, 1)} kg</div></div><b class="num good">+%${fmtInt(g.pct)}</b></a>`).join('')}</div>` : ''}
    <button class="btn" id="rc-share" style="margin-top:18px">${icon('download')} Paylaşılabilir görsel oluştur</button>`;
  $$('[data-y]', view).forEach(b => b.addEventListener('click', () => location.replace(`#/recap/${b.dataset.y}`)));
  $('#rc-share').addEventListener('click', () => shareRecap(year, y));
}
// 1080×1350 paylaşım görseli (telefonda üretilir, hiçbir yere yüklenmez)
async function shareRecap(year, y) {
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 1350); g.addColorStop(0, '#1d2108'); g.addColorStop(0.5, '#0d0d0f'); g.addColorStop(1, '#0a0a0b');
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  const font = (w, s) => `${w} ${s}px -apple-system, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;
  x.fillStyle = '#d4f53c'; x.font = font(800, 44); x.fillText(`${year} · YILIN ÖZETİ`, 80, 140);
  x.fillStyle = '#ffffff'; x.font = font(800, 200); x.fillText(String(y.days), 72, 360);
  x.font = font(700, 64); x.fillText('gün spor', 80, 450);
  x.fillStyle = '#a5a5ad'; x.font = font(600, 40); x.fillText(`${fmtInt(y.min / 60)} saat · ${fmtInt(y.kcal)} kcal`, 80, 520);
  const tiles = [
    y.workouts && ['Antrenman', String(y.workouts)], y.vol && ['Toplam kaldırılan', `${fmtN(y.vol / 1000, 1)} ton`], y.prs.length && ['Rekor', String(y.prs.length)],
    y.matches && ['Tenis maçı', `${y.wins}G ${y.matches - y.wins}M`], y.pilN && ['Pilates', `${y.pilN} seans`], ['En uzun seri', `${y.longest} hafta`], ['En aktif ay', MONTHS[y.bestM]],
  ].filter(Boolean).slice(0, 6);
  tiles.forEach(([l, v], i) => {
    const cx = 80 + (i % 2) * 470, cy = 600 + Math.floor(i / 2) * 200;
    x.fillStyle = 'rgba(255,255,255,0.06)'; x.beginPath(); x.roundRect(cx, cy, 440, 170, 36); x.fill();
    x.fillStyle = '#8b8b94'; x.font = font(700, 30); x.fillText(l.toLocaleUpperCase('tr-TR'), cx + 36, cy + 60);
    x.fillStyle = '#ffffff'; x.font = font(800, 58); x.fillText(v, cx + 36, cy + 130);
  });
  // Aylık aktif gün çubukları
  const top = 600 + Math.ceil(tiles.length / 2) * 200 + 10, h = 1190 - top, mx = Math.max(1, ...y.months);
  if (h > 80) {
    y.months.forEach((n, i) => {
      const bw = 58, gap = (920 - bw * 12) / 11, bx = 80 + i * (bw + gap), bh = n ? Math.max(10, (n / mx) * (h - 46)) : 6;
      x.fillStyle = n ? (i === y.bestM ? '#d4f53c' : 'rgba(212,245,60,0.45)') : 'rgba(255,255,255,0.08)';
      x.beginPath(); x.roundRect(bx, top + (h - 46) - bh, bw, bh, 10); x.fill();
      x.fillStyle = '#6f6f78'; x.font = font(700, 22); x.textAlign = 'center'; x.fillText(MONTHS[i].slice(0, 3), bx + bw / 2, top + h - 10); x.textAlign = 'left';
    });
  }
  x.fillStyle = '#d4f53c'; x.font = font(800, 34); x.fillText('Gym Takip', 80, 1270);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  const file = new File([blob], `yil-ozeti-${year}.png`, { type: 'image/png' });
  try { if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: `${year} özeti` }); return; } } catch (e) { if (e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

// ═════════════════════════ Hareket detayı (bilgi + ilerleme; set girişi antrenman ekranında)
const LEVELS = { beginner: 'Başlangıç', intermediate: 'Orta', expert: 'İleri' };
let exTab = 'how';
function quickLog(exId) {
  if (db.session) {
    addToSession(exId);
    db.session.cur = db.session.items.findIndex(i => i.exId === exId);
  } else {
    db.session = { id: uid(), start: Date.now(), key: 'free', name: 'Hızlı antrenman', items: [{ exId, ...schemeObj(1, exId) }], cur: 0 };
  }
  save();
  location.hash = '#/workout';
}
function renderEx(id) {
  const ex = getEx(id);
  if (!ex) { location.replace('#/lib'); return; }
  const anim = animOf(ex);
  const regionName = REGION_BY_ID[ex.region]?.name || '';
  const inSession = db.session?.items.some(i => i.exId === ex.id);
  setHeader(ex.name, { back: true, always: true, action: ex.custom ? `<button class="top-btn danger" id="del-ex">Sil</button>` : '' });
  view.innerHTML = `
    <div id="media">${anim ? '' : `<div class="card empty" style="margin-top:6px"><div class="ic">${icon('dumbbell')}</div>Bu hareket için görsel seçilmedi.</div>`}</div>
    <div class="ex-head">
      <h1>${esc(ex.name)}</h1>${ex.alt ? `<div class="muted" style="margin-top:2px">${esc(ex.alt)}</div>` : ''}
      <div class="ex-tags" style="margin-top:10px">
        ${anim?.primary?.includes(regionName) ? '' : `<span class="pill">${esc(regionName)}</span>`}
        ${anim?.primary?.length ? `<span class="pill accent">${icon('target')}${esc(anim.primary.join(', '))}</span>` : ''}
        ${anim?.videos ? `<span class="pill blue">${icon('video')}Video</span>` : ''}
        ${anim?.level ? `<span class="pill">${LEVELS[anim.level] || anim.level}</span>` : ''}
      </div>
    </div>
    <button class="btn ex-cta" id="ex-log">${icon(inSession ? 'chev' : 'plus')} ${inSession ? 'Antrenmanda bu harekete git' : db.session ? 'Antrenmana ekle ve set gir' : 'Set kaydet'}</button>
    ${!db.session ? '<div class="faint small" style="text-align:center;margin-top:8px">Hızlı bir antrenman başlar; istediğin kadar hareket ekleyebilirsin.</div>' : ''}
    ${exNote(ex.id) ? `<div style="margin-top:14px">${noteBox(ex)}</div>` : `<div style="text-align:center;margin-top:10px"><button class="lnk small" id="ex-note-add">${icon('edit')} Not ekle</button></div>`}
    <div class="seg"><button data-t="how">Nasıl yapılır</button><button data-t="chart">İlerleme</button></div>
    <div id="pane"></div>`;
  const unmount = anim ? mountMedia($('#media'), anim) : () => {};
  $('#ex-log').addEventListener('click', () => quickLog(ex.id));
  const reNote = () => { const y = scrollY; route(); scrollTo(0, y); };
  $('#ex-note')?.addEventListener('click', () => noteSheet(ex, reNote));
  $('#ex-note-add')?.addEventListener('click', () => noteSheet(ex, reNote));
  $('#del-ex')?.addEventListener('click', () => {
    const n = setsOf(ex.id).length;
    if (!confirm(`"${ex.name}" silinsin mi?${n ? `\n${n} set kaydı da silinecek.` : ''}`)) return;
    db.custom = db.custom.filter(c => c.id !== ex.id);
    db.sets = db.sets.filter(s => s.exId !== ex.id);
    save();
    location.replace('#/lib');
  });
  const pane = $('#pane');
  const show = t => {
    exTab = t;
    $$('.seg button', view).forEach(b => b.classList.toggle('on', b.dataset.t === t));
    if (t === 'how') renderHow(pane, ex, anim);
    if (t === 'chart') renderChart(pane, ex);
  };
  $$('.seg button', view).forEach(b => b.addEventListener('click', () => show(b.dataset.t)));
  show(exTab === 'log' ? 'how' : exTab);
  return unmount;
}

function renderHow(pane, ex, anim) {
  const src = ex.steps ? ex : anim;
  if (!src?.steps) { pane.innerHTML = emptyBox('info', 'Açıklama yok', 'Bu özel hareket için açıklama eklenmedi.'); return; }
  const met = src.met || 5;
  pane.innerHTML = `
    <div class="card">
      <div class="kv"><span>Ana kaslar</span><span>${esc(src.primary.join(', '))}</span></div>
      ${src.secondary?.length ? `<div class="kv"><span>Yardımcı kaslar</span><span>${esc(src.secondary.join(', '))}</span></div>` : ''}
      ${src.level ? `<div class="kv"><span>Seviye</span><span>${LEVELS[src.level] || src.level}</span></div>` : ''}
      <div class="kv"><span>Zorluk</span><span>${met >= 6 ? 'Yüksek' : met >= 4.5 ? 'Orta' : 'Düşük'} · set başı ~${fmtInt(met * bodyKg() * 130 / 3600)} kcal</span></div>
    </div>
    <div class="sec"><h2>Adım adım</h2></div>
    <div class="card"><ol class="steps">${src.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
    ${src.tips?.length ? `<div class="sec"><h2>İpuçları</h2></div><div class="card">${src.tips.map(s => `<div class="tip">${icon('bulb')}<span>${esc(s)}</span></div>`).join('')}</div>` : ''}`;
}

let chartMetric = 'max';
function renderChart(pane, ex) {
  const type = ex.type || 'weight';
  const all = setsOf(ex.id);
  const days = groupByDay(working(all)).reverse();
  const last = groupByDay(working(all))[0];
  const best = bestSet(ex, all);
  const list = type === 'weight'
    ? [['max', 'En ağır', 'kg'], ['1rm', 'Tahmini maksimum', 'kg'], ['vol', 'Toplam kaldırılan', 'kg']]
    : type === 'time' ? [['max', 'En uzun', 'sn'], ['vol', 'Toplam', 'sn']] : [['max', 'En çok tekrar', ''], ['vol', 'Toplam tekrar', '']];
  if (!list.some(m => m[0] === chartMetric)) chartMetric = list[0][0];
  const metric = list.find(m => m[0] === chartMetric);
  const value = ss => {
    if (type === 'weight') {
      if (chartMetric === 'max') return Math.max(...ss.map(s => s.w));
      if (chartMetric === '1rm') return Math.max(...ss.map(s => e1rm(s.w, s.r)));
      return ss.reduce((a, s) => a + s.w * s.r, 0);
    }
    return chartMetric === 'max' ? Math.max(...ss.map(s => s.r)) : ss.reduce((a, s) => a + s.r, 0);
  };
  const points = days.map(([d, ss]) => ({ d, v: value(ss) }));
  const allDays = groupByDay(all);
  pane.innerHTML = `
    <div class="stat-pair">
      <div class="card"><div class="card-label">Son antrenman</div><b class="num">${last ? esc(fmtSet(ex, last[1].at(-1))) : '—'}</b><div class="sm">${last ? `${last[1].length} set · ${daysAgo(last[0])}` : 'Kayıt yok'}</div></div>
      <div class="card"><div class="card-label">Rekor</div><b class="num">${best ? esc(fmtSet(ex, best)) : '—'}</b>
        <div class="sm">${best && type === 'weight' && best.r > 1 ? `1 tekrarda ~${fmtInt(e1rm(best.w, best.r))} kg kaldırabilirsin` : best ? daysAgo(best.date) : 'Kayıt yok'}</div></div>
    </div>
    ${all.length ? `<div class="sec" style="margin-top:4px"><h2>Rekorlar</h2></div><div class="card" style="margin-bottom:14px">${recordTable(ex, exerciseRecords(ex))}</div>` : ''}
    <div class="chips" style="margin-bottom:10px">${list.map(m => `<button class="chip ${m[0] === chartMetric ? 'on' : ''}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>
    ${points.length ? `<div class="card"><canvas class="chart"></canvas></div>` : emptyBox('bars', 'Henüz veri yok', 'Bu hareketle ilk setini kaydettiğinde ilerlemen burada görünecek.')}
    ${allDays.length ? `<div class="sec"><h2>Antrenmanlar</h2></div><div class="list">${allDays.map(([d, ss]) => `<div class="item" style="display:block">
      <div class="row"><div class="grow name">${esc(fmtDay(d, { day: 'numeric', month: 'long', year: 'numeric' }))}</div><span class="faint small">${working(ss).length} set</span></div>
      <div class="set-chips">${ss.map(s => `<span class="set-chip">${s.warm ? 'Isınma · ' : ''}${esc(fmtSet(ex, s))}</span>`).join('')}</div></div>`).join('')}</div>` : ''}`;
  $$('.chip', pane).forEach(c => c.addEventListener('click', () => { chartMetric = c.dataset.m; renderChart(pane, ex); }));
  const canvas = $('canvas', pane);
  if (canvas) drawChart(canvas, points, metric[2]);
}

function drawChart(canvas, pts, unit, color) {
  const dpr = Math.min(devicePixelRatio || 1, 3);
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const c = canvas.getContext('2d');
  c.scale(dpr, dpr);
  const css = getComputedStyle(document.documentElement);
  const accent = color || css.getPropertyValue('--accent').trim();
  const muted = css.getPropertyValue('--text-3').trim();
  const L = 40, R = 14, T = 22, B = 24;
  let min = Math.min(...pts.map(p => p.v)), max = Math.max(...pts.map(p => p.v));
  if (min === max) { min *= 0.9; max = max * 1.1 || 1; }
  const pad = (max - min) * 0.15; min = Math.max(0, min - pad); max += pad;
  const x = i => (pts.length === 1 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (pts.length - 1));
  const y = v => T + (1 - (v - min) / (max - min)) * (H - T - B);
  c.font = '500 11px -apple-system, sans-serif';
  c.fillStyle = muted; c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = 1;
  c.textAlign = 'right'; c.textBaseline = 'middle';
  for (let i = 0; i <= 3; i++) {
    const v = min + ((max - min) * i) / 3, yy = y(v);
    c.beginPath(); c.moveTo(L, yy); c.lineTo(W - R, yy); c.stroke();
    c.fillText(fmtN(v, v < 10 ? 1 : 0), L - 8, yy);
  }
  c.textBaseline = 'top';
  const label = p => fmtDay(p.d, { day: 'numeric', month: 'short' });
  c.textAlign = 'left'; c.fillText(label(pts[0]), L, H - B + 8);
  if (pts.length > 1) { c.textAlign = 'right'; c.fillText(label(pts.at(-1)), W - R, H - B + 8); }
  const path = () => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(x(i), y(p.v)) : c.moveTo(x(i), y(p.v)))); };
  if (pts.length > 1) {
    const g = c.createLinearGradient(0, T, 0, H - B);
    g.addColorStop(0, accent + '40'); g.addColorStop(1, accent + '00');
    path(); c.lineTo(x(pts.length - 1), H - B); c.lineTo(x(0), H - B); c.closePath(); c.fillStyle = g; c.fill();
    path(); c.strokeStyle = accent; c.lineWidth = 2.5; c.lineJoin = 'round'; c.stroke();
  }
  pts.forEach((p, i) => { c.beginPath(); c.arc(x(i), y(p.v), pts.length > 30 ? 2 : 3.5, 0, 7); c.fillStyle = accent; c.fill(); });
  const lp = pts.at(-1);
  c.fillStyle = css.getPropertyValue('--text').trim();
  c.font = '700 12px -apple-system, sans-serif';
  c.textAlign = pts.length > 1 ? 'right' : 'center'; c.textBaseline = 'bottom';
  c.fillText(`${fmtN(lp.v)} ${unit}`, Math.min(x(pts.length - 1), W - R), y(lp.v) - 8);
}

// ═════════════════════════ Geçmiş
function renderHist() {
  setHeader('Geçmiş');
  const dates = [...new Set([...db.sets.map(s => s.date), ...db.cardio.map(c => c.date), ...db.activities.map(a => a.date)])].sort().reverse();
  const count = {};
  for (const s of db.sets) count[s.date] = (count[s.date] || 0) + 1;
  for (const a of db.activities) count[a.date] = (count[a.date] || 0) + Math.max(4, Math.round(a.min / 6));
  const monday = weekStart();
  const start = new Date(monday); start.setDate(monday.getDate() - 15 * 7);
  const todayK = dayKey();
  let cells = '';
  for (let i = 0; i < 16 * 7; i++) {
    const dt = new Date(start); dt.setDate(start.getDate() + i);
    const k = dayKey(dt);
    if (k > todayK) { cells += '<i style="visibility:hidden"></i>'; continue; }
    const n = count[k] || (cardioOn(k).length ? 1 : 0);
    cells += `<i class="${n ? (n < 8 ? 'l1' : n < 16 ? 'l2' : 'l3') : ''} ${k === todayK ? 'today' : ''}"></i>`;
  }
  const ws = dayKey(monday);
  const thisWeek = dates.filter(d => d >= ws).length;
  const totalKcal = dates.reduce((a, d) => a + dayStats(d).kcal, 0);

  // Kas dengesi: son 7 gündeki çalışma setleri, bölge başına
  const since = dayKey(new Date(Date.now() - 6 * 864e5));
  const recent = working(db.sets.filter(s => s.date >= since));
  const perRegion = REGIONS.map(r => ({ r, n: recent.filter(s => getEx(s.exId)?.region === r.id).length }));
  const low = perRegion.filter(x => x.n < (x.r.id === 'karin' ? 4 : 8)).map(x => x.r.name);
  const balance = recent.length ? `<div class="sec"><h2>Kas dengesi</h2><span class="faint small">son 7 gün</span></div>
    <div class="card">${perRegion.map(({ r, n }) => {
      const goal = r.id === 'karin' ? [6, 15] : [10, 20];
      const color = n >= goal[0] && n <= goal[1] ? 'var(--good)' : n > goal[1] ? 'var(--blue)' : n >= goal[0] / 2 ? 'var(--warn)' : 'var(--danger)';
      return `<div class="track-row"><div class="top"><b>${r.name}</b><span>${n} set · hedef ${goal[0]}–${goal[1]}</span></div>
        <div class="bar"><i style="width:${clamp((n / goal[1]) * 100, n ? 4 : 0, 100)}%;background:${color}"></i></div></div>`;
    }).join('')}
    ${low.length ? `<div class="tip" style="margin-top:14px">${icon('bulb')}<span class="small muted">${esc(low.join(', '))} bu hafta az çalıştı. Dengeli gelişim için bölge başına haftada 10–20 set önerilir.</span></div>` : ''}</div>` : '';

  view.innerHTML = pageHead(`${dates.length} gün`, 'Geçmiş') + `
    <div class="hist-links"><a href="#/report/week/0">${icon('bars')}<b>Haftalık rapor</b></a><a href="#/report/month/0">${icon('calendar')}<b>Aylık rapor</b></a><a href="#/records">${icon('trophy')}<b>Rekorlar</b></a><a href="#/recap">${icon('bolt')}<b>Yıl özeti</b></a></div>
    <div class="stats3">
      <div class="card"><b class="num">${thisWeek}</b><span>Bu hafta</span></div>
      <div class="card"><b class="num">${db.workouts.length || dates.length}</b><span>Antrenman</span></div>
      <div class="card"><b class="num">${totalKcal >= 10000 ? fmtN(totalKcal / 1000) + 'k' : fmtInt(totalKcal)}</b><span>Toplam kcal</span></div>
    </div>
    <div class="card" style="margin-top:10px"><div class="heat">${cells}</div><div class="faint small" style="margin-top:10px">Son 16 hafta</div></div>
    ${tennisStats()}
    ${balance}
    ${dates.length ? '<div class="sec"><h2>Antrenmanlar</h2></div>' : `<div style="margin-top:14px">${emptyBox('calendar', 'Henüz antrenman yok', 'Bir antrenman başlat veya set kaydet.')}</div>`}
    ${dates.map(d => {
      const st = dayStats(d);
      const ss = setsOn(d);
      const byEx = new Map();
      for (const s of ss) (byEx.get(s.exId) || byEx.set(s.exId, []).get(s.exId)).push(s);
      const ws2 = db.workouts.filter(w => w.date === d);
      const acts = actOn(d);
      const title = ws2.length || acts.length ? [...ws2.map(w => w.name), ...acts.map(typeName)].join(' + ') : fmtDay(d, { weekday: 'long' });
      const dt = parseDay(d);
      return `<details class="day"><summary>
          <div class="day-date"><b>${dt.getDate()}</b><span>${dt.toLocaleDateString('tr-TR', { month: 'short' })}</span></div>
          <div class="grow"><div class="card-title">${esc(title)}</div>
          <div class="faint small num">${byEx.size ? `${byEx.size} hareket · ${st.sets} set · ` : ''}${fmtInt(st.min)} dk</div></div>
          <span class="pill fire num">${icon('flame')}${fmtInt(st.kcal)}</span>
        </summary>
        <div class="day-body">${[...byEx.entries()].map(([id, list]) => {
          const ex = getEx(id);
          return `<a class="day-ex" href="#/ex/${encodeURIComponent(id)}"><div style="font-weight:600">${esc(ex?.name || 'Silinmiş hareket')}</div>
            <div class="set-chips">${list.map(s => `<span class="set-chip">${s.warm ? 'Isınma · ' : ''}${esc(fmtSet(ex, s))}</span>`).join('')}</div></a>`;
        }).join('')}${cardioOn(d).map(c => `<div class="day-ex"><div style="font-weight:600">${esc(CARDIO.find(x => x[0] === c.type)?.[1] || 'Kardiyo')}</div>
          <div class="set-chips"><span class="set-chip">${c.min} dk · ${fmtInt(c.kcal)} kcal</span></div></div>`).join('')}
          ${acts.length ? `<div class="day-ex">${acts.map(a => activityRow(a, { del: true })).join('')}</div>` : ''}
          ${ws2.filter(w => w.note).map(w => `<div class="day-ex"><div class="note-line">${icon('edit')}<span>${esc(w.note)}</span></div></div>`).join('')}
          ${ws2.map(w => `<a class="day-ex lnk small" href="#/summary/${w.id}">${esc(w.name)} özetini gör ›</a>`).join('')}</div></details>`;
    }).join('')}`;
  bindActivityDelete(view, () => { const y = scrollY; renderHist(); scrollTo(0, y); });
}

// Tenis istatistikleri (Geçmiş)
function tennisStats() {
  const all = db.activities.filter(a => a.sport === 'tennis' && a.kind !== 'routine');
  if (!all.length) return '';
  const dec = all.filter(a => a.result), wins = dec.filter(a => a.result === 'win').length;
  const hours = all.reduce((s, a) => s + a.min, 0) / 60;
  return `<div class="sec"><h2>Tenis</h2><a href="#/tennis/istatistik">Tüm istatistikler</a></div>
    <div class="stats3">
      <div class="card"><b class="num">${dec.length}</b><span>Maç</span></div>
      <div class="card"><b class="num">${dec.length ? '%' + fmtInt((wins / dec.length) * 100) : '—'}</b><span>Galibiyet</span></div>
      <div class="card"><b class="num">${fmtN(tennisLevel().level, 1)}</b><span>Seviye</span></div>
    </div>
    <div class="faint small" style="margin:8px 2px 0">${fmtN(hours, hours < 10 ? 1 : 0)} saat tenis</div>`;
}

// ═════════════════════════ Profil
const HELP = {
  tlevel: 'Kendi kayıtlarından hesaplanan yaklaşık bir seviye (1–10). Her maçta rakibinin seviyesine (zayıf / benzer / güçlü) ve kazandığın oyun oranına göre bir performans puanı çıkar; son maçlar daha ağır basar. Resmî UTR veya NTRP değildir.',
  bmi: 'Vücut kitle indeksi (VKİ): kilonun boyunun karesine bölümü. 18,5–25 arası sağlıklı kabul edilir. Kaslı kişilerde yüksek çıkabilir; tek başına yağ oranını göstermez.',
  bmr: 'Bazal metabolizma: hiç hareket etmeden, sadece yaşamak için günde harcadığın kalori.',
  tdee: 'Günlük harcama: bazal metabolizma + gün içindeki hareketin ve sporun. Bu kadar yersen kilon sabit kalır.',
  fat: 'VKİ, yaş ve cinsiyetten hesaplanan kaba bir tahmindir (Deurenberg formülü). Kesin sonuç için ölçüm gerekir.',
};
const helpBtn = k => `<span class="help" data-help="${k}">?</span>`;
function bindHelp() {
  $$('[data-help]', view).forEach(h => h.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const { el, close } = openSheet(`<div class="sheet-title">Nedir?</div><p class="muted" style="line-height:1.55">${esc(HELP[h.dataset.help])}</p>
      <div style="margin-top:16px"><button class="btn ghost" id="h-ok">Tamam</button></div>`);
    $('#h-ok', el).addEventListener('click', close);
  }));
}

function renderProfile() {
  setHeader('Profil', { action: `<a class="top-btn" href="#/settings" aria-label="Ayarlar">${icon('gear')}</a>` });
  const p = db.profile, m = metrics(), w = currentWeight();
  const opt = (vals, cur, fmt) => vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${fmt(v)}</option>`).join('');
  const split = SPLITS[splitKey(p.days || 3)];
  const meas = [...db.measures].sort((a, b) => (a.date < b.date ? -1 : 1));
  const lastM = meas.at(-1), firstM = meas[0];

  let html = pageHead(profileReady() ? `${GOALS[p.goal]} · haftada ${p.days} gün` : 'Kişisel bilgiler', 'Profil') + `
    <div class="form">
      <div class="field"><label>Cinsiyet</label><div class="mini-seg" id="p-sex">
        <button data-v="m" class="${p.sex === 'm' ? 'on' : ''}">Erkek</button><button data-v="f" class="${p.sex === 'f' ? 'on' : ''}">Kadın</button></div></div>
      <div class="field"><label for="p-age">Yaş</label><input id="p-age" inputmode="numeric" placeholder="—" value="${p.age ?? ''}"><span class="unit"></span></div>
      <div class="field"><label for="p-h">Boy</label><input id="p-h" inputmode="numeric" placeholder="—" value="${p.height ?? ''}"><span class="unit">cm</span></div>
      <div class="field"><label for="p-w">Kilo</label><input id="p-w" inputmode="decimal" placeholder="—" value="${w ? fmtN(w) : ''}"><span class="unit">kg</span></div>
      <div class="field"><label for="p-t">Hedef kilo</label><input id="p-t" inputmode="decimal" placeholder="—" value="${p.target ? fmtN(p.target) : ''}"><span class="unit">kg</span></div>
      <div class="field"><label for="p-act">Günlük hareketin</label><select id="p-act">${opt(ACTIVITY.map(a => a[0]), p.activity, v => ACTIVITY.find(a => a[0] === v)[1])}</select></div>
      <div class="field"><label>Hedef</label><div class="mini-seg" id="p-goal">${Object.keys(GOALS).map(k => `<button data-v="${k}" class="${p.goal === k ? 'on' : ''}">${GOAL_SHORT[k]}</button>`).join('')}</div></div>
      <div class="field"><label for="p-days">Haftalık antrenman</label><select id="p-days">${opt([2, 3, 4, 5, 6], p.days, v => `${v} gün`)}</select></div>
    </div>
    <div class="list" style="margin-top:10px">
      ${sport() === 'gym' ? `<a class="link-row" href="#/programs"><div class="ic" style="background:rgba(167,139,250,.14);color:var(--violet)">${icon('list')}</div>
        <div class="grow"><div style="font-weight:600">Antrenman programı</div><div class="faint small">${esc(programName())}${usingRoutines() ? ` · ${db.routines.length} gün` : ''}</div></div>${icon('chev', 'chev')}</a>`
        : `<a class="link-row" href="#/${sport()}"><div class="ic" style="background:rgba(167,139,250,.14);color:var(--violet)">${icon(SPORTS[sport()].icon)}</div>
        <div class="grow"><div style="font-weight:600">${SPORTS[sport()].name}</div><div class="faint small">${esc(LEVEL_NAMES[sport()][levelOf() - 1])} · haftada ${p.days} gün</div></div>${icon('chev', 'chev')}</a>`}
      <a class="link-row" href="#/nutrition"><div class="ic" style="background:var(--fire-soft);color:var(--fire)">${icon('fork')}</div>
        <div class="grow"><div style="font-weight:600">Beslenme planı</div><div class="faint small">${m ? `Günde ${fmtInt(m.goalKcal)} kcal · ${fmtInt(m.protein)} g protein` : 'Profili doldurunca hazırlanır'}</div></div>${icon('chev', 'chev')}</a>
    </div>`;

  if (!m) {
    html += `<div class="card" style="margin-top:10px"><div class="row">${icon('info')}<div class="grow muted small">Cinsiyet, yaş, boy ve kilonu girdiğinde vücut analizin, beslenme planın ve sana özel öneriler hazırlanır.</div></div></div>`;
  } else {
    const bmiPos = clamp(((m.bmi - 15) / (40 - 15)) * 100, 0, 100);
    html += `
      <div class="sec"><h2>Vücut analizi</h2></div>
      <div class="metric-grid">
        <div class="metric wide"><div class="row"><div class="grow"><div class="lbl">Vücut kitle indeksi ${helpBtn('bmi')}</div>
          <b class="num">${fmtN(m.bmi)}</b></div><span class="pill" style="color:${m.bmiCat[1]}">${m.bmiCat[0]}</span></div>
          <div class="bmi-bar"><i style="left:${bmiPos}%"></i></div>
          <div class="bmi-scale"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div>
          <div class="note" style="margin-top:10px">Boyuna göre sağlıklı kilo aralığı: <b>${fmtInt(m.idealMin)}–${fmtInt(m.idealMax)} kg</b></div></div>
        <div class="metric"><div class="lbl">Yağ oranı ${helpBtn('fat')}</div><b class="num">~%${fmtInt(m.bodyFat)}</b><div class="note">Tahmini</div></div>
        <div class="metric"><div class="lbl">Günlük harcama ${helpBtn('tdee')}</div><b class="num">${fmtInt(m.tdee)}<small>kcal</small></b><div class="note">Dinlenirken ${fmtInt(m.bmr)} kcal</div></div>
      </div>
      <div class="sec"><h2>Antrenman önerileri</h2></div>
      <div class="card">${recommendations(m, split).map(r => `<div class="reco"><div class="ic" style="background:${r.bg};color:${r.c}">${icon(r.i)}</div>
        <div class="grow"><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div></div>`).join('')}</div>`;
  }

  if (db.weights.length) {
    html += `<div class="sec"><h2>Kilo takibi</h2><span class="faint small">${db.weights.length} ölçüm</span></div>
      <div class="card">${db.weights.length > 1 ? '<canvas class="chart" id="w-chart"></canvas>' : `<div class="muted small">Kilonu yukarıdan farklı günlerde güncelledikçe burada grafik oluşur. Son ölçüm: <b>${fmtN(w)} kg</b></div>`}</div>`;
  }
  html += `<div class="sec"><h2>Vücut ölçüleri</h2><button id="meas-add">${icon('plus')} Ölçü ekle</button></div>
    ${lastM ? `<div class="meas-grid">${MEASURES.filter(([k]) => lastM[k]).map(([k, n]) => {
      const d = firstM !== lastM && firstM[k] ? lastM[k] - firstM[k] : null;
      return `<div class="metric"><div class="lbl">${n}</div><b class="num">${fmtN(lastM[k])}<small>cm</small></b>
        ${d != null ? `<div class="delta ${(k === 'waist' || k === 'hip') === d <= 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${fmtN(d)} cm</div>` : '<div class="note">ilk ölçüm</div>'}</div>`;
    }).join('')}</div><div class="faint small" style="margin:8px 4px 0">Son ölçüm ${daysAgo(lastM.date)} · ${meas.length} kayıt</div>`
      : `<div class="card muted small">Bel, göğüs, kol gibi ölçülerini ayda bir gir; kilo değişmese bile vücudunun nasıl değiştiğini görürsün.</div>`}`;
  view.innerHTML = html;

  const rerender = () => { const y = scrollY; renderProfile(); scrollTo(0, y); };
  const bindNum = (sel, fn) => $(sel).addEventListener('change', e => { fn(num(e.target.value)); save(); rerender(); });
  $$('#p-sex button').forEach(b => b.addEventListener('click', () => { p.sex = b.dataset.v; save(); rerender(); }));
  $$('#p-goal button').forEach(b => b.addEventListener('click', () => { p.goal = b.dataset.v; save(); rerender(); }));
  bindNum('#p-age', v => (p.age = v ? clamp(Math.round(v), 12, 100) : null));
  bindNum('#p-h', v => (p.height = v ? clamp(Math.round(v), 120, 230) : null));
  bindNum('#p-t', v => (p.target = v ? clamp(v, 30, 250) : null));
  bindNum('#p-w', v => setWeight(v));
  $('#p-act').addEventListener('change', e => { p.activity = +e.target.value; save(); rerender(); });
  $('#p-days').addEventListener('change', e => { p.days = +e.target.value; save(); rerender(); });
  $('#meas-add').addEventListener('click', () => measureSheet(lastM, rerender));
  const wc = $('#w-chart');
  if (wc) drawChart(wc, [...db.weights].sort((a, b) => (a.date < b.date ? -1 : 1)).map(x => ({ d: x.date, v: x.kg })), 'kg',
    getComputedStyle(document.documentElement).getPropertyValue('--blue').trim());
  bindHelp();
}
function setWeight(v) {
  if (!v) return;
  const kg = clamp(v, 30, 300), today = dayKey();
  const e = db.weights.find(x => x.date === today);
  if (e) e.kg = kg; else db.weights.push({ date: today, kg });
}

function measureSheet(last, after) {
  const { el, close } = openSheet(`
    <div class="sheet-title">Vücut ölçüleri · cm</div>
    ${[0, 2, 4].map(i => `<div class="in-row">${MEASURES.slice(i, i + 2).map(([k, n]) => `<div class="in-box"><label>${n}</label>
      <input data-k="${k}" inputmode="decimal" placeholder="${last?.[k] ? fmtN(last[k]) : '—'}"></div>`).join('')}</div>`).join('')}
    <div class="faint small" style="margin-top:10px">Mezurayla, sabah aç karnına ve hep aynı noktadan ölç. Boş bıraktıkların kaydedilmez.</div>
    <div class="sheet-actions"><button class="btn ghost" id="ms-cancel">Vazgeç</button><button class="btn" id="ms-save">Kaydet</button></div>`);
  $('#ms-cancel', el).addEventListener('click', close);
  $('#ms-save', el).addEventListener('click', () => {
    const today = dayKey();
    const entry = db.measures.find(x => x.date === today) || { date: today };
    let any = false;
    $$('input[data-k]', el).forEach(i => { const v = num(i.value); if (v > 0) { entry[i.dataset.k] = v; any = true; } });
    if (!any) return toast('En az bir ölçü gir', 'info');
    if (!db.measures.includes(entry)) db.measures.push(entry);
    save(); close(); toast('Ölçüler kaydedildi', 'ruler'); after();
  });
}

function recommendations(m, split) {
  const p = db.profile, g = p.goal, out = [];
  for (const h of m.health.filter(x => x.train)) out.push({ i: 'shield', c: 'var(--warn)', bg: 'rgba(251,191,36,.14)', t: h.name, d: h.train });
  if (sport() === 'tennis') out.push({ i: 'tennis', c: 'var(--violet)', bg: 'rgba(167,139,250,.14)', t: `Haftada ${p.days} gün tenis + 1–2 kondisyon`,
    d: 'Maçtan önce 9 dakikalık dinamik ısınma, sonra esneme yap. Haftada 1–2 kez kondisyon programı (çeviklik, omuz koruma, core) kortta hızını artırır ve sakatlık riskini düşürür.' });
  else if (sport() === 'pilates') out.push({ i: 'pilates', c: 'var(--violet)', bg: 'rgba(167,139,250,.14)', t: `Haftada ${p.days} pilates seansı`,
    d: 'Her seansta kaliteye odaklan: yavaş, kontrollü ve nefesle uyumlu. Seviyen ilerledikçe orta ve ileri seanslara geç; haftada toplam 120–150 dk idealdir.' });
  else out.push({
    i: 'dumbbell', c: 'var(--violet)', bg: 'rgba(167,139,250,.14)', t: `${usingRoutines() ? 'Kendi programın' : split.name + ' programı'} · haftada ${p.days} gün`,
    d: g === 'gain' ? 'Ana hareketlerde 4×6–8, yardımcılarda 3×8–12 tekrar. Tüm setlerde üst sınıra ulaştığında uygulama ağırlık artırmanı önerir. Setler arası 2–3 dk dinlen.'
      : g === 'lose' ? 'Kas kaybını önlemek için ağır çalışmaya devam et: ana hareketlerde 3×8–10, diğerlerinde 3×12–15. Setler arası 60–90 sn dinlen.'
        : 'Hareket başına 3×8–12 tekrar; son 1–2 tekrar zorlayıcı olsun. Setler arası 90 sn dinlen.',
  });
  if (g === 'lose' || m.bmi >= 25) {
    out.push({ i: 'pulse', c: 'var(--blue)', bg: 'var(--blue-soft)', t: 'Haftada 150–300 dk kardiyo',
      d: m.bmi >= 30 ? 'Eklemlerini korumak için tempolu yürüyüş, bisiklet veya eliptik gibi düşük darbeli kardiyo seç. Bugün ekranından kaydedebilirsin.'
        : 'Tempolu yürüyüş, bisiklet veya yüzme. Antrenman sonrası 15–20 dk kardiyo yağ yakımını destekler. Günde 8–10 bin adım hedefle.' });
  } else if (m.bmi < 18.5) {
    out.push({ i: 'heart', c: 'var(--blue)', bg: 'var(--blue-soft)', t: 'Kardiyoyu sınırlı tut',
      d: 'VKİ\'n düşük; enerjini kas gelişimine ayırmak için kardiyoyu haftada 1–2 hafif seansla sınırla ve kalori fazlasıyla beslen.' });
  }
  if (m.weeks) out.push({ i: 'target', c: 'var(--good)', bg: 'rgba(52,211,153,.14)', t: `Hedefine ~${m.weeks} haftada ulaşabilirsin`,
    d: `${fmtN(m.w)} kg → ${fmtN(p.target)} kg. Güvenli hızda ilerlemek verilen kilonun geri gelmesini önler. Haftada 1–2 kez aynı saatte tartılıp kilonu güncelle.` });
  const done = new Set(db.sets.filter(s => s.date >= dayKey(weekStart())).map(s => s.date)).size;
  out.push({ i: 'calendar', c: 'var(--warn)', bg: 'rgba(251,191,36,.14)', t: done >= p.days ? 'Bu haftanın hedefi tamam!' : `Bu hafta ${p.days - done} antrenman kaldı`,
    d: done >= p.days ? 'Harika gidiyorsun. Ekstra gün yapacaksan hafif kardiyo veya esneme tercih et.'
      : `Hafta hedefin ${p.days} gün, şu ana kadar ${done} gün antrenman yaptın.` });
  out.push({ i: 'moon', c: 'var(--text-2)', bg: 'var(--surface-2)', t: 'Her gece 7–9 saat uyu',
    d: 'Kas gelişimi ve iştah kontrolü uykuda düzenlenir. Az uyku güç ve yağ yakımını belirgin şekilde düşürür.' });
  return out;
}

// ═════════════════════════ Beslenme
const dayOfYear = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
function renderNutrition() {
  setHeader('Beslenme');
  const m = metrics();
  if (!m) {
    view.innerHTML = pageHead('Kişisel beslenme planı', 'Beslenme') + `<div class="card empty"><div class="ic">${icon('fork')}</div>
      <b>Önce profilini doldur</b>Boy, kilo, yaş ve hedefine göre günlük kalori ihtiyacını ve örnek menünü hazırlayalım.
      <a class="btn" href="#/profile" style="margin-top:16px">Profile git</a></div>`;
    return;
  }
  const today = dayKey();
  const st = dayStats(today);
  const f = db.food[today] || { kcal: 0, protein: 0, water: 0 };
  const md = db.menu[today] || { picks: {}, eaten: {} };
  const prefs = foodPrefs();
  const menu = buildDayMenu(m.goalKcal, m.protein, md.picks, dayOfYear(), prefs);
  const prefText = [DIETS.find(d => d[0] === prefs.diet)?.[1], m.health.length ? m.health.map(h => h.name.split(' /')[0]).join(', ') : '', prefs.avoid.length ? `${prefs.avoid.length} yiyecek çıkarıldı` : ''].filter(Boolean).join(' · ');
  const noMenu = m.health.find(h => h.noMenu);
  const noLoss = db.profile.goal === 'lose' && m.health.some(h => h.noDeficit);
  const lowCarb = m.health.some(h => h.lowCarb);
  const kcalT = m.goalKcal + st.kcal, waterT = (m.water + (setsOn(today).length ? 0.5 : 0)) * 1000;
  const kP = m.protein * 4, kF = m.fat * 9, kC = m.carbs * 4, tot = kP + kF + kC;
  const bar = (v, t, c) => `<div class="bar" style="margin-top:6px"><i style="width:${clamp((v / t) * 100, 0, 100)}%;background:${c}"></i></div>`;
  const mealIcon = { breakfast: 'bulb', lunch: 'fork', snack: 'bolt', dinner: 'moon' };

  view.innerHTML = pageHead(fmtDay(today), 'Beslenme', noLoss ? `Hamilelikte kalori açığı uygulanmaz · günde <b>${fmtInt(m.goalKcal)} kcal</b>` : `${GOALS[db.profile.goal]} hedefin için günde <b>${fmtInt(m.goalKcal)} kcal</b>`) + `
    <div class="card">
      <div class="card-label">Bugün yediğin</div>
      <div class="kcal-big" style="margin-top:4px"><b>${fmtInt(f.kcal)}</b><span>/ ${fmtInt(kcalT)} kcal</span></div>
      ${bar(f.kcal, kcalT, 'var(--fire)')}
      ${st.kcal > 5 ? `<div class="faint small" style="margin-top:8px">Bugün sporla yaktığın ~${fmtInt(st.kcal)} kcal hedefine eklendi.</div>` : ''}
      <div class="targets macro4" style="margin-top:14px">
        <div><div class="card-label">Protein</div><b class="num">${fmtInt(f.protein)}<small>/${fmtInt(m.protein)} g</small></b>${bar(f.protein, m.protein, 'var(--accent)')}</div>
        <div><div class="card-label">Karb.</div><b class="num">${fmtInt(f.c || 0)}<small>/${fmtInt(m.carbs)} g</small></b>${bar(f.c || 0, m.carbs, 'var(--blue)')}</div>
        <div><div class="card-label">Yağ</div><b class="num">${fmtInt(f.f || 0)}<small>/${fmtInt(m.fat)} g</small></b>${bar(f.f || 0, m.fat, 'var(--fire)')}</div>
        <div><div class="card-label">Su</div><b class="num">${fmtN(f.water / 1000)}<small>/${fmtN(waterT / 1000)} L</small></b>${bar(f.water, waterT, 'var(--violet)')}</div>
      </div>
      <button class="btn" id="q-food" style="margin-top:14px">${icon('plus')} Yiyecek ekle</button>
      <div class="quick"><button id="q-scan">${icon('barcode')} Barkod</button><button id="q-meal">${icon('edit')} Hızlı ekle</button><button id="q-water">${icon('drop')} +250 ml</button></div>
    </div>
    ${foodLogHTML(today)}

    ${m.health.length ? healthCard(m.health) : ''}
    <div class="sec"><h2>Bugünün menüsü</h2>${noMenu ? '' : '<button id="menu-shuffle">Yenile</button>'}</div>
    <div class="list" style="margin-bottom:12px"><button class="link-row" id="menu-prefs" style="width:100%;text-align:left">
      <div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('user')}</div>
      <div class="grow"><div style="font-weight:600">Beslenme tercihlerin ve sağlık durumun</div><div class="faint small">${esc(prefText)}</div></div>${icon('chev', 'chev')}</button></div>
    ${noMenu ? `<div class="card health-warn"><b>${icon('shield')} Örnek menü gösterilmiyor</b><p>${esc(noMenu.name)} için beslenme planı hastalığın evresine göre kişiye özel hazırlanmalı. Günlük hedeflerin ve genel öneriler aşağıda; menünü doktorun veya diyetisyeninle planla.</p></div>` : ''}
    ${(noMenu ? [] : menu.meals).map(ml => {
      const eaten = !!md.eaten[ml.id];
      const nBase = ml.base;
      const swapNote = ml.swaps.length ? `<div class="faint small" style="margin-top:4px">Tercihine göre uyarlandı: ${esc(ml.swaps.map(([a, b]) => (b ? `${a} yerine ${b}` : `${a} çıkarıldı`)).join(', '))}</div>` : '';
      return `<div class="meal ${eaten ? 'eaten' : ''}" data-id="${ml.id}">
        <div class="meal-head"><div class="ic">${icon(eaten ? 'check' : mealIcon[ml.id])}</div>
          <div class="grow"><div class="t">${ml.name} · ${ml.time}</div><h3>${esc(ml.optName)}</h3>${swapNote}</div>
          <div class="k"><b>${fmtInt(ml.kcal)}</b><span>kcal · ${fmtInt(ml.p)} g prot.${lowCarb ? `<br>${fmtInt(ml.c)} g karb.` : ''}</span></div></div>
        <ul>${ml.rows.map((r, i) => `<li class="${i >= nBase ? 'boost' : ''}">${esc(r.text)}${i >= nBase ? ' <span class="faint small">(protein hedefi için)</span>' : ''}</li>`).join('')}</ul>
        <div class="meal-actions"><button data-swap="${ml.id}" ${ml.n < 2 ? 'disabled' : ''}>${icon('trend')} Değiştir</button>
          <button class="eat" data-eat="${ml.id}">${icon('check')} ${eaten ? 'Yedim' : 'Bunu yedim'}</button></div>
      </div>`;
    }).join('')}
    ${noMenu ? '' : `<div class="menu-total"><span>Menü toplamı</span><span><b class="num">${fmtInt(menu.total.kcal)} kcal</b> · ${fmtInt(menu.total.p)} g protein${lowCarb ? ` · ${fmtInt(menu.total.c)} g karb.` : ''}</span></div>`}

    <div class="sec"><h2>Günlük hedeflerin</h2></div>
    <div class="metric-grid">
      <div class="metric"><div class="lbl">Günlük harcama ${helpBtn('tdee')}</div><b class="num">${fmtInt(m.tdee)}<small>kcal</small></b><div class="note">Kilonu korumak için</div></div>
      <div class="metric" style="border-color:rgba(212,245,60,.28)"><div class="lbl">Alman gereken</div><b class="num" style="color:var(--accent)">${fmtInt(m.goalKcal)}<small>kcal</small></b>
        <div class="note">${noLoss ? 'Kilonu korursun' : db.profile.goal === 'lose' ? '~0,5 kg/hafta yağ kaybı' : db.profile.goal === 'gain' ? '~0,25 kg/hafta kontrollü artış' : 'Kilonu korursun'}</div></div>
      <div class="metric wide"><div class="lbl">Protein / yağ / karbonhidrat</div>
        <div class="macro-bar" style="margin-top:12px"><i style="width:${(kP / tot) * 100}%;background:var(--accent)"></i><i style="width:${(kF / tot) * 100}%;background:var(--fire)"></i><i style="width:${(kC / tot) * 100}%;background:var(--blue)"></i></div>
        <div class="legend">
          <div><i style="background:var(--accent)"></i>Protein<b class="num">${fmtInt(m.protein)} g</b></div>
          <div><i style="background:var(--fire)"></i>Yağ<b class="num">${fmtInt(m.fat)} g</b></div>
          <div><i style="background:var(--blue)"></i>Karbonhidrat<b class="num">${fmtInt(m.carbs)} g</b></div>
        </div></div>
    </div>

    <div class="sec"><h2>İpuçları</h2></div>
    <div class="card">${nutritionTips(m).map(r => `<div class="reco"><div class="ic" style="background:${r.bg};color:${r.c}">${icon(r.i)}</div>
      <div class="grow"><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div></div>`).join('')}</div>
    <div class="disclaimer">Menü, hedeflerine göre otomatik oluşturulan bir örnektir; değerler yaklaşıktır ve diyetisyen planı yerine geçmez. ${m.health.length ? 'Sağlık durumuna göre yapılan uyarlamalar genel önerilerdir; doktorunun ve diyetisyeninin önerileri her zaman önceliklidir.' : 'Alerjin, sağlık sorunun veya özel diyetin varsa bir uzmana danış.'}</div>`;

  const rerender = () => { const y = scrollY; renderNutrition(); scrollTo(0, y); };
  const store = () => { db.menu[today] = md; save(); };
  $('#q-meal').addEventListener('click', () => mealSheet(rerender));
  $('#q-food').addEventListener('click', () => foodSheet(rerender));
  $('#q-scan').addEventListener('click', () => scanBarcode(prod => foodSheet(rerender, { food: offFood(prod) })));
  $$('[data-unlog]', view).forEach(b => b.addEventListener('click', () => { unlogFood(b.dataset.unlog); save(); rerender(); }));
  $('#q-water').addEventListener('click', () => { addFood(0, 0, 250); toast('+250 ml su', 'drop'); rerender(); });
  $$('[data-eat]', view).forEach(b => b.addEventListener('click', () => {
    const ml = menu.meals.find(x => x.id === b.dataset.eat);
    if (md.eaten[ml.id]) {
      const e = (db.foodLog[today] || []).find(x => x.menu === ml.id);
      if (e) unlogFood(e.id); else addFood(-md.eaten[ml.id].kcal, -md.eaten[ml.id].p, 0);
      delete md.eaten[ml.id];
    } else {
      logFood({ name: `${ml.name}: ${ml.optName}`, portion: 'menüden', menu: ml.id, slot: ml.id, kcal: ml.kcal, p: ml.p, c: ml.c, f: ml.f });
      md.eaten[ml.id] = { kcal: ml.kcal, p: ml.p }; toast(`${ml.name} eklendi`, 'fork');
    }
    store(); rerender();
  }));
  $$('[data-swap]', view).forEach(b => b.addEventListener('click', () => {
    const ml = menu.meals.find(x => x.id === b.dataset.swap);
    if (md.eaten[ml.id]) {
      const e = (db.foodLog[today] || []).find(x => x.menu === ml.id);
      if (e) unlogFood(e.id); else addFood(-md.eaten[ml.id].kcal, -md.eaten[ml.id].p, 0);
      delete md.eaten[ml.id];
    }
    md.picks[ml.id] = (ml.optIndex + 1) % ml.n;
    store(); rerender();
  }));
  $('#menu-shuffle')?.addEventListener('click', () => {
    for (const ml of menu.meals) {
      if (md.eaten[ml.id]) continue;
      const n = ml.n;
      if (n > 1) md.picks[ml.id] = (ml.optIndex + 1 + Math.floor(Math.random() * (n - 1))) % n;
    }
    store(); rerender(); toast('Yeni menü hazır', 'trend');
  });
  $('#menu-prefs').addEventListener('click', () => prefsSheet(() => {
    for (const id of Object.keys(md.picks)) if (!md.eaten[id]) delete md.picks[id];
    store(); rerender();
  }));
  bindHelp();
}

const foodPrefs = () => ({ diet: db.profile.diet || 'omni', avoid: db.profile.avoid || [], health: db.profile.health || [] });
function prefsSheet(after) {
  const cur = foodPrefs();
  let diet = cur.diet;
  const avoid = new Set(cur.avoid), health = new Set(cur.health);
  const names = Object.entries(FOODS).filter(([k]) => k !== 'oil').sort((a, b) => a[1].n.localeCompare(b[1].n, 'tr'));
  const { el, close } = openSheet(`
    <div class="sheet-title">Beslenme tercihlerin</div>
    <div class="card-label" style="margin:0 4px 4px">Sağlık durumun</div>
    <div class="faint small" style="margin:0 4px 10px">Varsa seç; menü, kalori ve protein hedefi buna göre uyarlanır.</div>
    <div id="pf-health" style="display:flex;flex-wrap:wrap;gap:8px">${HEALTH.map(h => `<button class="chip ${health.has(h.id) ? 'on' : ''}" data-k="${h.id}">${esc(h.name)}</button>`).join('')}</div>
    <div class="card-label" style="margin:18px 4px 8px">Beslenme şekli</div>
    <div class="opt-grid" id="pf-diet" style="grid-template-columns:1fr">${DIETS.map(([k, n]) => `<button class="opt ${k === diet ? 'on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="card-label" style="margin:18px 4px 4px">Yemediğin yiyecekler</div>
    <div class="faint small" style="margin:0 4px 10px">Seçtiklerin menüden çıkarılır, yerine benzer bir yiyecek konur.</div>
    <div id="pf-avoid" style="display:flex;flex-wrap:wrap;gap:8px">${names.map(([k, f]) => `<button class="chip ${avoid.has(k) ? 'on' : ''}" data-k="${k}">${esc(f.n)}</button>`).join('')}</div>
    <div class="sheet-actions sticky"><button class="btn ghost" id="pf-cancel">Vazgeç</button><button class="btn" id="pf-save">Kaydet</button></div>`);
  $$('#pf-diet .opt', el).forEach(b => b.addEventListener('click', () => {
    diet = b.dataset.k;
    $$('#pf-diet .opt', el).forEach(x => x.classList.toggle('on', x === b));
  }));
  $$('#pf-health .chip', el).forEach(b => b.addEventListener('click', () => {
    health.has(b.dataset.k) ? health.delete(b.dataset.k) : health.add(b.dataset.k);
    b.classList.toggle('on', health.has(b.dataset.k));
  }));
  $$('#pf-avoid .chip', el).forEach(b => b.addEventListener('click', () => {
    avoid.has(b.dataset.k) ? avoid.delete(b.dataset.k) : avoid.add(b.dataset.k);
    b.classList.toggle('on', avoid.has(b.dataset.k));
  }));
  $('#pf-cancel', el).addEventListener('click', close);
  $('#pf-save', el).addEventListener('click', () => {
    db.profile.diet = diet; db.profile.avoid = [...avoid]; db.profile.health = [...health];
    save(); close(); toast('Menü tercihine göre güncellendi', 'check'); after();
  });
}

function healthCard(list) {
  return `<div class="sec"><h2>Sağlık durumuna göre</h2></div>
    <div class="card health">${list.map(h => `<details ${list.length === 1 ? 'open' : ''}><summary>${icon(h.warn ? 'shield' : 'heart')}<b>${esc(h.name)}</b>${icon('down', 'chev')}</summary>
      <ul>${h.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      ${h.train ? `<div class="health-train">${icon('dumbbell')}<span><b>Antrenmanda:</b> ${esc(h.train)}</span></div>` : ''}</details>`).join('')}</div>`;
}

function nutritionTips(m) {
  const g = db.profile.goal, out = [];
  out.push({ i: 'bolt', c: 'var(--accent)', bg: 'var(--accent-soft)', t: `Her öğünde ~${fmtInt(m.protein / 4)} g protein`,
    d: `Proteini güne yaymak kas onarımını en verimli hale getirir: ${{ omni: 'yumurta, tavuk, balık, süzme yoğurt, lor, baklagiller', pesco: 'balık, yumurta, süzme yoğurt, lor, baklagiller', veg: 'yumurta, süzme yoğurt, lor, peynir, mercimek, nohut, fasulye, tofu' }[foodPrefs().diet] || 'süzme yoğurt, lor, baklagiller'}.` });
  if (g === 'lose') out.push({ i: 'fork', c: 'var(--fire)', bg: 'var(--fire-soft)', t: 'Tabağının yarısı sebze olsun',
    d: 'Sebze hacim sağlar, az kalorilidir ve tok tutar. Şekerli içecekleri ve atıştırmalıkları bırakmak en kolay 200–300 kcal tasarrufudur.' });
  else if (g === 'gain') out.push({ i: 'fork', c: 'var(--fire)', bg: 'var(--fire-soft)', t: 'Öğün atlama',
    d: 'Kalori fazlası için 4–5 öğün ye. Zorlanıyorsan süt, yulaf, fıstık ezmesi, ceviz gibi kalorisi yüksek sağlıklı ekler kullan.' });
  else out.push({ i: 'fork', c: 'var(--fire)', bg: 'var(--fire-soft)', t: 'Dengeli tabak',
    d: 'Her öğünde bir avuç protein, bir avuç kompleks karbonhidrat (bulgur, yulaf, tam buğday) ve bol sebze.' });
  out.push({ i: 'dumbbell', c: 'var(--violet)', bg: 'rgba(167,139,250,.14)', t: 'Antrenman öncesi ve sonrası',
    d: 'Antrenmandan 1–2 saat önce karbonhidrat + protein (ör. yulaf kasesi ya da muz ve yoğurt), sonrasında 2 saat içinde protein ağırlıklı bir öğün ye.' });
  out.push({ i: 'drop', c: 'var(--blue)', bg: 'var(--blue-soft)', t: `Günde ${fmtN(m.water)} L su`,
    d: 'Antrenman günlerinde +0,5 L. Susamayı beklemeden gün boyu küçük yudumlarla iç; idrar rengi açık sarı olmalı.' });
  return out;
}

// ═════════════════════════ Kaynaklar ve lisanslar
function renderCredits() {
  setHeader('Kaynaklar', { back: true, always: true });
  const L = (href, t) => `<a class="lnk" href="${href}" target="_blank" rel="noopener">${t}</a>`;
  const row = (t, d) => `<div class="credit-row"><b>${t}</b><p>${d}</p></div>`;
  view.innerHTML = pageHead('Lisanslar ve teşekkür', 'Kaynaklar') + `
    <div class="card">
      ${row('Egzersiz videoları', `${videoCount()} video, ${EXERCISES.filter(e => e.videos).length} hareket. Yazar: Goulart, ${L('https://wger.de', 'wger.de')}. Lisans: ${L('https://creativecommons.org/licenses/by-sa/4.0/deed.tr', 'CC BY-SA 4.0')}. Değişiklikler: 12 saniyeye kısaltıldı, 540p H.264'e dönüştürüldü, kapak görseli eklendi. Değiştirilmiş videolar da aynı lisansla paylaşılır.`)}
      ${row('Egzersiz ve esneme fotoğrafları', `${L('https://github.com/yuhonas/free-exercise-db', 'free-exercise-db')} (yuhonas). Lisans: ${L('https://unlicense.org', 'Unlicense')} (kamu malı). 720 piksele küçültüldü.`)}
      ${row('Hareket çizimleri ve vücut haritası', 'Bu uygulama için çizildi (tenis vuruşları, pilates hareketleri, reformer, ön/arka vücut haritası).')}
      ${row('3D insan modeli', `${L('https://quaternius.com', 'Quaternius')} · Universal Base Characters. Lisans: ${L('https://creativecommons.org/publicdomain/zero/1.0/', 'CC0')} (kamu malı). Hareket pozları ve kas vurguları bu uygulama için hazırlandı.`)}
      ${row('3D görüntüleme', `${L('https://threejs.org', 'three.js')} (MIT).`)}
      ${row('Besin değerleri', `${FOOD_DB.length} kayıttan ${FOOD_DB.filter(f => f.src.startsWith('u:')).length} tanesi doğrudan ${L('https://fdc.nal.usda.gov', 'USDA FoodData Central')} (SR Legacy, kamu malı) verisidir. ${FOOD_DB.filter(f => f.src === 'r').length} Türk yemeği, USDA malzeme değerleri ve standart ev tarifleriyle hesaplanmıştır (pişirmedeki ağırlık değişimi dahil). ${FOOD_DB.filter(f => f.src === 'm').length} ürün tipik değerdir. Değerler yaklaşıktır ve diyetisyen planı yerine geçmez.`)}
      ${row('Barkodlu ürünler', `Ürün bilgileri ${L('https://world.openfoodfacts.org', 'Open Food Facts')} katkıcılarından gelir. Veritabanı lisansı: ${L('https://opendatacommons.org/licenses/odbl/1-0/', 'ODbL')}.`)}
      ${row('Barkod okuyucu', `${L('https://github.com/Sec-ant/barcode-detector', 'barcode-detector')} ve zxing-wasm (MIT), ZXing-C++ (Apache 2.0).`)}
      ${row('Hesaplamalar', 'Bazal metabolizma: Mifflin-St Jeor. Yakılan kalori: MET değerleri (Compendium of Physical Activities). Tahmini maksimum: Epley formülü. Yağ oranı: Deurenberg tahmini.')}
    </div>
    <div class="faint small" style="text-align:center;margin-top:14px;line-height:1.5">Bu uygulama ücretsizdir ve kişisel kullanım içindir.<br>Tüm verilerin yalnızca senin telefonunda saklanır.</div>`;
}

// ═════════════════════════ Ayarlar
function renderSettings() {
  setHeader('Ayarlar', { back: true, always: true });
  const opt = (vals, cur, fmt) => vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${fmt(v)}</option>`).join('');
  view.innerHTML = pageHead('Uygulama', 'Ayarlar') + `
    <div class="sec" style="margin-top:6px"><h2>Spor</h2></div>
    <div class="sport-pick">${Object.entries(SPORTS).map(([k, sp]) => `<button data-sport="${k}" class="${sport() === k ? 'on' : ''}">${icon(sp.icon)}<b>${sp.name}</b></button>`).join('')}</div>
    ${sport() !== 'gym' ? `<div class="form" style="margin-top:10px"><div class="setting"><span>Seviyen</span><select id="s-level">${LEVEL_NAMES[sport()].map((n, i) => `<option value="${i + 1}" ${levelOf() === i + 1 ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      ${sport() === 'pilates' ? `<div class="setting"><span>Nerede</span><select id="s-place">${[['mat', 'Evde / mat'], ['reformer', 'Stüdyo / reformer'], ['both', 'İkisi de']].map(([k, n]) => `<option value="${k}" ${(db.profile.place || 'mat') === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>` : ''}</div>` : ''}
    <div class="sec"><h2>Antrenman</h2></div>
    <div class="form">
      <div class="setting"><span>Setler arası dinlenme</span><select id="s-rest">${opt([0, 45, 60, 90, 120, 150, 180, 240], db.settings.rest, v => (v ? `${Math.floor(v / 60)}:${pad2(v % 60)}` : 'Kapalı'))}</select></div>
      <div class="setting"><span>Antrenmanda ekran açık kalsın</span>${switchHTML('s-awake', db.settings.awake)}</div>
      <div class="setting"><span>Sesli rehber (Türkçe)</span>${switchHTML('s-voice', voiceOn())}</div>
      <div class="setting"><span>Kilit ekranında dinlenme sayacı<small class="set-note">Ses çalarak sayar, müziği durdurur</small></span>${switchHTML('s-lock', db.settings.lockTimer)}</div>
      <div class="setting"><span>Ağırlık artırma adımı</span><select id="s-step">${opt([0.5, 1, 1.25, 2, 2.5, 5], db.settings.step, v => fmtN(v, 2) + ' kg')}</select></div>
    </div>
    <div class="sec"><h2>İnternetsiz kullanım</h2></div>
    <div id="offline-slot"></div>
    <div class="sec"><h2>Yedekleme</h2></div>
    <div class="card">
      <div class="muted small" style="margin-bottom:12px">Veriler yalnızca bu telefonda saklanır. Yedeği "Dosyalar'a Kaydet" → iCloud Drive ile sakla. ${db.settings.lastBackup ? `Son yedek: <b>${daysAgo(dayKey(new Date(db.settings.lastBackup)))}</b>.` : 'Henüz yedek alınmadı.'}</div>
      <div class="faint small" id="persist-note" style="margin:-4px 0 12px"></div>
      <button class="btn ghost" id="b-export">${icon('download')} Yedek al (Dosyalar'a kaydet)</button>
      <button class="btn ghost" id="b-import">Yedeği geri yükle</button>
      <input type="file" id="f-import" accept="application/json,.json" hidden>
    </div>
    <div class="sec"><h2>Diğer</h2></div>
    <div class="list">
      <a class="link-row" href="#/welcome/0"><div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('trend')}</div><div class="grow" style="font-weight:600">Kurulumu yeniden yap</div>${icon('chev', 'chev')}</a>
      <a class="link-row" href="#/programs"><div class="ic" style="background:rgba(167,139,250,.14);color:var(--violet)">${icon('list')}</div><div class="grow" style="font-weight:600">Antrenman programı</div>${icon('chev', 'chev')}</a>
    </div>
    <div class="sec"><h2>Kaynaklar</h2></div>
    <div class="card small muted" style="line-height:1.6">
      Videolar wger (CC BY-SA 4.0), fotoğraflar free-exercise-db (kamu malı).
      <a class="link-row" href="#/credits" style="padding:10px 0 0;min-height:0"><div class="grow" style="font-weight:600;color:var(--text)">Tüm kaynaklar ve lisanslar</div>${icon('chev', 'chev')}</a>
    </div>
    <div style="margin-top:22px"><button class="btn danger" id="b-reset">Tüm verileri sil</button></div>
    <div class="faint small" style="text-align:center;margin-top:14px">${db.sets.length} set · ${db.workouts.length} antrenman · ${db.custom.length} özel hareket</div>`;
  $$('.sport-pick button', view).forEach(b => b.addEventListener('click', () => {
    db.settings.sport = b.dataset.sport; save(); renderTabs(); renderSettings();
    toast(`${SPORTS[b.dataset.sport].name} moduna geçildi`, SPORTS[b.dataset.sport].icon);
  }));
  $('#s-level')?.addEventListener('change', e => { db.profile.level = +e.target.value; save(); });
  $('#s-place')?.addEventListener('change', e => { db.profile.place = e.target.value; save(); });
  const sw = (id, key, after) => $(id)?.addEventListener('click', e => { db.settings[key] = !e.currentTarget.classList.contains('on'); save(); e.currentTarget.classList.toggle('on', db.settings[key]); e.currentTarget.setAttribute('aria-checked', db.settings[key]); after?.(db.settings[key]); });
  sw('#s-voice', 'voice', on => { if (on) { unlockSpeech(); if (!pickVoice()) toast('Telefonda Türkçe ses bulunamadı; iPhone Ayarlar > Erişilebilirlik > Seslendirme > Sesler bölümünden indirebilirsin', 'info'); else speak('Sesli rehber açık'); } });
  sw('#s-lock', 'lockTimer', on => { if (on) toast('Dinlenme sırasında ses çalar; ekran kilitliyken de sayar', 'info'); });
  $('#s-awake')?.addEventListener('click', e => { db.settings.awake = !db.settings.awake; save(); e.currentTarget.classList.toggle('on', db.settings.awake); e.currentTarget.setAttribute('aria-checked', db.settings.awake); });
  navigator.storage?.persisted?.().then(p => { const el = $('#persist-note'); if (el) el.textContent = p ? 'Kalıcı depolama açık: iPhone yer açmak için verilerini silmez.' : 'Kalıcı depolama izni verilmedi; düzenli yedek almanı öneririz.'; }).catch(() => {});
  $('#s-rest').addEventListener('change', e => { db.settings.rest = +e.target.value; save(); });
  $('#s-step').addEventListener('change', e => { db.settings.step = +e.target.value; save(); });
  $('#b-export').addEventListener('click', async () => { if (await exportData()) renderSettings(); });
  $('#b-import').addEventListener('click', () => $('#f-import').click());
  $('#f-import').addEventListener('change', e => importData(e.target.files[0]));
  $('#b-reset').addEventListener('click', () => {
    if (!confirm('Tüm set kayıtları, antrenmanlar, ölçümler ve özel hareketler silinecek. Emin misin?')) return;
    if (!confirm('Bu işlem geri alınamaz. Son kez onaylıyor musun?')) return;
    db = normalize({ sets: [], settings: db.settings, profile: db.profile });
    save(); toast('Veriler silindi'); renderSettings();
  });
  offlineCard($('#offline-slot'), false);
}

// ═════════════════════════ İlk kurulum
let ob = null;
const PROGRAM_INFO = {
  full: 'Her antrenmanda tüm vücut çalışır — az günle en verimli yöntem.',
  ul: 'Bir gün üst vücut, bir gün alt vücut — dengeli ve toparlanması kolay.',
  ppl: 'İtme, çekme ve bacak günleri — sık antrenman için ideal.',
};
function renderWelcome(step = '0') {
  step = clamp(+step || 0, 0, 4);
  const p = db.profile;
  ob ||= { sport: sport(), goal: p.goal || 'maintain', days: p.days || 3, level: p.level || 1, place: p.place || 'mat', sex: p.sex, age: p.age, height: p.height, weight: currentWeight(), health: [...(p.health || [])] };
  document.body.classList.add('bare');
  const go = s => (location.hash = '#/welcome/' + s);
  const finish = () => { db.settings.onboarded = true; save(); ob = null; renderTabs(); location.hash = '#/today'; };
  const dots = [0, 1, 2, 3, 4].map(i => `<i class="${i <= step ? 'on' : ''}"></i>`).join('');
  const head = `<div class="ob-top">${step ? `<button class="ob-back" id="ob-back" aria-label="Geri">${icon('back')}</button>` : '<span style="width:36px"></span>'}
    <div class="ob-dots">${dots}</div>${step < 4 && step > 0 ? '<button class="ob-skip" id="ob-skip">Atla</button>' : '<span style="width:36px"></span>'}</div>`;
  const sp = ob.sport;
  let body = '', foot = '';
  if (step === 0) {
    body = `<div class="ob-logo">${icon('bolt')}</div><h1>Hoş geldin!<br>Hangi sporu yapıyorsun?</h1>
      <p class="lead">Uygulama seçtiğin spora göre şekillenir. Daha sonra Ayarlar'dan değiştirebilirsin.</p>
      ${Object.entries(SPORTS).map(([k, s]) => `<button class="choice ${sp === k ? 'on' : ''}" data-sport="${k}"><div class="ic">${icon(s.icon)}</div><div><b>${s.name}</b><span>${s.desc}</span></div></button>`).join('')}`;
    foot = `<button class="btn" id="ob-next">Devam</button>`;
  } else if (step === 1) {
    const goals = [['lose', 'flame', 'Yağ yakmak', 'Kilo ver, sıkılaş'], ['maintain', 'heart', 'Formda kalmak', sp === 'tennis' ? 'Kondisyonunu ve oyununu koru' : 'Sağlıklı ve güçlü kal'],
      ['gain', 'dumbbell', sp === 'gym' ? 'Kas kazanmak' : sp === 'tennis' ? 'Güç ve performans' : 'Güçlenmek ve şekillenmek', sp === 'gym' ? 'Güçlen, kas kütleni artır' : 'Daha güçlü, daha dayanıklı']];
    body = `<div class="ob-logo">${icon(SPORTS[sp].icon)}</div><h1>Hedefin ne?</h1>
      <p class="lead">Programını ve beslenme planını buna göre hazırlayacağız.</p>
      ${goals.map(([k, ic, t, d]) => `<button class="choice ${ob.goal === k ? 'on' : ''}" data-goal="${k}"><div class="ic">${icon(ic)}</div><div><b>${t}</b><span>${d}</span></div></button>`).join('')}`;
    foot = `<button class="btn" id="ob-next">Devam</button>`;
  } else if (step === 2) {
    const dayPick = `<div class="day-pick" style="grid-template-columns:repeat(${sp === 'gym' ? 5 : 6},1fr)">${[1, 2, 3, 4, 5, 6].filter(d => sp !== 'gym' || d >= 2).map(d => `<button class="${ob.days === d ? 'on' : ''}" data-days="${d}">${d}</button>`).join('')}</div>`;
    if (sp === 'gym') {
      const k = splitKey(ob.days);
      body = `<h1>Haftada kaç gün spor yapabilirsin?</h1><p class="lead">Gerçekçi ol; düzenli 3 gün, ara sıra 5 günden iyidir.</p>${dayPick}
        <div class="ob-note"><b>${SPLITS[k].name} programı</b><br>${PROGRAM_INFO[k]}</div>`;
    } else {
      body = `<h1>${sp === 'tennis' ? 'Tenis seviyen' : 'Pilates seviyen'}</h1><p class="lead">${sp === 'tennis' ? 'Teknik içerikler ve öneriler seviyene göre şekillenir.' : 'Sana uygun seansları önerelim.'}</p>
        ${LEVEL_NAMES[sp].map((n, i) => `<button class="choice compact ${ob.level === i + 1 ? 'on' : ''}" data-level="${i + 1}"><div><b>${n}</b></div></button>`).join('')}
        ${sp === 'pilates' ? `<div class="card-label" style="margin:18px 2px 8px">Nerede yapıyorsun?</div>
          <div class="mini-seg" id="ob-place">${[['mat', 'Evde / mat'], ['reformer', 'Stüdyo / reformer'], ['both', 'İkisi de']].map(([k, n]) => `<button data-v="${k}" class="${ob.place === k ? 'on' : ''}">${n}</button>`).join('')}</div>` : ''}
        <div class="card-label" style="margin:18px 2px 8px">Haftada kaç gün ${sp === 'tennis' ? 'oynuyorsun' : 'yapabilirsin'}?</div>${dayPick}`;
    }
    foot = `<button class="btn" id="ob-next">Devam</button>`;
  } else if (step === 3) {
    body = `<h1>Seni biraz tanıyalım</h1><p class="lead">Kalori ihtiyacını ve kişisel önerilerini hesaplamak için.</p>
      <div class="mini-seg" id="ob-sex"><button data-v="m" class="${ob.sex === 'm' ? 'on' : ''}">Erkek</button><button data-v="f" class="${ob.sex === 'f' ? 'on' : ''}">Kadın</button></div>
      <div class="in-row" style="margin-top:12px"><div class="in-box"><label>Yaş</label><input id="ob-age" inputmode="numeric" placeholder="—" value="${ob.age ?? ''}"></div>
        <div class="in-box"><label>Boy · cm</label><input id="ob-h" inputmode="numeric" placeholder="—" value="${ob.height ?? ''}"></div></div>
      <div class="in-row"><div class="in-box"><label>Kilo · kg</label><input id="ob-w" inputmode="decimal" placeholder="—" value="${ob.weight ? fmtN(ob.weight) : ''}"></div>
        <div class="in-box" style="opacity:.0"></div></div>
      <div class="card-label" style="margin:18px 2px 8px">Sağlık durumun (varsa)</div>
      <div id="ob-health" style="display:flex;flex-wrap:wrap;gap:8px">${HEALTH.map(h => `<button class="chip ${(ob.health || []).includes(h.id) ? 'on' : ''}" data-k="${h.id}">${esc(h.name)}</button>`).join('')}</div>
      <div class="faint small" style="margin-top:12px">Bilgilerin sadece bu telefonda saklanır.</div>`;
    foot = `<button class="btn" id="ob-next">${sp === 'gym' ? 'Programımı hazırla' : 'Devam'}</button>`;
  } else {
    const m = metrics();
    let plan = '';
    if (sp === 'gym') {
      plan = `<p class="lead">${esc(SPLITS[splitKey(db.profile.days)].name)} · haftada ${db.profile.days} gün · ${GOALS[db.profile.goal]}</p>
        <div class="card ready-list">${autoDays().map(d => `<div class="kv"><span>${esc(d.name)}</span><span class="small">${d.items.map(i => getEx(i.exId)?.name).join(', ')}</span></div>`).join('')}</div>`;
    } else if (sp === 'tennis') {
      plan = `<p class="lead">${esc(LEVEL_NAMES.tennis[levelOf() - 1])} · haftada ${db.profile.days} gün tenis</p>
        <div class="card ready-list">
          <div class="kv"><span>Maç ve antrenman</span><span class="small">Süre, skor ve kortu kaydet; galibiyet oranın ve saatlerin takip edilsin</span></div>
          <div class="kv"><span>Maç öncesi</span><span class="small">9 dakikalık dinamik ısınma rutini</span></div>
          <div class="kv"><span>Haftada 1–2 gün</span><span class="small">Kondisyon: alt vücut & çeviklik, omuz koruma, core & rotasyon</span></div>
          <div class="kv"><span>Teknik</span><span class="small">Forehand, backhand, servis, vole ve daha fazlası adım adım</span></div></div>`;
    } else {
      const rec = recommendedSession();
      plan = `<p class="lead">${esc(LEVEL_NAMES.pilates[levelOf() - 1])} · haftada ${db.profile.days} gün</p>
        <div class="card ready-list">
          <div class="kv"><span>İlk seansın</span><span class="small">${esc(rec.name)} · ~${rec.min} dk · ${rec.items.length} hareket</span></div>
          <div class="kv"><span>Rehberli akış</span><span class="small">Hareketler sırayla, süreli ve sesli uyarıyla ekrana gelir</span></div>
          <div class="kv"><span>Kütüphane</span><span class="small">${PILATES.filter(x => x.kind === 'mat').length} mat ve ${PILATES.filter(x => x.kind === 'reformer').length} reformer hareketi, hareketli çizimlerle</span></div></div>`;
    }
    body = `<div class="ob-logo">${icon('check')}</div><h1>${sp === 'gym' ? 'Programın hazır!' : 'Her şey hazır!'}</h1>${plan}
      ${m ? `<div class="metric-grid" style="margin-top:10px">
        <div class="metric"><div class="lbl">Günlük kalori</div><b class="num" style="color:var(--accent)">${fmtInt(m.goalKcal)}<small>kcal</small></b></div>
        <div class="metric"><div class="lbl">Günlük protein</div><b class="num">${fmtInt(m.protein)}<small>g</small></b></div></div>` : ''}
      ${sp === 'gym' ? '<div id="offline-slot" style="margin-top:10px"></div>' : ''}`;
    foot = `<button class="btn" id="ob-done">Başlayalım</button><div class="faint small" style="text-align:center;margin-top:10px">Sporu, programı ve bilgilerini istediğin zaman Ayarlar ve Profil'den değiştirebilirsin.</div>`;
  }
  view.innerHTML = `<div class="ob fade-in">${head}${body}<div class="ob-foot">${foot}</div></div>`;

  const pick = (sel, fn) => $$(sel, view).forEach(b => b.addEventListener('click', () => { fn(b); $$(sel, view).forEach(x => x.classList.toggle('on', x === b)); }));
  $('#ob-back')?.addEventListener('click', () => go(step - 1));
  $('#ob-skip')?.addEventListener('click', () => { db.settings.sport = ob.sport; finish(); });
  pick('[data-sport]', b => { ob.sport = b.dataset.sport; });
  pick('[data-goal]', b => { ob.goal = b.dataset.goal; });
  pick('[data-level]', b => { ob.level = +b.dataset.level; });
  pick('#ob-place button', b => { ob.place = b.dataset.v; });
  $$('[data-days]', view).forEach(b => b.addEventListener('click', () => { ob.days = +b.dataset.days; renderWelcome(2); }));
  pick('#ob-sex button', b => { ob.sex = b.dataset.v; });
  $$('#ob-health .chip').forEach(b => b.addEventListener('click', () => {
    const set = new Set(ob.health || []);
    set.has(b.dataset.k) ? set.delete(b.dataset.k) : set.add(b.dataset.k);
    ob.health = [...set]; b.classList.toggle('on', set.has(b.dataset.k));
  }));
  $('#ob-next')?.addEventListener('click', () => {
    if (step === 0) { db.settings.sport = ob.sport; if (ob.sport !== 'gym' && ob.days > 4) ob.days = 2; save(); renderTabs(); }
    if (step === 3) {
      ob.age = Math.round(num($('#ob-age').value)); ob.height = Math.round(num($('#ob-h').value)); ob.weight = num($('#ob-w').value);
      if (!ob.sex || !ob.age || !ob.height || !ob.weight) return toast('Tüm alanları doldur', 'info');
      // Spor dışındaki gün sayısı da hareketliliği belirler; tenis ve pilates de aktif günler
      Object.assign(db.profile, {
        sex: ob.sex, age: clamp(ob.age, 12, 100), height: clamp(ob.height, 120, 230),
        activity: ob.days <= 2 ? 1.375 : ob.days <= 4 ? 1.55 : 1.725, health: ob.health || [],
      });
      setWeight(ob.weight);
    }
    if (step <= 3) Object.assign(db.profile, { goal: ob.goal, days: ob.days, level: ob.level, place: ob.place });
    save();
    go(step + 1);
  });
  $('#ob-done')?.addEventListener('click', finish);
  if (step === 4 && sp === 'gym') offlineCard($('#offline-slot'), false);
  return () => document.body.classList.remove('bare');
}

// ═════════════════════════ Çevrimdışı videolar
let dlState = null;
const dlListeners = new Set();
async function downloadAllVideos(onProgress) {
  if (onProgress) dlListeners.add(onProgress);
  if (dlState) return dlState;
  dlState = (async () => {
    const cache = await caches.open(MEDIA_CACHE);
    const all = EXERCISES.flatMap(e => e.videos || []).map(v => v.src);
    let done = 0, failed = 0;
    for (const src of all) {
      if (!(await cache.match(src))) {
        try { const r = await fetch(src); if (r.ok) await cache.put(src, r); else failed++; } catch { failed++; }
      }
      done++;
      dlListeners.forEach(f => f(done, all.length, failed));
    }
    dlState = null;
    dlListeners.clear();
    return failed;
  })();
  return dlState;
}
async function cachedVideoCount() {
  try { return (await (await caches.open(MEDIA_CACHE)).keys()).filter(r => r.url.endsWith('.mp4')).length; } catch { return 0; }
}
async function offlineCard(slot, onlyIfMissing) {
  const total = videoCount();
  const have = await cachedVideoCount();
  if (!slot?.isConnected || (onlyIfMissing && have >= total && !dlState)) return;
  const doneAll = have >= total;
  slot.innerHTML = `<div class="card" ${onlyIfMissing ? 'style="margin-top:22px"' : ''}>
    <div class="cta"><div class="ic">${icon(doneAll ? 'check' : 'download')}</div>
      <div class="grow"><div class="card-title">${doneAll ? 'Videolar telefonda' : 'Videoları telefona indir'}</div>
      <div class="muted small num" id="off-status">${have} / ${total} video · ~${VIDEO_MB} MB</div></div></div>
    <div class="progress"><i style="width:${(have / total) * 100}%"></i></div>
    ${doneAll ? '<div class="faint small" style="margin-top:10px">İnternet olmadan da tüm videolar oynar.</div>'
      : `<button class="btn" id="off-dl" style="margin-top:14px">${dlState ? 'İndiriliyor…' : 'İnternetsiz kullanım için indir'}</button>`}
  </div>`;
  const btn = $('#off-dl', slot);
  const progress = (d, t, f) => {
    if (!slot.isConnected) return;
    $('#off-status', slot).textContent = `${d} / ${t} video${f ? ` · ${f} hata` : ''}`;
    $('.progress i', slot).style.width = `${(d / t) * 100}%`;
  };
  const start = async () => {
    if (btn) { btn.disabled = true; btn.textContent = 'İndiriliyor… uygulamayı açık tut'; }
    const failed = await downloadAllVideos(progress);
    toast(failed ? `${failed} video indirilemedi` : 'Tüm videolar indirildi', failed ? 'info' : 'check');
    offlineCard(slot, onlyIfMissing);
  };
  btn?.addEventListener('click', start);
  if (dlState) start();
}

// ═════════════════════════ Yedekleme
async function exportData() {
  const json = JSON.stringify({ app: 'gymtakip', version: 3, exported: new Date().toISOString(), ...db }, null, 1);
  const name = `gym-yedek-${dayKey()}.json`;
  const file = new File([json], name, { type: 'application/json' });
  const done = () => { db.settings.lastBackup = Date.now(); save(); toast('Yedek hazır', 'shield'); return true; };
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: name }); return done(); }
  } catch (e) { if (e.name === 'AbortError') return false; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return done();
}
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const d = JSON.parse(reader.result);
      if (!Array.isArray(d.sets)) throw new Error('format');
      const valid = d.sets.filter(s => s && s.exId && s.date && Number.isFinite(s.r));
      const acts = Array.isArray(d.activities) ? d.activities.length : 0;
      if (!confirm(`${valid.length} set${acts ? ` ve ${acts} tenis/pilates kaydı` : ''} içeren yedek yüklensin mi?\nMevcut veriler bu yedekle değiştirilecek.`)) return;
      db = normalize({ ...d, sets: valid });
      save(); toast('Yedek yüklendi'); route();
    } catch { toast('Geçersiz yedek dosyası', 'x'); }
  };
  reader.readAsText(file);
}

// ═════════════════════════ Dinlenme sayacı
let restEnd = 0, restTotal = 1, restTimer = null, audioCtx = null;
const restEl = $('#rest');
function unlockAudio() {
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch { /* ses yok */ }
}
function beep() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  for (const [i, f] of [[0, 880], [0.18, 880], [0.36, 1320]]) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = f; o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.0001, t + i);
    g.gain.exponentialRampToValueAtTime(0.3, t + i + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i + 0.15);
    o.start(t + i); o.stop(t + i + 0.16);
  }
  navigator.vibrate?.([200, 100, 200]);
}
function startRest(sec) {
  if (!sec) return;
  restEnd = Date.now() + sec * 1000; restTotal = sec;
  restAudioStart(sec);
  restEl.hidden = false; restEl.classList.remove('done');
  clearInterval(restTimer);
  restTimer = setInterval(tickRest, 250);
  tickRest();
}
function stopRest() { clearInterval(restTimer); restEl.hidden = true; restAudioStop(); }
function tickRest() {
  const leftMs = restEnd - Date.now();
  const left = Math.ceil(leftMs / 1000);
  $('#rest-bar').style.strokeDashoffset = 106.8 * (1 - clamp(leftMs / 1000 / restTotal, 0, 1));
  if (left <= 0) {
    if (!restEl.classList.contains('done')) {
      restEl.classList.add('done');
      if (!restAudio) beep();
      if (!document.hidden) setTimeout(() => speak('Dinlenme bitti. Sıradaki set.'), restAudio ? 900 : 500);
      $('#rest-time').textContent = 'Hazır!';
      setTimeout(stopRest, 4000);
    }
    return;
  }
  $('#rest-time').textContent = `${Math.floor(left / 60)}:${pad2(left % 60)}`;
}
restEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.rest === 'skip') return stopRest();
  restEnd += +b.dataset.rest * 1000;
  if (restEnd < Date.now()) restEnd = Date.now();
  restTotal = Math.max(restTotal, (restEnd - Date.now()) / 1000);
  if (db.settings.lockTimer) restAudioStart((restEnd - Date.now()) / 1000);
  tickRest();
});

// ═════════════════════════ Başlat
if (!location.hash || location.hash === '#/pick') history.replaceState(null, '', '#/today');
if (!db.settings.onboarded) {
  if (profileReady() || db.sets.length) { db.settings.onboarded = true; save(); }
  else history.replaceState(null, '', '#/welcome/0');
}
renderTabs();
route();
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
