// Yiyecek veritabanı: yaygın Türk yemekleri ve temel besinler.
// Değerler 100 g (içeceklerde 100 ml) içindir; yaygın besin kaynaklarındaki tipik ortalamalardan derlenmiş yaklaşık değerlerdir.
// Satır: [id, ad, kcal, protein, karbonhidrat, yağ, ölçüler "ad:gram|ad:gram", kategori, takma adlar]
const RAW = `
egg|Haşlanmış yumurta|155|13|1.1|11|adet:50|kahvalti|yumurta
fried-egg|Sahanda yumurta / omlet|196|13.6|0.8|15|porsiyon (2 yumurta):110|kahvalti|omlet,sahanda
menemen|Menemen|110|6|5|7.5|porsiyon:200|kahvalti|
sucuklu-yumurta|Sucuklu yumurta|270|15|1.5|23|porsiyon:150|kahvalti|
white-cheese|Beyaz peynir|260|17|2|20|dilim:30|kahvalti|peynir,feta
kasar|Kaşar peyniri|360|25|1.5|28|dilim:20|kahvalti|peynir
lor|Lor peyniri|100|13|3|4|yemek kaşığı:20|kahvalti|
labne|Labne|230|6|4|21|yemek kaşığı:20|kahvalti|krem peynir
black-olive|Siyah zeytin|230|1.6|6|22|adet:4|kahvalti|zeytin
green-olive|Yeşil zeytin|145|1|4|15|adet:4|kahvalti|zeytin
honey|Bal|304|0.3|82|0|tatlı kaşığı:7|yemek kaşığı:21|kahvalti|
jam|Reçel|260|0.4|65|0.1|tatlı kaşığı:10|kahvalti|marmelat
butter|Tereyağı|717|0.9|0.1|81|tatlı kaşığı:5|kahvalti|
tahini|Tahin|595|17|21|54|yemek kaşığı:15|kahvalti|
molasses|Pekmez|290|0|72|0|yemek kaşığı:20|kahvalti|
tahin-pekmez|Tahin pekmez|450|8|48|27|yemek kaşığı:17|kahvalti|
pb|Fıstık ezmesi|588|25|20|50|yemek kaşığı:16|kahvalti|peanut butter
sucuk|Sucuk|450|20|2|40|dilim:10|kahvalti|
simit|Simit|290|9.5|52|5|adet:110|ekmek|
pogaca|Poğaça|360|8|45|16|adet:70|ekmek|
acma|Açma|380|7|46|18|adet:80|ekmek|
su-boregi|Su böreği|260|10|22|15|dilim:150|ekmek|börek
gozleme|Peynirli gözleme|240|9|30|9|adet:200|ekmek|
oats|Yulaf ezmesi|379|13.2|67.7|6.5|yemek kaşığı:10|su bardağı:80|kahvalti|yulaf
granola|Granola|470|10|64|20|kase:50|kahvalti|müsli
cereal|Mısır gevreği|380|7|84|1|kase:30|kahvalti|cornflakes
pancake|Pankek|227|6|28|10|adet:60|kahvalti|krep
white-bread|Beyaz ekmek|265|9|49|3.2|dilim:30|ekmek|ekmek
ww-bread|Tam buğday ekmeği|250|12.5|43|3.5|dilim:30|ekmek|ekmek,kepekli
rye-bread|Çavdar ekmeği|259|8.5|48|3.3|dilim:30|ekmek|ekmek
lavash|Lavaş|275|9|55|1.2|adet:60|ekmek|dürüm
pide-bread|Ramazan pidesi|270|9|52|2.5|dilim:50|ekmek|pide
bazlama|Bazlama|260|8|50|3|adet:120|ekmek|
yufka|Yufka|300|9|62|1.5|yaprak:60|ekmek|
lentil-soup|Mercimek çorbası|60|3.3|8.5|1.6|kase:250|kepçe:150|corba|mercimek
ezogelin|Ezogelin çorbası|65|3|9.5|1.8|kase:250|kepçe:150|corba|
chicken-soup|Tavuk suyu çorba|45|3|5|1.5|kase:250|kepçe:150|corba|tavuk çorbası
yayla|Yayla çorbası|55|2.5|6|2.3|kase:250|kepçe:150|corba|yoğurt çorbası
tomato-soup|Domates çorbası|50|1.5|7|1.8|kase:250|kepçe:150|corba|
iskembe|İşkembe çorbası|70|7|3|3.5|kase:250|corba|
veg-soup|Sebze çorbası|40|1.5|6|1.2|kase:250|kepçe:150|corba|
tarhana|Tarhana çorbası|55|2.3|8|1.5|kase:250|kepçe:150|corba|
chicken-breast|Tavuk göğsü (ızgara)|165|31|0|3.6|porsiyon:150|adet:170|et|tavuk,göğüs
chicken-leg|Tavuk but (fırın)|210|26|0|11|adet:120|et|tavuk,baget
chicken-saute|Tavuk sote|140|16|5|6|porsiyon:250|et|tavuk
chicken-doner|Tavuk döner|210|20|4|12.5|porsiyon:150|dürüm:280|et|döner
meat-doner|Et döner|250|18|3|19|porsiyon:150|dürüm:280|et|döner
kofte|Köfte (ızgara)|250|17|6|18|adet:30|porsiyon:180|et|köfte,izmir köfte
mince|Kıyma (pişmiş, az yağlı)|217|26|0|12|porsiyon:100|et|
steak|Biftek / bonfile (ızgara)|220|29|0|11|porsiyon:150|et|et,dana
lamb-chop|Kuzu pirzola|290|25|0|21|adet:60|et|kuzu
tas-kebab|Tas kebabı|150|13|6|8|porsiyon:250|et|et yemeği
karniyarik|Karnıyarık|130|5.5|7|9|adet:250|et|patlıcan
musakka|Musakka|120|6|7|8|porsiyon:250|et|patlıcan
adana|Adana kebap|280|17|2|23|şiş:100|porsiyon:200|et|kebap
chicken-shish|Tavuk şiş|170|25|2|7|şiş:100|porsiyon:200|et|tavuk
iskender|İskender|200|11|12|12|porsiyon:350|et|
hunkar|Hünkar beğendi|170|10|8|11|porsiyon:300|et|
manti|Mantı (yoğurtlu)|190|8|24|7|porsiyon:250|et|
lahmacun|Lahmacun|230|10|30|8|adet:120|et|
pide-mince|Kıymalı pide|260|12|32|9.5|porsiyon:300|et|pide
pide-cheese|Kaşarlı pide|280|12|33|11|porsiyon:300|et|pide
tantuni|Tantuni|210|13|22|8|dürüm:250|et|
icli-kofte|İçli köfte|260|9|30|12|adet:70|et|
cig-kofte|Çiğ köfte (etsiz)|170|5|33|2|adet:30|dürüm:200|et|
grilled-fish|Balık ızgara (levrek, çipura)|150|22|0|6.5|porsiyon:200|balik|balık,levrek,çipura
salmon|Somon (fırın)|206|22|0|12|porsiyon:150|balik|balık
tuna|Ton balığı (suda, süzülmüş)|116|26|0|1|kutu:120|balik|balık,konserve
hamsi|Hamsi tava|230|18|7|14|porsiyon:200|balik|balık
bean-meat|Etli kuru fasulye|130|8|15|4.5|porsiyon:250|baklagil|fasulye
bean|Kuru fasulye (etsiz)|120|6.5|17|3.2|porsiyon:250|baklagil|fasulye
chickpea|Nohut yemeği|140|7|19|4|porsiyon:250|baklagil|nohut
chickpea-meat|Etli nohut|150|9|16|5.5|porsiyon:250|baklagil|nohut
green-lentil|Yeşil mercimek yemeği|115|7.5|17|2.5|porsiyon:250|baklagil|mercimek
boiled-chickpea|Haşlanmış nohut|164|8.9|27|2.6|yemek kaşığı:15|kase:150|baklagil|nohut
hummus|Humus|166|8|14|10|yemek kaşığı:25|baklagil|
sarma|Zeytinyağlı yaprak sarma|150|2.5|20|7|adet:25|sebze|dolma
stuffed-pepper|Etli biber dolması|120|6|12|5|adet:120|sebze|dolma
green-beans|Zeytinyağlı taze fasulye|70|1.8|7|4|porsiyon:200|sebze|fasulye
artichoke|Zeytinyağlı enginar|80|2.5|8|4.5|adet:150|sebze|
spinach|Ispanak yemeği|70|3|5|4.5|porsiyon:200|sebze|
turlu|Türlü|75|2|8|4|porsiyon:250|sebze|
imam|İmam bayıldı|110|1.5|8|8.5|adet:200|sebze|patlıcan
mucver|Kabak mücver|170|6|13|10|adet:50|sebze|kabak
potato-dish|Patates yemeği|95|2|13|4|porsiyon:250|sebze|patates
peas|Bezelye yemeği|85|4|10|3|porsiyon:250|sebze|
boiled-veg|Haşlanmış brokoli / karnabahar|30|2.5|5|0.4|porsiyon:150|sebze|brokoli,karnabahar
shepherd|Çoban salata|40|1|5|2|kase:200|sebze|salata
salad|Mevsim salata (yağsız)|20|1|4|0.2|kase:150|sebze|salata,yeşillik
cacik|Cacık|40|2.5|3.5|1.8|kase:200|sebze|
rice|Pirinç pilavı|150|2.7|28|3|porsiyon:150|yemek kaşığı:25|pilav|pilav
bulgur|Bulgur pilavı|120|3.1|19|3.5|porsiyon:150|yemek kaşığı:25|pilav|bulgur
pasta|Makarna (sade, pişmiş)|158|5.8|31|0.9|porsiyon:200|pilav|makarna
pasta-sauce|Domates soslu makarna|130|4.5|23|2.5|porsiyon:250|pilav|makarna
ww-pasta|Tam buğday makarna (pişmiş)|124|5.3|26.5|0.5|porsiyon:200|pilav|makarna
eriste|Erişte|160|5|30|2|porsiyon:200|pilav|
couscous|Kuskus|112|3.8|23|0.2|porsiyon:150|pilav|
baked-potato|Fırın patates|93|2.5|21|0.1|adet:200|pilav|patates
boiled-potato|Haşlanmış patates|87|1.9|20|0.1|adet:150|pilav|patates
corn|Haşlanmış mısır|96|3.4|21|1.5|koçan:150|pilav|mısır
fries|Patates kızartması|312|3.4|41|15|porsiyon:150|fastfood|patates
hamburger|Hamburger|250|13|25|11|adet:220|fastfood|burger
pizza|Pizza|266|11|33|10|dilim:110|fastfood|
toast|Kaşarlı tost|290|12|30|13|adet:130|fastfood|tost
kumpir|Kumpir|170|5|20|8|adet:450|fastfood|
apple|Elma|52|0.3|14|0.2|adet:180|meyve|
banana|Muz|89|1.1|23|0.3|adet:120|meyve|
orange|Portakal|47|0.9|12|0.1|adet:150|meyve|
tangerine|Mandalina|53|0.8|13|0.3|adet:80|meyve|
strawberry|Çilek|32|0.7|7.7|0.3|kase:150|meyve|
grape|Üzüm|69|0.7|18|0.2|kase:150|meyve|
watermelon|Karpuz|30|0.6|7.6|0.2|dilim:300|meyve|
melon|Kavun|34|0.8|8|0.2|dilim:200|meyve|
pear|Armut|57|0.4|15|0.1|adet:170|meyve|
peach|Şeftali|39|0.9|10|0.3|adet:150|meyve|
apricot|Kayısı|48|1.4|11|0.4|adet:35|meyve|
cherry|Kiraz|63|1|16|0.2|kase:150|meyve|
fig|İncir|74|0.8|19|0.3|adet:50|meyve|
pomegranate|Nar|83|1.7|19|1.2|kase (tane):150|meyve|
kiwi|Kivi|61|1.1|15|0.5|adet:75|meyve|
dried-apricot|Kuru kayısı|241|3.4|63|0.5|adet:8|meyve|
raisin|Kuru üzüm|299|3|79|0.5|yemek kaşığı:12|meyve|
date|Hurma|282|2.5|75|0.4|adet:8|meyve|
avocado|Avokado|160|2|9|15|yarım:75|meyve|
tomato|Domates|18|0.9|3.9|0.2|adet:120|sebze|
cucumber|Salatalık|15|0.7|3.6|0.1|adet:150|sebze|
pepper|Yeşil biber|20|0.9|4.6|0.2|adet:30|sebze|biber
carrot|Havuç|41|0.9|10|0.2|adet:70|sebze|
milk|Süt (tam yağlı)|61|3.2|4.8|3.3|su bardağı:200|sut|süt
milk-low|Süt (yarım yağlı)|46|3.3|4.8|1.6|su bardağı:200|sut|süt
lf-milk|Laktozsuz süt|48|3.4|4.6|1.6|su bardağı:200|sut|süt
yogurt|Yoğurt|61|3.5|4.7|3.3|kase:200|yemek kaşığı:20|sut|
yogurt-light|Yoğurt (light)|40|3.8|4.5|0.5|kase:200|sut|yoğurt
greek|Süzme yoğurt|97|9|4|5|kase:150|yemek kaşığı:25|sut|yoğurt
greek-light|Süzme yoğurt (light)|60|10|3.6|0.5|kase:150|sut|yoğurt
ayran|Ayran|35|1.8|2.7|2|bardak:200|sut|
kefir|Kefir|55|3.4|4.5|2.5|bardak:200|sut|
ice-cream|Dondurma|207|3.5|24|11|top:50|tatli|
sutlac|Sütlaç|130|3.5|22|3|kase:200|tatli|
tea|Çay (şekersiz)|1|0|0.3|0|bardak:100|icecek|çay
tea-sugar|Çay (1 şekerli)|13|0|3.3|0|bardak:100|icecek|çay
coffee|Türk kahvesi (şekersiz)|3|0.2|0.5|0|fincan:70|icecek|kahve
filter-coffee|Filtre kahve / americano|2|0.1|0.3|0|kupa:250|icecek|kahve
latte|Latte|55|3|5|2.5|büyük:350|orta:250|icecek|kahve
cola|Kola|42|0|10.6|0|kutu:330|icecek|gazlı
cola-zero|Kola (şekersiz)|0|0|0|0|kutu:330|icecek|gazlı,zero
juice|Portakal suyu|45|0.7|10.4|0.2|bardak:200|icecek|meyve suyu
salgam|Şalgam|13|0.4|2.5|0|bardak:200|icecek|
beer|Bira|43|0.5|3.6|0|şişe:500|kutu:330|icecek|
wine|Şarap|85|0.1|2.6|0|kadeh:150|icecek|
energy|Enerji içeceği|45|0|11|0|kutu:250|icecek|
baklava|Baklava|430|7|50|23|dilim:40|tatli|
kunefe|Künefe|330|7|40|16|porsiyon:150|tatli|
revani|Revani|300|5|50|9|dilim:80|tatli|
kazandibi|Kazandibi|140|4|22|4|porsiyon:150|tatli|
asure|Aşure|140|3.5|27|2.5|kase:200|tatli|
helva|Tahin helvası|520|12|55|30|dilim:40|tatli|helva
lokum|Lokum|360|0.5|90|0.2|adet:15|tatli|
milk-choc|Sütlü çikolata|535|7.6|59|30|kare:6|tablet:80|tatli|çikolata
dark-choc|Bitter çikolata|600|7.8|46|43|kare:6|tatli|çikolata
biscuit|Bisküvi|450|6.5|70|16|adet:8|tatli|
cake|Kek|380|6|50|17|dilim:60|tatli|
gullac|Güllaç|160|4|30|3|porsiyon:150|tatli|
walnut|Ceviz içi|654|15|14|65|avuç:30|yemis|ceviz
almond|Badem|579|21|22|50|avuç:30|adet:1.2|yemis|
hazelnut|Fındık|628|15|17|61|avuç:30|yemis|
peanut|Yer fıstığı|567|26|16|49|avuç:30|yemis|fıstık
pistachio|Antep fıstığı|560|20|28|45|avuç:30|yemis|fıstık
cashew|Kaju|553|18|30|44|avuç:30|yemis|
leblebi|Leblebi|360|22|58|5|avuç:30|yemis|
sunflower|Ay çekirdeği (iç)|584|21|20|51|avuç:30|yemis|çekirdek
popcorn|Patlamış mısır|387|13|78|4.5|kase:25|yemis|
chips|Cips|536|7|53|35|küçük paket:40|yemis|
protein-bar|Protein bar|360|30|35|10|adet:60|spor|
whey|Whey protein|400|80|8|6|ölçek:30|spor|protein tozu
casein|Kazein protein|360|75|8|2|ölçek:30|spor|protein tozu
olive-oil|Zeytinyağı|884|0|0|100|yemek kaşığı:13.5|tatlı kaşığı:5|yag|yağ
mayo|Mayonez|680|1|0.6|75|yemek kaşığı:15|yag|
ketchup|Ketçap|112|1.3|26|0.1|yemek kaşığı:17|yag|
sugar|Şeker|387|0|100|0|küp:3|tatlı kaşığı:5|yag|
`;
export const FOOD_CATS = { kahvalti: 'Kahvaltılık', ekmek: 'Ekmek ve hamur işi', corba: 'Çorba', et: 'Et, tavuk ve kebap', balik: 'Balık', baklagil: 'Baklagil', sebze: 'Sebze ve salata',
  pilav: 'Pilav, makarna, patates', fastfood: 'Hazır yemek', meyve: 'Meyve', sut: 'Süt ürünleri', icecek: 'İçecek', tatli: 'Tatlı', yemis: 'Kuruyemiş ve atıştırmalık', spor: 'Spor besinleri', yag: 'Yağ, sos ve şeker' };
export const FOOD_DB = RAW.trim().split('\n').map(line => {
  const parts = line.split('|');
  const [id, n, kcal, p, c, f] = parts;
  // Ölçüler kategori alanından önceki "ad:gram" alanlarıdır
  const units = [], rest = parts.slice(6);
  while (rest.length && rest[0].includes(':')) { const [u, g] = rest.shift().split(':'); units.push([u, +g]); }
  const [cat = '', aka = ''] = rest;
  const liquid = cat === 'icecek' || ['milk', 'milk-low', 'lf-milk', 'ayran', 'kefir'].includes(id);
  return { id, n, kcal: +kcal, p: +p, c: +c, f: +f, units: [...units, [liquid ? 'ml' : 'g', 1]], cat, aka: aka.split(',').filter(Boolean), liquid };
});
export const FOOD_BY_ID = Object.fromEntries(FOOD_DB.map(f => [f.id, f]));
