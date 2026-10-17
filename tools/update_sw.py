"""sw.js içindeki IMAGES listesini img/ klasöründeki fotoğraflardan ve video kapaklarından yeniden üretir.

Kullanım (repo kökünden):  python tools/update_sw.py
Ardından sw.js içindeki VERSION değerini artırmayı unutma.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# img/ klasöründeki tüm fotoğraflar + video kapakları (vid/*.jpg)
paths = {f'img/{f}' for f in os.listdir(os.path.join(ROOT, 'img')) if f.endswith('.jpg')}
paths |= {f'vid/{f}' for f in os.listdir(os.path.join(ROOT, 'vid')) if f.endswith('.jpg')}
# Kodda adı geçen ama diskte olmayan görsel var mı?
refs = set()
for name in ('exercises.js', 'app.js', 'sports.js'):
    refs |= set(re.findall(r"""["'`]((?:img|vid)/[^"'`$]+\.jpg)""", open(os.path.join(ROOT, name), encoding='utf-8').read()))
missing = sorted(r for r in refs if r not in paths)
if missing:
    raise SystemExit(f'Eksik dosyalar: {missing}')
images = sorted(f'./{p}' for p in paths)

sw_path = os.path.join(ROOT, 'sw.js')
sw = open(sw_path, encoding='utf-8').read()
sw, n = re.subn(r'const IMAGES = \[.*?\];', 'const IMAGES = ' + json.dumps(images) + ';', sw, count=1, flags=re.S)
assert n == 1, 'IMAGES satırı bulunamadı'
open(sw_path, 'w', encoding='utf-8').write(sw)
print(f'{len(images)} görsel listelendi')
