// Yiyecek veritabanı: yaygın Türk yemekleri, temel besinler ve tarif malzemeleri. Değerler 100 g (içeceklerde 100 ml) içindir.
// Kaynak alanı: "u:<id>" USDA FoodData Central kaydı (kamu malı), "r" USDA malzemeleriyle standart tariften hesaplandı, "m" tipik değer.
// Değerleri tools/build_foods.py üretir; elle değiştirme, tarifleri orada güncelle.
// Satır: [id, ad, kcal, protein, karbonhidrat, yağ, ölçüler "ad:gram|ad:gram", kategori, takma adlar, kaynak]
const RAW = `
egg|Haşlanmış yumurta|155|12.6|1.1|10.6|adet:50|kahvalti|yumurta,rafadan|u:173424
fried-egg|Sahanda yumurta / omlet|196|13.6|0.8|14.8|porsiyon (2 yumurta):110|kahvalti|omlet,sahanda|u:173423
menemen|Menemen|105|4.6|3.7|8.2|porsiyon:200|kahvalti||r
sucuklu-yumurta|Sucuklu yumurta|270|15|1.5|23|porsiyon:150|kahvalti||m
white-cheese|Beyaz peynir|265|14.2|3.9|21.5|dilim:30|kahvalti|peynir,feta|u:173420
kasar|Kaşar peyniri|351|25.6|2.1|26.6|dilim:20|kahvalti|peynir|u:170850
lor|Lor peyniri|100|13|3|4|yemek kaşığı:20|kahvalti||m
labne|Labne|230|6|4|21|yemek kaşığı:20|kahvalti|krem peynir|m
black-olive|Siyah zeytin|230|1.6|6|22|adet:4|kahvalti|zeytin|m
green-olive|Yeşil zeytin|145|1|4|15|adet:4|kahvalti|zeytin|m
honey|Bal|304|0.3|82.4|0|tatlı kaşığı:7|yemek kaşığı:21|kahvalti||u:169640
jam|Reçel|278|0.4|68.9|0.1|tatlı kaşığı:10|kahvalti|marmelat|u:169641
butter|Tereyağı|717|0.9|0.1|81.1|tatlı kaşığı:5|kahvalti||u:173410
tahini|Tahin|595|17|21.2|53.8|yemek kaşığı:15|kahvalti||u:170189
molasses|Pekmez|290|0|74.7|0.1|yemek kaşığı:20|kahvalti||u:168820
tahin-pekmez|Tahin pekmez|442|8.5|48|27|yemek kaşığı:17|kahvalti||r
pb|Fıstık ezmesi|598|22.2|22.3|51.4|yemek kaşığı:16|kahvalti|peanut butter|u:172470
sucuk|Sucuk|450|20|2|40|dilim:10|kahvalti||m
simit|Simit|324|8.6|59.6|5.6|adet:110|ekmek||r
pogaca|Poğaça|402|9.5|42|21.7|adet:70|ekmek||r
acma|Açma|380|7|46|18|adet:80|ekmek||m
su-boregi|Su böreği|296|9.1|25.3|17.4|dilim:150|ekmek|börek|r
gozleme|Peynirli gözleme|279|9.1|37.8|9.8|adet:200|ekmek||r
oats|Yulaf ezmesi|379|13.2|67.7|6.5|yemek kaşığı:10|su bardağı:80|kahvalti|yulaf|u:173904
granola|Granola|489|13.7|53.9|24.3|kase:50|kahvalti|müsli|u:171646
cereal|Mısır gevreği|380|7|84|1|kase:30|kahvalti|cornflakes|m
pancake|Pankek|227|6.4|28.3|9.7|adet:60|kahvalti|krep|u:175009
white-bread|Beyaz ekmek|266|8.9|49.4|3.3|dilim:30|ekmek|ekmek,tost ekmeği,somun|u:174924
ww-bread|Tam buğday ekmeği|252|12.4|42.7|3.5|dilim:30|ekmek|ekmek,kepekli|u:172688
rye-bread|Çavdar ekmeği|259|8.5|48.3|3.3|dilim:30|ekmek|ekmek|u:172684
lavash|Lavaş|275|9.1|55.7|1.2|adet:60|ekmek|dürüm|u:174915
pide-bread|Ramazan pidesi|266|7.7|50.8|3|dilim:50|ekmek|pide|r
bazlama|Bazlama|273|8|51.7|3.4|adet:120|ekmek||r
yufka|Yufka|260|7.4|54.5|0.7|yaprak:60|ekmek||r
lentil-soup|Mercimek çorbası|80.6|3.6|11.7|2.4|kase:250|kepçe:150|corba|mercimek|r
ezogelin|Ezogelin çorbası|66.8|3|10.7|1.6|kase:250|kepçe:150|corba||r
chicken-soup|Tavuk suyu çorba|44.1|3.7|4.1|1.4|kase:250|kepçe:150|corba|tavuk çorbası|r
yayla|Yayla çorbası|57.9|2|7.2|2.3|kase:250|kepçe:150|corba|yoğurt çorbası|r
tomato-soup|Domates çorbası|42|1.2|4.5|2.3|kase:250|kepçe:150|corba||r
iskembe|İşkembe çorbası|50.5|3.9|1.9|3|kase:250|corba||r
veg-soup|Sebze çorbası|34.3|0.8|4.6|1.6|kase:250|kepçe:150|corba||r
tarhana|Tarhana çorbası|38|0.8|4.7|1.8|kase:250|kepçe:150|corba||r
chicken-breast|Tavuk göğsü (ızgara)|165|31|0|3.6|porsiyon:150|adet:170|et|tavuk,göğüs|u:171477
chicken-leg|Tavuk but (fırın)|232|23.3|0|14.7|adet:120|et|tavuk,baget|u:173625
chicken-saute|Tavuk sote|115|13.8|3.1|5.2|porsiyon:250|et|tavuk|r
chicken-doner|Tavuk döner|214|25.1|0.6|11.8|porsiyon:150|dürüm:280|et|döner|r
meat-doner|Et döner|300|25.4|1.9|20.4|porsiyon:150|dürüm:280|et|döner|r
kofte|Köfte (ızgara)|254|19.9|7.4|15.4|adet:30|porsiyon:180|et|köfte,ızgara köfte|r
mince|Kıyma (pişmiş, az yağlı)|183|28.5|0|6.7|porsiyon:100|et||r
steak|Biftek / bonfile (ızgara)|200|29|0|8.4|porsiyon:150|et|et,dana|u:171811
lamb-chop|Kuzu pirzola|290|25|0|21|adet:60|et|kuzu|m
tas-kebab|Tas kebabı|106|11.2|5.2|4.4|porsiyon:250|et|et yemeği|r
karniyarik|Karnıyarık|135|5.1|5.1|10.8|adet:250|et|patlıcan|r
musakka|Musakka|126|5|4.8|9.9|porsiyon:250|et|patlıcan|r
adana|Adana kebap|335|19.7|0.6|27.6|şiş:100|porsiyon:200|et|kebap|r
chicken-shish|Tavuk şiş|199|26.3|1.2|9.2|şiş:100|porsiyon:200|et|tavuk|r
iskender|İskender|229|13.5|13.8|13|porsiyon:350|et||r
hunkar|Hünkar beğendi|126|8.8|7.2|7|porsiyon:300|et||r
manti|Mantı (yoğurtlu)|182|7.5|22.3|6.7|porsiyon:250|et||r
lahmacun|Lahmacun|233|9.8|33.4|6.5|adet:120|et||r
pide-mince|Kıymalı pide|226|9.2|31|6.9|porsiyon:300|et|pide|r
pide-cheese|Kaşarlı pide|286|12.6|32.7|11.3|porsiyon:300|et|pide|r
tantuni|Tantuni|182|11.9|19.3|6|dürüm:250|et||r
icli-kofte|İçli köfte|301|11|28.6|16.9|adet:70|et||r
cig-kofte|Çiğ köfte (etsiz)|196|4.7|30.8|7.2|adet:30|dürüm:200|et||r
grilled-fish|Balık ızgara (levrek, çipura)|124|23.6|0|2.6|porsiyon:200|balik|balık,levrek,çipura|u:173694
salmon|Somon (fırın)|206|22.1|0|12.4|porsiyon:150|balik|balık|u:175168
tuna|Ton balığı (suda, süzülmüş)|86|19.4|0|1|kutu:120|balik|balık,konserve|u:173709
hamsi|Hamsi tava|270|20.8|8.8|16.3|porsiyon:200|balik|balık|r
bean-meat|Etli kuru fasulye|111|8|14.7|2.5|porsiyon:250|baklagil|fasulye|r
bean|Kuru fasulye (etsiz)|114|6|16.2|3.2|porsiyon:250|baklagil|fasulye|r
chickpea|Nohut yemeği|120|5|16.1|4.4|porsiyon:250|baklagil|nohut|r
chickpea-meat|Etli nohut|118|7.4|14.4|3.7|porsiyon:250|baklagil|nohut|r
green-lentil|Yeşil mercimek yemeği|126|6.4|18.8|3.3|porsiyon:250|baklagil|mercimek|r
boiled-chickpea|Haşlanmış nohut|164|8.9|27.4|2.6|yemek kaşığı:15|kase:150|baklagil|nohut|u:173757
hummus|Humus|237|7.8|15|17.8|yemek kaşığı:25|baklagil||u:174289
sarma|Zeytinyağlı yaprak sarma|187|2.8|26.5|8.1|adet:25|sebze|dolma|r
stuffed-pepper|Etli biber dolması|114|5|11.1|5.6|adet:120|sebze|dolma|r
green-beans|Zeytinyağlı taze fasulye|86.8|1.3|6.3|6.8|porsiyon:200|sebze|fasulye|r
artichoke|Zeytinyağlı enginar|105|2.5|10.9|6.5|adet:150|sebze||r
spinach|Ispanak yemeği|92|2.9|8.8|5.7|porsiyon:200|sebze||r
turlu|Türlü|80|1.3|7.6|5.4|porsiyon:250|sebze||r
imam|İmam bayıldı|140|1.2|8|12.2|adet:200|sebze|patlıcan|r
mucver|Kabak mücver|209|6|12.6|15.3|adet:50|sebze|kabak|r
potato-dish|Patates yemeği|92.2|1.5|12.5|4.3|porsiyon:250|sebze|patates|r
peas|Bezelye yemeği|101|3.4|11.8|4.7|porsiyon:250|sebze||r
boiled-veg|Haşlanmış brokoli / karnabahar|35|2.4|7.2|0.4|porsiyon:150|sebze|brokoli,karnabahar|u:169967
shepherd|Çoban salata|57.5|0.8|4.3|4.5|kase:200|sebze|salata|r
salad|Mevsim salata (yağsız)|20|1|4|0.2|kase:150|sebze|salata,yeşillik|m
cacik|Cacık|51.7|2.2|3.9|3.3|kase:200|sebze||r
rice|Pirinç pilavı|163|2.5|27.8|4.4|porsiyon:150|yemek kaşığı:25|pilav|pilav|r
bulgur|Bulgur pilavı|137|3.9|24|3.7|porsiyon:150|yemek kaşığı:25|pilav|bulgur|r
pasta|Makarna (sade, pişmiş)|161|5.7|32.5|0.7|porsiyon:200|pilav|makarna|r
pasta-sauce|Domates soslu makarna|142|4.5|25.3|2.5|porsiyon:250|pilav|makarna|r
ww-pasta|Tam buğday makarna (pişmiş)|124|5.3|26.5|0.5|porsiyon:200|pilav|makarna|m
eriste|Erişte|181|5.5|27.4|5.5|porsiyon:200|pilav||r
couscous|Kuskus|112|3.8|23.1|0.2|porsiyon:150|pilav||r
baked-potato|Fırın patates|93|2.5|21.2|0.1|adet:200|pilav|patates|u:170093
boiled-potato|Haşlanmış patates|86|1.7|20|0.1|adet:150|pilav|patates|u:170440
corn|Haşlanmış mısır|96|3.4|21|1.5|koçan:150|pilav|mısır|u:169999
fries|Patates kızartması|312|3.4|41.4|14.7|porsiyon:150|fastfood|patates|u:170698
hamburger|Hamburger|250|13|25|11|adet:220|fastfood|burger|m
pizza|Pizza|268|10.4|29|12.3|dilim:110|fastfood||u:170317
toast|Kaşarlı tost|290|12|30|13|adet:130|fastfood|tost|m
kumpir|Kumpir|170|5|20|8|adet:450|fastfood||m
apple|Elma|52|0.3|13.8|0.2|adet:180|meyve||u:171688
banana|Muz|89|1.1|22.8|0.3|adet:120|meyve||u:173944
orange|Portakal|47|0.9|11.8|0.1|adet:150|meyve||u:169097
tangerine|Mandalina|53|0.8|13.3|0.3|adet:80|meyve||u:169105
strawberry|Çilek|32|0.7|7.7|0.3|kase:150|meyve||u:167762
grape|Üzüm|69|0.7|18.1|0.2|kase:150|meyve||u:174683
watermelon|Karpuz|30|0.6|7.6|0.2|dilim:300|meyve||u:167765
melon|Kavun|34|0.8|8.2|0.2|dilim:200|meyve||u:169092
pear|Armut|63|0.4|15|0.2|adet:170|meyve||u:167776
peach|Şeftali|39|0.9|9.5|0.3|adet:150|meyve||u:169928
apricot|Kayısı|48|1.4|11.1|0.4|adet:35|meyve||u:171697
cherry|Kiraz|63|1.1|16|0.2|kase:150|meyve||u:171719
fig|İncir|74|0.8|19.2|0.3|adet:50|meyve||u:173021
pomegranate|Nar|83|1.7|18.7|1.2|kase (tane):150|meyve||u:169134
kiwi|Kivi|61|1.1|14.7|0.5|adet:75|meyve||u:168153
dried-apricot|Kuru kayısı|241|3.4|62.6|0.5|adet:8|meyve||u:173941
raisin|Kuru üzüm|299|3.3|79.3|0.3|yemek kaşığı:12|meyve||u:168165
date|Hurma|282|2.5|75|0.4|adet:8|meyve||u:171726
avocado|Avokado|160|2|8.5|14.7|yarım:75|meyve||u:171705
tomato|Domates|18|0.9|3.9|0.2|adet:120|sebze||u:170457
cucumber|Salatalık|15|0.7|3.6|0.1|adet:150|sebze||u:168409
pepper|Yeşil biber|20|0.9|4.6|0.2|adet:30|sebze|biber|u:170427
carrot|Havuç|41|0.9|9.6|0.2|adet:70|sebze||u:170393
milk|Süt (tam yağlı)|61|3.2|4.8|3.3|su bardağı:200|sut|süt|u:171265
milk-low|Süt (yarım yağlı)|50|3.3|4.8|2|su bardağı:200|sut|süt|u:171267
lf-milk|Laktozsuz süt|48|3.4|4.6|1.6|su bardağı:200|sut|süt|m
yogurt|Yoğurt|61|3.5|4.7|3.3|kase:200|yemek kaşığı:20|sut||u:171284
yogurt-light|Yoğurt (light)|40|3.8|4.5|0.5|kase:200|sut|yoğurt|m
greek|Süzme yoğurt|97|9|4|5|kase:150|yemek kaşığı:25|sut|yoğurt|u:171304
greek-light|Süzme yoğurt (light)|59|10.2|3.6|0.4|kase:150|sut|yoğurt|u:170894
ayran|Ayran|30.5|1.7|2.3|1.6|bardak:200|sut||r
kefir|Kefir|55|3.4|4.5|2.5|bardak:200|sut||m
ice-cream|Dondurma|207|3.5|24|11|top:50|tatli||m
sutlac|Sütlaç|145|3.4|26.3|3|kase:200|tatli||r
tea|Çay (şekersiz)|1|0|0.3|0|bardak:100|icecek|çay|u:173227
tea-sugar|Çay (1 şekerli)|13|0|3.3|0|bardak:100|icecek|çay|m
coffee|Türk kahvesi (şekersiz)|1|0.1|0|0|fincan:70|icecek|kahve|u:171890
filter-coffee|Filtre kahve / americano|1|0.1|0|0|kupa:250|icecek|kahve|u:171890
latte|Latte|55|3|5|2.5|büyük:350|orta:250|icecek|kahve|m
cola|Kola|42|0|10.6|0|kutu:330|icecek|gazlı|m
cola-zero|Kola (şekersiz)|0|0|0|0|kutu:330|icecek|gazlı,zero|m
juice|Portakal suyu|45|0.7|10.4|0.2|bardak:200|icecek|meyve suyu|u:169098
salgam|Şalgam|13|0.4|2.5|0|bardak:200|icecek||m
beer|Bira|43|0.5|3.6|0|şişe:500|kutu:330|icecek||u:168746
wine|Şarap|83|0.1|2.5|0|kadeh:150|icecek||u:171925
energy|Enerji içeceği|43|0.5|10.2|0|kutu:250|icecek||u:173210
baklava|Baklava|456|5.2|60.7|22.7|dilim:40|tatli||r
kunefe|Künefe|323|6.5|42.4|14.6|porsiyon:150|tatli||r
revani|Revani|264|4.3|59.2|1.5|dilim:80|tatli||r
kazandibi|Kazandibi|149|3.1|25.5|3.9|porsiyon:150|tatli||r
asure|Aşure|157|3.5|31.4|2.9|kase:200|tatli||r
helva|Tahin helvası|469|12.5|60.5|21.5|dilim:40|tatli|helva|u:167996
lokum|Lokum|360|0.5|90|0.2|adet:15|tatli||m
milk-choc|Sütlü çikolata|535|7.7|59.4|29.7|kare:6|tablet:80|tatli|çikolata|u:167587
dark-choc|Bitter çikolata|598|7.8|45.9|42.6|kare:6|tatli|çikolata|u:170273
biscuit|Bisküvi|467|6.1|68.9|18.8|adet:8|tatli||u:174950
cake|Kek|353|5|53.6|14|dilim:60|tatli||u:172704
gullac|Güllaç|160|4|30|3|porsiyon:150|tatli||m
walnut|Ceviz içi|654|15.2|13.7|65.2|avuç:30|yemis|ceviz|u:170187
almond|Badem|579|21.2|21.6|49.9|avuç:30|adet:1.2|yemis||u:170567
hazelnut|Fındık|628|15|16.7|60.8|avuç:30|yemis||u:170581
peanut|Yer fıstığı|567|25.8|16.1|49.2|avuç:30|yemis|fıstık|u:172430
pistachio|Antep fıstığı|560|20.2|27.2|45.3|avuç:30|yemis|fıstık|u:170184
cashew|Kaju|553|18.2|30.2|43.8|avuç:30|yemis||u:170162
leblebi|Leblebi|360|22|58|5|avuç:30|yemis||m
sunflower|Ay çekirdeği (iç)|584|20.8|20|51.5|avuç:30|yemis|çekirdek|u:170562
popcorn|Patlamış mısır|387|12.9|77.8|4.5|kase:25|yemis||u:167959
chips|Cips|532|6.4|53.8|34|küçük paket:40|yemis||u:169677
protein-bar|Protein bar|360|30|35|10|adet:60|spor||m
whey|Whey protein|400|80|8|6|ölçek:30|spor|protein tozu|m
casein|Kazein protein|360|75|8|2|ölçek:30|spor|protein tozu|m
olive-oil|Zeytinyağı|884|0|0|100|yemek kaşığı:13.5|tatlı kaşığı:5|yag|yağ|u:171413
mayo|Mayonez|680|1|0.6|74.8|yemek kaşığı:15|yag||u:171009
ketchup|Ketçap|101|1|27.4|0.1|yemek kaşığı:17|yag||u:168556
sugar|Şeker|387|0|100|0|küp:3|tatlı kaşığı:5|yag||u:169655
egg-white|Yumurta akı|52|10.9|0.7|0.2|adet:33|kahvalti|yumurta beyazı,egg white|u:172183
scrambled|Çırpılmış yumurta|149|10|1.6|11|porsiyon (2 yumurta):100|kahvalti|scrambled,yumurta|u:172187
cheese-omelet|Peynirli omlet|202|12.6|1.8|15.8|porsiyon:200|kahvalti|omlet,yumurta|r
veg-omelet|Sebzeli omlet|122|7.6|3.3|8.8|porsiyon:280|kahvalti|omlet,mantarlı omlet,yumurta|r
cilbir|Çılbır|134|7|3.4|10.2|porsiyon:260|kahvalti|yoğurtlu yumurta,poşe yumurta|r
pastirmali-yumurta|Pastırmalı yumurta|225|17|1|17|porsiyon:130|kahvalti|yumurta,pastirmali|m
muhlama|Muhlama (kuymak)|335|12.6|12.3|26.6|porsiyon:150|kahvalti|kuymak,mıhlama|r
cream-cheese|Krem peynir|350|6.2|5.5|34.4|yemek kaşığı:15|kahvalti|sürülebilir peynir,philadelphia,cream cheese|u:173418
cream-cheese-light|Krem peynir (light)|208|7.9|6.7|16.7|yemek kaşığı:15|kahvalti|krem peynir,light|u:169079
cottage|Cottage peyniri|98|11.1|3.4|4.3|yemek kaşığı:20|kase:100|kahvalti|cottage cheese,süzme peynir|u:172179
goat-cheese|Keçi peyniri|364|21.6|0.1|29.8|dilim:30|kahvalti|peynir,keci peyniri,goat cheese|u:173433
mozzarella|Mozzarella|299|22.2|2.4|22.1|dilim:30|kahvalti|tatlı peynir,peynir|u:170845
parmesan|Parmesan|420|28.4|13.9|27.8|yemek kaşığı (rende):5|dilim:20|kahvalti|peynir,parmesan cheese|u:171247
cheddar|Çedar peyniri|403|22.9|3.4|33.3|dilim:20|kahvalti|cheddar,cedar,peynir|u:173414
dil-peyniri|Dil peyniri|290|25|2|20|dilim:30|kahvalti|peynir|m
orgu-peyniri|Örgü peyniri|300|23|2|22|dilim:30|kahvalti|peynir,orgu|m
hellim|Hellim|320|22|2|25|dilim:30|kahvalti|halloumi,peynir|m
tulum|Tulum peyniri|375|24|2|30|yemek kaşığı:20|kahvalti|peynir,erzincan tulum|m
cokelek|Çökelek|98|15|3|3|yemek kaşığı:20|kahvalti|cokelek,peynir|m
ezine|Ezine peyniri|290|17|1.5|24|dilim:30|kahvalti|beyaz peynir,koyun peyniri,peynir|m
light-white-cheese|Beyaz peynir (light)|180|18|2|11|dilim:30|kahvalti|peynir,az yağlı beyaz peynir|m
light-kasar|Kaşar peyniri (light)|260|30|1|15|dilim:20|kahvalti|kaşar,peynir|m
eski-kasar|Eski kaşar|390|28|1|30|dilim:20|kahvalti|kaşar,peynir|m
kaymak|Kaymak|450|2.7|3|48|yemek kaşığı:15|kahvalti|manda kaymağı|m
bal-kaymak|Bal kaymak|392|1.7|34.8|28.8|porsiyon:50|kahvalti|kaymak,bal|m
sausage|Sosis|322|11.7|2.7|29.4|adet:40|kahvalti|hot dog sosis|u:174614
salami|Salam|261|12.6|1.9|22.2|dilim:10|kahvalti|dana salam|u:172935
turkey-ham|Hindi füme|106|14.8|2.2|3.8|dilim:10|kahvalti|hindi jambon,füme,jambon|u:172941
pastirma|Pastırma|250|32|1|13|dilim:8|kahvalti|pastirma|m
nut-spread|Fındık kreması (kakaolu)|539|5.4|62.4|29.7|tatlı kaşığı:7|yemek kaşığı:19|kahvalti|nutella,çikolata kreması,sürülebilir çikolata|u:168000
choco-cereal|Çikolatalı mısır gevreği|405|3.3|87.2|3.5|kase:30|kahvalti|kakaolu gevrek,mısır gevreği|u:172973
muesli|Müsli|360|9|64|6.5|kase:50|kahvalti|musli,yulaf|m
porridge-water|Yulaf lapası (suyla)|71|2.5|12|1.5|kase:250|kahvalti|yulaf lapası,porridge|u:173905
porridge-milk|Sütlü yulaf lapası|119|5|15.9|4|kase:230|kahvalti|yulaf lapası,porridge|r
overnight-oats|Overnight oats (yulaf kasesi)|127|4.4|19.6|3.9|kase:320|kahvalti|gece yulafı,yulaf|r
village-bread|Köy ekmeği|243|8.2|50.8|1.2|dilim:40|ekmek|ekmek|r
sourdough|Ekşi mayalı ekmek / baget|272|10.8|51.9|2.4|dilim:30|ekmek|baget,ekşi maya,ekmek,francala|u:172675
multigrain|Tam tahıllı ekmek|265|13.4|43.3|4.2|dilim:30|ekmek|çok tahıllı,ekmek|u:168013
oat-bread|Yulaflı ekmek|269|8.4|48.5|4.4|dilim:30|ekmek|ekmek,yulaf|u:172678
corn-bread|Mısır ekmeği|243|5|44.2|5.8|dilim:60|ekmek|ekmek,karadeniz|r
burger-bun|Hamburger ekmeği|279|9.8|50.1|3.9|adet:60|ekmek|burger ekmeği,sandviç ekmeği|u:172796
croissant|Kruvasan|406|8.2|45.8|21|adet:60|ekmek|croissant|u:174987
choco-croissant|Çikolatalı kruvasan|420|7|47|22|adet:70|ekmek|kruvasan,croissant|m
tortilla|Tortilla (dürüm lavaşı)|306|8.2|49.4|8|adet:70|ekmek|dürüm,wrap|u:175037
ww-lavash|Tam buğday lavaş|262|9.8|55.9|1.7|adet:60|ekmek|tam buğday pide,pita,lavaş|u:174916
olive-pogaca|Zeytinli poğaça|386|7.4|42|21.1|adet:70|ekmek|poğaça|r
potato-pogaca|Patatesli poğaça|348|7.1|41.9|16.9|adet:70|ekmek|poğaça|r
pisi|Pişi|351|6.7|46.5|15.1|adet:60|ekmek|hamur kızartması|r
tahinli-corek|Tahinli çörek|415|9.8|57.4|16.9|adet:80|ekmek|çörek,tahinli|r
galeta|Galeta|410|12|73|7|adet:10|ekmek|peksimet|m
grissini|Grissini (çubuk ekmek)|410|11|68|10|adet:5|ekmek|çubuk ekmek|m
sigara-boregi|Sigara böreği|398|8.9|22.1|30.6|adet:30|ekmek|börek,peynirli börek|r
kol-boregi|Patatesli kol böreği|243|4.6|28|12.6|dilim:120|ekmek|börek,kol böreği|r
kiymali-borek|Kıymalı börek|287|10.6|22.2|17|dilim:120|ekmek|börek|r
ispanakli-borek|Ispanaklı börek|245|7.6|22|14.3|dilim:120|ekmek|börek|r
patates-gozleme|Patatesli gözleme|216|5.1|38.6|4.4|adet:200|ekmek|gözleme|r
kiymali-gozleme|Kıymalı gözleme|259|10.1|36.4|7.6|adet:200|ekmek|gözleme|r
ispanakli-gozleme|Ispanaklı gözleme|212|7.3|32.7|5.8|adet:200|ekmek|gözleme|r
sehriye-soup|Şehriye çorbası|35.6|1|4.7|1.5|kase:250|kepçe:150|corba|şehriyeli çorba|r
dugun-soup|Düğün çorbası|52.5|4|2.4|2.9|kase:250|kepçe:150|corba||r
toyga|Toyga çorbası|65|2.7|8|2.6|kase:250|kepçe:150|corba|yoğurt çorbası|r
mushroom-soup|Kremalı mantar çorbası|68.2|2|4.1|5.1|kase:250|kepçe:150|corba|mantar çorbası|r
broccoli-soup|Brokoli çorbası|56.3|1.9|6|3.1|kase:250|kepçe:150|corba||r
cream-chicken-soup|Kremalı tavuk çorbası|77.8|4.7|3.8|4.8|kase:250|kepçe:150|corba|tavuk çorbası|r
corn-soup|Mısır çorbası|59.1|1.8|6.9|3|kase:250|kepçe:150|corba||r
pumpkin-soup|Bal kabağı çorbası|50|0.7|4.1|3.8|kase:250|kepçe:150|corba|kabak çorbası|r
fish-soup|Balık çorbası|44.8|4.5|3.4|1.4|kase:250|kepçe:150|corba||r
beyran|Beyran|59.8|4.1|5.1|2.4|kase:250|corba|beyran çorbası|r
green-lentil-soup|Yeşil mercimek çorbası|65.2|3.2|9.8|1.7|kase:250|kepçe:150|corba|mercimek|r
paca|Paça çorbası|72|6.5|2.5|4|kase:250|corba|kelle paça,kuzu paça|m
turkey-breast|Hindi göğüs (fırın)|147|30.1|0|2.1|porsiyon:150|et|hindi|u:171496
turkey-mince|Hindi kıyma (pişmiş)|203|27.4|0|10.4|porsiyon:100|et|hindi|u:171506
ribeye|Antrikot (ızgara)|207|28|0|10.6|porsiyon:200|et|dana antrikot,ribeye,biftek,et|u:171209
lamb-tandir|Kuzu tandır|258|25.6|0|16.5|porsiyon:200|et|kuzu but,tandır,kuzu|u:174312
lamb-shank|Kuzu incik|243|28.4|0|13.5|adet:250|et|kuzu|u:172482
chicken-wing|Tavuk kanat|254|23.8|0|16.9|adet:30|porsiyon:200|et|kanat,tavuk|u:173630
roast-chicken|Fırında bütün tavuk (derili)|239|27.3|0|13.6|porsiyon:200|et|fırın tavuk,piliç,tavuk|u:171450
chicken-thigh|Tavuk pirzola (ızgara)|179|24.8|0|8.2|porsiyon:180|adet:90|et|tavuk but,kemiksiz but,tavuk|u:172388
boiled-chicken|Haşlanmış tavuk göğsü|151|29|0|3|porsiyon:150|et|tavuk haşlama,tavuk|u:171478
fried-chicken|Çıtır tavuk (kızarmış)|260|24.8|9|13.2|porsiyon:200|et|kızarmış tavuk,crispy,tavuk|u:171475
beef-liver|Dana ciğer (tava)|175|26.5|5.2|4.7|porsiyon:150|et|ciğer|u:168627
chicken-liver|Tavuk ciğeri (tava)|172|25.8|1.1|6.4|porsiyon:150|et|ciğer,tavuk|u:174491
burger-patty|Hamburger köftesi (ızgara)|270|25.8|0|17.8|adet:110|et|burger köftesi,köfte|u:171797
orman-kebab|Orman kebabı|103|10|7.3|3.7|porsiyon:300|et|et yemeği|r
kuru-kofte|Kuru köfte (kızartma)|307|18.4|10.5|20.7|adet:25|porsiyon:150|et|köfte|r
izmir-kofte|İzmir köfte|146|8.5|9.8|8|porsiyon:300|et|köfte,fırın köfte|r
sulu-kofte|Sulu köfte|71.3|4|6|3.4|porsiyon:300|et|köfte,ekşili köfte|r
kadinbudu|Kadınbudu köfte|292|14.2|12.5|20.2|adet:60|et|köfte|r
inegol|İnegöl köfte|277|21|4.5|18.8|adet:25|porsiyon:180|et|köfte|r
oven-chicken|Fırında patatesli tavuk|192|12.7|8|12|porsiyon:350|et|fırın tavuk,tavuk|r
chicken-schnitzel|Tavuk şinitzel|292|22|11.4|17|adet:150|et|şnitzel,schnitzel,tavuk|r
kavurma|Dana kavurma|269|34.1|0|13.9|porsiyon:150|et|et kavurma,kavurma|r
guvec|Etli güveç|95.2|8.9|4|5|porsiyon:300|et|güveç,et yemeği|r
lamb-shish|Kuzu şiş|221|26.3|0.4|11.9|şiş:100|porsiyon:200|et|şiş kebap,kebap,kuzu|r
cop-sis|Çöp şiş|257|26.7|0|15.9|şiş:40|porsiyon:200|et|kebap,kuzu|r
beef-shish|Et şiş (dana)|225|29.8|0.4|10.9|şiş:100|porsiyon:200|et|şiş kebap,kebap|r
beyti|Beyti sarma|275|12.9|12.1|19.1|porsiyon:350|et|kebap,beyti|r
urfa|Urfa kebap|336|19.7|1.1|27.5|şiş:100|porsiyon:200|et|kebap|r
alinazik|Ali nazik|99.9|7.3|6.1|5.4|porsiyon:300|et|alinazik,kebap|r
eggplant-kebab|Patlıcan kebabı|139|9.7|4.5|9.2|porsiyon:300|et|kebap,patlıcan|r
mince-potato|Kıymalı patates|122|5.2|11.9|6.1|porsiyon:250|et|patates yemeği|r
arnavut|Arnavut ciğeri|296|22.8|12.6|16.7|porsiyon:150|et|ciğer|r
keskek|Keşkek|119|7.8|14.8|3.6|kase:250|et|herise|r
et-sote|Et sote|152|15.3|3.2|8.5|porsiyon:250|et|dana sote,et yemeği|r
karisik-pide|Karışık pide|265|12.4|29.8|10.4|porsiyon:300|et|pide|r
kusbasi-pide|Kuşbaşılı pide|221|11.8|31.1|5|porsiyon:300|et|pide|r
sardine|Sardalya|208|24.6|0|11.4|porsiyon:150|balik|balık,sardalya konserve|u:175139
mackerel|Uskumru (ızgara)|262|23.8|0|17.8|porsiyon:200|balik|balık|u:175120
shrimp|Karides (haşlanmış)|99|24|0.2|0.3|porsiyon:150|adet:8|balik|deniz ürünü|u:175180
calamari|Kalamar tava|175|17.9|7.8|7.5|porsiyon:150|balik|kalamar,deniz ürünü|u:171982
trout|Alabalık (ızgara)|168|23.8|0|7.4|adet:200|balik|balık|u:173718
bluefish|Lüfer (ızgara)|159|25.7|0|5.4|porsiyon:200|balik|çinekop,sarıkanat,balık|u:174229
whiting|Mezgit (ızgara)|116|23.5|0|1.7|porsiyon:200|balik|balık|u:175161
tuna-oil|Ton balığı (yağlı, süzülmüş)|198|29.1|0|8.2|kutu:110|yemek kaşığı:15|balik|ton,konserve,balık|u:173708
palamut|Palamut (ızgara)|158|23.6|0|6.3|porsiyon:200|balik|torik,bonito,balık|u:173674
mullet|Kefal (ızgara)|150|24.8|0|4.9|porsiyon:200|balik|balık|u:175124
turbot|Kalkan (ızgara)|122|20.6|0|3.8|porsiyon:200|balik|balık|u:174245
smoked-salmon|Füme somon|117|18.3|0|4.3|dilim:15|porsiyon:50|balik|somon,balık|u:173687
mussels|Midye (haşlanmış)|172|23.8|7.4|4.5|adet:8|porsiyon:100|balik|deniz ürünü|u:174217
octopus|Ahtapot|164|29.8|4.4|2.1|porsiyon:150|balik|deniz ürünü|u:174249
cod|Morina balığı|105|22.8|0|0.9|porsiyon:200|balik|cod,balık|u:171956
fried-mussels|Midye tava|274|10.5|14.2|19.3|porsiyon:150|balik|midye|r
shrimp-guvec|Karides güveç|137|14.2|3.7|7.6|porsiyon:200|balik|karides|r
barbunya|Zeytinyağlı barbunya|138|5.3|16.9|5.8|porsiyon:200|baklagil|barbunya pilaki|r
fava|Fava|180|7.8|18.7|8.7|porsiyon:150|yemek kaşığı:30|baklagil|bakla ezmesi|r
mercimek-kofte|Mercimek köftesi|185|7|27.4|6.2|adet:30|porsiyon:150|baklagil|köfte|r
piyaz|Piyaz|139|6.7|16.4|5.6|porsiyon:200|baklagil|fasulye salatası|r
falafel|Falafel|333|13.3|31.8|17.8|adet:17|porsiyon:100|baklagil|nohut köftesi|u:172455
boiled-lentil|Haşlanmış yeşil mercimek|116|9|20.1|0.4|kase:150|yemek kaşığı:15|baklagil|mercimek|u:172421
boiled-white-bean|Haşlanmış kuru fasulye|139|9.7|25.1|0.4|kase:150|baklagil|fasulye|u:175203
boiled-cowpea|Haşlanmış kuru börülce|116|7.7|20.8|0.5|kase:150|baklagil|börülce|u:173759
canned-chickpea|Nohut (konserve, süzülmüş)|139|7.1|22.5|2.8|kase:150|yemek kaşığı:15|baklagil|nohut|u:173800
cabbage|Beyaz lahana (çiğ)|25|1.3|5.8|0.1|kase (doğranmış):90|sebze|lahana|u:169975
red-cabbage|Kırmızı lahana (çiğ)|31|1.4|7.4|0.2|kase (doğranmış):90|sebze|mor lahana,lahana|u:169977
mushroom|Mantar (çiğ)|22|3.1|3.3|0.3|adet:18|su bardağı:70|sebze|kültür mantarı|u:169251
arugula|Roka|25|2.6|3.7|0.7|avuç:20|demet:60|sebze|yeşillik|u:169387
purslane|Semizotu (çiğ)|20|2|3.4|0.4|kase:100|sebze|yeşillik|u:169274
radish|Turp|16|0.7|3.4|0.1|adet:10|kase:100|sebze|kırmızı turp|u:169276
beet|Kırmızı pancar (haşlanmış)|44|1.7|10|0.2|adet:120|sebze|pancar|u:169146
canned-corn|Mısır (konserve)|67|2.3|14.3|1.2|yemek kaşığı:15|kutu:220|sebze|mısır tanesi,mısır|u:169214
lettuce|Marul|17|1.2|3.3|0.3|yaprak:15|kase:50|sebze|kıvırcık,göbek,yeşillik|u:169247
spring-onion|Taze soğan|32|1.8|7.3|0.2|adet:15|sebze|soğan|u:170005
onion|Soğan|40|1.1|9.3|0.1|adet:110|sebze|kuru soğan|u:170000
red-pepper|Kırmızı kapya biber|26|1|6|0.3|adet:150|sebze|kapya,biber|u:170108
pickle|Salatalık turşusu|12|0.5|2.4|0.3|adet:40|sebze|turşu,kornişon|u:168558
sauerkraut|Lahana turşusu|19|0.9|4.3|0.1|kase:100|sebze|turşu|u:169279
mixed-pickle|Karışık turşu|18|0.8|3.6|0.2|kase:100|sebze|turşu|m
spinach-raw|Ispanak (çiğ, salata)|23|2.9|3.6|0.4|avuç:30|kase:60|sebze|ıspanak,yeşillik|u:168462
parsley|Maydanoz|36|3|6.3|0.8|demet:50|yemek kaşığı (kıyılmış):4|sebze|yeşillik|u:170416
roasted-pepper|Közlenmiş kırmızı biber|76.1|1.4|8.7|4.8|adet:100|sebze|közbiber,kapya|r
leek-dish|Zeytinyağlı pırasa|117|1.4|14.6|6.4|porsiyon:200|sebze|pırasa|r
celery-dish|Zeytinyağlı kereviz|96.9|1.6|10.5|5.8|porsiyon:200|sebze|kereviz|r
cabbage-sarma|Etli lahana sarması|116|5.3|11.6|5.4|adet:40|porsiyon:250|sebze|lahana dolması,sarma|r
meat-sarma|Etli yaprak sarma|153|7.7|15.9|6.6|adet:30|porsiyon:250|sebze|etli dolma,yaprak dolması,sarma|r
okra|Zeytinyağlı bamya|77.4|1.4|6.4|5.7|porsiyon:200|sebze|bamya|r
olive-pepper-dolma|Zeytinyağlı biber dolması|149|2|18.7|7.7|adet:90|sebze|dolma,biber dolması|r
zucchini-dolma|Etli kabak dolması|90.6|4.6|9.3|3.9|adet:150|sebze|kabak dolma,dolma|r
borulce|Zeytinyağlı börülce|99|2.4|8|7.3|porsiyon:200|sebze|taze börülce|r
zucchini-dish|Kabak yemeği|79.4|1.5|6.7|5.6|porsiyon:200|sebze|kabak|r
cauliflower-dish|Karnabahar yemeği|64.1|1.7|5.1|4.7|porsiyon:200|sebze|karnabahar|r
cabbage-dish|Kıymalı lahana yemeği|86.5|3.8|8|4.7|porsiyon:250|sebze|lahana|r
eggplant-fry|Patlıcan kızartması|242|1.2|7.1|24.2|porsiyon:150|dilim:30|sebze|patlıcan,kızartma|r
cauliflower-fry|Karnabahar kızartması|194|4.2|9.8|16|porsiyon:150|sebze|karnabahar,kızartma|r
saksuka|Şakşuka|155|1.4|6.7|14.4|porsiyon:150|sebze|patlıcan|r
eggplant-salad|Közlenmiş patlıcan salatası|86.5|1.5|9.2|5.6|porsiyon:150|sebze|patlıcan salatası,salata|r
babagannus|Babagannuş|116|2.8|10.5|8.1|yemek kaşığı:25|porsiyon:100|sebze|baba ganuş,mütebbel,patlıcan|r
mushroom-saute|Mantar sote|104|4.2|5.8|8.3|porsiyon:150|sebze|mantar|r
kisir|Kısır|162|3.9|24|6.7|porsiyon:150|yemek kaşığı:25|sebze|bulgur salatası|r
gavurdagi|Gavurdağı salatası|131|2.2|8|11|kase:200|sebze|salata|r
potato-salad|Patates salatası|115|2|15.2|5.5|porsiyon:200|sebze|salata,patates|r
tuna-salad|Ton balıklı salata|67.6|5|3.7|4.1|kase:250|sebze|salata,ton|r
caesar|Sezar salata (tavuklu)|158|11.1|8.1|8.9|kase:300|sebze|caesar,tavuklu salata,salata|r
russian-salad|Rus salatası|143|2.3|10.9|10.3|yemek kaşığı:30|porsiyon:150|sebze|amerikan salatası,salata|r
haydari|Haydari|150|9.2|4.5|10.7|yemek kaşığı:25|porsiyon:100|sebze|meze|r
ezme|Acılı ezme|81.5|1.1|7.5|5.8|yemek kaşığı:20|porsiyon:100|sebze|ezme salata,meze|r
purslane-salad|Yoğurtlu semizotu salatası|57.9|2.7|4.2|3.7|kase:200|sebze|semizotu,salata|r
arugula-salad|Roka salatası|93.5|2.7|4.1|7.9|kase:150|sebze|roka,salata|r
carrot-tarator|Havuç tarator|84.5|2.3|7.7|5.3|yemek kaşığı:25|porsiyon:100|sebze|yoğurtlu havuç,meze|r
sehriyeli-pilav|Şehriyeli pirinç pilavı|180|3.1|30.1|4.9|porsiyon:150|yemek kaşığı:25|pilav|pilav|r
nohutlu-pilav|Nohutlu pilav|174|3.6|28.7|4.7|porsiyon:150|pilav|pilav|r
ic-pilav|İç pilav|194|3.1|32.5|5.7|porsiyon:150|pilav|pilav|r
perde-pilav|Perde pilavı|242|9.4|30.8|8.7|dilim:250|pilav|pilav|r
domatesli-pilav|Domatesli pilav|167|2.8|29.1|4.1|porsiyon:150|pilav|pilav|r
brown-rice|Esmer pirinç pilavı|151|2.6|26.5|3.7|porsiyon:150|pilav|pilav,esmer pirinç|r
chicken-rice|Tavuklu pilav|162|7.4|24.6|3.3|porsiyon:250|pilav|pilav,tavuk|r
plain-rice|Haşlanmış pirinç (yağsız)|130|2.7|28.2|0.3|porsiyon:150|pilav|sade pirinç,pirinç|u:168935
quinoa|Kinoa (haşlanmış)|120|4.4|21.3|1.9|porsiyon:150|pilav|quinoa|u:168917
buckwheat|Karabuğday (haşlanmış)|92|3.4|19.9|0.6|porsiyon:150|pilav|greçka|u:170686
boiled-bulgur|Haşlanmış bulgur (yağsız)|83|3.1|18.6|0.2|porsiyon:150|pilav|bulgur|u:170287
bolognese|Spagetti bolonez|161|7|22.4|4.6|porsiyon:300|pilav|kıymalı makarna,bolonez,makarna|r
baked-pasta|Fırın makarna|186|7.3|24|6.5|porsiyon:250|pilav|beşamelli makarna,makarna|r
tuna-pasta|Ton balıklı makarna|165|7.6|25.9|3.4|porsiyon:250|pilav|makarna,ton|r
mushroom-pasta|Kremalı mantarlı makarna|191|5.8|25.6|7.3|porsiyon:250|pilav|makarna,mantar|r
mashed|Patates püresi|113|1.9|16.8|4.2|porsiyon:200|pilav|püre,patates|u:168555
spiced-potato|Fırında baharatlı patates|162|2.7|23.3|6.8|porsiyon:200|pilav|patates,fırın patates|r
sweet-potato|Tatlı patates (fırın)|90|2|20.7|0.2|adet:150|pilav|batat|u:168483
cheeseburger|Cheeseburger|254|13.1|25|11.5|adet:200|fastfood|peynirli hamburger,burger|u:170692
chicken-burger|Tavuk burger|276|10.9|27.4|13.6|adet:180|fastfood|burger,tavuk|u:170318
hotdog|Sosisli sandviç|270|8|23.2|16|adet:150|fastfood|hot dog,sosisli|r
nuggets|Tavuk nugget|261|14.4|16.2|15.4|adet:18|porsiyon (6 adet):108|fastfood|nugget,tavuk|u:172112
onion-rings|Soğan halkası|411|3.9|43.6|25.2|porsiyon:100|fastfood|onion rings|u:170697
islak-burger|Islak hamburger|270|11|28|13|adet:110|fastfood|ıslak burger,hamburger|m
lasagna|Lazanya|185|10.8|11.4|10.7|porsiyon:250|fastfood|lasagna,makarna|u:169850
midye-dolma|Midye dolma|202|5.8|23.3|9.5|adet:18|fastfood|midye|r
balik-ekmek|Balık ekmek|220|12.5|20.4|9.5|adet:315|fastfood|balık|r
kokorec|Kokoreç (yarım ekmek)|260|12|20|15|porsiyon:250|fastfood|kokoreç|m
cigkofte-durum|Çiğ köfte dürüm|190|5.4|33.4|4.6|adet:230|fastfood|çiğ köfte,dürüm|r
chicken-durum|Tavuk dürüm|188|14.7|18.3|5.8|adet:255|fastfood|tavuk döner dürüm,dürüm,wrap|r
doner-durum|Et döner dürüm|236|15.3|19.4|10.2|adet:245|fastfood|döner,dürüm|r
doner-sandwich|Döner ekmek arası|227|13.5|21.6|9.2|porsiyon (yarım ekmek):290|fastfood|döner,ekmek arası|r
karisik-tost|Karışık tost|300|13|28|15|adet:150|fastfood|tost,sucuklu tost|m
ayvalik-tost|Ayvalık tostu|275|10.5|27.3|13.6|adet:300|fastfood|tost|r
margherita|Margarita pizza|263|11.9|28.8|11.1|dilim:100|fastfood|pizza,margherita|u:170373
mixed-pizza|Karışık pizza|331|14|29|17.6|dilim:110|fastfood|pizza,sucuklu pizza|u:170762
wedges|Elma dilim patates (fırın)|158|2.8|25.6|5.5|porsiyon:150|fastfood|patates,fırın patates kızartması|u:169264
kemalpasa|Kemalpaşa tatlısı|303|5.4|60.4|4.9|adet:30|tatli|şerbetli tatlı|r
sekerpare|Şekerpare|393|4.3|72|10.4|adet:40|tatli|şerbetli tatlı|r
tulumba|Tulumba tatlısı|383|3.8|62.6|13.7|adet:20|tatli|şerbetli tatlı|r
lokma|Lokma|368|3.1|68.7|9.6|adet:10|tatli|şerbetli tatlı|r
profiterol|Profiterol|221|5.3|23.6|12.3|porsiyon:150|tatli|çikolatalı tatlı|r
trilece|Trileçe|226|4.8|36.2|7.2|dilim:150|tatli|sütlü tatlı|r
kadayif|Tel kadayıf (cevizli)|443|4.1|60|22|dilim:80|tatli|kadayıf,şerbetli tatlı|r
cevizli-baklava|Cevizli baklava|470|4.5|58.7|25.7|dilim:40|tatli|baklava|r
irmik-helvasi|İrmik helvası|327|5.3|46|14.1|porsiyon:100|tatli|helva|r
un-helvasi|Un helvası|375|4.1|54.9|15.9|porsiyon:100|tatli|helva|r
pudding|Çikolatalı puding|142|3.5|24|4.3|kase:150|tatli|puding,sütlü tatlı|r
magnolia|Magnolia|177|3.4|22.9|8.2|kase:200|tatli|sütlü tatlı|r
cheesecake|Cheesecake|321|5.5|25.5|22.5|dilim:120|tatli|cheesecake,peynirli pasta|u:172711
keskul|Keşkül|162|4.7|22.3|6.5|kase:150|tatli|sütlü tatlı|r
tavuk-gogsu|Tavuk göğsü tatlısı|151|3.9|27.7|2.9|dilim:120|tatli|sütlü tatlı|r
supangle|Supangle|159|3.7|26.5|5.2|kase:150|tatli|sütlü tatlı,çikolatalı puding|r
muhallebi|Muhallebi|130|3|23.2|2.9|kase:150|tatli|sütlü tatlı|r
islak-kek|Islak kek|363|5.5|48.6|18|dilim:80|tatli|kek,brownie|r
kalburabasti|Kalburabastı|436|4.4|68.1|17.1|adet:40|tatli|şerbetli tatlı|r
ayva-tatlisi|Ayva tatlısı|178|0.7|42.9|1.6|porsiyon:200|tatli|ayva|r
kabak-tatlisi|Kabak tatlısı|184|1.9|39.1|3.5|porsiyon:150|tatli|bal kabağı|r
ekmek-kadayifi|Ekmek kadayıfı (kaymaklı)|330|4|52|12|porsiyon:120|tatli|kadayıf,şerbetli tatlı|m
un-kurabiyesi|Un kurabiyesi|514|5.9|59.3|28.3|adet:15|tatli|kurabiye|r
yas-pasta|Yaş pasta (meyveli)|226|4.2|25.4|12.4|dilim:120|tatli|pasta,doğum günü pastası|r
pismaniye|Pişmaniye|480|5|72|19|adet:10|tatli||m
cezerye|Cezerye|380|3|70|10|adet:25|tatli||m
pestil|Pestil (dut)|330|3|78|1|dilim:30|tatli|dut pestili|m
kome|Köme (cevizli sucuk)|410|6|63|16|dilim:30|tatli|cevizli sucuk,orcik|m
brownie|Brownie|405|4.8|63.9|16.3|dilim:60|tatli|kek|u:172713
tiramisu|Tiramisu|280|5|30|16|dilim:120|tatli||m
choco-cake|Çikolatalı pasta|389|3.5|52.8|20|dilim:100|tatli|pasta,doğum günü pastası|u:174934
apple-pie|Elmalı turta|265|2.4|37.1|12.5|dilim:120|tatli|elmalı tart,turta|u:175012
donut|Donut|421|6.1|47.9|22.7|adet:60|tatli|doughnut|u:172758
muffin|Muffin|375|4.5|53|16.1|adet:100|tatli|kek|u:172765
waffle|Waffle (sade)|291|7.9|32.9|14.1|adet:75|tatli|waffle|u:175039
waffle-topped|Waffle (çikolatalı, meyveli)|285|5|38|13|porsiyon:350|tatli|waffle|m
sponge-cake|Pandispanya|297|7.3|57.7|4.3|dilim:50|tatli|kek|u:172707
frozen-yogurt|Frozen yoğurt|127|3|21.6|3.6|kase:100|tatli|dondurma|u:168105
sufle|Sufle (çikolatalı)|370|6|40|21|adet:100|tatli|sufle|m
white-choc|Beyaz çikolata|539|5.9|59.2|32.1|kare:6|tablet:80|tatli|çikolata|u:167571
wafer|Çikolatalı gofret|518|6.5|64.6|26|adet:35|tatli|gofret,kitkat|u:167992
cream-wafer|Kremalı gofret|502|3.8|70.6|23.2|adet:35|tatli|gofret|u:172736
sandwich-cookie|Kremalı bisküvi|464|5.2|71|19.1|adet:11|tatli|oreo,kakaolu bisküvi,bisküvi|u:172718
graham|Tam buğdaylı bisküvi|430|6.7|77.7|10.6|adet:8|tatli|kepekli bisküvi,digestive,bisküvi|u:174957
gummy|Jelibon|396|0|98.9|0|avuç:30|tatli|şeker,yumuşak şeker|u:167989
hard-candy|Akide şekeri / sert şeker|394|0|98|0.2|adet:5|tatli|şeker,akide|u:167990
candy-bar|Fıstıklı karamelli çikolata bar|491|7.5|61.5|23.8|adet:50|tatli|snickers,çikolata bar,çikolata|u:169589
mixed-nuts|Karışık kuruyemiş|594|17.3|25.4|51.4|avuç:30|yemis|çerez,kuruyemiş|u:168599
pumpkin-seed|Kabak çekirdeği (iç)|574|29.8|14.7|49|avuç:30|yemis|çekirdek|u:169415
chia|Chia tohumu|486|16.5|42.1|30.7|yemek kaşığı:12|yemis|chia|u:170554
flax|Keten tohumu|534|18.3|28.9|42.2|yemek kaşığı:10|yemis|keten|u:169414
sesame|Susam|573|17.7|23.4|49.7|yemek kaşığı:9|yemis||u:170150
chestnut|Kestane (közlenmiş)|245|3.2|53|2.2|adet:8|avuç:60|yemis|kestane kebap|u:170190
banana-chips|Muz cipsi|519|2.3|58.4|33.6|avuç:30|yemis|muz|u:168849
coconut|Hindistan cevizi (rende)|660|6.9|23.6|64.5|yemek kaşığı:7|yemis|hindistan cevizi|u:170170
tortilla-chips|Mısır cipsi|472|7.1|67.8|20.7|küçük paket:40|yemis|doritos,nachos,cips|u:167558
microwave-popcorn|Patlamış mısır (mikrodalga, tereyağlı)|535|8.4|57.3|30.2|paket:90|kase:25|yemis|patlamış mısır,popcorn|u:173141
pretzel|Çubuk kraker|384|10|80.4|2.9|avuç:30|yemis|tuzlu çubuk,pretzel,kraker|u:167555
rice-cake|Pirinç patlağı|387|8.2|81.5|2.8|adet:9|yemis|pirinç keki,rice cake|u:170250
saltine|Tuzlu kraker|418|9.5|74|8.6|adet:5|küçük paket:40|yemis|kraker|u:172746
ww-cracker|Tam buğdaylı kraker|427|10.6|69.6|14.1|adet:5|küçük paket:40|yemis|kraker,kepekli kraker|u:172749
granola-bar|Granola bar|443|7.4|67.3|17.2|adet:30|yemis|yulaf bar,müsli bar|u:167954
pine-nut|Çam fıstığı|673|13.7|13.1|68.4|yemek kaşığı:9|yemis|fıstık|u:170591
plum|Erik|46|0.7|11.4|0.3|adet:30|avuç:100|meyve|can erik,mürdüm|u:169949
sour-cherry|Vişne|50|1|12.2|0.3|kase:150|meyve||u:173954
quince|Ayva|57|0.4|15.3|0.1|dilim:60|adet:250|meyve||u:168163
mango|Mango|60|0.8|15|0.4|adet:200|dilim:100|meyve||u:169910
pineapple|Ananas|50|0.5|13.1|0.1|dilim:80|kase:150|meyve||u:169124
blueberry|Yaban mersini|57|0.7|14.5|0.3|kase:150|avuç:50|meyve|blueberry,maviyemiş|u:171711
raspberry|Ahududu|52|1.2|11.9|0.7|kase:125|avuç:50|meyve|frambuaz,raspberry|u:167755
grapefruit|Greyfurt|32|0.6|8.1|0.1|yarım:120|adet:240|meyve||u:173033
blackberry|Böğürtlen|43|1.4|9.6|0.5|kase:150|avuç:50|meyve||u:173946
mulberry|Dut|43|1.4|9.8|0.4|kase:140|avuç:50|meyve|beyaz dut,karadut|u:169913
persimmon|Trabzon hurması|70|0.6|18.6|0.2|adet:170|meyve|cennet elması|u:169941
nectarine|Nektarin|44|1.1|10.6|0.3|adet:140|meyve|şeftali|u:169914
lemon|Limon|29|1.1|9.3|0.3|adet:60|dilim:10|meyve||u:167746
loquat|Yenidünya|47|0.4|12.1|0.2|adet:30|kase:150|meyve|malta eriği|u:169908
dried-fig|Kuru incir|249|3.3|63.9|0.9|adet:20|meyve|incir|u:174665
prune|Kuru erik|240|2.2|63.9|0.4|adet:10|meyve|erik|u:168162
dried-apple|Kuru elma|243|0.9|65.9|0.3|avuç:20|meyve|elma cipsi|u:171691
dried-mulberry|Kuru dut|330|10|72|1.8|avuç:30|yemek kaşığı:10|meyve|dut|m
dried-cranberry|Kuru kızılcık (şekerli)|308|0.2|82.8|1.1|yemek kaşığı:10|meyve|cranberry,turna yemişi|u:171723
skim-milk|Süt (yağsız)|34|3.4|5|0.1|su bardağı:200|sut|süt,light süt|u:171269
choc-milk|Çikolatalı süt|83|3.2|10.3|3.4|kutu:200|sut|kakaolu süt,süt|u:170879
banana-milk|Muzlu süt|80|3|11.5|2.5|kutu:200|sut|süt|m
goat-milk|Keçi sütü|69|3.6|4.5|4.1|su bardağı:200|sut|süt|u:171278
soy-milk|Soya sütü|54|3.3|6.3|1.8|su bardağı:200|sut|bitkisel süt|u:172446
almond-milk|Badem sütü (şekersiz)|15|0.4|1.3|1|su bardağı:200|sut|bitkisel süt|u:174832
oat-milk|Yulaf sütü|46|0.8|7|1.5|su bardağı:200|sut|bitkisel süt,yulaf|m
fruit-yogurt|Meyveli yoğurt|99|4|18.6|1.2|kase:150|sut|yoğurt|u:170889
lemon-soda|Gazoz|41|0.1|10.4|0|şişe:250|kutu:330|icecek|sprite,limonlu gazoz,gazlı|u:173205
mineral-water|Maden suyu / soda|0|0|0|0|şişe:200|icecek|soda,sade soda|u:174842
fruit-soda|Meyveli soda|25|0|6.2|0|şişe:200|icecek|soda,maden suyu|m
orange-soda|Portakallı gazoz|48|0|12.3|0|kutu:330|icecek|fanta,gazlı|u:174854
tonic|Tonik|34|0|8.8|0|kutu:250|icecek|gazlı|u:171869
apple-juice|Elma suyu|46|0.1|11.3|0.1|bardak:200|icecek|meyve suyu|u:167771
cherry-juice|Vişne suyu|59|0.3|13.7|0.5|bardak:200|icecek|vişne nektarı,meyve suyu|u:167807
peach-juice|Şeftali suyu|50|0.2|11.9|0.5|bardak:200|icecek|şeftali nektarı,meyve suyu|u:168185
pomegranate-juice|Nar suyu|54|0.2|13.1|0.3|bardak:200|icecek|meyve suyu|u:167787
mixed-juice|Karışık meyve suyu|48|0.3|11.5|0.1|bardak:200|icecek|meyve nektarı,meyve suyu|m
tomato-juice|Domates suyu|17|0.9|3.5|0.3|bardak:200|icecek||u:170458
carrot-juice|Havuç suyu|40|1|9.3|0.2|bardak:200|icecek||u:170491
grape-juice|Üzüm suyu|60|0.4|14.8|0.1|bardak:200|icecek|meyve suyu|u:173042
pineapple-juice|Ananas suyu|53|0.4|12.9|0.1|bardak:200|icecek|meyve suyu|u:168187
lemonade|Limonata|40|0.1|10.4|0|bardak:250|icecek||u:173217
ice-tea|Soğuk çay (ice tea)|28|0|7|0|kutu:330|icecek|ice tea,şeftalili çay|m
sports-drink|Sporcu içeceği|26|0|6.4|0|şişe:500|icecek|powerade,izotonik|u:173660
energy-zero|Enerji içeceği (şekersiz)|5|0.3|0.7|0.1|kutu:250|icecek|enerji içeceği,sugar free|u:171870
espresso|Espresso|9|0.1|1.7|0.2|fincan:30|icecek|kahve|u:171891
cappuccino|Cappuccino|40|2.1|3.2|2.1|orta:250|büyük:350|icecek|kahve,kapuçino|m
three-in-one|Hazır kahve (3'ü 1 arada)|45|0.6|7.5|1.5|fincan (1 paket):170|icecek|nescafe,neskafe,kahve|m
hot-choc|Sıcak çikolata|77|3.5|10.7|2.3|kupa:250|icecek|sıcak kakao|u:171277
salep|Salep|94.8|3|13.9|3.1|bardak:200|icecek||r
boza|Boza|105|1.2|23|0.3|bardak:200|icecek||m
sweet-coffee|Türk kahvesi (orta şekerli)|28|0.1|7|0|fincan:70|icecek|kahve,şekerli kahve|m
green-tea|Yeşil çay|1|0.2|0|0|bardak:200|icecek|çay|u:171917
herbal-tea|Bitki çayı (ıhlamur, adaçayı)|1|0|0.2|0|bardak:200|icecek|ıhlamur,adaçayı,papatya,çay|u:173232
raki|Rakı|263|0|0|0|tek:40|duble:80|icecek|alkol|u:171920
spirits|Votka / viski / cin|231|0|0|0|tek:40|icecek|alkol,votka,viski|u:174815
smoothie|Smoothie (muzlu çilekli)|68.3|2.1|12.1|1.7|bardak:300|icecek|smoothie|r
milkshake|Milkshake|112|3.9|17.8|3|bardak:300|icecek|milkshake|u:170884
coconut-water|Hindistan cevizi suyu|18|0.2|4.2|0|kutu:330|icecek||u:174831
whey-iso|Whey protein (izole)|370|88|3|1|ölçek:30|spor|protein tozu,izole|m
gainer|Gainer (kilo aldırıcı toz)|380|16|74|3|ölçek:100|spor|mass gainer,kilo alma tozu|m
protein-shake|Protein shake (sütlü)|92.2|11.2|5|3.1|shaker:280|spor|protein içeceği,whey|r
protein-pudding|Proteinli puding|80|10|7|1.5|adet:200|spor|puding|m
protein-yogurt|Proteinli yoğurt|62|10|4|0.5|adet:160|spor|yoğurt,pro yoğurt|m
energy-gel|Enerji jeli|260|0|65|0|adet:40|spor|jel|m
margarine|Margarin|713|0.2|0.8|80.2|tatlı kaşığı:5|yemek kaşığı:14|yag|yağ|u:171436
sunflower-oil|Ayçiçek yağı|884|0|0|100|yemek kaşığı:13.5|tatlı kaşığı:5|yag|sıvı yağ,yağ|u:171017
mustard|Hardal|60|3.7|5.8|3.3|tatlı kaşığı:5|yag|sos|u:172234
soy-sauce|Soya sosu|53|8.1|4.9|0.6|yemek kaşığı:16|yag|sos|u:174277
pesto|Pesto sos|418|9.8|10.1|37.6|yemek kaşığı:15|yag|sos|u:171579
dressing|Salata sosu (hazır)|240|0.4|12.1|21.1|yemek kaşığı:15|yag|sos|u:171019
caesar-dressing|Sezar sos|542|2.2|3.3|57.8|yemek kaşığı:15|yag|sos|u:169055
choc-syrup|Çikolata sosu|350|4.6|62.9|8.9|yemek kaşığı:20|yag|sos|u:168835
cream|Krema (sıvı)|340|2.8|2.8|36.1|yemek kaşığı:15|yag|krema,sıvı krema|u:170859
whipped-cream|Krem şanti (sprey)|257|3.2|12.5|22.2|yemek kaşığı:5|yag|şanti|u:170860
sour-cream|Ekşi krema|198|2.4|4.6|19.4|yemek kaşığı:15|yag|krema|u:171257
tomato-paste|Domates salçası|82|4.3|18.9|0.5|yemek kaşığı:16|yag|salça|u:170459
pepper-paste|Biber salçası|70|3|13|0.6|yemek kaşığı:16|yag|salça|m
pomegranate-molasses|Nar ekşisi|270|0.5|67|0|yemek kaşığı:15|yag|sos|m
bbq|Barbekü sos|170|1|40|0.6|yemek kaşığı:17|yag|sos|m
pasta-sauce-jar|Hazır makarna sosu (domatesli)|50|1.4|7.4|1.6|porsiyon:100|yag|sos,domates sosu|u:171192
ing-kirmizi_mercimek|Kırmızı mercimek (kuru)|358|23.9|63.1|2.2|su bardağı:190|malzeme||u:174284
ing-yesil_mercimek|Yeşil mercimek (kuru)|352|24.6|63.4|1.1|su bardağı:190|malzeme||u:172420
ing-bulgur|Bulgur (çiğ)|342|12.3|75.9|1.3|su bardağı:170|malzeme||u:170688
ing-pirinc|Pirinç (çiğ)|365|7.1|80|0.7|su bardağı:180|malzeme||u:168877
ing-pirinc_esmer|Esmer pirinç (çiğ)|367|7.5|76.2|3.2|su bardağı:185|malzeme||u:169703
ing-un|Buğday unu|364|10.3|76.3|1|su bardağı:120|yemek kaşığı:10|malzeme||u:168894
ing-tam_un|Tam buğday unu|340|13.2|72|2.5|su bardağı:120|malzeme||u:168893
ing-irmik|İrmik|360|12.7|72.8|1.1|su bardağı:170|malzeme||u:169715
ing-nisasta|Mısır nişastası|381|0.3|91.3|0.1|yemek kaşığı:10|malzeme||u:169698
ing-nohut_kuru|Nohut (kuru)|378|20.5|63|6|su bardağı:200|malzeme||u:173756
ing-fasulye_kuru|Kuru fasulye (kuru)|333|23.4|60.3|0.9|su bardağı:190|malzeme||u:175202
ing-makarna_kuru|Makarna (kuru)|371|13|74.7|1.5|paket:500|malzeme||u:169736
ing-eriste|Erişte / şehriye (kuru)|384|14.2|71.3|4.4|su bardağı:100|malzeme||u:169731
ing-kuskus|Kuskus (kuru)|376|12.8|77.4|0.6|su bardağı:175|malzeme||u:169699
ing-zeytinyagi|Zeytinyağı / sıvı yağ|884|0|0|100|yemek kaşığı:13.5|tatlı kaşığı:5|malzeme||u:171413
ing-tereyagi|Tereyağı|717|0.9|0.1|81.1|yemek kaşığı:14|malzeme||u:173410
ing-sogan|Soğan|40|1.1|9.3|0.1|adet:110|malzeme||u:170000
ing-domates|Domates|18|0.9|3.9|0.2|adet:120|malzeme||u:170457
ing-salca|Domates salçası|82|4.3|18.9|0.5|yemek kaşığı:16|malzeme||u:170459
ing-biber|Yeşil biber|20|0.9|4.6|0.2|adet:30|malzeme||u:170427
ing-aci_biber|Kırmızı acı biber|40|1.9|8.8|0.4|adet:30|malzeme||u:170106
ing-sarimsak|Sarımsak|149|6.4|33.1|0.5|diş:5|malzeme||u:169230
ing-havuc|Havuç|41|0.9|9.6|0.2|adet:70|malzeme||u:170393
ing-patates|Patates (çiğ)|77|2.1|17.5|0.1|adet:170|malzeme||u:170026
ing-patlican|Patlıcan|25|1|5.9|0.2|adet:300|malzeme||u:169228
ing-kabak|Kabak|17|1.2|3.1|0.3|adet:200|malzeme||u:169291
ing-ispanak|Ispanak|23|2.9|3.6|0.4|demet:500|malzeme||u:168462
ing-taze_fasulye|Taze fasulye|31|1.8|7|0.2|avuç:60|malzeme||u:169961
ing-bezelye|Bezelye|81|5.4|14.4|0.4|su bardağı:145|malzeme||u:170419
ing-enginar|Enginar|47|3.3|10.5|0.2|adet:130|malzeme||u:169205
ing-limon|Limon suyu|22|0.4|6.9|0.2|yemek kaşığı:15|malzeme||u:167747
ing-salatalik|Salatalık|15|0.7|3.6|0.1|adet:150|malzeme||u:168409
ing-marul|Marul|17|1.2|3.3|0.3|yaprak:15|malzeme||u:169247
ing-maydanoz|Maydanoz|36|3|6.3|0.8|demet:50|malzeme||u:170416
ing-nane|Kuru nane|285|19.9|52|6|tatlı kaşığı:1|malzeme||u:172239
ing-asma_yapragi|Asma yaprağı|93|5.6|17.3|2.1|yaprak:4|malzeme||u:168575
ing-kiyma_dana|Dana kıyma (orta yağlı, çiğ)|215|18.6|0|15|porsiyon:100|malzeme||u:171796
ing-kiyma_yagsiz|Dana kıyma (yağsız, çiğ)|137|21.4|0|5|porsiyon:100|malzeme||u:171790
ing-kuzu_kiyma|Kuzu kıyma (çiğ)|282|16.6|0|23.4|porsiyon:100|malzeme||u:174370
ing-dana_kusbasi|Dana kuşbaşı (çiğ)|132|22.1|0|4.2|porsiyon:100|malzeme||u:174051
ing-tavuk_gogus|Tavuk göğsü (çiğ)|120|22.5|0|2.6|adet:200|malzeme||u:171077
ing-tavuk_but|Tavuk but (çiğ, derisiz)|121|19.7|0|4.1|adet:100|malzeme||u:173627
ing-iskembe|İşkembe (çiğ)|85|12.1|0|3.7|porsiyon:100|malzeme||u:170599
ing-levrek|Levrek / çipura (çiğ)|97|18.4|0|2|adet:300|malzeme||u:175142
ing-hamsi|Hamsi (çiğ)|131|20.4|0|4.8|porsiyon:200|malzeme||u:174182
ing-somon|Somon (çiğ)|208|20.4|0|13.4|porsiyon:150|malzeme||u:175167
ing-yumurta|Yumurta (çiğ)|143|12.6|0.7|9.5|adet:50|malzeme||u:171287
ing-sut|Süt (tam yağlı)|61|3.2|4.8|3.3|su bardağı:200|malzeme||u:171265
ing-yogurt|Yoğurt|61|3.5|4.7|3.3|su bardağı:200|yemek kaşığı:20|malzeme||u:171284
ing-beyaz_peynir|Beyaz peynir|265|14.2|3.9|21.5|dilim:30|malzeme||u:173420
ing-kasar|Kaşar peyniri|351|25.6|2.1|26.6|dilim:20|malzeme||u:170850
ing-mozzarella|Tatlı peynir / mozzarella|299|22.2|2.4|22.1|dilim:30|malzeme||u:170845
ing-krema|Krema|340|2.8|2.8|36.1|yemek kaşığı:15|malzeme||u:170859
ing-seker|Şeker|387|0|100|0|yemek kaşığı:12|su bardağı:200|malzeme||u:169655
ing-bal|Bal|304|0.3|82.4|0|yemek kaşığı:21|malzeme||u:169640
ing-pekmez|Pekmez|290|0|74.7|0.1|yemek kaşığı:20|malzeme||u:168820
ing-tahin|Tahin|595|17|21.2|53.8|yemek kaşığı:15|malzeme||u:170189
ing-maya|Kuru maya|325|40.4|41.2|7.6|paket:10|malzeme||u:175043
ing-ceviz|Ceviz içi|654|15.2|13.7|65.2|avuç:30|malzeme||u:170187
ing-antep|Antep fıstığı (iç)|560|20.2|27.2|45.3|avuç:30|malzeme||u:170184
ing-findik|Fındık (iç)|628|15|16.7|60.8|avuç:30|malzeme||u:170581
ing-badem|Badem|579|21.2|21.6|49.9|avuç:30|malzeme||u:170567
ing-fistik|Yer fıstığı|567|25.8|16.1|49.2|avuç:30|malzeme||u:172430
ing-kuru_kayisi|Kuru kayısı|241|3.4|62.6|0.5|adet:8|malzeme||u:173941
ing-kuru_uzum|Kuru üzüm|299|3.3|79.3|0.3|yemek kaşığı:12|malzeme||u:168165
ing-bugday|Aşurelik buğday|339|13.7|71.1|2.5|su bardağı:180|malzeme||u:169721
ing-yufka|Yufka / baklava yufkası|299|7.1|52.6|6|yaprak:60|malzeme||u:172791
ing-ekmek|Beyaz ekmek|266|8.9|49.4|3.3|dilim:30|malzeme||u:174924
ing-pide_ekmegi|Pide / lavaş ekmeği|275|9.1|55.7|1.2|adet:60|malzeme||u:174915
ing-kakao|Kakao|228|19.6|57.9|13.7|yemek kaşığı:6|malzeme||u:169593
ing-yulaf|Yulaf ezmesi|379|13.2|67.7|6.5|su bardağı:80|yemek kaşığı:10|malzeme||u:173904
ing-misir_unu|Mısır unu|362|8.1|76.9|3.6|su bardağı:130|malzeme||u:169697
ing-pirinc_unu|Pirinç unu|366|6|80.1|1.4|yemek kaşığı:10|malzeme||u:169714
ing-barbunya_kuru|Barbunya (kuru)|335|23|60|1.2|su bardağı:190|malzeme||u:175189
ing-bakla_kuru|Kuru bakla (fava için)|341|26.1|58.3|1.5|su bardağı:170|malzeme||u:175205
ing-mantar|Mantar|22|3.1|3.3|0.3|su bardağı:70|adet:18|malzeme||u:169251
ing-brokoli|Brokoli|34|2.8|6.6|0.4|baş:300|su bardağı:90|malzeme||u:170379
ing-karnabahar|Karnabahar|25|1.9|5|0.3|baş:700|su bardağı:100|malzeme||u:169986
ing-pirasa|Pırasa|61|1.5|14.2|0.3|adet:200|malzeme||u:169246
ing-kereviz|Kereviz (kök)|42|1.5|9.2|0.3|adet:400|malzeme||u:170400
ing-lahana|Beyaz lahana|25|1.3|5.8|0.1|yaprak:40|su bardağı:90|malzeme||u:169975
ing-bamya|Bamya|33|1.9|7.5|0.2|su bardağı:100|avuç:60|malzeme||u:169260
ing-borulce|Taze börülce|44|3.3|9.5|0.3|avuç:60|malzeme||u:168405
ing-balkabagi|Bal kabağı|26|1|6.5|0.1|dilim:200|malzeme||u:168448
ing-kapya|Kırmızı kapya biber|26|1|6|0.3|adet:150|malzeme||u:170108
ing-misir_konserve|Mısır (konserve, süzülmüş)|67|2.3|14.3|1.2|yemek kaşığı:15|kutu:220|malzeme||u:169214
ing-taze_sogan|Taze soğan|32|1.8|7.3|0.2|adet:15|malzeme||u:170005
ing-dereotu|Dereotu|43|3.5|7|1.1|demet:40|malzeme||u:172233
ing-roka|Roka|25|2.6|3.7|0.7|demet:60|malzeme||u:169387
ing-semizotu|Semizotu|20|2|3.4|0.4|demet:250|malzeme||u:169274
ing-ayva|Ayva|57|0.4|15.3|0.1|adet:300|malzeme||u:168163
ing-muz|Muz|89|1.1|22.8|0.3|adet:120|malzeme||u:173944
ing-cilek|Çilek|32|0.7|7.7|0.3|su bardağı:150|malzeme||u:167762
ing-yesil_zeytin|Yeşil zeytin|145|1|3.8|15.3|adet:4|malzeme||u:169096
ing-tursu|Salatalık turşusu|12|0.5|2.4|0.3|adet:40|malzeme||u:168558
ing-kus_uzumu|Kuş üzümü|290|3.4|77|0.2|yemek kaşığı:10|malzeme||u:171724
ing-cam_fistigi|Çam fıstığı|673|13.7|13.1|68.4|yemek kaşığı:9|malzeme||u:170591
ing-chia|Chia tohumu|486|16.5|42.1|30.7|yemek kaşığı:12|malzeme||u:170554
ing-kuzu_kusbasi|Kuzu kuşbaşı (çiğ)|134|20.2|0|5.3|porsiyon:100|malzeme||u:172508
ing-tavuk_derili|Tavuk (derili, çiğ)|215|18.6|0|15.1|porsiyon:250|malzeme||u:171447
ing-dana_ciger|Dana ciğer (çiğ)|135|20.4|3.9|3.6|porsiyon:100|malzeme||u:169451
ing-midye|Midye (çiğ, ayıklanmış)|86|11.9|3.7|2.2|adet:10|malzeme||u:174216
ing-karides|Karides (çiğ, ayıklanmış)|85|20.1|0|0.5|adet:10|porsiyon:150|malzeme||u:175179
ing-uskumru|Uskumru (çiğ)|205|18.6|0|13.9|fileto:150|malzeme||u:175119
ing-ton_konserve|Ton balığı (suda, süzülmüş)|86|19.4|0|1|kutu:120|malzeme||u:173709
ing-sosis|Sosis|315|11.7|3|28.1|adet:40|malzeme||u:173862
ing-suzme_yogurt|Süzme yoğurt|97|9|4|5|yemek kaşığı:25|malzeme||u:171304
ing-krem_peynir|Krem peynir|350|6.2|5.5|34.4|yemek kaşığı:15|malzeme||u:173418
ing-parmesan|Parmesan peyniri|420|28.4|13.9|27.8|yemek kaşığı:5|malzeme||u:171247
ing-whey|Whey protein tozu|352|78.1|6.3|1.6|ölçek:30|malzeme||u:173180
ing-mayonez|Mayonez|680|1|0.6|74.8|yemek kaşığı:15|malzeme||u:171009
ing-ketcap|Ketçap|101|1|27.4|0.1|yemek kaşığı:17|malzeme||u:168556
ing-biskuvi|Bisküvi (sade)|467|6.1|68.9|18.8|adet:8|malzeme||u:174950
ing-kruton|Kıtır ekmek (kruton)|407|11.9|73.5|6.6|avuç:15|malzeme||u:172751
ing-ekmek_hamburger|Hamburger / sandviç ekmeği|279|9.8|50.1|3.9|adet:60|malzeme||u:172796
`;
export const FOOD_CATS = { kahvalti: 'Kahvaltılık', ekmek: 'Ekmek ve hamur işi', corba: 'Çorba', et: 'Et, tavuk ve kebap', balik: 'Balık', baklagil: 'Baklagil', sebze: 'Sebze ve salata',
  pilav: 'Pilav, makarna, patates', fastfood: 'Hazır yemek', meyve: 'Meyve', sut: 'Süt ürünleri', icecek: 'İçecek', tatli: 'Tatlı', yemis: 'Kuruyemiş ve atıştırmalık', spor: 'Spor besinleri', yag: 'Yağ, sos ve şeker', malzeme: 'Malzemeler (tarif için)' };
export const srcText = s => (s?.startsWith('u:') ? 'USDA FoodData Central' : s === 'r' ? 'Standart tariften hesaplandı (USDA malzemeleri)' : 'Tipik ortalama değer');
export const FOOD_DB = RAW.trim().split('\n').map(line => {
  const parts = line.split('|');
  const [id, n, kcal, p, c, f] = parts;
  // Ölçüler kategori alanından önceki "ad:gram" alanlarıdır
  const units = [], rest = parts.slice(6);
  while (rest.length && rest[0].includes(':')) { const [u, g] = rest.shift().split(':'); units.push([u, +g]); }
  const [cat = '', aka = '', src = 'm'] = rest;
  const liquid = cat === 'icecek' || ['milk', 'milk-low', 'lf-milk', 'ayran', 'kefir', 'skim-milk', 'choc-milk', 'banana-milk', 'goat-milk', 'soy-milk', 'almond-milk', 'oat-milk'].includes(id);
  return { id, n, kcal: +kcal, p: +p, c: +c, f: +f, units: [...units, [liquid ? 'ml' : 'g', 1]], cat, aka: aka.split(',').filter(Boolean), liquid, src };
});
export const FOOD_BY_ID = Object.fromEntries(FOOD_DB.map(f => [f.id, f]));
