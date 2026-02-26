# iOS App Store Preparation Guide - خته (5ATTAH)

## Prerequisites
- macOS with Xcode 15+ installed
- Apple Developer account
- Node.js 18+

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync Capacitor iOS
```bash
npx cap sync ios
```

### 4. Open in Xcode
```bash
npx cap open ios
```

Or open `App.xcworkspace` directly in Xcode.

### 5. Configure Signing
1. Open Xcode → App target → Signing & Capabilities
2. Select your team
3. Bundle Identifier: `com.mashrok.ios`

### 6. Build & Run
- Select a simulator or device
- Press ⌘+R to build and run

## App Store Submission
1. Archive: Product → Archive
2. Distribute App → App Store Connect
3. Upload and submit for review

## CI/CD
- Xcode Cloud scripts in `ios/App/ci_scripts/`
- Fastlane configuration in `ios/App/fastlane/`
- Codemagic config in `codemagic.yaml`
