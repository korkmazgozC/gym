// Beslenme: yiyecek değerleri ve günlük örnek menü oluşturucu.
// Değerler yaklaşık ortalamalardır (USDA / TürKomp benzeri kaynaklardaki tipik değerler); diyetisyen planı yerine geçmez.

// unit: gösterim birimi, per: değerlerin kaç birim için olduğu, step: yuvarlama adımı, fixed: porsiyonu ölçeklenmez (sebze vb.)
export const FOODS = {
  egg: { n: 'yumurta', t: 'Yumurta', unit: 'adet', per: 1, kcal: 72, p: 6.3, c: 0.4, f: 4.8, step: 1, prot: true, max: 4, cat: 'egg', alt: ['lor', 'cheese', 'greek'] },
  oats: { n: 'yulaf ezmesi', unit: 'g', per: 100, kcal: 379, p: 13.2, c: 67.7, f: 6.5, step: 10, alt: ['bread'] },
  milk: { n: 'süt (yarım yağlı)', unit: 'ml', per: 100, kcal: 50, p: 3.4, c: 4.8, f: 1.8, step: 50, cat: 'dairy', alt: ['yogurt', 'greek'] },
  yogurt: { n: 'yoğurt', t: 'Yoğurt', unit: 'g', per: 100, kcal: 61, p: 3.5, c: 4.7, f: 3.3, step: 50, cat: 'dairy', alt: ['greek'] },
  greek: { n: 'süzme yoğurt (light)', t: 'Süzme yoğurt', unit: 'g', per: 100, kcal: 60, p: 10, c: 3.6, f: 0.5, step: 50, prot: true, cat: 'dairy', alt: ['yogurt', 'lor'] },
  cheese: { n: 'beyaz peynir', t: 'Peynir', unit: 'g', per: 100, kcal: 260, p: 17, c: 2, f: 20, step: 10, prot: true, max: 80, cat: 'dairy', alt: ['lor', 'olive'] },
  lor: { n: 'lor peyniri', t: 'Lor peyniri', unit: 'g', per: 100, kcal: 100, p: 13, c: 3, f: 4, step: 25, prot: true, cat: 'dairy', alt: ['cheese', 'greek'] },
  bread: { n: 'tam buğday ekmeği', unit: 'dilim', per: 1, kcal: 75, p: 3.8, c: 13, f: 1, step: 1, max: 4 },
  olive: { n: 'zeytin', unit: 'g', per: 100, kcal: 145, p: 1, c: 4, f: 15, step: 10, max: 50 },
  mveg: { n: 'domates ve biber', unit: 'g', per: 100, kcal: 20, p: 0.9, c: 4, f: 0.2, step: 50, fixed: true, alt: ['veg'] },
  veg: { n: 'domates, salatalık, yeşillik', unit: 'g', per: 100, kcal: 18, p: 0.9, c: 3.5, f: 0.2, step: 50, fixed: true, alt: ['cookedveg'] },
  banana: { n: 'muz', t: 'Muz', unit: 'adet', per: 1, kcal: 105, p: 1.3, c: 27, f: 0.4, step: 1, fixed: true, alt: ['apple'] },
  apple: { n: 'elma', t: 'Elma', unit: 'adet', per: 1, kcal: 95, p: 0.5, c: 25, f: 0.3, step: 1, fixed: true, alt: ['banana'] },
  pb: { n: 'fıstık ezmesi', t: 'Fıstık ezmesi', unit: 'yemek kaşığı', per: 1, kcal: 94, p: 4, c: 3, f: 8, step: 0.5, max: 2, alt: ['walnut'] },
  walnut: { n: 'ceviz içi', t: 'Ceviz', unit: 'g', per: 100, kcal: 654, p: 15, c: 14, f: 65, step: 5, max: 30, alt: ['pb'] },
  honey: { n: 'bal', unit: 'tatlı kaşığı', per: 1, kcal: 30, p: 0, c: 8, f: 0, step: 1, fixed: true },
  chicken: { n: 'tavuk göğsü (ızgara)', t: 'Tavuk', unit: 'g', per: 100, kcal: 165, p: 31, c: 0, f: 3.6, step: 10, prot: true, cat: 'meat', alt: ['tuna', 'beef', 'tofu', 'greenlentil'] },
  beef: { n: 'az yağlı köfte / kıyma', t: 'Köfte', unit: 'g', per: 100, kcal: 217, p: 26, c: 0, f: 12, step: 10, prot: true, cat: 'meat', alt: ['chicken', 'tuna', 'greenlentil', 'bean'] },
  tuna: { n: 'ton balığı (suda, süzülmüş)', t: 'Ton balığı', unit: 'g', per: 100, kcal: 116, p: 26, c: 0, f: 1, step: 10, prot: true, cat: 'fish', alt: ['chicken', 'salmon', 'egg', 'chickpea'] },
  salmon: { n: 'somon (fırın)', t: 'Somon', unit: 'g', per: 100, kcal: 206, p: 22, c: 0, f: 12, step: 10, prot: true, cat: 'fish', alt: ['tuna', 'chicken', 'tofu', 'egg'] },
  rice: { n: 'pirinç pilavı', t: 'Pilav', unit: 'g', per: 100, kcal: 150, p: 2.7, c: 28, f: 3, step: 10, alt: ['bulgur', 'pasta', 'potato'] },
  bulgur: { n: 'bulgur pilavı', t: 'Bulgur', unit: 'g', per: 100, kcal: 120, p: 3.1, c: 19, f: 3.5, step: 10, alt: ['rice', 'pasta', 'potato'] },
  pasta: { n: 'tam buğday makarna (pişmiş)', t: 'Makarna', unit: 'g', per: 100, kcal: 124, p: 5.3, c: 26.5, f: 0.5, step: 10, alt: ['bulgur', 'rice', 'potato'] },
  chickpea: { n: 'nohut yemeği', t: 'Nohut', unit: 'g', per: 100, kcal: 140, p: 7, c: 19, f: 4, step: 25, alt: ['bean', 'greenlentil'] },
  lentil: { n: 'mercimek çorbası', unit: 'kase', per: 1, kcal: 150, p: 8, c: 22, f: 4, step: 0.5, max: 1.5 },
  potato: { n: 'fırın patates', t: 'Patates', unit: 'g', per: 100, kcal: 93, p: 2.5, c: 21, f: 0.1, step: 25, alt: ['rice', 'bulgur'] },
  cookedveg: { n: 'fırın/sote sebze', unit: 'g', per: 100, kcal: 45, p: 2, c: 7, f: 1.5, step: 50, fixed: true, alt: ['veg'] },
  oil: { n: 'zeytinyağı', unit: 'yemek kaşığı', per: 1, kcal: 88, p: 0, c: 0, f: 10, step: 0.5, fixed: true },
  bean: { n: 'kuru fasulye yemeği', t: 'Kuru fasulye', unit: 'g', per: 100, kcal: 130, p: 7.5, c: 18, f: 3.5, step: 25, prot: true, max: 350, alt: ['chickpea', 'greenlentil'] },
  greenlentil: { n: 'yeşil mercimek (haşlanmış)', t: 'Mercimek', unit: 'g', per: 100, kcal: 116, p: 9, c: 20, f: 0.4, step: 25, prot: true, max: 350, alt: ['chickpea', 'bean'] },
  tofu: { n: 'tofu', t: 'Tofu', unit: 'g', per: 100, kcal: 144, p: 15.6, c: 3, f: 8.7, step: 25, prot: true, max: 250, alt: ['egg', 'lor', 'greenlentil'] },
  whey: { n: 'whey protein', unit: 'ölçek', per: 1, kcal: 120, p: 24, c: 3, f: 1.5, step: 1, prot: true, max: 2, cat: 'dairy', alt: ['greek', 'lor'] },
};

export const MEALS = [
  { id: 'breakfast', name: 'Kahvaltı', time: '07:00–09:00', share: 0.25, options: [
    { n: 'Türk kahvaltısı', items: [['egg', 2], ['cheese', 40], ['bread', 2], ['veg', 150], ['olive', 30]] },
    { n: 'Yulaf kasesi', items: [['oats', 60], ['milk', 250], ['banana', 1], ['walnut', 15]] },
    { n: 'Menemen', items: [['egg', 3], ['mveg', 200], ['oil', 0.5], ['bread', 1], ['cheese', 30]] },
    { n: 'Protein kasesi', items: [['greek', 200], ['oats', 40], ['apple', 1], ['pb', 1]] },
  ] },
  { id: 'lunch', name: 'Öğle yemeği', time: '12:00–14:00', share: 0.32, options: [
    { n: 'Tavuk & bulgur pilavı', items: [['chicken', 150], ['bulgur', 150], ['veg', 150], ['yogurt', 100]] },
    { n: 'Köfte & makarna', items: [['beef', 120], ['pasta', 150], ['veg', 150]] },
    { n: 'Mercimek çorbası & tavuk', items: [['lentil', 1], ['chicken', 100], ['bulgur', 100], ['veg', 150]] },
    { n: 'Ton balıklı nohut salatası', items: [['tuna', 120], ['chickpea', 100], ['veg', 200], ['oil', 1], ['bread', 1]] },
    { n: 'Kuru fasulye & pilav', items: [['bean', 250], ['rice', 120], ['veg', 150], ['yogurt', 100]] },
  ] },
  { id: 'snack', name: 'Ara öğün', time: '16:00–17:00', share: 0.13, options: [
    { n: 'Yoğurt & ceviz', items: [['greek', 150], ['walnut', 15], ['honey', 1]] },
    { n: 'Muz & fıstık ezmesi', items: [['banana', 1], ['pb', 1], ['milk', 200]] },
    { n: 'Protein shake', items: [['whey', 1], ['milk', 250], ['apple', 1]] },
    { n: 'Lor peyniri & ekmek', items: [['lor', 100], ['bread', 1], ['veg', 100]] },
  ] },
  { id: 'dinner', name: 'Akşam yemeği', time: '19:00–20:30', share: 0.30, options: [
    { n: 'Somon & fırın patates', items: [['salmon', 150], ['potato', 200], ['cookedveg', 150]] },
    { n: 'Tavuk sote & pilav', items: [['chicken', 150], ['rice', 150], ['cookedveg', 150], ['oil', 0.5]] },
    { n: 'Köfte & bulgur pilavı', items: [['beef', 130], ['bulgur', 150], ['veg', 150], ['yogurt', 100]] },
    { n: 'Nohut yemeği & pilav', items: [['chickpea', 250], ['rice', 100], ['yogurt', 150], ['veg', 150]] },
    { n: 'Yeşil mercimek salatası & yumurta', items: [['greenlentil', 200], ['egg', 2], ['veg', 200], ['oil', 1], ['bread', 1]] },
  ] },
];

const round = (v, step) => Math.max(step, Math.round(v / step) * step);
const macros = (key, amt) => {
  const f = FOODS[key], k = amt / f.per;
  return { kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k };
};
const sum = list => list.reduce((a, x) => ({ kcal: a.kcal + x.kcal, p: a.p + x.p, c: a.c + x.c, f: a.f + x.f }), { kcal: 0, p: 0, c: 0, f: 0 });
const fmtAmt = (amt, unit) => {
  const n = (Math.round(amt * 10) / 10).toLocaleString('tr-TR');
  return unit === 'g' || unit === 'ml' ? `${n} ${unit}` : `${n} ${unit}`;
};

// Şablonu öğünün kalori ve protein hedefine göre ölçekler:
// protein kaynakları (pf) ve diğer kalemler (cf) ayrı katsayıyla büyür/küçülür; sebze, meyve gibi sabit kalemler değişmez.
function scaleOption(opt, kcalT, protT) {
  const base = opt.items.map(([k, a]) => ({ k, a, m: macros(k, a), food: FOODS[k] }));
  const fixed = sum(base.filter(x => x.food.fixed).map(x => x.m));
  const pr = sum(base.filter(x => !x.food.fixed && x.food.prot).map(x => x.m));
  const ot = sum(base.filter(x => !x.food.fixed && !x.food.prot).map(x => x.m));
  const K = kcalT - fixed.kcal, Pt = protT - fixed.p;
  let pf, cf;
  const det = pr.p * ot.kcal - ot.p * pr.kcal;
  if (pr.kcal && ot.kcal && Math.abs(det) > 1e-6) {
    pf = (Pt * ot.kcal - ot.p * K) / det;
    pf = Math.min(1.4, Math.max(0.8, pf));
    cf = Math.min(2.0, Math.max(0.6, (K - pf * pr.kcal) / ot.kcal));
    const got = pf * pr.kcal + cf * ot.kcal;
    if (Math.abs(got - K) > K * 0.05) { const g = Math.min(1.5, Math.max(0.7, K / got)); pf *= g; cf *= g; }
  } else {
    pf = cf = Math.min(2.2, Math.max(0.5, K / (pr.kcal + ot.kcal)));
  }
  return base.map(({ k, a, food }) => ({ k, amt: food.fixed ? a : Math.min(food.max ?? Infinity, round(a * (food.prot ? pf : cf), food.step)) }));
}
function describe(items) {
  const rows = items.map(({ k, amt }) => ({ k, amt, text: `${fmtAmt(amt, FOODS[k].unit)} ${FOODS[k].n}`, ...macros(k, amt) }));
  return { rows, ...sum(rows) };
}

// Beslenme tercihleri: diet 'omni' (her şey) | 'pesco' (et yok, balık var) | 'veg' (et ve balık yok), avoid: yenmeyen yiyecekler
export const DIETS = [['omni', 'Her şey'], ['pesco', 'Et yok, balık var'], ['veg', 'Vejetaryen']];
const BANNED = { omni: [], pesco: ['meat'], veg: ['meat', 'fish'] };
export function allowedFn(prefs = {}) {
  const banned = BANNED[prefs.diet] || [], avoid = new Set(prefs.avoid || []);
  return k => !avoid.has(k) && !banned.includes(FOODS[k].cat);
}

// Şablondaki uygun olmayan kalemleri alternatifleriyle değiştirir (protein kaynağında protein, diğerlerinde kalori eşitlenir).
// Alternatifi yoksa kalem çıkarılır; kalan kalemler zaten öğün hedefine göre yeniden ölçeklenir.
function retitle(name, from, to) {
  const re = new RegExp(from + '\\S*', 'i');
  if (!re.test(name)) return name;
  if (to) return name.replace(re, m => (m[0] === m[0].toUpperCase() ? to : to.toLocaleLowerCase('tr-TR')));
  const out = name.split(' & ').filter(p => !re.test(p)).join(' & ') || name;
  return out[0].toLocaleUpperCase('tr-TR') + out.slice(1);
}
function adapt(opt, ok) {
  const items = [], swaps = [];
  let cost = 0, name = opt.n;
  for (const [k, a] of opt.items) {
    if (ok(k)) { items.push([k, a]); continue; }
    const f = FOODS[k], alt = (f.alt || []).find(x => ok(x) && !opt.items.some(([y]) => y === x));
    if (alt) {
      const g = FOODS[alt], by = f.prot && g.p ? 'p' : 'kcal';
      const amt = Math.min(g.max ?? Infinity, round((f[by] * a / f.per) / g[by] * g.per, g.step));
      items.push([alt, amt]); swaps.push([f.n, g.n]); cost += 1;
      if (f.t && g.t) name = retitle(name, f.t, g.t);
    } else { swaps.push([f.n, null]); cost += f.fixed ? 1 : 3; if (f.t) name = retitle(name, f.t, ''); }
  }
  if (!items.some(([k]) => !FOODS[k].fixed)) return null;
  return { n: name, items, swaps, cost };
}
function mealPool(meal, ok) {
  const all = meal.options.map(o => adapt(o, ok)).filter(Boolean).sort((a, b) => a.cost - b.cost);
  const clean = all.filter(o => !o.cost);
  return clean.length >= 2 ? clean : all.slice(0, Math.max(2, clean.length));
}

// Günün menüsü. picks: { öğünId: seçenekIndex } (verilmezse güne göre döner)
export function buildDayMenu(kcalTarget, proteinTarget, picks = {}, daySeed = 0, prefs = {}) {
  const ok = allowedFn(prefs);
  const meals = MEALS.map((m, i) => {
    const pool = mealPool(m, ok);
    if (!pool.length) return null;
    const idx = (picks[m.id] ?? daySeed + i) % pool.length;
    const opt = pool[idx];
    return { id: m.id, name: m.name, time: m.time, optIndex: idx, n: pool.length, optName: opt.n, swaps: opt.swaps,
      base: opt.items.length, items: scaleOption(opt, kcalTarget * m.share, proteinTarget * m.share) };
  }).filter(Boolean);
  // Protein hedefinin gerisinde kalınırsa ara öğüne protein ekle
  let total = sum(meals.map(m => describe(m.items)));
  const gap = proteinTarget * 0.92 - total.p;
  const snack = meals.find(m => m.id === 'snack');
  if (gap > 6 && snack) {
    const k = ['whey', 'greek', 'lor', 'tofu'].find(x => ok(x) && (x !== 'whey' || gap > 20) && !snack.items.some(i => i.k === x));
    if (k) {
      const f = FOODS[k];
      snack.items.push({ k, amt: Math.min(f.max ?? 3 * f.per, Math.max(f.step, round((gap / f.p) * f.per, f.step))) });
      snack.boost = true;
    }
  }
  const out = meals.map(m => ({ ...m, ...describe(m.items) }));
  total = sum(out);
  return { meals: out, total };
}
