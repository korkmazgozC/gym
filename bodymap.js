// Ön ve arka vücut haritası (SVG). Kaslar bölgelere (data-r) bağlıdır; renk seviyesi (0–3) dışarıdan verilir.
// Şekiller sol yarı için çizilir, sağ yarı aynalanır (merkez x = 100).

// Siluet (baş, gövde, kol, bacak ve el); ön ve arka için aynı
const BASE = `
  <ellipse cx="100" cy="28" rx="15" ry="19"/>
  <path d="M100 44 L91 46 L90 58 C80 60 66 62 60 68 C54 74 52 86 52 98 C51 118 49 136 49 150 C47 166 45 182 46 198 L58 199 C60 184 64 166 66 150 C68 136 69 124 71 114 C73 132 74 150 75 166 C75 180 74 190 73 200 C69 226 69 256 74 290 C72 312 71 336 76 360 L78 386 C74 392 74 398 80 400 L94 400 L93 386 C95 360 95 330 94 306 C97 280 99 250 100 216 Z"/>
  <ellipse cx="52" cy="208" rx="6" ry="10"/>`;

const FRONT = [
  ['sirt', 'M91 58 L80 64 L95 66 Z'],
  ['omuz', 'M78 64 C66 64 57 72 55 86 C54 96 55 104 57 110 L66 104 C68 92 72 80 84 70 Z'],
  ['gogus', 'M98 72 L98 112 C90 116 80 115 74 108 C70 100 70 88 74 80 C80 73 90 71 98 72 Z'],
  ['kol', 'M56 114 C53 126 52 138 53 150 L64 150 C67 138 69 126 69 116 Z'],
  ['kol', 'M52 154 C49 168 47 182 47 195 L57 195 C60 182 63 168 65 154 Z'],
  ['karin', 'M88 120 h10 v14 h-10 z'],
  ['karin', 'M88 137 h10 v15 h-10 z'],
  ['karin', 'M88 155 h10 v15 h-10 z'],
  ['karin', 'M88 173 h10 v22 c-5-2-9-7-10-12 z'],
  ['karin', 'M85 120 L76 118 C75 136 75 154 76 172 L85 184 Z'],
  ['bacak', 'M76 212 C70 236 70 262 76 286 L86 286 C84 260 85 236 90 216 Z'],
  ['bacak', 'M92 220 L99 224 C99 248 97 268 93 286 L89 286 C87 262 87 238 92 220 Z'],
  ['bacak', 'M76 310 C72 332 74 356 79 380 L90 380 C92 356 93 332 91 310 Z'],
];

const BACK = [
  ['sirt', 'M100 50 L90 57 L80 66 L92 76 L100 106 Z'],
  ['omuz', 'M78 64 C66 64 57 72 55 86 C54 96 55 104 57 110 L66 104 C68 92 72 82 79 72 Z'],
  ['sirt', 'M93 80 L77 80 C73 96 74 114 78 130 L92 150 L97 150 L97 112 Z'],
  ['sirt', 'M90 154 L98 154 L98 192 L88 190 C88 178 88 166 90 154 Z'],
  ['kol', 'M56 114 C53 126 52 138 53 150 L64 150 C67 138 69 126 69 116 Z'],
  ['kol', 'M52 154 C49 168 47 182 47 195 L57 195 C60 182 63 168 65 154 Z'],
  ['bacak', 'M99 198 C88 196 78 200 75 212 C74 226 84 236 99 234 Z'],
  ['bacak', 'M76 240 C72 258 73 274 77 288 L86 288 C85 272 86 256 88 240 Z'],
  ['bacak', 'M90 240 L98 240 C99 256 98 272 96 288 L88 288 C88 272 88 256 90 240 Z'],
  ['bacak', 'M76 310 C70 326 71 346 79 362 L91 362 C95 346 94 326 91 310 Z'],
];

function figure(parts, levels, label) {
  const half = parts.map(([r, d]) => `<path class="mm l${levels[r] || 0}" data-r="${r}" d="${d}"/>`).join('');
  return `<figure class="bm-fig">
    <svg viewBox="40 4 120 400" role="img" aria-label="${label}">
      <g class="bm-base">${BASE}<g transform="matrix(-1 0 0 1 200 0)">${BASE}</g></g>
      <g>${half}</g><g transform="matrix(-1 0 0 1 200 0)">${half}</g>
    </svg>
    <figcaption>${label}</figcaption></figure>`;
}

export function bodyMap(levels) {
  return `<div class="bodymap">${figure(FRONT, levels, 'Ön')}${figure(BACK, levels, 'Arka')}</div>`;
}
