# Watch Data Sync Documentation

## Overview

The Watch Data Sync system enables bidirectional data synchronization between the iPhone app and Apple Watch companion app. The system implements a conflict resolution policy where the Phone is the Source of Truth (SoT) for Bins, Tags, and global Settings, while the Watch operates as a read-mostly consumer with limited write capabilities for watch-scoped settings.

**Note**: This data sync system also powers the Watch Complications & Glanceables feature, including the new Quick Capture complications. For details on how complications consume synced data, see the [Complications & Glanceables section](./watch-companion.md#complications--glanceables) and [Quick Capture Complications section](./watch-companion.md#quick-capture-complications) in the Watch Companion documentation.

## Architecture

### Data Flow

```
Phone (SoT) ←→ WCSession ←→ Watch (Read-Mostly)
     ↓                           ↓
  Global Data              Watch-Scoped Data
  - Bins                   - Haptic Feedback
  - Tags                   - Screen Timeout
  - Settings               - Voice Prompts
```

### Key Components

1. **WatchDataSync Coordinator**: Main synchronization service
2. **WCSessionManager**: Handles WatchConnectivity communication
3. **WatchQueue**: Manages offline operations and retries
4. **WatchSecurity**: Ensures data integrity and privacy
5. **Contracts**: Versioned data schemas and envelope types

## Data Models

### Bins (Read-Only on Watch)
- **Phone**: Full CRUD operations
- **Watch**: Read-only access, can reference by name in new Thoughtmarks
- **Sync**: Phone publishes deltas on changes

### Tags (Read-Only on Watch)
- **Phone**: Full CRUD operations
- **Watch**: Read-only access, can reference by name in new Thoughtmarks
- **Sync**: Phone publishes deltas on changes
- **Conflict Resolution**: Phone creates/dedupes unknown tags from Watch-created Thoughtmarks

### Settings
- **Global Settings** (Read-Only on Watch):
  - Theme, locale, capture defaults
  - Consent settings (microphone, analytics, crash, notifications)
- **Watch-Scoped Settings** (Writable on Watch):
  - Haptic feedback
  - Screen timeout
  - Voice prompt enabled

## Synchronization Protocol

### 1. Handshake Process

```
Watch → Phone: watch.sync.request
{
  need: ['bins', 'tags', 'settings'],
  currentVersions: { bins: 1, tags: 1, settings: 1 },
  checksums: { bins: 'abc123', tags: 'def456', settings: 'ghi789' }
}

Phone → Watch: watch.sync.snapshot (for each model with mismatched checksum)
{
  kind: 'snapshot',
  model: 'bins',
  data: [...],
  checksum: 'new_checksum'
}
```

### 2. Steady-State Updates

```
Phone → Watch: watch.sync.delta
{
  kind: 'delta',
  model: 'bins',
  ops: [
    { op: 'upsert', id: 'bin1', data: {...}, updatedAt: '2025-01-21T...' },
    { op: 'remove', id: 'bin2', updatedAt: '2025-01-21T...' }
  ]
}
```

### 3. Watch-to-Phone Proposals

```
Watch → Phone: watch.sync.delta (watch-scoped settings only)
{
  kind: 'delta',
  model: 'settings',
  scope: 'watch',
  ops: [
    { op: 'upsert', id: 'watch-scoped', data: { hapticFeedback: true } }
  ]
}

Phone → Watch: watch.sync.response
{
  status: 'success' | 'denied',
  reason?: 'global_setting_read_only'
}
```

## Conflict Resolution Policy

### Source of Truth Rules

1. **Phone is SoT** for Bins, Tags, and global Settings
2. **Watch is read-mostly** for Bins and Tags
3. **Watch can propose** watch-scoped settings only
4. **Phone validates** all watch proposals before applying

### Conflict Resolution Logic

```typescript
// Delta application logic
if (incoming.updatedAt >= local.updatedAt) {
  applyDelta(incoming);
} else {
  rejectDelta('stale_data');
}

// Settings proposal validation
if (proposal.scope === 'global') {
  rejectProposal('global_setting_read_only');
} else if (proposal.scope === 'watch') {
  validateAndApply(proposal);
}
```

### Tag Deduplication

When Watch creates Thoughtmarks with unknown tags:
1. Phone receives Thoughtmark with tag names
2. Phone creates missing tags (case-insensitive deduplication)
3. Phone returns authoritative tag IDs in creation acknowledgment
4. Watch updates local Thoughtmark with correct tag IDs

## Security & Privacy

### Data Protection
- **No PII in payloads**: All personal data is redacted
- **Consent enforcement**: Sync only occurs with user consent
- **Checksum validation**: Data integrity verification
- **Idempotency keys**: Prevent duplicate processing

### Privacy Compliance
- **ConsentManager integration**: Respects user privacy preferences
- **Minimal data sync**: Only necessary data is synchronized
- **Local storage**: Watch data is stored locally with TTL
- **Audit logging**: All sync operations are logged (with PII redaction)

## Performance & Reliability

### Optimization Strategies
- **Batch deltas**: Multiple changes within 500ms are batched
- **Payload caps**: Maximum 128KB per envelope
- **Debounced updates**: Prevents excessive sync operations
- **Checksum comparison**: Only sync when data actually changes

### Error Handling
- **Retry logic**: Exponential backoff for failed operations
- **Offline queuing**: Operations queued when unreachable
- **Graceful degradation**: App continues working without sync
- **Telemetry**: Performance metrics (if consented)

## Implementation Details

### Message Types

```typescript
// Request data from phone
type RequestEnvelope = {
  kind: 'request';
  need: ModelType[];
  currentVersions: Record<ModelType, number>;
  checksums: Record<ModelType, string>;
}

// Full data snapshot
type SnapshotEnvelope<T> = {
  kind: 'snapshot';
  model: ModelType;
  data: T[] | T;
  checksum: string;
}

// Incremental updates
type DeltaEnvelope<T> = {
  kind: 'delta';
  model: ModelType;
  ops: Array<{
    op: 'upsert' | 'remove';
    id: string;
    data?: Partial<T>;
    updatedAt: ISODate;
  }>;
}
```

### Storage Strategy

**Phone Storage:**
- Persists last delivered checksums per model
- Namespace: `watchSync:v1:<model>`
- Used for: Change detection, conflict resolution

**Watch Storage:**
- Persists snapshots in local store
- TTL: 14 days (configurable)
- Used for: Offline access, data consistency

### Queue Semantics

```typescript
// Offline operation queuing
interface QueuedOperation {
  id: string;
  type: 'sync_request' | 'settings_proposal';
  payload: any;
  idempotencyKey: string;
  retryCount: number;
  createdAt: ISODate;
}

// Queue management
class WatchQueue {
  enqueue(operation: QueuedOperation): string;
  flush(): Promise<void>;
  retryFailed(): Promise<void>;
  clearExpired(): Promise<void>;
}
```

## Testing Strategy

### Unit Tests
- Envelope validation and checksum calculation
- Idempotency key deduplication
- Delta application order and version gating
- Rejection paths for global settings proposals

### Integration Tests
- Phone change → delta → Watch apply (disconnect/reconnect scenarios)
- Watch request → snapshot → apply
- Watch settings proposal → phone validate → ack with authoritative snapshot

### Test Artifacts
- `watch.datasync.handshake.json`: First-pair/rehydrate timeline
- `watch.datasync.snapshots.json`: Latest versions+checksums per model
- `watch.datasync.deltas.log.json`: Applied operations with counts
- `watch.datasync.reliability.json`: Queue stats, retries, failures

## Configuration

### Sync Configuration

```typescript
interface SyncConfig {
  batchSize: number;        // Default: 10
  debounceMs: number;       // Default: 500
  maxRetries: number;       // Default: 3
  ttlSeconds: number;       // Default: 30
  enableTelemetry: boolean; // Default: false
}
```

### Privacy Configuration

```typescript
interface PrivacyConfig {
  enableSync: boolean;      // User consent for sync
  enableTelemetry: boolean; // User consent for metrics
  dataRetentionDays: number; // Default: 14
  redactPII: boolean;       // Default: true
}
```

## Troubleshooting

### Common Issues

1. **Sync Not Working**
   - Check WCSession activation status
   - Verify watch reachability
   - Check consent settings

2. **Data Conflicts**
   - Review conflict resolution logs
   - Check checksum mismatches
   - Verify timestamp accuracy

3. **Performance Issues**
   - Monitor payload sizes
   - Check batch configuration
   - Review retry patterns

### Debug Tools

```typescript
// Enable debug logging
WatchDataSync.setDebugMode(true);

// Get sync state
const state = sync.getState();
console.log('Sync state:', state);

// Monitor sync events
sync.on('sync_started', () => console.log('Sync started'));
sync.on('sync_completed', () => console.log('Sync completed'));
sync.on('sync_failed', (error) => console.error('Sync failed:', error));
```

## Future Enhancements

### Planned Features
- **Real-time sync**: WebSocket-based live updates
- **Conflict resolution UI**: User interface for resolving conflicts
- **Advanced telemetry**: Detailed performance metrics
- **Multi-device sync**: Support for multiple watches
- **Selective sync**: User-configurable sync preferences

### Performance Improvements
- **Compression**: Gzip compression for large payloads
- **Incremental sync**: Only sync changed fields
- **Smart batching**: AI-powered batch optimization
- **Predictive sync**: Pre-sync likely-needed data

## API Reference

### WatchDataSync Class

```typescript
class WatchDataSync {
  // Lifecycle
  initialize(): Promise<void>;
  startSync(): Promise<void>;
  stopSync(): Promise<void>;
  
  // Data operations
  requestData(models: ModelType[]): Promise<void>;
  proposeWatchSettings(settings: Partial<WatchScopedSettingsV1>): Promise<void>;
  publishChanges(model: ModelType, changes: any[]): Promise<void>;
  
  // State management
  getState(): SyncState;
  on(event: string, callback: Function): () => void;
}
```

### Event Types

```typescript
// Sync lifecycle events
'sync_started' | 'sync_completed' | 'sync_failed'

// Data events
'data_received' | 'data_sent' | 'data_conflict'

// Error events
'error_retry' | 'error_failed' | 'error_recovered'
```

## Compliance & Legal

### Privacy Requirements
- **GDPR Compliance**: User consent, data portability, right to deletion
- **CCPA Compliance**: California privacy rights, data transparency
- **App Store Guidelines**: Apple's privacy and data handling requirements

### Data Safety
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based access to sync operations
- **Audit Trail**: Complete logging of all sync operations
- **Data Minimization**: Only necessary data is synchronized

---

*This documentation is part of the Thoughtmarks Watch Companion implementation. For technical support or questions, refer to the main project documentation.*
