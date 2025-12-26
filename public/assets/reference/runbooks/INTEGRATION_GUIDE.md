# Reliability Infrastructure Integration Guide

**Version**: 1.0.0  
**Last Updated**: 2025-10-15  
**Status**: Post-Implementation Integration

---

## Overview

This guide provides step-by-step instructions for integrating real data sources with the reliability infrastructure implemented in P7 Slice-13.

---

## 1. Configure Crashlytics (Crash-Free Rate SLO)

### Prerequisites
- Firebase/Crashlytics account
- App registered in Firebase Console
- Crashlytics SDK installed (already in dependencies)

### Integration Steps

#### A. Get Crashlytics API Credentials
```bash
# From Firebase Console:
# 1. Go to Project Settings → Service Accounts
# 2. Generate new private key
# 3. Save as crashlytics-service-account.json

# Store in 1Password SecretKeeper vault:
op item create \
  --category=API-Credential \
  --title="Crashlytics Service Account" \
  --vault=SecretKeeper \
  credential[file]=./crashlytics-service-account.json
```

#### B. Add Environment Variables
```bash
# .env.production (not committed, local only)
CRASHLYTICS_PROJECT_ID=your-firebase-project-id
CRASHLYTICS_API_KEY_OP_REF="op://SecretKeeper/Crashlytics Service Account/credential"
```

#### C. Update Error Budget Calculator
Edit `scripts/reliability/error-budget.cjs`:

```javascript
// Replace calculateCrashFreeRate() with:
async function calculateCrashFreeRate() {
  const projectId = process.env.CRASHLYTICS_PROJECT_ID;
  const apiKey = await loadFromOnePassword(process.env.CRASHLYTICS_API_KEY_OP_REF);
  
  // Query Crashlytics API for last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const response = await fetch(
    `https://firebasecrashlytics.googleapis.com/v1/projects/${projectId}/apps/-/crashFreeRate?startTime=${sevenDaysAgo.toISOString()}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  
  return {
    crashFreePercent: data.crashFreeRate * 100,
    totalSessions: data.totalSessions,
    crashFreeSessions: data.crashFreeSessions,
    crashedSessions: data.crashedSessions,
    source: 'crashlytics',
    note: null
  };
}
```

### Testing
```bash
# Test Crashlytics integration
node scripts/reliability/error-budget.cjs

# Should show:
# Crash-Free Rate: XX.XX% (target: 99.5%) ✅
#   Source: crashlytics
```

---

## 2. Configure Backend Health Endpoints

### Prerequisites
- Backend API deployed
- Health endpoint routes implemented

### Required Endpoints

#### A. Main Health Endpoint
```
GET /health
Response: { "status": "healthy", "timestamp": "ISO-8601" }
```

#### B. Service-Specific Health
```
GET /api/v1/auth/status
Response: { "available": true, "latencyMs": 50 }

GET /api/v1/search/status
Response: { "available": true, "latencyMs": 30 }

GET /api/v1/sync/status  
Response: { "available": true, "latencyMs": 40, "queueDepth": 120 }
```

### Environment Configuration

```bash
# .env.staging
API_BASE_URL=https://staging-api.thoughtmarks.com

# .env.production
API_BASE_URL=https://api.thoughtmarks.com
```

### Testing Synthetic Monitors

```bash
# Test against staging
export API_BASE_URL=https://staging-api.thoughtmarks.com
node scripts/synthetics/check-auth.js
node scripts/synthetics/check-search.js
node scripts/synthetics/check-sync.js

# Test against production
export API_BASE_URL=https://api.thoughtmarks.com
node scripts/synthetics/check-auth.js
```

### CI Configuration

Update `.github/workflows/ci-synthetics.yml` secrets:

```yaml
# Add to GitHub Secrets:
# SYNTHETIC_AUTH_TOKEN - Auth token for health check endpoints
# STAGING_API_URL - Staging API base URL
# PROD_API_URL - Production API base URL
```

---

## 3. Set Up Notification Channels

### A. Slack Integration

#### Prerequisites
- Slack workspace admin access
- #alerts-reliability channel created

#### Steps

1. **Create Slack App**
   - Go to https://api.slack.com/apps
   - Create new app "Thoughtmarks Reliability Bot"
   - Add OAuth scope: `chat:write`
   - Install to workspace

2. **Get Webhook URL**
   ```bash
   # Store in 1Password
   op item create \
     --category=API-Credential \
     --title="Slack Reliability Webhook" \
     --vault=SecretKeeper \
     webhook_url[concealed]="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
   ```

3. **Add to CI Workflows**
   
   Update `.github/workflows/ci-synthetics.yml`:
   ```yaml
   - name: Notify Slack on failure
     if: steps.aggregate.outputs.failed_checks != '0'
     run: |
       curl -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
         -H 'Content-Type: application/json' \
         -d '{
           "text": "🚨 Synthetic monitors failing",
           "blocks": [{
             "type": "section",
             "text": {
               "type": "mrkdwn",
               "text": "*Synthetic Monitor Alert*\n\nFailed: ${{ steps.aggregate.outputs.failed_checks }}\nTotal: ${{ steps.aggregate.outputs.total_checks }}"
             }
           }]
         }'
   ```

### B. PagerDuty Integration

#### Prerequisites
- PagerDuty account
- Service created for "Thoughtmarks Mobile App"

#### Steps

1. **Get Integration Key**
   - Go to PagerDuty → Services → Thoughtmarks Mobile App
   - Add integration → Events API v2
   - Copy integration key

2. **Store in 1Password**
   ```bash
   op item create \
     --category=API-Credential \
     --title="PagerDuty Integration Key" \
     --vault=SecretKeeper \
     integration_key[concealed]="YOUR_INTEGRATION_KEY"
   ```

3. **Add to CI Workflows**
   
   Create helper script `scripts/notifications/pagerduty-alert.cjs`:
   ```javascript
   const https = require('https');
   
   const INTEGRATION_KEY = process.env.PAGERDUTY_INTEGRATION_KEY;
   const SEVERITY = process.argv[2] || 'error';
   const SUMMARY = process.argv[3] || 'Alert from Thoughtmarks';
   
   const payload = {
     routing_key: INTEGRATION_KEY,
     event_action: 'trigger',
     payload: {
       summary: SUMMARY,
       severity: SEVERITY,
       source: 'github-actions',
       custom_details: {
         workflow: process.env.GITHUB_WORKFLOW,
         run_url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
       }
     }
   };
   
   // Send to PagerDuty Events API
   const req = https.request({
     hostname: 'events.pagerduty.com',
     path: '/v2/enqueue',
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     }
   }, (res) => {
     console.log(`PagerDuty alert sent: ${res.statusCode}`);
   });
   
   req.write(JSON.stringify(payload));
   req.end();
   ```

### C. Email Notifications

#### Configure SendGrid (Already Available)

1. **Use Existing SendGrid Integration**
   - SendGrid API key already in SecretKeeper vault
   - Email templates already configured

2. **Create Reliability Alert Template**
   
   Template ID: `reliability-alert-template`
   
   Subject: `🚨 Reliability Alert: {{alert_type}}`
   
   Body:
   ```html
   <h2>{{alert_type}}</h2>
   <p><strong>Severity:</strong> {{severity}}</p>
   <p><strong>Time:</strong> {{timestamp}}</p>
   <p><strong>Details:</strong> {{details}}</p>
   <p><strong>Action Required:</strong> {{action_required}}</p>
   <hr>
   <p><a href="{{runbook_url}}">View Runbook</a> | <a href="{{incident_url}}">Incident Details</a></p>
   ```

3. **Add Email Notification Step to CI**
   ```yaml
   - name: Send email alert
     if: steps.aggregate.outputs.failed_checks != '0'
     run: |
       node scripts/notifications/sendgrid-alert.cjs \
         --template reliability-alert-template \
         --to oncall@thoughtmarks.com \
         --severity P1 \
         --details "Synthetic monitors failing"
   ```

---

## 4. Test Synthetic Monitors Against Staging

### Staging Environment Setup

1. **Deploy Backend to Staging**
   ```bash
   # Ensure staging backend is running
   # Verify health endpoints are accessible
   curl https://staging-api.thoughtmarks.com/health
   ```

2. **Configure Staging Synthetic Checks**
   ```bash
   # Test each synthetic monitor
   export API_BASE_URL=https://staging-api.thoughtmarks.com
   export SYNTHETIC_AUTH_TOKEN="staging_synthetic_token"
   
   node scripts/synthetics/check-auth.js
   node scripts/synthetics/check-search.js
   node scripts/synthetics/check-sync.js
   ```

3. **Expected Results**
   ```
   ✅ Auth health check PASSED
   ✅ Search health check PASSED  
   ✅ Sync health check PASSED
   
   Or acceptable failures:
   ⚠️ 401 Unauthorized (service up, just needs auth)
   ⚠️ 404 Not Found (endpoint not implemented yet)
   ```

4. **Validate CI Workflow**
   ```bash
   # Trigger manual workflow run against staging
   # GitHub Actions → ci-synthetics.yml → Run workflow
   # Input: target = staging
   
   # Check artifacts
   # Should produce: synthetic-{auth,search,sync}-results artifacts
   ```

### Production Environment Testing

1. **Production Readiness Checklist**
   - [ ] All backend health endpoints implemented
   - [ ] Auth token for synthetic checks generated
   - [ ] Rate limiting configured to allow synthetic traffic
   - [ ] Monitoring dashboard configured

2. **Gradual Rollout**
   ```bash
   # Week 1: Manual runs only
   node scripts/synthetics/check-*.js
   
   # Week 2: Scheduled runs every 15 minutes
   # Update ci-synthetics.yml cron: */15 * * * *
   
   # Week 3: Full cadence (every 5 minutes)
   # Update ci-synthetics.yml cron: */5 9-18 * * 1-5
   ```

---

## 5. Initialize NetworkService in App Startup

### Critical Fix (Already Applied in HttpClient)

The HttpClient now gracefully handles uninitialized NetworkService, but for optimal offline detection:

#### Update App.tsx or Root Component

```typescript
import { networkService } from './src-nextgen/services/network/NetworkService';

// In app initialization (useEffect or App constructor)
useEffect(() => {
  async function initializeServices() {
    // Initialize network service
    await networkService.initialize();
    
    // Other service initialization...
  }
  
  initializeServices();
}, []);
```

#### Or in AppServicesContext

```typescript
// src-nextgen/context/AppServicesContext.tsx

useEffect(() => {
  const initServices = async () => {
    await networkService.initialize();
    // ... other services
  };
  
  initServices();
}, []);
```

---

## 6. Monitor and Tune

### Week 1: Baseline Collection
- Run all synthetic monitors manually
- Collect baseline latency and availability
- Adjust SLO targets if needed
- Tune circuit breaker thresholds

### Week 2: Automated Monitoring
- Enable scheduled synthetic runs
- Monitor error budget consumption
- Review weekly reliability reports
- Conduct runbook drills

### Week 3: Auto-Remediation
- Enable deploy guard workflow
- Test auto-rollback in staging
- Configure kill switches
- Full end-to-end validation

### Week 4: Production Deployment
- All real data sources connected
- All notification channels configured
- Team trained on runbooks
- On-call rotation established

---

## Quick Start Commands

```bash
# Test synthetic monitors locally
export API_BASE_URL=https://staging-api.thoughtmarks.com
node scripts/synthetics/check-auth.js
node scripts/synthetics/check-search.js
node scripts/synthetics/check-sync.js

# Calculate error budget
node scripts/reliability/error-budget.cjs

# Generate weekly report
node scripts/reports/weekly-reliability.cjs

# Test auto-rollback (dry-run)
node scripts/deploy/auto-rollback.cjs --dry-run

# Initialize network service in app
# Add to App.tsx or root component:
# await networkService.initialize();
```

---

## Troubleshooting

### Synthetic Monitors Failing

**Issue**: All checks returning 401 Unauthorized

**Solution**: Configure SYNTHETIC_AUTH_TOKEN in CI secrets and .env

**Issue**: Connection timeouts

**Solution**: Check API_BASE_URL is correct and backend is running

### Error Budget Always 100%

**Issue**: No real data sources connected yet

**Solution**: This is expected. Follow integration steps above.

### Auto-Rollback Not Working

**Issue**: "No release tags found"

**Solution**: Create initial release tag: `git tag v1.0.0`

---

## Next Review

**Date**: 2025-10-22 (1 week)  
**Agenda**: Review integration progress, baseline SLI data, tune thresholds  
**Owner**: Platform Reliability Team

