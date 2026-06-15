# LexLingo — GitHub'dan Kurulum Paketi

Bu klasör GitHub deposuna doğrudan yüklenecek şekilde hazırlanmıştır.

## İçerik

- `app/` — Android Gradle uygulama kaynakları
- `app/src/main/assets/index.html` — ses/TTS köprüsü uygulanmış ana uygulama
- `app/src/main/assets/data_packs/` — tüm kategori/veri paketleri
- `app/src/main/java/com/netadalet/dutchmb/MainActivity.java` — Android WebView + TTS köprüsü
- `.github/workflows/android-apk.yml` — GitHub Actions ile APK üretme
- `.github/workflows/release-apk.yml` — GitHub Release APK oluşturma
- `release-apk/LexLingo_SES_AKTIF_PATCH.apk` — hazır kurulabilir APK

## GitHub'a yükleme

1. GitHub'da yeni repo oluştur.
2. Bu ZIP'i aç.
3. ZIP içindeki dosyaların tamamını repo köküne yükle. Repo kökünde `app`, `.github`, `build.gradle`, `settings.gradle` görünmeli.
4. Commit yap.

## GitHub Actions ile APK üretme

1. Repo sayfasında **Actions** sekmesine gir.
2. **LexLingo Android APK Build** workflow'unu aç.
3. **Run workflow** de.
4. İş bitince **Artifacts** bölümünden `LexLingo-debug-APK` dosyasını indir.
5. ZIP içinden APK'yı çıkarıp telefona kur.

## GitHub Release üzerinden doğrudan indirilebilir APK oluşturma

1. Repo sayfasında **Actions** sekmesine gir.
2. **LexLingo APK Release** workflow'unu aç.
3. **Run workflow** de.
4. Tag alanına örnek olarak `v2.1-ses-aktif` yaz.
5. İş bitince repo sayfasındaki **Releases** bölümünde `LexLingo_SES_AKTIF.apk` yayınlanır.
6. Telefonda GitHub Release sayfasından APK'yı indirip kur.

## Manuel kurulum

Hazır APK dosyası: `release-apk/LexLingo_SES_AKTIF_PATCH.apk`

Telefonda eski uygulama ile imza uyuşmazlığı çıkarsa önce eski uygulamayı kaldır, sonra bu APK'yı kur.
