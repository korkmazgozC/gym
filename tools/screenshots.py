"""README ekran görüntülerini üretir (docs/*.jpg ve docs/banner.jpg).

Önce yerel sunucuyu aç:  python -m http.server 8765
Sonra:                    python tools/screenshots.py
Chrome headless, tools/shot.html sayfasını (örnek veri + 390×844 çerçeve) 2x çözünürlükte çeker.
"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = next(p for p in [r'C:\Program Files\Google\Chrome\Application\chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] if os.path.exists(p))
BASE = 'http://localhost:8765/tools/shot.html'
SHOTS = {  # dosya: sorgu
    'today': 'r=today',
    'workout': 'r=workout&session=1',
    'lib': 'r=lib',
    'figure': 'r=stroke/serve',
    'goals': 'r=today&y=560',
    'nutrition': 'r=nutrition',
    'hist': 'r=hist',
    'pilates': 'r=today&sport=pilates',
}


def shoot(name, q, tmp):
    out = os.path.join(tmp, name + '.png')
    subprocess.run([CHROME, '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=2', '--window-size=500,844',
                    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--virtual-time-budget=9000',
                    f'--user-data-dir={os.path.join(tmp, "prof-" + name)}', f'--screenshot={out}', f'{BASE}?{q}'],
                   check=True, capture_output=True, timeout=120)
    im = Image.open(out).convert('RGB').crop((0, 0, 780, 1688))
    return im


def main():
    tmp = tempfile.mkdtemp()
    shots = {}
    for n, q in SHOTS.items():
        shots[n] = shoot(n, q, tmp)
        shots[n].resize((540, 1169), Image.LANCZOS).save(os.path.join(ROOT, 'docs', n + '.jpg'), quality=86)
        print('ok', n)
    banner(shots)


def rounded(im, r):
    m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], r, fill=255)
    return m


def banner(shots):
    W, H = 1644, 875
    bg = Image.new('RGB', (W, H), (10, 11, 18))
    glow = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(glow)
    d.ellipse([W * .38, -H * .5, W * 1.15, H * .9], fill=120)
    d.ellipse([-W * .2, H * .45, W * .45, H * 1.5], fill=60)
    glow = glow.filter(ImageFilter.GaussianBlur(140))
    bg = Image.composite(Image.new('RGB', (W, H), (124, 92, 255)), bg, glow)
    font = lambda w, s: ImageFont.truetype(os.path.join(ROOT, 'tools', f'Outfit-{w}.ttf'), s)
    t = ImageDraw.Draw(bg)
    t.text((86, 250), 'Gym Takip', font=font('Bold', 96), fill=(242, 242, 247))
    t.text((90, 372), 'Gym, tenis ve pilates için', font=font('Medium', 38), fill=(201, 182, 255))
    t.text((90, 420), 'kişisel takip uygulaması', font=font('Medium', 38), fill=(201, 182, 255))
    for i, line in enumerate(['3D hareket gösterimi · set ve rekor takibi', 'Beslenme hedefleri · internetsiz çalışır', 'Ücretsiz · reklamsız · Türkçe']):
        t.text((92, 512 + i * 46), line, font=font('Regular', 27), fill=(157, 158, 179))
    pw, ph = 330, 714
    for i, n in enumerate(['workout', 'today', 'figure']):
        im = shots[n].resize((pw, ph), Image.LANCZOS)
        x = 760 + i * 290
        y = 104 if i == 1 else 150
        sh = Image.new('L', (W, H), 0)
        ImageDraw.Draw(sh).rounded_rectangle([x + 10, y + 30, x + pw + 10, y + ph + 30], 46, fill=150)
        sh = sh.filter(ImageFilter.GaussianBlur(28))
        bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, sh)
        frame = Image.new('RGB', (pw + 16, ph + 16), (38, 39, 56))
        bg.paste(frame, (x - 8, y - 8), rounded(frame, 52))
        bg.paste(im, (x, y), rounded(im, 44))
    bg.save(os.path.join(ROOT, 'docs', 'banner.jpg'), quality=88)
    print('ok banner')


if __name__ == '__main__':
    sys.exit(main())
