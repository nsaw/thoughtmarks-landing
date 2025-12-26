# 🎯 Apple Watch Build Runbook - Thoughtmarks v1.0.0-rc1

**Last Updated**: 2025-10-21  
**Phase**: P7 Slice 15.7 - Freeze & Pre-Flight  
**Status**: ✅ Production-Ready

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Device Configuration](#device-configuration)
3. [Development Build (Simulator)](#development-build-simulator)
4. [Development Build (Physical Device)](#development-build-physical-device)
5. [Archive Build (Release)](#archive-build-release)
6. [WCSession Verification](#wcsession-verification)
7. [Troubleshooting](#troubleshooting)
8. [Reference Documentation](#reference-documentation)

---

## 📦 Prerequisites

### Required Tools
- **Xcode**: 16.3+ (or current stable release)
- **macOS**: Sequoia 15.0+ recommended
- **Apple Developer Account**: Team ID `72SVDSY448`
- **CocoaPods**: Latest version (for iOS dependencies)
- **Node.js**: v20+ (for Metro bundler)
- **Expo**: Latest SDK (for iOS dev workflow)

### Bundle Identifiers
- **iOS App**: `com.thoughtmarks.app`
- **Watch App**: `com.thoughtmarks.app.watchkitapp`
- **App Group**: `group.com.thoughtmarks.app`
- **Keychain Group**: `$(AppIdentifierPrefix)com.thoughtmarks.app`

### Certificates & Provisioning
- **Team ID**: 72SVDSY448
- **Signing**: Automatic signing enabled
- **Capabilities**:
  - iOS: App Groups, Keychain Sharing, Push Notifications, Sign in with Apple
  - Watch: App Groups, Keychain Sharing

---

## 🖥️ Device Configuration

### Simulator Devices (Primary for Development)

**iPhone Simulator**:
- **Model**: iPhone 17 Pro Max (with watch)
- **UDID**: `C97FA1A7-3B3C-42A7-B158-46A1B188BE32`
- **iOS Version**: 18.0+
- **Pairing**: Paired with Watch Series 11

**Watch Simulator**:
- **Model**: Apple Watch Series 11 (46mm)
- **UDID**: `831F6602-396D-4F60-A98C-084E1DCE2A57`
- **watchOS Version**: 11.0+
- **Pairing**: Paired with iPhone 17 Pro Max

### Physical Devices (Optional for Testing)

**iPhone**:
- **Model**: N16ProMax
- **UDID**: `00008140-00020C4A0E42801C`
- **iOS Version**: 18.0+

**Watch**:
- **Model**: Apple Watch (paired automatically)
- **Pairing**: Via iPhone Watch app

---

## 🏗️ Development Build (Simulator)

### Daily Development Workflow

**Target Audience**: iOS developers working on React Native/Expo features

**Scheme Used**: `Thoughtmarks (DEV iOS Only)`

**Steps**:

1. **Start Metro Bundler**:
   ```bash
   cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
   npm run kill:packagers  # Clean any stuck processes
   npm run clean:caches    # Clear Metro cache
   npx expo start --clear  # Start fresh
   ```

2. **Verify Metro Status**:
   ```bash
   curl http://localhost:8081/status
   # Expected: HTTP 200 OK
   ```

3. **Build & Run iOS (Xcode)**:
   - Open: `ios/Thoughtmarks.xcworkspace`
   - Select Scheme: `Thoughtmarks (DEV iOS Only)`
   - Select Device: iPhone 17 Pro Max (with watch) - `C97FA1A7...`
   - Build: `⌘R` or Product → Run
   - **Note**: Watch target NOT built during dev (build-only)

4. **Alternative: Build Script** (Simulator Pair):
   ```bash
   bash scripts/build-for-airr-watch.sh
   ```

**Expected Output**:
```
✅ Build succeeded (iOS app only)
✅ Metro serving bundle on :8081
✅ App launches on iPhone simulator
✅ Watch target skipped (build-only scheme)
```

**Confirmation**:
- iOS app displays dashboard
- Dev Menu accessible (⌘D)
- Metro bundler no errors
- Watch app does NOT launch (expected)

---

## 📱 Development Build (Physical Device)

### Testing on Real Hardware

**Scheme Used**: `Thoughtmarks (DEV iOS Only)` or `Thoughtmarks WatchApp (BUILD-ONLY)`

**Steps**:

1. **Connect iPhone**:
   - USB connection to Mac
   - Trust device if prompted
   - Verify in Xcode: Window → Devices & Simulators

2. **Pair Watch** (if testing watch):
   - Open iPhone Watch app
   - Pair your physical Apple Watch
   - Complete pairing process

3. **Build & Run iOS**:
   ```bash
   bash scripts/build-for-N16PM-W.sh
   ```

   **Or via Xcode**:
   - Open: `ios/Thoughtmarks.xcworkspace`
   - Select Scheme: `Thoughtmarks (DEV iOS Only)`
   - Select Device: N16ProMax (physical)
   - Build: `⌘R`

4. **Build Watch (Optional)**:
   - Select Scheme: `Thoughtmarks WatchApp (BUILD-ONLY)`
   - Select Device: Your paired Apple Watch
   - Build: `⌘B` (Build only, DO NOT run)
   - **Note**: Watch app installs automatically with iOS app

5. **Launch Watch App**:
   - On physical watch, tap Thoughtmarks icon
   - App launches independently

**Expected Output**:
```
✅ iOS app builds and installs
✅ Watch app builds and installs
✅ Both apps launch successfully
✅ WCSession handshake establishes
```

---

## 📦 Archive Build (Release)

### Creating TestFlight/App Store Archive

**Scheme Used**: `Thoughtmarks + Watch (ARCHIVE-ONLY)`

**Important**: This scheme has Run disabled. Use ONLY for archiving.

**Steps**:

1. **Select Archive Scheme**:
   - Open: `ios/Thoughtmarks.xcworkspace`
   - Scheme dropdown → `Thoughtmarks + Watch (ARCHIVE-ONLY)`
   - Destination → `Any iOS Device (arm64)`

2. **Verify Build Configuration**:
   - Product → Scheme → Edit Scheme... (`⌘<`)
   - Archive tab → Build Configuration: **Release**
   - Build tab → Verify both targets enabled:
     - ✅ Thoughtmarks (iOS)
     - ✅ Thoughtmarks WatchApp (watchOS)

3. **Clean Build** (Recommended):
   ```bash
   # Clear derived data (optional but recommended)
   rm -rf ~/Library/Developer/Xcode/DerivedData/Thoughtmarks-*
   ```

4. **Archive**:
   - Product → Archive (`⌘⇧B` or via menu)
   - Wait for build to complete (2-5 minutes)
   - Organizer window opens automatically

5. **Validate Archive**:
   - In Organizer, select the new archive
   - Click "Validate App"
   - Select: App Store Connect
   - Follow prompts (sign in if needed)
   - Wait for validation to complete
   - Verify: **No errors**

6. **Export Archive** (Optional - for local testing):
   - Click "Distribute App..."
   - Select "App Store Connect"
   - Select "Export" (don't upload yet)
   - Choose export location
   - Save `.ipa` file

**Expected Output**:
```
✅ Archive created successfully
✅ Archive includes both iOS and Watch apps
✅ Validation passes with no errors
✅ Archive ready for TestFlight distribution
```

**Archive Contents**:
- **iOS App**: Thoughtmarks.app
- **Watch App**: Thoughtmarks WatchApp.app (embedded)
- **Version**: 1.0.0-rc1
- **Build**: 1

---

## 🔍 WCSession Verification

### Confirming Watch ↔ iPhone Communication

**Prerequisites**:
- Both iOS and Watch apps installed
- Devices paired (simulator or physical)
- Apps launched on both devices

**Steps**:

1. **Check Watch Console**:
   ```
   # In Xcode, open Console (⌘⇧C)
   # Filter: Thoughtmarks WatchApp
   # Look for:
   📱 WCSessionManager activated on watch
   ✅ WCSession activated with state: 2
      - isCompanionAppInstalled: true
      - isReachable: true
   📡 WCSession reachability changed: true
   ```

2. **Check iOS Console**:
   ```
   # Filter: Thoughtmarks
   # Look for:
   📱 PhoneWCSessionBridge initialized
   ✅ WCSession activated
   📡 WCSession reachability: true
   ```

3. **Test Message Flow**:
   - On Watch: Tap "Thoughtmarks" list
   - Watch sends: `["type": "fetch_thoughtmarks"]`
   - Check console for message send confirmation

4. **Expected Console Output** (Watch):
   ```
   📤 Sent message to iPhone: ["type": "fetch_thoughtmarks", "timestamp": ...]
   ⏳ Waiting for reply...
   ```

5. **Expected Console Output** (iOS):
   ```
   📥 Received message from watch: fetch_thoughtmarks
   📤 Sending reply to watch: [...]
   ```

**Success Criteria**:
- ✅ WCSession activates on both devices
- ✅ isCompanionAppInstalled: true
- ✅ isReachable: true (after brief delay)
- ✅ Messages send from watch to iPhone
- ✅ iPhone receives messages (handler implementation pending 15.7.2)

**Known Limitations** (as of 15.7):
- ⚠️ Audio recording does NOT transfer/transcribe yet (15.7.1)
- ⚠️ Thoughtmarks list does NOT sync yet (15.7.2)
- ⚠️ UI spacing needs polish (15.7.3)

---

## 🛠️ Troubleshooting

### Build Failures

#### Swift Compilation Errors

**Symptom**: Swift files fail to compile with errors

**Solutions**:
1. **Verify Swift Version**:
   - Xcode → Build Settings → Swift Language Version: **6.0**

2. **Check Target Membership**:
   - Select any `.swift` file in Project Navigator
   - File Inspector → Target Membership
   - Verify: ✅ Thoughtmarks WatchApp

3. **Clean Build Folder**:
   - Product → Clean Build Folder (`⌘⇧K`)
   - Rebuild: `⌘B`

4. **Verify Frameworks**:
   - Project → Thoughtmarks WatchApp → Build Phases
   - Link Binary With Libraries:
     - ✅ WatchConnectivity.framework
     - ✅ AVFoundation.framework
     - ✅ SwiftUI.framework (auto-linked)

#### Asset Catalog Errors

**Symptom**: "AppIcon not found" or asset errors

**Solutions**:
1. **Verify Asset Catalog Structure**:
   ```
   ios/WatchApp/Assets.xcassets/
   └── WatchAppIcon.appiconset/
       ├── Contents.json
       └── [icon images].png
   ```

2. **Check Contents.json**:
   - Must use `WatchAppIcon.appiconset` (not `AppIcon.appiconset`)
   - Verify icon sizes match watchOS requirements

3. **Regenerate if Needed**:
   - Delete existing asset catalog
   - Create new: File → New → Asset Catalog
   - Add watchOS App Icon set
   - Import icons

#### Metro/Expo Issues

**Symptom**: Metro stalls, bundle errors, or app won't load

**Solutions**:
1. **Verify Metro Excludes Swift Files**:
   ```javascript
   // metro.config.cjs
   blacklistRE: /ios[\/\\]WatchApp[\/\\].*|ios[\/\\].*\.swift$/
   ```

2. **Clean Metro Cache**:
   ```bash
   npm run kill:packagers
   npm run clean:caches
   npx expo start --clear
   ```

3. **Verify Port 8081 Available**:
   ```bash
   lsof -ti:8081 | xargs kill -9  # Kill any stuck processes
   curl http://localhost:8081/status  # Should return 200 after restart
   ```

#### WCSession Not Connecting

**Symptom**: isReachable stays false, messages don't send

**Solutions**:
1. **Verify Pairing** (Simulator):
   - Window → Devices & Simulators
   - Select iPhone simulator
   - Verify: Paired watch shown

2. **Restart Simulators**:
   - Quit both simulators
   - Launch iPhone first, then Watch
   - Wait for pairing to complete

3. **Check Entitlements**:
   - iOS: App Groups = `group.com.thoughtmarks.app`
   - Watch: App Groups = `group.com.thoughtmarks.app`
   - Both must match exactly

4. **Reinstall Apps**:
   - Delete both apps from simulators
   - Clean build folder
   - Rebuild and install fresh

#### Signing Issues

**Symptom**: Code signing errors during build

**Solutions**:
1. **Verify Team ID**:
   - Project → Thoughtmarks → Signing & Capabilities
   - Team: 72SVDSY448
   - Automatically manage signing: ✅ ON

2. **Verify Bundle IDs**:
   - iOS: `com.thoughtmarks.app`
   - Watch: `com.thoughtmarks.app.watchkitapp`

3. **Reset Signing**:
   - Uncheck "Automatically manage signing"
   - Re-check it
   - Xcode regenerates provisioning profiles

---

## 📚 Reference Documentation

### Project Documentation
- **iOS Swift Safety Rules**: `../.cursor/rules/__CRITICAL__ios-swift-safety.mdc`
- **Execution Ops**: `../src-nextgen/guards/execution-ops.yml`
- **Swift Fixes Log**: `XCODE-15.5-BUILD-FIXES.md`
- **Validation Summary**: `VALIDATION.md` (this directory)

### Apple Developer Documentation
- [WatchConnectivity Framework](https://developer.apple.com/documentation/watchconnectivity)
- [SwiftUI for watchOS](https://developer.apple.com/documentation/swiftui)
- [App Distribution Guide](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [TestFlight Best Practices](https://developer.apple.com/testflight/)

### Build Scripts
- **Simulator Pair**: `scripts/build-for-airr-watch.sh`
- **Physical Device**: `scripts/build-for-N16PM-W.sh`
- **Validation**: `scripts/validate-watch-target.sh`

### Utilities
- **Kill Packagers**: `npm run kill:packagers`
- **Clean Caches**: `npm run clean:caches`
- **Expo Start**: `npx expo start --clear`

---

## 🎯 Build Verification Checklist

### Before Building
- [ ] Xcode 16.3+ installed
- [ ] Team ID 72SVDSY448 configured
- [ ] Devices paired (if using watch)
- [ ] Metro cache cleared
- [ ] Derived data cleared (if previous build failed)

### Simulator Build
- [ ] Scheme: `Thoughtmarks (DEV iOS Only)` selected
- [ ] Device: iPhone 17 Pro Max (with watch) selected
- [ ] Metro bundler running (port 8081)
- [ ] Build succeeds with 0 errors
- [ ] iOS app launches successfully
- [ ] Watch target skipped (expected)

### Physical Device Build
- [ ] iPhone connected via USB
- [ ] Device trusted in Xcode
- [ ] Watch paired to iPhone (if testing watch)
- [ ] Build succeeds with 0 errors
- [ ] Apps install on both devices
- [ ] WCSession handshake establishes

### Archive Build
- [ ] Scheme: `Thoughtmarks + Watch (ARCHIVE-ONLY)` selected
- [ ] Destination: Any iOS Device (arm64)
- [ ] Build Configuration: Release
- [ ] Archive succeeds with 0 errors
- [ ] Archive includes both iOS and Watch apps
- [ ] Validation passes (if running)
- [ ] Ready for TestFlight distribution

---

## 📞 Support & Recovery

### Emergency Rollback
If build breaks completely:

```bash
# Navigate to project
cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh

# Revert to last working commit
git log --oneline -10  # Find last good commit
git reset --hard [COMMIT_HASH]

# Clean everything
rm -rf ~/Library/Developer/Xcode/DerivedData/Thoughtmarks-*
cd ios && pod install && cd ..
npm run clean:caches

# Rebuild
bash scripts/build-for-airr-watch.sh
```

### Disable Watch During Dev
If watch target causes issues during iOS development:

1. **Use DEV Scheme**:
   - Always select `Thoughtmarks (DEV iOS Only)` for daily work
   - This scheme NEVER builds watch target

2. **Verify Scheme Configuration**:
   - Product → Scheme → Edit Scheme...
   - Build tab → Uncheck `Thoughtmarks WatchApp` if needed

3. **Metro Already Excludes Watch**:
   - `metro.config.cjs` already excludes `ios/WatchApp/**`
   - No code changes needed

---

## ✅ Success Indicators

### Development Build Success
- ✅ iOS app builds with 0 errors
- ✅ Metro serves bundle on :8081
- ✅ App launches and displays UI
- ✅ Dev Menu accessible
- ✅ No watch-related build errors (watch skipped)

### Archive Build Success
- ✅ Both iOS and Watch compile with 0 errors
- ✅ Archive creates successfully
- ✅ Validation passes (no warnings)
- ✅ Archive size reasonable (<500MB)
- ✅ Both apps included in archive

### WCSession Success
- ✅ WCSession activates on both devices
- ✅ isCompanionAppInstalled: true
- ✅ isReachable: true
- ✅ Messages send successfully
- ✅ Console shows proper handshake logs

---

**Last Updated**: 2025-10-21  
**Version**: 1.0.0-rc1  
**Phase**: P7 Slice 15.7

