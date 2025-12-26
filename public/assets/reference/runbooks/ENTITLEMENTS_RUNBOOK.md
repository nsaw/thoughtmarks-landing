# Entitlements Runbook

## Overview

This runbook provides troubleshooting guidance for entitlement issues, scripts for validation, and telemetry field documentation for the StoreKit2 billing system.

## Entitlement State Machine

### States
- **active**: User has valid subscription/entitlement
- **inGrace**: Subscription expired but within grace period
- **inBillingRetry**: Payment failed, retrying billing
- **expired**: Subscription expired, no grace period
- **refunded**: Purchase was refunded by Apple
- **revoked**: Entitlement was revoked (fraud, policy violation)

### State Transitions
```
none → active → inGrace → expired
  ↓      ↓        ↓
refunded ← revoked ← revoked
```

## Troubleshooting Guide

### 1. Grace Period Issues

#### Symptoms
- User reports loss of premium features
- Entitlement shows `inGrace` state
- User confused about subscription status

#### Diagnosis
```bash
# Check entitlement state
node scripts/storekit/receipt-verify.cjs

# Check grace period status
grep -i "grace" validations/logs/storekit-receipt-verify.log
```

#### Resolution
1. **Verify grace period duration**:
   - Monthly: 7 days
   - Yearly: 14 days
2. **Check expiration date**:
   - Compare with current time
   - Account for timezone differences
3. **User communication**:
   - Show grace period warning
   - Provide renewal options
   - Explain billing retry process

#### Scripts
```bash
# Check grace period status
npm run storekit:receipt-verify

# Validate entitlement state
node scripts/storekit/receipt-verify.cjs --check-grace
```

### 2. Refund Processing

#### Symptoms
- User reports unexpected loss of access
- Entitlement shows `refunded` state
- User confused about payment status

#### Diagnosis
```bash
# Check for refunded entitlements
grep -i "refunded" validations/logs/storekit-receipt-verify.log

# Verify refund status
node scripts/storekit/receipt-verify.cjs --check-refunds
```

#### Resolution
1. **Immediate action**:
   - Revoke access immediately
   - Show refund notification
   - Provide support contact
2. **User communication**:
   - Explain refund reason
   - Offer re-subscription options
   - Provide Apple support link
3. **Data handling**:
   - Preserve user data
   - Allow re-subscription
   - Maintain audit trail

#### Scripts
```bash
# Process refunds
node scripts/storekit/receipt-verify.cjs --process-refunds

# Update entitlement states
node scripts/storekit/receipt-verify.cjs --update-states
```

### 3. Restore Issues

#### Symptoms
- User cannot restore purchases
- Entitlements not showing after restore
- Multiple Apple ID confusion

#### Diagnosis
```bash
# Check restore status
npm run storekit:receipt-verify

# Verify Apple ID consistency
node scripts/storekit/receipt-verify.cjs --check-apple-id
```

#### Resolution
1. **Apple ID verification**:
   - Ensure same Apple ID used
   - Check family sharing settings
   - Verify purchase history
2. **Restore process**:
   - Clear and retry restore
   - Check network connectivity
   - Verify StoreKit configuration
3. **User guidance**:
   - Provide step-by-step instructions
   - Offer alternative solutions
   - Escalate to Apple support if needed

#### Scripts
```bash
# Test restore functionality
npm run storekit:sandbox

# Verify entitlements
node scripts/storekit/receipt-verify.cjs --verify-entitlements
```

### 4. Billing Retry Issues

#### Symptoms
- Entitlement stuck in `inBillingRetry` state
- User reports payment issues
- Automatic retry failures

#### Diagnosis
```bash
# Check billing retry status
grep -i "billing" validations/logs/storekit-receipt-verify.log

# Analyze retry patterns
node scripts/storekit/receipt-verify.cjs --analyze-retry
```

#### Resolution
1. **Payment method issues**:
   - Verify payment method validity
   - Check for insufficient funds
   - Update payment information
2. **Retry logic**:
   - Implement exponential backoff
   - Set maximum retry attempts
   - Provide manual retry option
3. **User communication**:
   - Show retry status
   - Provide payment update options
   - Explain consequences of failure

#### Scripts
```bash
# Monitor billing retry
node scripts/storekit/receipt-verify.cjs --monitor-retry

# Reset retry state
node scripts/storekit/receipt-verify.cjs --reset-retry
```

## Validation Scripts

### 1. StoreKit Sandbox Testing
```bash
# Run StoreKitTest scenarios
npm run storekit:sandbox

# Check test results
cat validations/billing/storekit-report.json
```

**Output**: `validations/billing/storekit-report.json`
- Test execution results
- Purchase scenario outcomes
- Restore functionality validation
- Error analysis

### 2. Receipt Verification
```bash
# Verify receipt and entitlement mapping
npm run storekit:receipt-verify

# Check verification results
cat validations/billing/entitlements-report.json
```

**Output**: `validations/billing/entitlements-report.json`
- Receipt verification status
- Entitlement mapping results
- State consistency checks
- Error details

### 3. Price Locale Validation
```bash
# Snapshot price presentations
npm run storekit:price-locales

# Check locale results
cat validations/billing/price-locale-snapshots.json
```

**Output**: `validations/billing/price-locale-snapshots.json`
- Price formatting for key locales
- Currency symbol validation
- Introductory offer formatting
- Localization compliance

### 4. Comprehensive Validation
```bash
# Run all StoreKit validations
npm run storekit:validate

# Check overall results
ls -la validations/billing/
```

## Telemetry Fields

### Event: `billing_products_loaded`
```typescript
{
  productCount: number;
  subscriptionCount: number;
  consumableCount: number;
  nonConsumableCount: number;
  latencyMs: number;
  region: string;
  timestamp: string;
}
```

### Event: `billing_purchase_attempted`
```typescript
{
  productId: string;
  region: string;
  groupId: string;
  introEligible: boolean;
  isFamilyShare: boolean;
  timestamp: string;
}
```

### Event: `billing_purchase_succeeded`
```typescript
{
  productId: string;
  transactionId: string;
  region: string;
  groupId: string;
  introEligible: boolean;
  isFamilyShare: boolean;
  latencyMs: number;
  timestamp: string;
}
```

### Event: `billing_purchase_failed`
```typescript
{
  productId: string;
  error: string;
  region: string;
  groupId: string;
  introEligible: boolean;
  isFamilyShare: boolean;
  latencyMs: number;
  timestamp: string;
}
```

### Event: `billing_restore_started`
```typescript
{
  region: string;
  timestamp: string;
}
```

### Event: `billing_restore_succeeded`
```typescript
{
  restoredCount: number;
  familySharedCount: number;
  region: string;
  latencyMs: number;
  timestamp: string;
}
```

### Event: `billing_restore_failed`
```typescript
{
  error: string;
  region: string;
  latencyMs: number;
  timestamp: string;
}
```

### Event: `billing_entitlement_changed`
```typescript
{
  productId: string;
  oldState: string;
  newState: string;
  userId: string;
  transactionId?: string;
  reason?: string;
  timestamp: string;
}
```

### Event: `billing_price_exposed`
```typescript
{
  productId: string;
  price: string;
  currency: string;
  region: string;
  locale: string;
  timestamp: string;
}
```

## Monitoring & Alerts

### Key Metrics
- Purchase success rate
- Restore completion rate
- Entitlement state distribution
- Error frequency by type
- Performance latency

### Alert Thresholds
- Purchase failure rate > 10%
- Restore failure rate > 5%
- Entitlement state corruption > 1%
- Average latency > 5 seconds
- Error rate > 5%

### Dashboard Queries
```sql
-- Purchase success rate
SELECT 
  COUNT(CASE WHEN event = 'billing_purchase_succeeded' THEN 1 END) / 
  COUNT(CASE WHEN event = 'billing_purchase_attempted' THEN 1 END) as success_rate
FROM billing_events 
WHERE timestamp > NOW() - INTERVAL '24 hours';

-- Entitlement state distribution
SELECT 
  newState,
  COUNT(*) as count
FROM billing_events 
WHERE event = 'billing_entitlement_changed'
AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY newState;
```

## Emergency Procedures

### 1. Mass Entitlement Issues
```bash
# Emergency entitlement reset
node scripts/storekit/receipt-verify.cjs --emergency-reset

# Verify system health
npm run storekit:validate
```

### 2. Payment System Outage
```bash
# Enable offline mode
node scripts/storekit/receipt-verify.cjs --enable-offline

# Check system status
npm run storekit:receipt-verify
```

### 3. Data Corruption
```bash
# Backup current state
node scripts/storekit/receipt-verify.cjs --backup-state

# Restore from backup
node scripts/storekit/receipt-verify.cjs --restore-backup
```

## Support Escalation

### Level 1: User Issues
- Basic restore problems
- Payment method issues
- Subscription confusion

### Level 2: Technical Issues
- Entitlement state corruption
- Receipt verification failures
- Performance problems

### Level 3: System Issues
- StoreKit configuration problems
- Apple system outages
- Security incidents

### Escalation Contacts
- **Engineering**: StoreKit2 team
- **Product**: Billing team
- **Support**: Customer success team
- **Apple**: Developer support

## Maintenance Tasks

### Daily
- Monitor error rates
- Check entitlement consistency
- Review performance metrics
- Validate telemetry data

### Weekly
- Run comprehensive validation
- Review support tickets
- Analyze usage patterns
- Update documentation

### Monthly
- Security audit
- Performance optimization
- Feature usage analysis
- Compliance review

## Documentation Updates

### When to Update
- New product launches
- State machine changes
- Script modifications
- Process improvements

### Update Process
1. Review current documentation
2. Identify changes needed
3. Update relevant sections
4. Validate with team
5. Publish updates

### Version Control
- Track all documentation changes
- Maintain change log
- Tag major updates
- Archive old versions
