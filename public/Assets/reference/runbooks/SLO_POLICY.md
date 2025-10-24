# Service Level Objectives (SLO) Policy

**Version**: 1.0.0  
**Last Updated**: 2025-10-15  
**Owner**: Platform Reliability Team  
**Status**: Active

---

## Executive Summary

This document defines the Service Level Objectives (SLOs) and Service Level Indicators (SLIs) for the Thoughtmarks mobile application and its supporting backend services. These metrics ensure we maintain high reliability, performance, and user experience standards.

---

## Core Principles

1. **User-Centric**: SLOs reflect actual user experience, not just system metrics
2. **Measurable**: All objectives have clear, quantifiable indicators
3. **Actionable**: Breaches trigger automated responses and runbook execution
4. **Balanced**: Trade-offs between reliability and velocity are explicit
5. **Evolutionary**: SLOs adjust based on real-world data and business needs

---

## Service Level Objectives

### 1. Availability SLO

**Objective**: Service endpoints backing critical app flows available ≥ 99.9% monthly

**Critical Flows**:
- Authentication (sign-in, sign-up, token refresh)
- Search (thoughtmark search, filtering, sorting)
- Sync (create, update, delete thoughtmarks)
- AI Intelligence (recommendations, insights, connections)

**Measurement**:
- **Window**: Rolling 30-day period
- **Target**: 99.9% uptime
- **Error Budget**: 43.2 minutes/month downtime allowed
- **SLI**: `(successful_requests / total_requests) * 100`

**Data Sources**:
- Backend health endpoints (`/health`, `/status`)
- Client-side success/failure telemetry
- Synthetic monitor results (check-auth.js, check-search.js, check-sync.js)

**Failure Criteria**:
- HTTP 5xx responses
- Timeout errors (> 30s)
- Network connectivity failures
- Circuit breaker open state

---

### 2. Crash-Free Sessions SLO

**Objective**: Mobile app sessions crash-free ≥ 99.5% over rolling 7-day window

**Measurement**:
- **Window**: Rolling 7-day period
- **Target**: 99.5% crash-free rate
- **Error Budget**: 0.5% crash rate allowed (e.g., 5 crashes per 1,000 sessions)
- **SLI**: `(crash_free_sessions / total_sessions) * 100`

**Data Sources**:
- Crashlytics/Sentry crash reports
- Client telemetry (`session_start`, `session_end`, `session_crash`)
- App Store crash analytics

**Crash Definition**:
- Unhandled exceptions causing app termination
- Memory pressure kills (OOM)
- iOS/Android system kills due to violations
- Fatal native module crashes

**Exclusions**:
- User-initiated app termination
- Low-battery automatic termination
- OS upgrade-related terminations

---

### 3. Latency Budgets SLO

**Objective**: Mobile app maintains responsive user experience with tight latency budgets

#### 3.1 Navigation Actions

- **Target**: P95 ≤ 200ms
- **Measurement**: Time from tap to screen render complete
- **SLI**: 95th percentile of navigation duration
- **Flows**: Tab switching, screen navigation, back button

#### 3.2 Cold Start

- **Target**: P50 ≤ 1.5s
- **Measurement**: App icon tap to first interactive frame
- **SLI**: Median cold start time
- **Components**: App initialization, splash screen, auth check, initial data load

#### 3.3 Search Performance

- **Target**: P95 ≤ 120ms
- **Measurement**: Query submission to results displayed
- **SLI**: 95th percentile search latency
- **Scope**: Local search, full-text search, semantic search

**Data Sources**:
- Client-side performance telemetry (`perf_*` events)
- React Native performance API
- Custom performance marks and measures
- Detox E2E test performance data

**Measurement Windows**:
- All latency SLOs measured over rolling 24-hour period
- P50/P95 calculated from client-side samples (min 10,000 samples)

---

### 4. Event Pipeline Loss SLO

**Objective**: Analytics and telemetry event loss < 1%

**Measurement**:
- **Window**: Rolling 24-hour period
- **Target**: > 99% event delivery rate
- **Error Budget**: < 1% event loss allowed
- **SLI**: `(events_received_backend / events_sent_client) * 100`

**Data Sources**:
- Client-side event queue (`analytics.queued`, `analytics.sent`)
- Backend event ingestion logs
- Analytics provider dashboards (Mixpanel, custom backend)

**Event Categories**:
- User actions (`ui_*`, `nav_*`, `search_*`)
- System events (`app_*`, `session_*`, `perf_*`)
- Business events (`ai_*`, `billing_*`, `onboarding_*`)
- Error events (`error_*`, `crash_*`)

**Loss Causes**:
- Network failures during transmission
- Client offline queuing overflow
- Backend ingestion pipeline failures
- Sampling or rate limiting

---

## Error Budget Management

### Error Budget Calculation

```
Error Budget (minutes) = Service Window (minutes) × (100% - SLO Target%)

Example (Availability):
Error Budget = 43,200 minutes/month × (100% - 99.9%)
Error Budget = 43,200 × 0.001
Error Budget = 43.2 minutes/month
```

### Burn Rate

Burn rate measures how quickly we consume our error budget.

```
Burn Rate = (Current Error Rate) / (Maximum Allowed Error Rate)

Example:
If current availability = 99.8% (0.2% error rate)
Maximum allowed error rate = 0.1%
Burn Rate = 0.2% / 0.1% = 2.0x

Burn Rate > 1.0 means we're consuming error budget faster than sustainable.
```

### Budget Windows

- **Fast Burn**: 1-hour window, threshold 14.4× burn rate → immediate alert
- **Moderate Burn**: 6-hour window, threshold 6.0× burn rate → warning
- **Slow Burn**: 24-hour window, threshold 3.0× burn rate → investigation
- **Monthly Burn**: 30-day rolling window → planning and retrospective

---

## Alerting and Escalation

### Alert Severity Levels

#### P0 (Critical)
- **Trigger**: Fast burn rate (> 14.4×) or SLO breach imminent (< 10% budget remaining)
- **Response**: Immediate page, auto-rollback consideration, incident commander assigned
- **Examples**: Complete service outage, crash rate > 5%, all health checks failing

#### P1 (High)
- **Trigger**: Moderate burn rate (> 6.0×) or SLO breach likely (< 25% budget remaining)
- **Response**: Alert on-call, incident investigation within 15 minutes
- **Examples**: Search degraded, auth latency spikes, elevated crash rate

#### P2 (Medium)
- **Trigger**: Slow burn rate (> 3.0×) or SLO at risk (< 50% budget remaining)
- **Response**: Create incident ticket, investigate within 2 hours
- **Examples**: Synthetic monitors failing, event loss detected, cold start regression

#### P3 (Low)
- **Trigger**: Budget consumption above forecast but SLO safe (> 50% budget remaining)
- **Response**: Weekly review, track in reliability report
- **Examples**: Minor latency increases, isolated crash reports

### Escalation Path

1. **Automated Detection**: Circuit breakers, synthetic monitors, client telemetry
2. **Initial Response**: On-call engineer, runbook execution, feature flags
3. **Incident Management**: Incident commander, stakeholder notification
4. **Resolution**: Root cause analysis, postmortem, prevention plan

---

## SLI Data Sources

### Client Telemetry
- **Source**: Mobile app instrumentation (`src-nextgen/services/telemetry/`)
- **Metrics**: Session count, crash reports, performance timings, event queue status
- **Frequency**: Real-time stream, 5-minute aggregation
- **Retention**: 90 days raw, 1 year aggregated

### Backend Health
- **Source**: Backend health endpoints (`/health`, `/status`, `/metrics`)
- **Metrics**: Request success/failure, latency percentiles, error rates
- **Frequency**: Per-request logging, 1-minute aggregation
- **Retention**: 30 days raw, 1 year aggregated

### Synthetic Monitors
- **Source**: Scheduled scripts (`scripts/synthetics/check-*.js`)
- **Metrics**: End-to-end flow success, latency, error types
- **Frequency**: Every 5 minutes (critical flows), every 15 minutes (non-critical)
- **Retention**: 90 days

### Analytics Provider
- **Source**: Mixpanel, custom analytics backend
- **Metrics**: Event counts, delivery rates, user journeys
- **Frequency**: Near real-time, 15-minute batch processing
- **Retention**: 1 year

---

## Maintenance and Review

### Quarterly Review
- **Audience**: Engineering leadership, product management, on-call team
- **Content**: SLO performance, error budget consumption, incident trends
- **Outcomes**: SLO adjustments, infrastructure investments, process improvements

### Monthly Retrospective
- **Audience**: Platform reliability team, on-call engineers
- **Content**: Incident reviews, near-misses, budget forecasts
- **Outcomes**: Runbook updates, monitoring improvements, training needs

### Weekly Reporting
- **Audience**: Engineering team, stakeholders
- **Content**: Current SLO status, budget remaining, active incidents
- **Outcomes**: Awareness, prioritization, celebration of wins

### Automated Reporting
- **Script**: `scripts/reports/weekly-reliability.cjs`
- **Output**: `docs/reliability/WEEKLY_REPORT_<ISO_WEEK>.md`
- **Distribution**: Slack, email, team dashboard

---

## Exceptions and Overrides

### Planned Maintenance
- **Process**: Schedule maintenance window, notify users, exclude from SLO
- **Approval**: Engineering lead + product owner
- **Documentation**: Maintenance log, impact assessment

### Emergency Changes
- **Process**: ROLL-FORWARD-WAIVER label, incident commander approval
- **Validation**: Dry-run in staging, rollback plan ready
- **Documentation**: Change log, risk assessment, communication plan

### Load Testing
- **Process**: Isolate test traffic, exclude from production SLO calculations
- **Approval**: Platform team lead
- **Documentation**: Test plan, results, production impact assessment

---

## Continuous Improvement

### SLO Tuning
- Review SLO targets quarterly based on:
  - Actual performance vs. target (too easy/hard?)
  - User impact correlation (does SLO predict satisfaction?)
  - Cost of achieving target (diminishing returns?)
  - Competitive benchmarks (industry standards)

### Instrumentation Enhancements
- Add new SLIs as app evolves
- Improve measurement accuracy
- Reduce telemetry blind spots
- Optimize performance overhead

### Automation Expansion
- Auto-remediation for common incidents
- Smarter feature flag strategies
- Predictive alerting (ML-based)
- Self-healing systems

---

## References

- **Runbooks**: `docs/reliability/RUNBOOKS.md`
- **SLI Configuration**: `configs/reliability/sli-config.json`
- **Error Budget Calculator**: `scripts/reliability/error-budget.cjs`
- **Weekly Report Generator**: `scripts/reports/weekly-reliability.cjs`
- **Synthetic Monitors**: `scripts/synthetics/`
- **CI Reliability Gate**: `.github/workflows/ci-deploy-guard.yml`

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-15 | BRAUN (MAIN) | Initial SLO policy creation for P7 Slice-13 |

---

**Next Review**: 2026-01-15 (Quarterly)  
**Document Owner**: Platform Reliability Team  
**Approvers**: Engineering Lead, Product Owner

