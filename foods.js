// Yiyecek veritabanı: yaygın Türk yemekleri, temel besinler ve tarif malzemeleri. Değerler 100 g (içeceklerde 100 ml) içindir.
// Kaynak alanı: "u:<id>" USDA FoodData Central kaydı (kamu malı), "r" USDA malzemeleriyle standart tariften hesaplandı, "m" tipik değer.
// Değerleri tools/build_foods.py üretir; elle değiştirme, tarifleri orada güncelle.
// Satır: [id, ad, kcal, protein, karbonhidrat, yağ, ölçüler "ad:gram|ad:gram", kategori, takma adlar, kaynak]
const RAW = `
egg|Haşlanmış yumurta|155|12.6|1.1|10.6|adet:50|kahvalti|yumurta|u:173424
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
white-bread|Beyaz ekmek|266|8.9|49.4|3.3|dilim:30|ekmek|ekmek|u:174924
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
kofte|Köfte (ızgara)|254|19.9|7.4|15.4|adet:30|porsiyon:180|et|köfte,izmir köfte|r
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
  const liquid = cat === 'icecek' || ['milk', 'milk-low', 'lf-milk', 'ayran', 'kefir'].includes(id);
  return { id, n, kcal: +kcal, p: +p, c: +c, f: +f, units: [...units, [liquid ? 'ml' : 'g', 1]], cat, aka: aka.split(',').filter(Boolean), liquid, src };
});
export const FOOD_BY_ID = Object.fromEntries(FOOD_DB.map(f => [f.id, f]));
