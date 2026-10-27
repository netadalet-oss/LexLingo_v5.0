#!/usr/bin/env python3
"""Sync exact WebView asset bytes from a local APK to a cloned GitHub repository.

Dry-run by default:
  python3 tools/sync_assets_from_apk.py base.apk --repo .
Apply:
  python3 tools/sync_assets_from_apk.py base.apk --repo . --apply
Remove obsolete WebView asset files:
  python3 tools/sync_assets_from_apk.py base.apk --repo . --apply --prune
"""
import argparse
import hashlib
from pathlib import Path
from zipfile import ZipFile

def sha256(data):
    return hashlib.sha256(data).hexdigest()

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("apk", type=Path, help="Local base.apk from the target installation")
    p.add_argument("--repo", type=Path, default=Path("."), help="Git checkout root")
    p.add_argument("--apply", action="store_true", help="Copy byte-identical assets into Git checkout")
    p.add_argument("--prune", action="store_true", help="Delete assets absent from APK (only with --apply)")
    args = p.parse_args()
    repo = args.repo.resolve()
    target = repo / "app" / "src" / "main" / "assets"
    if not (repo / ".git").exists() or not (repo / "app" / "src" / "main").exists():
        p.error("--repo must be the project Git checkout")
    if args.prune and not args.apply:
        p.error("--prune requires --apply")
    files = {}
    with ZipFile(args.apk) as apk:
        for info in apk.infolist():
            if not info.filename.startswith("assets/") or info.is_dir():
                continue
            rel = Path(info.filename[7:])
            if rel.is_absolute() or not rel.parts or ".." in rel.parts:
                raise ValueError("Unsafe APK archive entry: " + info.filename)
            if rel.as_posix() in files:
                raise ValueError("Duplicate entry: " + info.filename)
            files[rel.as_posix()] = apk.read(info)
    changed = new = identical = removed = 0
    for name, data in sorted(files.items()):
        path = target / name
        if path.is_file() and path.read_bytes() == data:
            identical += 1
            continue
        operation = "CHANGED" if path.is_file() else "NEW"
        changed += operation == "CHANGED"
        new += operation == "NEW"
        print(operation, str(path.relative_to(repo)), sha256(data)[:12])
        if args.apply:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
    if args.prune:
        for path in target.rglob("*"):
            if path.is_file() and path.relative_to(target).as_posix() not in files:
                print("REMOVE", str(path.relative_to(repo)))
                path.unlink()
                removed += 1
    print("Summary:", {"identical": identical, "new": new, "changed": changed, "removed": removed},
          "mode:", "APPLIED" if args.apply else "PREVIEW")
    if not args.apply:
        print("Preview only. Rerun with --apply to write these changes.")

if __name__ == "__main__":
    main()
