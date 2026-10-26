# APK source/reference integrity audit (2026-10-26)

Input: user-provided `base.apk`, SHA-256 `455c3671e3eb521e8dfdaf3b35fdd6178d7961163d5ecd16870fb5f504390767`.

**APK inventory:** 632 files under `assets/`, totaling 117,322,513 uncompressed bytes. Not a full decompilation of Android classes.

**GitHub `main` on audit:**
- 34 files tracked under `app/src/main/assets/`
- 2 byte-identical overlaps: `data_packs/lex_manifest.js`, `logo.jpg`
- 30 known divergent overlaps: `data_packs/lex_pack_001.js`, `data_packs/lex_pack_002.js`, `data_packs/lex_pack_003.js`, `data_packs/lex_pack_004.js`, `data_packs/lex_pack_005.js`, `data_packs/lex_pack_006.js`, `data_packs/lex_pack_007.js`, `data_packs/lex_pack_008.js`, `data_packs/lex_pack_009.js`, `data_packs/lex_pack_010.js`, `data_packs/lex_pack_011.js`, `data_packs/lex_pack_012.js`, `data_packs/lex_pack_013.js`, `data_packs/lex_pack_014.js`, `data_packs/lex_pack_015.js`, `data_packs/lex_pack_016.js`, `data_packs/lex_pack_017.js`, `data_packs/lex_pack_018.js`, `data_packs/lex_pack_019.js`, `data_packs/lex_pack_020.js`, `data_packs/lex_pack_021.js`, `data_packs/lex_pack_022.js`, `data_packs/lex_pack_023.js`, `data_packs/lex_pack_024.js`, `data_packs/lex_pack_025.js`, `data_packs/lex_pack_026.js`, `data_packs/lex_pack_027.js`, `data_packs/lex_pack_028.js`, `data_packs/lex_pack_029.js`, `index.html`
- 2 repo-only files (not in this APK's assets): `Flm_En_Tr_Lng.xlsx`, `LexLingo_500_satir_sablon.csv`
- **600 APK files absent** on `main` (600 calculated from overlap).

Hash method: Git blob SHA-1 (`SHA1("blob " + byte_length + NUL + bytes)`). Local APK blob hashes were compared with GitHub's Git-tree hashes; no inference from filenames or size.

After this audit, the draft PR branch also includes the byte-identical `hotfix_v132.js` (blob `34ccd5be341e26a3a6deb96e4881ef60e55388ed`). **This does not make the other APK files synchronized.**

The downloadable APK extraction bundle created in the related ChatGPT conversation contains all 632 assets, but the entire binary payload has **not been transmitted to GitHub**. Android Java/Kotlin source and manifest cannot be expected to match exactly based on compiled APK alone.
