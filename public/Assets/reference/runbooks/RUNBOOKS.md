# Incident Response Runbooks

**Version**: 1.0.0  
**Last Updated**: 2025-10-15  
**Owner**: Platform Reliability Team

---

## Purpose

This document provides step-by-step procedures for responding to common incidents affecting the Thoughtmarks mobile application and backend services. Each runbook includes detection signals, immediate mitigation steps, verification procedures, rollback plans, and communication templates.

---

## General Incident Response Protocol

### Severity Levels

- **P0 (Critical)**: Complete service outage, data loss, security breach
- **P1 (High)**: Major feature degradation, elevated error rates, SLO breach imminent
- **P2 (Medium)**: Partial degradation, SLO at risk, performance issues
- **P3 (Low)**: Minor issues, monitoring alerts, potential future problems

### Response Timeline

| Severity | Acknowledgment | Initial Response | Update Frequency |
|----------|----------------|------------------|------------------|
| P0 | 5 minutes | 15 minutes | Every 30 minutes |
| P1 | 15 minutes | 30 minutes | Every hour |
| P2 | 30 minutes | 2 hours | Every 4 hours |
| P3 | 2 hours | 8 hours | Daily |

### Incident Roles

- **Incident Commander**: Coordinates response, makes rollback decisions
- **On-Call Engineer**: Primary responder, executes runbook steps
- **Communications Lead**: Stakeholder updates, user communication
- **Subject Matter Expert**: Domain expertise (auth, search, AI, etc.)

---

## Runbook 1: Authentication Service Down

### Detection Signals

- Synthetic monitor `check-auth.js` failing consistently (3+ consecutive failures)
- Circuit breaker OPEN for auth endpoints
- Spike in `auth.signin.failed` or `auth.signup.failed` events
- User reports of sign-in failures
- Backend health endpoint `/api/v1/auth/status` returning 503

### Immediate Mitigation

1. **Verify Scope** (2 minutes)
   ```bash
   # Check auth synthetic monitor
   node scripts/synthetics/check-auth.js
   
   # Check auth circuit breaker status
   # (would query circuit breaker stats endpoint)
   
   # Check recent deployments
   git log --oneline -10
   ```

2. **Activate Kill Switch** (1 minute)
   ```bash
   # Option A: Update runtime flags
   # Edit configs/flags/runtime-flags.json
   # Set "auth.signIn": { "killSwitch": true }
   # Deploy updated config
   
   # Option B: Backend feature flag
   # Update backend remote config to disable new signups
   ```

3. **Enable Fallback Mode** (2 minutes)
   - Display "Sign in temporarily unavailable" message
   - Allow cached/offline access for existing sessions
   - Queue sign-in attempts for retry when service recovers

4. **Check Dependencies** (3 minutes)
   ```bash
   # Check database connectivity
   # Check Redis/session store
   # Check external auth providers (Apple Sign-In, OAuth)
   # Review recent schema migrations
   ```

### Verification

- [ ] Auth synthetic monitor passing
- [ ] Circuit breaker transitions to HALF-OPEN then CLOSED
- [ ] Sign-in success rate returns to >99%
- [ ] No spike in error events
- [ ] Backend health endpoint returns 200

### Rollback Steps

If recent deployment caused the issue:

```bash
# Dry run first
node scripts/deploy/auto-rollback.cjs --dry-run --reason "Auth service outage"

# Execute rollback
node scripts/deploy/auto-rollback.cjs --reason "Auth service outage"

# Verify auth service recovered
node scripts/synthetics/check-auth.js
```

### Communication Template

**Internal (Slack #incidents)**:
```
🚨 P0 INCIDENT: Auth Service Down

Status: Investigating
Impact: Users cannot sign in or sign up
Started: [TIME]
Incident Commander: [NAME]

Current actions:
- Kill switch activated
- Investigating root cause
- Monitoring service recovery

Updates: Every 30 minutes
```

**User-Facing (Status Page)**:
```
We're experiencing issues with sign-in. 
Our team is working to resolve this quickly.
Existing sessions are not affected.
```

---

## Runbook 2: Search Service Degraded

### Detection Signals

- Search latency P95 exceeds 120ms target (trending toward 500ms+)
- Synthetic monitor `check-search.js` showing elevated latency
- Circuit breaker for search endpoints in HALF-OPEN state
- User reports of slow search
- Spike in `search.timeout` events

### Immediate Mitigation

1. **Verify Scope** (2 minutes)
   ```bash
   # Check search synthetic monitor
   node scripts/synthetics/check-search.js
   
   # Check error budget
   node scripts/reliability/error-budget.cjs
   ```

2. **Enable Search Fallback** (3 minutes)
   - Switch to simplified search (local-only, no semantic ranking)
   - Disable typo tolerance temporarily
   - Reduce search result limit
   - Cache recent popular searches

3. **Check Infrastructure** (5 minutes)
   ```bash
   # Check search index health
   # Check database query performance
   # Review recent index updates
   # Check for N+1 query patterns
   ```

4. **Scale Resources** (if infrastructure issue)
   - Increase database connection pool
   - Scale search service replicas
   - Enable query caching
   - Optimize slow queries

### Verification

- [ ] Search latency P95 returns to <120ms
- [ ] Circuit breaker CLOSED
- [ ] Search success rate >99.5%
- [ ] No timeout events
- [ ] User complaints cease

### Rollback Steps

If recent search optimization caused regression:

```bash
# Revert search changes
git revert <commit-hash> --no-edit

# Or full rollback
node scripts/deploy/auto-rollback.cjs --reason "Search performance degradation"
```

### Communication Template

**Internal**:
```
⚠️ P1 INCIDENT: Search Performance Degraded

Status: Mitigating
Impact: Search slower than normal (not failing)
Started: [TIME]
IC: [NAME]

Mitigation: Simplified search mode enabled
ETA: Investigating, updates every hour
```

---

## Runbook 3: Sync Service Backlog

### Detection Signals

- Sync queue depth >10,000 items
- Synthetic monitor `check-sync.js` showing elevated latency
- Circuit breaker for sync endpoints approaching threshold
- User reports of delayed sync
- Spike in `sync.queue.overflow` events

### Immediate Mitigation

1. **Assess Backlog** (3 minutes)
   ```bash
   # Check sync synthetic monitor
   node scripts/synthetics/check-sync.js
   
   # Check queue depth (would query backend)
   # Check conflict rate
   # Check sync failure rate
   ```

2. **Throttle Incoming Load** (2 minutes)
   - Rate limit sync requests per user
   - Batch smaller updates
   - Defer non-critical syncs
   - Prioritize user-initiated actions

3. **Scale Processing** (5 minutes)
   - Increase sync worker replicas
   - Parallelize batch operations
   - Optimize database writes
   - Enable write batching

4. **Check for Conflicts** (3 minutes)
   - Review conflict resolution logs
   - Check for stuck operations
   - Verify queue consumers are healthy
   - Check for deadlocks

### Verification

- [ ] Queue depth dropping consistently
- [ ] Sync latency returning to normal
- [ ] No stuck operations
- [ ] Conflict rate normal
- [ ] Circuit breaker CLOSED

### Rollback Steps

If recent sync logic change caused backlog:

```bash
# Disable problematic feature
# Update configs/flags/runtime-flags.json
# Set "sync.auto": { "killSwitch": true }

# Or rollback
node scripts/deploy/auto-rollback.cjs --reason "Sync backlog"
```

### Communication Template

**Internal**:
```
⚠️ P2 INCIDENT: Sync Queue Backlog

Status: Mitigating
Impact: Sync delays, users may see stale data
Queue Depth: [NUMBER] items
Started: [TIME]

Actions:
- Scaling sync workers
- Rate limiting enabled
- Monitoring queue drain rate
```

---

## Runbook 4: Vendor Analytics Outage

### Detection Signals

- Mixpanel/analytics vendor API returning 503 or timeout errors
- Spike in `analytics.failed` events
- Event pipeline loss >1% (SLO breach)
- Circuit breaker OPEN for analytics endpoint

### Immediate Mitigation

1. **Verify Vendor Status** (1 minute)
   - Check vendor status page (status.mixpanel.com, etc.)
   - Check vendor API health
   - Review vendor incident reports

2. **Enable Local Queueing** (2 minutes)
   - Queue events locally in AsyncStorage
   - Set max queue size (prevent memory issues)
   - Enable retry with exponential backoff
   - Monitor queue depth

3. **Switch to Backup Analytics** (5 minutes)
   - Route critical events to backup analytics backend
   - Log events to file for later replay
   - Maintain minimum telemetry for debugging

4. **Disable Non-Critical Events** (2 minutes)
   ```javascript
   // Update runtime flags
   // Disable non-critical event tracking
   // Keep security/error events only
   ```

### Verification

- [ ] Vendor API recovered (returning 200)
- [ ] Event queue draining successfully
- [ ] Event pipeline loss <1%
- [ ] Circuit breaker CLOSED
- [ ] No client-side queue overflow

### Rollback Steps

Not applicable - vendor outage, not code issue. Focus on resilience:

```bash
# Ensure graceful degradation
# Verify offline queueing works
# Test event replay after recovery
```

### Communication Template

**Internal**:
```
ℹ️ P3 INCIDENT: Analytics Vendor Outage

Status: Monitoring
Impact: Event delivery delayed, no user impact
Vendor: [NAME]
Vendor Status: [LINK]

Mitigation: Local queueing enabled
Will replay events when vendor recovers
```

---

## Runbook 5: App Store In-App Purchase Issues

### Detection Signals

- Spike in `billing.purchase.failed` events
- User reports of purchase failures
- StoreKit receipt validation failures
- Circuit breaker OPEN for IAP endpoints
- App Store Connect showing service issues

### Immediate Mitigation

1. **Verify Scope** (2 minutes)
   - Check App Store Connect status
   - Review recent IAP configuration changes
   - Check StoreKit sandbox status
   - Review receipt validation logs

2. **Enable Purchase Retry** (2 minutes)
   - Queue failed purchases for automatic retry
   - Display "Purchase processing" message to users
   - Enable receipt refresh
   - Extend transaction timeout

3. **Check Backend Integration** (3 minutes)
   ```bash
   # Check receipt validation service
   # Check subscription status API
   # Review entitlement service logs
   # Verify App Store server notifications
   ```

4. **Provide Manual Recovery** (5 minutes)
   - Add "Restore Purchases" prominent button
   - Guide users to retry purchase
   - Collect failed transaction IDs for support
   - Enable manual entitlement grants (emergency only)

### Verification

- [ ] Purchase success rate >99%
- [ ] Receipt validation succeeding
- [ ] App Store Connect showing no issues
- [ ] Circuit breaker CLOSED
- [ ] No purchase-related support tickets

### Rollback Steps

If recent IAP changes caused issue:

```bash
# Disable new IAP features
# Update configs/flags/runtime-flags.json
# Set "iap.subscriptions": { "killSwitch": true }

# Or rollback to previous IAP implementation
git revert <iap-commit> --no-edit
```

### Communication Template

**Internal**:
```
🚨 P1 INCIDENT: IAP Purchase Failures

Status: Investigating
Impact: Users cannot purchase subscriptions
Started: [TIME]
App Store Status: [LINK]

Actions:
- Investigating App Store vs app issue
- Retry logic enabled
- Collecting failed transaction IDs
```

**User-Facing**:
```
We're aware of an issue preventing some purchases from completing.
Please try again in a few minutes, or use "Restore Purchases" if you were charged.
No charges will be lost - all purchases are protected by App Store.
```

---

## Runbook 6: Elevated Crash Rate

### Detection Signals

- Crash-free sessions <99.5% (SLO breach)
- Crashlytics/Sentry showing spike in crashes
- Specific crash signature affecting multiple users
- Circuit breaker for crash-prone features

### Immediate Mitigation

1. **Identify Crash Pattern** (5 minutes)
   - Review Crashlytics dashboard
   - Identify common crash signature
   - Determine affected OS versions/devices
   - Find triggering user action

2. **Disable Crashing Feature** (2 minutes)
   ```bash
   # Update runtime flags
   # Disable feature causing crashes
   # Example: AI recommendations, voice recording, etc.
   ```

3. **Deploy Hot-Fix** (if root cause identified)
   ```bash
   # Create hot-fix branch
   git checkout -b hotfix/crash-fix-<issue>
   
   # Implement fix with targeted code edit
   # No bulk changes, surgical edit only
   
   # Test fix locally
   # Deploy with ROLL-FORWARD-WAIVER label
   ```

4. **Monitor Crash Rate** (ongoing)
   - Watch crash-free sessions metric
   - Monitor error budget consumption
   - Track feature disable effectiveness

### Verification

- [ ] Crash-free sessions returns to >99.5%
- [ ] New crashes with same signature stop occurring
- [ ] Error budget stabilizes
- [ ] Hot-fix deployed successfully (if applicable)

### Rollback Steps

```bash
# Immediate rollback
node scripts/deploy/auto-rollback.cjs --force --reason "Elevated crash rate"

# Verify crash rate improves
# Wait 1 hour, check Crashlytics
```

### Communication Template

**Internal**:
```
🔴 P0 INCIDENT: Elevated Crash Rate

Status: Mitigating
Impact: App crashes affecting X% of users
Crash Signature: [SIGNATURE]
Affected: iOS/Android [VERSION]
Started: [TIME]

Mitigation: Feature disabled via kill-switch
Root Cause: Investigating
ETA: Hot-fix in 2 hours
```

---

## Runbook 7: API Rate Limiting Triggered

### Detection Signals

- Backend returning 429 (Too Many Requests)
- Circuit breaker trips due to rate limit errors
- Spike in `api.rate_limit` events
- Legitimate user traffic appears throttled

### Immediate Mitigation

1. **Distinguish Attack vs Legitimate Traffic** (3 minutes)
   - Review request patterns
   - Check for single-user spam
   - Identify bot traffic
   - Verify client retry logic not in loop

2. **Adjust Rate Limits** (5 minutes)
   - Temporarily increase rate limits (if legitimate)
   - Implement stricter limits for suspicious IPs
   - Enable IP-based throttling
   - Whitelist known good clients

3. **Fix Client Retry Loops** (if client issue)
   - Check for infinite retry loops
   - Verify exponential backoff working
   - Ensure circuit breaker respecting rate limits
   - Add jitter to retries

4. **Scale Backend** (if capacity issue)
   - Increase API server replicas
   - Enable request queuing
   - Add caching layer
   - Optimize expensive endpoints

### Verification

- [ ] Rate limit errors cease
- [ ] Circuit breaker CLOSED
- [ ] Normal traffic patterns resume
- [ ] No client retry loops detected

### Rollback Steps

Not applicable - usually configuration or scaling issue

### Communication Template

**Internal**:
```
⚠️ P2 INCIDENT: API Rate Limiting

Status: Investigating
Impact: Some API requests being throttled
Cause: [Traffic spike / Attack / Bug]

Actions:
- Analyzing traffic patterns
- Adjusting rate limits
- Scaling if needed
```

---

## Runbook 8: Database Migration Failure

### Detection Signals

- App crashes on startup after deployment
- Database schema errors in logs
- Rollback migration failures
- Data inconsistency reports

### Immediate Mitigation

1. **Stop New Deployments** (immediate)
   ```bash
   # Halt all deployment pipelines
   # Prevent additional users from upgrading
   ```

2. **Assess Impact** (5 minutes)
   - Check how many users affected
   - Verify data integrity
   - Check if migration partially applied
   - Review migration script

3. **Execute Rollback Migration** (10 minutes)
   ```bash
   # Run rollback migration
   # Verify schema reverted successfully
   # Check data consistency
   # Test app functionality
   ```

4. **Rollback App Version** (if migration can't be reverted)
   ```bash
   node scripts/deploy/auto-rollback.cjs --force --reason "Migration failure"
   ```

### Verification

- [ ] App launches successfully
- [ ] No schema errors in logs
- [ ] Data integrity verified
- [ ] Migration rolled back cleanly
- [ ] All CRUD operations working

### Rollback Steps

```bash
# Execute migration rollback
drizzle-kit rollback

# Or full app rollback
node scripts/deploy/auto-rollback.cjs --force --reason "Migration failure"

# Verify database state
# Test all database operations
```

### Communication Template

**Internal**:
```
🔴 P0 INCIDENT: Database Migration Failure

Status: Rolling back
Impact: App crashes on startup for users who upgraded
Affected Users: [ESTIMATE]

Actions:
- Migration rollback in progress
- App version rollback initiated
- Preventing new upgrades

Critical: Do not deploy until resolved
```

---

## Runbook 9: Memory Leak / OOM Crashes

### Detection Signals

- Increasing crash rate with OOM signature
- Memory usage trending upward
- Crashes after extended app usage
- Specific feature causes memory spike

### Immediate Mitigation

1. **Identify Memory Leak Source** (10 minutes)
   - Review recent code changes
   - Check for event listener leaks
   - Identify growing data structures
   - Profile memory usage in development

2. **Deploy Mitigation** (varies)
   - Add periodic cleanup/garbage collection
   - Limit cache sizes
   - Remove circular references
   - Unsubscribe from listeners properly

3. **Temporary Workarounds** (5 minutes)
   - Reduce cache TTL
   - Limit concurrent operations
   - Clear caches more frequently
   - Prompt user to restart app

4. **Hot-Fix or Rollback**
   ```bash
   # If fix ready
   git checkout -b hotfix/memory-leak
   # Implement fix
   # Deploy with testing
   
   # If no quick fix
   node scripts/deploy/auto-rollback.cjs --reason "Memory leak causing OOM"
   ```

### Verification

- [ ] Memory usage stable over extended session
- [ ] No OOM crashes in new sessions
- [ ] Memory profiling shows flat usage
- [ ] Crash-free sessions >99.5%

### Rollback Steps

```bash
# Identify commit that introduced leak
git bisect start
git bisect bad HEAD
git bisect good <last-good-tag>

# Once found, revert
git revert <bad-commit> --no-edit
```

### Communication Template

**Internal**:
```
🔴 P0 INCIDENT: Memory Leak Causing Crashes

Status: Investigating
Impact: App crashes after extended usage
Pattern: [DESCRIPTION]

Actions:
- Identifying leak source
- Preparing hot-fix
- May need rollback if no quick fix
```

---

## Runbook 10: Error Budget Exhausted

### Detection Signals

- Error budget calculator shows <10% remaining
- Projected monthly SLO breach
- Multiple SLOs failing simultaneously
- High burn rate (>14.4×) sustained

### Immediate Mitigation

1. **Emergency Assessment** (5 minutes)
   ```bash
   # Run error budget calculation
   node scripts/reliability/error-budget.cjs
   
   # Review all SLO compliance
   # Identify primary contributor to budget consumption
   ```

2. **Stop the Bleeding** (10 minutes)
   - Halt all non-critical deployments
   - Activate kill switches for unstable features
   - Focus on highest-impact SLO (usually availability or crashes)
   - Execute emergency rollback if needed

3. **Triage by Impact** (15 minutes)
   - Rank issues by error budget consumption
   - Fix highest-impact issues first
   - Defer low-impact improvements
   - Focus on SLO restoration

4. **Implement Circuit Breakers** (if not already)
   - Enable automatic feature disabling
   - Set aggressive circuit breaker thresholds
   - Monitor burn rate improvements

### Verification

- [ ] Burn rate <3.0× (slow burn threshold)
- [ ] Error budget consumption slowing
- [ ] Critical SLOs stabilizing
- [ ] Projected monthly compliance >10%

### Rollback Steps

```bash
# Immediate rollback to last green release
node scripts/deploy/auto-rollback.cjs --force --reason "Error budget exhausted"

# Monitor budget recovery
# Wait 24 hours before new deploy
```

### Communication Template

**Internal**:
```
🔴 P0 INCIDENT: Error Budget Exhausted

Status: Emergency response
Budget Remaining: <10%
Burn Rate: [NUMBER]×
SLOs Failing: [LIST]

Actions:
- All non-critical deploys STOPPED
- Emergency rollback in progress
- Focusing on critical SLO restoration

Next Deploy: Not before budget recovers to >50%
```

**Leadership**:
```
Critical reliability issue detected.
Our automated systems have triggered emergency protocols.
Error budget exhausted, rolling back to stable release.
Expect service stabilization within [TIMEFRAME].
Will conduct postmortem and prevention plan.
```

---

## Post-Incident Procedures

### Immediate Post-Resolution (Within 24 hours)

1. **Verify Stability** (4 hours monitoring)
   - All SLOs returning to normal
   - Error budget recovery trending positive
   - No recurrence of incident symptoms
   - Circuit breakers CLOSED

2. **Document Timeline** (2 hours)
   - Incident start time
   - Detection timeline
   - Mitigation actions taken
   - Resolution time
   - Impact assessment

3. **Collect Artifacts** (1 hour)
   - Error logs
   - Circuit breaker state changes
   - Error budget reports
   - Deployment timeline
   - Communication log

### Postmortem (Within 48 hours)

1. **Root Cause Analysis**
   - What happened?
   - Why did it happen?
   - Why didn't we catch it sooner?

2. **Impact Assessment**
   - How many users affected?
   - How long was service degraded?
   - Error budget consumption?
   - Financial impact?

3. **Prevention Plan**
   - What can prevent recurrence?
   - What monitoring should we add?
   - What testing should we add?
   - What processes should change?

4. **Action Items**
   - Assign owners and deadlines
   - Track in project management
   - Review in weekly reliability meeting

### Long-Term (Within 1 week)

1. **Implement Prevention**
   - Add new monitors
   - Enhance circuit breakers
   - Improve testing
   - Update runbooks

2. **Share Learnings**
   - Team presentation
   - Update documentation
   - Training for on-call
   - Industry best practices

---

## Escalation Paths

### Internal Escalation

1. **On-Call Engineer** → Acknowledges, executes runbook
2. **Incident Commander** → Coordinates, makes rollback decisions
3. **Engineering Lead** → Approves waivers, resource allocation
4. **CTO** → Major incidents, executive communication

### External Escalation

1. **Vendor Support** → For third-party service issues
2. **App Store Support** → For IAP/review issues
3. **Security Team** → For potential security incidents
4. **Legal Team** → For data breach or compliance issues

---

## Quick Reference

### Key Commands

```bash
# Run synthetic monitors
node scripts/synthetics/check-auth.js
node scripts/synthetics/check-search.js
node scripts/synthetics/check-sync.js

# Check error budget
node scripts/reliability/error-budget.cjs

# Dry-run rollback
node scripts/deploy/auto-rollback.cjs --dry-run

# Execute rollback
node scripts/deploy/auto-rollback.cjs --reason "incident description"

# Force rollback (emergency)
node scripts/deploy/auto-rollback.cjs --force --reason "critical incident"
```

### Key Contacts

- **On-Call Engineer**: Check PagerDuty rotation
- **Incident Commander**: Engineering Lead or designated backup
- **Platform Team**: Slack #platform-eng
- **Security Team**: security@thoughtmarks.com

### Key Resources

- **SLO Policy**: `docs/reliability/SLO_POLICY.md`
- **Error Budget**: `artifacts/reliability/error-budget.json`
- **Synthetic Results**: GitHub Actions artifacts
- **Dashboards**: [Links to APM, Crashlytics, Analytics]

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-15 | BRAUN (MAIN) | Initial runbooks for P7 Slice-13 |

---

**Next Review**: 2026-01-15 (Quarterly, or after any major incident)  
**Document Owner**: Platform Reliability Team

