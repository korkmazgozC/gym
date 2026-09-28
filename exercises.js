// Hareket veritabanı. Fotoğraflar: free-exercise-db (Unlicense / kamu malı)
// https://github.com/yuhonas/free-exercise-db — img/ klasöründe, çevrimdışı çalışır.

export const REGIONS = [
  { id: 'gogus', name: 'Göğüs', color: '#ff6a3d' },
  { id: 'sirt', name: 'Sırt', color: '#3da5ff' },
  { id: 'bacak', name: 'Bacak', color: '#8b5cf6' },
  { id: 'omuz', name: 'Omuz', color: '#f5b83d' },
  { id: 'kol', name: 'Kol', color: '#22c55e' },
  { id: 'karin', name: 'Karın', color: '#ec4899' },
];

export const EXERCISES = [
 {
  "id": "bench",
  "region": "gogus",
  "name": "Bench Press",
  "type": "weight",
  "img": [
   "img/bench-0.jpg",
   "img/bench-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Sehpaya uzan; gözlerin barın hizasında, ayakların yere tam bassın.",
   "Barı omuz genişliğinden biraz geniş kavra, kürek kemiklerini geriye ve aşağı sıkıştır.",
   "Barı kontrollü şekilde göğsünün orta-alt kısmına indir; dirsekler gövdeye ~45–70° açıda.",
   "Ayaklarla yere itip barı güçlü şekilde yukarı it."
  ],
  "tips": [
   "Kalçanı sehpadan kaldırma.",
   "Ağır setlerde spotter veya güvenlik barı kullan."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/bench-0.mp4",
    "poster": "vid/bench-0.jpg"
   },
   {
    "src": "vid/bench-1.mp4",
    "poster": "vid/bench-1.jpg"
   },
   {
    "src": "vid/bench-2.mp4",
    "poster": "vid/bench-2.jpg"
   }
  ]
 },
 {
  "id": "incline-bench",
  "region": "gogus",
  "name": "Incline Bench Press",
  "type": "weight",
  "img": [
   "img/incline-bench-0.jpg",
   "img/incline-bench-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Sehpayı 30–45° eğime ayarla, sırtını ve kalçanı sehpaya yasla.",
   "Barı omuz genişliğinden biraz geniş kavra ve raftan al.",
   "Barı köprücük kemiğinin biraz altına kontrollü indir.",
   "Barı yukarı ve hafifçe geriye doğru it."
  ],
  "tips": [
   "Eğimi 45°'den fazla yaparsan yük omuza kayar."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/incline-bench-0.mp4",
    "poster": "vid/incline-bench-0.jpg"
   }
  ]
 },
 {
  "id": "incline-db",
  "region": "gogus",
  "name": "Incline Dumbbell Press",
  "type": "weight",
  "img": [
   "img/incline-db-0.jpg",
   "img/incline-db-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Sehpayı 30–45° eğime ayarla ve dambılları dizlerinin üzerinde tutarak otur.",
   "Geriye yaslanırken dambılları omuz hizasına getir.",
   "Dambılları yukarı ve hafifçe içe doğru it.",
   "Kontrollü şekilde göğüs hizasına geri indir."
  ],
  "tips": [
   "İnişi 2–3 saniyede yap."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/incline-db-0.mp4",
    "poster": "vid/incline-db-0.jpg"
   }
  ]
 },
 {
  "id": "db-bench",
  "region": "gogus",
  "name": "Dumbbell Bench Press",
  "type": "weight",
  "img": [
   "img/db-bench-0.jpg",
   "img/db-bench-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Düz sehpaya uzan, dambılları göğüs hizasında tut.",
   "Dambılları göğsünün üzerine doğru yukarı it.",
   "Göğüste gerilme hissedene kadar kontrollü indir."
  ],
  "tips": [
   "Barbell'e göre daha geniş hareket açıklığı sağlar."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/db-bench-0.mp4",
    "poster": "vid/db-bench-0.jpg"
   },
   {
    "src": "vid/db-bench-1.mp4",
    "poster": "vid/db-bench-1.jpg"
   },
   {
    "src": "vid/db-bench-2.mp4",
    "poster": "vid/db-bench-2.jpg"
   }
  ]
 },
 {
  "id": "dips",
  "region": "gogus",
  "name": "Dips (Paralel Bar)",
  "type": "bodyweight",
  "img": [
   "img/dips-0.jpg",
   "img/dips-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "intermediate",
  "steps": [
   "Paralel barlarda kollarını kilitleyerek yüksel.",
   "Gövdeni hafifçe öne eğ; dirsekleri bükerek omuzlar dirsek hizasına gelene kadar in.",
   "Avuçlarından iterek başlangıca çık."
  ],
  "tips": [
   "Omuz ağrısı hissedersen derinliği azalt.",
   "Gövde dik olursa triceps, eğik olursa göğüs çalışır."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/dips-0.mp4",
    "poster": "vid/dips-0.jpg"
   },
   {
    "src": "vid/dips-1.mp4",
    "poster": "vid/dips-1.jpg"
   },
   {
    "src": "vid/dips-2.mp4",
    "poster": "vid/dips-2.jpg"
   }
  ]
 },
 {
  "id": "db-fly",
  "region": "gogus",
  "name": "Dumbbell Fly",
  "type": "weight",
  "img": [
   "img/db-fly-0.jpg",
   "img/db-fly-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sehpaya uzan, dambılları avuçlar birbirine bakacak şekilde göğsünün üstünde tut.",
   "Dirsekler hafif bükülü ve sabitken kolları yay çizerek yanlara aç.",
   "Göğüste gerilme hissedince aynı yaydan yukarı getir."
  ],
  "tips": [
   "Ağırlığı hafif tut, omzu zorlayan derinliğe inme."
  ],
  "met": 4.0
 },
 {
  "id": "pushup",
  "region": "gogus",
  "name": "Şınav",
  "type": "bodyweight",
  "img": [
   "img/pushup-0.jpg",
   "img/pushup-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Eller omuz genişliğinden biraz açık, vücut başından topuğuna düz bir çizgi.",
   "Karnını ve kalçanı sık; dirsekleri ~45° açıyla bükerek göğsünü yere yaklaştır.",
   "Göğüs yere birkaç cm kalınca avuçlarınla yeri iterek yukarı çık."
  ],
  "tips": [
   "Kalçanın düşmesine izin verme.",
   "Zorlanırsan dizler yerde yap."
  ],
  "met": 6.0
 },
 {
  "id": "cable-crossover",
  "region": "gogus",
  "name": "Cable Crossover",
  "type": "weight",
  "img": [
   "img/cable-crossover-0.jpg",
   "img/cable-crossover-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Makaraları yükseğe ayarla, tutamakları al ve bir adım öne çık.",
   "Gövdeyi hafifçe öne eğ, dirsekler hafif bükülü.",
   "Kolları yay çizerek önde, bel hizasında birleştir.",
   "Göğüste gerilme hissedene kadar kontrollü aç."
  ],
  "tips": [
   "Hareketi kollarla değil göğüsle yaptığını hisset."
  ],
  "met": 4.0
 },
 {
  "id": "pec-deck",
  "region": "gogus",
  "name": "Pec Deck (Makine Fly)",
  "type": "weight",
  "img": [
   "img/pec-deck-0.jpg",
   "img/pec-deck-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Koltuğu, kolların yere paralel olacak şekilde ayarla.",
   "Ön kollarını pedlere yasla, sırtını dayama pedine yapıştır.",
   "Pedleri önde birleştirene kadar kolları kapat, 1 sn sık.",
   "Kontrollü şekilde geri aç."
  ],
  "tips": [
   "Omuzlarını kulaklarına doğru kaldırma."
  ],
  "met": 4.0
 },
 {
  "id": "chest-press",
  "region": "gogus",
  "name": "Chest Press (Makine)",
  "type": "weight",
  "img": [
   "img/chest-press-0.jpg",
   "img/chest-press-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Koltuğu, tutamaklar göğüs ortası hizasında olacak şekilde ayarla.",
   "Sırtını pede yasla ve tutamakları kavra.",
   "Kolları öne doğru itip neredeyse düzleştir.",
   "Kontrollü şekilde geri gel."
  ],
  "tips": [
   "Yeni başlayanlar için bench press'e güvenli bir alternatif."
  ],
  "met": 6.0
 },
 {
  "id": "pullover",
  "region": "gogus",
  "name": "Dumbbell Pullover",
  "type": "weight",
  "img": [
   "img/pullover-0.jpg",
   "img/pullover-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Latissimus",
   "Omuz",
   "Triceps"
  ],
  "level": "intermediate",
  "steps": [
   "Sehpaya uzan, tek dambılı iki elle göğsünün üzerinde tut.",
   "Dirsekler hafif bükülü, dambılı yay çizerek başının arkasına indir.",
   "Göğüs ve sırtta gerilme hissedince aynı yaydan geri getir."
  ],
  "tips": [
   "Belini aşırı kavislendirme."
  ],
  "met": 6.0
 },
 {
  "id": "decline-bench",
  "region": "gogus",
  "name": "Decline Bench Press",
  "type": "weight",
  "img": [
   "img/decline-bench-0.jpg",
   "img/decline-bench-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Başın aşağıda olacak şekilde decline sehpaya uzan, ayaklarını sabitle.",
   "Barı omuz genişliğinden biraz geniş kavra ve alt göğsüne kontrollü indir.",
   "Barı güçlü şekilde yukarı it."
  ],
  "tips": [
   "Alt göğsü hedefler; bar yolunu dik tut."
  ],
  "met": 6.0
 },
 {
  "id": "incline-fly",
  "region": "gogus",
  "name": "Incline Dumbbell Fly",
  "type": "weight",
  "img": [
   "img/incline-fly-0.jpg",
   "img/incline-fly-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Eğimli sehpaya uzan, dambılları göğsünün üstünde avuçlar karşılıklı tut.",
   "Dirsekler hafif bükülü, kolları yay çizerek yanlara aç.",
   "Üst göğüste gerilme hissedince aynı yaydan geri getir."
  ],
  "tips": [
   "Hafif ağırlıkla, kontrollü çalış."
  ],
  "met": 6.0
 },
 {
  "id": "machine-bench",
  "region": "gogus",
  "name": "Makine Bench Press",
  "type": "weight",
  "img": [
   "img/machine-bench-0.jpg",
   "img/machine-bench-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Sehpaya uzan, tutamaklar göğüs hizasında olsun.",
   "Tutamakları kolların neredeyse düzleşene kadar it.",
   "Kontrollü şekilde geri gel."
  ],
  "tips": [
   "Serbest ağırlığa geçmeden önce güvenli bir seçenek."
  ],
  "met": 6.0
 },
 {
  "id": "low-cable-crossover",
  "region": "gogus",
  "name": "Alt Makara Crossover",
  "type": "weight",
  "img": [
   "img/low-cable-crossover-0.jpg",
   "img/low-cable-crossover-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Makaraları en alta ayarla, tutamakları al ve ortada dur.",
   "Kolları aşağıdan yukarı yay çizerek göğüs hizasında birleştir.",
   "Yavaşça başlangıca dön."
  ],
  "tips": [
   "Üst göğüs ve iç göğüs için etkilidir."
  ],
  "met": 4.0
 },
 {
  "id": "incline-pushup",
  "region": "gogus",
  "name": "Eğimli Şınav (Eller Yüksekte)",
  "type": "bodyweight",
  "img": [
   "img/incline-pushup-0.jpg",
   "img/incline-pushup-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Ellerini sehpa veya yükseltiye koy, vücudun düz bir çizgi olsun.",
   "Göğsünü sehpaya doğru indir.",
   "Avuçlarından iterek yukarı çık."
  ],
  "tips": [
   "Normal şınava hazırlık için idealdir."
  ],
  "met": 6.0
 },
 {
  "id": "decline-pushup",
  "region": "gogus",
  "name": "Ayaklar Yüksekte Şınav",
  "type": "bodyweight",
  "img": [
   "img/decline-pushup-0.jpg",
   "img/decline-pushup-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Ayaklarını sehpaya koy, ellerin omuz genişliğinde yerde.",
   "Göğsünü yere doğru indir.",
   "Yeri iterek yukarı çık."
  ],
  "tips": [
   "Üst göğüs ve omuzları daha çok çalıştırır."
  ],
  "met": 6.0
 },
 {
  "id": "wide-pushup",
  "region": "gogus",
  "name": "Geniş Şınav",
  "type": "bodyweight",
  "img": [
   "img/wide-pushup-0.jpg",
   "img/wide-pushup-1.jpg"
  ],
  "primary": [
   "Göğüs"
  ],
  "secondary": [
   "Karın",
   "Omuz",
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Elleri omuz genişliğinden belirgin şekilde geniş koy.",
   "Göğsünü yere yaklaştır, dirsekler yana açılır.",
   "Yeri iterek yukarı çık."
  ],
  "tips": [
   "Omuz ağrısı olursa eli biraz daralt."
  ],
  "met": 6.0
 },
 {
  "id": "pullup",
  "region": "sirt",
  "name": "Barfiks",
  "type": "bodyweight",
  "img": [
   "img/pullup-0.jpg",
   "img/pullup-1.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Biceps",
   "Orta sırt"
  ],
  "level": "beginner",
  "steps": [
   "Barı omuz genişliğinden biraz geniş, avuç içleri öne bakacak şekilde tut.",
   "Tam sarkık pozisyondan başla; omuzlarını aşağı ve geriye çek.",
   "Dirsekleri aşağı ve yanlara sürerek çeneni barın üstüne çıkar.",
   "Kontrollü şekilde tamamen aşağı in."
  ],
  "tips": [
   "Sallanma.",
   "Yapamıyorsan lastik bant veya negatif tekrarla başla."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/pullup-0.mp4",
    "poster": "vid/pullup-0.jpg"
   }
  ]
 },
 {
  "id": "seated-row",
  "region": "sirt",
  "name": "Seated Cable Row",
  "type": "weight",
  "img": [
   "img/seated-row-0.jpg",
   "img/seated-row-1.jpg"
  ],
  "primary": [
   "Orta sırt"
  ],
  "secondary": [
   "Biceps",
   "Latissimus",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Ayaklarını platforma koy, dizler hafif bükülü, tutamağı kavra.",
   "Gövde dik, göğüs önde; dirsekleri geriye çekerek tutamağı karnına getir.",
   "Kürek kemiklerini sık, kontrollü şekilde kolları uzat."
  ],
  "tips": [
   "Gövdeyle öne-arkaya sallanma."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/seated-row-0.mp4",
    "poster": "vid/seated-row-0.jpg"
   }
  ]
 },
 {
  "id": "shrug",
  "region": "sirt",
  "name": "Dumbbell Shrug",
  "type": "weight",
  "img": [
   "img/shrug-0.jpg",
   "img/shrug-1.jpg"
  ],
  "primary": [
   "Trapez"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Dambılları yanlarda tut, kollar düz.",
   "Omuzlarını kulaklarına doğru olabildiğince yukarı kaldır.",
   "Tepede 1 sn sık, yavaşça indir."
  ],
  "tips": [
   "Omuzları döndürme; yalnızca yukarı-aşağı."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/shrug-0.mp4",
    "poster": "vid/shrug-0.jpg"
   }
  ]
 },
 {
  "id": "barbell-shrug",
  "region": "sirt",
  "name": "Barbell Shrug",
  "type": "weight",
  "img": [
   "img/barbell-shrug-0.jpg",
   "img/barbell-shrug-1.jpg"
  ],
  "primary": [
   "Trapez"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Barı uyluklarının önünde, omuz genişliğinde tut.",
   "Omuzlarını kulaklarına doğru kaldır.",
   "Tepede sık, yavaşça indir."
  ],
  "tips": [
   "Kolları bükme."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/barbell-shrug-0.mp4",
    "poster": "vid/barbell-shrug-0.jpg"
   }
  ]
 },
 {
  "id": "one-arm-cable-row",
  "region": "sirt",
  "name": "Tek Kol Kablo Row",
  "type": "weight",
  "img": [
   "vid/one-arm-cable-row-0.jpg",
   "vid/one-arm-cable-row-0.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Orta sırt",
   "Biceps"
  ],
  "level": null,
  "steps": [
   "Makaranın karşısında dur, tutamağı tek elle kavra.",
   "Dirseği gövdeye yakın geriye çekerek tutamağı beline getir.",
   "Kolu kontrollü uzat, seti bitirince kol değiştir."
  ],
  "tips": [
   "Gövdeyi döndürerek çekme."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/one-arm-cable-row-0.mp4",
    "poster": "vid/one-arm-cable-row-0.jpg"
   }
  ]
 },
 {
  "id": "assisted-pullup",
  "region": "sirt",
  "name": "Makine Destekli Barfiks",
  "type": "weight",
  "img": [
   "vid/assisted-pullup-0.jpg",
   "vid/assisted-pullup-0.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Biceps",
   "Orta sırt"
  ],
  "level": null,
  "steps": [
   "Dizlerini (veya ayaklarını) destek pedine koy, barı tut.",
   "Çeneni barın üstüne çıkana kadar kendini çek.",
   "Kontrollü şekilde in."
  ],
  "tips": [
   "Ağırlık arttıkça destek artar; zamanla azalt."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/assisted-pullup-0.mp4",
    "poster": "vid/assisted-pullup-0.jpg"
   }
  ]
 },
 {
  "id": "chinup",
  "region": "sirt",
  "name": "Chin-up (Ters Barfiks)",
  "type": "bodyweight",
  "img": [
   "img/chinup-0.jpg",
   "img/chinup-1.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Biceps",
   "Ön kol",
   "Orta sırt"
  ],
  "level": "beginner",
  "steps": [
   "Barı omuz genişliğinde, avuç içleri sana bakacak şekilde tut.",
   "Dirsekleri gövdenin önünden aşağı çekerek göğsünü bara yaklaştır.",
   "Çene barı geçince kontrollü aşağı in."
  ],
  "tips": [
   "Barfikse göre biceps daha çok çalışır, genelde daha kolaydır."
  ],
  "met": 6.0
 },
 {
  "id": "lat-pulldown",
  "region": "sirt",
  "name": "Lat Pulldown",
  "type": "weight",
  "img": [
   "img/lat-pulldown-0.jpg",
   "img/lat-pulldown-1.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Biceps",
   "Orta sırt",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Dizlerini pedin altına sabitle, barı geniş kavrayışla tut.",
   "Göğsünü dik tut, hafifçe geriye yaslan.",
   "Dirsekleri aşağı çekerek barı üst göğsüne indir; kürek kemiklerini sık.",
   "Kolları kontrollü şekilde tamamen uzat."
  ],
  "tips": [
   "Barı ensenin arkasına çekme."
  ],
  "met": 6.0
 },
 {
  "id": "bb-row",
  "region": "sirt",
  "name": "Barbell Row",
  "type": "weight",
  "img": [
   "img/bb-row-0.jpg",
   "img/bb-row-1.jpg"
  ],
  "primary": [
   "Orta sırt"
  ],
  "secondary": [
   "Biceps",
   "Latissimus",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Ayaklar kalça genişliğinde, dizler hafif bükülü; gövdeyi kalçadan ~45–60° öne eğ.",
   "Barı omuz genişliğinde kavra, sırtını düz tut.",
   "Dirsekleri geriye çekerek barı göbek hizasına getir, kürek kemiklerini sık.",
   "Barı kontrollü şekilde indir."
  ],
  "tips": [
   "Belini yuvarlama; gövde açısını sabit tut."
  ],
  "met": 6.0
 },
 {
  "id": "db-row",
  "region": "sirt",
  "name": "Tek Kol Dumbbell Row",
  "type": "weight",
  "img": [
   "img/db-row-0.jpg",
   "img/db-row-1.jpg"
  ],
  "primary": [
   "Orta sırt"
  ],
  "secondary": [
   "Biceps",
   "Latissimus",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Sol diz ve sol eli sehpaya koy, sırtını yere paralel ve düz tut.",
   "Sağ elde dambıl kol düz şekilde sarksın.",
   "Dirseği gövdeye yakın geriye çekerek dambılı kalçana doğru getir.",
   "Kontrollü indir. Seti bitirince taraf değiştir."
  ],
  "tips": [
   "Gövdeyi döndürerek çekme."
  ],
  "met": 6.0
 },
 {
  "id": "straight-arm-pd",
  "region": "sirt",
  "name": "Straight-Arm Pulldown",
  "type": "weight",
  "img": [
   "img/straight-arm-pd-0.jpg",
   "img/straight-arm-pd-1.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makarayı yükseğe ayarla, düz barı omuz genişliğinde tut ve bir adım geri çekil.",
   "Kalçadan hafifçe öne eğil, kollar neredeyse düz.",
   "Kolları bükmeden barı uyluklarına doğru bastır.",
   "Kontrollü şekilde yukarı bırak."
  ],
  "tips": [
   "Dirsek açısını hareket boyunca sabit tut."
  ],
  "met": 4.0
 },
 {
  "id": "deadlift",
  "region": "sirt",
  "name": "Deadlift",
  "type": "weight",
  "img": [
   "img/deadlift-0.jpg",
   "img/deadlift-1.jpg"
  ],
  "primary": [
   "Bel"
  ],
  "secondary": [
   "Baldır",
   "Ön kol",
   "Kalça",
   "Arka bacak",
   "Latissimus",
   "Orta sırt",
   "Ön bacak",
   "Trapez"
  ],
  "level": "intermediate",
  "steps": [
   "Bar ayak ortasının üstünde olacak şekilde dur, ayaklar kalça genişliğinde.",
   "Kalçadan eğilip barı kavra; kaval kemikleri bara değsin, sırt düz.",
   "Göğsü kaldır, nefesi tut ve yeri iterek barı bacaklarına yakın kaldır.",
   "Kalça ve dizleri birlikte kilitle; aynı yoldan kontrollü indir."
  ],
  "tips": [
   "Belini asla yuvarlama.",
   "Bar vücuda yakın kalmalı."
  ],
  "met": 6.0
 },
 {
  "id": "close-grip-pulldown",
  "region": "sirt",
  "name": "Dar Tutuş Lat Pulldown",
  "type": "weight",
  "img": [
   "img/close-grip-pulldown-0.jpg",
   "img/close-grip-pulldown-1.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Biceps",
   "Orta sırt",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Barı omuz genişliğinde, avuçlar öne bakacak şekilde tut.",
   "Göğsünü dik tutarak barı üst göğsüne çek.",
   "Kolları kontrollü şekilde uzat."
  ],
  "tips": [
   "Dirsekleri aşağı ve geriye sür."
  ],
  "met": 6.0
 },
 {
  "id": "vbar-pulldown",
  "region": "sirt",
  "name": "V-Bar Pulldown",
  "type": "weight",
  "img": [
   "img/vbar-pulldown-0.jpg",
   "img/vbar-pulldown-1.jpg"
  ],
  "primary": [
   "Latissimus"
  ],
  "secondary": [
   "Biceps",
   "Orta sırt",
   "Omuz"
  ],
  "level": "intermediate",
  "steps": [
   "V tutamağı avuçlar karşılıklı tut ve otur.",
   "Hafifçe geriye yaslanarak tutamağı göğsüne çek.",
   "Kürek kemiklerini sıkıp yavaşça bırak."
  ],
  "tips": [
   "Gövdeyle sallanma."
  ],
  "met": 6.0
 },
 {
  "id": "tbar-row",
  "region": "sirt",
  "name": "T-Bar Row",
  "type": "weight",
  "img": [
   "img/tbar-row-0.jpg",
   "img/tbar-row-1.jpg"
  ],
  "primary": [
   "Orta sırt"
  ],
  "secondary": [
   "Biceps",
   "Latissimus"
  ],
  "level": "beginner",
  "steps": [
   "Barın üstünde dur, dizler hafif bükülü, gövde öne eğik.",
   "Tutamağı göğsüne doğru çek, kürek kemiklerini sık.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Sırtını düz tut."
  ],
  "met": 6.0
 },
 {
  "id": "inverted-row",
  "region": "sirt",
  "name": "Ters Row (Inverted Row)",
  "type": "bodyweight",
  "img": [
   "img/inverted-row-0.jpg",
   "img/inverted-row-1.jpg"
  ],
  "primary": [
   "Orta sırt"
  ],
  "secondary": [
   "Latissimus"
  ],
  "level": "beginner",
  "steps": [
   "Bel hizasındaki barın altına uzan, barı tut.",
   "Vücut düz, göğsünü bara doğru çek.",
   "Yavaşça in."
  ],
  "tips": [
   "Ayakları yükseltirsen zorlaşır."
  ],
  "met": 6.0
 },
 {
  "id": "db-bent-row",
  "region": "sirt",
  "name": "Dumbbell Bent-Over Row",
  "type": "weight",
  "img": [
   "img/db-bent-row-0.jpg",
   "img/db-bent-row-1.jpg"
  ],
  "primary": [
   "Orta sırt"
  ],
  "secondary": [
   "Biceps",
   "Latissimus",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Dambılları tut, dizler hafif bükülü, gövdeyi öne eğ.",
   "Dambılları beline doğru çek.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Belini yuvarlama."
  ],
  "met": 6.0
 },
 {
  "id": "good-morning",
  "region": "sirt",
  "name": "Good Morning",
  "type": "weight",
  "img": [
   "img/good-morning-0.jpg",
   "img/good-morning-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [
   "Karın",
   "Kalça",
   "Bel"
  ],
  "level": "intermediate",
  "steps": [
   "Barı sırtına al, dizler hafif bükülü.",
   "Kalçanı geriye iterek gövdeyi yere paralele yakın eğ.",
   "Kalçayı öne sürerek dik konuma dön."
  ],
  "tips": [
   "Hafif ağırlıkla başla, sırt düz kalsın."
  ],
  "met": 6.0
 },
 {
  "id": "rack-pull",
  "region": "sirt",
  "name": "Rack Pull",
  "type": "weight",
  "img": [
   "img/rack-pull-0.jpg",
   "img/rack-pull-1.jpg"
  ],
  "primary": [
   "Bel"
  ],
  "secondary": [
   "Ön kol",
   "Kalça",
   "Arka bacak",
   "Trapez"
  ],
  "level": "intermediate",
  "steps": [
   "Barı rack'te diz hizasının biraz altına yerleştir.",
   "Barı kavra, sırt düz, kalçayı ileri sürerek kaldır.",
   "Kontrollü şekilde pimlere indir."
  ],
  "tips": [
   "Deadlift'in üst kısmını güçlendirir."
  ],
  "met": 6.0
 },
 {
  "id": "hyperextension",
  "region": "sirt",
  "name": "Hiperekstansiyon (Bel)",
  "type": "bodyweight",
  "img": [
   "img/hyperextension-0.jpg",
   "img/hyperextension-1.jpg"
  ],
  "primary": [
   "Bel"
  ],
  "secondary": [
   "Kalça",
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Hiperekstansiyon sehpasına yüzüstü yerleş, bacaklarını sabitle.",
   "Gövdeni kalçadan aşağı indir.",
   "Gövde bacaklarla aynı hizaya gelene kadar kalk."
  ],
  "tips": [
   "Tepede belini aşırı bükme."
  ],
  "met": 4.0
 },
 {
  "id": "front-squat",
  "region": "bacak",
  "name": "Front Squat",
  "type": "weight",
  "img": [
   "img/front-squat-0.jpg",
   "img/front-squat-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "expert",
  "steps": [
   "Barı omuzların önüne, köprücük kemiğinin üstüne yerleştir; dirsekler yukarıda.",
   "Gövdeyi dik tutarak çömel.",
   "Uyluklar paralelin altına inince topuklardan iterek kalk."
  ],
  "tips": [
   "Dirsekler düşerse bar öne kayar — dirsekleri yüksek tut."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/front-squat-0.mp4",
    "poster": "vid/front-squat-0.jpg"
   },
   {
    "src": "vid/front-squat-1.mp4",
    "poster": "vid/front-squat-1.jpg"
   },
   {
    "src": "vid/front-squat-2.mp4",
    "poster": "vid/front-squat-2.jpg"
   }
  ]
 },
 {
  "id": "lunge",
  "region": "bacak",
  "name": "Hamle (Lunge)",
  "type": "weight",
  "img": [
   "img/lunge-0.jpg",
   "img/lunge-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Dambılları yanlarda tutarak dik dur ve bir adım öne at.",
   "Arka diz yere yaklaşana kadar dikey olarak aşağı in; iki diz de ~90°.",
   "Öndeki topuktan iterek yukarı çık. Setin yarısında bacak değiştir."
  ],
  "tips": [
   "Gövdeyi dik tut."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/lunge-0.mp4",
    "poster": "vid/lunge-0.jpg"
   },
   {
    "src": "vid/lunge-1.mp4",
    "poster": "vid/lunge-1.jpg"
   },
   {
    "src": "vid/lunge-2.mp4",
    "poster": "vid/lunge-2.jpg"
   }
  ]
 },
 {
  "id": "rdl",
  "region": "bacak",
  "name": "Romanian Deadlift",
  "type": "weight",
  "img": [
   "img/rdl-0.jpg",
   "img/rdl-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Bel"
  ],
  "level": "intermediate",
  "steps": [
   "Barı kalça önünde tutarak dik dur, dizler hafif bükülü.",
   "Kalçanı geriye iterek gövdeyi öne eğ; bar bacaklarına yakın kaysın.",
   "Arka bacakta gerilme hissedince kalçayı öne sürerek kalk."
  ],
  "tips": [
   "Hareket kalçadan; dizler neredeyse sabit."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/rdl-0.mp4",
    "poster": "vid/rdl-0.jpg"
   },
   {
    "src": "vid/rdl-1.mp4",
    "poster": "vid/rdl-1.jpg"
   },
   {
    "src": "vid/rdl-2.mp4",
    "poster": "vid/rdl-2.jpg"
   }
  ]
 },
 {
  "id": "leg-press",
  "region": "bacak",
  "name": "Leg Press",
  "type": "weight",
  "img": [
   "img/leg-press-0.jpg",
   "img/leg-press-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Makineye otur, ayaklarını platforma omuz genişliğinde yerleştir.",
   "Kilidi aç; dizleri göğsüne doğru kontrollü bük (~90°).",
   "Topuklardan iterek platformu it; dizleri tam kilitleme."
  ],
  "tips": [
   "Belin koltuktan kalkmayacak kadar in."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/leg-press-0.mp4",
    "poster": "vid/leg-press-0.jpg"
   },
   {
    "src": "vid/leg-press-1.mp4",
    "poster": "vid/leg-press-1.jpg"
   },
   {
    "src": "vid/leg-press-2.mp4",
    "poster": "vid/leg-press-2.jpg"
   }
  ]
 },
 {
  "id": "leg-curl",
  "region": "bacak",
  "name": "Lying Leg Curl",
  "type": "weight",
  "img": [
   "img/leg-curl-0.jpg",
   "img/leg-curl-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makineye yüzüstü uzan, ped ayak bileklerinin arkasında, dizler sehpanın ucunda.",
   "Tutamakları tut, topukları kalçana doğru çek.",
   "Tepede sık, yavaşça indir."
  ],
  "tips": [
   "Kalçanı sehpadan kaldırma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/leg-curl-0.mp4",
    "poster": "vid/leg-curl-0.jpg"
   },
   {
    "src": "vid/leg-curl-1.mp4",
    "poster": "vid/leg-curl-1.jpg"
   }
  ]
 },
 {
  "id": "hip-thrust",
  "region": "bacak",
  "name": "Hip Thrust",
  "type": "weight",
  "img": [
   "img/hip-thrust-0.jpg",
   "img/hip-thrust-1.jpg"
  ],
  "primary": [
   "Kalça"
  ],
  "secondary": [
   "Baldır",
   "Arka bacak"
  ],
  "level": "intermediate",
  "steps": [
   "Sırtının üst kısmını sehpaya daya, barı kalça kemiğinin üstüne yerleştir.",
   "Ayaklar yere basık, dizler ~90° olacak kadar yakın.",
   "Topuklardan iterek kalçayı gövde ile aynı hizaya kaldır, tepede sık.",
   "Kontrollü indir."
  ],
  "tips": [
   "Barın altına pad koy.",
   "Çeneni hafif göğse yakın tut."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/hip-thrust-0.mp4",
    "poster": "vid/hip-thrust-0.jpg"
   },
   {
    "src": "vid/hip-thrust-1.mp4",
    "poster": "vid/hip-thrust-1.jpg"
   }
  ]
 },
 {
  "id": "calf-raise",
  "region": "bacak",
  "name": "Baldır Kaldırma",
  "type": "weight",
  "img": [
   "img/calf-raise-0.jpg",
   "img/calf-raise-1.jpg"
  ],
  "primary": [
   "Baldır"
  ],
  "secondary": [],
  "level": "intermediate",
  "steps": [
   "Dambılları yanlarda tut, ayaklar kalça genişliğinde.",
   "Parmak uçlarında olabildiğince yükseğe kalk.",
   "Tepede 1 sn bekle, topukları yavaşça indir."
  ],
  "tips": [
   "Bir basamağın kenarında yaparsan hareket açıklığı artar."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/calf-raise-0.mp4",
    "poster": "vid/calf-raise-0.jpg"
   },
   {
    "src": "vid/calf-raise-1.mp4",
    "poster": "vid/calf-raise-1.jpg"
   }
  ]
 },
 {
  "id": "hack-squat",
  "region": "bacak",
  "name": "Hack Squat (Makine)",
  "type": "weight",
  "img": [
   "img/hack-squat-0.jpg",
   "img/hack-squat-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Makineye sırtını yasla, omuzlar pedlerin altında.",
   "Dizleri bükerek uyluklar paralele gelene kadar in.",
   "Topuklardan iterek kalk."
  ],
  "tips": [
   "Dizleri tam kilitleme."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/hack-squat-0.mp4",
    "poster": "vid/hack-squat-0.jpg"
   },
   {
    "src": "vid/hack-squat-1.mp4",
    "poster": "vid/hack-squat-1.jpg"
   }
  ]
 },
 {
  "id": "walking-lunge",
  "region": "bacak",
  "name": "Yürüyen Lunge",
  "type": "weight",
  "img": [
   "img/walking-lunge-0.jpg",
   "img/walking-lunge-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Barı sırtına al, bir adım öne at.",
   "Arka diz yere yaklaşana kadar in.",
   "Arka bacağı öne getirip diğer bacakla devam et."
  ],
  "tips": [
   "Adım uzunluğunu sabit tut."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/walking-lunge-0.mp4",
    "poster": "vid/walking-lunge-0.jpg"
   },
   {
    "src": "vid/walking-lunge-1.mp4",
    "poster": "vid/walking-lunge-1.jpg"
   }
  ]
 },
 {
  "id": "seated-leg-curl",
  "region": "bacak",
  "name": "Oturarak Leg Curl",
  "type": "weight",
  "img": [
   "img/seated-leg-curl-0.jpg",
   "img/seated-leg-curl-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makineye otur, ped ayak bileklerinin arkasında.",
   "Topukları aşağı ve geriye doğru çek.",
   "Yavaşça geri bırak."
  ],
  "tips": [
   "Kalçanı koltuktan kaldırma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/seated-leg-curl-0.mp4",
    "poster": "vid/seated-leg-curl-0.jpg"
   }
  ]
 },
 {
  "id": "seated-calf",
  "region": "bacak",
  "name": "Oturarak Baldır",
  "type": "weight",
  "img": [
   "img/seated-calf-0.jpg",
   "img/seated-calf-1.jpg"
  ],
  "primary": [
   "Baldır"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makineye otur, ped dizlerinin üstünde, parmak uçları platformda.",
   "Topuklarını olabildiğince yükselt.",
   "Yavaşça aşağı indir, gerilmeyi hisset."
  ],
  "tips": [
   "Soleus kasını hedefler."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/seated-calf-0.mp4",
    "poster": "vid/seated-calf-0.jpg"
   }
  ]
 },
 {
  "id": "hip-adduction",
  "region": "bacak",
  "name": "Makine Adduksiyon (İç Bacak)",
  "type": "weight",
  "img": [
   "vid/hip-adduction-0.jpg",
   "vid/hip-adduction-0.jpg"
  ],
  "primary": [
   "İç bacak"
  ],
  "secondary": [
   "Kalça"
  ],
  "level": null,
  "steps": [
   "Makineye otur, pedler dizlerinin iç tarafında olsun.",
   "Bacaklarını birbirine doğru kapat.",
   "Kontrollü şekilde geri aç."
  ],
  "tips": [
   "Ağırlığı sallayarak kapatma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/hip-adduction-0.mp4",
    "poster": "vid/hip-adduction-0.jpg"
   }
  ]
 },
 {
  "id": "smith-squat",
  "region": "bacak",
  "name": "Smith Machine Squat",
  "type": "weight",
  "img": [
   "vid/smith-squat-0.jpg",
   "vid/smith-squat-0.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Kalça",
   "Arka bacak"
  ],
  "level": null,
  "steps": [
   "Barı üst sırtına al, ayakları biraz öne koy.",
   "Uyluklar paralele gelene kadar çömel.",
   "Topuklardan iterek kalk."
  ],
  "tips": [
   "Bar sabit rayda olduğu için yeni başlayanlar için güvenlidir."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/smith-squat-0.mp4",
    "poster": "vid/smith-squat-0.jpg"
   }
  ]
 },
 {
  "id": "standing-leg-curl",
  "region": "bacak",
  "name": "Ayakta Leg Curl",
  "type": "weight",
  "img": [
   "vid/standing-leg-curl-0.jpg",
   "vid/standing-leg-curl-0.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [
   "Baldır"
  ],
  "level": null,
  "steps": [
   "Makinede ayakta dur, ped ayak bileğinin arkasında.",
   "Topuğunu kalçana doğru çek.",
   "Yavaşça indir, bacak değiştir."
  ],
  "tips": [
   "Kalçanı sabit tut."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/standing-leg-curl-0.mp4",
    "poster": "vid/standing-leg-curl-0.jpg"
   },
   {
    "src": "vid/standing-leg-curl-1.mp4",
    "poster": "vid/standing-leg-curl-1.jpg"
   }
  ]
 },
 {
  "id": "squat",
  "region": "bacak",
  "name": "Squat",
  "type": "weight",
  "img": [
   "img/squat-0.jpg",
   "img/squat-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak",
   "Bel"
  ],
  "level": "beginner",
  "steps": [
   "Barı üst sırtına (trapez) yerleştir, ayaklar omuz genişliğinde, parmak uçları hafif dışa.",
   "Nefes al, karnını sık; kalçayı geri ve aşağı göndererek çömel.",
   "Dizler parmak uçlarıyla aynı yönde; uyluklar en az yere paralel olana kadar in.",
   "Topuklarından iterek yukarı kalk."
  ],
  "tips": [
   "Topuklar yerden kalkmasın.",
   "Dizlerin içe kapanmasına izin verme."
  ],
  "met": 6.0
 },
 {
  "id": "goblet-squat",
  "region": "bacak",
  "name": "Goblet Squat",
  "type": "weight",
  "img": [
   "img/goblet-squat-0.jpg",
   "img/goblet-squat-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Dambılı dikey olarak göğsünün önünde iki elle tut.",
   "Ayaklar omuz genişliğinde, göğüs dik şekilde çömel.",
   "Dirsekler dizlerin iç tarafına değecek kadar in, sonra kalk."
  ],
  "tips": [
   "Squat tekniğini öğrenmek için ideal."
  ],
  "met": 6.0
 },
 {
  "id": "bulgarian",
  "region": "bacak",
  "name": "Bulgarian Split Squat",
  "type": "weight",
  "img": [
   "img/bulgarian-0.jpg",
   "img/bulgarian-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "expert",
  "steps": [
   "Arka ayağının üstünü sehpaya koy, ön ayak bir adım önde.",
   "Ön uyluk yere paralel olana kadar dikey olarak in.",
   "Ön topuktan iterek kalk. Seti bitirince bacak değiştir."
  ],
  "tips": [
   "Ön ayağı sehpadan yeterince uzağa koy."
  ],
  "met": 6.0
 },
 {
  "id": "sumo-dl",
  "region": "bacak",
  "name": "Sumo Deadlift",
  "type": "weight",
  "img": [
   "img/sumo-dl-0.jpg",
   "img/sumo-dl-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [
   "İç bacak",
   "Ön kol",
   "Kalça",
   "Bel",
   "Orta sırt",
   "Ön bacak",
   "Trapez"
  ],
  "level": "intermediate",
  "steps": [
   "Ayakları geniş aç, parmak uçları dışa dönük; bar ayak ortasının üstünde.",
   "Barı bacakların arasından omuz genişliğinde kavra, göğüs dik.",
   "Dizleri dışa iterek ve yeri iterek barı kaldır.",
   "Kalçayı kilitle, kontrollü indir."
  ],
  "tips": [
   "Dizler ayak parmaklarıyla aynı yöne baksın."
  ],
  "met": 6.0
 },
 {
  "id": "leg-ext",
  "region": "bacak",
  "name": "Leg Extension",
  "type": "weight",
  "img": [
   "img/leg-ext-0.jpg",
   "img/leg-ext-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makineye otur, dizlerin eksen noktasıyla hizalı, pedi ayak bileklerinin önüne ayarla.",
   "Yan tutamaçları tut ve bacaklarını tamamen uzat.",
   "Tepede 1 saniye sık, kontrollü şekilde indir."
  ],
  "tips": [
   "Ağırlığı sallayarak kaldırma."
  ],
  "met": 4.0
 },
 {
  "id": "glute-bridge",
  "region": "bacak",
  "name": "Glute Bridge",
  "type": "bodyweight",
  "img": [
   "img/glute-bridge-0.jpg",
   "img/glute-bridge-1.jpg"
  ],
  "primary": [
   "Kalça"
  ],
  "secondary": [
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, dizler bükülü, ayaklar yerde.",
   "Topuklardan iterek kalçanı omuz-diz hizasına kaldır.",
   "Tepede kalçanı sık, yavaşça indir."
  ],
  "tips": [
   "Belinle değil kalçanla kaldır."
  ],
  "met": 4.0
 },
 {
  "id": "box-squat",
  "region": "bacak",
  "name": "Box Squat",
  "type": "weight",
  "img": [
   "img/box-squat-0.jpg",
   "img/box-squat-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "İç bacak",
   "Baldır",
   "Kalça",
   "Arka bacak",
   "Bel"
  ],
  "level": "intermediate",
  "steps": [
   "Barı sırtına al, arkana bir kutu/sehpa koy.",
   "Kalçayı geriye göndererek kutuya kısaca otur.",
   "Topuklardan iterek kalk."
  ],
  "tips": [
   "Kutuya çökme, kontrollü otur."
  ],
  "met": 6.0
 },
 {
  "id": "bodyweight-squat",
  "region": "bacak",
  "name": "Vücut Ağırlığıyla Squat",
  "type": "bodyweight",
  "img": [
   "img/bodyweight-squat-0.jpg",
   "img/bodyweight-squat-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Kalça",
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Ayaklar omuz genişliğinde, kollar önde.",
   "Kalçayı geriye göndererek çömel.",
   "Topuklardan iterek kalk."
  ],
  "tips": [
   "Isınma için de idealdir."
  ],
  "met": 6.0
 },
 {
  "id": "rear-lunge",
  "region": "bacak",
  "name": "Geri Lunge",
  "type": "weight",
  "img": [
   "img/rear-lunge-0.jpg",
   "img/rear-lunge-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "intermediate",
  "steps": [
   "Dambılları yanlarda tut, dik dur.",
   "Bir adım geriye at ve arka dizi yere yaklaştır.",
   "Öndeki topuktan iterek başlangıca dön."
  ],
  "tips": [
   "Dizler için öne lunge'dan daha rahattır."
  ],
  "met": 6.0
 },
 {
  "id": "step-up",
  "region": "bacak",
  "name": "Step-up",
  "type": "weight",
  "img": [
   "img/step-up-0.jpg",
   "img/step-up-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Arka bacak"
  ],
  "level": "intermediate",
  "steps": [
   "Dambılları tut, bir ayağını sehpaya koy.",
   "Öndeki topuktan iterek sehpaya çık.",
   "Kontrollü şekilde in, bacak değiştir."
  ],
  "tips": [
   "Arka ayakla zıplamadan it."
  ],
  "met": 6.0
 },
 {
  "id": "sldl-db",
  "region": "bacak",
  "name": "Dumbbell Stiff-Leg Deadlift",
  "type": "weight",
  "img": [
   "img/sldl-db-0.jpg",
   "img/sldl-db-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [
   "Kalça",
   "Bel"
  ],
  "level": "beginner",
  "steps": [
   "Dambılları uyluk önünde tut, dizler neredeyse düz.",
   "Kalçadan eğilerek dambılları aşağı indir.",
   "Arka bacakları sıkarak kalk."
  ],
  "tips": [
   "Sırt düz kalmalı."
  ],
  "met": 6.0
 },
 {
  "id": "glute-kickback",
  "region": "bacak",
  "name": "Glute Kickback",
  "type": "bodyweight",
  "img": [
   "img/glute-kickback-0.jpg",
   "img/glute-kickback-1.jpg"
  ],
  "primary": [
   "Kalça"
  ],
  "secondary": [
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Dört ayak pozisyonuna geç.",
   "Bir bacağını dizi bükülü şekilde yukarı it.",
   "Kalçayı sık, yavaşça indir."
  ],
  "tips": [
   "Belini çukurlaştırma."
  ],
  "met": 6.0
 },
 {
  "id": "kb-swing",
  "region": "bacak",
  "name": "Kettlebell Swing",
  "type": "weight",
  "img": [
   "img/kb-swing-0.jpg",
   "img/kb-swing-1.jpg"
  ],
  "primary": [
   "Arka bacak"
  ],
  "secondary": [
   "Baldır",
   "Kalça",
   "Bel",
   "Omuz"
  ],
  "level": "intermediate",
  "steps": [
   "Kettlebell'i bacakların arasından geriye salla.",
   "Kalçayı güçlü şekilde öne iterek göğüs hizasına savur.",
   "Kontrollü şekilde geri salla."
  ],
  "tips": [
   "Güç kollardan değil kalçadan gelir."
  ],
  "met": 8.0
 },
 {
  "id": "single-leg-bridge",
  "region": "bacak",
  "name": "Tek Bacak Köprü",
  "type": "bodyweight",
  "img": [
   "img/single-leg-bridge-0.jpg",
   "img/single-leg-bridge-1.jpg"
  ],
  "primary": [
   "Kalça"
  ],
  "secondary": [
   "Arka bacak"
  ],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, bir ayak yerde, diğer bacak havada.",
   "Yerdeki topuktan iterek kalçayı kaldır.",
   "Yavaşça indir, bacak değiştir."
  ],
  "tips": [
   "Kalçanın yana düşmesine izin verme."
  ],
  "met": 4.0
 },
 {
  "id": "db-shoulder-press",
  "region": "omuz",
  "name": "Dumbbell Shoulder Press",
  "type": "weight",
  "img": [
   "img/db-shoulder-press-0.jpg",
   "img/db-shoulder-press-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Triceps"
  ],
  "level": "intermediate",
  "steps": [
   "Dik sırtlı sehpaya otur, dambılları omuz hizasında tut, avuçlar öne.",
   "Dambılları başının üstünde birbirine yaklaşacak şekilde it.",
   "Kontrollü şekilde omuz hizasına indir."
  ],
  "tips": [
   "Sırtını pedden ayırma."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/db-shoulder-press-0.mp4",
    "poster": "vid/db-shoulder-press-0.jpg"
   }
  ]
 },
 {
  "id": "lateral-raise",
  "region": "omuz",
  "name": "Lateral Raise",
  "type": "weight",
  "img": [
   "img/lateral-raise-0.jpg",
   "img/lateral-raise-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Dambılları yanlarda tut, dirsekler hafif bükülü.",
   "Kolları yanlara, omuz hizasına kadar kaldır.",
   "Tepede kısa dur, yavaşça indir."
  ],
  "tips": [
   "Trapezle (omuz silkerek) kaldırma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/lateral-raise-0.mp4",
    "poster": "vid/lateral-raise-0.jpg"
   }
  ]
 },
 {
  "id": "reverse-fly",
  "region": "omuz",
  "name": "Reverse Fly",
  "type": "weight",
  "img": [
   "img/reverse-fly-0.jpg",
   "img/reverse-fly-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Dizler hafif bükülü, gövdeyi kalçadan öne eğ; dambıllar aşağı sarkık.",
   "Dirsekler hafif bükülü şekilde kolları yanlara aç.",
   "Kürek kemiklerini sık, yavaşça indir."
  ],
  "tips": [
   "Boyun nötr, sırt düz kalsın."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/reverse-fly-0.mp4",
    "poster": "vid/reverse-fly-0.jpg"
   },
   {
    "src": "vid/reverse-fly-1.mp4",
    "poster": "vid/reverse-fly-1.jpg"
   },
   {
    "src": "vid/reverse-fly-2.mp4",
    "poster": "vid/reverse-fly-2.jpg"
   }
  ]
 },
 {
  "id": "face-pull",
  "region": "omuz",
  "name": "Face Pull",
  "type": "weight",
  "img": [
   "img/face-pull-0.jpg",
   "img/face-pull-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Orta sırt"
  ],
  "level": "intermediate",
  "steps": [
   "Makarayı yüz hizasına ayarla, ipi iki elle tut.",
   "Dirsekleri yüksek tutarak ipi yüzüne doğru çek, uçları kulaklarının yanına ayır.",
   "Kürek kemiklerini sık, kontrollü geri bırak."
  ],
  "tips": [
   "Omuz sağlığı için her antrenmana eklenebilir."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/face-pull-0.mp4",
    "poster": "vid/face-pull-0.jpg"
   },
   {
    "src": "vid/face-pull-1.mp4",
    "poster": "vid/face-pull-1.jpg"
   }
  ]
 },
 {
  "id": "machine-shoulder-press",
  "region": "omuz",
  "name": "Makine Shoulder Press",
  "type": "weight",
  "img": [
   "img/machine-shoulder-press-0.jpg",
   "img/machine-shoulder-press-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Koltuğu tutamaklar omuz hizasında olacak şekilde ayarla.",
   "Tutamakları yukarı it.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Sırtını pede yasla."
  ],
  "met": 6.0,
  "videos": [
   {
    "src": "vid/machine-shoulder-press-0.mp4",
    "poster": "vid/machine-shoulder-press-0.jpg"
   }
  ]
 },
 {
  "id": "ohp",
  "region": "omuz",
  "name": "Overhead Press",
  "type": "weight",
  "img": [
   "img/ohp-0.jpg",
   "img/ohp-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Triceps"
  ],
  "level": "beginner",
  "steps": [
   "Barı köprücük kemiği hizasında, omuz genişliğinde kavra.",
   "Karın ve kalçanı sık, barı dik bir çizgide başının üstüne it.",
   "Bar alnını geçince başını hafifçe öne al; tepede kolları kilitle.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Belini geriye bükme."
  ],
  "met": 6.0
 },
 {
  "id": "arnold-press",
  "region": "omuz",
  "name": "Arnold Press",
  "type": "weight",
  "img": [
   "img/arnold-press-0.jpg",
   "img/arnold-press-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Triceps"
  ],
  "level": "intermediate",
  "steps": [
   "Dambılları yüzünün önünde, avuçlar sana bakacak şekilde tut.",
   "İtmeye başlarken kolları yana açıp avuçları öne çevir.",
   "Dambılları başının üstüne it, aynı dönüşle geri indir."
  ],
  "tips": [
   "Hareketi akıcı ve kontrollü yap."
  ],
  "met": 6.0
 },
 {
  "id": "front-raise",
  "region": "omuz",
  "name": "Front Raise",
  "type": "weight",
  "img": [
   "img/front-raise-0.jpg",
   "img/front-raise-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Dambılları uyluklarının önünde tut.",
   "Kolları düz şekilde öne, omuz hizasına kadar kaldır.",
   "Yavaşça indir; gövdeyle sallanma."
  ],
  "tips": [
   "Dönüşümlü de yapılabilir."
  ],
  "met": 4.0
 },
 {
  "id": "upright-row",
  "region": "omuz",
  "name": "Upright Row",
  "type": "weight",
  "img": [
   "img/upright-row-0.jpg",
   "img/upright-row-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Trapez"
  ],
  "level": "beginner",
  "steps": [
   "Barı uyluklarının önünde, omuz genişliğinde tut.",
   "Dirsekleri yana ve yukarı çekerek barı göğüs hizasına kaldır.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Dirsekleri omuz hizasından yukarı çıkarma.",
   "Dar tutuş omzu zorlar."
  ],
  "met": 6.0
 },
 {
  "id": "seated-bb-press",
  "region": "omuz",
  "name": "Oturarak Barbell Press",
  "type": "weight",
  "img": [
   "img/seated-bb-press-0.jpg",
   "img/seated-bb-press-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Triceps"
  ],
  "level": "intermediate",
  "steps": [
   "Dik sehpaya otur, barı üst göğüs hizasında tut.",
   "Barı başının üstüne it.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Belini pedden ayırma."
  ],
  "met": 6.0
 },
 {
  "id": "cable-lateral",
  "region": "omuz",
  "name": "Kablo Lateral Raise",
  "type": "weight",
  "img": [
   "img/cable-lateral-0.jpg",
   "img/cable-lateral-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Orta sırt",
   "Trapez"
  ],
  "level": "beginner",
  "steps": [
   "Alt makaranın yanında dur/otur, tutamağı karşı elle tut.",
   "Kolu yana, omuz hizasına kaldır.",
   "Yavaşça indir."
  ],
  "tips": [
   "Kablo, hareketin başında da gerilim sağlar."
  ],
  "met": 4.0
 },
 {
  "id": "rear-delt-machine",
  "region": "omuz",
  "name": "Makine Reverse Fly",
  "type": "weight",
  "img": [
   "img/rear-delt-machine-0.jpg",
   "img/rear-delt-machine-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Pec deck makinesine yüzün pede dönük otur.",
   "Kolları yana ve geriye aç.",
   "Kürek kemiklerini sık, yavaşça geri gel."
  ],
  "tips": [
   "Arka omuz için en kolay izolasyon."
  ],
  "met": 4.0
 },
 {
  "id": "plate-raise",
  "region": "omuz",
  "name": "Plaka ile Front Raise",
  "type": "weight",
  "img": [
   "img/plate-raise-0.jpg",
   "img/plate-raise-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [],
  "level": "intermediate",
  "steps": [
   "Plakayı iki elle önünde tut.",
   "Kolları düz şekilde göz hizasına kaldır.",
   "Yavaşça indir."
  ],
  "tips": [
   "Gövdeyle sallanma."
  ],
  "met": 4.0
 },
 {
  "id": "db-upright-row",
  "region": "omuz",
  "name": "Dumbbell Upright Row",
  "type": "weight",
  "img": [
   "img/db-upright-row-0.jpg",
   "img/db-upright-row-1.jpg"
  ],
  "primary": [
   "Trapez"
  ],
  "secondary": [
   "Biceps",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Dambılları uyluk önünde tut.",
   "Dirsekleri yana ve yukarı çekerek dambılları göğüs hizasına kaldır.",
   "Kontrollü indir."
  ],
  "tips": [
   "Dirsekler omuz hizasını geçmesin."
  ],
  "met": 6.0
 },
 {
  "id": "push-press",
  "region": "omuz",
  "name": "Push Press",
  "type": "weight",
  "img": [
   "img/push-press-0.jpg",
   "img/push-press-1.jpg"
  ],
  "primary": [
   "Omuz"
  ],
  "secondary": [
   "Ön bacak",
   "Triceps"
  ],
  "level": "expert",
  "steps": [
   "Barı ön omuzlarda tut.",
   "Dizleri hafifçe bükip bacaklarla hız alarak barı yukarı it.",
   "Barı kontrollü şekilde omuzlara indir."
  ],
  "tips": [
   "Bacak gücüyle daha ağır kaldırabilirsin."
  ],
  "met": 8.0
 },
 {
  "id": "biceps-curl",
  "region": "kol",
  "name": "Dumbbell Biceps Curl",
  "type": "weight",
  "img": [
   "img/biceps-curl-0.jpg",
   "img/biceps-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": "beginner",
  "steps": [
   "Dambılları avuç içleri öne bakacak şekilde tut, dirsekler gövdeye yakın.",
   "Dirsekleri sabit tutarak dambılları omuza doğru bük.",
   "Tepede biceps'i sık, yavaşça indir."
  ],
  "tips": [
   "Gövdeyle sallanma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/biceps-curl-0.mp4",
    "poster": "vid/biceps-curl-0.jpg"
   }
  ]
 },
 {
  "id": "hammer-curl",
  "region": "kol",
  "name": "Hammer Curl",
  "type": "weight",
  "img": [
   "img/hammer-curl-0.jpg",
   "img/hammer-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Dambılları avuç içleri birbirine bakacak (çekiç) şekilde tut.",
   "Dirsekler sabit, dambılları omuza doğru kaldır.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Bilekleri bükme."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/hammer-curl-0.mp4",
    "poster": "vid/hammer-curl-0.jpg"
   }
  ]
 },
 {
  "id": "barbell-curl",
  "region": "kol",
  "name": "Barbell Curl",
  "type": "weight",
  "img": [
   "img/barbell-curl-0.jpg",
   "img/barbell-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": "beginner",
  "steps": [
   "Barı omuz genişliğinde, avuçlar öne bakacak şekilde tut.",
   "Dirsekleri gövdene sabitleyerek barı göğsüne doğru kaldır.",
   "Yavaşça tamamen indir."
  ],
  "tips": [
   "EZ bar bileklere daha rahat gelir."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/barbell-curl-0.mp4",
    "poster": "vid/barbell-curl-0.jpg"
   }
  ]
 },
 {
  "id": "preacher-curl",
  "region": "kol",
  "name": "Preacher Curl",
  "type": "weight",
  "img": [
   "img/preacher-curl-0.jpg",
   "img/preacher-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Preacher sehpasına otur, üst kollarını pede yasla.",
   "Barı avuçlar yukarı bakacak şekilde tut.",
   "Barı omuzlarına doğru kaldır, sonra kol neredeyse düzleşene kadar indir."
  ],
  "tips": [
   "Altta kolu tamamen kilitleme; tendonu korur."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/preacher-curl-0.mp4",
    "poster": "vid/preacher-curl-0.jpg"
   },
   {
    "src": "vid/preacher-curl-1.mp4",
    "poster": "vid/preacher-curl-1.jpg"
   },
   {
    "src": "vid/preacher-curl-2.mp4",
    "poster": "vid/preacher-curl-2.jpg"
   }
  ]
 },
 {
  "id": "triceps-pushdown",
  "region": "kol",
  "name": "Triceps Pushdown",
  "type": "weight",
  "img": [
   "img/triceps-pushdown-0.jpg",
   "img/triceps-pushdown-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makarayı yükseğe ayarla, barı avuçlar aşağı bakacak şekilde tut.",
   "Dirsekleri gövdene sabitle.",
   "Barı kolların tamamen uzanana kadar aşağı it, yavaşça geri bırak."
  ],
  "tips": [
   "Dirsekler öne-arkaya oynamasın."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/triceps-pushdown-0.mp4",
    "poster": "vid/triceps-pushdown-0.jpg"
   },
   {
    "src": "vid/triceps-pushdown-1.mp4",
    "poster": "vid/triceps-pushdown-1.jpg"
   },
   {
    "src": "vid/triceps-pushdown-2.mp4",
    "poster": "vid/triceps-pushdown-2.jpg"
   }
  ]
 },
 {
  "id": "skull-crusher",
  "region": "kol",
  "name": "Skull Crusher",
  "type": "weight",
  "img": [
   "img/skull-crusher-0.jpg",
   "img/skull-crusher-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": "beginner",
  "steps": [
   "Sehpaya uzan, barı kollar düz şekilde göğsünün üzerinde tut.",
   "Üst kolları sabit tutarak barı alnına doğru indir.",
   "Dirsekten açarak barı yukarı it."
  ],
  "tips": [
   "Dirsekleri dışa açma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/skull-crusher-0.mp4",
    "poster": "vid/skull-crusher-0.jpg"
   },
   {
    "src": "vid/skull-crusher-1.mp4",
    "poster": "vid/skull-crusher-1.jpg"
   },
   {
    "src": "vid/skull-crusher-2.mp4",
    "poster": "vid/skull-crusher-2.jpg"
   }
  ]
 },
 {
  "id": "triceps-oh",
  "region": "kol",
  "name": "Overhead Triceps Extension",
  "type": "weight",
  "img": [
   "img/triceps-oh-0.jpg",
   "img/triceps-oh-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Tek dambılı iki elle, başının üstünde kollar uzanmış şekilde tut.",
   "Dirsekler yukarıyı gösterirken dambılı başının arkasına indir.",
   "Yalnızca dirsekten açarak dambılı tekrar yukarı it."
  ],
  "tips": [
   "Karnını sıkı tut."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/triceps-oh-0.mp4",
    "poster": "vid/triceps-oh-0.jpg"
   }
  ]
 },
 {
  "id": "kickback",
  "region": "kol",
  "name": "Triceps Kickback",
  "type": "weight",
  "img": [
   "img/kickback-0.jpg",
   "img/kickback-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Gövdeyi öne eğ, üst kolları gövdeye paralel ve sabit tut.",
   "Dirsekten açarak dambılı geriye doğru uzat.",
   "Tepede sık, yavaşça 90°'ye dön."
  ],
  "tips": [
   "Üst kol hareket etmemeli."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/kickback-0.mp4",
    "poster": "vid/kickback-0.jpg"
   },
   {
    "src": "vid/kickback-1.mp4",
    "poster": "vid/kickback-1.jpg"
   },
   {
    "src": "vid/kickback-2.mp4",
    "poster": "vid/kickback-2.jpg"
   }
  ]
 },
 {
  "id": "cable-curl",
  "region": "kol",
  "name": "Kablo Biceps Curl",
  "type": "weight",
  "img": [
   "img/cable-curl-0.jpg",
   "img/cable-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Alt makaraya düz bar tak, avuçlar yukarı tut.",
   "Dirsekler sabit, barı omuzlarına doğru kaldır.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Hareket boyunca sabit gerilim sağlar."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/cable-curl-0.mp4",
    "poster": "vid/cable-curl-0.jpg"
   }
  ]
 },
 {
  "id": "lying-db-ext",
  "region": "kol",
  "name": "Yatarak Dumbbell Triceps Ext.",
  "type": "weight",
  "img": [
   "img/lying-db-ext-0.jpg",
   "img/lying-db-ext-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [
   "Göğüs",
   "Omuz"
  ],
  "level": "intermediate",
  "steps": [
   "Sehpaya uzan, dambılları kollar düz şekilde yukarıda tut.",
   "Üst kollar sabit, dambılları başının yanına indir.",
   "Dirsekten açarak yukarı it."
  ],
  "tips": [
   "Dirsekleri dışa açma."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/lying-db-ext-0.mp4",
    "poster": "vid/lying-db-ext-0.jpg"
   }
  ]
 },
 {
  "id": "cable-hammer",
  "region": "kol",
  "name": "Kablo Hammer Curl (İp)",
  "type": "weight",
  "img": [
   "vid/cable-hammer-0.jpg",
   "vid/cable-hammer-0.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": null,
  "steps": [
   "Alt makaraya ip tak, uçlarından avuçlar karşılıklı tut.",
   "Dirsekler sabit, ipi omuzlarına doğru kaldır.",
   "Yavaşça indir."
  ],
  "tips": [
   "Bilekleri bükme."
  ],
  "met": 4.0,
  "videos": [
   {
    "src": "vid/cable-hammer-0.mp4",
    "poster": "vid/cable-hammer-0.jpg"
   }
  ]
 },
 {
  "id": "concentration-curl",
  "region": "kol",
  "name": "Concentration Curl",
  "type": "weight",
  "img": [
   "img/concentration-curl-0.jpg",
   "img/concentration-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": "beginner",
  "steps": [
   "Sehpaya otur, bacakları aç; dirseğini uyluğunun iç tarafına daya.",
   "Dambılı yalnızca dirsekten bükerek omzuna doğru kaldır.",
   "Tepede sık, yavaşça indir. Seti bitirince kol değiştir."
  ],
  "tips": [
   "Üst kol hareket etmemeli."
  ],
  "met": 4.0
 },
 {
  "id": "bench-dips",
  "region": "kol",
  "name": "Bench Dips",
  "type": "bodyweight",
  "img": [
   "img/bench-dips-0.jpg",
   "img/bench-dips-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [
   "Göğüs",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Ellerini arkandaki sehpanın kenarına koy, bacaklar önde uzanmış.",
   "Dirsekleri geriye bükerek kalçanı aşağı indir (~90°).",
   "Avuçlarından iterek yukarı çık."
  ],
  "tips": [
   "Dizleri bükersen hareket kolaylaşır."
  ],
  "met": 6.0
 },
 {
  "id": "close-grip-bench",
  "region": "kol",
  "name": "Close-Grip Bench Press",
  "type": "weight",
  "img": [
   "img/close-grip-bench-0.jpg",
   "img/close-grip-bench-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [
   "Göğüs",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Barı omuz genişliğinde (daha dar) kavra.",
   "Dirsekleri gövdeye yakın tutarak barı göğsünün alt kısmına indir.",
   "Barı yukarı it, triceps'i sık."
  ],
  "tips": [
   "Çok dar tutuş bileği zorlar."
  ],
  "met": 6.0
 },
 {
  "id": "incline-curl",
  "region": "kol",
  "name": "Incline Dumbbell Curl",
  "type": "weight",
  "img": [
   "img/incline-curl-0.jpg",
   "img/incline-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Eğimli sehpaya yaslan, kollar aşağı sarkık.",
   "Dambılları omuza doğru bük.",
   "Yavaşça tamamen indir."
  ],
  "tips": [
   "Biceps'in uzun başını gerer."
  ],
  "met": 4.0
 },
 {
  "id": "ez-curl",
  "region": "kol",
  "name": "EZ Bar Curl",
  "type": "weight",
  "img": [
   "img/ez-curl-0.jpg",
   "img/ez-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "EZ barı eğimli kısımlarından tut.",
   "Dirsekler sabit, barı göğsüne doğru kaldır.",
   "Yavaşça indir."
  ],
  "tips": [
   "Bileklere düz bardan daha rahat gelir."
  ],
  "met": 4.0
 },
 {
  "id": "alt-curl",
  "region": "kol",
  "name": "Dönüşümlü Dumbbell Curl",
  "type": "weight",
  "img": [
   "img/alt-curl-0.jpg",
   "img/alt-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": "beginner",
  "steps": [
   "Dambılları yanlarda tut.",
   "Bir kolu bükerken bileği dışa çevir.",
   "İndir ve diğer kolla tekrarla."
  ],
  "tips": [
   "Her kolun tekrarını ayrı say."
  ],
  "met": 4.0
 },
 {
  "id": "reverse-curl",
  "region": "kol",
  "name": "Ters Tutuş Barbell Curl",
  "type": "weight",
  "img": [
   "img/reverse-curl-0.jpg",
   "img/reverse-curl-1.jpg"
  ],
  "primary": [
   "Biceps"
  ],
  "secondary": [
   "Ön kol"
  ],
  "level": "beginner",
  "steps": [
   "Barı avuçlar aşağı bakacak şekilde tut.",
   "Dirsekler sabit, barı göğsüne kaldır.",
   "Yavaşça indir."
  ],
  "tips": [
   "Ön kol ve brachialis'i çalıştırır."
  ],
  "met": 4.0
 },
 {
  "id": "rope-pushdown",
  "region": "kol",
  "name": "İpli Triceps Pushdown",
  "type": "weight",
  "img": [
   "img/rope-pushdown-0.jpg",
   "img/rope-pushdown-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Üst makaraya ip tak, iki ucundan tut.",
   "Dirsekler sabit, ipi aşağı itip uçları iki yana ayır.",
   "Yavaşça geri bırak."
  ],
  "tips": [
   "Altta triceps'i sık."
  ],
  "met": 4.0
 },
 {
  "id": "dips-triceps",
  "region": "kol",
  "name": "Triceps Dips",
  "type": "bodyweight",
  "img": [
   "img/dips-triceps-0.jpg",
   "img/dips-triceps-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [
   "Göğüs",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Paralel barlarda gövdeni dik tut.",
   "Dirsekleri geriye bükerek in.",
   "Kolları uzatarak yukarı it."
  ],
  "tips": [
   "Gövde dik kalırsa triceps daha çok çalışır."
  ],
  "met": 6.0
 },
 {
  "id": "cable-oh-ext",
  "region": "kol",
  "name": "Kablo Overhead Triceps Ext.",
  "type": "weight",
  "img": [
   "img/cable-oh-ext-0.jpg",
   "img/cable-oh-ext-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makaraya sırtını dön, ipi başının arkasında tut.",
   "Kolları öne ve yukarı doğru uzat.",
   "Yavaşça geri bük."
  ],
  "tips": [
   "Triceps'in uzun başını gerer."
  ],
  "met": 4.0
 },
 {
  "id": "wrist-curl",
  "region": "kol",
  "name": "Bilek Curl",
  "type": "weight",
  "img": [
   "img/wrist-curl-0.jpg",
   "img/wrist-curl-1.jpg"
  ],
  "primary": [
   "Ön kol"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Ön kollarını sehpaya koy, bilekler kenardan taşsın, avuçlar yukarı.",
   "Barı yalnızca bileklerini bükerek kaldır.",
   "Yavaşça indir."
  ],
  "tips": [
   "Ön kol ve kavrama gücü için."
  ],
  "met": 4.0
 },
 {
  "id": "close-pushup",
  "region": "kol",
  "name": "Dar Şınav (Triceps)",
  "type": "bodyweight",
  "img": [
   "img/close-pushup-0.jpg",
   "img/close-pushup-1.jpg"
  ],
  "primary": [
   "Triceps"
  ],
  "secondary": [
   "Göğüs",
   "Omuz"
  ],
  "level": "intermediate",
  "steps": [
   "Elleri göğsünün altında yakın koy.",
   "Dirsekleri gövdeye yakın tutarak in.",
   "Yeri iterek yukarı çık."
  ],
  "tips": [
   "Triceps'i hedefler."
  ],
  "met": 6.0
 },
 {
  "id": "crunch",
  "region": "karin",
  "name": "Crunch",
  "type": "bodyweight",
  "img": [
   "img/crunch-0.jpg",
   "img/crunch-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, dizler bükülü, ayaklar yerde.",
   "Karnını sıkarak omuzlarını ve üst sırtını yerden kaldır.",
   "Tepede kısa dur, yavaşça geri in."
  ],
  "tips": [
   "Boynundan çekme."
  ],
  "met": 3.8
 },
 {
  "id": "sit-up",
  "region": "karin",
  "name": "Sit-up",
  "type": "bodyweight",
  "img": [
   "img/sit-up-0.jpg",
   "img/sit-up-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, dizler bükülü, kollar göğsünde çapraz.",
   "Gövdeni tamamen yukarı, dizlerine doğru kaldır.",
   "Kontrollü şekilde geri uzan."
  ],
  "tips": [
   "Ayakların kalkıyorsa bir yere sabitle."
  ],
  "met": 3.8
 },
 {
  "id": "plank",
  "region": "karin",
  "name": "Plank",
  "type": "time",
  "img": [
   "img/plank-0.jpg",
   "img/plank-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Dirsekler omuzların altında, ön kollar yerde.",
   "Vücudu başından topuğa düz bir çizgi halinde tut.",
   "Karnını ve kalçanı sık, nefes almaya devam et."
  ],
  "tips": [
   "Kalça düşmesin, çok da kalkmasın."
  ],
  "met": 3.8
 },
 {
  "id": "side-plank",
  "region": "karin",
  "name": "Yan Plank",
  "type": "time",
  "img": [
   "img/side-plank-0.jpg",
   "img/side-plank-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Yan yat, dirseğin omzunun altında, ayaklar üst üste.",
   "Kalçanı kaldırarak vücudunu düz bir çizgi yap.",
   "Süre boyunca tut; sonra diğer tarafa geç."
  ],
  "tips": [
   "Kalçanın öne veya arkaya kaçmasına izin verme."
  ],
  "met": 3.8
 },
 {
  "id": "leg-raise",
  "region": "karin",
  "name": "Bacak Kaldırma",
  "type": "bodyweight",
  "img": [
   "img/leg-raise-0.jpg",
   "img/leg-raise-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, eller yanlarda ya da kalçanın altında.",
   "Bacakları düz tutarak dikey olana kadar kaldır.",
   "Belini yerden ayırmadan bacakları yavaşça indir."
  ],
  "tips": [
   "Bel boşluğu açılıyorsa dizleri hafif bük."
  ],
  "met": 3.8
 },
 {
  "id": "hanging-leg-raise",
  "region": "karin",
  "name": "Asılı Bacak Kaldırma",
  "type": "bodyweight",
  "img": [
   "img/hanging-leg-raise-0.jpg",
   "img/hanging-leg-raise-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "expert",
  "steps": [
   "Barfiks barına tam sarkık şekilde asıl.",
   "Sallanmadan bacaklarını düz şekilde kalça hizasına (veya üstüne) kaldır.",
   "Kontrollü şekilde indir."
  ],
  "tips": [
   "Zor gelirse dizleri bükerek yap."
  ],
  "met": 3.8
 },
 {
  "id": "russian-twist",
  "region": "karin",
  "name": "Russian Twist",
  "type": "weight",
  "img": [
   "img/russian-twist-0.jpg",
   "img/russian-twist-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [
   "Bel"
  ],
  "level": "intermediate",
  "steps": [
   "Yere otur, dizler bükülü, gövdeyi ~45° geriye yasla; ağırlığı göğüs önünde tut.",
   "Ayakları yerden kaldırabilirsen hareket zorlaşır.",
   "Gövdeni sağa-sola döndürerek ağırlığı iki yana götür."
  ],
  "tips": [
   "Kollarla değil gövdeyle döndür."
  ],
  "met": 3.8
 },
 {
  "id": "bicycle-crunch",
  "region": "karin",
  "name": "Bicycle Crunch",
  "type": "bodyweight",
  "img": [
   "img/bicycle-crunch-0.jpg",
   "img/bicycle-crunch-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, eller başın arkasında, omuzlar yerden hafif kalkık.",
   "Sağ dirseği sol dizine yaklaştırırken sağ bacağı uzat.",
   "Taraf değiştirerek pedal çevirir gibi devam et."
  ],
  "tips": [
   "Hızdan çok dönüşe odaklan."
  ],
  "met": 3.8
 },
 {
  "id": "mountain-climber",
  "region": "karin",
  "name": "Mountain Climber",
  "type": "time",
  "img": [
   "img/mountain-climber-0.jpg",
   "img/mountain-climber-1.jpg"
  ],
  "primary": [
   "Ön bacak"
  ],
  "secondary": [
   "Göğüs",
   "Arka bacak",
   "Omuz"
  ],
  "level": "beginner",
  "steps": [
   "Şınav başlangıç pozisyonuna geç.",
   "Bir dizini göğsüne çek, sonra hızla bacak değiştir.",
   "Kalçayı sabit tutarak koşar gibi devam et."
  ],
  "tips": [
   "Omuzlar ellerin üstünde kalsın."
  ],
  "met": 8.0
 },
 {
  "id": "cable-crunch",
  "region": "karin",
  "name": "Cable Crunch",
  "type": "weight",
  "img": [
   "img/cable-crunch-0.jpg",
   "img/cable-crunch-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Makaranın önünde diz çök, ipi başının iki yanında tut.",
   "Kalçayı sabit tutarak gövdeyi karın kaslarınla aşağı kıvır.",
   "Dirsekler uyluklara yaklaşınca yavaşça geri kalk."
  ],
  "tips": [
   "Kalçadan eğilme; hareket omurgadan."
  ],
  "met": 3.8
 },
 {
  "id": "reverse-crunch",
  "region": "karin",
  "name": "Ters Crunch",
  "type": "bodyweight",
  "img": [
   "img/reverse-crunch-0.jpg",
   "img/reverse-crunch-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, dizler bükülü ve havada.",
   "Kalçanı yerden kaldırarak dizlerini göğsüne çek.",
   "Yavaşça geri indir."
  ],
  "tips": [
   "Hareketi sallanmadan yap."
  ],
  "met": 3.8
 },
 {
  "id": "oblique-crunch",
  "region": "karin",
  "name": "Oblik Crunch",
  "type": "bodyweight",
  "img": [
   "img/oblique-crunch-0.jpg",
   "img/oblique-crunch-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, dizler bükülü ve bir yana yatık.",
   "Omuzlarını yandaki kalçana doğru kaldır.",
   "Yavaşça in, taraf değiştir."
  ],
  "tips": [
   "Yan karın kaslarını hedefler."
  ],
  "met": 3.8
 },
 {
  "id": "ab-roller",
  "region": "karin",
  "name": "Ab Roller",
  "type": "bodyweight",
  "img": [
   "img/ab-roller-0.jpg",
   "img/ab-roller-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [
   "Omuz"
  ],
  "level": "intermediate",
  "steps": [
   "Diz çök, tekerleği omuzlarının altında tut.",
   "Karnını sıkarak tekerleği öne yuvarla.",
   "Karın gücüyle geri çek."
  ],
  "tips": [
   "Belin çökmesine izin verme."
  ],
  "met": 3.8
 },
 {
  "id": "decline-crunch",
  "region": "karin",
  "name": "Decline Crunch",
  "type": "bodyweight",
  "img": [
   "img/decline-crunch-0.jpg",
   "img/decline-crunch-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "intermediate",
  "steps": [
   "Decline sehpaya ayaklarını sabitleyerek uzan.",
   "Omuzlarını kaldırarak karnını sık.",
   "Yavaşça geri in."
  ],
  "tips": [
   "Eğim arttıkça zorlaşır."
  ],
  "met": 3.8
 },
 {
  "id": "side-bend",
  "region": "karin",
  "name": "Dumbbell Yan Eğilme",
  "type": "weight",
  "img": [
   "img/side-bend-0.jpg",
   "img/side-bend-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Bir elinde dambıl, dik dur.",
   "Gövdeni dambıl tarafına doğru yana eğ.",
   "Karşı yan kaslarla dik konuma dön."
  ],
  "tips": [
   "Öne-arkaya eğilme."
  ],
  "met": 3.8
 },
 {
  "id": "knee-raise",
  "region": "karin",
  "name": "Paralel Barda Diz Çekme",
  "type": "bodyweight",
  "img": [
   "img/knee-raise-0.jpg",
   "img/knee-raise-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Paralel barlarda kollarınla gövdeni taşı.",
   "Dizlerini göğsüne doğru çek.",
   "Yavaşça indir."
  ],
  "tips": [
   "Sallanma."
  ],
  "met": 3.8
 },
 {
  "id": "dead-bug",
  "region": "karin",
  "name": "Dead Bug",
  "type": "bodyweight",
  "img": [
   "img/dead-bug-0.jpg",
   "img/dead-bug-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "beginner",
  "steps": [
   "Sırtüstü uzan, kollar yukarıda, dizler 90° havada.",
   "Bir kolu ve karşı bacağı yere doğru uzat.",
   "Başlangıca dön, taraf değiştir."
  ],
  "tips": [
   "Belin yerden kalkmasın."
  ],
  "met": 3.8
 },
 {
  "id": "ab-machine",
  "region": "karin",
  "name": "Makine Crunch",
  "type": "weight",
  "img": [
   "img/ab-machine-0.jpg",
   "img/ab-machine-1.jpg"
  ],
  "primary": [
   "Karın"
  ],
  "secondary": [],
  "level": "intermediate",
  "steps": [
   "Makineye otur, tutamakları ya da pedleri kavra.",
   "Gövdeni karın kaslarınla öne kıvır.",
   "Yavaşça geri gel."
  ],
  "tips": [
   "Kollarla çekme."
  ],
  "met": 3.8
 }
];

export const ALIAS = {"superman": "hyperextension"};
export const VIDEO_MB = 62;
export const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
for (const [a, b] of Object.entries(ALIAS)) EX_BY_ID[a] = EX_BY_ID[b];
export const REGION_BY_ID = Object.fromEntries(REGIONS.map(r => [r.id, r]));
