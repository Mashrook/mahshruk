#!/bin/bash
set -euo pipefail

echo "━━━ Pre-Xcodebuild: Set build number ━━━"

# Use CI_BUILD_NUMBER from Xcode Cloud for unique build versions
if [ -n "${CI_BUILD_NUMBER:-}" ]; then
    BUILD_NUM="$CI_BUILD_NUMBER"
else
    BUILD_NUM=$(date +%y%m%d%H%M)
fi

echo "📌 Build number: $BUILD_NUM"

# Update Info.plist
INFO_PLIST="${CI_PRIMARY_REPOSITORY_PATH:-$(cd "$(dirname "$0")/.." && pwd)}/ios/App/App/Info.plist"
if [ -f "$INFO_PLIST" ]; then
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUM" "$INFO_PLIST" 2>/dev/null || true
    echo "✅ CFBundleVersion set to $BUILD_NUM"
fi
