# IAP Incident Response Runbook

## Overview

This runbook provides step-by-step procedures for responding to In-App Purchase (IAP) related incidents, ensuring rapid resolution and minimal user impact.

## Incident Classification

### Severity Levels

#### P0 - Critical
- Complete IAP service outage
- Revenue-impacting verification failures
- Security breaches or fraud detection
- Mass user purchase failures

#### P1 - High
- Partial IAP service degradation
- Platform-specific purchase issues
- Entitlement sync failures
- Subscription renewal problems

#### P2 - Medium  
- Individual user purchase issues
- Cache refresh problems
- Non-critical UI/UX issues
- Performance degradation

#### P3 - Low
- Documentation issues
- Minor feature requests
- Cosmetic UI problems
- Enhancement requests

## Common Incident Types

### Purchase Flow Failures

#### Symptoms
- Users cannot complete purchases
- Purchase buttons unresponsive
- Payment processing errors
- Receipt validation failures

#### Initial Response (5 minutes)
1. **Check Service Status**
   ```bash
   curl -f https://api.example.com/iap/health
   ```

2. **Verify Platform Status**
   - iOS: Check App Store Connect status
   - Android: Check Google Play Console

3. **Review Error Logs**
   ```bash
   tail -f /var/log/iap/verification.log | grep ERROR
   ```

#### Investigation Steps
1. **Identify Affected Platforms**
   - Check iOS vs Android failure rates
   - Verify sandbox vs production environments
   - Review regional failure patterns

2. **Validate Server Components**
   - Verification endpoint response times
   - Database connectivity and performance
   - External API (Apple/Google) status

3. **Check Recent Deployments**
   - Review recent code changes
   - Verify configuration updates
   - Check feature flag changes

#### Resolution Actions
1. **Immediate Mitigation**
   - Enable maintenance mode if necessary
   - Rollback recent deployments
   - Disable problematic feature flags

2. **Service Recovery**
   - Restart affected services
   - Clear problematic cache entries
   - Verify external API connectivity

3. **User Communication**
   - In-app notification of known issues
   - Support team briefing
   - Social media/website updates

### Entitlement Sync Issues

#### Symptoms
- Users report missing premium features
- Purchases not reflected in app
- Cross-device sync failures
- Subscription status incorrect

#### Initial Response (10 minutes)
1. **Check Entitlement Cache Health**
   ```bash
   # Check cache statistics
   curl https://api.example.com/iap/cache/stats
   
   # Verify cache refresh rates
   grep "cache_refresh" /var/log/iap/entitlements.log
   ```

2. **Verify User-Specific Issues**
   ```bash
   # Check specific user entitlements
   curl -H "Authorization: Bearer $ADMIN_TOKEN" \
        https://api.example.com/iap/user/USER_ID/entitlements
   ```

#### Investigation Steps
1. **Cache Analysis**
   - Check cache hit/miss ratios
   - Verify TTL configurations
   - Review refresh policies

2. **Server Verification**
   - Test receipt verification endpoints
   - Check platform API responses
   - Validate database consistency

3. **User Account Review**
   - Verify purchase history
   - Check account linking status
   - Review subscription status

#### Resolution Actions
1. **Cache Refresh**
   ```bash
   # Force cache refresh for affected users
   curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
        https://api.example.com/iap/cache/refresh/USER_ID
   ```

2. **Manual Entitlement Grant**
   ```bash
   # Temporary entitlement grant (with audit)
   curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
        -d '{"userId":"USER_ID","productId":"PRODUCT_ID","reason":"incident_resolution"}' \
        https://api.example.com/iap/entitlements/grant
   ```

3. **Bulk Resolution**
   ```bash
   # Batch entitlement refresh
   curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
        -d '{"userIds":["USER1","USER2"],"forceRefresh":true}' \
        https://api.example.com/iap/entitlements/batch-refresh
   ```

### Server Verification Failures

#### Symptoms
- High verification failure rates
- Slow verification response times
- Platform API errors
- Invalid receipt errors

#### Initial Response (5 minutes)
1. **Check Verification Metrics**
   ```bash
   # Check verification success rates
   grep "verification_result" /var/log/iap/verification.log | \
   tail -1000 | awk '{print $5}' | sort | uniq -c
   ```

2. **Test Platform APIs**
   ```bash
   # Test iOS App Store API
   curl -H "Authorization: Bearer $IOS_JWT_TOKEN" \
        https://api.storekit-sandbox.itunes.apple.com/inApps/v1/history/USER_ID
   
   # Test Android Play API  
   curl -H "Authorization: Bearer $ANDROID_ACCESS_TOKEN" \
        https://androidpublisher.googleapis.com/androidpublisher/v3/applications/PACKAGE_NAME/purchases/products/PRODUCT_ID/tokens/PURCHASE_TOKEN
   ```

#### Investigation Steps
1. **API Status Verification**
   - Check Apple App Store Server API status
   - Verify Google Play Developer API status
   - Review API quota and rate limits

2. **Authentication Issues**
   - Validate JWT token generation (iOS)
   - Check service account credentials (Android)
   - Verify API key permissions and scopes

3. **Network and Infrastructure**
   - Check network connectivity to platform APIs
   - Verify SSL certificate validity
   - Review firewall and proxy settings

#### Resolution Actions
1. **Authentication Refresh**
   ```bash
   # Refresh iOS JWT tokens
   ./scripts/refresh-ios-jwt.sh
   
   # Refresh Android access tokens
   ./scripts/refresh-android-token.sh
   ```

2. **Fallback Mechanisms**
   - Enable offline verification mode
   - Use cached verification results
   - Implement graceful degradation

3. **Service Restart**
   ```bash
   # Restart verification services
   sudo systemctl restart iap-verification
   sudo systemctl restart iap-cache
   ```

## Monitoring & Alerting

### Key Metrics

#### Purchase Metrics
- Purchase success rate (target: >99%)
- Purchase completion time (target: <30s)
- Platform-specific failure rates
- Revenue impact of failures

#### Verification Metrics
- Verification success rate (target: >99.5%)
- Verification response time (target: <2s)
- Platform API error rates
- Cache hit ratio (target: >85%)

#### User Experience Metrics
- Time to entitlement (target: <60s)
- Cross-device sync time (target: <5min)
- Support ticket volume
- User satisfaction scores

### Alert Thresholds

#### Critical Alerts
- Purchase success rate < 95% (5min window)
- Verification response time > 10s (5min window)
- Complete service outage (immediate)
- Security anomaly detected (immediate)

#### Warning Alerts
- Purchase success rate < 99% (15min window)
- Verification response time > 5s (15min window)
- Cache hit ratio < 80% (30min window)
- High error rates (15min window)

### Monitoring Tools

#### Infrastructure
- **Service Health**: Kubernetes health checks
- **Application Metrics**: Prometheus/Grafana
- **Log Aggregation**: ELK stack or similar
- **APM**: Application performance monitoring

#### Business Metrics
- **Revenue Tracking**: Real-time revenue monitoring
- **User Analytics**: Purchase funnel analysis
- **Platform Analytics**: App Store/Play Console data
- **Support Integration**: Ticket volume tracking

## Escalation Procedures

### On-Call Rotation

#### Primary Response Team
- **Engineering**: IAP service owner
- **DevOps**: Infrastructure specialist
- **Product**: Business impact assessment
- **Support**: User communication

#### Escalation Path
1. **L1 Response** (0-15 minutes): On-call engineer
2. **L2 Escalation** (15-30 minutes): Senior engineer + manager
3. **L3 Escalation** (30-60 minutes): Engineering director + product lead
4. **Executive Escalation** (60+ minutes): VP Engineering + business stakeholders

### Communication Channels

#### Internal
- **Slack**: #iap-incidents channel
- **PagerDuty**: Automated alerting
- **Zoom**: Incident bridge calls
- **Email**: Executive notifications

#### External
- **Status Page**: Public service status
- **Support Portal**: User notifications
- **Social Media**: Major incident updates
- **App Store**: Platform communication

## Post-Incident Procedures

### Immediate Actions (Within 2 hours)

1. **Service Validation**
   - Verify full service restoration
   - Confirm all metrics within normal ranges
   - Test end-to-end purchase flows

2. **User Impact Assessment**
   - Identify affected users and transactions
   - Calculate revenue impact
   - Review support ticket volume

3. **Stakeholder Communication**
   - Brief executive team on resolution
   - Update support team on status
   - Prepare user communication if needed

### Follow-Up Actions (Within 24 hours)

1. **Data Analysis**
   - Export relevant logs and metrics
   - Create incident timeline
   - Document root cause analysis

2. **User Recovery**
   - Process any required refunds
   - Grant missing entitlements
   - Provide user compensation if appropriate

3. **Process Review**
   - Evaluate response effectiveness
   - Identify process improvements
   - Update runbook documentation

### Post-Mortem Process (Within 1 week)

#### Post-Mortem Meeting
- **Attendees**: All incident responders + stakeholders
- **Duration**: 60-90 minutes
- **Agenda**: Timeline, root cause, action items
- **Output**: Written post-mortem document

#### Action Items
- **Immediate**: Critical fixes and improvements
- **Short-term**: Process and tooling enhancements
- **Long-term**: Architectural improvements
- **Documentation**: Runbook and knowledge base updates

#### Follow-Up
- **Weekly Check-ins**: Track action item progress
- **Monthly Review**: Assess incident trends
- **Quarterly Assessment**: Overall system reliability review

## Emergency Contacts

### Internal Team
- **On-Call Engineer**: [PagerDuty rotation]
- **Engineering Manager**: [Contact info]
- **Product Manager**: [Contact info]
- **DevOps Lead**: [Contact info]

### External Vendors
- **Apple Developer Support**: [Contact info]
- **Google Play Support**: [Contact info]
- **Cloud Provider Support**: [Contact info]
- **CDN Support**: [Contact info]

### Business Stakeholders
- **VP Engineering**: [Contact info]
- **VP Product**: [Contact info]
- **Finance Lead**: [Contact info]
- **Legal Counsel**: [Contact info]

---

**Document Version**: 1.0  
**Last Updated**: P5 • Slice-08 Implementation  
**Review Schedule**: Monthly  
**Owner**: IAP Engineering Team
