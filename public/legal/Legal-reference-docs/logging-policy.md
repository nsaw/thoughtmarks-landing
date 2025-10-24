# Logging Policy & PII Protection

**Generated**: 2025-09-27T08:00:00Z  
**Phase**: P5 • Slice-12 — Security & Compliance Sweep  

## Overview

This document defines the logging policy for the Thoughtmarks mobile application, including what data is logged, retention policies, and PII protection measures.

## Logging Principles

### Core Principles

1. **Minimize Data Collection**: Log only what is necessary for debugging and monitoring
2. **Protect Privacy**: Never log PII or sensitive user data
3. **Secure Transmission**: All logs transmitted securely
4. **Limited Retention**: Automatic log cleanup and retention policies
5. **User Consent**: Respect user privacy preferences

### Data Categories

**Allowed in Logs**:
- Error messages (sanitized)
- Performance metrics
- Application events
- System status
- Debug information (non-sensitive)

**Never Logged**:
- User credentials
- Personal information (PII)
- Authentication tokens
- Payment information
- Biometric data
- Location data (unless explicitly consented)

## Logging Implementation

### Structured Logging

**Format**: JSON structured logs
**Type Safety**: `Record<string, unknown>` only
**Validation**: All log data validated before logging

```typescript
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context: Record<string, unknown>;
  userId?: string; // Hashed/anonymized only
}
```

### Log Levels

**Debug**: Development and debugging information
- Function entry/exit
- Variable states (sanitized)
- Performance measurements

**Info**: General application events
- Feature usage
- System status
- User actions (anonymized)

**Warn**: Potential issues
- Deprecated API usage
- Performance warnings
- Configuration issues

**Error**: Application errors
- Exception details (sanitized)
- Error context
- Recovery actions

### Error Sanitization

**Error Objects**: Always sanitized before logging
**Stack Traces**: File paths only, no sensitive data
**User Data**: Replaced with placeholders

```typescript
function sanitizeError(error: Error): Record<string, unknown> {
  return {
    name: error.name,
    message: error.message.replace(/[^\w\s]/g, '*'), // Remove special chars
    stack: error.stack?.split('\n').slice(0, 5), // Limit stack depth
    timestamp: new Date().toISOString()
  };
}
```

## PII Protection

### Automatic Redaction

**Patterns Detected**:
- Email addresses
- Phone numbers
- Credit card numbers
- SSN/National ID numbers
- API keys and tokens
- User IDs (when not anonymized)

**Redaction Method**:
```typescript
function redactPII(text: string): string {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/[A-Za-z0-9]{20,}/g, '[TOKEN]');
}
```

### User Identification

**Anonymous IDs**: Generated unique identifiers
**Session IDs**: Temporary, non-persistent
**User Context**: Minimal, consent-based only

### Consent Management

**Explicit Consent**: Required for all data collection
**Granular Control**: Users can opt-out of specific logging
**Data Portability**: Users can request their log data

## Log Transmission

### Secure Transmission

**Protocol**: HTTPS/TLS 1.3 minimum
**Authentication**: API key authentication
**Compression**: GZIP compression for efficiency
**Retry Logic**: Exponential backoff with jitter

### Batch Processing

**Batch Size**: Maximum 100 log entries per batch
**Flush Interval**: 30 seconds maximum
**Offline Queue**: Local storage when offline
**Priority**: Error logs sent immediately

## Log Destinations

### Local Storage

**Location**: App sandbox only
**Encryption**: AES-256 encryption at rest
**Retention**: 7 days maximum
**Cleanup**: Automatic daily cleanup

### Remote Services

**Primary**: Sentry (error tracking)
**Secondary**: Segment (analytics)
**Backup**: Local storage queue

### Log Aggregation

**Format**: Structured JSON
**Schema**: Consistent across all services
**Metadata**: Timestamp, app version, device info

## Retention Policies

### Local Logs

**Retention Period**: 7 days
**Maximum Size**: 10MB
**Cleanup Schedule**: Daily at 2 AM
**Emergency Cleanup**: On security events

### Remote Logs

**Sentry**: 90 days
**Segment**: 24 months (anonymized)
**Backup**: 1 year (encrypted)

### Compliance Requirements

**GDPR**: Right to deletion within 30 days
**CCPA**: Data deletion on request
**SOX**: 7-year retention for audit logs
**HIPAA**: 6-year retention (if applicable)

## Monitoring & Alerting

### Security Monitoring

**Suspicious Activity**:
- Multiple failed authentication attempts
- Unusual data access patterns
- Potential PII leakage
- Security policy violations

**Alert Thresholds**:
- >10 failed auth attempts per minute
- >100 error logs per hour
- PII detection in logs
- Unauthorized access attempts

### Performance Monitoring

**Metrics Tracked**:
- Log volume and frequency
- Transmission success rates
- Storage usage
- Processing latency

**Alert Conditions**:
- Log volume >200% of baseline
- Transmission failure rate >5%
- Storage usage >80% of limit
- Processing latency >5 seconds

## Compliance & Auditing

### Regulatory Compliance

**GDPR**: Data protection and privacy rights
**CCPA**: Consumer privacy rights
**SOX**: Financial audit requirements
**HIPAA**: Healthcare data protection

### Audit Trail

**Logged Events**:
- Log access and modifications
- Security policy changes
- User consent changes
- Data deletion requests

**Audit Retention**: 7 years
**Access Control**: Security team only
**Integrity**: Cryptographic integrity protection

### Data Subject Rights

**Access**: Users can request their log data
**Rectification**: Users can request data correction
**Erasure**: Users can request data deletion
**Portability**: Users can export their data

## Implementation Guidelines

### Development

**Code Review**: All logging code reviewed for PII
**Testing**: Automated PII detection in tests
**Documentation**: Log schema documented
**Validation**: Log format validated at runtime

### Deployment

**Configuration**: Log levels configured per environment
**Monitoring**: Log health monitored continuously
**Backup**: Log backup procedures tested
**Recovery**: Log recovery procedures documented

### Maintenance

**Regular Review**: Log content reviewed monthly
**Policy Updates**: Logging policy updated quarterly
**Training**: Team training on logging best practices
**Compliance**: Regular compliance audits

## Troubleshooting

### Common Issues

**High Log Volume**:
- Check for log loops
- Verify log level configuration
- Review error patterns

**PII Detection**:
- Review redaction patterns
- Update sanitization rules
- Train development team

**Transmission Failures**:
- Check network connectivity
- Verify API credentials
- Review rate limiting

**Storage Issues**:
- Check retention policies
- Verify cleanup schedules
- Monitor storage usage

## Best Practices

### Development

- Use structured logging consistently
- Never log sensitive data
- Implement proper error handling
- Test logging in all environments

### Operations

- Monitor log health continuously
- Regular log content review
- Automated PII detection
- Security incident response

### Privacy

- Minimize data collection
- Respect user consent
- Implement data subject rights
- Regular privacy impact assessments

## References

### Standards & Regulations
- GDPR: https://gdpr.eu/
- CCPA: https://oag.ca.gov/privacy/ccpa
- ISO 27001: https://www.iso.org/isoiec-27001-information-security.html
- OWASP Logging: https://owasp.org/www-project-application-security-verification-standard/

### Technical Resources
- Sentry Documentation: https://docs.sentry.io/
- Segment Documentation: https://segment.com/docs/
- Logging Best Practices: https://12factor.net/logs

---

*This policy should be reviewed and updated regularly to ensure compliance with evolving privacy regulations and security requirements.*
