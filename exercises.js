// Hareket veritabanı + 3D animasyon pozları.
//
// Poz açıları derece cinsinden [x, y, z] ve her zaman SOL taraf için yazılır; sağ taraf otomatik aynalanır.
//   sh  (omuz)  : x<0 kolu öne kaldırır, x>0 geriye; z>0 yana açar; y kolu kendi ekseninde döndürür
//   el  (dirsek): x<0 büker
//   hip (kalça) : x<0 bacağı öne kaldırır, z>0 yana açar
//   kn  (diz)   : x>0 büker
//   an  (bilek) : x>0 parmak ucunu aşağı indirir (verilmezse ayak yere paralel tutulur)
//   spine/chest : x>0 gövdeyi öne eğer;  neck: x>0 başı öne eğer
//   pos / rot   : kökün (kalçanın) dünya konumu ve dönüşü
// anchor: 'feet' ayaklar yere basar, 'hands' eller sabit noktada (barfiks), 'ground' eller+ayaklar yerde, 'none' serbest.

export const REGIONS = [
  { id: 'gogus', name: 'Göğüs', color: '#ff6a3d' },
  { id: 'sirt', name: 'Sırt', color: '#3da5ff' },
  { id: 'bacak', name: 'Bacak', color: '#8b5cf6' },
  { id: 'omuz', name: 'Omuz', color: '#f5b83d' },
  { id: 'kol', name: 'Kol', color: '#22c55e' },
  { id: 'karin', name: 'Karın', color: '#ec4899' },
];

const LYING = [0, 0.15, 0.3];
const MAT = { type: 'box', size: [0.7, 0.02, 1.9], pos: [0, 0.01, -0.1], color: 'mat' };
const CAM_SIDE = { cam: [2.5, 1.3, 1.3], look: [0, 0.5, 0] };

export const EXERCISES = [
  // ───────────── GÖĞÜS
  {
    id: 'bench', region: 'gogus', name: 'Bench Press', type: 'weight',
    equip: { kind: 'barbell' }, anchor: 'none', ...CAM_SIDE,
    props: [{ type: 'rootBox', size: [0.3, 1.35, 0.07], at: [0, 0.25, -0.16], post: true }],
    muscles: ['chest', 'shoulder', 'upperArm'],
    target: 'Göğüs (pectoralis major), ön omuz, triceps',
    frames: [
      { pos: [0, 0.55, 0.35], rot: [-90, 0, 0], hip: [5], kn: [85], sh: [-90, 0, 12], el: [0] },
      { pos: [0, 0.55, 0.35], rot: [-90, 0, 0], hip: [5], kn: [85], sh: [-15, 0, 72], el: [-90] },
    ],
    steps: [
      'Sehpaya uzan; gözlerin barın hizasında, ayakların yere tam bassın.',
      'Barı omuz genişliğinden biraz geniş kavra, kürek kemiklerini geriye ve aşağı sıkıştır.',
      'Barı kontrollü şekilde göğsünün orta-alt kısmına indir; dirsekler gövdeye ~45–70° açıda.',
      'Ayaklarla yere itip barı güçlü şekilde yukarı it, kilitlemeden hemen önce dur.',
    ],
    tips: ['Kalçanı sehpadan kaldırma.', 'Ağır setlerde mutlaka spotter veya güvenlik barı kullan.'],
  },
  {
    id: 'incline-db', region: 'gogus', name: 'Incline Dumbbell Press', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'x' }, anchor: 'none', cam: [2.4, 1.5, 1.8], look: [0, 0.8, 0],
    props: [
      { type: 'rootBox', size: [0.3, 0.95, 0.07], at: [0, 0.42, -0.16], post: true },
      { type: 'box', size: [0.32, 0.07, 0.42], pos: [0, 0.41, 0.08], post: true },
    ],
    muscles: ['chest', 'shoulder', 'upperArm'],
    target: 'Üst göğüs, ön omuz, triceps',
    frames: [
      { pos: [0, 0.56, 0], rot: [-50, 0, 0], hip: [-40], kn: [90], sh: [-90, 0, 8], el: [0] },
      { pos: [0, 0.56, 0], rot: [-50, 0, 0], hip: [-40], kn: [90], sh: [-15, 0, 70], el: [-90] },
    ],
    steps: [
      'Sehpayı 30–45° eğime ayarla ve dambılları dizlerinin üzerinde tutarak otur.',
      'Geriye yaslanırken dambılları omuz hizasına getir.',
      'Dambılları yukarı ve hafifçe içe doğru it; tepede birbirine değdirme.',
      'Kontrollü şekilde göğüs hizasına geri indir.',
    ],
    tips: ['Belini aşırı kavislendirme.', 'İnişi 2–3 saniyede yap.'],
  },
  {
    id: 'pushup', region: 'gogus', name: 'Şınav', type: 'bodyweight',
    equip: null, anchor: 'ground', anchorZ: -0.7, cam: [2.7, 1.3, 1.5], look: [0, 0.3, 0.1],
    props: [{ ...MAT, pos: [0, 0.01, -0.1] }],
    muscles: ['chest', 'upperArm', 'shoulder', 'abs'],
    target: 'Göğüs, triceps, ön omuz, core',
    frames: [
      { rot: [66, 0, 0], sh: [-66, 0, 12], el: [0], an: [15] },
      { rot: [80, 0, 0], sh: [-28, 0, 22], el: [-52], an: [8] },
    ],
    steps: [
      'Eller omuz genişliğinden biraz açık, vücut başından topuğuna düz bir çizgi.',
      'Karnını ve kalçanı sık; dirsekleri ~45° açıyla bükerek göğsünü yere yaklaştır.',
      'Göğüs yere birkaç cm kalınca avuçlarınla yeri iterek yukarı çık.',
    ],
    tips: ['Kalçanın düşmesine veya yukarı kalkmasına izin verme.', 'Zorlanırsan dizler yerde yap.'],
  },
  {
    id: 'db-fly', region: 'gogus', name: 'Dumbbell Fly', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'none', ...CAM_SIDE,
    props: [{ type: 'rootBox', size: [0.3, 1.35, 0.07], at: [0, 0.25, -0.16], post: true }],
    muscles: ['chest', 'shoulder'],
    target: 'Göğüs (germe odaklı), ön omuz',
    frames: [
      { pos: [0, 0.55, 0.35], rot: [-90, 0, 0], hip: [5], kn: [85], sh: [-88, 0, 10], el: [-15] },
      { pos: [0, 0.55, 0.35], rot: [-90, 0, 0], hip: [5], kn: [85], sh: [-8, 0, 82], el: [-25] },
    ],
    steps: [
      'Sehpaya uzan, dambılları avuç içleri birbirine bakacak şekilde göğsünün üstünde tut.',
      'Dirsekler hafif bükülü ve sabitken kolları yay çizerek yanlara aç.',
      'Göğüste gerilme hissedince aynı yaydan yukarı getir; "ağaca sarılıyormuş" gibi.',
    ],
    tips: ['Ağırlığı hafif tut, omzu zorlayan derinliğe inme.'],
  },

  // ───────────── SIRT
  {
    id: 'pullup', region: 'sirt', name: 'Barfiks', type: 'bodyweight',
    equip: null, anchor: 'hands', anchorAt: [0, 2.25, 0], cam: [2.3, 1.9, 2.8], look: [0, 1.45, 0],
    props: [
      { type: 'bar', from: [-0.85, 2.25, 0], to: [0.85, 2.25, 0], r: 0.018 },
      { type: 'bar', from: [-0.85, 0, 0], to: [-0.85, 2.3, 0], r: 0.03, color: 'frame' },
      { type: 'bar', from: [0.85, 0, 0], to: [0.85, 2.3, 0], r: 0.03, color: 'frame' },
    ],
    muscles: ['back', 'upperArm', 'forearm'],
    target: 'Latissimus dorsi, orta sırt, biceps',
    frames: [
      { spine: [-4], sh: [0, 90, 156], el: [-4], hip: [-10], kn: [30] },
      { spine: [-10], neck: [-10], sh: [0, 90, 68], el: [-116], hip: [-15], kn: [35] },
    ],
    steps: [
      'Barı omuz genişliğinden biraz geniş, avuç içleri öne bakacak şekilde tut.',
      'Tam sarkık pozisyondan başla; omuzlarını aşağı ve geriye çek.',
      'Dirsekleri aşağı ve yanlara sürerek çeneni barın üstüne çıkar.',
      'Kontrollü şekilde tamamen aşağı in.',
    ],
    tips: ['Sallanma ve bacaklarla ivme alma.', 'Yapamıyorsan lastik bant veya negatif tekrarla başla.'],
  },
  {
    id: 'bb-row', region: 'sirt', name: 'Barbell Row', type: 'weight',
    equip: { kind: 'barbell' }, anchor: 'feet', cam: [2.6, 1.3, 1.7], look: [0, 0.8, 0],
    muscles: ['back', 'shoulder', 'upperArm'],
    target: 'Orta sırt, latissimus, arka omuz, biceps',
    frames: [
      { spine: [55], neck: [-30], hip: [-25], kn: [25], sh: [-55, 0, 8], el: [0] },
      { spine: [55], neck: [-30], hip: [-25], kn: [25], sh: [18, 0, 14], el: [-100] },
    ],
    steps: [
      'Ayaklar kalça genişliğinde, dizler hafif bükülü; gövdeyi kalçadan ~45–60° öne eğ.',
      'Barı omuz genişliğinde kavra, sırtını düz tut.',
      'Dirsekleri geriye çekerek barı göbek/alt göğüs hizasına getir, kürek kemiklerini sık.',
      'Barı kontrollü şekilde kollar düzleşene kadar indir.',
    ],
    tips: ['Belini yuvarlama; gövde açısını tekrarlar boyunca sabit tut.'],
  },
  {
    id: 'lat-pulldown', region: 'sirt', name: 'Lat Pulldown', type: 'weight',
    equip: { kind: 'cable', to: [0, 2.5, 0.05] }, anchor: 'none', cam: [2.3, 1.7, 2.8], look: [0, 1.2, 0],
    props: [
      { type: 'box', size: [0.4, 0.06, 0.4], pos: [0, 0.44, 0], post: true },
      { type: 'box', size: [0.42, 0.08, 0.1], pos: [0, 0.75, 0.3], post: true },
      { type: 'bar', from: [0, 0, -0.55], to: [0, 2.55, -0.55], r: 0.04, color: 'frame' },
      { type: 'bar', from: [0, 2.55, -0.55], to: [0, 2.55, 0.08], r: 0.04, color: 'frame' },
    ],
    muscles: ['back', 'upperArm'],
    target: 'Latissimus dorsi, biceps, arka omuz',
    frames: [
      { pos: [0, 0.6, 0], rot: [-8, 0, 0], hip: [-82], kn: [88], sh: [0, 90, 158], el: [-4] },
      { pos: [0, 0.6, 0], rot: [-8, 0, 0], spine: [-10], hip: [-82], kn: [88], sh: [0, 90, 65], el: [-116] },
    ],
    steps: [
      'Dizlerini pedin altına sabitle, barı geniş kavrayışla tut.',
      'Göğsünü dik tut, hafifçe geriye yaslan.',
      'Dirsekleri aşağı çekerek barı üst göğsüne indir; kürek kemiklerini sık.',
      'Kolları kontrollü şekilde tamamen uzat.',
    ],
    tips: ['Barı ensenin arkasına çekme.', 'Gövdeyle sallanarak çekme.'],
  },
  {
    id: 'deadlift', region: 'sirt', name: 'Deadlift', type: 'weight',
    equip: { kind: 'barbell' }, anchor: 'feet', cam: [2.6, 1.3, 1.9], look: [0, 0.75, 0],
    muscles: ['back', 'glutes', 'thigh', 'forearm'],
    target: 'Bel, kalça, hamstring, sırt, ön kol',
    dur: 3.6,
    frames: [
      { spine: [64], neck: [-35], hip: [-70, 0, 6], kn: [85], sh: [-60, 0, 6], el: [0] },
      { spine: [0], hip: [0, 0, 6], kn: [0], sh: [0, 0, 6], el: [0] },
    ],
    steps: [
      'Bar ayak ortasının üstünde olacak şekilde dur, ayaklar kalça genişliğinde.',
      'Kalçadan eğilip barı kavra; kaval kemikleri bara değsin, sırt düz.',
      'Göğsü kaldır, nefesi tut ve yeri iterek barı bacaklarına yakın kaldır.',
      'Kalça ve dizleri birlikte kilitle; aynı yoldan kontrollü indir.',
    ],
    tips: ['Belini asla yuvarlama.', 'Bar vücuda yakın kalmalı.'],
  },

  // ───────────── BACAK
  {
    id: 'squat', region: 'bacak', name: 'Squat', type: 'weight',
    equip: { kind: 'barbell' }, anchor: 'feet', cam: [2.6, 1.4, 2.2], look: [0, 0.85, 0],
    muscles: ['thigh', 'glutes'],
    target: 'Ön bacak (quadriceps), kalça, arka bacak',
    dur: 3.4,
    frames: [
      { spine: [5], hip: [0, 0, 7], kn: [0], sh: [20, 90, 50], el: [-148] },
      { spine: [40], neck: [-25], hip: [-100, 0, 15], kn: [112], sh: [20, 90, 50], el: [-148] },
    ],
    steps: [
      'Barı üst sırtına (trapez) yerleştir, ayaklar omuz genişliğinde, parmak uçları hafif dışa.',
      'Nefes al, karnını sık; kalçayı geri ve aşağı göndererek çömel.',
      'Dizler parmak uçlarıyla aynı yönde; uyluklar en az yere paralel olana kadar in.',
      'Topuklarından iterek yukarı kalk.',
    ],
    tips: ['Topuklar yerden kalkmasın.', 'Dizlerin içe kapanmasına izin verme.'],
  },
  {
    id: 'lunge', region: 'bacak', name: 'Hamle (Lunge)', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'feet', cam: [2.6, 1.3, 1.6], look: [0, 0.8, 0],
    muscles: ['thigh', 'glutes'],
    target: 'Quadriceps, kalça, denge',
    frames: [
      { spine: [5], hipL: [-25], knL: [15], hipR: [22], knR: [12], anR: [-5], sh: [0, 0, 5], el: [-4] },
      { spine: [8], hipL: [-85], knL: [95], hipR: [15], knR: [102], anR: [-55], sh: [0, 0, 5], el: [-4] },
    ],
    steps: [
      'Dambılları yanlarda tutarak dik dur ve bir adım öne at.',
      'Arka diz yere yaklaşana kadar dikey olarak aşağı in; iki diz de ~90°.',
      'Öndeki topuktan iterek yukarı çık. Setin yarısında bacak değiştir.',
    ],
    tips: ['Ön diz ayak bileğinin çok önüne geçmesin.', 'Gövdeyi dik tut.'],
  },
  {
    id: 'rdl', region: 'bacak', name: 'Romanian Deadlift', type: 'weight',
    equip: { kind: 'barbell' }, anchor: 'feet', cam: [2.6, 1.3, 1.9], look: [0, 0.8, 0],
    muscles: ['thigh', 'glutes', 'back'],
    target: 'Arka bacak (hamstring), kalça, bel',
    dur: 3.6,
    frames: [
      { spine: [0], hip: [0, 0, 5], kn: [5], sh: [0, 0, 6] },
      { spine: [75], neck: [-40], hip: [-10, 0, 5], kn: [15], sh: [-78, 0, 6] },
    ],
    steps: [
      'Barı kalça önünde tutarak dik dur, dizler hafif bükülü.',
      'Kalçanı geriye iterek gövdeyi öne eğ; bar bacaklarına yakın kaysın.',
      'Arka bacakta gerilme hissedince (genelde diz altı) kalçayı öne sürerek kalk.',
    ],
    tips: ['Dizler neredeyse sabit; hareket kalçadan.', 'Sırtın düz kalmalı.'],
  },
  {
    id: 'leg-ext', region: 'bacak', name: 'Leg Extension', type: 'weight',
    equip: { kind: 'legPad' }, anchor: 'none', cam: [2.5, 1.3, 1.6], look: [0, 0.7, 0.2],
    props: [
      { type: 'box', size: [0.42, 0.06, 0.45], pos: [0, 0.5, 0], post: true },
      { type: 'box', size: [0.42, 0.6, 0.06], pos: [0, 0.88, -0.24], post: true },
    ],
    muscles: ['thigh'],
    target: 'Quadriceps (ön bacak)',
    frames: [
      { pos: [0, 0.62, 0], rot: [-5, 0, 0], hip: [-85], kn: [90], an: [0], sh: [0, 0, 18], el: [-10] },
      { pos: [0, 0.62, 0], rot: [-5, 0, 0], hip: [-85], kn: [4], an: [0], sh: [0, 0, 18], el: [-10] },
    ],
    steps: [
      'Makineye otur, dizlerin eksen noktasıyla hizalı, pedi ayak bileklerinin önüne ayarla.',
      'Yan tutamaçları tut ve bacaklarını tamamen uzat.',
      'Tepede 1 saniye sık, kontrollü şekilde geri indir.',
    ],
    tips: ['Ağırlığı sallayarak kaldırma.'],
  },
  {
    id: 'calf-raise', region: 'bacak', name: 'Baldır Kaldırma', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'feet', cam: [2.4, 1.3, 2.4], look: [0, 0.75, 0],
    muscles: ['shin'],
    target: 'Baldır (gastrocnemius, soleus)',
    dur: 2.4,
    frames: [
      { an: [0], sh: [0, 0, 5] },
      { an: [38], sh: [0, 0, 5] },
    ],
    steps: [
      'Dambılları yanlarda tut, ayaklar kalça genişliğinde.',
      'Parmak uçlarında olabildiğince yükseğe kalk.',
      'Tepede 1 saniye bekle, topukları yavaşça indir.',
    ],
    tips: ['Daha fazla hareket açıklığı için bir basamağın kenarında yap.'],
  },

  // ───────────── OMUZ
  {
    id: 'ohp', region: 'omuz', name: 'Overhead Press', type: 'weight',
    equip: { kind: 'barbell' }, anchor: 'feet', cam: [2.4, 1.6, 2.4], look: [0, 1.1, 0],
    muscles: ['shoulder', 'upperArm'],
    target: 'Ön ve yan omuz, triceps, üst göğüs',
    frames: [
      { spine: [-3], hip: [0, 0, 5], sh: [-25, 90, 55], el: [-145] },
      { spine: [0], hip: [0, 0, 5], sh: [0, 90, 165], el: [-8] },
    ],
    steps: [
      'Barı köprücük kemiği hizasında, omuz genişliğinde kavra.',
      'Karın ve kalçanı sık, barı dik bir çizgide başının üstüne it.',
      'Bar alnını geçince başını hafifçe öne al; tepede kolları kilitle.',
      'Kontrollü şekilde başlangıca indir.',
    ],
    tips: ['Belini geriye bükme.', 'Dirsekler barın hafif önünde başlasın.'],
  },
  {
    id: 'lateral-raise', region: 'omuz', name: 'Lateral Raise', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'feet', cam: [0.8, 1.5, 3.0], look: [0, 1.1, 0],
    muscles: ['shoulder'],
    target: 'Yan omuz (medial deltoid)',
    frames: [
      { sh: [0, 0, 10], el: [-10] },
      { sh: [0, 0, 86], el: [-15] },
    ],
    steps: [
      'Dambılları yanlarda tut, dirsekler hafif bükülü.',
      'Kolları yanlara, omuz hizasına kadar kaldır.',
      'Tepede kısa dur, yavaşça indir.',
    ],
    tips: ['Omuz silkme (trapez) ile kaldırma.', 'Hafif ağırlık, sıkı form.'],
  },
  {
    id: 'front-raise', region: 'omuz', name: 'Front Raise', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'x' }, anchor: 'feet', cam: [2.6, 1.5, 1.6], look: [0, 1.1, 0],
    muscles: ['shoulder'],
    target: 'Ön omuz (anterior deltoid)',
    frames: [
      { sh: [-8, 0, 6], el: [-5] },
      { sh: [-90, 0, 8], el: [-5] },
    ],
    steps: [
      'Dambılları uyluklarının önünde tut.',
      'Kolları düz şekilde öne, omuz hizasına kadar kaldır.',
      'Yavaşça indir; gövdeyle sallanma.',
    ],
    tips: ['Dönüşümlü (tek tek) de yapılabilir.'],
  },
  {
    id: 'reverse-fly', region: 'omuz', name: 'Reverse Fly', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'feet', cam: [2.2, 1.7, 2.6], look: [0, 0.9, 0],
    muscles: ['shoulder', 'back'],
    target: 'Arka omuz, orta sırt (romboid)',
    frames: [
      { spine: [70], neck: [-30], hip: [-20], kn: [25], sh: [-70, 0, 5], el: [-20] },
      { spine: [70], neck: [-30], hip: [-20], kn: [25], sh: [-70, 0, 80], el: [-20] },
    ],
    steps: [
      'Dizler hafif bükülü, gövdeyi kalçadan öne eğ; dambıllar aşağı sarkık.',
      'Dirsekler hafif bükülü şekilde kolları yanlara aç.',
      'Kürek kemiklerini sık, yavaşça indir.',
    ],
    tips: ['Boyun nötr, sırt düz kalsın.'],
  },

  // ───────────── KOL
  {
    id: 'biceps-curl', region: 'kol', name: 'Biceps Curl', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'x' }, anchor: 'feet', cam: [2.4, 1.4, 2.0], look: [0, 1.0, 0],
    muscles: ['upperArm', 'forearm'],
    target: 'Biceps, ön kol',
    dur: 2.8,
    frames: [
      { sh: [0, 0, 8], el: [-5] },
      { sh: [-10, 0, 8], el: [-140] },
    ],
    steps: [
      'Dambılları avuç içleri öne bakacak şekilde tut, dirsekler gövdeye yakın.',
      'Dirsekleri sabit tutarak dambılları omuza doğru bük.',
      'Tepede biceps\'i sık, yavaşça indir.',
    ],
    tips: ['Gövdeyle sallanma.', 'İnişte kolu tamamen uzat.'],
  },
  {
    id: 'hammer-curl', region: 'kol', name: 'Hammer Curl', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'feet', cam: [2.4, 1.4, 2.0], look: [0, 1.0, 0],
    muscles: ['upperArm', 'forearm'],
    target: 'Brachialis, biceps, ön kol',
    dur: 2.8,
    frames: [
      { sh: [0, 0, 8], el: [-5] },
      { sh: [-10, 0, 8], el: [-135] },
    ],
    steps: [
      'Dambılları avuç içleri birbirine bakacak (çekiç) şekilde tut.',
      'Dirsekler sabit, dambılları omuza doğru kaldır.',
      'Kontrollü şekilde indir.',
    ],
    tips: ['Bilekleri bükme, nötr tut.'],
  },
  {
    id: 'triceps-oh', region: 'kol', name: 'Overhead Triceps Extension', type: 'weight',
    equip: { kind: 'dbCenter' }, anchor: 'feet', cam: [2.6, 1.7, 1.8], look: [0, 1.3, 0],
    muscles: ['upperArm'],
    target: 'Triceps (özellikle uzun baş)',
    frames: [
      { sh: [-165, 0, -15], el: [-130] },
      { sh: [-165, 0, -15], el: [-8] },
    ],
    steps: [
      'Tek dambılı iki elle, başının üstünde kollar uzanmış şekilde tut.',
      'Dirsekler yukarıyı gösterirken dambılı başının arkasına indir.',
      'Yalnızca dirsekten açarak dambılı tekrar yukarı it.',
    ],
    tips: ['Dirsekleri çok dışa açma.', 'Karnını sıkı tut, bel boşluğunu artırma.'],
  },
  {
    id: 'kickback', region: 'kol', name: 'Triceps Kickback', type: 'weight',
    equip: { kind: 'dumbbell', axis: 'z' }, anchor: 'feet', cam: [2.6, 1.3, 1.2], look: [0, 0.9, 0],
    muscles: ['upperArm'],
    target: 'Triceps',
    frames: [
      { spine: [70], neck: [-30], hip: [-20], kn: [25], sh: [15, 0, 6], el: [-95] },
      { spine: [70], neck: [-30], hip: [-20], kn: [25], sh: [15, 0, 6], el: [-5] },
    ],
    steps: [
      'Gövdeyi öne eğ, üst kolları gövdeye paralel ve sabit tut.',
      'Dirsekten açarak dambılı geriye doğru uzat.',
      'Tepede triceps\'i sık, yavaşça 90°\'ye dön.',
    ],
    tips: ['Üst kol hareket etmemeli.'],
  },

  // ───────────── KARIN
  {
    id: 'crunch', region: 'karin', name: 'Crunch', type: 'bodyweight',
    equip: null, anchor: 'none', ...CAM_SIDE,
    props: [MAT],
    muscles: ['abs'],
    target: 'Karın (rectus abdominis)',
    dur: 2.6,
    frames: [
      { pos: LYING, rot: [-90, 0, 0], hip: [-50], kn: [100], sh: [-25, 0, 10], el: [-5] },
      { pos: LYING, rot: [-90, 0, 0], spine: [28], chest: [10], neck: [20], hip: [-50], kn: [100], sh: [-55, 0, 10], el: [-5] },
    ],
    steps: [
      'Sırt üstü uzan, dizler bükülü, ayaklar yerde.',
      'Karnını sıkarak omuzlarını ve üst sırtını yerden kaldır.',
      'Tepede kısa dur, yavaşça geri in.',
    ],
    tips: ['Boynundan çekme; çene ile göğüs arasında yumruk boşluğu bırak.'],
  },
  {
    id: 'plank', region: 'karin', name: 'Plank', type: 'time',
    equip: null, anchor: 'ground', anchorZ: -0.7, cam: [2.7, 1.3, 1.5], look: [0, 0.3, 0.1],
    props: [MAT],
    muscles: ['abs', 'shoulder'],
    target: 'Tüm core, omuz stabilizasyonu',
    dur: 4,
    frames: [
      { rot: [79, 0, 0], sh: [-79, 0, 10], el: [-90], an: [15] },
      { rot: [81, 0, 0], sh: [-81, 0, 10], el: [-90], an: [15] },
    ],
    steps: [
      'Dirsekler omuzların altında, ön kollar yerde.',
      'Vücudu başından topuğa düz bir çizgi halinde tut.',
      'Karnını ve kalçanı sık, nefes almaya devam et.',
    ],
    tips: ['Kalça düşmesin, çok da kalkmasın.'],
  },
  {
    id: 'leg-raise', region: 'karin', name: 'Bacak Kaldırma', type: 'bodyweight',
    equip: null, anchor: 'none', ...CAM_SIDE,
    props: [MAT],
    muscles: ['abs', 'thigh'],
    target: 'Alt karın, kalça fleksörleri',
    dur: 3.2,
    frames: [
      { pos: LYING, rot: [-90, 0, 0], hip: [-4], kn: [0], an: [20], sh: [0, 0, 12] },
      { pos: LYING, rot: [-90, 0, 0], hip: [-88], kn: [0], an: [20], sh: [0, 0, 12] },
    ],
    steps: [
      'Sırt üstü uzan, eller yanlarda ya da kalçanın altında.',
      'Bacakları düz tutarak dikey olana kadar kaldır.',
      'Belini yerden ayırmadan bacakları yavaşça indir; yere değdirme.',
    ],
    tips: ['Bel boşluğu açılıyorsa dizleri hafif bük.'],
  },
];

export const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
export const REGION_BY_ID = Object.fromEntries(REGIONS.map(r => [r.id, r]));
