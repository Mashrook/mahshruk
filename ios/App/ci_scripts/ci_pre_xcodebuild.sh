#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔢 Xcode Cloud — Set Build Number"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "${CI_PRIMARY_REPOSITORY_PATH:-}" ]; then
    cd "$CI_PRIMARY_REPOSITORY_PATH/ios/App"
else
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    cd "$SCRIPT_DIR/.."
fi

BUILD_NUMBER="${CI_BUILD_NUMBER:-$(date +%Y%m%d%H%M)}"
echo "📋 Build number: $BUILD_NUMBER"

agvtool new-version -all "$BUILD_NUMBER"
echo "✅ Build number set to $(agvtool what-version -terse)"
