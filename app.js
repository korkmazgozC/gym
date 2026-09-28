import { REGIONS, EXERCISES, EX_BY_ID, REGION_BY_ID } from './exercises.js';

// ───────────────────────── Yardımcılar
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const fmtN = n => (Math.round(n * 100) / 100).toLocaleString('tr-TR');
const pad2 = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseDay = k => new Date(k + 'T12:00:00');
const fmtDay = (k, opts = { weekday: 'long', day: 'numeric', month: 'long' }) => parseDay(k).toLocaleDateString('tr-TR', opts);
const e1rm = (w, r) => (r <= 1 ? w : w * (1 + r / 30));

function daysAgo(k) {
  const diff = Math.round((parseDay(dayKey()) - parseDay(k)) / 864e5);
  if (diff === 0) return 'bugün';
  if (diff === 1) return 'dün';
  if (diff < 7) return `${diff} gün önce`;
  if (diff < 30) return `${Math.floor(diff / 7)} hafta önce`;
  return fmtDay(k, { day: 'numeric', month: 'short' });
}

// ───────────────────────── Veri
const KEY = 'gymtakip.v1';
const DEFAULT_SETTINGS = { rest: 90, step: 2.5 };
let db = load();

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && Array.isArray(d.sets)) return { sets: d.sets, custom: d.custom || [], settings: { ...DEFAULT_SETTINGS, ...d.settings } };
  } catch { /* boş başla */ }
  return { sets: [], custom: [], settings: { ...DEFAULT_SETTINGS } };
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); }
  catch { toast('⚠️ Kaydedilemedi'); }
}
navigator.storage?.persist?.().catch(() => {});

function allExercises() {
  return [...EXERCISES, ...db.custom.map(c => ({ ...c, custom: true }))];
}
function getEx(id) {
  if (EX_BY_ID[id]) return EX_BY_ID[id];
  const c = db.custom.find(x => x.id === id);
  return c ? { ...c, custom: true } : null;
}
const animOf = ex => (ex.frames ? ex : ex.animFrom ? EX_BY_ID[ex.animFrom] : null);

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
const setScore = (ex, s) => (ex?.type === 'weight' ? e1rm(s.w, s.r) : ex?.type === 'time' ? s.r + s.w * 10 : s.r + s.w * 2);

function bestSet(ex, sets) {
  let best = null;
  for (const s of sets) if (!best || setScore(ex, s) > setScore(ex, best)) best = s;
  return best;
}

// ───────────────────────── UI temel
const view = $('#view');
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2200);
}

function setHeader(title, { sub = '', back = false, action = '' } = {}) {
  $('#title').textContent = title;
  $('#subtitle').textContent = sub;
  $('#back').hidden = !back;
  $('#top-action').innerHTML = action;
}
$('#back').addEventListener('click', () => {
  if (history.length > 1) history.back(); else location.hash = '#/lib';
});

function regionBadge(regionId, label) {
  const r = REGION_BY_ID[regionId] || { color: '#888', name: '?' };
  return `<div class="badge" style="background:${r.color}22;color:${r.color}">${esc(label ?? r.name.slice(0, 2))}</div>`;
}
const initials = name => name.split(/[\s(]+/).filter(Boolean).slice(0, 2).map(w => w[0].toLocaleUpperCase('tr-TR')).join('');
const chevron ='<svg class="chev" width="10" height="16" viewBox="0 0 10 16"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

// ───────────────────────── Router
let cleanup = null;
const routes = { today: renderToday, lib: renderLib, ex: renderEx, hist: renderHist, settings: renderSettings, new: renderNew };

function route() {
  const [name = 'today', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const fn = routes[name] || renderToday;
  if (cleanup) { cleanup(); cleanup = null; }
  const tab = name === 'ex' || name === 'new' ? 'lib' : routes[name] ? name : 'today';
  $$('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  view.innerHTML = '';
  window.scrollTo(0, 0);
  cleanup = fn(...args) || null;
}
window.addEventListener('hashchange', route);

// ───────────────────────── Bugün
function renderToday() {
  const today = dayKey();
  const sets = setsOn(today);
  setHeader('Bugün', { sub: fmtDay(today) });

  const exIds = [...new Set(sets.map(s => s.exId))];
  const volume = sets.reduce((a, s) => a + s.w * s.r * (getEx(s.exId)?.type === 'weight' ? 1 : 0), 0);

  let html = `
    <div class="stats">
      <div class="stat"><b>${exIds.length}</b><span>Hareket</span></div>
      <div class="stat"><b>${sets.length}</b><span>Set</span></div>
      <div class="stat"><b>${fmtN(Math.round(volume))}</b><span>Hacim (kg)</span></div>
    </div>`;

  if (!sets.length) {
    html += `<div class="card empty" style="margin-top:14px"><div class="big">🏋️</div>
      Bugün henüz set kaydı yok.<br>Bir hareket seçip ilk setini ekle.</div>`;
  } else {
    html += `<div class="section-title">Bugünkü antrenman</div>`;
    for (const id of exIds) {
      const ex = getEx(id);
      const ss = sets.filter(s => s.exId === id);
      html += `<a class="card item" style="display:block;text-decoration:none;color:inherit" href="#/ex/${encodeURIComponent(id)}">
        <div class="row">${regionBadge(ex?.region, initials(ex?.name || '?'))}<div class="grow"><div class="name">${esc(ex?.name || 'Silinmiş hareket')}</div>
        <div class="sub">${ss.length} set</div></div>${chevron}</div>
        <div class="set-chips">${ss.map(s => `<span class="set-chip">${esc(fmtSet(ex, s))}</span>`).join('')}</div></a>`;
    }
  }

  html += `<div style="margin-top:16px"><a class="btn" href="#/lib" style="text-decoration:none">＋ Hareket ekle</a></div>`;

  // Son yapılan hareketler: hızlı erişim
  const recent = [];
  for (const s of [...db.sets].sort((a, b) => b.ts - a.ts)) {
    if (s.date !== today && !recent.includes(s.exId) && !exIds.includes(s.exId)) recent.push(s.exId);
    if (recent.length >= 6) break;
  }
  const recentEx = recent.map(getEx).filter(Boolean);
  if (recentEx.length) {
    html += `<div class="section-title">Son yaptıkların</div><div class="list">${recentEx.map(exItem).join('')}</div>`;
  }
  view.innerHTML = html;
}

function exItem(ex) {
  const ss = setsOf(ex.id);
  let sub = REGION_BY_ID[ex.region]?.name || '';
  if (ss.length) {
    const last = ss.reduce((a, b) => (a.ts > b.ts ? a : b));
    sub = `Son: ${fmtSet(ex, last)} · ${daysAgo(last.date)}`;
  }
  return `<a class="item" href="#/ex/${encodeURIComponent(ex.id)}">${regionBadge(ex.region, initials(ex.name))}
    <div class="grow"><div class="name">${esc(ex.name)}${ex.custom ? ' <span class="muted small">· özel</span>' : ''}</div><div class="sub">${esc(sub)}</div></div>${chevron}</a>`;
}

// ───────────────────────── Hareketler
let libRegion = 'all';
function renderLib(region) {
  if (region) libRegion = region;
  setHeader('Hareketler', { action: `<button class="link-btn" id="add-custom">＋ Özel</button>` });
  const exs = allExercises().filter(e => libRegion === 'all' || e.region === libRegion);

  view.innerHTML = `
    <div class="chips">
      <button class="chip ${libRegion === 'all' ? 'on' : ''}" data-r="all">Tümü</button>
      ${REGIONS.map(r => `<button class="chip ${libRegion === r.id ? 'on' : ''}" data-r="${r.id}"><span class="dot" style="background:${r.color}"></span> ${r.name}</button>`).join('')}
    </div>
    ${libRegion === 'all'
      ? REGIONS.map(r => {
        const list = exs.filter(e => e.region === r.id);
        return list.length ? `<div class="section-title">${r.name}</div><div class="list">${list.map(exItem).join('')}</div>` : '';
      }).join('')
      : `<div class="list" style="margin-top:12px">${exs.map(exItem).join('') || '<div class="empty">Bu bölgede hareket yok.</div>'}</div>`}
  `;
  $$('.chip', view).forEach(c => c.addEventListener('click', () => { libRegion = c.dataset.r; renderLib(); }));
  $('#add-custom').addEventListener('click', () => (location.hash = '#/new'));
}

// ───────────────────────── Özel hareket
function renderNew() {
  setHeader('Yeni hareket', { back: true });
  view.innerHTML = `
    <div class="form-row"><label>Hareket adı</label><input class="text-in" id="n-name" placeholder="örn. Cable Crossover" maxlength="60"></div>
    <div class="form-row"><label>Bölge</label><select class="text-in" id="n-region">${REGIONS.map(r => `<option value="${r.id}" ${r.id === libRegion ? 'selected' : ''}>${r.name}</option>`).join('')}</select></div>
    <div class="form-row"><label>Takip türü</label><select class="text-in" id="n-type">
      <option value="weight">Ağırlık × tekrar</option><option value="bodyweight">Vücut ağırlığı (tekrar, ek ağırlık opsiyonel)</option><option value="time">Süre (saniye)</option></select></div>
    <div class="form-row"><label>3D animasyon (benzer hareket)</label><select class="text-in" id="n-anim">
      <option value="">Animasyon yok</option>${EXERCISES.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('')}</select></div>
    <button class="btn" id="n-save">Kaydet</button>`;
  $('#n-save').addEventListener('click', () => {
    const name = $('#n-name').value.trim();
    if (!name) { toast('Hareket adı gir'); return; }
    const id = 'c-' + uid();
    db.custom.push({ id, name, region: $('#n-region').value, type: $('#n-type').value, animFrom: $('#n-anim').value || null });
    save();
    location.replace('#/ex/' + id);
  });
}

// ───────────────────────── Hareket detayı
const drafts = {};
let exTab = 'log';

function renderEx(id) {
  const ex = getEx(id);
  if (!ex) { location.replace('#/lib'); return; }
  const region = REGION_BY_ID[ex.region];
  setHeader(ex.name, {
    sub: region?.name, back: true,
    action: ex.custom ? `<button class="link-btn danger" id="del-ex">Sil</button>` : '',
  });

  const anim = animOf(ex);
  view.innerHTML = `
    <div class="viewer-wrap">
      <div id="viewer"></div>
      ${anim ? `<div class="vhint"><span class="tgt">${esc(anim.target || '')}</span><span>Döndürmek için sürükle</span></div>
      <div class="viewer-ctl">
        <button class="vbtn round" id="v-play" aria-label="Durdur">❚❚</button>
        <button class="vbtn" id="v-speed">1×</button>
        <span class="grow"></span>
        <button class="vbtn" id="v-reset">Görünümü sıfırla</button>
      </div>` : `<div class="viewer-msg">Bu hareket için 3D animasyon seçilmedi.</div>`}
    </div>
    <div class="seg">
      <button data-t="log">Kayıt</button>
      <button data-t="how">Nasıl yapılır</button>
      <button data-t="chart">Grafik</button>
    </div>
    <div id="pane"></div>`;

  let viewer = null, disposed = false;
  if (anim) {
    const box = $('#viewer');
    import('./viewer3d.js').then(({ Viewer }) => {
      if (disposed) return;
      viewer = new Viewer(box);
      viewer.setExercise(anim);
    }).catch(err => {
      console.error(err);
      box.innerHTML = `<div class="viewer-msg">3D görüntüleyici yüklenemedi.<br><span class="small">İlk açılışta internet bağlantısı gerekir.</span></div>`;
    });
    $('#v-play').addEventListener('click', e => {
      if (!viewer) return;
      viewer.playing = !viewer.playing;
      e.currentTarget.textContent = viewer.playing ? '❚❚' : '▶';
    });
    const speeds = [1, 0.5, 0.25, 1.5];
    $('#v-speed').addEventListener('click', e => {
      if (!viewer) return;
      viewer.speed = speeds[(speeds.indexOf(viewer.speed) + 1) % speeds.length];
      e.currentTarget.textContent = String(viewer.speed).replace('.', ',') + '×';
    });
    $('#v-reset').addEventListener('click', () => viewer?.resetView());
  }

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
    if (t === 'log') renderLog(pane, ex);
    if (t === 'how') renderHow(pane, ex, anim);
    if (t === 'chart') renderChart(pane, ex);
  };
  $$('.seg button', view).forEach(b => b.addEventListener('click', () => show(b.dataset.t)));
  show(exTab);

  return () => { disposed = true; viewer?.dispose(); };
}

function renderLog(pane, ex) {
  const today = dayKey();
  const all = setsOf(ex.id);
  const todays = all.filter(s => s.date === today).sort((a, b) => a.ts - b.ts);
  const prevDays = groupByDay(all.filter(s => s.date !== today));
  const last = prevDays[0];
  const best = bestSet(ex, all);
  const type = ex.type || 'weight';

  if (!drafts[ex.id]) {
    const ref = todays.at(-1) || last?.[1].at(-1);
    drafts[ex.id] = ref ? { w: ref.w, r: ref.r } : { w: type === 'weight' ? 20 : 0, r: type === 'time' ? 30 : 10 };
  }
  const d = drafts[ex.id];
  const wLabel = type === 'weight' ? 'Ağırlık (kg)' : 'Ek ağırlık (kg)';
  const rLabel = type === 'time' ? 'Süre (sn)' : 'Tekrar';
  const rStep = type === 'time' ? 5 : 1;

  pane.innerHTML = `
    <div class="info-grid">
      <div class="card"><span class="muted small">Geçen sefer${last ? ' · ' + daysAgo(last[0]) : ''}</span>
        <b>${last ? esc(last[1].map(s => fmtSet(ex, s).replace(' kg', '')).slice(0, 3).join(', ')) + (last[1].length > 3 ? '…' : '') : '—'}</b></div>
      <div class="card"><span class="muted small">Rekor 🏆</span>
        <b>${best ? esc(fmtSet(ex, best)) : '—'}</b>
        ${best && type === 'weight' && best.r > 1 ? `<span class="muted small">Tahmini 1RM: ${fmtN(Math.round(e1rm(best.w, best.r)))} kg</span>` : ''}</div>
    </div>

    <div class="card" style="margin-top:10px">
      <div class="inputs">
        <div class="field"><label>${wLabel}</label>
          <div class="stepper"><button data-s="w" data-d="-1">−</button>
          <input id="in-w" inputmode="decimal" value="${fmtN(d.w)}"><button data-s="w" data-d="1">+</button></div></div>
        <div class="field"><label>${rLabel}</label>
          <div class="stepper"><button data-s="r" data-d="-1">−</button>
          <input id="in-r" inputmode="numeric" value="${d.r}"><button data-s="r" data-d="1">+</button></div></div>
      </div>
      <button class="btn" id="add-set" style="margin-top:12px">Set ekle</button>
    </div>

    <div class="section-title">Bugün · ${todays.length} set</div>
    <div class="card log-sets" style="margin-top:0;padding-top:4px;padding-bottom:4px">
      ${todays.length ? todays.map((s, i) => `<div class="log-set"><span class="n">${i + 1}</span>
        <span class="v">${esc(fmtSet(ex, s))}</span><button class="del" data-id="${s.id}" aria-label="Sil">×</button></div>`).join('')
      : '<div class="muted small" style="padding:10px 2px">Henüz set yok.</div>'}
    </div>`;

  const inW = $('#in-w', pane), inR = $('#in-r', pane);
  inW.addEventListener('change', () => { d.w = Math.max(0, num(inW.value)); inW.value = fmtN(d.w); });
  inR.addEventListener('change', () => { d.r = Math.max(0, Math.round(num(inR.value))); inR.value = d.r; });
  $$('.stepper button', pane).forEach(b => b.addEventListener('click', () => {
    const dir = +b.dataset.d;
    if (b.dataset.s === 'w') { d.w = Math.max(0, Math.round((num(inW.value) + dir * db.settings.step) * 100) / 100); inW.value = fmtN(d.w); }
    else { d.r = Math.max(0, Math.round(num(inR.value)) + dir * rStep); inR.value = d.r; }
  }));

  $('#add-set', pane).addEventListener('click', () => {
    d.w = Math.max(0, num(inW.value));
    d.r = Math.max(0, Math.round(num(inR.value)));
    if (!d.r) { toast(type === 'time' ? 'Süre gir' : 'Tekrar sayısı gir'); return; }
    const prevBest = bestSet(ex, all);
    const s = { id: uid(), exId: ex.id, date: today, ts: Date.now(), w: d.w, r: d.r };
    db.sets.push(s);
    save();
    if (prevBest && setScore(ex, s) > setScore(ex, prevBest)) toast('🏆 Yeni rekor!');
    else toast('✓ Set kaydedildi');
    unlockAudio();
    startRest(db.settings.rest);
    renderLog(pane, ex);
  });

  $$('.del', pane).forEach(b => b.addEventListener('click', () => {
    if (!confirm('Bu set silinsin mi?')) return;
    db.sets = db.sets.filter(s => s.id !== b.dataset.id);
    save();
    renderLog(pane, ex);
  }));
}

function renderHow(pane, ex, anim) {
  const src = ex.steps ? ex : anim;
  if (!src?.steps) {
    pane.innerHTML = `<div class="card empty">Bu özel hareket için açıklama yok.${anim ? `<br>Animasyon: ${esc(anim.name)}` : ''}</div>`;
    return;
  }
  pane.innerHTML = `
    <div class="card"><span class="muted small">Çalışan kaslar</span><div style="font-weight:650;margin-top:2px">${esc(src.target)}</div></div>
    <div class="section-title">Adımlar</div>
    <div class="card"><ol class="steps">${src.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
    ${src.tips?.length ? `<div class="section-title">İpuçları</div><div class="card"><ul class="tips">${src.tips.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}`;
}

// ───────────────────────── Grafik
let chartMetric = 'max';
function renderChart(pane, ex) {
  const type = ex.type || 'weight';
  const days = groupByDay(setsOf(ex.id)).reverse();
  const metrics = type === 'weight'
    ? [['max', 'Maks ağırlık', 'kg'], ['1rm', 'Tahmini 1RM', 'kg'], ['vol', 'Hacim', 'kg']]
    : type === 'time' ? [['max', 'En uzun süre', 'sn'], ['vol', 'Toplam süre', 'sn']]
      : [['max', 'En çok tekrar', ''], ['vol', 'Toplam tekrar', '']];
  if (!metrics.some(m => m[0] === chartMetric)) chartMetric = metrics[0][0];
  const metric = metrics.find(m => m[0] === chartMetric);

  const value = ss => {
    if (type === 'weight') {
      if (chartMetric === 'max') return Math.max(...ss.map(s => s.w));
      if (chartMetric === '1rm') return Math.max(...ss.map(s => e1rm(s.w, s.r)));
      return ss.reduce((a, s) => a + s.w * s.r, 0);
    }
    return chartMetric === 'max' ? Math.max(...ss.map(s => s.r)) : ss.reduce((a, s) => a + s.r, 0);
  };
  const points = days.map(([d, ss]) => ({ d, v: value(ss) }));

  pane.innerHTML = `
    <div class="chips" style="margin-bottom:10px">${metrics.map(m => `<button class="chip ${m[0] === chartMetric ? 'on' : ''}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>
    <div class="card">${points.length >= 1 ? '<canvas class="chart"></canvas>' : '<div class="empty">Grafik için en az bir antrenman kaydı gerekli.</div>'}</div>
    ${days.length ? `<div class="section-title">Tüm antrenmanlar</div><div class="list">
      ${[...days].reverse().map(([d, ss]) => `<div class="item" style="display:block">
        <div class="row"><div class="grow name">${esc(fmtDay(d, { day: 'numeric', month: 'long', year: 'numeric' }))}</div><span class="muted small">${ss.length} set</span></div>
        <div class="set-chips">${ss.map(s => `<span class="set-chip">${esc(fmtSet(ex, s))}</span>`).join('')}</div></div>`).join('')}</div>` : ''}`;

  $$('.chip', pane).forEach(c => c.addEventListener('click', () => { chartMetric = c.dataset.m; renderChart(pane, ex); }));
  const canvas = $('canvas', pane);
  if (canvas) drawChart(canvas, points, metric[2]);
}

function drawChart(canvas, pts, unit) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const c = canvas.getContext('2d');
  c.scale(dpr, dpr);
  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim();
  const muted = css.getPropertyValue('--muted').trim();
  const line = css.getPropertyValue('--line').trim();

  const L = 44, R = 12, T = 14, B = 26;
  let min = Math.min(...pts.map(p => p.v)), max = Math.max(...pts.map(p => p.v));
  if (min === max) { min = min * 0.9; max = max * 1.1 || 1; }
  const padv = (max - min) * 0.12; min = Math.max(0, min - padv); max += padv;
  const x = i => (pts.length === 1 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (pts.length - 1));
  const y = v => T + (1 - (v - min) / (max - min)) * (H - T - B);

  c.font = '11px -apple-system, sans-serif';
  c.fillStyle = muted; c.strokeStyle = line; c.lineWidth = 1;
  c.textAlign = 'right'; c.textBaseline = 'middle';
  for (let i = 0; i <= 3; i++) {
    const v = min + ((max - min) * i) / 3, yy = y(v);
    c.beginPath(); c.moveTo(L, yy); c.lineTo(W - R, yy); c.stroke();
    c.fillText(fmtN(Math.round(v)), L - 8, yy);
  }
  c.textBaseline = 'top';
  const label = p => fmtDay(p.d, { day: 'numeric', month: 'short' });
  c.textAlign = 'left'; c.fillText(label(pts[0]), L, H - B + 8);
  if (pts.length > 1) { c.textAlign = 'right'; c.fillText(label(pts.at(-1)), W - R, H - B + 8); }

  if (pts.length > 1) {
    const g = c.createLinearGradient(0, T, 0, H - B);
    g.addColorStop(0, accent + '55'); g.addColorStop(1, accent + '00');
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(x(i), y(p.v)) : c.moveTo(x(i), y(p.v))));
    c.lineTo(x(pts.length - 1), H - B); c.lineTo(x(0), H - B); c.closePath();
    c.fillStyle = g; c.fill();
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(x(i), y(p.v)) : c.moveTo(x(i), y(p.v))));
    c.strokeStyle = accent; c.lineWidth = 2.5; c.lineJoin = 'round'; c.stroke();
  }
  pts.forEach((p, i) => {
    c.beginPath(); c.arc(x(i), y(p.v), pts.length > 30 ? 2 : 3.5, 0, Math.PI * 2);
    c.fillStyle = accent; c.fill();
  });
  const lp = pts.at(-1);
  c.fillStyle = css.getPropertyValue('--text').trim();
  c.font = '600 12px -apple-system, sans-serif';
  c.textAlign = pts.length > 1 ? 'right' : 'center'; c.textBaseline = 'bottom';
  c.fillText(`${fmtN(Math.round(lp.v * 10) / 10)} ${unit}`, Math.min(x(pts.length - 1), W - R), y(lp.v) - 7);
}

// ───────────────────────── Geçmiş
function renderHist() {
  setHeader('Geçmiş');
  const days = groupByDay(db.sets);
  const count = {};
  for (const [d, ss] of days) count[d] = ss.length;

  // Son 16 haftanın ısı haritası (Pazartesi başlangıçlı)
  const now = new Date();
  const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const start = new Date(monday); start.setDate(monday.getDate() - 15 * 7);
  let cells = '';
  const todayK = dayKey();
  for (let i = 0; i < 16 * 7; i++) {
    const dt = new Date(start); dt.setDate(start.getDate() + i);
    const k = dayKey(dt);
    if (k > todayK) { cells += '<i style="visibility:hidden"></i>'; continue; }
    const n = count[k] || 0;
    cells += `<i class="${n ? (n < 8 ? 'l1' : n < 16 ? 'l2' : 'l3') : ''} ${k === todayK ? 'today' : ''}" title="${k}"></i>`;
  }
  const weekStart = dayKey(monday);
  const thisWeek = days.filter(([d]) => d >= weekStart).length;

  view.innerHTML = `
    <div class="stats">
      <div class="stat"><b>${thisWeek}</b><span>Bu hafta</span></div>
      <div class="stat"><b>${days.length}</b><span>Toplam gün</span></div>
      <div class="stat"><b>${db.sets.length}</b><span>Toplam set</span></div>
    </div>
    <div class="card" style="margin-top:10px"><div class="heat">${cells}</div>
      <div class="muted small" style="margin-top:8px">Son 16 hafta</div></div>
    ${days.length ? '<div class="section-title">Antrenmanlar</div>' : '<div class="card empty" style="margin-top:14px"><div class="big">📅</div>Henüz antrenman kaydı yok.</div>'}
    ${days.map(([d, ss]) => {
      const byEx = new Map();
      for (const s of ss) (byEx.get(s.exId) || byEx.set(s.exId, []).get(s.exId)).push(s);
      const regions = [...new Set([...byEx.keys()].map(id => getEx(id)?.region).filter(Boolean))];
      const vol = ss.reduce((a, s) => a + (getEx(s.exId)?.type === 'weight' ? s.w * s.r : 0), 0);
      return `<details class="card day"><summary class="row">
          <div class="grow"><div style="font-weight:650">${esc(fmtDay(d, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }))}</div>
          <div class="muted small">${byEx.size} hareket · ${ss.length} set${vol ? ' · ' + fmtN(Math.round(vol)) + ' kg' : ''}</div></div>
          <div class="row" style="gap:4px">${regions.map(r => `<span class="dot" style="background:${REGION_BY_ID[r].color}"></span>`).join('')}</div>
        </summary>
        <div class="day-body">${[...byEx.entries()].map(([id, list]) => {
          const ex = getEx(id);
          return `<a class="day-ex" style="display:block;color:inherit;text-decoration:none" href="#/ex/${encodeURIComponent(id)}">
            <div style="font-weight:600">${esc(ex?.name || 'Silinmiş hareket')}</div>
            <div class="set-chips" style="margin-top:4px">${list.map(s => `<span class="set-chip">${esc(fmtSet(ex, s))}</span>`).join('')}</div></a>`;
        }).join('')}</div></details>`;
    }).join('')}`;
}

// ───────────────────────── Ayarlar
function renderSettings() {
  setHeader('Ayarlar');
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const opt = (vals, cur, fmt) => vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${fmt(v)}</option>`).join('');
  view.innerHTML = `
    <div class="list">
      <div class="setting"><span>Dinlenme süresi</span>
        <select id="s-rest">${opt([0, 45, 60, 90, 120, 150, 180, 240], db.settings.rest, v => (v ? `${Math.floor(v / 60)}:${pad2(v % 60)}` : 'Kapalı'))}</select></div>
      <div class="setting"><span>Ağırlık artış adımı</span>
        <select id="s-step">${opt([0.5, 1, 1.25, 2, 2.5, 5], db.settings.step, v => fmtN(v) + ' kg')}</select></div>
    </div>

    <div class="section-title">Yedekleme</div>
    <div class="card">
      <div class="muted small" style="margin-bottom:12px">Veriler yalnızca bu telefonda saklanır. Arada bir yedek alıp iCloud Drive'a kaydetmen önerilir.</div>
      <button class="btn secondary" id="b-export">Yedek al (.json)</button>
      <button class="btn secondary" id="b-import">Yedeği geri yükle</button>
      <input type="file" id="f-import" accept="application/json,.json" hidden>
    </div>

    ${standalone ? '' : `<div class="section-title">Ana ekrana ekle</div>
    <div class="card small">Safari'de alttaki <b>Paylaş</b> düğmesine dokun → <b>Ana Ekrana Ekle</b>. Uygulama tam ekran ve çevrimdışı çalışır.</div>`}

    <div class="section-title">Tehlikeli bölge</div>
    <button class="btn danger" id="b-reset">Tüm verileri sil</button>
    <div class="muted small" style="text-align:center;margin-top:18px">${db.sets.length} set · ${db.custom.length} özel hareket</div>`;

  $('#s-rest').addEventListener('change', e => { db.settings.rest = +e.target.value; save(); });
  $('#s-step').addEventListener('change', e => { db.settings.step = +e.target.value; save(); });
  $('#b-export').addEventListener('click', exportData);
  $('#b-import').addEventListener('click', () => $('#f-import').click());
  $('#f-import').addEventListener('change', e => importData(e.target.files[0]));
  $('#b-reset').addEventListener('click', () => {
    if (!confirm('Tüm set kayıtları ve özel hareketler silinecek. Emin misin?')) return;
    if (!confirm('Bu işlem geri alınamaz. Son kez onaylıyor musun?')) return;
    db = { sets: [], custom: [], settings: db.settings };
    save(); toast('Veriler silindi'); renderSettings();
  });
}

async function exportData() {
  const json = JSON.stringify({ app: 'gymtakip', version: 1, exported: new Date().toISOString(), ...db }, null, 1);
  const name = `gym-yedek-${dayKey()}.json`;
  const file = new File([json], name, { type: 'application/json' });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: name }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
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
      db = { sets: valid, custom: Array.isArray(d.custom) ? d.custom : [], settings: { ...DEFAULT_SETTINGS, ...d.settings } };
      save(); toast('✓ Yedek yüklendi'); renderSettings();
    } catch { toast('Geçersiz yedek dosyası'); }
  };
  reader.readAsText(file);
}

// ───────────────────────── Dinlenme sayacı
let restEnd = 0, restTimer = null, audioCtx = null;
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
  restEnd = Date.now() + sec * 1000;
  restEl.hidden = false; restEl.classList.remove('done');
  clearInterval(restTimer);
  restTimer = setInterval(tickRest, 250);
  tickRest();
}
function stopRest() { clearInterval(restTimer); restEl.hidden = true; }
function tickRest() {
  const left = Math.ceil((restEnd - Date.now()) / 1000);
  if (left <= 0) {
    if (!restEl.classList.contains('done')) {
      restEl.classList.add('done'); beep();
      $('#rest-time').textContent = 'Hazır! 💪';
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
  tickRest();
});

// ───────────────────────── Başlat
if (!location.hash) history.replaceState(null, '', '#/today');
route();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
