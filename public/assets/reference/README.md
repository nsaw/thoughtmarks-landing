# Thoughtmarks Reference Documentation

**Last Updated**: October 23, 2025  
**Project**: Thoughtmarks Mobile & Watch Apps  
**Purpose**: Support, about, and operational runbook documentation

---

## Overview

This directory contains comprehensive reference documentation for:
- **About & Support**: User-facing screens and content
- **User Guides**: In-app help and guidance
- **Runbooks**: Operational and incident response procedures
- **Watch App**: Apple Watch companion documentation
- **Localization**: Multi-language support content

---

## Table of Contents

1. [App Screens](#app-screens)
2. [User Guide Content](#user-guide-content)
3. [Runbooks](#runbooks)
4. [Watch App Documentation](#watch-app-documentation)
5. [Localization Files](#localization-files)
6. [Support Resources](#support-resources)

---

## App Screens

### Settings About Screen
**File**: `SettingsAboutScreen.tsx`  
**Type**: React Native TypeScript Component  
**Purpose**: Display app information, version, and support links

**Features**:
- App version and build number display
- Platform-specific version formatting (iOS/Android)
- Copyright notice
- Tagline display
- Support links:
  - Help & Support → `https://thoughtmarks.app/support`
  - Send Feedback → `mailto:support@thoughtmarks.app?subject=Thoughtmarks%20Feedback`

**Key Components**:
- `VersionPinningService` integration for version info
- Multi-platform support (iOS, Android, Web)
- Responsive design with semantic theming
- i18n support

---

### Help Screen
**File**: `HelpScreen.tsx`  
**Type**: React Native TypeScript Component  
**Purpose**: Help and support navigation screen

**Features**:
- Contact Support → `https://thoughtmarks.app/support`
- Frequently Asked Questions → `https://thoughtmarks.app/docs`
- Send Feedback → `mailto:support@thoughtmarks.app?subject=Thoughtmarks Support`
- Report a Bug → `mailto:support@thoughtmarks.app?subject=Bug Report`

**Integration**:
- Settings navigation
- External link handling with `Linking` API
- Error handling for unavailable links
- Accessibility support

---

### User Guide Screen
**File**: `UserGuideScreen.tsx`  
**Type**: React Native TypeScript Component  
**Purpose**: Interactive in-app user guide with expandable sections

**Guide Sections**:
1. **Getting Started**
   - What are Thoughtmarks
   - Quick capture methods
   - Types of thoughtmarks
   - Organization basics

2. **Thoughtmarks**
   - Editing and expanding
   - Pinning and sharing
   - Filtering and categorization

3. **Bins**
   - Smart folder system
   - Creating and managing bins
   - Tag-based organization

4. **Voice**
   - Voice recording
   - Watch app sync
   - Transcription review

5. **AI Tools**
   - Insights and themes
   - Related thoughtmarks
   - Natural language queries

6. **Search**
   - Global search
   - Filters and tags
   - Recent searches

7. **Settings**
   - Theme customization
   - Account management
   - Privacy and backup

8. **Tips**
   - Power user features
   - Tag organization
   - Workflow optimization

**Features**:
- Expandable/collapsible sections
- Formatted text with bold support
- Navigation to Help and About screens
- Semantic theming

---

### Settings User Guide Screen
**File**: `SettingsUserGuideScreen.tsx`  
**Type**: React Native TypeScript Component  
**Purpose**: Alternative user guide screen accessible from settings

**Differences**:
- Integrated into settings navigation flow
- May have different styling or layout
- Settings-specific guidance

---

## User Guide Content

### User Guide Index
**File**: `USER_GUIDE_INDEX.md`  
**Type**: Markdown Documentation  
**Purpose**: Comprehensive user guide structure and content index

**Sections**:
- Getting Started
  - What is Thoughtmarks
  - Account creation
  - First thoughtmark
  - Interface overview

- Core Features
  - Creating thoughtmarks (text, voice, quick capture)
  - Organization (bins, tags, folders)
  - Search and discovery
  - Voice recording and transcription

- Advanced Features
  - AI-powered insights
  - Smart search
  - Recommendations
  - Batch operations

- Settings and Customization
  - Theme customization
  - Notification preferences
  - Privacy controls
  - Backup and sync

- Apple Watch Integration
  - Quick voice capture
  - Complication setup
  - Sync settings
  - Offline mode

- Account Management
  - Profile settings
  - Subscription management
  - Data export
  - Account deletion

- Privacy and Security
  - Biometric authentication
  - Data encryption
  - Privacy settings
  - GDPR/CCPA rights

- Troubleshooting
  - Common issues
  - Sync problems
  - Performance optimization
  - Contact support

- Community and Support
  - User community
  - Developer resources
  - FAQ
  - Contact information

**Contact Information**:
- Email Support: `support@thoughtmarks.app`
- In-App Support
- Live Chat (business hours)
- Phone Support (premium users)

**Support Hours**:
- Monday-Friday, 9 AM - 6 PM PST
- 24/7 support for critical issues

---

### User Guide Localization
**File**: `userGuide.json`  
**Type**: JSON i18n Translation File  
**Languages**: English, Spanish, German  
**Purpose**: User guide translations for multi-language support

---

## Runbooks

### Operator Runbook
**File**: `runbooks/OPERATOR_RUNBOOK.md`  
**Type**: Operational Documentation  
**Purpose**: Primary operational procedures and incident response

**Topics Covered**:
- System architecture overview
- Deployment procedures
- Monitoring and alerting
- Incident response
- Rollback procedures
- Debugging guides
- Performance optimization
- Security incident handling

---

### Reliability Runbooks
**File**: `runbooks/RUNBOOKS.md`  
**Type**: Operational Documentation  
**Purpose**: Reliability and SLO-focused operational procedures

**Topics Covered**:
- Service Level Objectives (SLOs)
- Incident response playbooks
- Circuit breaker procedures
- Degraded mode operations
- Recovery procedures

---

### Entitlements Runbook
**File**: `runbooks/ENTITLEMENTS_RUNBOOK.md`  
**Type**: Operational Documentation  
**Purpose**: In-App Purchase and entitlement management procedures

**Topics Covered**:
- IAP configuration
- Entitlement verification
- Subscription management
- Receipt validation
- Refund processing
- Troubleshooting purchase issues

---

### IAP Incidents
**File**: `runbooks/iap-incidents.md`  
**Type**: Incident Response Guide  
**Purpose**: In-App Purchase incident response procedures

**Topics Covered**:
- Common IAP issues
- Incident classification
- Resolution procedures
- User communication templates
- Escalation paths

---

### Watch Build Runbook
**File**: `runbooks/WATCH_BUILD_RUNBOOK.md`  
**Type**: Build Procedures  
**Purpose**: Apple Watch build and deployment procedures

**Topics Covered**:
- Watch extension build setup
- Code signing for watch
- Deployment to TestFlight
- App Store submission
- Troubleshooting build issues

---

### Watch Build Runbook (Detailed)
**File**: `runbooks/WATCH_BUILD_RUNBOOK_detailed.md`  
**Type**: Build Procedures (Extended)  
**Purpose**: Comprehensive watch build procedures with detailed steps

---

### Integration Guide
**File**: `runbooks/INTEGRATION_GUIDE.md`  
**Type**: Integration Documentation  
**Purpose**: System integration and reliability patterns

---

### SLO Policy
**File**: `runbooks/SLO_POLICY.md`  
**Type**: Policy Documentation  
**Purpose**: Service Level Objective definitions and monitoring

---

## Watch App Documentation

### Apple Watch Companion Plan
**File**: `watch/APPLE-WATCH-COMPANION-PLAN.md`  
**Type**: Planning Documentation  
**Purpose**: Apple Watch companion app architecture and implementation plan

**Topics Covered**:
- Watch app structure
- Communication layer (WCSession)
- Voice recording service
- User experience design
- Siri integration
- Sync strategy
- Technical architecture

**Key Components**:
- `WCSessionManager` - Watch connectivity
- `WatchBridge` - React Native bridge
- `WatchVoiceCapture` - Voice recording
- `WatchQueue` - Offline-first queue
- `WatchSecurity` - Security and privacy
- `WatchService` - Main coordinator
- `WatchDataSync` - Data synchronization

---

### Watch Companion Documentation
**File**: `watch/watch-companion.md`  
**Type**: Technical Documentation  
**Purpose**: Watch companion system architecture and implementation

**Topics Covered**:
- Core components overview
- Service integration
- WCSession management
- Voice capture implementation
- Offline-first queuing
- Security and PII redaction
- Data synchronization

---

### Watch Data Sync
**File**: `watch/watch-datasync.md`  
**Type**: Technical Documentation  
**Purpose**: Data synchronization between iPhone and Apple Watch

**Topics Covered**:
- Sync architecture
- Conflict resolution policies
- Bidirectional sync
- Incremental sync
- Offline support
- Background sync

---

### Watch Telemetry Usage
**File**: `watch/WATCH_TELEMETRY_USAGE.md`  
**Type**: Privacy & Analytics Documentation  
**Purpose**: Watch app telemetry and privacy practices

**Topics Covered**:
- Data collection on watch
- Privacy protections
- Differential privacy
- K-anonymity
- PII redaction
- Sync telemetry

---

### Watch Support URL
**File**: `watch/support-url.txt`  
**Type**: Plain Text  
**Content**: `https://support.thoughtmarks.app/watch`  
**Purpose**: Official watch app support URL

---

## Localization Files

### Supported Languages
- **English** (`en/`)
- **Spanish** (`es/`)
- **German** (`de/`)

### Translation Files

#### i18n/locales/en/ (English)
- `ai.json` - AI feature translations
- `coachmark.json` - Onboarding coach marks
- `common.json` - Common UI strings
- `dashboard.json` - Dashboard content
- `errors.json` - Error messages
- `notifications.json` - Notification strings
- `onboarding.json` - Onboarding flow
- `purchases.json` - In-app purchase strings
- `settings.json` - Settings screen translations
- `userGuide.json` - User guide content
- `voice.json` - Voice feature strings
- `widgets.json` - Widget content

#### i18n/locales/es/ (Spanish)
- `common.json`
- `errors.json`
- `notifications.json`
- `onboarding.json`
- `settings.json`
- `voice.json`
- `widgets.json`

#### i18n/locales/de/ (German)
- `common.json`
- `errors.json`
- `notifications.json`
- `onboarding.json`
- `settings.json`
- `voice.json`
- `widgets.json`

### Settings Translations (settings.json)

**Key Content Areas**:
- Account and profile settings
- Appearance (theme, dark mode, font size)
- Accessibility (reduce motion, high contrast, VoiceOver)
- Privacy controls (analytics, export, deletion)
- Support and about information
- Error messages
- Search functionality
- Sync status
- Quick actions

**Support Contact Info** (in settings.json):
- `support@thoughtmarks.app` - General support
- Support URL references
- Feedback mechanisms

---

## Support Resources

### Contact Information

**Email Addresses**:
- General Support: `support@thoughtmarks.app`
- Privacy: `privacy@thoughtmarks.app`
- Legal: `legal@thoughtmarks.app`
- Data Protection Officer: `dpo@thoughtmarks.app`
- GDPR Inquiries: `eu-privacy@thoughtmarks.app`
- CCPA Inquiries: `california-privacy@thoughtmarks.app`

**Support URLs**:
- General Support: `https://thoughtmarks.app/support`
- Documentation: `https://thoughtmarks.app/docs`
- Watch Support: `https://support.thoughtmarks.app/watch`

**Support Hours**:
- Standard Support: Monday-Friday, 9 AM - 6 PM PST
- Emergency Support: 24/7 for critical issues
- Response Times: Varies by issue type

---

## Directory Structure

```
public/assets/reference/
├── README.md                          # This file
│
├── App Screens (4 files)
├── SettingsAboutScreen.tsx           # About screen component
├── HelpScreen.tsx                     # Help & support screen
├── UserGuideScreen.tsx                # Interactive user guide
├── SettingsUserGuideScreen.tsx        # Settings-integrated guide
│
├── User Guide Documentation (2 files)
├── USER_GUIDE_INDEX.md               # Comprehensive guide index
├── userGuide.json                     # English guide translations
│
├── runbooks/ (8 files)
│   ├── OPERATOR_RUNBOOK.md           # Primary operational procedures
│   ├── RUNBOOKS.md                    # Reliability runbooks
│   ├── ENTITLEMENTS_RUNBOOK.md       # IAP management
│   ├── iap-incidents.md               # IAP incident response
│   ├── WATCH_BUILD_RUNBOOK.md         # Watch build procedures
│   ├── WATCH_BUILD_RUNBOOK_detailed.md # Detailed watch build
│   ├── INTEGRATION_GUIDE.md           # Integration patterns
│   └── SLO_POLICY.md                  # Service level objectives
│
├── watch/ (5 files)
│   ├── APPLE-WATCH-COMPANION-PLAN.md  # Watch app architecture
│   ├── watch-companion.md             # Watch companion system
│   ├── watch-datasync.md              # Watch data sync
│   ├── WATCH_TELEMETRY_USAGE.md       # Watch privacy/analytics
│   └── support-url.txt                # Watch support URL
│
└── i18n/locales/ (27 files)
    ├── en/ (11 files - English)
    │   ├── ai.json
    │   ├── coachmark.json
    │   ├── common.json
    │   ├── dashboard.json
    │   ├── errors.json
    │   ├── notifications.json
    │   ├── onboarding.json
    │   ├── purchases.json
    │   ├── settings.json
    │   ├── userGuide.json
    │   ├── voice.json
    │   └── widgets.json
    │
    ├── es/ (7 files - Spanish)
    │   ├── common.json
    │   ├── errors.json
    │   ├── notifications.json
    │   ├── onboarding.json
    │   ├── settings.json
    │   ├── voice.json
    │   └── widgets.json
    │
    └── de/ (7 files - German)
        ├── common.json
        ├── errors.json
        ├── notifications.json
        ├── onboarding.json
        ├── settings.json
        ├── voice.json
        └── widgets.json
```

---

## File Inventory

### App Screens (4 files)

| File | Type | Size | Purpose |
|------|------|------|---------|
| SettingsAboutScreen.tsx | TSX | ~9 KB | App version, support links |
| HelpScreen.tsx | TSX | ~4 KB | Help & support navigation |
| UserGuideScreen.tsx | TSX | ~10 KB | Interactive guide with 8 sections |
| SettingsUserGuideScreen.tsx | TSX | ~8 KB | Settings-integrated guide |

**Total**: ~31 KB

---

### User Guide (2 files)

| File | Type | Size | Purpose |
|------|------|------|---------|
| USER_GUIDE_INDEX.md | Markdown | ~15 KB | Comprehensive guide structure |
| userGuide.json | JSON | ~3 KB | English guide translations |

**Total**: ~18 KB

---

### Runbooks (8 files)

| File | Type | Size | Purpose |
|------|------|------|---------|
| OPERATOR_RUNBOOK.md | Markdown | ~25 KB | Primary ops procedures |
| RUNBOOKS.md | Markdown | ~15 KB | Reliability runbooks |
| ENTITLEMENTS_RUNBOOK.md | Markdown | ~12 KB | IAP management |
| iap-incidents.md | Markdown | ~8 KB | IAP incident response |
| WATCH_BUILD_RUNBOOK.md | Markdown | ~10 KB | Watch build procedures |
| WATCH_BUILD_RUNBOOK_detailed.md | Markdown | ~35 KB | Detailed watch build |
| INTEGRATION_GUIDE.md | Markdown | ~20 KB | Integration patterns |
| SLO_POLICY.md | Markdown | ~10 KB | Service level objectives |

**Total**: ~135 KB

---

### Watch Documentation (5 files)

| File | Type | Size | Purpose |
|------|------|------|---------|
| APPLE-WATCH-COMPANION-PLAN.md | Markdown | ~30 KB | Architecture plan |
| watch-companion.md | Markdown | ~15 KB | System overview |
| watch-datasync.md | Markdown | ~20 KB | Data sync details |
| WATCH_TELEMETRY_USAGE.md | Markdown | ~12 KB | Privacy/analytics |
| support-url.txt | Text | <1 KB | Support URL |

**Total**: ~77 KB

---

### Localization (27 files)

| Language | Files | Total Size | Coverage |
|----------|-------|------------|----------|
| English (en) | 11 files | ~45 KB | Full coverage |
| Spanish (es) | 7 files | ~20 KB | Core features |
| German (de) | 7 files | ~20 KB | Core features |

**Total**: ~85 KB

---

## Content Highlights

### About Screen Content

**Version Display**:
- iOS: Version with build number
- Android: Version with version code
- Web: Version only

**Company Information**:
- App Name: Thoughtmarks
- Tagline: Configurable via i18n
- Copyright: Dynamic year calculation

**Support Links**:
- Primary: `https://thoughtmarks.app/support`
- Feedback: `support@thoughtmarks.app`

---

### Help & Support Content

**Help Categories**:
1. **Contact Support** - General support team
2. **FAQ** - Common questions and answers
3. **Send Feedback** - Feature requests and suggestions
4. **Report a Bug** - Issue reporting

**External Links**:
- Support Portal: `https://thoughtmarks.app/support`
- Documentation: `https://thoughtmarks.app/docs`
- Email Support: `support@thoughtmarks.app`

---

### User Guide Topics

**8 Main Sections**:
1. Getting Started (What are thoughtmarks, quick capture, organization)
2. Thoughtmarks (Edit, pin, share, filter)
3. Bins (Smart folders, tagging, management)
4. Voice (Recording, watch sync, transcription)
5. AI Tools (Insights, related items, natural queries)
6. Search (Global search, filters, recent searches)
7. Settings (Theme, account, privacy, backup)
8. Tips (Power features, workflow optimization)

**Interactive Features**:
- Expandable/collapsible sections
- Formatted text with bold support
- Navigation to related screens
- Context-aware help

---

## Runbook Categories

### Operational Runbooks

**OPERATOR_RUNBOOK.md**:
- Deployment procedures
- Monitoring setup
- Incident classification
- Response procedures
- Rollback strategies
- Performance debugging

**RUNBOOKS.md**:
- SLO monitoring
- Circuit breaker patterns
- Degraded mode operations
- Recovery procedures
- Health checks

---

### Feature-Specific Runbooks

**ENTITLEMENTS_RUNBOOK.md**:
- IAP configuration
- Purchase flows
- Receipt validation
- Subscription management
- Refund handling

**iap-incidents.md**:
- Purchase failures
- Sync issues
- Receipt validation errors
- Subscription state conflicts
- User communication

---

### Build & Deployment Runbooks

**WATCH_BUILD_RUNBOOK.md**:
- Watch extension setup
- Build configuration
- Code signing
- TestFlight deployment
- App Store submission

**WATCH_BUILD_RUNBOOK_detailed.md**:
- Detailed build steps
- Troubleshooting procedures
- Platform-specific issues
- Version management
- Release checklist

---

### Integration Runbooks

**INTEGRATION_GUIDE.md**:
- System integration patterns
- API integration
- Third-party services
- Security considerations
- Error handling

**SLO_POLICY.md**:
- SLO definitions
- Monitoring thresholds
- Alerting policies
- Escalation procedures
- Performance targets

---

## Watch App Integration

### Architecture

**Core Components**:
- `WCSessionManager` - Watch Connectivity sessions
- `WatchBridge` - React Native bridge
- `WatchVoiceCapture` - Voice recording
- `WatchQueue` - Offline-first queue
- `WatchSecurity` - Security and privacy
- `WatchService` - Main coordinator
- `WatchDataSync` - Data synchronization

### Features

**Voice Capture**:
- Quick recording on watch
- Automatic transcription
- Sync to iPhone
- Offline queue support

**Data Sync**:
- Bins synchronization
- Tags synchronization
- Settings synchronization
- Bidirectional sync
- Conflict resolution

**User Interface**:
- Main screen with record button
- Recent thoughtmarks list
- Settings screen
- Complications support

---

## Localization Coverage

### Full Coverage (English)
- All features and screens
- Error messages
- Help content
- User guide
- Settings

### Partial Coverage (Spanish, German)
- Core features
- Common UI strings
- Essential errors
- Basic settings
- Voice features

### Translation Keys

**Settings Translations** include:
- About, Support, Help titles
- Privacy controls
- Data export/deletion
- Version information
- Contact information
- Error messages
- Accessibility labels

---

## Usage

### For Developers

**App Screens**:
- Reference `SettingsAboutScreen.tsx` for version display patterns
- Reference `HelpScreen.tsx` for external link handling
- Reference `UserGuideScreen.tsx` for expandable content patterns

**Localization**:
- Use `i18n/locales/en/settings.json` as translation template
- Add new languages by creating language-specific directories
- Follow existing key structure for consistency

**Runbooks**:
- Follow `OPERATOR_RUNBOOK.md` for incident response
- Reference `RUNBOOKS.md` for reliability patterns
- Use `ENTITLEMENTS_RUNBOOK.md` for IAP procedures

---

### For Support Teams

**Help Resources**:
- Reference `USER_GUIDE_INDEX.md` for comprehensive help topics
- Use `HelpScreen.tsx` for in-app support flow
- Check `userGuide.json` for user-facing content

**Incident Response**:
- Follow `OPERATOR_RUNBOOK.md` for general incidents
- Use `iap-incidents.md` for purchase issues
- Reference `SLO_POLICY.md` for severity classification

**Watch Support**:
- Reference `watch-companion.md` for architecture
- Use `watch-datasync.md` for sync issues
- Check `support-url.txt` for official watch support link

---

### For Product Teams

**Feature Content**:
- Review `UserGuideScreen.tsx` for user-facing descriptions
- Check `USER_GUIDE_INDEX.md` for comprehensive feature list
- Reference `APPLE-WATCH-COMPANION-PLAN.md` for watch features

**Localization Needs**:
- Review `settings.json` for support contact info
- Check coverage in `es/` and `de/` directories
- Plan additional language support

---

## Maintenance

### Updating Support Content

**When adding new features**:
1. Update `UserGuideScreen.tsx` with new guide section
2. Add translations to `userGuide.json` and localized files
3. Update `USER_GUIDE_INDEX.md` with new topics
4. Update About screen if version changes

**When changing support URLs**:
1. Update `HelpScreen.tsx` component
2. Update `SettingsAboutScreen.tsx` component
3. Update `watch/support-url.txt`
4. Update contact info in settings translations

**When updating runbooks**:
1. Keep `OPERATOR_RUNBOOK.md` as primary reference
2. Add feature-specific runbooks to `runbooks/` directory
3. Update SLO definitions in `SLO_POLICY.md`
4. Document new incidents in relevant runbook

---

### Version Control

- Track all changes in git
- Update effective dates in documentation
- Version runbooks with significant changes
- Maintain changelog for user-facing content

---

### Testing

**Screen Testing**:
- Test About screen version display on all platforms
- Test Help screen external links
- Test UserGuide expandable sections
- Test localization switching

**Content Testing**:
- Verify support URLs are accessible
- Test email links open correctly
- Verify runbook procedures are current
- Test watch sync documentation accuracy

---

## Related Documentation

- **Legal**: `/public/legal/Legal-reference-docs/` - Legal documents
- **Privacy**: Referenced in legal docs
- **API**: See integration guides in runbooks
- **Architecture**: See watch companion documentation

---

**Grand Total**: ~346 KB of reference documentation across 46 files

**Maintained By**: Thoughtmarks Product & Support Teams  
**Version**: 1.0  
**Last Audit**: October 23, 2025

