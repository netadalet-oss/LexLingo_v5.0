# LexLingo APK byte-exact synchronization — verified progress (2026-10-26)

Reference APK: user-supplied `base.apk`, SHA-256 `455c3671e3eb521e8dfdaf3b35fdd6178d7961163d5ecd16870fb5f504390767`.

**Current audit of branch `apk-asset-sync-helper-2026-10-26`:**

| Metric | Files |
|---|---:|
| Reference APK files under `assets/` | 632 |
| Tracked files under `app/src/main/assets/` | 195 |
| Verified byte-identical to APK | **180** |
| Missing from the GitHub branch | **439** |
| Present with different bytes | **13** |
| GitHub-only files, absent from APK assets | **2** |

The 13 divergent files are `data_packs/lex_pack_{003,005,006,007,012,013,014,021,022,024,026,027,028}.js`. The two GitHub-only files are `Flm_En_Tr_Lng.xlsx` and `LexLingo_500_satir_sablon.csv`.

## Latest successfully committed transfers

- `b41db7d99ca745e4b680e96d0b7128e788d49b62`: 21 traffic WebP assets.
- `1ed8a53eadf8f15264834dc56fcc48088288162b`: 32 book JPG assets.
- `08a2ed875e6adc1175f2d5232bbbd94ce423c163`: 32 book JPG assets.
- `94b37fb6408db570806a949f92829d9dfe3f71d1`: 28 book JPG assets.

113 additional APK files were matched during this synchronization session (67 -> 180). Each successful upload returned a Git blob SHA-1 identical to the SHA-1 computed locally over the exact APK asset bytes; repository tree entries were subsequently checked against the original 632-file hash audit.

## Limitations / release gates

- The full APK import is **not complete**. Some attempted assets were blocked by the connected upload channel's safety controls, and these were not committed.
- `main` was **not modified**. Keep PR #1 as **draft** until assets are complete, Android build and device tests have passed, and public redistribution rights for bundled content have been checked.
- There were no GitHub Actions runs associated with this PR branch at the time of this report. A successful Android build cannot be claimed.
- Exact APK `assets/` synchronization does not reconstruct the original Android Java/Kotlin source from its compiled DEX.
- The provided `tools/sync_assets_from_apk.py` remains the lossless local import mechanism for a complete, authorized APK transfer.
