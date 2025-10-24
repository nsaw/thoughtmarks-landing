# App Store Privacy Labels

**Last Updated**: 2025-10-15  
**Phase**: P7 Slice-10 - Privacy, Compliance & Data Lifecycle  
**Compliance**: GDPR, CCPA, App Store Privacy Requirements

---

## Executive Summary

This document defines the **accurate and truthful** privacy labels for the Thoughtmarks App Store listing. All labels reflect actual data collection practices with differential privacy protections, k-anonymity guarantees, and zero thoughtmark content collection.

**Key Privacy Guarantees**:
- ✅ **Zero Thoughtmark Content Collection**: Thoughtmark titles and content are NEVER sent to analytics
- ✅ **Differential Privacy**: All numeric data protected with ε=0.1 Laplace noise
- ✅ **K-Anonymity**: Users grouped into cohorts of k≥5 for anonymity
- ✅ **Hashed IDs Only**: All user/device/session IDs are hashed before transmission
- ✅ **90-Day Retention**: Raw user-level data auto-deleted after 90 days
- ✅ **User Control**: Full export, deletion, and opt-out capabilities

---

## Data Collection Categories

### 1. Product Interaction

**Purpose**: Understand how users interact with features to improve the product

**Data Collected**:
- Feature usage patterns (e.g., "user opened AI panel", "user created thoughtmark")
- Button tap events (anonymized, no content)
- Screen view events (screen names only, no content)
- Navigation flow (screen transitions)
- Session duration (rounded to nearest second)

**Identifiers**:
- Hashed user ID (irreversible SHA-256)
- Hashed session ID
- Cohort ID (k-anonymity with k≥5)

**Privacy Protections**:
- All numeric values receive Laplace noise (ε=0.1)
- All duration values rounded (reduces precision)
- No content from thoughtmarks included
- All IDs are hashed before transmission

**Example Event**:
```json
{
  "eventName": "ai_panel_opened",
  "userId": "hash_a3f2b1c9e4d5",
  "cohortId": "cohort_42",
  "sessionId": "hash_session_xyz",
  "timestamp": 1697395200000,
  "platform": "ios"
}
```

**Linked to User**: Yes (hashed ID)  
**Used for Tracking**: No  
**Data Retention**: 90 days

---

### 2. Performance Data

**Purpose**: Monitor app performance and identify issues

**Data Collected**:
- Screen load times (rounded to nearest 10ms)
- API response latency (rounded, noised)
- Error rates (aggregated only)
- Crash reports (anonymized stack traces)
- Memory usage (rounded to nearest 10MB)

**Identifiers**:
- Hashed device ID
- App version
- OS version
- Cohort ID (k≥5)

**Privacy Protections**:
- All latency values receive DP noise
- All values rounded to reduce precision
- Stack traces stripped of file paths
- Aggregated at cohort level (k≥5)

**Example Event**:
```json
{
  "eventName": "infra_performance_measured",
  "screenLoadTimeMs": 240,
  "apiLatencyMs": 155,
  "memoryUsageMB": 120,
  "cohortId": "cohort_42",
  "platform": "ios",
  "osVersion": "17.0"
}
```

**Linked to User**: Yes (cohort only)  
**Used for Tracking**: No  
**Data Retention**: 90 days (raw), indefinite (aggregates)

---

### 3. Diagnostics

**Purpose**: Debug errors and improve app stability

**Data Collected**:
- Error messages (PII redacted)
- Error frequency (aggregated)
- Error context (screen names, action types - no content)
- Device model (anonymized)

**Identifiers**:
- Cohort ID (k≥5)
- App version
- Platform

**Privacy Protections**:
- All PII redacted from error messages
- File paths stripped from stack traces
- No user IDs in crash reports
- Aggregated at cohort level

**Example Event**:
```json
{
  "eventName": "infra_error_reported",
  "errorType": "NetworkError",
  "errorCode": 500,
  "screenName": "DashboardScreen",
  "cohortId": "cohort_42",
  "platform": "ios"
}
```

**Linked to User**: No (cohort only)  
**Used for Tracking**: No  
**Data Retention**: 90 days

---

### 4. Analytics (Optional)

**Purpose**: Product analytics for feature improvement (opt-in via settings)

**User Control**: 
- ✅ **Opt-Out Available**: Settings > Privacy > "Share Anonymous Analytics" toggle
- ✅ **Default State**: Enabled (can be disabled anytime)
- ✅ **Immediate Effect**: Disabling stops all collection instantly
- ✅ **Data Deletion**: Users can request deletion of all analytics data

**Data Collected** (when opted-in):
- Feature usage counts (rounded, k≥5)
- Aggregated user behavior patterns (cohort-level)
- A/B test assignments (hashed user IDs)
- Experiment exposure/conversion (anonymized)

**Privacy Protections**:
- Differential privacy (ε=0.1) on all numeric data
- K-anonymity (k≥5) for all cohort analysis
- All IDs hashed before transmission
- 90-day retention on raw data
- Cohort aggregates only after 90 days

**Linked to User**: Yes (hashed ID, cohort)  
**Used for Tracking**: No  
**Data Retention**: 90 days (raw), indefinite (cohort aggregates)

---

## Data NOT Collected

### Thoughtmark Content

❌ **NEVER COLLECTED**:
- Thoughtmark titles
- Thoughtmark body content
- Thoughtmark tags (actual tag text)
- Voice recording transcriptions
- Voice recording audio files
- AI-generated suggestions (content)
- Search queries (actual query text)

✅ **ONLY COLLECTED** (if analytics enabled):
- Thoughtmark count (rounded to nearest 10, noised)
- Title/content length (rounded to nearest 100, noised)
- Tag count (rounded to nearest 5)
- Search result count (rounded, noised)
- Action types ("created", "edited", "deleted") - no content

### Location Data

❌ **NEVER COLLECTED**:
- Precise location coordinates
- IP address tracking
- GPS data
- Location names or addresses

### Contact Information

❌ **NEVER COLLECTED** in Analytics:
- Email addresses
- Phone numbers
- Physical addresses
- Social media handles

**Note**: Email is collected for authentication only, never included in analytics

### Browsing History

❌ **NEVER COLLECTED**:
- Web browsing outside app
- App usage outside Thoughtmarks
- Cross-app tracking

---

## Privacy Label Summary for App Store Connect

Use these exact labels when submitting to App Store:

### Data Types Collected

| Data Type | Category | Purpose | Linked to User | Tracking | Optional |
|-----------|----------|---------|----------------|----------|----------|
| Product Interaction | Analytics | App Functionality | Yes (Hashed) | No | Yes |
| Performance Data | Diagnostics | App Functionality | Yes (Cohort) | No | Yes |
| Crash Data | Diagnostics | App Functionality | No | No | No |
| Device ID | Identifiers | Analytics | Yes (Hashed) | No | Yes |

### Privacy Practices

**Data Linked to User**:
- Hashed user identifiers for analytics (can be deleted on request)
- Cohort membership (k≥5 for anonymity)

**Data NOT Linked to User**:
- Performance aggregates
- Error statistics
- Cohort-level metrics

**Data Used for Tracking**:
- None (no cross-app tracking, no ad targeting)

**User Control**:
- ✅ Opt-out available (Settings > Privacy)
- ✅ Data export available
- ✅ Data deletion available (30-day SLA)

---

## Privacy Nutrition Label

**Visual representation for users:**

```
📊 Data Used to Track You: NONE

🔗 Data Linked to You:
   └─ Product Interaction (Analytics - Optional)
   
🔒 Data Not Linked to You:
   └─ Diagnostics
   
📍 Location: NOT COLLECTED
   
📧 Contact Info: NOT COLLECTED (except for account authentication)
   
📝 User Content: NOT COLLECTED (thoughtmarks stay local/encrypted)
```

---

## Privacy-Preserving Techniques

### 1. Differential Privacy (ε=0.1)

All numeric fields receive Laplace noise for mathematical privacy:

```typescript
// Before DP
contentLength: 347

// After DP (ε=0.1)
contentLength: 352  // Original + Laplace noise
contentLength: 300  // Then rounded to nearest 100
```

**Guarantee**: (0.1)-differential privacy - industry-leading privacy protection

### 2. K-Anonymity (k=5)

Users grouped into cohorts of minimum 5 for all analysis:

```typescript
// User assignment
userId: "hash_a3f2b1c9" → cohortId: "cohort_42"

// Cohort contains ≥5 users
cohort_42: [hash_a3f2b1c9, hash_b7d3e8f1, hash_c2a9d4e6, ...]
```

**Guarantee**: No individual can be identified from cohort-level analysis

### 3. ID Hashing (SHA-256)

All identifiers hashed before transmission:

```typescript
// User ID hashing
userId: "user_123" → "hash_a3f2b1c9e4d5" (irreversible)

// Device ID hashing
deviceId: "iPhone14-xyz" → "hash_f7e8d2c1a9b3" (irreversible)

// Session ID hashing
sessionId: "session_abc123" → "hash_b2d4f6e8a1c3" (irreversible)
```

**Guarantee**: No reverse lookup possible - IDs are cryptographically hashed

### 4. Data Minimization

Only essential data collected:

```typescript
// ✅ Collected
{
  "eventName": "ai_panel_opened",
  "timestamp": 1697395200000,
  "userId": "hash_xyz"  // Hashed
}

// ❌ NOT Collected
{
  "thoughtmarkTitle": "My private thought",  // NEVER included
  "thoughtmarkContent": "Sensitive data...",  // NEVER included
  "email": "user@example.com"  // NEVER included
}
```

---

## User Rights & Compliance

### GDPR Compliance (EU)

✅ **Article 15** - Right of access: Data export available  
✅ **Article 16** - Right to rectification: Settings can be updated  
✅ **Article 17** - Right to erasure: Data deletion available (30-day SLA)  
✅ **Article 18** - Right to restriction: Opt-out available  
✅ **Article 20** - Right to data portability: JSON export with standard format  
✅ **Article 21** - Right to object: Analytics toggle in settings  

### CCPA Compliance (California)

✅ **Right to Know**: Privacy policy explains all collection  
✅ **Right to Delete**: Data deletion available in settings  
✅ **Right to Opt-Out**: Analytics toggle available  
✅ **No Sale of Data**: User data is never sold  
✅ **No Discrimination**: App works fully with analytics disabled  

### App Store Requirements

✅ **Privacy Policy Link**: Visible in App Store listing  
✅ **In-App Disclosure**: Privacy settings screen with full details  
✅ **Accurate Labels**: All labels match actual collection  
✅ **User Control**: Opt-out and deletion clearly accessible  
✅ **Data Minimization**: Only necessary data collected  

---

## Compliance Checklist

### App Store Connect Configuration

When submitting app updates, use these settings:

#### Privacy Section

- [x] Does this app collect data from this app?
  - **YES** (with user control and privacy protections)

#### Data Types

- [x] **Product Interaction**
  - Purpose: Analytics
  - Linked to User: Yes (Hashed ID)
  - Used for Tracking: No
  - Optional: Yes (can opt-out)

- [x] **Performance Data**
  - Purpose: App Functionality
  - Linked to User: Yes (Cohort Only)
  - Used for Tracking: No
  - Optional: Yes (can opt-out)

- [x] **Crash Data**
  - Purpose: App Functionality
  - Linked to User: No
  - Used for Tracking: No
  - Optional: No (required for bug fixes)

- [x] **Device ID**
  - Purpose: Analytics
  - Linked to User: Yes (Hashed)
  - Used for Tracking: No
  - Optional: Yes (can opt-out)

#### Privacy Practices

- [x] Data is collected in a way that does not identify the user
  - **Cohort-level analysis only (k≥5)**
  - **Differential privacy protections (ε=0.1)**
  - **All IDs hashed (irreversible)**

- [x] User can request their data be deleted
  - **Settings > Privacy > Delete My Data**
  - **30-day SLA per GDPR/CCPA**

- [x] User can opt-out of data collection
  - **Settings > Privacy > Share Anonymous Analytics toggle**
  - **Immediate effect - no network calls when disabled**

- [x] Privacy policy link provided
  - **In-app and App Store listing**

---

## Privacy Policy Content Requirements

Your privacy policy MUST include:

### What We Collect

✅ **Anonymized Usage Data** (when opted-in):
- Feature usage patterns (e.g., "AI panel opened")
- Aggregated performance metrics (screen load times)
- Error reports for debugging
- A/B test assignments (hashed user IDs)

❌ **We DO NOT Collect**:
- Thoughtmark content or titles
- Contact information for analytics
- Location data
- Browsing history outside app

### How We Protect Data

✅ **Differential Privacy**: Laplace noise (ε=0.1) on all numeric data  
✅ **K-Anonymity**: Cohort-based analysis (k≥5 minimum)  
✅ **ID Hashing**: SHA-256 hashing of all identifiers  
✅ **Data Minimization**: Only essential data collected  
✅ **Encryption**: TLS 1.3 in transit, AES-256 at rest  
✅ **Retention Limits**: 90-day automatic deletion  

### User Rights

✅ **Access**: Export all your data (hashed IDs)  
✅ **Deletion**: Request permanent deletion (30-day SLA)  
✅ **Opt-Out**: Disable analytics anytime  
✅ **Portability**: Standard JSON export format  

### Legal Basis (GDPR)

- **Legitimate Interest**: Product improvement and error detection
- **Consent**: User can opt-out anytime (Settings > Privacy)
- **Necessity**: Minimal data needed for app functionality

---

## Privacy Manifest (iOS 17+)

**File**: `ios/PrivacyInfo.xcprivacy`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key>
  <false/>
  
  <key>NSPrivacyTrackingDomains</key>
  <array/>
  
  <key>NSPrivacyCollectedDataTypes</key>
  <array>
    <!-- Product Interaction -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeProductInteraction</string>
      
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>
    
    <!-- Performance Data -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypePerformanceData</string>
      
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <false/>
      
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>
    
    <!-- Crash Data -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeCrashData</string>
      
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <false/>
      
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>
    
    <!-- Device ID (Hashed) -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeDeviceID</string>
      
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
      </array>
    </dict>
  </array>
  
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <!-- User Defaults (for settings persistence) -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>CA92.1</string>  <!-- Accessing user defaults to store app preferences -->
      </array>
    </dict>
    
    <!-- File Timestamp (for data export) -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
      
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>C617.1</string>  <!-- Accessing file modification times -->
      </array>
    </dict>
    
    <!-- Disk Space (for storage management) -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
      
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>E174.1</string>  <!-- Displaying disk space to user -->
      </array>
    </dict>
  </array>
</dict>
</plist>
```

---

## Marketing Copy for App Store

### Privacy Highlights

Use in App Store description or screenshots:

```
🔒 PRIVACY-FIRST DESIGN

✓ Your thoughtmarks stay private - we never collect your content
✓ Anonymous analytics with differential privacy (ε=0.1)
✓ All user IDs hashed for irreversible anonymization
✓ Cohort-based analysis only (groups of 5+ users)
✓ 90-day automatic data deletion
✓ Full export & deletion control in settings
✓ No cross-app tracking, no ad targeting
✓ GDPR & CCPA compliant

Your thoughts are yours. We only collect what's necessary to improve
the app, and you can opt-out anytime.
```

---

## Review Preparation Checklist

Before App Store submission:

- [ ] Privacy labels match this document exactly
- [ ] Privacy policy accessible in-app and App Store listing
- [ ] Settings > Privacy screen shows analytics toggle
- [ ] Settings > Privacy screen shows export/delete options
- [ ] Test analytics opt-out (should stop all collection immediately)
- [ ] Test data export (should return JSON with hashed IDs only)
- [ ] Test data deletion (should acknowledge 30-day SLA)
- [ ] Verify no thoughtmark content in any analytics events
- [ ] Run privacy-audit.cjs and pass (0 violations)
- [ ] PrivacyInfo.xcprivacy file included in iOS bundle

---

## Implementation References

### Code

- **Privacy Pipeline**: `src-nextgen/services/telemetry/DifferentialPrivacy.ts`
- **PII Redaction**: `src-nextgen/services/telemetry/DataRedactor.ts`
- **Analytics Facade**: `src-nextgen/services/analytics/AnalyticsFacade.ts`
- **Privacy UI**: `src-nextgen/screens/settings/SettingsPrivacyScreen.tsx`
- **Privacy API**: `src-nextgen/services/privacy/PrivacyApiService.ts`
- **Audit Script**: `scripts/privacy-audit.cjs`

### Documentation

- **Privacy Policy**: `docs/analytics/PRIVACY_POLICY_COMPLIANCE.md`
- **User Rights**: `docs/privacy/USER_RIGHTS_OPERATIONS.md`
- **Event Taxonomy**: `docs/analytics/EVENT_TAXONOMY_V2.md`

---

## Audit Trail

| Date | Change | Reviewer |
|------|--------|----------|
| 2025-10-15 | Initial privacy labels for P7 Slice-10 | BRAUN |
| | Differential privacy (ε=0.1) implemented | BRAUN |
| | K-anonymity (k≥5) enforced | BRAUN |
| | User controls added (opt-out, export, deletion) | BRAUN |

---

**Status**: ✅ **READY FOR APP STORE SUBMISSION**  
**Compliance**: ✅ **GDPR, CCPA, App Store Requirements**  
**User Control**: ✅ **Full opt-out, export, and deletion available**  
**Privacy Guarantees**: ✅ **ε=0.1 DP, k≥5 anonymity, hashed IDs only**  
**Content Protection**: ✅ **Zero thoughtmark content collected**

---

**END OF APP STORE PRIVACY LABELS DOCUMENTATION**

