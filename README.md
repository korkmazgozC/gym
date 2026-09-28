# Gym Takip

Kişisel set / tekrar / ağırlık takibi. 116 hareket, her biri gerçek insan fotoğraflarıyla (başlangıç ↔ bitiş animasyonu).
iPhone'da "Ana Ekrana Ekle" ile uygulama gibi çalışan, **internet olmadan da çalışan** bir PWA.

## iPhone'a kurulum (GitHub Pages, ücretsiz)

1. GitHub'da repo → **Add file → Upload files** → şunları sürükle:
   `index.html, styles.css, app.js, exercises.js, sw.js, manifest.webmanifest`, `icons` klasörü ve `img` klasörü → **Commit changes**.
2. **Settings → Pages** → Branch: `main` / `(root)` → Save.
3. iPhone'da `https://KULLANICI_ADIN.github.io/gym/` adresini **Safari** ile aç → **Paylaş → Ana Ekrana Ekle**.

İlk açılışta tüm dosyalar (~10 MB) telefona kaydedilir; sonrasında uçak modunda bile çalışır.

## Güncelleme

Değişen dosyaları yeniden yükle ve `sw.js` içindeki `VERSION` değerini artır (`gymtakip-v4` gibi).
iPhone'da uygulamayı tamamen kapatıp açınca (gerekirse iki kez) yeni sürüm gelir.

## Veriler

Kayıtlar yalnızca telefonda tutulur. **Ayarlar → Yedek al** ile JSON yedeğini iCloud Drive'a kaydet.

## Görseller ve lisanslar

- Videolar (`vid/`, 41 hareket, 72 açı): Goulart, [wger.de](https://wger.de) — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 12 saniyeye kısaltılıp 540p H.264'e dönüştürüldü.
- Fotoğraflar (`img/`): [free-exercise-db](https://github.com/yuhonas/free-exercise-db) — Unlicense (kamu malı), 720 px'e küçültüldü.
