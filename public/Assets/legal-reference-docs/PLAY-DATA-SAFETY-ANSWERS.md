# Google Play Data Safety Answers (Prefill)

This document mirrors Play Console Data Safety. It must align with inventories and iOS privacy manifest.

## Data Collected & Shared

- Collected:
  - Crash Data (Diagnostics)
  - Performance Data (Diagnostics/Performance)
  - Audio Data (User-provided voice notes for app functionality)
- Shared: No (data not shared with third parties for tracking/ads)

## Purpose of Collection

- App Functionality (voice capture → thoughtmarks)
- Analytics (aggregate performance/crash metrics)
- Security/Fraud Prevention: N/A (no PII processed)

## Optionality & User Choice

- Optional collection gated by in-app consent (ConsentManager)
- Users can opt-out via Settings → Privacy & Data

## Data Handling & Safety Practices

- Encryption in transit: Yes (TLS)
- Encryption at rest: Platform defaults; user content local unless user opts to sync/export
- Data deletion: User can delete content and revoke consent at any time
- Cleartext traffic: Not permitted; Network Security Config enforces TLS

## Permissions Review

- AndroidManifest declares only necessary permissions
- Microphone permission used solely for voice notes creation

Keep this file synchronized with `validations/p5-slice-02/artifacts/privacy/*.json` outputs.
