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
    'yulaf': (173904, 'Yulaf ezmesi', 'su bardağı:80|yemek kaşığı:10'),
    'misir_unu': (169697, 'Mısır unu', 'su bardağı:130'),
    'pirinc_unu': (169714, 'Pirinç unu', 'yemek kaşığı:10'),
    'barbunya_kuru': (175189, 'Barbunya (kuru)', 'su bardağı:190'),
    'bakla_kuru': (175205, 'Kuru bakla (fava için)', 'su bardağı:170'),
    'mantar': (169251, 'Mantar', 'su bardağı:70|adet:18'),
    'brokoli': (170379, 'Brokoli', 'baş:300|su bardağı:90'),
    'karnabahar': (169986, 'Karnabahar', 'baş:700|su bardağı:100'),
    'pirasa': (169246, 'Pırasa', 'adet:200'),
    'kereviz': (170400, 'Kereviz (kök)', 'adet:400'),
    'lahana': (169975, 'Beyaz lahana', 'yaprak:40|su bardağı:90'),
    'bamya': (169260, 'Bamya', 'su bardağı:100|avuç:60'),
    'borulce': (168405, 'Taze börülce', 'avuç:60'),
    'balkabagi': (168448, 'Bal kabağı', 'dilim:200'),
    'kapya': (170108, 'Kırmızı kapya biber', 'adet:150'),
    'misir_konserve': (169214, 'Mısır (konserve, süzülmüş)', 'yemek kaşığı:15|kutu:220'),
    'taze_sogan': (170005, 'Taze soğan', 'adet:15'),
    'dereotu': (172233, 'Dereotu', 'demet:40'),
    'roka': (169387, 'Roka', 'demet:60'),
    'semizotu': (169274, 'Semizotu', 'demet:250'),
    'ayva': (168163, 'Ayva', 'adet:300'),
    'muz': (173944, 'Muz', 'adet:120'),
    'cilek': (167762, 'Çilek', 'su bardağı:150'),
    'yesil_zeytin': (169096, 'Yeşil zeytin', 'adet:4'),
    'tursu': (168558, 'Salatalık turşusu', 'adet:40'),
    'kus_uzumu': (171724, 'Kuş üzümü', 'yemek kaşığı:10'),
    'cam_fistigi': (170591, 'Çam fıstığı', 'yemek kaşığı:9'),
    'chia': (170554, 'Chia tohumu', 'yemek kaşığı:12'),
    'kuzu_kusbasi': (172508, 'Kuzu kuşbaşı (çiğ)', 'porsiyon:100'),
    'tavuk_derili': (171447, 'Tavuk (derili, çiğ)', 'porsiyon:250'),
    'dana_ciger': (169451, 'Dana ciğer (çiğ)', 'porsiyon:100'),
    'midye': (174216, 'Midye (çiğ, ayıklanmış)', 'adet:10'),
    'karides': (175179, 'Karides (çiğ, ayıklanmış)', 'adet:10|porsiyon:150'),
    'uskumru': (175119, 'Uskumru (çiğ)', 'fileto:150'),
    'ton_konserve': (173709, 'Ton balığı (suda, süzülmüş)', 'kutu:120'),
    'sosis': (173862, 'Sosis', 'adet:40'),
    'suzme_yogurt': (171304, 'Süzme yoğurt', 'yemek kaşığı:25'),
    'krem_peynir': (173418, 'Krem peynir', 'yemek kaşığı:15'),
    'parmesan': (171247, 'Parmesan peyniri', 'yemek kaşığı:5'),
    'whey': (173180, 'Whey protein tozu', 'ölçek:30'),
    'mayonez': (171009, 'Mayonez', 'yemek kaşığı:15'),
    'ketcap': (168556, 'Ketçap', 'yemek kaşığı:17'),
    'biskuvi': (174950, 'Bisküvi (sade)', 'adet:8'),
    'kruton': (172751, 'Kıtır ekmek (kruton)', 'avuç:15'),
    'ekmek_hamburger': (172796, 'Hamburger / sandviç ekmeği', 'adet:60'),
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
    'egg-white': 172183, 'scrambled': 172187, 'cream-cheese': 173418, 'cream-cheese-light': 169079, 'cottage': 172179,
    'goat-cheese': 173433, 'mozzarella': 170845, 'parmesan': 171247, 'cheddar': 173414, 'sausage': 174614, 'salami': 172935,
    'turkey-ham': 172941, 'nut-spread': 168000, 'choco-cereal': 172973, 'porridge-water': 173905, 'sourdough': 172675,
    'multigrain': 168013, 'oat-bread': 172678, 'burger-bun': 172796, 'croissant': 174987, 'tortilla': 175037, 'ww-lavash': 174916,
    'turkey-breast': 171496, 'turkey-mince': 171506, 'ribeye': 171209, 'lamb-tandir': 174312, 'lamb-shank': 172482, 'chicken-wing': 173630,
    'roast-chicken': 171450, 'chicken-thigh': 172388, 'boiled-chicken': 171478, 'fried-chicken': 171475, 'beef-liver': 168627,
    'chicken-liver': 174491, 'burger-patty': 171797, 'sardine': 175139, 'mackerel': 175120, 'shrimp': 175180, 'calamari': 171982,
    'trout': 173718, 'bluefish': 174229, 'whiting': 175161, 'tuna-oil': 173708, 'palamut': 173674, 'mullet': 175124, 'turbot': 174245,
    'smoked-salmon': 173687, 'mussels': 174217, 'octopus': 174249, 'cod': 171956, 'falafel': 172455, 'boiled-lentil': 172421,
    'boiled-white-bean': 175203, 'boiled-cowpea': 173759, 'canned-chickpea': 173800, 'cabbage': 169975, 'red-cabbage': 169977,
    'mushroom': 169251, 'arugula': 169387, 'purslane': 169274, 'radish': 169276, 'beet': 169146, 'canned-corn': 169214, 'lettuce': 169247,
    'spring-onion': 170005, 'onion': 170000, 'red-pepper': 170108, 'pickle': 168558, 'sauerkraut': 169279, 'spinach-raw': 168462,
    'parsley': 170416, 'plain-rice': 168935, 'quinoa': 168917, 'buckwheat': 170686, 'boiled-bulgur': 170287, 'mashed': 168555,
    'sweet-potato': 168483, 'cheeseburger': 170692, 'chicken-burger': 170318, 'nuggets': 172112, 'onion-rings': 170697, 'lasagna': 169850,
    'margherita': 170373, 'mixed-pizza': 170762, 'wedges': 169264, 'cheesecake': 172711, 'brownie': 172713, 'choco-cake': 174934,
    'apple-pie': 175012, 'donut': 172758, 'muffin': 172765, 'waffle': 175039, 'sponge-cake': 172707, 'frozen-yogurt': 168105,
    'white-choc': 167571, 'wafer': 167992, 'cream-wafer': 172736, 'sandwich-cookie': 172718, 'graham': 174957, 'gummy': 167989,
    'hard-candy': 167990, 'candy-bar': 169589, 'mixed-nuts': 168599, 'pumpkin-seed': 169415, 'chia': 170554, 'flax': 169414,
    'sesame': 170150, 'chestnut': 170190, 'banana-chips': 168849, 'coconut': 170170, 'tortilla-chips': 167558, 'microwave-popcorn': 173141,
    'pretzel': 167555, 'rice-cake': 170250, 'saltine': 172746, 'ww-cracker': 172749, 'granola-bar': 167954, 'pine-nut': 170591,
    'plum': 169949, 'sour-cherry': 173954, 'quince': 168163, 'mango': 169910, 'pineapple': 169124, 'blueberry': 171711,
    'raspberry': 167755, 'grapefruit': 173033, 'blackberry': 173946, 'mulberry': 169913, 'persimmon': 169941, 'nectarine': 169914,
    'lemon': 167746, 'loquat': 169908, 'dried-fig': 174665, 'prune': 168162, 'dried-apple': 171691, 'dried-cranberry': 171723,
    'skim-milk': 171269, 'choc-milk': 170879, 'goat-milk': 171278, 'soy-milk': 172446, 'almond-milk': 174832, 'fruit-yogurt': 170889,
    'lemon-soda': 173205, 'mineral-water': 174842, 'orange-soda': 174854, 'tonic': 171869, 'apple-juice': 167771, 'cherry-juice': 167807,
    'peach-juice': 168185, 'pomegranate-juice': 167787, 'tomato-juice': 170458, 'carrot-juice': 170491, 'grape-juice': 173042,
    'pineapple-juice': 168187, 'lemonade': 173217, 'sports-drink': 173660, 'energy-zero': 171870, 'espresso': 171891, 'hot-choc': 171277,
    'green-tea': 171917, 'herbal-tea': 173232, 'raki': 171920, 'spirits': 174815, 'milkshake': 170884, 'coconut-water': 174831,
    'margarine': 171436, 'sunflower-oil': 171017, 'mustard': 172234, 'soy-sauce': 174277, 'pesto': 171579, 'dressing': 171019,
    'caesar-dressing': 169055, 'choc-syrup': 168835, 'cream': 170859, 'whipped-cream': 170860, 'sour-cream': 171257,
    'tomato-paste': 170459, 'pasta-sauce-jar': 171192,
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
    # Kahvaltılık
    'cheese-omelet': ([('yumurta', 150), ('beyaz_peynir', 40), ('tereyagi', 10), ('sut', 20)], 200),
    'veg-omelet': ([('yumurta', 150), ('biber', 40), ('domates', 60), ('sogan', 30), ('mantar', 40), ('zeytinyagi', 10)], 280),
    'cilbir': ([('yumurta', 100), ('yogurt', 150), ('sarimsak', 3), ('tereyagi', 15), ('aci_biber', 2)], 260),
    'muhlama': ([('tereyagi', 60), ('misir_unu', 50), ('kasar', 150), ('su', 150)], 340),
    'porridge-milk': ([('yulaf', 40), ('sut', 200)], 230),
    'overnight-oats': ([('yulaf', 40), ('sut', 120), ('yogurt', 80), ('chia', 10), ('muz', 60), ('bal', 10)], 320),
    # Ekmek ve hamur işleri
    'village-bread': ([('un', 300), ('tam_un', 200), ('su', 330), ('maya', 8), ('tuz', 10)], 740),
    'corn-bread': ([('misir_unu', 500), ('su', 400), ('yogurt', 100), ('zeytinyagi', 30), ('tuz', 8)], 880),
    'olive-pogaca': ([('un', 500), ('yogurt', 150), ('tereyagi', 100), ('zeytinyagi', 80), ('yumurta', 60), ('yesil_zeytin', 150), ('maya', 10)], 950),
    'potato-pogaca': ([('un', 500), ('yogurt', 150), ('tereyagi', 100), ('zeytinyagi', 80), ('yumurta', 60), ('patates', 250), ('sogan', 30), ('maya', 10)], 1050),
    # Kızartmada emilen yağ: hamurun ~%20'si
    'pisi': ([('un', 500), ('su', 300), ('maya', 10), ('tuz', 8), ('zeytinyagi', 120)], 830),
    'tahinli-corek': ([('un', 500), ('tahin', 150), ('seker', 120), ('tereyagi', 80), ('sut', 150), ('maya', 10), ('yumurta', 50)], 950),
    'sigara-boregi': ([('yufka', 180), ('beyaz_peynir', 200), ('maydanoz', 20), ('zeytinyagi', 90)], 470),
    'kol-boregi': ([('yufka', 360), ('patates', 500), ('sogan', 100), ('zeytinyagi', 100), ('sut', 150), ('yumurta', 50)], 1050),
    'kiymali-borek': ([('yufka', 360), ('kiyma_dana', 300), ('sogan', 150), ('zeytinyagi', 80), ('sut', 150), ('yumurta', 100)], 950),
    'ispanakli-borek': ([('yufka', 360), ('ispanak', 500), ('sogan', 100), ('beyaz_peynir', 150), ('zeytinyagi', 80), ('sut', 150), ('yumurta', 100)], 1050),
    'patates-gozleme': ([('un', 250), ('su', 150), ('patates', 250), ('sogan', 50), ('tereyagi', 30), ('tuz', 3)], 620),
    'kiymali-gozleme': ([('un', 250), ('su', 150), ('kiyma_dana', 150), ('sogan', 60), ('tereyagi', 20), ('tuz', 3)], 540),
    'ispanakli-gozleme': ([('un', 250), ('su', 150), ('ispanak', 300), ('sogan', 50), ('beyaz_peynir', 80), ('tereyagi', 20)], 640),
    # Çorbalar
    'sehriye-soup': ([('eriste', 80), ('tereyagi', 20), ('salca', 15), ('domates', 100), ('su', 1300), ('tuz', 8)], 1350),
    'dugun-soup': ([('kuzu_kusbasi', 250), ('un', 40), ('yogurt', 200), ('yumurta', 50), ('limon', 15), ('tereyagi', 30), ('su', 1500), ('tuz', 8)], 1700),
    'toyga': ([('yogurt', 400), ('bugday', 80), ('nohut_kuru', 50), ('yumurta', 50), ('un', 30), ('tereyagi', 25), ('nane', 3), ('su', 1300), ('tuz', 8)], 1650),
    'mushroom-soup': ([('mantar', 400), ('sogan', 50), ('tereyagi', 30), ('un', 30), ('sut', 300), ('krema', 100), ('su', 700), ('tuz', 6)], 1400),
    'broccoli-soup': ([('brokoli', 400), ('patates', 150), ('sogan', 60), ('tereyagi', 20), ('un', 20), ('sut', 300), ('krema', 50), ('su', 700), ('tuz', 6)], 1500),
    'cream-chicken-soup': ([('tavuk_gogus', 250), ('un', 50), ('tereyagi', 30), ('sut', 300), ('krema', 100), ('havuc', 60), ('su', 1100), ('tuz', 6)], 1600),
    'corn-soup': ([('misir_konserve', 300), ('sogan', 60), ('tereyagi', 25), ('un', 25), ('sut', 400), ('su', 600), ('tuz', 6)], 1250),
    'pumpkin-soup': ([('balkabagi', 600), ('sogan', 80), ('havuc', 80), ('zeytinyagi', 20), ('tereyagi', 15), ('krema', 50), ('su', 700), ('tuz', 6)], 1350),
    'fish-soup': ([('levrek', 400), ('patates', 150), ('havuc', 80), ('sogan', 80), ('un', 25), ('tereyagi', 20), ('limon', 20), ('su', 1300), ('tuz', 8)], 1800),
    'beyran': ([('kuzu_kusbasi', 300), ('pirinc', 100), ('sarimsak', 20), ('tereyagi', 30), ('aci_biber', 10), ('su', 1500), ('tuz', 8)], 1700),
    'green-lentil-soup': ([('yesil_mercimek', 200), ('sogan', 80), ('havuc', 60), ('patates', 100), ('salca', 20), ('zeytinyagi', 25), ('su', 1500), ('tuz', 8)], 1650),
    # Et yemekleri ve kebaplar
    'orman-kebab': ([('dana_kusbasi', 500), ('patates', 300), ('havuc', 120), ('bezelye', 100), ('sogan', 100), ('tereyagi', 30), ('salca', 20), ('su', 500), ('tuz', 6)], 1250),
    'kuru-kofte': ([('kiyma_dana', 500), ('sogan', 100), ('ekmek', 60), ('yumurta', 50), ('un', 30), ('zeytinyagi', 40), ('tuz', 8)], 590),
    'izmir-kofte': ([('kiyma_dana', 500), ('ekmek', 50), ('sogan', 80), ('yumurta', 50), ('patates', 500), ('biber', 100), ('domates', 200), ('salca', 25), ('zeytinyagi', 30), ('su', 300), ('tuz', 8)], 1400),
    'sulu-kofte': ([('kiyma_dana', 300), ('pirinc', 50), ('sogan', 50), ('patates', 200), ('havuc', 80), ('salca', 20), ('un', 15), ('tereyagi', 15), ('su', 1200), ('tuz', 6)], 1700),
    'kadinbudu': ([('kiyma_dana', 500), ('pirinc', 80), ('su', 120), ('sogan', 80), ('yumurta', 100), ('un', 40), ('zeytinyagi', 80)], 820),
    'inegol': ([('kiyma_dana', 400), ('kuzu_kiyma', 100), ('sogan', 60), ('ekmek', 30), ('tuz', 8)], 450),
    'oven-chicken': ([('tavuk_derili', 1000), ('patates', 600), ('sogan', 100), ('biber', 100), ('domates', 150), ('zeytinyagi', 40), ('salca', 20), ('tuz', 10)], 1600),
    'chicken-schnitzel': ([('tavuk_gogus', 500), ('un', 40), ('yumurta', 100), ('ekmek', 80), ('zeytinyagi', 80)], 620),
    'kavurma': ([('dana_kusbasi', 1000), ('tereyagi', 60), ('tuz', 12)], 650),
    'guvec': ([('dana_kusbasi', 500), ('patlican', 300), ('biber', 150), ('domates', 300), ('sogan', 150), ('sarimsak', 10), ('tereyagi', 30), ('zeytinyagi', 20), ('su', 300), ('tuz', 8)], 1350),
    'lamb-shish': ([('kuzu_kusbasi', 800), ('zeytinyagi', 30), ('yogurt', 50), ('tuz', 8)], 620),
    # Çöp şişte yağlı parçalar: kuzu kıyma yağ oranını temsil eder
    'cop-sis': ([('kuzu_kusbasi', 500), ('kuzu_kiyma', 100), ('zeytinyagi', 20), ('tuz', 6)], 440),
    'beef-shish': ([('dana_kusbasi', 800), ('zeytinyagi', 30), ('yogurt', 50), ('tuz', 8)], 600),
    'beyti': ([('kuzu_kiyma', 400), ('pide_ekmegi', 120), ('yogurt', 150), ('salca', 15), ('tereyagi', 30), ('domates', 50)], 650),
    'urfa': ([('kuzu_kiyma', 800), ('sogan', 80), ('tuz', 10)], 680),
    'alinazik': ([('kuzu_kusbasi', 300), ('patlican', 800), ('yogurt', 300), ('sarimsak', 10), ('tereyagi', 40), ('salca', 15)], 1100),
    'eggplant-kebab': ([('kiyma_dana', 500), ('patlican', 600), ('domates', 200), ('biber', 100), ('zeytinyagi', 20)], 1050),
    'mince-potato': ([('patates', 600), ('kiyma_dana', 200), ('sogan', 100), ('salca', 25), ('zeytinyagi', 30), ('su', 300)], 1000),
    'arnavut': ([('dana_ciger', 500), ('un', 40), ('zeytinyagi', 60), ('sogan', 100)], 470),
    'keskek': ([('bugday', 500), ('tavuk_but', 600), ('tereyagi', 60), ('su', 2500), ('tuz', 10)], 2400),
    'et-sote': ([('dana_kusbasi', 500), ('biber', 150), ('domates', 200), ('sogan', 100), ('zeytinyagi', 30), ('tereyagi', 15), ('tuz', 6)], 750),
    'karisik-pide': ([('un', 300), ('su', 180), ('maya', 5), ('kiyma_dana', 150), ('kasar', 120), ('yumurta', 50), ('domates', 60), ('biber', 40), ('tereyagi', 25)], 800),
    'kusbasi-pide': ([('un', 300), ('su', 180), ('maya', 5), ('dana_kusbasi', 250), ('domates', 80), ('biber', 50), ('tereyagi', 30)], 760),
    # Balık ve deniz ürünleri
    'fried-mussels': ([('midye', 300), ('un', 60), ('su', 60), ('zeytinyagi', 70)], 400),
    'shrimp-guvec': ([('karides', 300), ('domates', 200), ('biber', 80), ('sogan', 50), ('kasar', 60), ('tereyagi', 30), ('sarimsak', 10)], 560),
    # Baklagiller
    'barbunya': ([('barbunya_kuru', 300), ('havuc', 100), ('patates', 150), ('sogan', 150), ('domates', 150), ('sarimsak', 15), ('zeytinyagi', 80), ('seker', 5), ('su', 900)], 1450),
    'fava': ([('bakla_kuru', 250), ('sogan', 80), ('zeytinyagi', 70), ('seker', 5), ('limon', 15), ('su', 800)], 850),
    'mercimek-kofte': ([('kirmizi_mercimek', 200), ('bulgur', 200), ('su', 600), ('sogan', 100), ('salca', 30), ('zeytinyagi', 60), ('taze_sogan', 50), ('maydanoz', 50), ('limon', 15)], 1100),
    'piyaz': ([('fasulye_kuru', 200), ('su', 300), ('sogan', 100), ('maydanoz', 30), ('domates', 100), ('zeytinyagi', 40), ('limon', 20), ('yumurta', 50)], 840),
    # Sebze yemekleri, zeytinyağlılar, salatalar
    'roasted-pepper': ([('kapya', 500), ('zeytinyagi', 15)], 345),
    'leek-dish': ([('pirasa', 800), ('havuc', 120), ('pirinc', 40), ('sogan', 50), ('zeytinyagi', 70), ('limon', 15), ('seker', 5), ('su', 300)], 1150),
    'celery-dish': ([('kereviz', 700), ('havuc', 120), ('patates', 150), ('sogan', 60), ('bezelye', 80), ('zeytinyagi', 70), ('limon', 30), ('seker', 10), ('su', 300)], 1250),
    'cabbage-sarma': ([('lahana', 600), ('kiyma_dana', 300), ('pirinc', 150), ('sogan', 100), ('salca', 25), ('tereyagi', 20), ('zeytinyagi', 15), ('su', 500)], 1450),
    'meat-sarma': ([('asma_yapragi', 150), ('kiyma_dana', 300), ('pirinc', 150), ('sogan', 100), ('salca', 20), ('tereyagi', 20), ('su', 450)], 1000),
    'okra': ([('bamya', 500), ('domates', 250), ('sogan', 100), ('zeytinyagi', 50), ('limon', 20), ('su', 200)], 900),
    'olive-pepper-dolma': ([('biber', 500), ('pirinc', 200), ('sogan', 200), ('zeytinyagi', 80), ('kus_uzumu', 20), ('cam_fistigi', 20), ('domates', 100), ('seker', 10), ('su', 400)], 1250),
    'zucchini-dolma': ([('kabak', 700), ('kiyma_dana', 250), ('pirinc', 120), ('sogan', 80), ('domates', 150), ('salca', 20), ('tereyagi', 20), ('su', 400)], 1450),
    'borulce': ([('borulce', 500), ('domates', 200), ('sogan', 100), ('sarimsak', 10), ('zeytinyagi', 60), ('su', 200)], 850),
    'zucchini-dish': ([('kabak', 800), ('sogan', 100), ('domates', 150), ('pirinc', 30), ('zeytinyagi', 50), ('su', 100)], 950),
    'cauliflower-dish': ([('karnabahar', 700), ('sogan', 80), ('salca', 20), ('zeytinyagi', 40), ('su', 300)], 900),
    'cabbage-dish': ([('lahana', 800), ('kiyma_dana', 150), ('sogan', 100), ('salca', 25), ('pirinc', 40), ('zeytinyagi', 30), ('su', 300)], 1150),
    'eggplant-fry': ([('patlican', 600), ('zeytinyagi', 120)], 500),
    'cauliflower-fry': ([('karnabahar', 600), ('un', 50), ('yumurta', 100), ('zeytinyagi', 100)], 700),
    'saksuka': ([('patlican', 500), ('kabak', 200), ('biber', 100), ('zeytinyagi', 120), ('domates', 300), ('sarimsak', 10), ('salca', 10)], 850),
    'eggplant-salad': ([('patlican', 800), ('sarimsak', 10), ('zeytinyagi', 30), ('limon', 20)], 560),
    'babagannus': ([('patlican', 800), ('tahin', 50), ('sarimsak', 10), ('limon', 30), ('zeytinyagi', 20)], 600),
    'mushroom-saute': ([('mantar', 500), ('tereyagi', 20), ('zeytinyagi', 15), ('sogan', 50), ('biber', 50)], 400),
    # Nar ekşisi yerine pekmez (benzer şeker içeriği)
    'kisir': ([('bulgur', 200), ('su', 200), ('salca', 50), ('domates', 150), ('taze_sogan', 50), ('maydanoz', 50), ('nane', 2), ('zeytinyagi', 50), ('limon', 30), ('pekmez', 20)], 800),
    'gavurdagi': ([('domates', 300), ('sogan', 80), ('biber', 60), ('maydanoz', 30), ('ceviz', 50), ('zeytinyagi', 30), ('pekmez', 20), ('limon', 10)], 580),
    'potato-salad': ([('patates', 600), ('taze_sogan', 50), ('maydanoz', 30), ('zeytinyagi', 40), ('limon', 20), ('dereotu', 10)], 740),
    'tuna-salad': ([('ton_konserve', 120), ('marul', 150), ('domates', 100), ('salatalik', 100), ('misir_konserve', 50), ('zeytinyagi', 20), ('limon', 15)], 555),
    'caesar': ([('marul', 200), ('tavuk_gogus', 150), ('parmesan', 15), ('kruton', 30), ('mayonez', 20), ('limon', 10), ('zeytinyagi', 10), ('sarimsak', 3)], 400),
    'russian-salad': ([('patates', 300), ('havuc', 100), ('bezelye', 100), ('tursu', 80), ('mayonez', 100), ('yogurt', 100)], 770),
    'haydari': ([('suzme_yogurt', 300), ('beyaz_peynir', 50), ('sarimsak', 5), ('dereotu', 10), ('nane', 2), ('zeytinyagi', 15)], 382),
    'ezme': ([('domates', 300), ('biber', 60), ('aci_biber', 30), ('sogan', 60), ('maydanoz', 30), ('salca', 20), ('zeytinyagi', 30), ('pekmez', 15), ('limon', 10)], 540),
    'purslane-salad': ([('semizotu', 250), ('yogurt', 250), ('sarimsak', 5), ('zeytinyagi', 10)], 515),
    'arugula-salad': ([('roka', 100), ('domates', 100), ('parmesan', 10), ('zeytinyagi', 15), ('limon', 10)], 235),
    'carrot-tarator': ([('havuc', 300), ('yogurt', 300), ('sarimsak', 5), ('zeytinyagi', 20)], 580),
    # Pilav, makarna, patates
    'sehriyeli-pilav': ([('pirinc', 350), ('eriste', 50), ('tereyagi', 40), ('zeytinyagi', 15), ('su', 650), ('tuz', 8)], 1050),
    'nohutlu-pilav': ([('pirinc', 350), ('nohut_kuru', 80), ('tereyagi', 40), ('zeytinyagi', 15), ('su', 720), ('tuz', 8)], 1150),
    'ic-pilav': ([('pirinc', 400), ('tereyagi', 50), ('sogan', 80), ('cam_fistigi', 30), ('kus_uzumu', 30), ('seker', 10), ('su', 600), ('tuz', 8)], 1120),
    'perde-pilav': ([('un', 250), ('yogurt', 100), ('tereyagi', 100), ('yumurta', 50), ('pirinc', 300), ('tavuk_gogus', 300), ('badem', 50), ('su', 500), ('tuz', 8)], 1450),
    'domatesli-pilav': ([('pirinc', 400), ('domates', 300), ('salca', 15), ('tereyagi', 30), ('zeytinyagi', 20), ('su', 450), ('tuz', 8)], 1150),
    'brown-rice': ([('pirinc_esmer', 400), ('zeytinyagi', 30), ('su', 800), ('tuz', 8)], 1150),
    'chicken-rice': ([('pirinc', 400), ('tavuk_gogus', 300), ('tereyagi', 40), ('su', 700), ('tuz', 8)], 1300),
    'bolognese': ([('makarna_kuru', 500), ('su', 650), ('kiyma_dana', 300), ('domates', 400), ('salca', 30), ('sogan', 100), ('zeytinyagi', 30)], 1800),
    'baked-pasta': ([('makarna_kuru', 500), ('su', 650), ('sut', 700), ('un', 60), ('tereyagi', 60), ('kasar', 150), ('yumurta', 50)], 1900),
    'tuna-pasta': ([('makarna_kuru', 500), ('su', 650), ('ton_konserve', 240), ('misir_konserve', 100), ('zeytinyagi', 40)], 1500),
    'mushroom-pasta': ([('makarna_kuru', 500), ('su', 650), ('mantar', 300), ('krema', 200), ('tereyagi', 30), ('sarimsak', 10), ('parmesan', 30)], 1550),
    'spiced-potato': ([('patates', 1000), ('zeytinyagi', 50), ('tuz', 8)], 750),
    # Hazır yemek / sokak lezzetleri
    'hotdog': ([('ekmek_hamburger', 60), ('sosis', 50), ('ketcap', 10), ('mayonez', 10), ('tursu', 20)], 150),
    'midye-dolma': ([('midye', 100), ('pirinc', 80), ('sogan', 50), ('zeytinyagi', 25), ('kus_uzumu', 5), ('cam_fistigi', 5), ('su', 120)], 330),
    'balik-ekmek': ([('ekmek', 120), ('uskumru', 150), ('sogan', 30), ('marul', 20), ('domates', 30), ('zeytinyagi', 5), ('limon', 5)], 315),
    'cigkofte-durum': ([('bulgur', 45), ('salca', 12), ('sogan', 15), ('zeytinyagi', 9), ('pekmez', 4), ('maydanoz', 6), ('su', 45), ('pide_ekmegi', 60), ('marul', 20), ('domates', 30), ('limon', 5)], 230),
    'chicken-durum': ([('pide_ekmegi', 80), ('tavuk_but', 150), ('domates', 30), ('marul', 15), ('mayonez', 10), ('tursu', 15)], 255),
    'doner-durum': ([('pide_ekmegi', 80), ('kiyma_dana', 160), ('domates', 30), ('sogan', 20)], 245),
    'doner-sandwich': ([('ekmek', 120), ('kiyma_dana', 150), ('domates', 30), ('sogan', 20), ('tursu', 15)], 290),
    'ayvalik-tost': ([('ekmek', 150), ('kasar', 50), ('sosis', 40), ('domates', 20), ('tursu', 25), ('ketcap', 15), ('mayonez', 15)], 300),
    # Tatlılar (şerbetin bir kısmı kaynarken buharlaşır)
    'kemalpasa': ([('un', 150), ('irmik', 50), ('yumurta', 100), ('mozzarella', 150), ('tereyagi', 20), ('seker', 600), ('su', 700)], 1250),
    'sekerpare': ([('un', 350), ('irmik', 50), ('tereyagi', 150), ('seker', 700), ('yumurta', 100), ('badem', 20), ('su', 600)], 1400),
    'tulumba': ([('un', 250), ('su', 800), ('tereyagi', 50), ('yumurta', 150), ('irmik', 30), ('zeytinyagi', 120), ('seker', 600)], 1300),
    'lokma': ([('un', 300), ('maya', 7), ('su', 700), ('seker', 510), ('zeytinyagi', 100)], 1080),
    'profiterol': ([('su', 250), ('tereyagi', 120), ('un', 150), ('yumurta', 250), ('sut', 750), ('seker', 150), ('nisasta', 40), ('kakao', 30), ('krema', 100)], 1520),
    'trilece': ([('yumurta', 250), ('seker', 420), ('un', 200), ('sut', 750), ('krema', 200)], 1700),
    # Tel kadayıf için yufka değerleri kullanıldı (aynı un-su hamuru)
    'kadayif': ([('yufka', 500), ('tereyagi', 250), ('ceviz', 200), ('seker', 700), ('su', 600)], 1650),
    'cevizli-baklava': ([('yufka', 500), ('tereyagi', 300), ('ceviz', 250), ('seker', 700), ('su', 450)], 1700),
    'irmik-helvasi': ([('irmik', 250), ('tereyagi', 125), ('sut', 500), ('seker', 250), ('cam_fistigi', 30)], 1000),
    'un-helvasi': ([('un', 250), ('tereyagi', 150), ('seker', 250), ('su', 300), ('sut', 200)], 820),
    'pudding': ([('sut', 1000), ('seker', 150), ('nisasta', 50), ('kakao', 30), ('un', 20), ('tereyagi', 15)], 1150),
    'magnolia': ([('sut', 1000), ('seker', 150), ('nisasta', 40), ('un', 40), ('yumurta', 50), ('krema', 200), ('biskuvi', 150), ('cilek', 200)], 1700),
    'keskul': ([('sut', 1000), ('seker', 150), ('nisasta', 30), ('pirinc_unu', 30), ('badem', 80), ('yumurta', 50)], 1200),
    'tavuk-gogsu': ([('sut', 1000), ('seker', 200), ('pirinc_unu', 60), ('nisasta', 40), ('tavuk_gogus', 50)], 1200),
    'supangle': ([('sut', 1000), ('seker', 180), ('un', 40), ('nisasta', 40), ('kakao', 40), ('tereyagi', 30)], 1200),
    'muhallebi': ([('sut', 1000), ('seker', 150), ('nisasta', 40), ('pirinc_unu', 40)], 1150),
    'islak-kek': ([('un', 250), ('seker', 400), ('yumurta', 150), ('sut', 500), ('zeytinyagi', 200), ('kakao', 70)], 1350),
    'kalburabasti': ([('un', 350), ('irmik', 50), ('zeytinyagi', 120), ('tereyagi', 50), ('yogurt', 50), ('ceviz', 100), ('seker', 600), ('su', 600)], 1350),
    'ayva-tatlisi': ([('ayva', 1000), ('seker', 400), ('su', 400), ('ceviz', 30)], 1300),
    'kabak-tatlisi': ([('balkabagi', 1000), ('seker', 300), ('ceviz', 50)], 950),
    'un-kurabiyesi': ([('un', 400), ('tereyagi', 250), ('seker', 100), ('nisasta', 30)], 730),
    'yas-pasta': ([('un', 150), ('yumurta', 250), ('seker', 250), ('krema', 500), ('sut', 300), ('cilek', 200), ('muz', 150)], 1750),
    # İçecekler ve spor
    'salep': ([('sut', 1000), ('seker', 80), ('nisasta', 20)], 1050),
    'smoothie': ([('muz', 150), ('cilek', 100), ('yogurt', 150), ('sut', 100), ('bal', 10)], 510),
    'protein-shake': ([('whey', 30), ('sut', 250)], 280),
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
