#!/usr/bin/env sh
set -e
if command -v gradle >/dev/null 2>&1; then
  exec gradle "$@"
fi
echo "Gradle is not installed. In GitHub Actions, gradle/actions/setup-gradle installs it before this script runs." >&2
exit 127
