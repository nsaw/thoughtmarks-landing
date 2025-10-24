# Legal Documentation Index

**Last Updated**: October 23, 2025  
**Project**: Thoughtmarks Mobile App  
**Path**: `/docs/legal/`

---

## Overview

This directory consolidates all legal documentation for the Thoughtmarks application, including user-facing legal documents, privacy policies, compliance documentation, and store submission materials.

---

## Table of Contents

1. [Core Legal Documents](#core-legal-documents)
2. [Privacy & Compliance](#privacy--compliance)
3. [App Store & Play Store](#app-store--play-store)
4. [Platform-Specific Privacy](#platform-specific-privacy)
5. [Implementation & Enforcement](#implementation--enforcement)
6. [Source Code](#source-code)
7. [Document References in Code](#document-references-in-code)

---

## Core Legal Documents

These are the primary user-facing legal documents displayed in the app:

### 1. Privacy Policy
**File**: `privacy-policy.md`  
**Effective Date**: October 1, 2025  
**Referenced In**:
- `LegalDocumentScreen.tsx` (line 27)
- `SettingsPrivacyScreen.tsx` (line 261)

**Content Summary**:
- Introduction and scope
- Information collection (user-provided and automatic)
- How data is used
- AI and machine learning data usage
- Data sharing and disclosure practices
- Data security measures
- User rights (GDPR, CCPA)
- Data retention policies
- International data transfers
- Children's privacy
- Contact information

**Key Compliance**: GDPR, CCPA, international data protection laws

---

### 2. Terms of Service
**File**: `terms-of-service.md`  
**Effective Date**: October 1, 2025  
**Referenced In**:
- `LegalDocumentScreen.tsx` (line 30)
- `SettingsPrivacyScreen.tsx` (line 264)

**Content Summary**:
- Agreement to terms
- Eligibility requirements (13+ years)
- Account creation and security
- Subscription and payments
- Acceptable use policy
- Content ownership and licensing
- AI features and machine learning
- Intellectual property rights
- Third-party services
- Disclaimers and limitations of liability
- Dispute resolution
- Governing law

**Key Provisions**:
- Age requirement: 13+ years
- Account security responsibilities
- Subscription billing and cancellation
- User content ownership
- Prohibited activities
- Arbitration for US users

---

### 3. Data Collection & Usage Policy
**File**: `data-collection-usage.md`  
**Effective Date**: October 1, 2025  
**Referenced In**:
- `LegalDocumentScreen.tsx` (line 35)
- `SettingsPrivacyScreen.tsx` (line 268)

**Content Summary**:
- Data collection framework and principles
- Detailed breakdown of data categories:
  - Account data
  - Content data
  - Usage data
  - Device data
  - Location data
  - Communication data
- How data is used (service delivery, AI/ML, analytics)
- Data sharing with service providers
- User rights and controls
- Data security measures
- Data retention schedules
- International data transfers

**Key Features**:
- Comprehensive data type mapping
- Retention period tables
- Service provider list
- User control mechanisms

---

### 4. AI & Machine Learning Usage Policy
**File**: `ai-ml-usage.md`  
**Effective Date**: October 1, 2025  
**Referenced In**:
- `LegalDocumentScreen.tsx` (line 39)
- `SettingsPrivacyScreen.tsx` (line 272)

**Content Summary**:
- AI features and capabilities:
  - Voice transcription
  - Semantic search
  - Smart suggestions
  - AI writing assistant
  - Intelligent reminders
  - Content analysis
- Processing options:
  - On-device processing (privacy-first)
  - Cloud-encrypted processing
  - Standard cloud processing
- AI data usage and protection
- Transparency and explainability
- User rights and controls
- AI safety and fairness
- Third-party AI services
- Model training and improvement

**Key Features**:
- Three processing tiers with privacy tradeoffs
- Detailed AI capability descriptions
- Transparency requirements
- Opt-out mechanisms

---

## Privacy & Compliance

### Privacy Policy Compliance
**File**: `PRIVACY_POLICY_COMPLIANCE.md`  
**Phase**: P7 Slice-09 - Analytics, Experimentation & Growth Loop

**Content Summary**:
- Privacy-first principles
- Zero PII transmission guarantee
- Differential privacy implementation (ε=0.1 Laplace noise)
- K-anonymity (k≥5 cohort grouping)
- User control mechanisms
- GDPR/CCPA compliance
- Data retention (90-day automatic deletion)
- Encryption standards (TLS 1.3, AES-256)

**Key Guarantees**:
- No thoughtmark content in analytics
- All user IDs hashed (SHA-256)
- Differential privacy on numeric data
- K-anonymity for user grouping
- Full export, deletion, opt-out capabilities

---

### Privacy Manifests
**File**: `PRIVACY_MANIFEST_FINAL.md`  
**File**: `PRIVACY_MANIFEST_EVIDENCE.md`

**Content Summary**:
- iOS Privacy Manifest (PrivacyInfo.xcprivacy)
- Required reasons API declarations
- Privacy nutrition labels
- Data collection justifications
- Evidence of compliance
- Tracking domain declarations

---

### User Rights Operations
**File**: `USER_RIGHTS_OPERATIONS.md`

**Content Summary**:
- GDPR right to access implementation
- CCPA data deletion procedures
- Data portability mechanisms
- User consent management
- Opt-out procedures
- Data subject request workflows

---

## App Store & Play Store

### App Store Privacy Labels
**File**: `APP_STORE_PRIVACY_LABELS.md`

**Content Summary**:
- Product interaction data
- Analytics data
- Diagnostic data
- Contact information
- User content
- Identifiers (hashed)
- Privacy protections for each category
- Differential privacy implementation
- K-anonymity guarantees

**Key Labels**:
- Data Linked to You: Hashed user ID, analytics
- Data Not Linked to You: Crash logs, performance metrics
- Data Not Collected: Thoughtmark content, exact location, biometrics

---

### App Store Privacy Answers
**File**: `APP-STORE-PRIVACY-ANSWERS.md`

**Content Summary**:
- App Store Connect privacy questionnaire answers
- Data collection justifications
- Third-party data sharing disclosures
- Tracking disclosures

---

### Google Play Data Safety
**File**: `PLAY-DATA-SAFETY-ANSWERS.md`  
**File**: `play-data-safety.md`

**Content Summary**:
- Play Store Data Safety form responses
- Android-specific privacy disclosures
- Data collection and sharing practices
- Security practices
- Data deletion procedures

---

## Platform-Specific Privacy

### iOS Privacy Coverage
**File**: `ios-privacy-coverage.md`

**Content Summary**:
- iOS-specific privacy implementations
- Privacy manifest compliance
- Required reasons API usage
- App Tracking Transparency (ATT) compliance
- Privacy nutrition labels

---

### Android Data Safety Coverage
**File**: `android-datasafety-coverage.md`

**Content Summary**:
- Android-specific privacy implementations
- Data Safety form compliance
- Permission usage justifications
- Data encryption practices
- Android privacy best practices

---

## Implementation & Enforcement

### Logging Policy
**File**: `logging-policy.md`

**Content Summary**:
- What gets logged (operations, not content)
- PII redaction requirements
- Log retention policies
- Security event logging
- Compliance logging

**Key Rules**:
- Never log thoughtmark content
- Never log passwords or auth tokens
- Hash all user identifiers
- Redact PII before logging
- 90-day retention for operational logs

---

### Redaction Enforcement
**File**: `REDACTION_ENFORCEMENT.md`  
**File**: `REDACTION_EVIDENCE.md`

**Content Summary**:
- PII redaction implementation
- Automated redaction systems
- Validation and testing
- Evidence of redaction compliance
- Audit trail requirements

**Key Features**:
- Automatic PII detection
- Pre-transmission redaction
- Validation tests
- Compliance evidence

---

## Source Code

### Legal Content Source (TypeScript)
**File**: `legal-content-source.ts`  
**Original Path**: `src-nextgen/content/legal/index.ts`

**Content Summary**:
This TypeScript file contains all four core legal documents as embedded strings for reliable React Native loading:

```typescript
export const PRIVACY_POLICY = `...`;
export const TERMS_OF_SERVICE = `...`;
export const DATA_COLLECTION = `...`;
export const AI_ML_USAGE = `...`;

export type DocumentType = 'privacy-policy' | 'terms-of-service' | 
                          'data-collection-usage' | 'ai-ml-usage';

export const getDocumentContent = (documentType: DocumentType): string => {
  // Returns the appropriate document content
};
```

**Why Both Formats?**:
- **Markdown files** (`.md`): Human-readable, version control friendly, documentation
- **TypeScript file** (`.ts`): Embedded in app bundle for offline access, reliable loading

---

## Document References in Code

### Settings Screens

#### LegalDocumentScreen.tsx
**Path**: `src-nextgen/screens/settings/LegalDocumentScreen.tsx`

**Document Metadata** (lines 23-44):
```typescript
const DOCUMENT_METADATA: Record<DocumentType, DocumentMetadata> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How we protect and handle your data',
    filename: 'privacy-policy.md',
  },
  'terms-of-service': {
    title: 'Terms of Service',
    subtitle: 'Terms and conditions for using Thoughtmarks',
    filename: 'terms-of-service.md',
  },
  'data-collection-usage': {
    title: 'Data Collection & Usage',
    subtitle: 'Detailed information about data practices',
    filename: 'data-collection-usage.md',
  },
  'ai-ml-usage': {
    title: 'AI & Machine Learning',
    subtitle: 'How AI features use and protect your data',
    filename: 'ai-ml-usage.md',
  },
};
```

**Content Loading** (line 64):
```typescript
const markdownContent = getDocumentContent(documentType as LegalDocType);
```

---

#### SettingsPrivacyScreen.tsx
**Path**: `src-nextgen/screens/settings/SettingsPrivacyScreen.tsx`

**Navigation to Legal Documents** (lines 260-274):
```typescript
const handleReadPolicy = () => {
  navigation.navigate('LegalDocument', { documentType: 'privacy-policy' });
};

const handleReadTerms = () => {
  navigation.navigate('LegalDocument', { documentType: 'terms-of-service' });
};

const handleReadDataCollection = () => {
  navigation.navigate('LegalDocument', { documentType: 'data-collection-usage' });
};

const handleReadAIPolicy = () => {
  navigation.navigate('LegalDocument', { documentType: 'ai-ml-usage' });
};
```

**UI Elements** (lines 389-424):
```typescript
<SettingsListItem
  icon={'tm.settings.shield' as IconKey}
  title="Privacy Policy"
  subtitle="How we protect and handle your data"
  onPress={handleReadPolicy}
  showChevron
  testID="row-settings-privacy-policy"
/>

<SettingsListItem
  icon={'tm.features.document-text' as IconKey}
  title="Terms of Service"
  subtitle="Terms and conditions for using Thoughtmarks"
  onPress={handleReadTerms}
  showChevron
  testID="row-settings-terms-of-service"
/>

<SettingsListItem
  icon={'tm.security.lock' as IconKey}
  title="Data Collection & Usage"
  subtitle="Detailed information about data practices"
  onPress={handleReadDataCollection}
  showChevron
  testID="row-settings-data-collection"
/>

<SettingsListItem
  icon={'tm.features.sparkles' as IconKey}
  title="AI & Machine Learning"
  subtitle="How AI features use and protect your data"
  onPress={handleReadAIPolicy}
  showChevron
  testID="row-settings-ai-policy"
/>
```

---

#### Other Settings Screens

**SettingsAboutScreen.tsx**:
- Links to support URL: `https://thoughtmarks.app/support`
- Feedback email: `mailto:support@thoughtmarks.app?subject=Thoughtmarks%20Feedback`

**SecurityScreen.tsx**:
- References privacy controls and data protection
- Biometric authentication policies

**DeviceManagementScreen.tsx**:
- Device trust and session management policies

**DataManagementScreen.tsx**:
- Data export, backup, and deletion features
- Privacy settings for data processing

**DeleteAccountScreen.tsx**:
- Account and data deletion policies
- Permanent deletion warnings

---

## Compliance Summary

### Legal Frameworks Covered

| Framework | Coverage | Documents |
|-----------|----------|-----------|
| **GDPR** | ✅ Full | Privacy Policy, Data Collection, User Rights Operations |
| **CCPA** | ✅ Full | Privacy Policy, Data Collection, User Rights Operations |
| **COPPA** | ✅ Age Gate (13+) | Terms of Service, Privacy Policy |
| **App Store Requirements** | ✅ Full | APP_STORE_PRIVACY_LABELS.md, Privacy Manifest |
| **Play Store Requirements** | ✅ Full | play-data-safety.md, android-datasafety-coverage.md |
| **Differential Privacy** | ✅ Implemented | PRIVACY_POLICY_COMPLIANCE.md |
| **K-Anonymity** | ✅ Implemented (k≥5) | PRIVACY_POLICY_COMPLIANCE.md |

### Privacy Guarantees

| Protection | Implementation | Document Reference |
|------------|----------------|-------------------|
| **Zero PII Transmission** | SHA-256 hashing | PRIVACY_POLICY_COMPLIANCE.md |
| **Differential Privacy** | Laplace noise (ε=0.1) | PRIVACY_POLICY_COMPLIANCE.md |
| **K-Anonymity** | Cohort bucketing (k=5) | PRIVACY_POLICY_COMPLIANCE.md |
| **Data Retention** | 90-day auto-deletion | Data Collection Policy |
| **Encryption** | TLS 1.3, AES-256 | Privacy Policy, Security docs |
| **User Rights** | Export, Delete, Opt-out | USER_RIGHTS_OPERATIONS.md |

---

## Directory Structure

```
docs/legal/
├── README.md                          # This file
├── privacy-policy.md                  # Core: Privacy Policy
├── terms-of-service.md                # Core: Terms of Service
├── data-collection-usage.md           # Core: Data Collection & Usage
├── ai-ml-usage.md                     # Core: AI & ML Usage
├── legal-content-source.ts            # Source code with embedded content
├── PRIVACY_POLICY_COMPLIANCE.md       # Analytics privacy compliance
├── PRIVACY_MANIFEST_FINAL.md          # iOS Privacy Manifest
├── PRIVACY_MANIFEST_EVIDENCE.md       # Privacy Manifest evidence
├── USER_RIGHTS_OPERATIONS.md          # GDPR/CCPA user rights
├── APP_STORE_PRIVACY_LABELS.md        # App Store privacy labels
├── APP-STORE-PRIVACY-ANSWERS.md       # App Store questionnaire
├── PLAY-DATA-SAFETY-ANSWERS.md        # Play Store data safety
├── play-data-safety.md                # Play Store data safety details
├── ios-privacy-coverage.md            # iOS-specific privacy
├── android-datasafety-coverage.md     # Android-specific privacy
├── logging-policy.md                  # Logging and PII policy
├── REDACTION_ENFORCEMENT.md           # PII redaction enforcement
└── REDACTION_EVIDENCE.md              # Redaction compliance evidence
```

---

## File Sizes

| File | Size | Lines |
|------|------|-------|
| legal-content-source.ts | 52.7 KB | 1,718 |
| USER_RIGHTS_OPERATIONS.md | 29.3 KB | ~900 |
| PRIVACY_POLICY_COMPLIANCE.md | 27.1 KB | ~1,064 |
| data-collection-usage.md | 25.0 KB | ~769 |
| ai-ml-usage.md | 24.7 KB | ~841 |
| APP_STORE_PRIVACY_LABELS.md | 18.9 KB | ~685 |
| terms-of-service.md | 19.7 KB | ~664 |
| privacy-policy.md | 17.3 KB | ~500 |
| android-datasafety-coverage.md | 11.8 KB | ~400 |
| ios-privacy-coverage.md | 11.3 KB | ~400 |
| PRIVACY_MANIFEST_FINAL.md | 9.4 KB | ~300 |
| REDACTION_EVIDENCE.md | 9.5 KB | ~300 |
| REDACTION_ENFORCEMENT.md | 9.2 KB | ~300 |
| logging-policy.md | 8.1 KB | ~250 |
| PRIVACY_MANIFEST_EVIDENCE.md | 4.9 KB | ~150 |
| play-data-safety.md | 4.5 KB | ~150 |
| APP-STORE-PRIVACY-ANSWERS.md | 1.7 KB | ~50 |
| PLAY-DATA-SAFETY-ANSWERS.md | 1.3 KB | ~40 |

**Total**: ~320 KB of legal documentation

---

## Maintenance

### Updating Legal Documents

When updating legal documents:

1. **Update the markdown files** in `docs/legal/`
2. **Update the TypeScript source** in `src-nextgen/content/legal/index.ts`
3. **Update the effective date** in all modified documents
4. **Update version numbers** if applicable
5. **Test in the app** using `LegalDocumentScreen`
6. **Notify users** of material changes (in-app + email)

### Version Control

- All changes to legal documents must be tracked in git
- Include clear commit messages explaining what changed
- Tag releases with legal document versions
- Maintain changelog for material changes

### Compliance Audits

- Review quarterly for compliance with GDPR, CCPA
- Verify privacy manifests match actual data collection
- Update store privacy labels if data practices change
- Test user rights operations (export, delete)

---

## Contact Information

For legal inquiries:

- **General Legal**: legal@thoughtmarks.app
- **Privacy**: privacy@thoughtmarks.app
- **Data Protection Officer**: dpo@thoughtmarks.app
- **GDPR Inquiries**: eu-privacy@thoughtmarks.app
- **CCPA Inquiries**: california-privacy@thoughtmarks.app

---

## Related Documentation

- **Backend Privacy**: See backend privacy implementation docs
- **Analytics Privacy**: `/docs/analytics/PRIVACY_POLICY_COMPLIANCE.md`
- **Security**: `/docs/security/` directory
- **Compliance Testing**: `/validations/accessibility/` and `/validations/status/`

---

**Last Updated**: October 23, 2025  
**Maintained By**: Thoughtmarks Privacy Team  
**Version**: 1.0

