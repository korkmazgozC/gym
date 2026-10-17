"""sw.js içindeki IMAGES listesini exercises.js'deki fotoğraf ve video kapaklarından yeniden üretir.

Kullanım (repo kökünden):  python tools/update_sw.py
Ardından sw.js içindeki VERSION değerini artırmayı unutma.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ex_src = open(os.path.join(ROOT, 'exercises.js'), encoding='utf-8').read()
paths = set(re.findall(r'"((?:img|vid)/[^"]+\.jpg)"', ex_src))
paths |= set(re.findall(r"'((?:img|vid)/[^']+\.jpg)'", open(os.path.join(ROOT, 'app.js'), encoding='utf-8').read()))
missing = [p for p in paths if not os.path.exists(os.path.join(ROOT, p))]
if missing:
    raise SystemExit(f'Eksik dosyalar: {missing}')
images = sorted(f'./{p}' for p in paths)

sw_path = os.path.join(ROOT, 'sw.js')
sw = open(sw_path, encoding='utf-8').read()
sw, n = re.subn(r'const IMAGES = \[.*?\];', 'const IMAGES = ' + json.dumps(images) + ';', sw, count=1, flags=re.S)
assert n == 1, 'IMAGES satırı bulunamadı'
open(sw_path, 'w', encoding='utf-8').write(sw)
print(f'{len(images)} görsel listelendi')
