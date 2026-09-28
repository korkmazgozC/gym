import { REGIONS, EXERCISES, EX_BY_ID, REGION_BY_ID, VIDEO_MB } from './exercises.js';

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
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${P[n]}</svg>`;

// ═════════════════════════ Veri
const KEY = 'gymtakip.v1';
const DEFAULT_SETTINGS = { rest: 90, step: 2.5, useRoutines: true, lastBackup: 0, backupSnooze: 0 };
const DEFAULT_PROFILE = { sex: null, age: null, height: null, activity: 1.55, goal: 'maintain', days: 3, target: null };
let db = load();

function normalize(d) {
  d = d && Array.isArray(d.sets) ? d : {};
  return {
    sets: d.sets || [], custom: d.custom || [], weights: d.weights || [],
    routines: d.routines || [], workouts: d.workouts || [], session: d.session || null,
    measures: d.measures || [], cardio: d.cardio || [], food: d.food || {},
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
  const goalKcal = p.goal === 'lose' ? Math.max(floor, tdee - 500) : p.goal === 'gain' ? tdee + 300 : tdee;
  const protein = w * (p.goal === 'maintain' ? 1.6 : p.goal === 'gain' ? 1.8 : 2.0);
  const fat = w * 0.9;
  const carbs = Math.max(0, (goalKcal - protein * 4 - fat * 9) / 4);
  const water = w * 0.035;
  const idealMin = 18.5 * h * h, idealMax = 24.9 * h * h;
  const bodyFat = clamp(1.2 * bmi + 0.23 * p.age - 10.8 * (p.sex === 'm' ? 1 : 0) - 5.4, 3, 60); // Deurenberg (kaba)
  let weeks = null;
  if (p.target && Math.abs(p.target - w) > 0.2) weeks = Math.ceil(Math.abs(p.target - w) / (p.target < w ? 0.5 : 0.25));
  return { w, bmi, bmiCat, bmr, tdee, goalKcal, protein, fat, carbs, water, idealMin, idealMax, bodyFat, weeks };
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
function setHeader(title, { back = false, action = '', always = false } = {}) {
  $('#top-title').textContent = title;
  $('#back').hidden = !back;
  $('#top-action').innerHTML = action;
  top.classList.toggle('always', always);
}
$('#back').innerHTML = icon('back');
$('#back').addEventListener('click', () => (history.length > 1 ? history.back() : (location.hash = '#/today')));
addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 30), { passive: true });

const TABS = [['today', 'Bugün', 'home'], ['lib', 'Hareketler', 'dumbbell'], ['hist', 'Geçmiş', 'calendar'], ['profile', 'Profil', 'user']];
$('#tabs').innerHTML = TABS.map(([id, t, ic]) => `<a href="#/${id}" data-tab="${id}">${icon(ic)}<span>${t}</span></a>`).join('');

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
function openSheet(html) {
  const panel = $('.sheet-panel', sheetEl);
  panel.innerHTML = html;
  sheetEl.hidden = false;
  const close = () => { sheetEl.hidden = true; panel.innerHTML = ''; };
  $('.sheet-bg', sheetEl).onclick = close;
  return { el: panel, close };
}
const closeSheet = () => { sheetEl.hidden = true; };
const switchHTML = (id, on) => `<button class="switch ${on ? 'on' : ''}" id="${id}" role="switch" aria-checked="${on}"></button>`;

// ═════════════════════════ Yönlendirme
let cleanup = null;
const routes = {
  today: renderToday, lib: renderLib, pick: renderPick, ex: renderEx, hist: renderHist, profile: renderProfile, new: renderNew,
  workout: renderWorkout, summary: renderSummary, programs: renderPrograms, routine: renderRoutine,
};
const TAB_OF = { ex: 'lib', new: 'lib', pick: 'lib', workout: 'today', summary: 'today', programs: 'profile', routine: 'profile' };
function route() {
  const [name = 'today', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const fn = routes[name] || renderToday;
  if (cleanup) { cleanup(); cleanup = null; }
  closeSheet();
  const tab = TAB_OF[name] || (routes[name] ? name : 'today');
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
  view.innerHTML = pageHead(`Başladı ${new Date(s.start).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`, s.name) + `
    <div class="w-hero">
      <div class="time"><b id="w-time">${fmtDur(Date.now() - s.start)}</b><span>Süre</span></div>
      <div><b>${st.sets}</b><span>Set</span></div>
      <div><b>${fmtInt(st.kcal)}</b><span>kcal</span></div>
    </div>
    <div style="margin-top:14px">${day.items.map((it, i) => `
      <div class="wex ${i === s.cur ? 'open' : ''} ${it.complete ? 'done' : ''}" data-i="${i}">
        <div class="wex-head">${thumb(it.ex)}<div class="grow"><div class="name">${esc(it.ex.name)}</div>
          <div class="meta">${schemeText(it, it.ex)} · ${it.done}/${it.sets} set</div>
          <div class="dots">${[...Array(Math.max(it.sets, it.done))].map((_, k) => `<i class="${k < it.done ? 'on' : ''}"></i>`).join('')}</div></div>
          ${it.complete ? `<span class="wex-done">${icon('check')}</span>` : icon(i === s.cur ? 'down' : 'chev', 'chev')}</div>
        ${i === s.cur ? `<div class="wex-body"><a class="wex-link" href="#/ex/${encodeURIComponent(it.exId)}">${icon('video')} Nasıl yapılır</a><div class="w-editor"></div></div>` : ''}
      </div>`).join('') || emptyBox('dumbbell', 'Hareket yok', 'Aşağıdan antrenmanına hareket ekle.')}</div>
    <button class="btn ghost" id="w-add" style="margin-top:12px">${icon('plus')} Hareket ekle</button>
    <button class="btn" id="w-finish2" style="margin-top:10px">${icon('check')} Antrenmanı bitir</button>
    <div style="text-align:center;margin-top:14px"><button class="faint small" id="w-cancel">Antrenmanı iptal et</button></div>`;

  $$('.wex-head', view).forEach(h => h.addEventListener('click', () => {
    const i = +h.parentElement.dataset.i;
    s.cur = s.cur === i ? -1 : i; save(); rerenderWorkout();
  }));
  const open = day.items[s.cur];
  if (open) {
    renderSetEditor($('.w-editor', view), open.ex, {
      target: open, since: s.start,
      onSaved: saved => {
        const d = withProgress(s, s.start);
        const it = d.items[s.cur];
        if (it && saved && !saved.warm && db.sets.includes(saved) && it.done === it.sets) {
          const nextIdx = d.items.findIndex((x, k) => k > s.cur && !x.complete);
          const idx = nextIdx >= 0 ? nextIdx : d.items.findIndex(x => !x.complete);
          if (idx >= 0) { s.cur = idx; toast(`Sıradaki: ${d.items[idx].ex.name}`, 'chev'); }
          else toast('Tüm hareketler tamam! Antrenmanı bitirebilirsin', 'trophy');
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
      <div class="metric"><div class="lbl">Hacim</div><b class="num">${fmtInt(st.volume)}<small>kg</small></b><div class="note">${delta(st.volume, pst?.volume)}</div></div>
    </div>
    ${prEx.length ? `<div class="sec"><h2>Yeni rekorlar</h2><span class="pill accent">${icon('trophy')}${prEx.length}</span></div>
      <div class="list">${prEx.map(s => { const ex = getEx(s.exId); return `<a class="item" href="#/ex/${encodeURIComponent(s.exId)}">${thumb(ex)}<div class="grow"><div class="name">${esc(ex?.name)}</div><div class="meta num">${esc(fmtSet(ex, s))}</div></div>${icon('trophy', 'chev')}</a>`; }).join('')}</div>` : ''}
    <div class="sec"><h2>Hareketler</h2></div>
    <div class="list">${[...byEx.entries()].map(([exId, list]) => { const ex = getEx(exId); return `<a class="item" href="#/ex/${encodeURIComponent(exId)}" style="display:block">
      <div class="name">${esc(ex?.name || 'Silinmiş hareket')}</div>
      <div class="set-chips">${list.map(s => `<span class="set-chip">${s.warm ? 'Isınma · ' : ''}${esc(fmtSet(ex, s))}</span>`).join('')}</div></a>`; }).join('')}</div>
    <a class="btn" href="#/today" style="margin-top:18px">Tamam</a>`;
}

// ═════════════════════════ Set düzenleyici (hareket sayfası ve antrenman ekranı ortak)
const drafts = {};
function renderSetEditor(box, ex, { target = null, since = null, showStats = false, onSaved = null } = {}) {
  const type = ex.type || 'weight';
  const today = dayKey();
  const list = setsOf(ex.id).filter(s => (since ? s.ts >= since : s.date === today)).sort((a, b) => a.ts - b.ts);
  const ids = new Set(list.map(s => s.id));
  const last = lastSessionSets(ex, ids);
  const best = bestSet(ex, setsOf(ex.id));
  const sug = suggest(ex, target, last);
  const work = working(list);
  if (!drafts[ex.id]) {
    const ref = work.at(-1);
    drafts[ex.id] = ref ? { w: ref.w, r: ref.r, warm: false }
      : { w: sug.w ?? (last.at(-1)?.w ?? (type === 'weight' ? 20 : 0)), r: sug.r, warm: false };
  }
  const d = drafts[ex.id];
  const rStep = type === 'time' ? 5 : 1;
  const showSug = !work.length || (sug.w != null && (sug.w !== d.w || sug.r !== d.r) && work.length === 0);
  let wi = 0;
  const prevFor = s => (s.warm ? '—' : last[wi] ? fmtSet(ex, last[wi++]) : (wi++, '—'));

  box.innerHTML = `
    ${showStats ? `<div class="stat-pair">
      <div class="card"><div class="card-label">Geçen sefer</div><b class="num">${last.length ? esc(fmtSet(ex, last.at(-1))) : '—'}</b><div class="sm">${last.length ? `${last.length} set · ${daysAgo(last[0].date)}` : 'Kayıt yok'}</div></div>
      <div class="card"><div class="card-label">Rekor</div><b class="num">${best ? esc(fmtSet(ex, best)) : '—'}</b><div class="sm">${best && type === 'weight' && best.r > 1 ? `Tahmini 1RM ${fmtInt(e1rm(best.w, best.r))} kg` : best ? daysAgo(best.date) : 'Kayıt yok'}</div></div>
    </div>` : ''}
    ${target ? `<div class="target-hint">${icon('target')} Hedef: <b>${schemeText(target, ex)}</b></div>` : ''}
    ${showSug ? `<div class="suggest"><span class="ic">${icon(sug.up ? 'trend' : 'bulb')}</span><div class="grow"><b>${esc(sug.title)}</b><span>${esc(sug.sub)}</span></div>
      ${sug.w != null || sug.r ? `<button id="sug-apply">Uygula</button>` : ''}</div>` : ''}
    <div class="sets">
      <div class="sets-h"><span>Set</span><span>Önceki</span><span>${type === 'time' ? 'Süre' : 'Kg'}</span><span>${type === 'time' ? 'Kg' : 'Tekrar'}</span><span></span></div>
      ${list.length ? (() => { let n = 0; return list.map(s => `<div class="set-r" data-edit="${s.id}">
        <span class="n ${s.warm ? 'warm' : ''}">${s.warm ? 'I' : ++n}</span><span class="p">${esc(prevFor(s))}</span>
        <span class="v">${type === 'time' ? `${s.r} sn` : fmtN(s.w)}</span>
        <span class="v">${type === 'time' ? (s.w ? fmtN(s.w) : '—') : s.r}${isPR(ex, s) ? `<span class="pr">${icon('trophy')}</span>` : ''}</span>
        <span class="del">${icon('edit')}</span></div>`).join(''); })()
      : `<div class="sets-empty">Henüz set yok.${last.length ? ` Geçen sefer ${last.length} set yaptın.` : ''}</div>`}
    </div>
    <div class="composer card">
      <div class="warm-toggle"><span>Isınma seti</span>${switchHTML('warm-sw', d.warm)}</div>
      <div class="steppers">
        <div class="stepper"><label>${type === 'weight' ? 'Ağırlık · kg' : 'Ek ağırlık · kg'}</label><div class="ctl"><button data-s="w" data-d="-1" aria-label="Azalt">${icon('minus')}</button>
          <input class="in-w" inputmode="decimal" value="${fmtN(d.w, 2)}"><button data-s="w" data-d="1" aria-label="Artır">${icon('plus')}</button></div></div>
        <div class="stepper"><label>${type === 'time' ? 'Süre · sn' : 'Tekrar'}</label><div class="ctl"><button data-s="r" data-d="-1" aria-label="Azalt">${icon('minus')}</button>
          <input class="in-r" inputmode="numeric" value="${d.r}"><button data-s="r" data-d="1" aria-label="Artır">${icon('plus')}</button></div></div>
      </div>
      <button class="btn add-set">${icon('check')} ${d.warm ? 'Isınma setini kaydet' : `${work.length + 1}. seti kaydet`}</button>
    </div>`;

  const inW = $('.in-w', box), inR = $('.in-r', box);
  const redraw = () => renderSetEditor(box, ex, { target, since, showStats, onSaved });
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
    if (isPR(ex, s)) toast('Yeni rekor!', 'trophy');
    else if (!onSaved) toast(s.warm ? 'Isınma seti kaydedildi' : 'Set kaydedildi');
    unlockAudio();
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
    <div class="warm-toggle" style="margin-top:14px"><span>Isınma seti</span>${switchHTML('e-warm', warm)}</div>
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
  const today = dayKey();
  const st = dayStats(today);
  const m = metrics();
  const hour = new Date().getHours();
  const hello = hour < 6 ? 'İyi geceler' : hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';
  setHeader('Bugün');

  const ws = weekStart();
  const weekDays = [...Array(7)].map((_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return dayKey(d); });
  const weekKcal = weekDays.map(d => dayStats(d).kcal);
  const trained = weekDays.filter(d => setsOn(d).length).length;
  const goalDays = db.profile.days || 3;
  const maxK = Math.max(...weekKcal, 1);
  const C = 2 * Math.PI * 44;
  const ringOff = C * (1 - clamp(trained / goalDays, 0, 1));
  const doneToday = db.workouts.filter(w => w.date === today).sort((a, b) => b.end - a.end);

  let html = pageHead(fmtDay(today), hello) + `
    <div class="hero">
      <div class="hero-top">
        <div class="hero-kcal">
          <div class="lbl">${icon('flame')} Yakılan kalori</div>
          <div class="big num">${fmtInt(st.kcal)}<small>kcal</small></div>
          <div class="note">${profileReady() ? `${fmtN(bodyKg())} kg vücut ağırlığına göre` : 'Doğru hesap için profilden kilonu gir'}</div>
        </div>
        <div class="ring-wrap">
          <svg viewBox="0 0 104 104"><circle class="track" cx="52" cy="52" r="44"/><circle class="bar" cx="52" cy="52" r="44" stroke-dasharray="${C}" stroke-dashoffset="${ringOff}"/></svg>
          <div class="ring-center"><b class="num">${trained}/${goalDays}</b><span>bu hafta</span></div>
        </div>
      </div>
      <div class="hero-stats">
        <div><b class="num">${fmtInt(st.min)}<span style="font-size:13px"> dk</span></b><span>Süre</span></div>
        <div><b class="num">${st.sets}</b><span>Set</span></div>
        <div><b class="num">${st.volume >= 1000 ? fmtN(st.volume / 1000) + ' t' : fmtInt(st.volume)}</b><span>Hacim${st.volume >= 1000 ? '' : ' (kg)'}</span></div>
      </div>
    </div>`;

  if (!profileReady()) {
    html += `<a class="card cta" href="#/profile" style="margin-top:10px">
      <div class="ic">${icon('user')}</div>
      <div class="grow"><div class="card-title">Profilini tamamla</div><div class="muted small">Boy, kilo ve hedefini gir; kalori ihtiyacın ve kişisel önerilerin hesaplansın.</div></div>
      ${icon('chev', 'chev')}</a>`;
  }
  html += backupReminder();

  // Program kartı
  if (db.session) {
    const d = withProgress(db.session, db.session.start);
    const done = d.items.filter(i => i.complete).length;
    html += `<div class="sec"><h2>Devam eden antrenman</h2></div>
      <div class="card"><div class="plan-head"><div class="plan-icon">${icon('pulse')}</div><div class="grow"><div class="card-title">${esc(db.session.name)}</div>
        <div class="muted small num">${done}/${d.items.length} hareket tamam · ${fmtDur(Date.now() - db.session.start)}</div></div></div>
        <a class="btn" href="#/workout" style="margin-top:14px">Antrenmana devam et</a></div>`;
  } else {
    const plan = nextPlanDay();
    if (doneToday.length) {
      const w = doneToday[0];
      html += `<div class="sec"><h2>Bugün tamamlandı</h2></div>
        <a class="card cta" href="#/summary/${w.id}"><div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('check')}</div>
          <div class="grow"><div class="card-title">${esc(w.name)}</div><div class="muted small">${fmtInt((w.end - w.start) / 60000)} dk · özeti gör</div></div>${icon('chev', 'chev')}</a>`;
    }
    if (plan) {
      const p = withProgress(plan, Date.now());
      html += `<div class="sec"><h2>${doneToday.length ? 'Sıradaki antrenman' : 'Bugünün programı'}</h2><a href="#/programs">${esc(programName())}</a></div>
        <div class="card">
          <div class="plan-head"><div class="plan-icon">${icon('dumbbell')}</div>
            <div class="grow"><div class="card-title">${esc(p.name)}</div>
            <div class="muted small">${p.items.length} hareket · ${usingRoutines() ? 'kendi programın' : `${GOALS[db.profile.goal]} hedefine göre`}</div></div></div>
          <div class="plan-list">${p.items.map(i => `<a class="plan-item" href="#/ex/${encodeURIComponent(i.exId)}">
            <span class="chk"></span><span class="nm">${esc(i.ex.name)}</span><span class="tg">${schemeText(i, i.ex)}</span></a>`).join('')}</div>
          <button class="btn" id="start-plan">${icon('play')} Antrenmanı başlat</button>
        </div>`;
    } else {
      html += `<div class="sec"><h2>Program</h2></div>${emptyBox('list', 'Programında gün yok', 'Profil → Programlar bölümünden gün ekle.')}`;
    }
    html += `<button class="btn ghost" id="start-free" style="margin-top:10px">Serbest antrenman başlat</button>`;
  }

  // Beslenme
  if (m) {
    const f = db.food[today] || { kcal: 0, protein: 0, water: 0 };
    const kcalT = m.goalKcal + st.kcal, waterT = (m.water + (setsOn(today).length ? 0.5 : 0)) * 1000;
    const row = (label, val, tgt, unit, color) => `<div class="track-row"><div class="top"><b>${label}</b><span>${fmtInt(val)} / ${fmtInt(tgt)} ${unit}</span></div>
      <div class="bar"><i style="width:${clamp((val / tgt) * 100, 0, 100)}%;background:${color}"></i></div></div>`;
    html += `<div class="sec"><h2>Beslenme</h2><a href="#/profile">Hedefler</a></div>
      <div class="card">
        ${row('Kalori', f.kcal, kcalT, 'kcal', 'var(--fire)')}
        ${row('Protein', f.protein, m.protein, 'g', 'var(--accent)')}
        ${row('Su', f.water, waterT, 'ml', 'var(--blue)')}
        <div class="quick"><button id="q-meal">${icon('fork')} Öğün ekle</button><button id="q-water">${icon('drop')} +250 ml</button></div>
      </div>`;
  }

  // Kardiyo
  const cardio = cardioOn(today);
  html += `<div class="sec"><h2>Kardiyo</h2><button id="add-cardio">${icon('plus')} Ekle</button></div>`;
  html += cardio.length ? `<div class="card">${cardio.map(c => `<div class="cardio-row" data-id="${c.id}">
      <div class="plan-icon" style="width:38px;height:38px;border-radius:12px;background:var(--blue-soft);color:var(--blue)">${icon('run')}</div>
      <div class="grow"><div style="font-weight:600">${esc(CARDIO.find(x => x[0] === c.type)?.[1] || 'Kardiyo')}</div><div class="faint small num">${c.min} dk</div></div>
      <span class="pill fire num">${icon('flame')}${fmtInt(c.kcal)}</span></div>`).join('')}</div>`
    : `<button class="card cta" id="add-cardio2" style="width:100%;text-align:left"><div class="ic">${icon('run')}</div><div class="grow"><div class="card-title">Koşu, bisiklet, yürüyüş…</div><div class="muted small">Süreyi gir, yaktığın kalori günlük toplama eklensin.</div></div>${icon('plus', 'chev')}</button>`;

  // Hafta
  html += `<div class="sec"><h2>Bu hafta</h2><span class="faint small num">${fmtInt(weekKcal.reduce((a, b) => a + b, 0))} kcal</span></div>
    <div class="card"><div class="week">${weekDays.map((d, i) => `<div class="d ${d === today ? 'today' : ''}">
      <div class="b ${weekKcal[i] ? 'on' : ''}" style="height:${weekKcal[i] ? Math.max(14, (weekKcal[i] / maxK) * 70) : 6}px"></div>
      <span>${['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'][i]}</span></div>`).join('')}</div></div>`;
  html += `<div id="offline-slot"></div>`;
  view.innerHTML = html;

  $('#start-plan')?.addEventListener('click', () => startSession(nextPlanDay()));
  $('#start-free')?.addEventListener('click', () => startSession(null));
  $('#q-water')?.addEventListener('click', () => { addFood(0, 0, 250); toast('+250 ml su', 'drop'); rerender(); });
  $('#q-meal')?.addEventListener('click', () => mealSheet(rerender));
  $('#add-cardio')?.addEventListener('click', () => cardioSheet(rerender));
  $('#add-cardio2')?.addEventListener('click', () => cardioSheet(rerender));
  $$('.cardio-row', view).forEach(r => r.addEventListener('click', () => {
    if (!confirm('Bu kardiyo kaydı silinsin mi?')) return;
    db.cardio = db.cardio.filter(c => c.id !== r.dataset.id); save(); rerender();
  }));
  bindBackupReminder();
  offlineCard($('#offline-slot'), true);
  function rerender() { const y = scrollY; renderToday(); scrollTo(0, y); }
}

function addFood(kcal, protein, water) {
  const k = dayKey();
  const f = db.food[k] || { kcal: 0, protein: 0, water: 0 };
  f.kcal = Math.max(0, f.kcal + kcal); f.protein = Math.max(0, f.protein + protein); f.water = Math.max(0, f.water + water);
  db.food[k] = f;
  save();
}
function mealSheet(after) {
  const presets = [['Kahvaltı', 450, 25], ['Ana öğün', 700, 40], ['Ara öğün', 250, 10], ['Protein shake', 150, 25]];
  const { el, close } = openSheet(`
    <div class="sheet-title">Öğün ekle</div>
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
    addFood(k, p, 0); close(); toast('Öğün eklendi', 'fork'); after();
  });
  $('#m-reset', el).addEventListener('click', () => {
    if (!confirm('Bugünkü kalori, protein ve su kayıtları sıfırlansın mı?')) return;
    delete db.food[dayKey()]; save(); close(); after();
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
  if (db.sets.length < 10 || now < s.backupSnooze || now - s.lastBackup < 14 * 864e5) return '';
  return `<div class="card" id="bk-card" style="margin-top:10px"><div class="cta"><div class="ic" style="background:var(--accent-soft);color:var(--accent)">${icon('shield')}</div>
    <div class="grow"><div class="card-title">Kayıtlarını yedekle</div><div class="muted small">${s.lastBackup ? `Son yedek ${daysAgo(dayKey(new Date(s.lastBackup)))}.` : 'Hiç yedek almadın.'} Telefon değişirse veriler kaybolmasın.</div></div></div>
    <div class="sheet-actions" style="margin-top:12px"><button class="btn ghost" id="bk-later">Sonra</button><button class="btn" id="bk-now">Yedek al</button></div></div>`;
}
function bindBackupReminder() {
  $('#bk-later')?.addEventListener('click', () => { db.settings.backupSnooze = Date.now() + 7 * 864e5; save(); $('#bk-card').remove(); });
  $('#bk-now')?.addEventListener('click', async () => { if (await exportData()) $('#bk-card')?.remove(); });
}

// ═════════════════════════ Hareketler ve seçici
let libRegion = 'all', libQuery = '', picking = null;
function pickExercise(title, onPick) { picking = { title, onPick }; location.hash = '#/pick'; }
function renderPick() {
  if (!picking) { location.replace('#/lib'); return; }
  return renderLib(null, true);
}
function renderLib(region, pickMode = false) {
  if (region) libRegion = region;
  setHeader(pickMode ? 'Hareket seç' : 'Hareketler', pickMode ? { back: true, always: true } : { action: `<a class="top-btn" href="#/new" aria-label="Özel hareket ekle">${icon('plus')}</a>` });
  view.innerHTML = (pickMode ? `<div class="pick-banner">${icon('plus')} ${esc(picking.title)}</div>`
    : pageHead(`${allExercises().length} hareket · ${EXERCISES.filter(e => e.videos).length} videolu`, 'Hareketler')) + `
    <label class="search">${icon('search')}<input id="lib-q" type="search" placeholder="Hareket veya kas ara" value="${esc(libQuery)}" autocomplete="off"></label>
    <div class="chips" id="lib-chips"></div>
    <div id="lib-body"></div>`;
  $('#lib-q').addEventListener('input', e => { libQuery = e.target.value; renderLibBody(pickMode); });
  renderLibBody(pickMode);
  if (pickMode) return () => { picking = null; };
}
function libItem(ex, pickMode) {
  const ss = setsOf(ex.id);
  let meta = (animOf(ex)?.primary || []).join(', ') || REGION_BY_ID[ex.region]?.name || '';
  if (ss.length) {
    const last = ss.reduce((a, b) => (a.ts > b.ts ? a : b));
    meta = `${fmtSet(ex, last)} · ${daysAgo(last.date)}`;
  }
  const inner = `${thumb(ex)}<div class="grow"><div class="name">${esc(ex.name)}</div><div class="meta">${esc(meta)}${ex.custom ? ' · özel' : ''}</div></div>${icon(pickMode ? 'plus' : 'chev', 'chev')}`;
  return pickMode ? `<button class="item" data-pick="${esc(ex.id)}" style="width:100%;text-align:left">${inner}</button>`
    : `<a class="item" href="#/ex/${encodeURIComponent(ex.id)}">${inner}</a>`;
}
function renderLibBody(pickMode) {
  $('#lib-chips').innerHTML = `<button class="chip ${libRegion === 'all' ? 'on' : ''}" data-r="all">Tümü</button>` +
    REGIONS.map(r => `<button class="chip ${libRegion === r.id ? 'on' : ''}" data-r="${r.id}">${r.name}</button>`).join('');
  $$('#lib-chips .chip').forEach(c => c.addEventListener('click', () => { libRegion = c.dataset.r; renderLibBody(pickMode); }));
  const q = norm(libQuery.trim());
  const exs = allExercises().filter(e => (libRegion === 'all' || e.region === libRegion) &&
    (!q || norm(`${e.name} ${(e.primary || []).join(' ')} ${(e.secondary || []).join(' ')}`).includes(q)));
  const regions = libRegion === 'all' ? REGIONS : REGIONS.filter(r => r.id === libRegion);
  const html = regions.map(r => {
    const list = exs.filter(e => e.region === r.id);
    return list.length ? `<div class="group-title">${r.name} · ${list.length}</div><div class="list">${list.map(e => libItem(e, pickMode)).join('')}</div>` : '';
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

// ═════════════════════════ Hareket detayı
const LEVELS = { beginner: 'Başlangıç', intermediate: 'Orta', expert: 'İleri' };
let exTab = 'log';
function renderEx(id) {
  const ex = getEx(id);
  if (!ex) { location.replace('#/lib'); return; }
  const anim = animOf(ex);
  const regionName = REGION_BY_ID[ex.region]?.name || '';
  setHeader(ex.name, { back: true, always: true, action: ex.custom ? `<button class="top-btn danger" id="del-ex">Sil</button>` : '' });
  view.innerHTML = `
    <div id="media">${anim ? '' : `<div class="card empty" style="margin-top:6px"><div class="ic">${icon('dumbbell')}</div>Bu hareket için görsel seçilmedi.</div>`}</div>
    <div class="ex-head">
      <h1>${esc(ex.name)}</h1>
      <div class="ex-tags">
        ${anim?.primary?.includes(regionName) ? '' : `<span class="pill">${esc(regionName)}</span>`}
        ${anim?.primary?.length ? `<span class="pill accent">${icon('target')}${esc(anim.primary.join(', '))}</span>` : ''}
        ${anim?.videos ? `<span class="pill blue">${icon('video')}Video</span>` : ''}
        ${anim?.level ? `<span class="pill">${LEVELS[anim.level] || anim.level}</span>` : ''}
      </div>
    </div>
    <div class="seg"><button data-t="log">Kayıt</button><button data-t="how">Nasıl yapılır</button><button data-t="chart">İlerleme</button></div>
    <div id="pane"></div>
    ${db.session ? '' : ''}`;
  const unmount = anim ? mountMedia($('#media'), anim) : () => {};
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
    if (t === 'log') renderSetEditor(pane, ex, { target: planItemFor(ex.id), since: db.session?.start || null, showStats: true });
    if (t === 'how') renderHow(pane, ex, anim);
    if (t === 'chart') renderChart(pane, ex);
  };
  $$('.seg button', view).forEach(b => b.addEventListener('click', () => show(b.dataset.t)));
  show(exTab);
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
      <div class="kv"><span>Yoğunluk</span><span>${met >= 6 ? 'Yüksek' : met >= 4.5 ? 'Orta' : 'Düşük'} · set başı ~${fmtInt(met * bodyKg() * 130 / 3600)} kcal</span></div>
    </div>
    <div class="sec"><h2>Adım adım</h2></div>
    <div class="card"><ol class="steps">${src.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
    ${src.tips?.length ? `<div class="sec"><h2>İpuçları</h2></div><div class="card">${src.tips.map(s => `<div class="tip">${icon('bulb')}<span>${esc(s)}</span></div>`).join('')}</div>` : ''}`;
}

let chartMetric = 'max';
function renderChart(pane, ex) {
  const type = ex.type || 'weight';
  const days = groupByDay(working(setsOf(ex.id))).reverse();
  const list = type === 'weight'
    ? [['max', 'Maks ağırlık', 'kg'], ['1rm', 'Tahmini 1RM', 'kg'], ['vol', 'Hacim', 'kg']]
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
  const allDays = groupByDay(setsOf(ex.id));
  pane.innerHTML = `
    <div class="chips" style="margin-bottom:10px">${list.map(m => `<button class="chip ${m[0] === chartMetric ? 'on' : ''}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>
    ${points.length ? `<div class="card"><canvas class="chart"></canvas></div>` : emptyBox('bars', 'Henüz veri yok', 'İlk setini kaydettiğinde ilerlemen burada görünecek.')}
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
  const dates = [...new Set([...db.sets.map(s => s.date), ...db.cardio.map(c => c.date)])].sort().reverse();
  const count = {};
  for (const s of db.sets) count[s.date] = (count[s.date] || 0) + 1;
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
    <div class="stats3">
      <div class="card"><b class="num">${thisWeek}</b><span>Bu hafta</span></div>
      <div class="card"><b class="num">${db.workouts.length || dates.length}</b><span>Antrenman</span></div>
      <div class="card"><b class="num">${totalKcal >= 10000 ? fmtN(totalKcal / 1000) + 'k' : fmtInt(totalKcal)}</b><span>Toplam kcal</span></div>
    </div>
    <div class="card" style="margin-top:10px"><div class="heat">${cells}</div><div class="faint small" style="margin-top:10px">Son 16 hafta</div></div>
    ${balance}
    ${dates.length ? '<div class="sec"><h2>Antrenmanlar</h2></div>' : `<div style="margin-top:14px">${emptyBox('calendar', 'Henüz antrenman yok', 'Bir antrenman başlat veya set kaydet.')}</div>`}
    ${dates.map(d => {
      const st = dayStats(d);
      const ss = setsOn(d);
      const byEx = new Map();
      for (const s of ss) (byEx.get(s.exId) || byEx.set(s.exId, []).get(s.exId)).push(s);
      const ws2 = db.workouts.filter(w => w.date === d);
      const title = ws2.length ? ws2.map(w => w.name).join(' + ') : fmtDay(d, { weekday: 'long' });
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
          ${ws2.map(w => `<a class="day-ex lnk small" href="#/summary/${w.id}">${esc(w.name)} özetini gör ›</a>`).join('')}</div></details>`;
    }).join('')}`;
}

// ═════════════════════════ Profil
function renderProfile() {
  setHeader('Profil');
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
      <div class="field"><label for="p-act">Aktivite</label><select id="p-act">${opt(ACTIVITY.map(a => a[0]), p.activity, v => ACTIVITY.find(a => a[0] === v)[1])}</select></div>
      <div class="field"><label>Hedef</label><div class="mini-seg" id="p-goal">${Object.keys(GOALS).map(k => `<button data-v="${k}" class="${p.goal === k ? 'on' : ''}">${GOAL_SHORT[k]}</button>`).join('')}</div></div>
      <div class="field"><label for="p-days">Haftalık antrenman</label><select id="p-days">${opt([2, 3, 4, 5, 6], p.days, v => `${v} gün`)}</select></div>
    </div>
    <div class="list" style="margin-top:10px">
      <a class="link-row" href="#/programs"><div class="ic" style="background:rgba(167,139,250,.14);color:var(--violet)">${icon('list')}</div>
        <div class="grow"><div style="font-weight:600">Programlar</div><div class="faint small">${esc(programName())}${usingRoutines() ? ` · ${db.routines.length} gün` : ''}</div></div>${icon('chev', 'chev')}</a>
    </div>`;

  if (!m) {
    html += `<div class="card" style="margin-top:10px"><div class="row">${icon('info')}<div class="grow muted small">Cinsiyet, yaş, boy ve kilonu girdiğinde kalori ihtiyacın, vücut analizin ve sana özel öneriler burada görünecek.</div></div></div>`;
  } else {
    const bmiPos = clamp(((m.bmi - 15) / (40 - 15)) * 100, 0, 100);
    const kP = m.protein * 4, kF = m.fat * 9, kC = m.carbs * 4, tot = kP + kF + kC;
    html += `
      <div class="sec"><h2>Vücut analizi</h2></div>
      <div class="metric-grid">
        <div class="metric wide"><div class="row"><div class="grow"><div class="lbl">Vücut kitle indeksi (VKİ)</div>
          <b class="num">${fmtN(m.bmi)}</b></div><span class="pill" style="color:${m.bmiCat[1]}">${m.bmiCat[0]}</span></div>
          <div class="bmi-bar"><i style="left:${bmiPos}%"></i></div>
          <div class="bmi-scale"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div>
          <div class="note" style="margin-top:10px">Boyuna göre sağlıklı kilo aralığı: <b>${fmtInt(m.idealMin)}–${fmtInt(m.idealMax)} kg</b></div></div>
        <div class="metric"><div class="lbl">Tahmini yağ oranı</div><b class="num">%${fmtInt(m.bodyFat)}</b><div class="note">VKİ'ye dayalı kaba tahmin</div></div>
        <div class="metric"><div class="lbl">Bazal metabolizma</div><b class="num">${fmtInt(m.bmr)}<small>kcal</small></b><div class="note">Dinlenirken harcanan</div></div>
      </div>

      <div class="sec"><h2>Enerji ve beslenme</h2></div>
      <div class="metric-grid">
        <div class="metric"><div class="lbl">Günlük harcama</div><b class="num">${fmtInt(m.tdee)}<small>kcal</small></b><div class="note">Kilonu korumak için</div></div>
        <div class="metric" style="border-color:rgba(212,245,60,.28)"><div class="lbl">Günlük hedefin</div><b class="num" style="color:var(--accent)">${fmtInt(m.goalKcal)}<small>kcal</small></b>
          <div class="note">${p.goal === 'lose' ? '~0,5 kg/hafta yağ kaybı' : p.goal === 'gain' ? '~0,25 kg/hafta kontrollü artış' : 'Kilonu korursun'}</div></div>
        <div class="metric wide"><div class="lbl">Günlük makro dağılımı</div>
          <div class="macro-bar" style="margin-top:12px"><i style="width:${(kP / tot) * 100}%;background:var(--accent)"></i><i style="width:${(kF / tot) * 100}%;background:var(--fire)"></i><i style="width:${(kC / tot) * 100}%;background:var(--blue)"></i></div>
          <div class="legend">
            <div><i style="background:var(--accent)"></i>Protein<b class="num">${fmtInt(m.protein)} g</b></div>
            <div><i style="background:var(--fire)"></i>Yağ<b class="num">${fmtInt(m.fat)} g</b></div>
            <div><i style="background:var(--blue)"></i>Karbonhidrat<b class="num">${fmtInt(m.carbs)} g</b></div>
          </div></div>
        <div class="metric"><div class="lbl">Su</div><b class="num">${fmtN(m.water)}<small>L / gün</small></b><div class="note">Antrenman günü +0,5 L</div></div>
        <div class="metric"><div class="lbl">Hedef kiloya</div><b class="num">${m.weeks ? `~${m.weeks}<small>hafta</small>` : '—'}</b><div class="note">${p.target ? `${fmtN(p.target)} kg hedefi` : 'Hedef kilo girilmedi'}</div></div>
      </div>

      <div class="sec"><h2>Sana özel öneriler</h2></div>
      <div class="card">${recommendations(m, split).map(r => `<div class="reco"><div class="ic" style="background:${r.bg};color:${r.c}">${icon(r.i)}</div>
        <div class="grow"><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div></div>`).join('')}</div>
      <div class="disclaimer">Hesaplamalar Mifflin-St Jeor formülüne ve genel spor bilimi önerilerine dayanır; tıbbi tavsiye değildir. Sağlık sorunun varsa bir uzmana danış.</div>`;
  }

  if (db.weights.length) {
    html += `<div class="sec"><h2>Kilo takibi</h2><span class="faint small">${db.weights.length} ölçüm</span></div>
      <div class="card">${db.weights.length > 1 ? '<canvas class="chart" id="w-chart"></canvas>' : `<div class="muted small">Kilonu farklı günlerde güncelledikçe burada grafik oluşur. Son ölçüm: <b>${fmtN(w)} kg</b></div>`}</div>`;
  }

  html += `<div class="sec"><h2>Vücut ölçüleri</h2><button id="meas-add">${icon('plus')} Ölçü ekle</button></div>
    ${lastM ? `<div class="meas-grid">${MEASURES.filter(([k]) => lastM[k]).map(([k, n]) => {
      const d = firstM !== lastM && firstM[k] ? lastM[k] - firstM[k] : null;
      return `<div class="metric"><div class="lbl">${n}</div><b class="num">${fmtN(lastM[k])}<small>cm</small></b>
        ${d != null ? `<div class="delta ${(k === 'waist' || k === 'hip') === d <= 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${fmtN(d)} cm</div>` : '<div class="note">ilk ölçüm</div>'}</div>`;
    }).join('')}</div><div class="faint small" style="margin:8px 4px 0">Son ölçüm ${daysAgo(lastM.date)} · ${meas.length} kayıt</div>`
      : `<div class="card muted small">Bel, göğüs, kol gibi ölçülerini ayda bir gir; kilo değişmese bile vücudunun nasıl değiştiğini görürsün.</div>`}`;

  html += `
    <div class="sec"><h2>Ayarlar</h2></div>
    <div class="form">
      <div class="setting"><span>Dinlenme süresi</span><select id="s-rest">${opt([0, 45, 60, 90, 120, 150, 180, 240], db.settings.rest, v => (v ? `${Math.floor(v / 60)}:${pad2(v % 60)}` : 'Kapalı'))}</select></div>
      <div class="setting"><span>Ağırlık artış adımı</span><select id="s-step">${opt([0.5, 1, 1.25, 2, 2.5, 5], db.settings.step, v => fmtN(v, 2) + ' kg')}</select></div>
    </div>
    <div class="sec"><h2>Çevrimdışı videolar</h2></div>
    <div id="offline-slot"></div>
    <div class="sec"><h2>Yedekleme</h2></div>
    <div class="card">
      <div class="muted small" style="margin-bottom:12px">Veriler yalnızca bu telefonda saklanır. Yedeği "Dosyalar'a Kaydet" → iCloud Drive ile sakla. ${db.settings.lastBackup ? `Son yedek: <b>${daysAgo(dayKey(new Date(db.settings.lastBackup)))}</b>.` : 'Henüz yedek alınmadı.'}</div>
      <button class="btn ghost" id="b-export">${icon('download')} Yedek al</button>
      <button class="btn ghost" id="b-import">Yedeği geri yükle</button>
      <input type="file" id="f-import" accept="application/json,.json" hidden>
    </div>
    <div class="sec"><h2>Kaynaklar</h2></div>
    <div class="card small muted" style="line-height:1.6">
      Videolar: Goulart, <a class="lnk" href="https://wger.de" target="_blank" rel="noopener">wger.de</a> — CC BY-SA 4.0 (kısaltıldı, yeniden kodlandı).<br>
      Fotoğraflar: <a class="lnk" href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener">free-exercise-db</a> — kamu malı.
    </div>
    <div style="margin-top:22px"><button class="btn danger" id="b-reset">Tüm verileri sil</button></div>
    <div class="faint small" style="text-align:center;margin-top:14px">${db.sets.length} set · ${db.workouts.length} antrenman · ${db.custom.length} özel hareket</div>`;
  view.innerHTML = html;

  const rerender = () => { const y = scrollY; renderProfile(); scrollTo(0, y); };
  const bindNum = (sel, fn) => $(sel).addEventListener('change', e => { fn(num(e.target.value)); save(); rerender(); });
  $$('#p-sex button').forEach(b => b.addEventListener('click', () => { p.sex = b.dataset.v; save(); rerender(); }));
  $$('#p-goal button').forEach(b => b.addEventListener('click', () => { p.goal = b.dataset.v; save(); rerender(); }));
  bindNum('#p-age', v => (p.age = v ? clamp(Math.round(v), 12, 100) : null));
  bindNum('#p-h', v => (p.height = v ? clamp(Math.round(v), 120, 230) : null));
  bindNum('#p-t', v => (p.target = v ? clamp(v, 30, 250) : null));
  bindNum('#p-w', v => {
    if (!v) return;
    const kg = clamp(v, 30, 300), today = dayKey();
    const e = db.weights.find(x => x.date === today);
    if (e) e.kg = kg; else db.weights.push({ date: today, kg });
  });
  $('#p-act').addEventListener('change', e => { p.activity = +e.target.value; save(); rerender(); });
  $('#p-days').addEventListener('change', e => { p.days = +e.target.value; save(); rerender(); });
  $('#s-rest').addEventListener('change', e => { db.settings.rest = +e.target.value; save(); });
  $('#s-step').addEventListener('change', e => { db.settings.step = +e.target.value; save(); });
  $('#meas-add').addEventListener('click', () => measureSheet(lastM, rerender));
  $('#b-export').addEventListener('click', async () => { if (await exportData()) rerender(); });
  $('#b-import').addEventListener('click', () => $('#f-import').click());
  $('#f-import').addEventListener('change', e => importData(e.target.files[0]));
  $('#b-reset').addEventListener('click', () => {
    if (!confirm('Tüm set kayıtları, antrenmanlar, ölçümler ve özel hareketler silinecek. Emin misin?')) return;
    if (!confirm('Bu işlem geri alınamaz. Son kez onaylıyor musun?')) return;
    db = normalize({ sets: [], settings: db.settings, profile: db.profile });
    save(); toast('Veriler silindi'); rerender();
  });
  const wc = $('#w-chart');
  if (wc) drawChart(wc, [...db.weights].sort((a, b) => (a.date < b.date ? -1 : 1)).map(x => ({ d: x.date, v: x.kg })), 'kg',
    getComputedStyle(document.documentElement).getPropertyValue('--blue').trim());
  offlineCard($('#offline-slot'), false);
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
  out.push({
    i: 'fork', c: 'var(--fire)', bg: 'var(--fire-soft)', t: `Günde ~${fmtInt(m.goalKcal)} kcal al`,
    d: g === 'lose' ? 'Harcamandan ~500 kcal az yiyerek haftada yaklaşık 0,5 kg yağ kaybedersin. Antrenman günlerinde yaktığın kalorinin bir kısmını geri alabilirsin.'
      : g === 'gain' ? 'Harcamandan ~300 kcal fazla yiyerek yağlanmayı en aza indirip kas kazanırsın. Ayda 1 kg\'dan hızlı alıyorsan kaloriyi biraz düşür.'
        : 'Harcamana eşit kalori alarak kilonu korursun. Haftalık kilo ortalamana göre ±100–200 kcal ayarla.',
  });
  out.push({
    i: 'bolt', c: 'var(--accent)', bg: 'var(--accent-soft)', t: `Günde ${fmtInt(m.protein)} g protein`,
    d: `Kilogram başına ${fmtN(m.protein / m.w)} g. 4 öğüne bölersen (öğün başı ~${fmtInt(m.protein / 4)} g) kas onarımı için en verimli şekilde kullanılır.`,
  });
  out.push({
    i: 'dumbbell', c: 'var(--violet)', bg: 'rgba(167,139,250,.14)', t: `${usingRoutines() ? 'Kendi programın' : split.name + ' programı'} · haftada ${p.days} gün`,
    d: g === 'gain' ? 'Ana hareketlerde 4×6–8, yardımcılarda 3×8–12 tekrar. Uygulama her sette hedefin üst sınırına ulaştığında ağırlık artırmanı önerir. Setler arası 2–3 dk dinlen.'
      : g === 'lose' ? 'Kas kaybını önlemek için ağır çalışmaya devam et: ana hareketlerde 3×8–10, diğerlerinde 3×12–15. Setler arası 60–90 sn dinlen.'
        : 'Hareket başına 3×8–12 tekrar; son 1–2 tekrar zorlayıcı olsun. Setler arası 90 sn dinlen.',
  });
  if (g === 'lose' || m.bmi >= 25) {
    out.push({ i: 'pulse', c: 'var(--blue)', bg: 'var(--blue-soft)', t: 'Haftada 150–300 dk kardiyo',
      d: m.bmi >= 30 ? 'Eklemlerini korumak için tempolu yürüyüş, bisiklet veya eliptik gibi düşük darbeli kardiyo seç. Bugün ekranından kardiyo kaydedebilirsin.'
        : 'Tempolu yürüyüş, bisiklet veya yüzme. Antrenman sonrası 15–20 dk kardiyo yağ yakımını destekler. Bugün ekranından kaydedebilirsin.' });
  } else if (m.bmi < 18.5) {
    out.push({ i: 'heart', c: 'var(--blue)', bg: 'var(--blue-soft)', t: 'Kardiyoyu sınırlı tut',
      d: 'VKİ\'n düşük; enerjini kas gelişimine ayırmak için kardiyoyu haftada 1–2 hafif seansla sınırla ve kalori fazlası ile beslen.' });
  }
  if (m.weeks) out.push({ i: 'target', c: 'var(--good)', bg: 'rgba(52,211,153,.14)', t: `Hedefine ~${m.weeks} haftada ulaşabilirsin`,
    d: `${fmtN(m.w)} kg → ${fmtN(p.target)} kg. Güvenli hızda ilerlemek verilen kilonun geri gelmesini önler. Haftada 1–2 kez aynı saatte tartıl ve kilonu buraya gir.` });
  const done = new Set(db.sets.filter(s => s.date >= dayKey(weekStart())).map(s => s.date)).size;
  out.push({ i: 'calendar', c: 'var(--warn)', bg: 'rgba(251,191,36,.14)', t: done >= p.days ? 'Bu haftanın hedefi tamam!' : `Bu hafta ${p.days - done} antrenman kaldı`,
    d: done >= p.days ? 'Harika gidiyorsun. Ekstra gün yapacaksan hafif kardiyo veya esneme tercih et.'
      : `Hafta hedefin ${p.days} gün, şu ana kadar ${done} gün antrenman yaptın. Bugün ekranından sıradaki antrenmanı başlat.` });
  out.push({ i: 'moon', c: 'var(--text-2)', bg: 'var(--surface-2)', t: 'Her gece 7–9 saat uyu',
    d: 'Kas gelişimi ve iştah kontrolü uykuda düzenlenir. Az uyku, güç ve yağ yakımını belirgin şekilde düşürür.' });
  return out;
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
      if (!confirm(`${valid.length} set içeren yedek yüklensin mi?\nMevcut veriler bu yedekle değiştirilecek.`)) return;
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
  restEl.hidden = false; restEl.classList.remove('done');
  clearInterval(restTimer);
  restTimer = setInterval(tickRest, 250);
  tickRest();
}
function stopRest() { clearInterval(restTimer); restEl.hidden = true; }
function tickRest() {
  const leftMs = restEnd - Date.now();
  const left = Math.ceil(leftMs / 1000);
  $('#rest-bar').style.strokeDashoffset = 106.8 * (1 - clamp(leftMs / 1000 / restTotal, 0, 1));
  if (left <= 0) {
    if (!restEl.classList.contains('done')) {
      restEl.classList.add('done'); beep();
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
  tickRest();
});

// ═════════════════════════ Başlat
if (!location.hash || location.hash === '#/settings' || location.hash === '#/pick') history.replaceState(null, '', '#/today');
route();
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
