// Beslenme: yiyecek değerleri ve günlük örnek menü oluşturucu.
// Değerler yaklaşık ortalamalardır (USDA / TürKomp benzeri kaynaklardaki tipik değerler); diyetisyen planı yerine geçmez.

// unit: gösterim birimi, per: değerlerin kaç birim için olduğu, step: yuvarlama adımı, fixed: porsiyonu ölçeklenmez (sebze vb.)
export const FOODS = {
  egg: { n: 'yumurta', unit: 'adet', per: 1, kcal: 72, p: 6.3, c: 0.4, f: 4.8, step: 1, prot: true, max: 4 },
  oats: { n: 'yulaf ezmesi', unit: 'g', per: 100, kcal: 379, p: 13.2, c: 67.7, f: 6.5, step: 10 },
  milk: { n: 'süt (yarım yağlı)', unit: 'ml', per: 100, kcal: 50, p: 3.4, c: 4.8, f: 1.8, step: 50 },
  yogurt: { n: 'yoğurt', unit: 'g', per: 100, kcal: 61, p: 3.5, c: 4.7, f: 3.3, step: 50 },
  greek: { n: 'süzme yoğurt (light)', unit: 'g', per: 100, kcal: 60, p: 10, c: 3.6, f: 0.5, step: 50, prot: true },
  cheese: { n: 'beyaz peynir', unit: 'g', per: 100, kcal: 260, p: 17, c: 2, f: 20, step: 10, prot: true, max: 80 },
  lor: { n: 'lor peyniri', unit: 'g', per: 100, kcal: 100, p: 13, c: 3, f: 4, step: 25, prot: true },
  bread: { n: 'tam buğday ekmeği', unit: 'dilim', per: 1, kcal: 75, p: 3.8, c: 13, f: 1, step: 1, max: 4 },
  olive: { n: 'zeytin', unit: 'g', per: 100, kcal: 145, p: 1, c: 4, f: 15, step: 10, max: 50 },
  mveg: { n: 'domates ve biber', unit: 'g', per: 100, kcal: 20, p: 0.9, c: 4, f: 0.2, step: 50, fixed: true },
  veg: { n: 'domates, salatalık, yeşillik', unit: 'g', per: 100, kcal: 18, p: 0.9, c: 3.5, f: 0.2, step: 50, fixed: true },
  banana: { n: 'muz', unit: 'adet', per: 1, kcal: 105, p: 1.3, c: 27, f: 0.4, step: 1, fixed: true },
  apple: { n: 'elma', unit: 'adet', per: 1, kcal: 95, p: 0.5, c: 25, f: 0.3, step: 1, fixed: true },
  pb: { n: 'fıstık ezmesi', unit: 'yemek kaşığı', per: 1, kcal: 94, p: 4, c: 3, f: 8, step: 0.5, max: 2 },
  walnut: { n: 'ceviz içi', unit: 'g', per: 100, kcal: 654, p: 15, c: 14, f: 65, step: 5, max: 30 },
  honey: { n: 'bal', unit: 'tatlı kaşığı', per: 1, kcal: 30, p: 0, c: 8, f: 0, step: 1, fixed: true },
  chicken: { n: 'tavuk göğsü (ızgara)', unit: 'g', per: 100, kcal: 165, p: 31, c: 0, f: 3.6, step: 10, prot: true },
  beef: { n: 'az yağlı köfte / kıyma', unit: 'g', per: 100, kcal: 217, p: 26, c: 0, f: 12, step: 10, prot: true },
  tuna: { n: 'ton balığı (suda, süzülmüş)', unit: 'g', per: 100, kcal: 116, p: 26, c: 0, f: 1, step: 10, prot: true },
  salmon: { n: 'somon (fırın)', unit: 'g', per: 100, kcal: 206, p: 22, c: 0, f: 12, step: 10, prot: true },
  rice: { n: 'pirinç pilavı', unit: 'g', per: 100, kcal: 150, p: 2.7, c: 28, f: 3, step: 10 },
  bulgur: { n: 'bulgur pilavı', unit: 'g', per: 100, kcal: 120, p: 3.1, c: 19, f: 3.5, step: 10 },
  pasta: { n: 'tam buğday makarna (pişmiş)', unit: 'g', per: 100, kcal: 124, p: 5.3, c: 26.5, f: 0.5, step: 10 },
  chickpea: { n: 'nohut yemeği', unit: 'g', per: 100, kcal: 140, p: 7, c: 19, f: 4, step: 25 },
  lentil: { n: 'mercimek çorbası', unit: 'kase', per: 1, kcal: 150, p: 8, c: 22, f: 4, step: 0.5, max: 1.5 },
  potato: { n: 'fırın patates', unit: 'g', per: 100, kcal: 93, p: 2.5, c: 21, f: 0.1, step: 25 },
  cookedveg: { n: 'fırın/sote sebze', unit: 'g', per: 100, kcal: 45, p: 2, c: 7, f: 1.5, step: 50, fixed: true },
  oil: { n: 'zeytinyağı', unit: 'yemek kaşığı', per: 1, kcal: 88, p: 0, c: 0, f: 10, step: 0.5, fixed: true },
  whey: { n: 'whey protein', unit: 'ölçek', per: 1, kcal: 120, p: 24, c: 3, f: 1.5, step: 1, prot: true, max: 2 },
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

// Günün menüsü. picks: { öğünId: seçenekIndex } (verilmezse güne göre döner)
export function buildDayMenu(kcalTarget, proteinTarget, picks = {}, daySeed = 0) {
  const meals = MEALS.map((m, i) => {
    const idx = picks[m.id] ?? (daySeed + i) % m.options.length;
    const opt = m.options[idx % m.options.length];
    return { id: m.id, name: m.name, time: m.time, optIndex: idx % m.options.length, optName: opt.n, items: scaleOption(opt, kcalTarget * m.share, proteinTarget * m.share) };
  });
  // Protein hedefinin gerisinde kalınırsa ara öğüne protein ekle
  let total = sum(meals.map(m => describe(m.items)));
  const gap = proteinTarget * 0.92 - total.p;
  if (gap > 6) {
    const snack = meals.find(m => m.id === 'snack');
    if (gap > 20) snack.items.push({ k: 'whey', amt: Math.min(2, Math.ceil(gap / 24)) });
    else snack.items.push({ k: 'greek', amt: round((gap / 10) * 100, 50) });
    snack.boost = true;
  }
  const out = meals.map(m => ({ ...m, ...describe(m.items) }));
  total = sum(out);
  return { meals: out, total };
}
