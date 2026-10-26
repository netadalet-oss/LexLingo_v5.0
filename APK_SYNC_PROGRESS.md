# LexLingo APK byte-exact sync — current audited status

Reference: user-provided `base.apk` (SHA-256 `455c3671e3eb521e8dfdaf3b35fdd6178d7961163d5ecd16870fb5f504390767`).

Checked branch: `apk-asset-sync-helper-2026-10-26` against all 632 files under APK `assets/`. The comparison uses canonical Git blob SHA-1 (exact bytes).

| Metric | Files |
|---|---:|
| APK reference assets | 632 |
| GitHub branch assets (`app/src/main/assets/`) | 82 |
| Byte-identical to APK | **67** |
| Absent in GitHub branch | **552** |
| Present but different | **13** |
| Present only in GitHub branch | **2** |

All 52 APK JavaScript files are present in the branch, but 13 data packs still differ and must not be counted as synchronized.

Still different: `lex_pack_003.js`, `005.js`, `006.js`, `007.js`, `012.js`, `013.js`, `014.js`, `021.js`, `022.js`, `024.js`, `026.js`, `027.js`, and `028.js` (all under `data_packs/`).

Absent assets are primarily audio, PDF and image files. Repo-only files: `Flm_En_Tr_Lng.xlsx` and `LexLingo_500_satir_sablon.csv`.

## Work completed
- Added SHA-verified byte-identical copies of 65 files beyond the 2 initially matching GitHub main.
- Added `tools/sync_assets_from_apk.py`, a lossless local asset sync helper. It was tested locally and successfully reproduced all 632 APK assets bit for bit.
- Added GitHub Actions helper workflows for checksummed imports. Neither has completed a full import of the reference APK.

## Critical limitation
Uploading large binary payloads and several JavaScript data packs through the active GitHub connection failed due to transfer limits or connection safety checks. APK chunks created as unattached Git blobs are **not** part of the branch and do **not** represent a completed import. Do not merge this draft PR or claim the app is equivalent until all 632 assets match, and Android build/device verification succeeds.

The APK contains compiled Android DEX, not original Java/Kotlin source. Byte-for-byte WebView asset synchronization is distinct from recovering original Android sources.
