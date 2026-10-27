#!/usr/bin/env python3
"""Reassemble the three last APK assets, verifying the exact APK Git blob hashes.

Run only after all base64 chunks have been committed to asset_payload/chunks/.
The manifest contains hashes calculated directly from the user's reference APK.
"""
import base64
import binascii
import hashlib
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "app/src/main/assets"
PAYLOAD_ROOT = ROOT / "asset_payload/chunks"
MANIFEST = ROOT / "asset_payload/APK_ASSET_GIT_SHA1.tsv"
EXPECTED = {
    "js013": (
        "data_packs/lex_pack_013.js",
        3808323,
        "b51316ca49f9f1fb7bf2b2161548491c103f68f0dae0b940baaebec3dc9a8321",
        "78afd170f5232de1f3096d0a66d1e35a00ede933",
        10,
    ),
    "dutch_stories": (
        "docs/dutch_stories.pdf",
        3913838,
        "3837caff64a6b9eff198c8857064f87fc186338e920fbde9966bd32a30692a1e",
        "1209bf84fa9a222a224884512ea0f15a8799d61e",
        10,
    ),
    "erkan_tesbihat": (
        "audio/quran/erkan-mutlu-tesbihat-90.mp3",
        4075312,
        "accf5b1705b856742efcdeb3ba16edf6f27f37f20e87c021f3d388e7d801e8c3",
        "a3515a4bcd79b341f6d8b6fc5bd2fbdf02180144",
        11,
    ),
}

def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()

def assemble(tag, relative_path, expected_len, expected_sha256, expected_blob, part_count):
    directory = PAYLOAD_ROOT / tag
    paths = sorted(directory.glob("part_*.b64"))
    required = [directory / ("part_%03d.b64" % i) for i in range(part_count)]
    if paths != required:
        raise RuntimeError(f"{tag}: missing, additional or misnumbered chunks: {len(paths)} found, {part_count} expected")
    raw = bytearray()
    for i, path in enumerate(required):
        data = path.read_bytes().strip()
        if not data or not re.fullmatch(rb"[A-Za-z0-9+/]*={0,2}", data):
            raise RuntimeError(f"{tag}: invalid Base64 alphabet in part {i}")
        try:
            decoded = base64.b64decode(data, validate=True)
        except binascii.Error as exc:
            raise RuntimeError(f"{tag}: invalid Base64 in part {i}") from exc
        if i != part_count - 1 and len(decoded) != 393216:
            raise RuntimeError(f"{tag}: wrong intermediate chunk size at part {i}")
        raw.extend(decoded)
    data = bytes(raw)
    if len(data) != expected_len:
        raise RuntimeError(f"{tag}: expected {expected_len} bytes; reconstructed {len(data)}")
    if hashlib.sha256(data).hexdigest() != expected_sha256:
        raise RuntimeError(f"{tag}: whole-file SHA-256 did not match reference APK")
    if git_blob_sha(data) != expected_blob:
        raise RuntimeError(f"{tag}: Git blob SHA-1 did not match reference APK")
    target = ASSET_ROOT / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + ".partially-reconstructed")
    temporary.write_bytes(data)
    os.replace(temporary, target)
    print(f"PASS assembled {relative_path}: {len(data)} bytes, {expected_blob}")

def verify_all_assets():
    expected = {}
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        path, digest = line.split("\t")
        rel = Path(path)
        if rel.is_absolute() or ".." in rel.parts or path in expected or not re.fullmatch(r"[0-9a-f]{40}", digest):
            raise RuntimeError(f"Invalid manifest entry: {path}")
        expected[path] = digest
    if len(expected) != 632:
        raise RuntimeError(f"Expected 632 manifest entries, saw {len(expected)}")
    actual = {p.relative_to(ASSET_ROOT).as_posix()
              for p in ASSET_ROOT.rglob("*") if p.is_file()}
    missing = set(expected) - actual
    extras = actual - set(expected)
    allowed_extras = {"Flm_En_Tr_Lng.xlsx", "LexLingo_500_satir_sablon.csv"}
    if missing or extras != allowed_extras:
        raise RuntimeError(f"Asset inventory mismatch: {len(missing)} missing, extras={extras}")
    for path, digest in expected.items():
        actual_sha = git_blob_sha((ASSET_ROOT / path).read_bytes())
        if actual_sha != digest:
            raise RuntimeError(f"APK content mismatch: {path} ({actual_sha} vs {digest})")
    print("PASS: All 632 APK assets are byte-exact; only two preexisting repo-only CSV/XLSX assets remain.")

if __name__ == "__main__":
    for tag, spec in EXPECTED.items():
        assemble(tag, *spec)
    verify_all_assets()
