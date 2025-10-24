# Apple Watch Telemetry Usage Guide

## Overview

Watch telemetry captures user interactions, AI features, and system health metrics from the Apple Watch companion app. All events follow the event taxonomy defined in `docs/telemetry/WATCH_EVENTS.md`.

## Event Categories

### 1. AI Events (`ai_*`)

#### AI Next Action Requested
```typescript
import { telemetryService } from '../services/telemetry/TelemetryService';

// When user requests AI next action on watch
telemetryService.track('ai_next_action_requested', {
  thoughtmark_id: thoughtmark.id,
  context_size: thoughtmark.content.length,
  provider_status: 'openai_available',
  source: 'watch_complication',
  timestamp: Date.now()
});
```

#### AI Insight Displayed
```typescript
// When AI insight is shown on watch face
telemetryService.track('ai_insight_displayed', {
  insight_id: insight.id,
  thoughtmark_id: thoughtmark.id,
  display_location: 'watch_complication',
  context_size: insight.context.length,
  provider_status: 'anthropic_available',
  timestamp: Date.now()
});
```

#### AI Summary Generated
```typescript
// When AI generates a summary for watch
telemetryService.track('ai_summary_generated', {
  thoughtmark_id: thoughtmark.id,
  summary_length: summary.length,
  context_size: fullContext.length,
  provider_status: 'openai_available',
  generation_time_ms: Date.now() - startTime,
  replay_token: generateReplayToken(),
  timestamp: Date.now()
});
```

### 2. Watch Events (`watch_*`)

#### Watch Complication Tapped
```typescript
// When user taps watch complication
telemetryService.track('watch_complication_tapped', {
  complication_type: 'today_insight',
  screen_opened: 'thoughtmark_detail',
  timestamp: Date.now()
});
```

#### Watch Live Activity Updated
```typescript
// When Live Activity state changes
telemetryService.track('watch_live_activity_updated', {
  activity_type: 'voice_recording',
  state: 'recording',
  duration_seconds: 45,
  thoughtmark_id: recording.thoughtmarkId,
  timestamp: Date.now()
});
```

#### Watch Siri Shortcut Invoked
```typescript
// When Siri shortcut is triggered on watch
telemetryService.track('watch_siri_shortcut_invoked', {
  shortcut_type: 'search_thoughtmarks',
  query: redactedQuery, // PII-redacted
  results_count: results.length,
  timestamp: Date.now()
});
```

### 3. App Events (`app_*`)

#### App Background Sync
```typescript
// When watch syncs data in background
telemetryService.track('app_background_sync', {
  sync_type: 'watch_to_phone',
  items_synced: syncedItems.length,
  duration_ms: syncDuration,
  success: true,
  timestamp: Date.now()
});
```

#### App Health Check
```typescript
// Periodic health check from watch
telemetryService.track('app_health_check', {
  device_type: 'watch',
  battery_level: batteryLevel,
  storage_available_mb: storageAvailable,
  connectivity_status: 'wifi_cellular',
  timestamp: Date.now()
});
```

## Telemetry Parity Requirements

### Required Fields Alignment

All `watch_*` events should have corresponding `ai_*` or `app_*` siblings where AI features are involved:

| watch_* Event | Corresponding ai_* Event | Shared Fields |
|--------------|-------------------------|---------------|
| `watch_ai_next_action_tap` | `ai_next_action_requested` | `thoughtmark_id`, `context_size`, `provider_status` |
| `watch_ai_insight_view` | `ai_insight_displayed` | `insight_id`, `context_size`, `display_location` |
| `watch_ai_summary_request` | `ai_summary_generated` | `thoughtmark_id`, `context_size`, `replay_token` |

### Replay Token Implementation

```typescript
import { generateReplayToken } from '../utils/telemetry';

// When tracking AI events, always include replay token
function trackAIEvent(eventName: string, properties: Record<string, any>) {
  const eventData = {
    ...properties,
    replay_token: generateReplayToken({
      eventName,
      timestamp: Date.now(),
      userId: currentUser.id,
      sessionId: currentSession.id
    }),
    timestamp: Date.now()
  };
  
  telemetryService.track(eventName, eventData);
}

// Usage
trackAIEvent('ai_next_action_requested', {
  thoughtmark_id: tm.id,
  context_size: tm.content.length,
  provider_status: 'openai_available',
  fallback_reason: null
});
```

### Fallback Reason Tracking

```typescript
// When AI provider fails and falls back
telemetryService.track('ai_provider_fallback', {
  original_provider: 'openai',
  fallback_provider: 'anthropic',
  fallback_reason: 'rate_limit_exceeded',
  thoughtmark_id: tm.id,
  context_size: tm.content.length,
  timestamp: Date.now()
});
```

## Privacy & Redaction

### PII Redaction

All watch telemetry must use `DataRedactor` for PII scrubbing:

```typescript
import { dataRedactor } from '../services/telemetry/DataRedactor';

// Redact user input before tracking
const redactedQuery = dataRedactor.redactData(userQuery);

telemetryService.track('watch_search_performed', {
  query: redactedQuery, // PII-safe
  results_count: results.length,
  timestamp: Date.now()
});
```

### Watch Surface Redaction

```typescript
// Complication text redaction
function getComplicationText(thoughtmark: Thoughtmark): string {
  const title = dataRedactor.redactData(thoughtmark.title);
  
  return {
    shortText: title.substring(0, 20),
    longText: title.substring(0, 40),
    privacyMode: 'always', // Never show PII on complications
    timestamp: Date.now()
  };
}
```

## Performance Considerations

### Battery Budget

Watch telemetry is subject to battery budget constraints:

```typescript
const WATCH_TELEMETRY_CONFIG = {
  batchSize: 10, // Events per batch
  flushInterval: 30000, // 30 seconds
  maxQueueSize: 50, // Max queued events
  cpuBudget: 5, // Max 5% CPU usage
  memoryBudget: 10485760, // 10MB max
  refreshCadence: 1800000 // 30 minutes
};

// Batch events to reduce overhead
telemetryService.batch([
  { event: 'watch_screen_view', properties: {...} },
  { event: 'watch_interaction', properties: {...} },
  { event: 'watch_health_check', properties: {...} }
]);
```

### Network Efficiency

```typescript
// Only sync when on WiFi/Cellular (not Bluetooth-only)
function shouldSyncTelemetry(): boolean {
  const connectivityStatus = getConnectivityStatus();
  
  return connectivityStatus === 'wifi' || connectivityStatus === 'cellular';
}

// Defer sync if battery is low
function deferSyncIfNeeded(): boolean {
  const batteryLevel = getBatteryLevel();
  
  return batteryLevel < 20; // Defer if <20% battery
}
```

## Validation

### Schema Validation

```bash
# Validate telemetry schema compliance
node scripts/validate-telemetry-schema.cjs --watch-events

# Output:
# ✅ All watch events comply with schema
# ✅ AI/watch event parity verified
# ✅ Replay tokens present for all ai_* events
# ✅ PII redaction applied to all user content
```

### Event Testing

```typescript
describe('Watch Telemetry', () => {
  it('should track AI next action with all required fields', async () => {
    const eventPromise = waitForEvent('ai_next_action_requested');
    
    await requestNextAction(thoughtmark);
    
    const event = await eventPromise;
    expect(event).toHaveProperty('thoughtmark_id');
    expect(event).toHaveProperty('context_size');
    expect(event).toHaveProperty('provider_status');
    expect(event).toHaveProperty('replay_token');
    expect(event).toHaveProperty('timestamp');
  });
  
  it('should redact PII in watch search queries', async () => {
    const query = 'Find my email john@example.com';
    const eventPromise = waitForEvent('watch_search_performed');
    
    await performSearch(query);
    
    const event = await eventPromise;
    expect(event.query).not.toContain('john@example.com');
    expect(event.query).toContain('[REDACTED_EMAIL]');
  });
});
```

## Debugging

### Event Inspection

```typescript
// Enable telemetry debugging on watch
if (__DEV__) {
  telemetryService.enableDebug({
    logEvents: true,
    validateSchema: true,
    checkParity: true,
    showReplayTokens: true
  });
}

// Example debug output:
// [Telemetry] ai_next_action_requested
//   • thoughtmark_id: "tm-123"
//   • context_size: 150
//   • provider_status: "openai_available"
//   • replay_token: "rpt_1234567890_abcdef"
//   • Parity: ✅ Matches watch_ai_next_action_tap
//   • Redaction: ✅ No PII detected
```

### Common Issues

#### Missing Replay Tokens
```typescript
// ❌ INCORRECT - Missing replay token
telemetryService.track('ai_summary_generated', {
  thoughtmark_id: tm.id,
  context_size: tm.content.length
});

// ✅ CORRECT - Includes replay token
telemetryService.track('ai_summary_generated', {
  thoughtmark_id: tm.id,
  context_size: tm.content.length,
  replay_token: generateReplayToken()
});
```

#### PII Not Redacted
```typescript
// ❌ INCORRECT - Raw user content
telemetryService.track('watch_note_created', {
  note_content: userNote // Contains PII!
});

// ✅ CORRECT - Redacted content
telemetryService.track('watch_note_created', {
  note_content: dataRedactor.redactData(userNote)
});
```

## References

- **Event Taxonomy**: `docs/telemetry/WATCH_EVENTS.md`
- **Telemetry Service**: `src-nextgen/services/telemetry/TelemetryService.ts`
- **Data Redactor**: `src-nextgen/services/telemetry/DataRedactor.ts`
- **Watch AI Readiness**: `docs/watch/WATCH_AI_READINESS.md`
- **Performance Budgets**: `docs/perf/watch-budgets-report.md`

