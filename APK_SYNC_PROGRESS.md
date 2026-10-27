# LexLingo — APK bayt-bazlı eşitleme durum raporu (27 Ekim 2026)

Kaynak: Kullanıcının sağladığı `base.apk`, SHA-256 `455c3671e3eb521e8dfdaf3b35fdd6178d7961163d5ecd16870fb5f504390767`.

Bu rapor, `apk-asset-sync-helper-2026-10-26` dalının GitHub ağaç SHA'ları ile yerel APK içindeki **632** `assets/` dosyasının Git blob SHA-1 değerleri karşılaştırılarak oluşturuldu. Son doğrulanan commit: `7a00852003717dfd14e0a6bd992d970402a3e7a8`.

| Ölçüt | Dosya |
|---|---:|
| APK kaynak varlıkları | **632** |
| GitHub `app/src/main/assets/` dosyaları | **373** |
| Bayt-bazında birebir eşleşenler | **358** |
| GitHub dalında bulunmayanlar | **261** |
| İçeriği farklı olanlar | **13** |
| Yalnızca GitHub'da bulunan ek dosyalar | **2** |

## Bu aktarımdaki doğrulanan ilerleme

Başlangıçta 180 dosya eşleşiyordu. Altı ayrı commit ile APK'deki **178 trafik görseli** daha GitHub dalına alındı. GitHub blob SHA-1 değerleri referans APK'deki aynı dosyaların hesaplanan SHA-1 değerleriyle karşılaştırılarak doğrulandı:

- `3ea740c780668b14e1fa5e4decb68a3290ca7be7`: +34
- `eeb508bd3881d758a9c1680f884c40847ba7e0c4`: +33
- `e407c64e186b296bbd3d79142e26d2f7968ffcd8`: +33
- `709009f686608a07286ab3993d194242bc6c50c0`: +33
- `0898374bc3a9cd2748912f9f689dc291c0f1ba43`: +34
- `7a00852003717dfd14e0a6bd992d970402a3e7a8`: +11

9 trafik görseli güvenlik kontrolü nedeniyle aktarılamadı; bu dosyalar atlandı, içerikleri değiştirilmedi.

## Hâlâ aktarılması gerekenler

- 127 Hollandaca telaffuz sesi (`audio/dutch_pronunciation`)
- 78 kitap sayfası görseli (`knm_revision/book`)
- 13 `spot/v2` dosyası
- 11 Mushaf sesi; 10 dinleme sesi; 1 açılış WAV ve 1 Kur'an MP3
- 8 PDF, 2 trafik WebP, 1 gramer görseli ve 9 engellenen trafik görseli
- 13 farklı veri paketi: `lex_pack_003.js`, `005.js`, `006.js`, `007.js`, `012.js`, `013.js`, `014.js`, `021.js`, `022.js`, `024.js`, `026.js`, `027.js`, `028.js`

GitHub'a özgü iki dosya: `Flm_En_Tr_Lng.xlsx` ve `LexLingo_500_satir_sablon.csv`.

## Sürüm yayınlama koşulları

Bu PR **taslak** kalmalıdır. 632 dosyanın tamamı eşleşmeden, kullanıcı tarafından sağlanan içeriğin yayımlanabilirliği gözden geçirilmeden ve Android derleme/cihaz testleri başarıyla tamamlanmadan `main` üzerine birleştirilmemelidir. Derlenmiş APK, orijinal Android Java/Kotlin kaynaklarını birebir geri getirmez.
