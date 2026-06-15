# LexLingo — SES AKTİF GitHub Paketi

Bu repo, LexLingo Android APK üretimi ve GitHub üzerinden kurulum için hazırlandı.

Korunanlar:

- Eski sürüm ekran boyutlandırma özelliği
- Tüm kategori/veri paketleri
- WebView arayüz akışı
- Çalışan Android TTS/ses köprüsü

## Hızlı kurulum

Hazır APK: `release-apk/LexLingo_SES_AKTIF_PATCH.apk`

Bu APK'yı GitHub Releases'e ekleyerek telefondan indirip kurabilirsin.

## GitHub Actions ile APK üretme

1. Dosyaları repo köküne yükle.
2. GitHub'da **Actions** sekmesine gir.
3. **LexLingo Android APK Build** çalıştır.
4. Artifact olarak gelen `LexLingo-debug-APK` dosyasını indir.
5. İçindeki APK'yı telefona kur.

## Release APK üretme

1. **Actions > LexLingo APK Release > Run workflow**.
2. Tag örneği: `v2.1-ses-aktif`.
3. İş bitince APK **Releases** bölümünde yayınlanır.

Ayrıntılar için: `GITHUB_KURULUM_TALIMATI.md`
