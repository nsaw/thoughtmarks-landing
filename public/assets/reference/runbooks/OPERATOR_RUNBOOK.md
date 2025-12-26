# Operator Runbook — On-Device Sanity & Troubleshooting

**Document Type**: Operational Reference  
**Target Audience**: QA Engineers, DevOps, Support Team  
**Last Updated**: 2025-10-13  
**Version**: 1.0

---

## 🎯 **PURPOSE**

This runbook provides step-by-step procedures for:
- On-device sanity testing
- Common troubleshooting scenarios
- Production issue diagnosis
- Emergency rollback procedures

---

## 📱 **ON-DEVICE SANITY TEST CHECKLIST**

### **Pre-Deployment Checks**

#### **1. Development Build Validation**
```bash
# In project root: /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh

# 1. Clean build
npm run clean
npm install

# 2. Type checking
npx tsc --noEmit --skipLibCheck

# 3. Linting
npx eslint src-nextgen --max-warnings=0

# 4. Unit tests
npm test -- --watchAll=false

# 5. Rubric evaluation
node src-nextgen/guards/evaluate-rubric.cjs
```

**Expected Results**:
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 warnings
- ✅ Tests: 27/27 passing
- ✅ Rubric: ≥90% score

---

#### **2. iOS Device Testing**

**Test Devices**:
- iPhone 12 Mini (iOS 17.x) — Minimum supported
- iPhone 15 Pro (iOS 18.x) — Latest flagship
- iPhone SE 3rd Gen (iOS 17.x) — Budget segment

**Test Procedure**:
```bash
# Start Metro bundler
npm run start

# Install on device (Xcode)
# OR use Expo Go for managed workflow
```

**Sanity Tests** (perform on each device):

1. **App Launch & Auth** ✓
   - [ ] App launches without crash
   - [ ] Camera/Microphone permissions requested
   - [ ] Sign in with Apple works
   - [ ] User sees main screen

2. **Voice Recording** ✓
   - [ ] Tap mic button → recording starts
   - [ ] Voice waveform displays
   - [ ] Stop button → recording stops
   - [ ] Thoughtmark created and saved

3. **AI Integration** ✓
   - [ ] AI analysis runs automatically
   - [ ] "AI Insights" card displays
   - [ ] Fallback works if offline
   - [ ] No PII in telemetry (check logs)

4. **Offline Mode** ✓
   - [ ] Enable airplane mode
   - [ ] Create thoughtmark → saves locally
   - [ ] Disable airplane mode
   - [ ] Thoughtmark syncs to cloud

5. **Search & Navigation** ✓
   - [ ] Search bar functional
   - [ ] Results display correctly
   - [ ] Tap result → opens detail screen
   - [ ] Back navigation works

6. **Settings & Privacy** ✓
   - [ ] Settings screen opens
   - [ ] Toggle privacy settings
   - [ ] Data export works
   - [ ] Delete account flow works

---

#### **3. Apple Watch Testing**

**Prerequisites**:
- Paired Apple Watch (watchOS 10.x or later)
- iOS app installed and signed in

**Test Procedure**:

1. **Watch App Installation** ✓
   - [ ] Watch app installs automatically
   - [ ] Watch app icon visible
   - [ ] Launch watch app → no crash

2. **Complications** ✓
   - [ ] Add Thoughtmarks complication to watch face
   - [ ] Today's insight displays
   - [ ] Streak count updates
   - [ ] Tap complication → opens app

3. **Siri Integration** ✓
   - [ ] "Hey Siri, search thoughtmarks for X"
   - [ ] Results display on watch
   - [ ] Tap result → opens in iOS app

4. **Live Activities** ✓
   - [ ] Start recording on iPhone
   - [ ] Live Activity appears on watch
   - [ ] Real-time duration updates
   - [ ] Stop recording → Live Activity dismisses

5. **Background Sync** ✓
   - [ ] Create thoughtmark on iPhone
   - [ ] Wait 30 seconds
   - [ ] Check watch app → new thoughtmark appears
   - [ ] Battery impact < 5% over 1 hour

---

## 🔧 **COMMON ISSUES & TROUBLESHOOTING**

### **Issue 1: App Crashes on Launch**

**Symptoms**:
- App opens then immediately closes
- Red screen error in development
- No error in production (silent crash)

**Diagnosis**:
```bash
# Check crash logs
npx expo-doctor

# Review Sentry for crash reports
# Open: https://sentry.io/thoughtmarks/mobile

# Check Metro bundler logs
npm run start -- --clear
```

**Common Causes**:
1. **TypeScript compilation error**
   ```bash
   npx tsc --noEmit --skipLibCheck
   # Fix any errors before deploying
   ```

2. **Missing dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Invalid Info.plist**
   - Check `ios/Thoughtmarks/Info.plist`
   - Validate usage descriptions present

**Resolution**:
- Fix TypeScript errors
- Reinstall dependencies
- Validate Info.plist
- Re-deploy build

---

### **Issue 2: Voice Recording Fails**

**Symptoms**:
- Mic button doesn't respond
- Recording starts but no audio
- "Microphone permission denied" error

**Diagnosis**:
```bash
# Check permissions in Settings app
# Settings > Thoughtmarks > Microphone = ON

# Check logs
npm run start
# Look for permission errors in Metro logs
```

**Common Causes**:
1. **Microphone permission not granted**
   - User denied permission on first launch
   - Need to prompt again or redirect to Settings

2. **Audio session configuration issue**
   - Check `VoiceRecordingService.ts`
   - Verify audio session category is correct

**Resolution**:
```typescript
// In VoiceRecordingService.ts
await Audio.requestPermissionsAsync();
await Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
});
```

---

### **Issue 3: Offline Sync Not Working**

**Symptoms**:
- Thoughtmarks created offline don't sync
- "Sync failed" error message
- Data loss after closing app

**Diagnosis**:
```bash
# Check OfflineManager logs
# Look for sync queue status

# Verify network connectivity
# Check: NetworkStateService status

# Inspect repository health
node scripts/check-repository-health.cjs
```

**Common Causes**:
1. **Repository corruption**
   - WatermelonDB sync adapter failed
   - SQLite database locked

2. **Network request timeout**
   - API endpoint unreachable
   - Auth token expired

3. **Conflict resolution failed**
   - Server returned 409 Conflict
   - Local changes conflict with server

**Resolution**:
```typescript
// Force repository health check
await OfflineManager.getInstance().performHealthCheck();

// Re-attempt sync manually
await SyncLifecycleManager.getInstance().triggerManualSync();

// If persistent, reset local database (CAUTION: data loss)
await OfflineManager.getInstance().resetRepository();
```

---

### **Issue 4: Privacy Manifest Validation Fails**

**Symptoms**:
- App Store submission rejected
- "Missing Privacy Manifest" error
- "API usage not declared" warning

**Diagnosis**:
```bash
# Run privacy manifest validator
node src-nextgen/guards/privacy-manifest-validator.cjs

# Check validator output
cat validations/reports/privacy-manifest-validation.json
```

**Common Causes**:
1. **Missing API declarations**
   - UserDefaults (CA92.1)
   - FileTimestamp (C617.1)

2. **Incorrect Info.plist**
   - Camera/Microphone usage descriptions missing

**Resolution**:
1. Update `ios/Thoughtmarks/PrivacyInfo.xcprivacy`:
   ```xml
   <key>NSPrivacyAccessedAPITypes</key>
   <array>
     <dict>
       <key>NSPrivacyAccessedAPIType</key>
       <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
       <key>NSPrivacyAccessedAPITypeReasons</key>
       <array>
         <string>CA92.1</string>
       </array>
     </dict>
   </array>
   ```

2. Validate Info.plist has usage descriptions:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Camera access is needed to capture visual thoughtmarks</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>Microphone access is needed to record voice thoughtmarks</string>
   ```

3. Re-run validator to confirm PASS

---

### **Issue 5: Watch App Not Installing**

**Symptoms**:
- Watch app doesn't appear on watch
- "Installation failed" error
- Watch app icon grayed out

**Diagnosis**:
```bash
# Check watch pairing status
# iPhone Settings > Apple Watch > My Watch

# Verify watch app bundle ID
cat ios/Thoughtmarks-Watch/Info.plist | grep CFBundleIdentifier

# Check Xcode build logs
xcodebuild -scheme Thoughtmarks-Watch -sdk watchos -configuration Debug build
```

**Common Causes**:
1. **Watch not paired properly**
   - Unpair and re-pair watch

2. **Provisioning profile issue**
   - Watch app bundle ID not in provisioning profile

3. **watchOS version mismatch**
   - Minimum watchOS 10.0 required

**Resolution**:
1. Verify pairing: Settings > Apple Watch
2. Update provisioning profiles in Xcode
3. Rebuild watch app:
   ```bash
   cd ios
   xcodebuild -scheme Thoughtmarks-Watch -sdk watchos clean build
   ```

---

## 🚨 **EMERGENCY PROCEDURES**

### **Emergency Rollback**

**When to Use**:
- Critical bug discovered in production
- Data corruption affecting users
- Privacy violation detected

**Procedure**:
1. **Identify Last Known Good Build**
   ```bash
   cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
   git log --oneline --max-count=10
   # Find commit before issue
   ```

2. **Create Emergency Branch**
   ```bash
   git checkout -b emergency/rollback-$(date +%Y%m%d)
   git revert <problematic-commit-sha> --no-commit
   git commit -m "Emergency rollback: <issue description>"
   ```

3. **Validate Rollback**
   ```bash
   npm install
   npx tsc --noEmit --skipLibCheck
   npm test -- --watchAll=false
   node src-nextgen/guards/evaluate-rubric.cjs
   ```

4. **Deploy Emergency Build**
   ```bash
   # iOS
   cd ios
   xcodebuild -scheme Thoughtmarks -configuration Release archive

   # Submit to App Store with expedited review request
   ```

5. **Monitor**
   - Check Sentry for crash rate
   - Monitor user feedback
   - Verify issue resolved

---

### **Data Recovery**

**When to Use**:
- User reports lost thoughtmarks
- Sync failure caused data loss
- Database corruption

**Procedure**:
1. **Check Cloud Backup**
   ```typescript
   // In Firebase Console
   // Firestore > thoughtmarks collection
   // Filter by userId: <user-id>
   // Verify documents exist
   ```

2. **Restore from Backup**
   ```typescript
   // Force sync from server
   await SyncLifecycleManager.getInstance().triggerManualSync({
     fullSync: true,
     clearLocal: true
   });
   ```

3. **Manual Recovery (Last Resort)**
   ```bash
   # Export user data from Firebase
   gcloud firestore export gs://thoughtmarks-backups/$(date +%Y%m%d)

   # Restore specific user's data
   gcloud firestore import gs://thoughtmarks-backups/<date> --collection-ids=thoughtmarks
   ```

---

## 📊 **MONITORING & ALERTS**

### **Key Metrics to Monitor**

**Crash-Free Rate**:
- Target: >99.5%
- Check: Sentry dashboard
- Alert if: <99% for 1 hour

**Sync Success Rate**:
- Target: >95%
- Check: Telemetry dashboard
- Alert if: <90% for 15 minutes

**Voice Recording Success Rate**:
- Target: >98%
- Check: `voice_recording_completed` events
- Alert if: <95% for 1 hour

**Watch Battery Impact**:
- Target: <5% per hour
- Check: watchOS system logs
- Alert if: >10% per hour

---

## 🔐 **SECURITY PROCEDURES**

### **PII Breach Response**

**If PII detected in logs/telemetry**:

1. **Immediate Actions**
   ```bash
   # Stop all telemetry ingestion
   # Disable Sentry data collection
   # Purge affected logs from storage
   ```

2. **Investigation**
   ```bash
   # Run PII detection guards
   node src-nextgen/guards/no-pii-in-telemetry.cjs

   # Check redaction smoke tests
   node src-nextgen/guards/telemetry-redaction-smoke.cjs

   # Review affected code paths
   grep -r "sendTelemetry\|logEvent" src-nextgen
   ```

3. **Remediation**
   - Apply redaction to affected code paths
   - Deploy hotfix with DataRedactor integration
   - Verify with redaction smoke tests

4. **Notification**
   - Notify affected users per GDPR/CCPA requirements
   - Document incident in compliance logs
   - Update privacy documentation

---

## 📞 **ESCALATION & SUPPORT**

### **Escalation Paths**

**Level 1: QA Engineer**
- On-device testing failures
- Common app issues
- Documentation updates

**Level 2: Development Team**
- Complex bugs requiring code changes
- Performance issues
- Integration failures

**Level 3: Agent BRAUN/Lead Engineer**
- Critical production issues
- Security incidents
- Emergency rollbacks
- Architecture decisions

### **Support Channels**

**Internal**:
- Slack: #thoughtmarks-mobile
- Email: mobile-team@thoughtmarks.com
- On-call: PagerDuty

**External**:
- App Store Support: developer.apple.com/support
- Firebase Support: firebase.google.com/support
- Sentry Support: sentry.io/support

---

## ✅ **SIGN-OFF CHECKLIST**

Before declaring "production ready":

- [ ] All sanity tests pass on 3 test devices
- [ ] Watch app tested on 2 watch models
- [ ] Privacy manifest validation: PASS
- [ ] Rubric score: ≥90%
- [ ] Crash-free rate: >99.5% (post-beta)
- [ ] No critical bugs in backlog
- [ ] All documentation current
- [ ] Emergency rollback procedure tested
- [ ] Team trained on runbook

---

**Document Owner**: Agent BRAUN (MAIN)  
**Review Frequency**: Monthly or after major releases  
**Version Control**: Track in git alongside codebase

---

**Emergency Contact**: See [ROLLUP_P7_FINAL.md](./ROLLUP_P7_FINAL.md) for current agent contact information.

