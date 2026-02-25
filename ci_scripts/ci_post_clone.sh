#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔧 Xcode Cloud — Post Clone Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Determine project root ──────────────────────────────────────
if [ -n "${CI_PRIMARY_REPOSITORY_PATH:-}" ]; then
    PROJECT_ROOT="$CI_PRIMARY_REPOSITORY_PATH"
else
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

cd "$PROJECT_ROOT"
echo "📂 Project root: $(pwd)"

# ── 1. Install Node.js ──────────────────────────────────────────
echo ""
echo "━━━ Step 1: Install Node.js ━━━"
if ! command -v node &>/dev/null; then
    echo "📦 Installing Node.js via Homebrew..."
    brew install node
fi
echo "   Node: $(node --version)"
echo "   npm:  $(npm --version)"

# ── 2. Install npm dependencies ─────────────────────────────────
echo ""
echo "━━━ Step 2: Install npm dependencies ━━━"
if [ -f "package-lock.json" ]; then
    npm ci --no-audit --no-fund
else
    npm install --no-audit --no-fund
fi
echo "✅ Dependencies installed"

# ── 3. Build web app ────────────────────────────────────────────
echo ""
echo "━━━ Step 3: Build web app ━━━"
npm run build
echo "✅ Web build complete"

if [ ! -d "dist" ]; then
    echo "❌ ERROR: dist/ not found!"
    exit 1
fi

# ── 4. Sync Capacitor ───────────────────────────────────────────
echo ""
echo "━━━ Step 4: Sync Capacitor ━━━"
npx cap sync ios --no-build
echo "✅ Capacitor sync complete"

if [ ! -d "ios/App/App/public" ]; then
    echo "❌ ERROR: ios/App/App/public/ not found!"
    exit 1
fi

# ── 5. Resolve SPM packages ────────────────────────────────────
echo ""
echo "━━━ Step 5: Resolve SPM packages ━━━"
cd ios/App
xcodebuild -resolvePackageDependencies -project App.xcodeproj -scheme App 2>&1 || true
cd "$PROJECT_ROOT"
echo "✅ SPM packages resolved"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Post-clone script completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
