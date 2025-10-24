# App Store Privacy Answers (Prefill)

This document mirrors the App Store Connect privacy questionnaire. It must match `ios/*/PrivacyInfo.xcprivacy` and our inventories.

- Data Linked to User: No (default) — app avoids linkage unless account-specific features require it
- Used for Tracking: No — ATT tracking not used

## Data Types Collected

- Crash Data: App Functionality, Analytics; Not Linked; Not Used for Tracking
- Performance Data: App Functionality, Analytics; Not Linked; Not Used for Tracking
- Audio Data (User-provided voice notes): App Functionality; Not Linked; Not Used for Tracking
- Other Diagnostic Data: App Functionality, Analytics; Not Linked; Not Used for Tracking

## Purposes

- App Functionality: voice-to-thoughtmark, error diagnostics
- Analytics: aggregate performance/crash metrics
- Developer Communications: N/A
- Fraud Prevention/Security: N/A (no PII); platform safeguards used
- Personalization/Advertising: Disabled by default

## User Choice & Retention

- Consent: In-app ConsentManager gates analytics/crash reporting; defaults to off
- Opt-out: Toggle in Settings → Privacy & Data
- Retention: Diagnostic data retained per platform defaults; user voice notes remain on-device unless user opts to sync/export
- Deletion: Users can delete content and revoke consent at any time

## Required Reason APIs (Accessed API Types)

- Microphone: Record voice to create thoughtmarks
- User Defaults: Store user preferences & privacy toggles
- File Timestamp: Manage and sort user-created content
- System Boot Time: Diagnostics (if applicable)

This file is authored from inventories under `validations/p5-slice-02/artifacts/`. Keep in sync via privacy validation guard.
