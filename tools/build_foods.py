"""foods.js besin değerlerini USDA FoodData Central (SR Legacy, kamu malı / CC0) verilerinden üretir.

- Tek malzemeli besinler doğrudan USDA kaydından alınır (kaynak: "u:<fdcId>").
- Karma Türk yemekleri standart ev tariflerinden hesaplanır: malzemelerin USDA değerleri toplanır,
  pişmiş toplam ağırlığa bölünür (pişirmedeki su kaybı/kazancı "verim" ile hesaba katılır; kaynak: "r").
- USDA karşılığı olmayan birkaç Türk ürünü (lokum, sucuk, labne…) tipik değerlerle kalır (kaynak: "m").
- Kendi tarifini oluşturmak için ham malzemeler "malzeme" kategorisinde eklenir.

Kullanım (repo kökünden): python tools/build_foods.py
USDA alt kümesi tools/usda_subset.json dosyasındadır. Tam veriden yeniden çıkarmak için:
python tools/build_foods.py --usda <usda_compact.json>
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBSET = os.path.join(ROOT, 'tools', 'usda_subset.json')

# Malzemeler: anahtar → (USDA fdcId, Türkçe ad, ev ölçüleri)
ING = {
    'kirmizi_mercimek': (174284, 'Kırmızı mercimek (kuru)', 'su bardağı:190'),
    'yesil_mercimek': (172420, 'Yeşil mercimek (kuru)', 'su bardağı:190'),
    'bulgur': (170688, 'Bulgur (çiğ)', 'su bardağı:170'),
    'pirinc': (168877, 'Pirinç (çiğ)', 'su bardağı:180'),
    'pirinc_esmer': (169703, 'Esmer pirinç (çiğ)', 'su bardağı:185'),
    'un': (168894, 'Buğday unu', 'su bardağı:120|yemek kaşığı:10'),
    'tam_un': (168893, 'Tam buğday unu', 'su bardağı:120'),
    'irmik': (169715, 'İrmik', 'su bardağı:170'),
    'nisasta': (169698, 'Mısır nişastası', 'yemek kaşığı:10'),
    'nohut_kuru': (173756, 'Nohut (kuru)', 'su bardağı:200'),
    'fasulye_kuru': (175202, 'Kuru fasulye (kuru)', 'su bardağı:190'),
    'makarna_kuru': (169736, 'Makarna (kuru)', 'paket:500'),
    'eriste': (169731, 'Erişte / şehriye (kuru)', 'su bardağı:100'),
    'kuskus': (169699, 'Kuskus (kuru)', 'su bardağı:175'),
    'zeytinyagi': (171413, 'Zeytinyağı / sıvı yağ', 'yemek kaşığı:13.5|tatlı kaşığı:5'),
    'tereyagi': (173410, 'Tereyağı', 'yemek kaşığı:14'),
    'sogan': (170000, 'Soğan', 'adet:110'),
    'domates': (170457, 'Domates', 'adet:120'),
    'salca': (170459, 'Domates salçası', 'yemek kaşığı:16'),
    'biber': (170427, 'Yeşil biber', 'adet:30'),
    'aci_biber': (170106, 'Kırmızı acı biber', 'adet:30'),
    'sarimsak': (169230, 'Sarımsak', 'diş:5'),
    'havuc': (170393, 'Havuç', 'adet:70'),
    'patates': (170026, 'Patates (çiğ)', 'adet:170'),
    'patlican': (169228, 'Patlıcan', 'adet:300'),
    'kabak': (169291, 'Kabak', 'adet:200'),
    'ispanak': (168462, 'Ispanak', 'demet:500'),
    'taze_fasulye': (169961, 'Taze fasulye', 'avuç:60'),
    'bezelye': (170419, 'Bezelye', 'su bardağı:145'),
    'enginar': (169205, 'Enginar', 'adet:130'),
    'limon': (167747, 'Limon suyu', 'yemek kaşığı:15'),
    'salatalik': (168409, 'Salatalık', 'adet:150'),
    'marul': (169247, 'Marul', 'yaprak:15'),
    'maydanoz': (170416, 'Maydanoz', 'demet:50'),
    'nane': (172239, 'Kuru nane', 'tatlı kaşığı:1'),
    'asma_yapragi': (168575, 'Asma yaprağı', 'yaprak:4'),
    'kiyma_dana': (171796, 'Dana kıyma (orta yağlı, çiğ)', 'porsiyon:100'),
    'kiyma_yagsiz': (171790, 'Dana kıyma (yağsız, çiğ)', 'porsiyon:100'),
    'kuzu_kiyma': (174370, 'Kuzu kıyma (çiğ)', 'porsiyon:100'),
    'dana_kusbasi': (174051, 'Dana kuşbaşı (çiğ)', 'porsiyon:100'),
    'tavuk_gogus': (171077, 'Tavuk göğsü (çiğ)', 'adet:200'),
    'tavuk_but': (173627, 'Tavuk but (çiğ, derisiz)', 'adet:100'),
    'iskembe': (170599, 'İşkembe (çiğ)', 'porsiyon:100'),
    'levrek': (175142, 'Levrek / çipura (çiğ)', 'adet:300'),
    'hamsi': (174182, 'Hamsi (çiğ)', 'porsiyon:200'),
    'somon': (175167, 'Somon (çiğ)', 'porsiyon:150'),
    'yumurta': (171287, 'Yumurta (çiğ)', 'adet:50'),
    'sut': (171265, 'Süt (tam yağlı)', 'su bardağı:200'),
    'yogurt': (171284, 'Yoğurt', 'su bardağı:200|yemek kaşığı:20'),
    'beyaz_peynir': (173420, 'Beyaz peynir', 'dilim:30'),
    'kasar': (170850, 'Kaşar peyniri', 'dilim:20'),
    'mozzarella': (170845, 'Tatlı peynir / mozzarella', 'dilim:30'),
    'krema': (170859, 'Krema', 'yemek kaşığı:15'),
    'seker': (169655, 'Şeker', 'yemek kaşığı:12|su bardağı:200'),
    'bal': (169640, 'Bal', 'yemek kaşığı:21'),
    'pekmez': (168820, 'Pekmez', 'yemek kaşığı:20'),
    'tahin': (170189, 'Tahin', 'yemek kaşığı:15'),
    'maya': (175043, 'Kuru maya', 'paket:10'),
    'ceviz': (170187, 'Ceviz içi', 'avuç:30'),
    'antep': (170184, 'Antep fıstığı (iç)', 'avuç:30'),
    'findik': (170581, 'Fındık (iç)', 'avuç:30'),
    'badem': (170567, 'Badem', 'avuç:30'),
    'fistik': (172430, 'Yer fıstığı', 'avuç:30'),
    'kuru_kayisi': (173941, 'Kuru kayısı', 'adet:8'),
    'kuru_uzum': (168165, 'Kuru üzüm', 'yemek kaşığı:12'),
    'bugday': (169721, 'Aşurelik buğday', 'su bardağı:180'),
    'yufka': (172791, 'Yufka / baklava yufkası', 'yaprak:60'),
    'ekmek': (174924, 'Beyaz ekmek', 'dilim:30'),
    'pide_ekmegi': (174915, 'Pide / lavaş ekmeği', 'adet:60'),
    'su': (173647, 'Su', 'su bardağı:200'),
    'tuz': (173468, 'Tuz', 'tatlı kaşığı:5'),
    'kakao': (169593, 'Kakao', 'yemek kaşığı:6'),
}

# Tek malzemeli besinler: foods.js id → USDA fdcId
DIRECT = {
    'egg': 173424, 'fried-egg': 173423, 'honey': 169640, 'jam': 169641, 'butter': 173410, 'tahini': 170189, 'molasses': 168820,
    'pb': 172470, 'oats': 173904, 'granola': 171646, 'pancake': 175009, 'white-bread': 174924, 'ww-bread': 172688, 'rye-bread': 172684,
    'chicken-breast': 171477, 'chicken-leg': 173625, 'steak': 171811, 'grilled-fish': 173694, 'salmon': 175168, 'tuna': 173709,
    'boiled-chickpea': 173757, 'hummus': 174289, 'white-cheese': 173420, 'kasar': 170850, 'baked-potato': 170093, 'boiled-potato': 170440,
    'corn': 169999, 'boiled-veg': 169967, 'apple': 171688, 'banana': 173944, 'orange': 169097, 'tangerine': 169105, 'strawberry': 167762,
    'grape': 174683, 'watermelon': 167765, 'melon': 169092, 'pear': 167776, 'peach': 169928, 'apricot': 171697, 'cherry': 171719, 'fig': 173021,
    'pomegranate': 169134, 'kiwi': 168153, 'dried-apricot': 173941, 'raisin': 168165, 'date': 171726, 'avocado': 171705, 'tomato': 170457,
    'cucumber': 168409, 'pepper': 170427, 'carrot': 170393, 'milk': 171265, 'milk-low': 171267, 'yogurt': 171284, 'greek': 171304,
    'greek-light': 170894, 'milk-choc': 167587, 'dark-choc': 170273, 'biscuit': 174950, 'cake': 172704, 'helva': 167996, 'walnut': 170187,
    'almond': 170567, 'hazelnut': 170581, 'peanut': 172430, 'pistachio': 170184, 'cashew': 170162, 'sunflower': 170562, 'popcorn': 167959,
    'chips': 169677, 'olive-oil': 171413, 'mayo': 171009, 'ketchup': 168556, 'sugar': 169655, 'juice': 169098, 'beer': 168746, 'wine': 171925,
    'tea': 173227, 'coffee': 171890, 'filter-coffee': 171890, 'energy': 173210, 'pizza': 170317, 'fries': 170698, 'lavash': 174915,
}

# Tarifler: foods.js id → ([(malzeme, gram)], pişmiş toplam ağırlık g)
R = {
    'lentil-soup': ([('kirmizi_mercimek', 200), ('sogan', 100), ('havuc', 80), ('patates', 100), ('tereyagi', 20), ('zeytinyagi', 15), ('un', 15), ('salca', 15), ('su', 1400), ('tuz', 10)], 1500),
    'ezogelin': ([('kirmizi_mercimek', 150), ('bulgur', 40), ('pirinc', 30), ('sogan', 100), ('salca', 30), ('tereyagi', 25), ('nane', 3), ('su', 1500), ('tuz', 10)], 1550),
    'chicken-soup': ([('tavuk_gogus', 200), ('eriste', 60), ('havuc', 60), ('tereyagi', 15), ('un', 15), ('limon', 20), ('su', 1500), ('tuz', 10)], 1500),
    'yayla': ([('yogurt', 400), ('pirinc', 80), ('yumurta', 50), ('un', 30), ('tereyagi', 20), ('nane', 3), ('su', 1200), ('tuz', 8)], 1500),
    'tomato-soup': ([('domates', 800), ('salca', 20), ('un', 25), ('tereyagi', 30), ('sut', 200), ('su', 600), ('tuz', 8)], 1400),
    'veg-soup': ([('patates', 200), ('havuc', 150), ('kabak', 150), ('sogan', 100), ('bezelye', 100), ('zeytinyagi', 25), ('su', 1300), ('tuz', 8)], 1700),
    'iskembe': ([('iskembe', 400), ('un', 30), ('tereyagi', 30), ('yumurta', 50), ('limon', 30), ('sarimsak', 10), ('su', 1500), ('tuz', 8)], 1500),
    'tarhana': ([('un', 70), ('yogurt', 60), ('domates', 40), ('salca', 20), ('tereyagi', 25), ('su', 1300), ('tuz', 6)], 1300),
    'menemen': ([('domates', 400), ('biber', 150), ('yumurta', 200), ('zeytinyagi', 25), ('tereyagi', 10), ('tuz', 3)], 650),
    'simit': ([('un', 500), ('su', 300), ('maya', 7), ('pekmez', 80), ('tahin', 70), ('tuz', 8)], 770),
    'pogaca': ([('un', 500), ('yogurt', 150), ('tereyagi', 120), ('zeytinyagi', 60), ('yumurta', 60), ('beyaz_peynir', 150), ('maya', 10)], 950),
    'su-boregi': ([('yufka', 400), ('beyaz_peynir', 250), ('tereyagi', 80), ('yumurta', 100), ('sut', 150)], 900),
    'gozleme': ([('un', 250), ('su', 150), ('beyaz_peynir', 150), ('tereyagi', 20), ('tuz', 3)], 520),
    'tahin-pekmez': ([('tahin', 50), ('pekmez', 50)], 100),
    'rice': ([('pirinc', 400), ('tereyagi', 40), ('zeytinyagi', 15), ('su', 600), ('tuz', 8)], 1150),
    'bulgur': ([('bulgur', 400), ('sogan', 80), ('biber', 60), ('domates', 150), ('salca', 20), ('tereyagi', 30), ('zeytinyagi', 20), ('su', 700), ('tuz', 8)], 1350),
    'pasta': ([('makarna_kuru', 100), ('su', 130)], 230),
    'pasta-sauce': ([('makarna_kuru', 500), ('domates', 300), ('salca', 20), ('zeytinyagi', 30), ('sarimsak', 10), ('su', 650)], 1550),
    'eriste': ([('eriste', 250), ('tereyagi', 30), ('su', 370)], 650),
    'couscous': ([('kuskus', 100), ('su', 240)], 335),
    'bean': ([('fasulye_kuru', 500), ('sogan', 150), ('salca', 40), ('zeytinyagi', 60), ('su', 1500), ('tuz', 10)], 2000),
    'bean-meat': ([('fasulye_kuru', 500), ('dana_kusbasi', 250), ('sogan', 150), ('salca', 40), ('zeytinyagi', 40), ('su', 1500), ('tuz', 10)], 2200),
    'chickpea': ([('nohut_kuru', 400), ('sogan', 150), ('salca', 40), ('zeytinyagi', 50), ('su', 1400), ('tuz', 8)], 1700),
    'chickpea-meat': ([('nohut_kuru', 400), ('dana_kusbasi', 250), ('sogan', 150), ('salca', 40), ('zeytinyagi', 35), ('su', 1400), ('tuz', 8)], 1900),
    'green-lentil': ([('yesil_mercimek', 400), ('sogan', 150), ('salca', 30), ('zeytinyagi', 50), ('bulgur', 60), ('su', 1400), ('tuz', 8)], 1700),
    'kofte': ([('kiyma_dana', 500), ('sogan', 100), ('ekmek', 60), ('yumurta', 50), ('tuz', 8)], 530),
    'mince': ([('kiyma_yagsiz', 200)], 150),
    'chicken-saute': ([('tavuk_gogus', 500), ('biber', 200), ('domates', 200), ('sogan', 100), ('zeytinyagi', 30), ('tuz', 6)], 850),
    'tas-kebab': ([('dana_kusbasi', 500), ('sogan', 150), ('salca', 30), ('tereyagi', 30), ('patates', 200), ('su', 300), ('tuz', 6)], 1050),
    'karniyarik': ([('patlican', 600), ('zeytinyagi', 80), ('kiyma_dana', 250), ('sogan', 100), ('domates', 200), ('biber', 80), ('tuz', 6)], 1100),
    'musakka': ([('patlican', 600), ('zeytinyagi', 70), ('kiyma_dana', 250), ('sogan', 100), ('domates', 200), ('tuz', 6)], 1100),
    'manti': ([('un', 250), ('yumurta', 50), ('su', 100), ('kiyma_dana', 150), ('sogan', 50), ('yogurt', 300), ('tereyagi', 30), ('salca', 10)], 950),
    'lahmacun': ([('un', 300), ('maya', 5), ('su', 180), ('kiyma_dana', 200), ('sogan', 100), ('domates', 150), ('biber', 60), ('maydanoz', 20), ('salca', 20), ('zeytinyagi', 15)], 760),
    'pide-mince': ([('un', 300), ('su', 180), ('maya', 5), ('kiyma_dana', 200), ('sogan', 80), ('domates', 80), ('tereyagi', 25)], 780),
    'pide-cheese': ([('un', 300), ('su', 180), ('maya', 5), ('kasar', 200), ('yumurta', 50), ('tereyagi', 25)], 720),
    'chicken-doner': ([('tavuk_but', 1000), ('yogurt', 100), ('zeytinyagi', 50), ('tuz', 12)], 800),
    'meat-doner': ([('kiyma_dana', 1000), ('yogurt', 100), ('sogan', 100), ('tuz', 12)], 750),
    # Izgarada yağın bir kısmı süzülür: verim, ağırlık kaybından biraz yüksek tutuldu
    'adana': ([('kuzu_kiyma', 800), ('aci_biber', 50), ('tuz', 10)], 680),
    'chicken-shish': ([('tavuk_gogus', 800), ('yogurt', 100), ('zeytinyagi', 40), ('salca', 20), ('tuz', 8)], 700),
    'iskender': ([('kiyma_dana', 400), ('pide_ekmegi', 150), ('yogurt', 150), ('tereyagi', 30), ('salca', 20), ('domates', 50)], 700),
    'hunkar': ([('dana_kusbasi', 400), ('domates', 200), ('sogan', 100), ('tereyagi', 70), ('patlican', 700), ('sut', 300), ('un', 40), ('kasar', 60)], 1450),
    'tantuni': ([('dana_kusbasi', 300), ('pide_ekmegi', 240), ('domates', 150), ('sogan', 80), ('zeytinyagi', 30)], 760),
    'icli-kofte': ([('bulgur', 300), ('irmik', 50), ('kiyma_dana', 300), ('sogan', 150), ('ceviz', 60), ('zeytinyagi', 80), ('su', 150)], 1000),
    'cig-kofte': ([('bulgur', 300), ('salca', 80), ('sogan', 100), ('zeytinyagi', 60), ('pekmez', 30), ('maydanoz', 40), ('su', 300)], 900),
    'hamsi': ([('hamsi', 500), ('un', 60), ('zeytinyagi', 60), ('tuz', 6)], 520),
    'cacik': ([('yogurt', 400), ('salatalik', 200), ('sarimsak', 5), ('zeytinyagi', 10), ('su', 100)], 715),
    'shepherd': ([('domates', 300), ('salatalik', 200), ('biber', 60), ('sogan', 60), ('maydanoz', 20), ('zeytinyagi', 30), ('limon', 20)], 690),
    'green-beans': ([('taze_fasulye', 500), ('domates', 200), ('sogan', 100), ('zeytinyagi', 60), ('seker', 5), ('su', 150)], 900),
    'artichoke': ([('enginar', 500), ('havuc', 100), ('patates', 100), ('bezelye', 80), ('zeytinyagi', 60), ('limon', 30), ('seker', 10), ('su', 200)], 950),
    'spinach': ([('ispanak', 600), ('sogan', 100), ('pirinc', 40), ('salca', 15), ('zeytinyagi', 40), ('su', 100)], 750),
    'turlu': ([('patlican', 200), ('kabak', 200), ('patates', 200), ('taze_fasulye', 150), ('biber', 100), ('domates', 250), ('sogan', 100), ('zeytinyagi', 60)], 1150),
    'imam': ([('patlican', 600), ('sogan', 250), ('domates', 250), ('sarimsak', 20), ('zeytinyagi', 120), ('seker', 5)], 1000),
    'mucver': ([('kabak', 500), ('yumurta', 100), ('un', 80), ('beyaz_peynir', 80), ('maydanoz', 20), ('zeytinyagi', 70)], 650),
    'potato-dish': ([('patates', 600), ('sogan', 100), ('salca', 25), ('zeytinyagi', 40), ('su', 300)], 950),
    'peas': ([('bezelye', 500), ('havuc', 100), ('patates', 100), ('sogan', 80), ('zeytinyagi', 40), ('su', 250)], 900),
    'sarma': ([('pirinc', 250), ('sogan', 200), ('zeytinyagi', 80), ('asma_yapragi', 150), ('kuru_uzum', 30), ('seker', 10), ('su', 500)], 1050),
    'stuffed-pepper': ([('biber', 500), ('kiyma_dana', 250), ('pirinc', 120), ('sogan', 100), ('domates', 150), ('salca', 20), ('zeytinyagi', 30), ('su', 300)], 1250),
    'sutlac': ([('sut', 1000), ('pirinc', 80), ('seker', 150), ('nisasta', 30)], 1100),
    'kazandibi': ([('sut', 1000), ('seker', 160), ('nisasta', 60), ('un', 40), ('tereyagi', 15)], 1150),
    'asure': ([('bugday', 250), ('nohut_kuru', 80), ('fasulye_kuru', 80), ('seker', 400), ('kuru_kayisi', 100), ('kuru_uzum', 80), ('ceviz', 60), ('findik', 40), ('su', 2500)], 2600),
    'revani': ([('irmik', 250), ('un', 150), ('yogurt', 200), ('yumurta', 150), ('seker', 700), ('su', 600)], 1700),
    'baklava': ([('yufka', 500), ('tereyagi', 300), ('antep', 250), ('seker', 700), ('su', 450)], 1700),
    'kunefe': ([('yufka', 250), ('mozzarella', 250), ('tereyagi', 120), ('seker', 350), ('su', 300)], 1150),
    'ayran': ([('yogurt', 500), ('su', 500), ('tuz', 5)], 1000),
    'bazlama': ([('un', 500), ('yogurt', 150), ('su', 200), ('maya', 10), ('zeytinyagi', 15), ('tuz', 8)], 760),
    'pide-bread': ([('un', 500), ('su', 320), ('maya', 10), ('zeytinyagi', 15), ('yumurta', 25), ('tuz', 8)], 760),
    'yufka': ([('un', 500), ('su', 250), ('tuz', 8)], 700),
}


def load_usda(argv):
    if '--usda' in argv:
        full = json.load(open(argv[argv.index('--usda') + 1], encoding='utf-8'))
        ids = {str(v[0]) for v in ING.values()} | {str(v) for v in DIRECT.values()}
        sub = {i: full[i] for i in ids if i in full}
        missing = ids - set(sub)
        if missing:
            raise SystemExit(f'USDA verisinde yok: {missing}')
        json.dump(sub, open(SUBSET, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        return sub
    return json.load(open(SUBSET, encoding='utf-8'))


def r1(x):
    return round(x + 1e-9, 1) if x < 100 else round(x)


def main():
    U = load_usda(sys.argv)
    path = os.path.join(ROOT, 'foods.js')
    src = open(path, encoding='utf-8').read()
    a = src.index('const RAW = `') + len('const RAW = `')
    b = src.index('`;', a)
    lines = [l for l in src[a:b].strip().split('\n') if l and not l.split('|')[0].startswith('ing-')]
    out, changed = [], []
    for line in lines:
        p = line.split('|')
        fid = p[0]
        # Kaynak alanı (son alan) varsa çıkar
        tail = p[6:]
        while tail and re.fullmatch(r'(u:\d+|r|m)', tail[-1] or ''):
            tail.pop()
        if fid in DIRECT:
            u = U[str(DIRECT[fid])]
            vals, srcf = (u['kcal'], u['p'], u['c'], u['f']), f'u:{DIRECT[fid]}'
        elif fid in R:
            items, yld = R[fid]
            tot = [0, 0, 0, 0]
            for k, g in items:
                u = U[str(ING[k][0])]
                for i, key in enumerate(('kcal', 'p', 'c', 'f')):
                    tot[i] += u[key] * g / 100
            vals, srcf = tuple(x * 100 / yld for x in tot), 'r'
        else:
            vals, srcf = tuple(float(x) for x in p[2:6]), 'm'
        old = float(p[2])
        if srcf != 'm' and abs(vals[0] - old) / max(old, 1) > 0.2:
            changed.append(f'{fid}: {old:g} → {vals[0]:.0f} kcal')
        while len(tail) < 2 and not any(':' not in t for t in tail[-2:]):
            break
        out.append('|'.join([fid, p[1], *(f'{r1(v):g}' for v in vals), *tail, srcf]))
    # Kendi tarifin için ham malzemeler
    for k, (fdc, name, units) in ING.items():
        if k in ('su', 'tuz'):
            continue
        u = U[str(fdc)]
        out.append('|'.join([f'ing-{k}', name, *(f'{r1(u[x]):g}' for x in ('kcal', 'p', 'c', 'f')), units, 'malzeme', '', f'u:{fdc}']))
    new = src[:a] + '\n' + '\n'.join(out) + '\n' + src[b:]
    open(path, 'w', encoding='utf-8').write(new)
    print(f'{len(lines)} besin güncellendi, {len(ING) - 2} malzeme eklendi')
    print('Büyük değişiklikler (%20+):')
    for c in changed:
        print('  ', c)


if __name__ == '__main__':
    main()
