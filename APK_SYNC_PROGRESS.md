# LexLingo — APK kaynak varlıklarını birebir eşitleme raporu

**Tarih:** 27 Ekim 2026

**Kaynak APK:** Kullanıcının sağladığı `base.apk`
**APK SHA-256:** `455c3671e3eb521e8dfdaf3b35fdd6178d7961163d5ecd16870fb5f504390767`
**Hedef dal:** `apk-asset-sync-helper-2026-10-26` — PR #1

## Doğrulanmış son durum

| Ölçüt | Dosya |
|---|---:|
| Referans APK `assets/` altındaki dosyalar | **632** |
| GitHub'da APK ile bayt-bazında eşleşenler | **632** |
| Eksik dosyalar | **0** |
| Farklı içerikli dosyalar | **0** |
| Önceden GitHub'da var olan, APK varlıklarına dahil olmayan ek dosyalar | **2** |

Orijinal APK ile karşılaştırma, tüm 632 dosyanın **Git blob SHA-1** değeri üzerinden bağımsız olarak tekrar yapıldı. Referans SHA listesi `asset_payload/APK_ASSET_GIT_SHA1.tsv` ve `APK_ASSETS_SHA1.tsv` dosyalarında bulunur. Bunlar APK'deki varlıkların her birinin birebir baytlarını temsil eder.

Son üç dosya aşağıdaki SHA-256'larla doğrulanarak GitHub Actions üzerinde birleştirildi:

| APK varlığı | SHA-256 |
|---|---|
| `data_packs/lex_pack_013.js` | `b51316ca49f9f1fb7bf2b2161548491c103f68f0dae0b940baaebec3dc9a8321` |
| `docs/dutch_stories.pdf` | `3837caff64a6b9eff198c8857064f87fc186338e920fbde9966bd32a30692a1e` |
| `audio/quran/erkan-mutlu-tesbihat-90.mp3` | `accf5b1705b856742efcdeb3ba16edf6f27f37f20e87c021f3d388e7d801e8c3` |

**Başarılı otomatik aktarım:** https://github.com/netadalet-oss/LexLingo_v5.0/actions/runs/40568084707

**Son üç dosyayı içeren commit:** `5fc450bee35657fefa905807c800f20fd87ece7d`

GitHub'da korunmuş iki repo-özel dosya:
- `app/src/main/assets/Flm_En_Tr_Lng.xlsx`
- `app/src/main/assets/LexLingo_500_satir_sablon.csv`

## Açık kontrol noktaları

- APK'deki **WebView HTML, JavaScript, medya ve PDF** gibi `assets/` dosyaları birebir eşleşir.
- APK, Android'in derlenmiş `classes.dex` içeriklerini taşır; orijinal Java/Kotlin kaynak kodunu ve Gradle yapılandırmasını bayt-bazında birebir yeniden oluşturduğu **iddia edilmez**.
- Android'in GitHub kaynaklarından yeniden derlenmesi ayrı bir testtir; sonucu GitHub Actions üzerinden doğrulanmalıdır.
- Üçüncü taraf PDF/ses/görsellerin kamuya açık repoda yayımlama hakları ayrıca kontrol edilmelidir.
- PR #1 derleme ve gözden geçirme tamamlanıncaya kadar **taslak** durumunda tutulur; `main` dalına otomatik olarak birleştirilmez.

