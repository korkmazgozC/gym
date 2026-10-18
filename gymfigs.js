// Gym hareketlerinin 3D pozları (figure3d.js ile oynatılır; açı kuralları figure.js ile aynı).
// Açılar: 0 ileri, 90 aşağı, 180 geri, -90 yukarı. Sırtüstü/yüzüstü pozlarda baş 180 (geri) yönündedir.
// uas/fas: kolun yana açılması, ths: bacağın yana açılması, ts: gövdenin yana eğilmesi, shrug: omuz silkme,
// wr: bilek, lift/dz: zıplama ve ileri kayma (m). Hareket alanları: eq (ekipman), bench, seat, lying, hang, bars,
// cable {y, z, x, split}, box, footplate, roller, pin.

// Temel duruşlar
const ST = { t: -90, ua: 90, fa: 90, th: 90, sh: 90 };                 // ayakta
const SQ = { t: -58, th: 8, sh: 118 };                                  // squat dibi
const HG = { t: -18, th: 98, sh: 84 };                                  // kalçadan eğilme (dizler hafif bükük)
const SB = { t: 180, th: 12, sh: 96 };                                  // düz sehpada sırtüstü (ayaklar yerde)
const SI = { t: 214, th: 2, sh: 96 };                                   // eğimli sehpada
const SD = { t: 164, th: -28, sh: 62 };                                 // aşağı eğimli sehpada (ayaklar takılı)
const SE = { t: -90, th: 0, sh: 92 };                                   // oturarak (dik)
const SR = { t: -100, th: 0, sh: 92 };                                  // oturarak, sırt yaslı
const SUP = { t: 180, th: -55, sh: 65, ft: -10 };                       // yerde sırtüstü, dizler bükük
const PR = { t: 198, plank: 'hands', face: -1, ua: 90, fa: 90, wr: 182, uas: 10, th: 20, sh: 20, ft: 142 }; // şınav duruşu

const G = 'gym';
const F = (o, ...poses) => ({ prop: G, dur: 1.7, ...o, poses });
const flat = { bench: { back: true }, seat: 0.45, lying: true };
const incl = { bench: { back: true, seat: true }, seat: 0.5 };
const decl = { bench: { back: true, long: 0.45 }, seat: 0.5, lying: true };
const seatBack = { bench: { back: true, seat: true }, seat: 0.48 };
const seatOnly = { bench: { seat: true }, seat: 0.48 };

// Kalıplar
const press = (base, o, a, b) => F(o, { ...base, ...a }, { ...base, ...b });
const benchPress = (eq, base = SB, o = flat, wide = 55) => press(base, { eq, ...o }, { ua: -90, fa: -90, uas: 10, hl: ['chest'] }, { ua: 74, uas: wide, fa: -86, hl: ['chest'] });
const fly = (base, o) => press(base, { eq: 'dumbbell', ...o }, { ua: -90, fa: -88, uas: 10, fas: 6, hl: ['chest'] }, { ua: -90, uas: 80, fa: -90, fas: 64, hl: ['chest'] });
const curl = (eq, o = {}, base = ST) => F({ eq, dur: 1.5, ...o }, { ...base, ua: 92, fa: 92, uas: 6, hl: ['biceps'] }, { ...base, ua: 96, fa: -72, uas: 6, hl: ['biceps'] });
const squat = (eq, top, bottom, o = {}) => F({ eq, ...o }, { ...ST, ...top, hl: ['quads', 'glutes'] }, { ...ST, ...SQ, ...top, ...bottom, hl: ['quads', 'glutes'] });
const backBar = { ua: 150, uas: 58, fa: -72, fas: 30 };                 // halter sırtta
const frontBar = { ua: 4, uas: 20, fa: 205, fas: 10 };                  // halter önde omuzlarda
const calf = (eq, o = {}, arms = {}) => F({ eq, dur: 1.2, ...o }, { ...ST, ...arms, ft: 0, hl: ['calves'] }, { ...ST, ...arms, ft: 42, hl: ['calves'] });
const row = (eq, o = {}, base = HG) => F({ eq, ...o }, { ...ST, ...base, ua: 90, fa: 90, uas: 8, hl: ['lats'] }, { ...ST, ...base, ua: 198, uas: 14, fa: 100, hl: ['lats'] });
const pulldown = (eq, w, o = {}) => F({ eq, ...seatOnly, roller: 'thigh', cable: { y: 2.25, z: 0.08, tz: 0.55 }, ...o },
  { ...SE, t: -94, ua: -90, uas: w, fa: -90, fas: w, hl: ['lats'] }, { ...SE, t: -102, ua: 92, uas: 62, fa: -82, fas: 14, hl: ['lats'] });
const pushup = (o = {}, a = {}, b = {}) => F({ dur: 1.4, hang: true, ...o }, { ...PR, ...a, hl: ['chest'] }, { ...PR, t: 186, ua: -18, uas: 42, fa: 96, th: 6, sh: 6, ...b, hl: ['chest'] });
const shrug = (eq, o = {}, arms = {}) => F({ eq, dur: 1.1, ...o }, { ...ST, ...arms, shrug: 0, hl: ['traps'] }, { ...ST, ...arms, shrug: 26, hl: ['traps'] });
const ohPress = (eq, base, o = {}) => F({ eq, ...o }, { ...base, ua: 62, uas: 40, fa: -98, fas: 8, hl: ['delts'] }, { ...base, ua: -90, uas: 14, fa: -90, fas: 8, hl: ['delts'] });
const raise = (eq, side, o = {}, base = ST) => F({ eq, dur: 1.5, ...o }, { ...base, ua: 92, fa: 92, uas: side ? 10 : 6, fas: side ? 10 : 6, hl: ['delts'] },
  side ? { ...base, ua: 92, uas: 84, fa: 92, fas: 80, hl: ['delts'] } : { ...base, ua: 2, fa: 2, uas: 6, fas: 6, hl: ['delts'] });
const lunge = (eq, o = {}) => F({ eq, ...o }, { ...ST, th2: 90, sh2: 90, ft2: 0, hl: ['quads', 'glutes'] },
  { ...ST, t: -88, th: 6, sh: 92, th2: 116, sh2: 176, ft2: 112, hl: ['quads', 'glutes'] });
const hinge = (eq, o = {}, b = {}, arms = {}) => F({ eq, ...o }, { ...ST, ...arms, hl: ['hams', 'glutes'] }, { ...ST, t: -12, th: 100, sh: 90, ...arms, ...b, hl: ['hams', 'glutes'] });
const pushdown = (eq, o = {}, b = {}) => F({ eq, cable: { y: 1.95, z: 0.34 }, dur: 1.4, ...o }, { ...ST, t: -84, ua: 98, uas: 6, fa: -28, fas: 4, hl: ['triceps'] }, { ...ST, t: -84, ua: 98, uas: 6, fa: 96, fas: 4, ...b, hl: ['triceps'] });
const skull = (eq) => F({ eq, ...flat, dur: 1.5 }, { ...SB, ua: -104, fa: -104, uas: 8, hl: ['triceps'] }, { ...SB, ua: -106, fa: 164, uas: 8, hl: ['triceps'] });
const wrist = (eq) => F({ eq, ...seatOnly, dur: 1.1 }, { ...SE, t: -60, ua: 100, fa: 2, wr: 45, uas: 4, hl: ['forearms'] }, { ...SE, t: -60, ua: 100, fa: 2, wr: -35, uas: 4, hl: ['forearms'] });

export const GYM_FIGS = {
  // ── Göğüs
  'bench': benchPress('barbell'),
  'incline-bench': benchPress('barbell', SI, incl, 50),
  'incline-db': benchPress('dumbbell', SI, incl, 58),
  'db-bench': benchPress('dumbbell', SB, flat, 62),
  'decline-bench': benchPress('barbell', SD, decl, 50),
  'decline-db-press': benchPress('dumbbell', SD, decl, 58),
  'close-grip-bench': press(SB, { eq: 'barbell', ...flat }, { ua: -90, fa: -90, uas: 4, hl: ['triceps', 'chest'] }, { ua: 82, uas: 22, fa: -88, fas: 0, hl: ['triceps', 'chest'] }),
  'db-fly': fly(SB, flat),
  'incline-fly': fly(SI, incl),
  'decline-fly': fly(SD, decl),
  'dips': F({ hang: true, bars: 'dip', lift: 0.25, dur: 1.6 }, { ...ST, t: -80, ua: 92, fa: 92, uas: 9, th: 104, sh: 150, hl: ['chest'] }, { ...ST, t: -64, ua: 142, uas: 16, fa: 94, fas: 6, th: 104, sh: 150, hl: ['chest'] }),
  'pushup': pushup(),
  'wide-pushup': pushup({}, { uas: 30 }, { uas: 62 }),
  'close-pushup': pushup({}, { uas: 2 }, { uas: 10 }),
  'incline-pushup': pushup({ box: { auto: 'hands', w: 0.8 } }, { t: 226, plank: false }, { t: 216, plank: false }),
  'decline-pushup': pushup({ box: { auto: 'feet', w: 0.5 } }, { t: 176, th: -4, sh: -4, plank: false }, { t: 166, th: -12, sh: -12, plank: false }),
  'cable-crossover': F({ cable: { y: 1.95, z: -0.15, split: true }, dur: 1.6 }, { ...ST, t: -74, th: 80, th2: 104, ua: 18, uas: 74, fa: 28, fas: 70, hl: ['chest'] }, { ...ST, t: -74, th: 80, th2: 104, ua: 62, uas: 6, fa: 66, fas: 0, hl: ['chest'] }),
  'low-cable-crossover': F({ cable: { y: 0.18, z: -0.1, split: true }, dur: 1.6 }, { ...ST, t: -82, th: 84, th2: 100, ua: 88, uas: 60, fa: 86, fas: 56, hl: ['chest'] }, { ...ST, t: -82, th: 84, th2: 100, ua: -12, uas: 6, fa: -16, fas: 2, hl: ['chest'] }),
  'pec-deck': F({ ...seatBack, dur: 1.6 }, { ...SR, ua: 2, uas: 84, fa: -40, fas: 80, hl: ['chest'] }, { ...SR, ua: 2, uas: 6, fa: -40, fas: 4, hl: ['chest'] }),
  'chest-press': F({ ...seatBack, eq: 'handle', dur: 1.5 }, { ...SR, ua: 150, uas: 48, fa: 2, fas: 0, hl: ['chest'] }, { ...SR, ua: 2, uas: 10, fa: 2, fas: 8, hl: ['chest'] }),
  'machine-bench': F({ ...seatBack, eq: 'handle', dur: 1.5 }, { ...SR, ua: 150, uas: 48, fa: 2, fas: 0, hl: ['chest'] }, { ...SR, ua: 2, uas: 10, fa: 2, fas: 8, hl: ['chest'] }),
  'pullover': F({ eq: 'dbmid', ...flat, dur: 1.8 }, { ...SB, ua: -88, fa: -92, uas: 6, hl: ['chest', 'lats'] }, { ...SB, ua: 188, fa: 198, uas: 6, hl: ['chest', 'lats'] }),

  // ── Sırt
  'pullup': F({ hang: true, bars: 'pullup', lift: 0.12 }, { ...ST, ua: -90, uas: 24, fa: -90, fas: 24, th: 100, sh: 128, hl: ['lats'] }, { ...ST, t: -84, ua: 90, uas: 70, fa: -88, fas: 22, th: 104, sh: 132, hl: ['lats'] }),
  'chinup': F({ hang: true, bars: 'pullup', lift: 0.12 }, { ...ST, ua: -90, uas: 8, fa: -90, fas: 8, th: 100, sh: 128, hl: ['lats', 'biceps'] }, { ...ST, t: -84, ua: 118, uas: 18, fa: -78, fas: 6, th: 104, sh: 132, hl: ['lats', 'biceps'] }),
  'assisted-pullup': F({ hang: true, bars: 'pullup', lift: 0.05 }, { ...ST, ua: -90, uas: 20, fa: -90, fas: 20, th: 90, sh: 178, hl: ['lats'] }, { ...ST, t: -86, ua: 90, uas: 66, fa: -88, fas: 20, th: 90, sh: 178, hl: ['lats'] }),
  'lat-pulldown': pulldown('latbar', 30),
  'close-grip-pulldown': pulldown('handle', 4),
  'vbar-pulldown': pulldown('handle', 4),
  'seated-row': F({ ...seatOnly, seat: 0.42, eq: 'handle', cable: { y: 0.42, z: 1.05 }, box: { z: 0.78, h: 0.32, d: 0.12 } }, { ...SE, t: -78, th: -6, sh: 12, ua: 4, fa: 4, uas: 4, hl: ['lats'] }, { ...SE, t: -96, th: -6, sh: 12, ua: 142, uas: 12, fa: 8, hl: ['lats'] }),
  'one-arm-cable-row': F({ cable: { y: 1.05, z: 0.8 } }, { ...ST, t: -80, th: 80, th2: 102, ua: 4, fa: 4, ua2: 92, fa2: 92, hl: ['lats'] }, { ...ST, t: -86, th: 80, th2: 102, ua: 150, fa: 12, ua2: 92, fa2: 92, hl: ['lats'] }),
  'bb-row': row('barbell'),
  'db-bent-row': row('dumbbell'),
  'tbar-row': row('handle'),
  'db-row': F({ eq: 'dumbbell1', box: { z: 0.62, h: 0.6, d: 0.5 } }, { ...ST, t: -20, th: 82, th2: 112, sh: 92, ua: 90, fa: 90, ua2: 70, fa2: 70, hl: ['lats'] }, { ...ST, t: -20, th: 82, th2: 112, sh: 92, ua: 196, fa: 100, ua2: 70, fa2: 70, hl: ['lats'] }),
  'inverted-row': F({ hang: true, bars: 'pullup' }, { t: 196, ua: -90, fa: -90, uas: 18, th: 16, sh: 16, ft: -60, hl: ['lats'] }, { t: 200, ua: 104, uas: 58, fa: -80, fas: 14, th: 20, sh: 20, ft: -60, hl: ['lats'] }),
  'straight-arm-pd': F({ eq: 'latbar', cable: { y: 2.05, z: 0.62 } }, { ...ST, t: -74, th: 96, ua: -34, fa: -34, uas: 14, hl: ['lats'] }, { ...ST, t: -74, th: 96, ua: 96, fa: 96, uas: 14, hl: ['lats'] }),
  'deadlift': F({ eq: 'barbell', dur: 1.9 }, { ...ST, t: -28, h: -10, th: 36, sh: 112, ua: 88, fa: 88, uas: 8, hl: ['hams', 'glutes', 'back'] }, { ...ST, uas: 8, hl: ['hams', 'glutes', 'back'] }),
  'sumo-dl': F({ eq: 'barbell', dur: 1.9 }, { ...ST, t: -40, th: 30, ths: 32, sh: 100, shs: 14, ua: 90, fa: 90, uas: 2, hl: ['glutes', 'quads'] }, { ...ST, ths: 14, shs: 14, uas: 2, hl: ['glutes', 'quads'] }),
  'rack-pull': F({ eq: 'barbell', dur: 1.6 }, { ...ST, t: -46, th: 74, sh: 100, ua: 90, fa: 90, uas: 8, hl: ['back', 'traps'] }, { ...ST, uas: 8, hl: ['back', 'traps'] }),
  'good-morning': hinge('barbell', {}, { t: -8, th: 96, sh: 92 }, backBar),
  'hyperextension': F({ seat: 0.95, bench: { seat: true }, roller: 'shin', rollerSide: 'back', dur: 1.6 }, { t: 222, face: -1, ua: 150, fa: 40, th: 44, sh: 44, ft: 120, hl: ['back', 'glutes'] }, { t: 126, face: -1, ua: 70, fa: -30, th: 44, sh: 44, ft: 120, hl: ['back', 'glutes'] }),
  'shrug': shrug('dumbbell'),
  'barbell-shrug': shrug('barbell', {}, { uas: 6 }),
  'cable-shrug': shrug('handle', { cable: { y: 0.1, z: 0.35 } }, { uas: 4 }),
  'machine-shrug': shrug('dumbbell'),

  // ── Bacak
  'squat': squat('barbell', backBar, {}),
  'front-squat': squat('barbell', frontBar, { t: -72 }),
  'smith-squat': squat('smith', backBar, { t: -66 }),
  'box-squat': squat('barbell', backBar, { t: -52, th: 4, sh: 100 }, { box: { z: -0.32, h: 0.42 } }),
  'goblet-squat': squat('dbmid', { ua: 68, uas: 12, fa: -108 }, { t: -70 }),
  'bodyweight-squat': F({}, { ...ST, hl: ['quads', 'glutes'] }, { ...ST, ...SQ, ua: 2, fa: 2, hl: ['quads', 'glutes'] }),
  'hack-squat': F({ bench: { back: true, off: 0.15 }, dur: 1.7 }, { ...ST, t: -102, th: 96, sh: 84, ua: 150, uas: 30, fa: -72, hl: ['quads'] }, { ...ST, t: -102, th: 18, sh: 108, ua: 150, uas: 30, fa: -72, hl: ['quads'] }),
  'leg-press': F({ bench: { back: true, seat: true }, seat: 0.42, footplate: true, dur: 1.7 }, { t: 226, ua: 100, fa: 40, th: -82, sh: 14, ft: -70, hl: ['quads', 'glutes'] }, { t: 226, ua: 100, fa: 40, th: -42, sh: -40, ft: -120, hl: ['quads', 'glutes'] }),
  'leg-press-calf': F({ bench: { back: true, seat: true }, seat: 0.42, footplate: true, dur: 1.2 }, { t: 226, ua: 100, fa: 40, th: -42, sh: -40, ft: -130, hl: ['calves'] }, { t: 226, ua: 100, fa: 40, th: -42, sh: -40, ft: -88, hl: ['calves'] }),
  'leg-ext': F({ ...seatBack, roller: 'shin', rollerSide: 'front', dur: 1.4 }, { ...SR, sh: 92, ua: 110, fa: 60, hl: ['quads'] }, { ...SR, sh: 0, ua: 110, fa: 60, hl: ['quads'] }),
  'leg-curl': F({ bench: { back: true, long: 0.2 }, seat: 0.62, lying: true, roller: 'shin', rollerSide: 'back', dur: 1.4 }, { t: 180, face: -1, ua: 118, fa: 160, th: 0, sh: 0, ft: 0, hl: ['hams'] }, { t: 180, face: -1, ua: 118, fa: 160, th: 0, sh: -112, ft: -150, hl: ['hams'] }),
  'seated-leg-curl': F({ ...seatBack, roller: 'shin', rollerSide: 'back', dur: 1.4 }, { ...SR, sh: 2, ua: 110, fa: 60, hl: ['hams'] }, { ...SR, sh: 112, ua: 110, fa: 60, hl: ['hams'] }),
  'standing-leg-curl': F({ roller: 'shin', rollerSide: 'back', dur: 1.3 }, { ...ST, t: -84, ua: 30, fa: 30, th: 94, sh: 94, th2: 90, sh2: 90, hl: ['hams'] }, { ...ST, t: -84, ua: 30, fa: 30, th: 98, sh: 196, th2: 90, sh2: 90, hl: ['hams'] }),
  'lunge': lunge('dumbbell'),
  'walking-lunge': lunge('dumbbell'),
  'rear-lunge': lunge('dumbbell'),
  'bulgarian': F({ eq: 'dumbbell', box: { auto: 'rear', w: 0.4 } }, { ...ST, t: -86, th: 76, sh: 96, th2: 124, sh2: 214, ft2: 120, hl: ['quads', 'glutes'] }, { ...ST, t: -80, th: 10, sh: 100, th2: 150, sh2: 220, ft2: 120, hl: ['quads', 'glutes'] }),
  'step-up': F({ eq: 'dumbbell', box: { z: 0.36, h: 0.42 } }, { ...ST, th: 26, sh: 100, th2: 90, sh2: 90, lift: 0, hl: ['quads', 'glutes'] }, { ...ST, th: 90, sh: 90, th2: 112, sh2: 140, lift: 0.42, hl: ['quads', 'glutes'] }),
  'rdl': hinge('barbell'),
  'sldl-db': hinge('dumbbell', {}, { t: -8, th: 96, sh: 92 }),
  'hip-thrust': F({ eq: 'barbell', pin: { bone: 'spine_03', y: 0.58 }, box: { z: -0.62, h: 0.42, d: 0.35, w: 1.1 }, dur: 1.6 }, { t: 214, ua: 20, fa: 50, th: -34, sh: 96, ft: 0, hl: ['glutes'] }, { t: 182, ua: 14, fa: 40, th: -6, sh: 96, ft: 0, hl: ['glutes'] }),
  'glute-bridge': F({ dur: 1.6 }, { ...SUP, ua: 3, fa: 3, hl: ['glutes'] }, { t: 152, h: 26, ua: 16, fa: 3, th: -8, sh: 88, ft: -6, hl: ['glutes'] }),
  'single-leg-bridge': F({ dur: 1.6 }, { ...SUP, ua: 3, fa: 3, th2: -40, sh2: -40, ft2: -60, hl: ['glutes'] }, { t: 152, h: 26, ua: 16, fa: 3, th: -8, sh: 88, ft: -6, th2: -24, sh2: -24, ft2: -60, hl: ['glutes'] }),
  'glute-kickback': F({ dur: 1.2 }, { kneel: true, t: 195, face: -1, ua: 90, fa: 90, th: 90, sh: 0, ft: 10, th2: 90, sh2: 0, ft2: 10, hl: ['glutes'] }, { kneel: true, t: 195, face: -1, ua: 90, fa: 90, th: 90, sh: 0, ft: 10, th2: -14, sh2: -100, ft2: -150, hl: ['glutes'] }),
  'kb-swing': F({ eq: 'kettlebell', dur: 1.1 }, { ...ST, t: -24, th: 96, sh: 100, ua: 118, fa: 118, uas: 4, hl: ['glutes', 'hams'] }, { ...ST, ua: 2, fa: 2, uas: 4, hl: ['glutes', 'hams'] }),
  'calf-raise': calf('dumbbell'),
  'barbell-calf': calf('barbell', {}, backBar),
  'smith-calf': calf('smith', {}, backBar),
  'machine-calf': calf(null, {}, { ua: 150, uas: 40, fa: -70 }),
  'seated-calf': F({ ...seatOnly, roller: 'thigh', dur: 1.2 }, { ...SE, ua: 60, fa: 60, ft: -20, hl: ['calves'] }, { ...SE, ua: 60, fa: 60, ft: 34, lift: 0.04, hl: ['calves'] }),
  'hip-adduction': F({ ...seatBack, dur: 1.4 }, { ...SR, ths: 38, ua: 110, fa: 60, hl: ['quads'] }, { ...SR, ths: 4, ua: 110, fa: 60, hl: ['quads'] }),
  'hip-abduction': F({ ...seatBack, dur: 1.4 }, { ...SR, ths: 4, ua: 110, fa: 60, hl: ['glutes'] }, { ...SR, ths: 38, ua: 110, fa: 60, hl: ['glutes'] }),
  'box-jump': F({ box: { z: 0.62, h: 0.5 }, dur: 1.1 }, { ...ST, t: -52, th: 18, sh: 116, ua: 160, fa: 160, lift: 0, dz: 0, hl: ['quads', 'glutes'] }, { ...ST, t: -70, th: 40, sh: 110, ua: 20, fa: 20, lift: 0.5, dz: 0.62, hl: ['quads', 'glutes'] }),
  'split-jump': F({ dur: 0.9 }, { ...ST, t: -88, th: 6, sh: 92, th2: 116, sh2: 176, ft2: 112, ua: 60, fa: 20, ua2: 140, fa2: 100, lift: 0, hl: ['quads', 'glutes'] }, { ...ST, th: 70, sh: 100, th2: 110, sh2: 130, ua: 120, fa: 80, ua2: 60, fa2: 20, lift: 0.28, hl: ['quads', 'glutes'] }),
  'lateral-bound': F({ dur: 1 }, { ...ST, t: -70, th: 60, sh: 110, ths: -4, th2: 100, sh2: 150, ths2: 20, ua: 50, fa: 30, lift: 0, hl: ['glutes', 'quads'] }, { ...ST, t: -84, th: 86, sh: 96, ths: 18, th2: 80, sh2: 120, ths2: -6, ua: 120, fa: 80, lift: 0.18, hl: ['glutes', 'quads'] }),
  'lateral-hop': F({ dur: 0.8 }, { ...ST, th2: 100, sh2: 150, ua: 80, fa: 40, ths: 0, lift: 0, hl: ['calves', 'quads'] }, { ...ST, th: 84, ths: 10, th2: 100, sh2: 150, ua: 80, fa: 40, lift: 0.12, hl: ['calves', 'quads'] }),
  'star-jump': F({ dur: 0.9 }, { ...ST, t: -60, th: 30, sh: 112, ua: 110, fa: 110, uas: 6, ths: 4, lift: 0, hl: ['quads', 'glutes'] }, { ...ST, ua: -90, fa: -90, uas: 40, fas: 40, ths: 26, lift: 0.32, hl: ['quads', 'glutes'] }),
  'jump-rope': F({ dur: 0.45 }, { ...ST, ua: 100, uas: 22, fa: 40, fas: 40, ft: 20, lift: 0, hl: ['calves'] }, { ...ST, ua: 100, uas: 22, fa: 60, fas: 40, ft: 40, lift: 0.07, hl: ['calves'] }),
  'carioca': F({ dur: 0.9 }, { ...ST, ths: -14, ths2: 10, th: 80, ua: 90, uas: 40, hl: ['glutes'] }, { ...ST, ths: 14, ths2: -10, th: 100, ua: 90, uas: 40, hl: ['glutes'] }),
  'box-shuffle': F({ box: { z: 0, h: 0.3, d: 0.45 }, dur: 0.8 }, { ...ST, ths: 22, ths2: 8, th2: 90, lift: 0.0, ua: 60, fa: 20, hl: ['calves', 'quads'] }, { ...ST, ths: 8, ths2: 22, lift: 0.1, ua: 60, fa: 20, hl: ['calves', 'quads'] }),
  'mb-scoop-throw': F({ eq: 'ball', dur: 1.1 }, { ...ST, t: -40, th: 40, sh: 112, ua: 104, fa: 104, lift: 0, hl: ['glutes', 'core'] }, { ...ST, t: -100, ua: -64, fa: -64, lift: 0.06, hl: ['glutes', 'core'] }),

  // ── Omuz
  'db-shoulder-press': ohPress('dumbbell', SR, seatBack),
  'machine-shoulder-press': ohPress(null, SR, seatBack),
  'seated-bb-press': ohPress('barbell', SR, seatBack),
  'ohp': F({ eq: 'barbell' }, { ...ST, ua: 58, uas: 28, fa: -102, fas: 6, hl: ['delts'] }, { ...ST, ua: -90, uas: 12, fa: -90, fas: 8, hl: ['delts'] }),
  'push-press': F({ eq: 'barbell', dur: 1.3 }, { ...ST, th: 70, sh: 108, ua: 58, uas: 28, fa: -102, fas: 6, hl: ['delts'] }, { ...ST, ua: -90, uas: 12, fa: -90, fas: 8, hl: ['delts'] }),
  'arnold-press': F({ eq: 'dumbbell', ...seatBack }, { ...SR, ua: 64, uas: 4, fa: -96, fas: 0, hl: ['delts'] }, { ...SR, ua: -90, uas: 16, fa: -90, fas: 10, hl: ['delts'] }),
  'lateral-raise': raise('dumbbell', true),
  'cable-lateral': F({ cable: { y: 0.15, z: 0, x: -0.45 }, dur: 1.5 }, { ...ST, ua: 92, uas: -10, fa: 92, fas: -10, ua2: 50, fa2: 50, hl: ['delts'] }, { ...ST, ua: 92, uas: 82, fa: 92, fas: 78, ua2: 50, fa2: 50, hl: ['delts'] }),
  'front-raise': raise('dumbbell', false),
  'plate-raise': F({ eq: 'plate', dur: 1.5 }, { ...ST, ua: 92, fa: 92, uas: 2, hl: ['delts'] }, { ...ST, ua: -4, fa: -4, uas: 2, hl: ['delts'] }),
  'reverse-fly': raise('dumbbell', true, {}, { ...ST, ...HG }),
  'seated-rear-delt': raise('dumbbell', true, seatOnly, { ...SE, t: -14 }),
  'rear-delt-machine': F({ ...seatOnly, dur: 1.5 }, { ...SE, ua: 0, uas: 6, fa: 0, fas: 6, hl: ['delts'] }, { ...SE, ua: 4, uas: 96, fa: 4, fas: 96, hl: ['delts'] }),
  'cable-rear-delt': F({ cable: { y: 1.6, z: 0.7, split: true, w: 0.7 }, dur: 1.5 }, { ...ST, ua: 0, uas: -8, fa: 0, fas: -8, hl: ['delts'] }, { ...ST, ua: 4, uas: 90, fa: 4, fas: 90, hl: ['delts'] }),
  'face-pull': F({ eq: 'rope', cable: { y: 1.7, z: 0.85 } }, { ...ST, t: -86, ua: -14, fa: -14, uas: 6, hl: ['delts', 'traps'] }, { ...ST, t: -92, ua: 178, uas: 64, fa: -58, fas: 30, hl: ['delts', 'traps'] }),
  'upright-row': F({ eq: 'barbell' }, { ...ST, ua: 92, fa: 92, uas: 6, hl: ['delts', 'traps'] }, { ...ST, ua: 92, uas: 82, fa: 112, fas: -42, hl: ['delts', 'traps'] }),
  'db-upright-row': F({ eq: 'dumbbell' }, { ...ST, ua: 92, fa: 92, uas: 6, hl: ['delts', 'traps'] }, { ...ST, ua: 92, uas: 82, fa: 112, fas: -42, hl: ['delts', 'traps'] }),
  'band-pull-apart': F({ eq: 'band', dur: 1.3 }, { ...ST, ua: 0, fa: 0, uas: 6, fas: 6, hl: ['delts'] }, { ...ST, ua: 2, uas: 88, fa: 2, fas: 88, hl: ['delts'] }),
  'ext-rot-band': F({ eq: 'band', dur: 1.3 }, { ...ST, ua: 92, uas: 4, fa: 2, fas: 2, hl: ['delts'] }, { ...ST, ua: 92, uas: 4, fa: 2, fas: 64, hl: ['delts'] }),
  'ext-rot-cable': F({ cable: { y: 1.05, z: 0, x: -0.6 }, dur: 1.3 }, { ...ST, ua: 92, uas: 4, fa: 2, fas: -30, hl: ['delts'] }, { ...ST, ua: 92, uas: 4, fa: 2, fas: 60, hl: ['delts'] }),
  'int-rot-band': F({ cable: { y: 1.05, z: 0, x: 0.7 }, dur: 1.3 }, { ...ST, ua: 92, uas: 4, fa: 2, fas: 58, hl: ['delts'] }, { ...ST, ua: 92, uas: 4, fa: 2, fas: -28, hl: ['delts'] }),

  // ── Kol
  'biceps-curl': curl('dumbbell'),
  'hammer-curl': curl('dumbbell'),
  'alt-curl': F({ eq: 'dumbbell', dur: 1.4 }, { ...ST, ua: 96, fa: -72, ua2: 92, fa2: 92, uas: 6, hl: ['biceps'] }, { ...ST, ua: 92, fa: 92, ua2: 96, fa2: -72, uas: 6, hl: ['biceps'] }),
  'barbell-curl': curl('barbell'),
  'ez-curl': curl('ez'),
  'reverse-curl': curl('barbell', {}, ST),
  'cable-curl': curl('handle', { cable: { y: 0.15, z: 0.4 } }),
  'cable-hammer': curl('rope', { cable: { y: 0.15, z: 0.4 } }),
  'incline-curl': F({ eq: 'dumbbell', bench: { back: true, seat: true }, seat: 0.5 }, { t: 236, th: 0, sh: 96, ua: 96, fa: 96, uas: 8, hl: ['biceps'] }, { t: 236, th: 0, sh: 96, ua: 96, fa: -46, uas: 8, hl: ['biceps'] }),
  'preacher-curl': F({ eq: 'ez', ...seatOnly, box: { z: 0.36, h: 1.0, d: 0.16, w: 0.5 } }, { ...SE, t: -80, ua: 48, uas: 10, fa: 46, hl: ['biceps'] }, { ...SE, t: -80, ua: 48, uas: 10, fa: -62, hl: ['biceps'] }),
  'concentration-curl': F({ eq: 'dumbbell1', ...seatOnly }, { ...SE, t: -42, ths: 22, ua: 96, fa: 98, ua2: 70, fa2: 40, hl: ['biceps'] }, { ...SE, t: -42, ths: 22, ua: 96, fa: -40, ua2: 70, fa2: 40, hl: ['biceps'] }),
  'triceps-pushdown': pushdown('handle'),
  'rope-pushdown': pushdown('rope', {}, { fas: 22 }),
  'skull-crusher': skull('ez'),
  'lying-db-ext': skull('dumbbell'),
  'triceps-oh': F({ eq: 'dbmid', dur: 1.5 }, { ...ST, ua: -96, fa: -96, uas: 6, hl: ['triceps'] }, { ...ST, ua: -102, fa: 124, uas: 6, hl: ['triceps'] }),
  'cable-oh-ext': F({ eq: 'rope', cable: { y: 1.85, z: -0.45 }, dur: 1.5 }, { ...ST, t: -66, th: 80, th2: 104, ua: -60, fa: 150, uas: 6, hl: ['triceps'] }, { ...ST, t: -66, th: 80, th2: 104, ua: -40, fa: -30, uas: 6, hl: ['triceps'] }),
  'kickback': F({ eq: 'dumbbell', dur: 1.3 }, { ...ST, ...HG, ua: 184, uas: 6, fa: 92, hl: ['triceps'] }, { ...ST, ...HG, ua: 184, uas: 6, fa: 182, hl: ['triceps'] }),
  'bench-dips': F({ hang: true, lift: 0.34, box: { auto: 'hands', w: 0.9, d: 0.35 } }, { t: -84, ua: 124, fa: 124, uas: 8, th: -2, sh: 72, ft: -14, hl: ['triceps'] }, { t: -84, ua: 172, fa: 86, uas: 8, th: -2, sh: 72, ft: -14, hl: ['triceps'] }),
  'dips-triceps': F({ hang: true, bars: 'dip', lift: 0.25, dur: 1.5 }, { ...ST, ua: 92, fa: 92, uas: 6, th: 100, sh: 150, hl: ['triceps'] }, { ...ST, t: -86, ua: 146, uas: 6, fa: 92, th: 100, sh: 150, hl: ['triceps'] }),
  'wrist-curl': wrist('barbell'),
  'reverse-wrist-curl': wrist('barbell'),
  'db-wrist-curl': wrist('dumbbell'),
  'farmers-walk': F({ eq: 'dumbbell', dur: 0.7 }, { ...ST, th: 76, sh: 96, th2: 104, sh2: 112, uas: 6, hl: ['forearms', 'traps'] }, { ...ST, th: 104, sh: 112, th2: 76, sh2: 96, uas: 6, hl: ['forearms', 'traps'] }),
  'wrist-roller': F({ eq: 'handle', dur: 0.8 }, { ...ST, ua: 2, fa: 2, wr: 30, uas: 10, hl: ['forearms'] }, { ...ST, ua: 2, fa: 2, wr: -30, uas: 10, hl: ['forearms'] }),
  'plate-pinch': F({ eq: 'plates2', dur: 2 }, { ...ST, uas: 8, hl: ['forearms'] }, { ...ST, uas: 8, shrug: 3, hl: ['forearms'] }),

  // ── Karın
  'crunch': F({ dur: 1.3 }, { ...SUP, ua: 4, fa: 4, ut: 180, h: 0, hl: ['core'] }, { ...SUP, ua: -16, fa: -16, ut: 214, h: 12, hl: ['core'] }),
  'sit-up': F({ dur: 1.6 }, { ...SUP, ua: 4, fa: 4, hl: ['core'] }, { ...SUP, t: -72, h: 10, ua: 6, fa: 6, hl: ['core'] }),
  'oblique-crunch': F({ dur: 1.3 }, { ...SUP, ths: 30, ua: 4, fa: 4, ut: 180, uas: 0, hl: ['core'] }, { ...SUP, ths: 30, ua: -10, fa: -10, ut: 210, uas: -30, hl: ['core'] }),
  'bicycle-crunch': F({ dur: 0.9 }, { t: 180, ut: 208, h: 10, ua: 230, fa: 40, th: -84, sh: 6, th2: -18, sh2: -18, ft: -40, hl: ['core'] }, { t: 180, ut: 208, h: 10, ua: 230, fa: 40, th: -18, sh: -18, th2: -84, sh2: 6, ft: -40, hl: ['core'] }),
  'reverse-crunch': F({ dur: 1.4 }, { t: 180, ua: 2, fa: 2, th: -80, sh: 16, ft: -40, hl: ['core'] }, { t: 168, ua: 2, fa: 2, th: -122, sh: -30, ft: -60, hl: ['core'] }),
  'leg-raise': F({ dur: 1.5 }, { t: 180, ua: 2, fa: 2, th: -6, sh: -6, ft: -70, hl: ['core'] }, { t: 180, ua: 2, fa: 2, th: -88, sh: -88, ft: -160, hl: ['core'] }),
  'dead-bug': F({ dur: 1.4 }, { t: 180, ua: -90, fa: -90, th: -90, sh: 0, ft: -40, hl: ['core'] }, { t: 180, ua: 196, fa: 196, ua2: -90, fa2: -90, th: -90, sh: 0, th2: -12, sh2: -12, ft: -40, hl: ['core'] }),
  'plank': F({ dur: 2 }, { t: 195, plank: 'elbows', face: -1, ua: 92, fa: 178, th: 16, sh: 16, ft: 142, hl: ['core'] }, { t: 197, plank: 'elbows', face: -1, ua: 92, fa: 178, th: 18, sh: 18, ft: 142, hl: ['core'] }),
  'side-plank': F({ dur: 1.4 }, { t: 196, ua: 92, fa: 178, ua2: 5, fa2: 5, th: 8, sh: 8, ft: 80, hl: ['core'] }, { t: 206, ua: 92, fa: 178, ua2: -90, fa2: -90, th: 22, sh: 22, ft: 100, hl: ['core'] }),
  'mountain-climber': F({ dur: 0.6 }, { ...PR, th: 142, sh: 70, th2: 20, sh2: 20, hl: ['core'] }, { ...PR, th: 20, sh: 20, th2: 142, sh2: 70, hl: ['core'] }),
  'hanging-leg-raise': F({ hang: true, bars: 'pullup', lift: 0.32, dur: 1.6 }, { ...ST, ua: -90, uas: 20, fa: -90, fas: 20, th: 94, sh: 94, hl: ['core'] }, { ...ST, t: -96, ua: -90, uas: 20, fa: -90, fas: 20, th: 2, sh: 2, hl: ['core'] }),
  'knee-raise': F({ hang: true, bars: 'dip', lift: 0.3, dur: 1.4 }, { ...ST, ua: 92, fa: 92, uas: 9, th: 92, sh: 92, hl: ['core'] }, { ...ST, t: -94, ua: 92, fa: 92, uas: 9, th: -4, sh: 88, hl: ['core'] }),
  'russian-twist': F({ eq: 'ball', dur: 0.9 }, { t: -56, th: -28, sh: 34, ft: -10, ua: 20, fa: 20, uas: 42, uas2: -42, fas: 42, fas2: -42, hl: ['core'] }, { t: -56, th: -28, sh: 34, ft: -10, ua: 20, fa: 20, uas: -42, uas2: 42, fas: -42, fas2: 42, hl: ['core'] }),
  'cable-crunch': F({ eq: 'rope', cable: { y: 2.0, z: 0.55 }, dur: 1.4 }, { t: -66, th: 90, sh: 180, ft: 100, ua: -40, fa: 200, uas: 18, hl: ['core'] }, { t: 8, th: 90, sh: 180, ft: 100, h: 20, ua: 10, fa: 230, uas: 18, hl: ['core'] }),
  'ab-roller': F({ eq: 'wheel', dur: 1.8 }, { t: -54, th: 92, sh: 180, ft: 100, ua: 70, fa: 70, uas: 6, hl: ['core'] }, { t: -8, th: 152, sh: 180, ft: 100, ua: -6, fa: -6, uas: 6, hl: ['core'] }),
  'decline-crunch': F({ ...decl, dur: 1.4 }, { ...SD, ua: 4, fa: 4, ut: 164, hl: ['core'] }, { ...SD, ua: -20, fa: -20, ut: 224, h: 12, hl: ['core'] }),
  'ab-machine': F({ ...seatBack, dur: 1.4 }, { ...SR, ua: 130, fa: -60, hl: ['core'] }, { ...SR, t: -54, h: 16, ua: 160, fa: -30, hl: ['core'] }),
  'side-bend': F({ eq: 'dumbbell1', dur: 1.4 }, { ...ST, ts: -14, uas: 4, ua2: 130, fa2: -80, hl: ['core'] }, { ...ST, ts: 16, uas: 4, ua2: 130, fa2: -80, hl: ['core'] }),
  'pallof-press': F({ eq: 'handle', cable: { y: 1.2, z: 0, x: -0.75 }, dur: 1.6 }, { ...ST, th: 88, ths: 12, ua: 124, fa: -70, uas: 4, hl: ['core'] }, { ...ST, th: 88, ths: 12, ua: 2, fa: 2, uas: 4, hl: ['core'] }),
  'mb-twist': F({ eq: 'ball', dur: 0.9 }, { ...ST, ua: 30, fa: 30, uas: 40, uas2: -40, fas: 40, fas2: -40, hl: ['core'] }, { ...ST, ua: 30, fa: 30, uas: -40, uas2: 40, fas: -40, fas2: 40, hl: ['core'] }),
  'overhead-slam': F({ eq: 'ball', dur: 1.1 }, { ...ST, t: -96, ua: -88, fa: -88, lift: 0.04, hl: ['core'] }, { ...ST, t: -32, th: 80, sh: 112, ua: 96, fa: 96, lift: 0, hl: ['core'] }),
};
// Bir pozda olup diğerinde olmayan sayısal alanlar varsayılanla tamamlanır (yoksa geçişte animasyon olmaz)
const DEF = { uas: 0, fas: 0, ths: 0, shs: 0, uas2: 0, fas2: 0, ths2: 0, ts: 0, shrug: 0, lift: 0, dz: 0, h: 0 };
for (const f of Object.values(GYM_FIGS)) {
  const keys = new Set(f.poses.flatMap(p => Object.keys(p)));
  for (const p of f.poses) for (const k of keys) if (p[k] == null && k in DEF) p[k] = k.endsWith('2') ? p[k.slice(0, -1)] ?? DEF[k] : k === 'fas' ? p.uas ?? 0 : DEF[k];
}
