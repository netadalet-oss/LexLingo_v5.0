# Sync LexLingo WebView assets from a provided Android APK

**Scope:** Byte-for-byte copying of files under the APK's `assets/` folder into this repository's `app/src/main/assets/`. Android DEX, compiled binary AndroidManifest, Gradle configuration, Java/Kotlin sources and signing keys are **not** reconstructible as identical original sources from an APK.

The reference APK inspected on 2026-10-26 has **632 file assets** (HTML, JavaScript, data packs, audio, pictures, and PDFs). Several source files are absent from the GitHub `main` branch, and others differ.

## Usage

1. Clone this repository and put your original APK in a local path (for example `/path/to/base.apk`).
2. Run a preview:

   ```sh
   python3 tools/sync_assets_from_apk.py /path/to/base.apk --repo .
   ```

3. Apply the byte-exact assets to your working tree:

   ```sh
   python3 tools/sync_assets_from_apk.py /path/to/base.apk --repo . --apply
   ```

4. Only if you have reviewed stale files and want all old APK assets removed:

   ```sh
   python3 tools/sync_assets_from_apk.py /path/to/base.apk --repo . --apply --prune
   ```

5. Review `git status`, test Gradle build and APK behavior, then commit the assets and open a pull request.

**Security and licensing:** Before committing, review whether the bundled audio, PDFs, content data or credentials can legally/safely be published to a public repository.

**Current status:** This PR provides a tested sync mechanism, *not* the APK-derived large/binary asset payload. The source APK must be supplied when the script is run. Merging this helper alone does **not** complete the requested application-to-GitHub synchronization.
