# User Rights Operations - Export, Delete, Opt-Out

**Last Updated**: 2025-10-15  
**Phase**: P7 Slice-10 - Privacy, Compliance & Data Lifecycle  
**Compliance**: GDPR Articles 15, 16, 17, 18, 20, 21 / CCPA Sections 1798.100, 1798.105, 1798.110

---

## Executive Summary

This document provides the **complete operational runbook** for handling user privacy rights in Thoughtmarks:

1. **Data Export** - Users can request and download all their data
2. **Data Deletion** - Users can request permanent deletion (30-day SLA)
3. **Analytics Opt-Out** - Users can disable analytics collection anytime

All operations are **fully automated** via Settings UI and backend API, with **privacy-first defaults** (hashed IDs only, no raw PII).

---

## Table of Contents

1. [Analytics Opt-Out](#analytics-opt-out)
2. [Data Export](#data-export)
3. [Data Deletion](#data-deletion)
4. [Privacy Pipeline](#privacy-pipeline)
5. [Server Operations](#server-operations)
6. [Troubleshooting](#troubleshooting)

---

## Analytics Opt-Out

### User Flow

**Location**: Settings > Privacy > "Share Anonymous Analytics" toggle

### Step 1: User Disables Analytics

```
User action: Toggle OFF "Share Anonymous Analytics"
```

**Client-side behavior**:
1. UI updates immediately (toggle switches to OFF)
2. `PrivacyApiService.setAnalyticsPreference(false)` called
3. Preference saved to AsyncStorage
4. `AnalyticsFacade.updateConfig({ enabled: false })` called
5. Event queue cleared immediately
6. All subsequent `track()`, `identify()`, `alias()` calls become no-ops

**Code Path**:
```typescript
// SettingsPrivacyScreen.tsx
const handleToggleAnalytics = async (enabled: boolean) => {
  await privacyApiService.setAnalyticsPreference(enabled);
  // Updates facade immediately
};

// PrivacyApiService.ts
async setAnalyticsPreference(enabled: boolean) {
  // Save to storage
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled }));
  
  // Update facade
  await analyticsFacade.updateConfig({ enabled });
  
  // Clear queue if disabled
  if (!enabled) {
    await analyticsFacade.clearQueue();
  }
}

// AnalyticsFacade.ts
async track(event) {
  // Early return if disabled (no network activity)
  if (!this.config.enabled) {
    return;
  }
  // ... rest of tracking logic
}
```

### Step 2: Persistence

**Storage**:
- Key: `@privacy_analytics_preference`
- Value: `{ "enabled": false, "updatedAt": "2025-10-15T12:00:00.000Z" }`
- Location: AsyncStorage (encrypted on device)

**Restoration**:
- Preference loaded on app launch
- Facade configured before any tracking
- Persists across app restarts

### Step 3: Verification

**User can verify opt-out is working**:
1. Open Settings > Privacy
2. Toggle should be OFF
3. No analytics events in debug console
4. Network tab shows no analytics requests

**Admin can verify opt-out**:
```bash
# Check AsyncStorage
npx react-native-debugger
# View: @privacy_analytics_preference

# Check analytics queue (should be empty)
analyticsFacade.getQueueStatus();
// Returns: { queueSize: 0, ... }
```

### Re-enabling Analytics

```
User action: Toggle ON "Share Anonymous Analytics"
```

**Client-side behavior**:
1. UI updates immediately (toggle switches to ON)
2. Preference saved to AsyncStorage
3. `AnalyticsFacade.updateConfig({ enabled: true })` called
4. Tracking resumes immediately
5. One event tracked: `engagement_analytics_preference_updated`

---

## Data Export

### User Flow

**Location**: Settings > Privacy > "Export My Data"

### Step 1: User Requests Export

```
User action: Tap "Export My Data"
```

**Client-side behavior**:
1. Check for existing pending export request
2. If none, POST to `/api/privacy/export`
3. Show success alert: "Export requested, you'll be notified when ready"
4. Start polling for status every 5 seconds

**Request Payload**:
```json
{
  "includeAnalytics": true,
  "includeExperiments": true,
  "includeSettings": true,
  "anonymize": true
}
```

**Server-side behavior**:
1. Validate auth token
2. Generate unique request ID: `export_{userId}_{timestamp}`
3. Create export job with status "pending"
4. Return job status immediately (don't block request)
5. Process export in background

**Response**:
```json
{
  "success": true,
  "requestId": "export_hash_a3f2b1c9_1697395200000",
  "status": {
    "requestId": "export_hash_a3f2b1c9_1697395200000",
    "status": "pending",
    "progress": 0,
    "estimatedCompletion": "2025-10-15T12:05:00.000Z",
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  }
}
```

### Step 2: Background Export Processing

**Server job process**:
1. Status: pending → processing (progress: 10%)
2. Query analytics events (hashed user ID only)
3. Query experiment assignments (hashed user ID)
4. Query settings (exclude sensitive keys)
5. Generate JSON export with hashed IDs
6. Save to secure storage (S3, GCS, etc.)
7. Generate signed download URL (24-hour expiry)
8. Status: processing → ready (progress: 100%)

**Export Data Structure** (Example):
```json
{
  "exportInfo": {
    "requestId": "export_hash_a3f2b1c9_1697395200000",
    "timestamp": "2025-10-15T12:02:00.000Z",
    "userId": "hash_a3f2b1c9e4d5",
    "anonymized": true
  },
  "data": {
    "analytics": {
      "events": [
        {
          "eventName": "ai_panel_opened",
          "userId": "hash_a3f2b1c9e4d5",
          "cohortId": "cohort_42",
          "timestamp": 1697395200000,
          "platform": "ios"
        }
      ],
      "summary": {
        "totalEvents": 1247,
        "dateRange": {
          "start": "2025-07-15T00:00:00.000Z",
          "end": "2025-10-15T12:00:00.000Z"
        }
      }
    },
    "experiments": {
      "assignments": [
        {
          "experimentId": "onboarding_tips_v2",
          "variantId": "treatment",
          "assignedAt": 1697395200000
        }
      ]
    },
    "settings": {
      "preferences": {
        "theme": "dark",
        "fontSize": "medium"
      }
    }
  }
}
```

**Privacy Guarantees**:
- ✅ All user IDs are hashed (irreversible)
- ✅ No raw PII (emails, phones, etc.)
- ✅ No thoughtmark content or titles
- ✅ Cohort IDs only (k≥5)
- ✅ Settings exclude sensitive keys (API keys, passwords)

### Step 3: Client Polling

**Client polls every 5 seconds**:
```typescript
GET /api/privacy/export/{requestId}/status

Response:
{
  "status": "ready",
  "progress": 100,
  "downloadUrl": "/api/privacy/export/{requestId}/download?expires=1697481600000&signature=abc123",
  "expiresAt": "2025-10-16T12:00:00.000Z",
  "fileSize": 52480
}
```

**UI Updates**:
- "Export requested" → "Export ready (52 KB)"
- Download button appears

### Step 4: User Downloads Export

```
User action: Tap "Download Export"
```

**Client-side behavior**:
1. GET to signed download URL
2. Verify signature hasn't expired
3. Download JSON file
4. Save to device or show share sheet
5. Track download event: `engagement_data_export_downloaded`

**Server-side behavior**:
1. Verify URL signature and expiration
2. Verify user owns this export
3. Stream export file to client
4. Log download event
5. Optionally: Delete export file after first download

**Downloaded File**:
- Filename: `thoughtmarks-export-{requestId}.json`
- Format: JSON (pretty-printed)
- Size: Typically 10-500 KB
- Content: Hashed IDs only, no raw PII

### Expiration & Cleanup

**Export file lifecycle**:
- Created: When job status = "ready"
- Expiration: 24 hours after creation
- Auto-delete: After expiration or first download
- Storage: Secure cloud storage (encrypted at rest)

---

## Data Deletion

### User Flow

**Location**: Settings > Privacy > "Delete My Data"

### Step 1: User Initiates Deletion

```
User action: Tap "Delete My Data"
```

**First confirmation dialog**:
```
Title: "Confirm Data Deletion"

Message: "This will permanently delete all your analytics data, 
experiment assignments, and usage metrics. This action cannot be undone.

Your thoughtmarks and account will NOT be affected - only analytics 
data will be deleted.

Deletion will be completed within 30 days per GDPR/CCPA requirements."

Buttons: [Cancel] [Continue]
```

### Step 2: User Confirms Deletion

```
User action: Tap "Continue"
```

**Client-side behavior**:
1. POST to `/api/privacy/deletion`
2. Show success alert with 30-day SLA notice
3. Start polling for status updates

**Request Payload**:
```json
{
  "deleteAnalytics": true,
  "deleteExperiments": true,
  "deleteUserMetrics": true,
  "reason": "User-initiated deletion via settings"
}
```

**Server-side behavior**:
1. Validate auth token
2. Generate unique request ID: `deletion_{userId}_{timestamp}`
3. Calculate completion date: 30 days from now
4. Create deletion job with status "pending"
5. Return job status immediately
6. Process deletion in background

**Response**:
```json
{
  "success": true,
  "requestId": "deletion_hash_a3f2b1c9_1697395200000",
  "status": {
    "requestId": "deletion_hash_a3f2b1c9_1697395200000",
    "status": "pending",
    "scheduledCompletionDate": "2025-11-14T12:00:00.000Z",
    "progress": 0,
    "deletedRecords": {
      "events": 0,
      "experiments": 0,
      "metrics": 0,
      "total": 0
    },
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  }
}
```

### Step 3: Background Deletion Processing

**Server job process**:

#### Phase 1: Analytics Events Deletion (30% progress)
```sql
DELETE FROM analytics_events
WHERE user_id = 'hash_a3f2b1c9e4d5';
-- Returns: 1,247 rows deleted
```

#### Phase 2: Experiment Assignments Deletion (60% progress)
```sql
DELETE FROM experiment_assignments
WHERE user_id = 'hash_a3f2b1c9e4d5';
-- Returns: 12 rows deleted
```

#### Phase 3: User Metrics Deletion (80% progress)
```sql
DELETE FROM user_metrics
WHERE user_id = 'hash_a3f2b1c9e4d5';
-- Returns: 87 rows deleted
```

#### Phase 4: Cohort Aggregate Anonymization (90% progress)
```sql
UPDATE cohort_aggregates
SET user_id = MD5(user_id)
WHERE user_id = 'hash_a3f2b1c9e4d5';
-- Replaces user ID with hash in aggregates
```

#### Phase 5: Completion (100% progress)
- Status: processing → completed
- Record total deletions
- Send completion email to user
- Log completion event

### Step 4: Completion Notification

**Server sends email**:
```
Subject: Your Data Deletion Request is Complete

Hi there,

Your data deletion request (deletion_hash_a3f2b1c9_1697395200000) 
has been completed.

We've permanently deleted:
- 1,247 analytics events
- 12 experiment assignments
- 87 user metrics
- Total: 1,346 records

Cohort-level aggregates have been anonymized to remove your user ID.

Your thoughtmarks and account remain untouched.

Thank you for using Thoughtmarks.
```

### Step 5: Client Status Updates

**Client polls every 10 seconds**:
```typescript
GET /api/privacy/deletion/{requestId}/status

Response (processing):
{
  "status": "processing",
  "progress": 60,
  "deletedRecords": {
    "events": 1247,
    "experiments": 12,
    "metrics": 0,
    "total": 1259
  },
  "scheduledCompletionDate": "2025-11-14T12:00:00.000Z"
}

Response (completed):
{
  "status": "completed",
  "progress": 100,
  "deletedRecords": {
    "events": 1247,
    "experiments": 12,
    "metrics": 87,
    "total": 1346
  },
  "completedAt": "2025-10-15T12:10:00.000Z"
}
```

---

## Privacy Pipeline

### Data Flow Diagram

```
User Action
    ↓
┌─────────────────────────────────────────────────┐
│ CLIENT: Thoughtmark Created                     │
│ (content: "My private thought")                 │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ ANALYTICS EVENT: ai_thoughtmark_created         │
│                                                 │
│ Before Privacy Pipeline:                        │
│ {                                               │
│   eventName: "ai_thoughtmark_created",          │
│   userId: "user_12345",                         │
│   contentLength: 347,                           │
│   timestamp: 1697395200000                      │
│ }                                               │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ STEP 1: PII Redaction (DataRedactor)           │
│                                                 │
│ - No content or title included ✓                │
│ - No email/phone patterns ✓                     │
│ - Sensitive keys removed ✓                      │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ STEP 2: ID Hashing (DifferentialPrivacy)       │
│                                                 │
│ userId: "user_12345" → "hash_a3f2b1c9e4d5"      │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ STEP 3: Differential Privacy (Laplace ε=0.1)    │
│                                                 │
│ contentLength: 347 → 352 (+ noise ~5)           │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ STEP 4: Rounding (Precision Reduction)          │
│                                                 │
│ contentLength: 352 → 300 (nearest 100)          │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ STEP 5: Privacy Validation                      │
│                                                 │
│ - Check for unhashed IDs ✓                      │
│ - Check for PII patterns ✓                      │
│ - Check for sensitive keys ✓                    │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ FINAL EVENT (sent to analytics provider):       │
│                                                 │
│ {                                               │
│   eventName: "ai_thoughtmark_created",          │
│   userId: "hash_a3f2b1c9e4d5",                  │
│   cohortId: "cohort_42",                        │
│   contentLength: 300,                           │
│   timestamp: 1697395200000,                     │
│   platform: "ios"                               │
│ }                                               │
│                                                 │
│ Privacy Guarantees:                             │
│ ✓ No thoughtmark content                        │
│ ✓ Hashed user ID (irreversible)                 │
│ ✓ Cohort ID (k≥5)                               │
│ ✓ DP noise applied (ε=0.1)                      │
│ ✓ Rounded values (reduced precision)            │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ STORAGE: PostHog/Mixpanel                       │
│ Retention: 90 days (then auto-deleted)          │
└─────────────────────────────────────────────────┘
```

---

## Server Operations

### Export Job Implementation

**File**: `backend/src/routes/privacy.ts`

**Function**: `processExportJob()`

**Steps**:
1. Query analytics events for user (hashed ID)
2. Query experiment assignments for user
3. Query settings (exclude sensitive data)
4. Apply additional privacy filters
5. Generate JSON export
6. Calculate file size
7. Save to secure storage
8. Generate signed URL with 24-hour expiry
9. Update job status to "ready"

**SQL Queries**:
```sql
-- Analytics events (last 90 days)
SELECT 
  event_name,
  timestamp,
  properties
FROM analytics_events
WHERE user_id = 'hash_a3f2b1c9e4d5'
  AND timestamp >= NOW() - INTERVAL '90 days'
ORDER BY timestamp DESC;

-- Experiment assignments
SELECT 
  experiment_id,
  variant_id,
  assigned_at,
  exposure_count
FROM experiment_assignments
WHERE user_id = 'hash_a3f2b1c9e4d5';

-- Settings (exclude sensitive)
SELECT 
  key,
  value
FROM user_settings
WHERE user_id = 'hash_a3f2b1c9e4d5'
  AND key NOT IN ('api_key', 'password', 'token', 'secret');
```

### Deletion Job Implementation

**File**: `backend/src/jobs/retentionJob.ts`

**Function**: `processDeletionJob()`

**Steps**:
1. Delete analytics events
2. Delete experiment assignments
3. Delete user metrics
4. Anonymize cohort aggregates (replace user ID with hash)
5. Update job progress at each step
6. Send completion email
7. Mark job as completed

**SQL Queries**:
```sql
-- Delete analytics events
DELETE FROM analytics_events
WHERE user_id = 'hash_a3f2b1c9e4d5'
RETURNING id;

-- Delete experiment assignments
DELETE FROM experiment_assignments
WHERE user_id = 'hash_a3f2b1c9e4d5'
RETURNING id;

-- Delete user metrics
DELETE FROM user_metrics
WHERE user_id = 'hash_a3f2b1c9e4d5'
RETURNING id;

-- Anonymize cohort aggregates
UPDATE cohort_aggregates
SET user_id = MD5(user_id)
WHERE user_id = 'hash_a3f2b1c9e4d5'
RETURNING id;
```

### Retention Job (Scheduled)

**File**: `backend/src/jobs/retentionJob.ts`

**Schedule**: Daily at 2 AM UTC

**Cron**: `0 2 * * *`

**Function**: `runRetentionJob()`

**Steps**:
1. Calculate cutoff date (90 days ago)
2. Delete analytics events older than cutoff
3. Delete experiment assignments older than cutoff
4. Delete user metrics older than cutoff
5. Anonymize old cohort aggregates (replace user IDs with hashes)
6. Log deletion counts
7. Report to monitoring system

**SQL**:
```sql
-- Delete old analytics events (90+ days)
DELETE FROM analytics_events
WHERE timestamp < NOW() - INTERVAL '90 days'
RETURNING id;

-- Delete old experiment assignments (90+ days)
DELETE FROM experiment_assignments
WHERE assigned_at < NOW() - INTERVAL '90 days'
RETURNING id;

-- Delete old user metrics (90+ days)
DELETE FROM user_metrics
WHERE created_at < NOW() - INTERVAL '90 days'
RETURNING id;

-- Anonymize old cohort aggregates (90+ days)
UPDATE cohort_aggregates
SET user_id = MD5(user_id)
WHERE created_at < NOW() - INTERVAL '90 days'
  AND user_id NOT LIKE 'hash_%'
RETURNING id;
```

**Monitoring**:
- Log to: `/var/log/retention.log`
- Metrics: Records deleted, duration, errors
- Alerts: If errors exceed threshold or duration > 10 minutes

---

## Troubleshooting

### Issue: Analytics Not Disabling

**Symptoms**:
- Toggle is OFF but events still being sent
- Network requests to analytics provider visible

**Diagnosis**:
```typescript
// Check AsyncStorage preference
const pref = await AsyncStorage.getItem('@privacy_analytics_preference');
console.log('Stored preference:', pref);

// Check facade config
const config = analyticsFacade.getConfig();
console.log('Facade enabled:', config.enabled);

// Check queue
const status = analyticsFacade.getQueueStatus();
console.log('Queue size:', status.queueSize);
```

**Resolution**:
1. Verify AsyncStorage write succeeded
2. Check facade `updateConfig()` was called
3. Verify `config.enabled` is false
4. Clear queue manually if needed: `analyticsFacade.clearQueue()`
5. Restart app to reload config

### Issue: Export Stuck in "Processing"

**Symptoms**:
- Export request shows "processing" for > 5 minutes
- Progress never reaches 100%

**Diagnosis**:
```bash
# Check server logs
tail -f /var/log/privacy-api.log | grep export_

# Check job status in database
SELECT * FROM export_jobs 
WHERE request_id = 'export_...' 
ORDER BY updated_at DESC;
```

**Resolution**:
1. Check server error logs for exceptions
2. Verify database connection is healthy
3. Check storage service (S3, GCS) is accessible
4. Manually reprocess job or mark as failed
5. User can request new export

### Issue: Deletion Not Completing in 30 Days

**Symptoms**:
- Scheduled completion date passed
- Status still shows "processing"

**Diagnosis**:
```bash
# Check deletion job status
SELECT * FROM deletion_jobs 
WHERE request_id = 'deletion_...' 
AND scheduled_completion_date < NOW()
AND status != 'completed';

# Check deleted record counts
SELECT 
  deleted_records->>'total' as total_deleted
FROM deletion_jobs
WHERE request_id = 'deletion_...';
```

**Resolution**:
1. Check server error logs
2. Verify database queries completed
3. Manually complete deletion if safe
4. Send completion email manually
5. Update job status to "completed"

### Issue: Export Contains Raw PII

**Symptoms**:
- Export JSON contains unhashed IDs
- Export contains email addresses or other PII

**Diagnosis**:
```bash
# Run privacy audit on export
node scripts/privacy-audit.cjs

# Check export JSON manually
cat export_*.json | grep -E "email|phone|ssn"
```

**Resolution**:
1. **CRITICAL**: Stop all export generation immediately
2. Delete exposed export files
3. Fix export job to apply proper hashing
4. Run privacy-audit.cjs and ensure it passes
5. Re-generate exports for affected users
6. Notify affected users if PII was exposed

---

## Monitoring & Metrics

### Key Metrics to Track

**Export Operations**:
- Export requests per day
- Average processing time
- Success rate
- Download rate
- Expiration rate (exports not downloaded)

**Deletion Operations**:
- Deletion requests per day
- Average completion time
- Success rate
- Total records deleted per request

**Opt-Out Operations**:
- Opt-out rate (% of users)
- Re-enable rate
- Average opt-out duration

### Alerts

**Critical Alerts** (immediate action required):
- PII detected in export (run privacy-audit.cjs)
- Deletion SLA missed (>30 days without completion)
- Export generation fails > 3 times for same request

**Warning Alerts** (investigate within 24 hours):
- Export processing > 5 minutes
- Deletion processing > 1 hour
- Retention job fails to complete
- Analytics opt-out > 50% of users

---

## Testing & Validation

### Unit Tests

**File**: `src-nextgen/services/privacy/__tests__/PrivacyApiService.test.ts`

**Tests**:
- Analytics preference persistence
- Export request creation
- Export polling with timeout
- Deletion request creation
- Deletion polling with timeout
- Error handling for offline scenarios

### Integration Tests

**File**: `src-nextgen/__tests__/integration/PrivacyFlow.integration.test.ts`

**Tests**:
- Full export flow (request → poll → download)
- Full deletion flow (request → poll → completion)
- Opt-out disables tracking immediately
- Re-enable resumes tracking
- Experiments respect opt-out

### Manual Testing

**Checklist**:
- [ ] Toggle analytics OFF → no events in network tab
- [ ] Toggle analytics ON → events resume
- [ ] Request export → shows "pending"
- [ ] Export completes → download button appears
- [ ] Download export → JSON file saved
- [ ] Export JSON contains only hashed IDs
- [ ] Request deletion → shows "pending"
- [ ] Deletion shows 30-day SLA notice
- [ ] Deletion completes → confirmation shown

---

## Compliance Documentation

### GDPR Rights

| Right | Implementation | Access Point |
|-------|----------------|--------------|
| **Art. 15 - Access** | Data export with JSON download | Settings > Privacy > Export My Data |
| **Art. 16 - Rectification** | Settings update in-app | Settings screens |
| **Art. 17 - Erasure** | Data deletion with 30-day SLA | Settings > Privacy > Delete My Data |
| **Art. 18 - Restriction** | Analytics opt-out toggle | Settings > Privacy > Analytics toggle |
| **Art. 20 - Portability** | JSON export (standard format) | Settings > Privacy > Export My Data |
| **Art. 21 - Objection** | Analytics opt-out toggle | Settings > Privacy > Analytics toggle |

### CCPA Rights

| Right | Implementation | Access Point |
|-------|----------------|--------------|
| **Right to Know** | Privacy policy + in-app disclosure | Settings > Privacy |
| **Right to Delete** | Data deletion with 30-day SLA | Settings > Privacy > Delete My Data |
| **Right to Opt-Out** | Analytics toggle | Settings > Privacy > Analytics toggle |
| **No Sale** | We never sell user data | N/A (not applicable) |
| **No Discrimination** | App works fully with analytics disabled | N/A (always enforced) |

---

## API Endpoints

### Export Endpoints

```typescript
POST   /api/privacy/export
GET    /api/privacy/export/:requestId/status
GET    /api/privacy/export/:requestId/download
```

### Deletion Endpoints

```typescript
POST   /api/privacy/deletion
GET    /api/privacy/deletion/:requestId/status
```

### All endpoints require authentication via JWT token

---

## Environment Variables

### Required

```bash
# Download URL signing
DOWNLOAD_SECRET=<random-64-char-secret>

# Email notifications
SENDGRID_API_KEY=<api-key>
PRIVACY_EMAIL_FROM=privacy@thoughtmarks.app
```

### Optional

```bash
# Storage configuration
EXPORT_STORAGE_PROVIDER=s3  # or 'gcs', 'local'
EXPORT_STORAGE_BUCKET=thoughtmarks-exports
EXPORT_STORAGE_REGION=us-west-2

# Retention configuration
RETENTION_DAYS=90  # Default: 90 days
RETENTION_SCHEDULE=0 2 * * *  # Default: 2 AM UTC daily
```

---

## Operational Runbook

### Daily Operations

**2:00 AM UTC**: Retention job runs automatically
- Monitor logs: `/var/log/retention.log`
- Expected deletions: ~100-1000 records/day
- Expected duration: < 5 minutes

### Weekly Review

**Every Monday**: Review privacy metrics
- Export requests: Should be < 1% of active users
- Deletion requests: Should be < 0.1% of active users
- Opt-out rate: Should be < 10% of users
- SLA compliance: 100% deletions complete within 30 days

### Monthly Audit

**First Monday of Month**: Run privacy audit
```bash
# Audit codebase for PII leaks
node scripts/privacy-audit.cjs --verbose

# Verify no violations
# Expected: 0 violations found
```

**Review export samples**:
- Download 5 random exports
- Verify only hashed IDs present
- Verify no thoughtmark content
- Verify no raw PII

---

## Emergency Procedures

### PII Leak Detected

**If raw PII found in analytics data**:

1. **IMMEDIATE** (within 1 hour):
   - Stop all export generation
   - Stop all analytics collection
   - Notify privacy team and legal

2. **URGENT** (within 4 hours):
   - Identify scope of leak (how many users, how much data)
   - Delete all affected exports from storage
   - Run privacy-audit.cjs to find source
   - Fix privacy pipeline bug
   - Deploy fix to production

3. **REQUIRED** (within 24 hours):
   - Notify affected users (email)
   - File breach report (if required by law)
   - Document incident in audit log
   - Implement additional safeguards

4. **FOLLOW-UP** (within 7 days):
   - Review all privacy protections
   - Add additional CI checks
   - Conduct security audit
   - Update privacy policy if needed

---

## Support & Escalation

### User Requests

**Export delays** (>10 minutes):
- Check server logs for errors
- Manually trigger export job
- Notify user via email when ready

**Deletion delays** (>30 days):
- Check deletion job status
- Manually complete deletion if safe
- Send completion confirmation
- Log incident for review

**Opt-out not working**:
- Verify AsyncStorage write succeeded
- Check facade configuration
- Clear event queue manually
- Recommend app restart

### Contact

**Privacy Officer**: privacy@thoughtmarks.app  
**Technical Support**: support@thoughtmarks.app  
**Emergency**: +1-XXX-XXX-XXXX (24/7 oncall)

---

**STATUS**: ✅ **OPERATIONAL RUNBOOK COMPLETE**  
**COMPLIANCE**: ✅ **GDPR, CCPA, App Store Requirements**  
**PRIVACY GUARANTEES**: ✅ **ε=0.1 DP, k≥5 Anonymity, Hashed IDs Only**  
**USER CONTROL**: ✅ **Full Export, Deletion, Opt-Out**

---

**END OF USER RIGHTS OPERATIONS DOCUMENTATION**

