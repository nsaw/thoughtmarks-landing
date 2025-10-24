# Data Collection and Usage Policy

**Effective Date**: October 1, 2025  
**Last Updated**: October 1, 2025

## Overview

This Data Collection and Usage Policy provides detailed information about what data Thoughtmarks collects, how we collect it, why we collect it, and how it's used. This policy supplements our [Privacy Policy](./privacy-policy.md) and [Terms of Service](./terms-of-service.md).

---

## 1. Data Collection Framework

### 1.1 Collection Principles

Our data collection is guided by these principles:

#### Data Minimization
- Collect only data necessary for service functionality
- Avoid collecting data "just in case"
- Regularly review and purge unnecessary data
- Implement strict retention policies

#### Purpose Limitation
- Collect data only for stated purposes
- Do not repurpose data without consent
- Clear documentation of each data type's purpose
- Transparent communication about usage

#### Transparency
- Clear disclosure of all data collected
- Easy-to-understand explanations
- No hidden data collection
- Regular updates as practices evolve

#### User Control
- Granular privacy controls
- Easy opt-out mechanisms
- Data export and deletion tools
- Self-service privacy dashboard

---

## 2. Data Collection Categories

### 2.1 Account Data

#### What We Collect
| Data Type | Required | Purpose | Retention |
|-----------|----------|---------|-----------|
| Email address | Yes | Authentication, communication | Until account deletion |
| Display name | No | Personalization | Until changed/deleted |
| Profile photo | No | Personalization | Until changed/deleted |
| Password hash | Yes | Security | Until account deletion |
| Account creation date | Yes | Service analytics | Until account deletion + 90 days |
| Last login date | Yes | Security | Until account deletion + 30 days |

#### How We Collect
- **Direct input**: You provide during registration
- **Authentication**: OAuth/SSO from third parties (Apple Sign-In)
- **Security**: Generated hashes and tokens

#### Why We Need It
- **Authentication**: Verify your identity
- **Communication**: Send important notifications
- **Personalization**: Customize your experience
- **Security**: Protect your account from unauthorized access

### 2.2 Content Data

#### What We Collect
| Data Type | Required | Purpose | Retention |
|-----------|----------|---------|-----------|
| Thoughtmark text | User-created | Core functionality | Until user deletes |
| Voice recordings | User-created | Voice capture feature | Until user deletes |
| Audio transcriptions | User-created | Voice-to-text | Until user deletes |
| Tags and labels | User-created | Organization | Until user deletes |
| Bins and folders | User-created | Organization | Until user deletes |
| Creation timestamps | Auto-generated | Sorting, search | Until content deleted |
| Modification timestamps | Auto-generated | Version tracking | Until content deleted |
| Search queries | User-input | Search history | 90 days (configurable) |

#### How We Collect
- **Direct creation**: You create Thoughtmarks manually
- **Voice capture**: You record audio notes
- **AI transcription**: Automatic speech-to-text conversion
- **Import**: You import data from other apps
- **Sync**: Data synchronized across your devices

#### Why We Need It
- **Core functionality**: Essential for the Service
- **Synchronization**: Keep data consistent across devices
- **Search and retrieval**: Help you find your content
- **AI features**: Enable smart suggestions and insights
- **Backup and recovery**: Restore data if needed

#### Processing Locations
- **On-device**: Stored in local database (encrypted)
- **Cloud sync**: Encrypted copies on our servers (optional)
- **AI processing**: Temporary processing for features (see Section 4)
- **Backups**: Encrypted backup copies (optional)

### 2.3 Device and Technical Data

#### What We Collect
| Data Type | Required | Purpose | Retention |
|-----------|----------|---------|-----------|
| Device model | Yes | Feature compatibility | 90 days |
| OS version | Yes | Bug tracking, compatibility | 90 days |
| App version | Yes | Support, debugging | 90 days |
| Device identifier | Yes | Security, fraud prevention | Until account deletion + 30 days |
| Screen size | Yes | UI optimization | 90 days |
| Language/locale | Yes | Localization | Until account deletion |
| Timezone | Yes | Timestamp accuracy | Until account deletion |
| IP address | Yes | Security, fraud detection | 30 days |
| Network type | No | Performance optimization | 90 days |
| Battery level | No | Background task optimization | Not stored (real-time only) |
| Available storage | No | Storage warnings | Not stored (real-time only) |

#### How We Collect
- **Automatic**: Collected by app framework (Expo, React Native)
- **Device APIs**: iOS APIs for device information
- **Network**: IP address from network connections
- **Sensors**: Device sensors (with permission)

#### Why We Need It
- **Compatibility**: Ensure app works on your device
- **Performance**: Optimize for your hardware
- **Security**: Detect suspicious activity
- **Support**: Troubleshoot technical issues
- **Analytics**: Understand device landscape

### 2.4 Usage and Analytics Data

#### What We Collect (Opt-In Only)
| Data Type | Required | Purpose | Retention |
|-----------|----------|---------|-----------|
| Feature usage | No | Product improvement | 365 days (aggregate) |
| Screen views | No | UX optimization | 365 days (aggregate) |
| Session duration | No | Engagement analysis | 365 days (aggregate) |
| Navigation paths | No | UX improvement | 365 days (aggregate) |
| Button clicks | No | Feature discovery | 365 days (aggregate) |
| Search queries | No | Search improvement | 90 days (anonymized) |
| Error logs | No | Bug fixing | 90 days |
| Crash reports | No | Stability improvement | 90 days |
| Performance metrics | No | Speed optimization | 90 days |

#### How We Collect
- **Firebase Analytics**: Google Firebase SDK (only if opted-in)
- **Custom events**: Instrumentation in app code
- **Crash reporting**: Firebase Crashlytics (only if opted-in)
- **Performance monitoring**: Firebase Performance (only if opted-in)

#### Why We Need It
- **Product improvement**: Understand what works and what doesn't
- **Bug fixing**: Identify and fix issues
- **Performance**: Optimize speed and responsiveness
- **Feature prioritization**: Build what users need most

#### Privacy Protections
- ✅ **Opt-in required**: Analytics disabled by default
- ✅ **Anonymization**: No personally identifiable information
- ✅ **Aggregation**: Combined with other users' data
- ✅ **Retention limits**: Automatically deleted after time period
- ✅ **No cross-app tracking**: Isolated to Thoughtmarks only

### 2.5 Communication Data

#### What We Collect
| Data Type | Required | Purpose | Retention |
|-----------|----------|---------|-----------|
| Email open rates | No (opt-in) | Email effectiveness | 365 days |
| Link clicks in emails | No (opt-in) | Content relevance | 365 days |
| Support tickets | Yes (when contacting support) | Customer service | 3 years |
| Chat transcripts | Yes (when using live chat) | Support quality | 3 years |
| Feedback submissions | Yes (when submitting feedback) | Product improvement | 3 years |
| Survey responses | No | User satisfaction | 2 years |

#### How We Collect
- **Email tracking**: Tracking pixels (opt-in for marketing emails only)
- **Support system**: Zendesk/Intercom integration
- **In-app feedback**: Feedback form submissions
- **Surveys**: Optional user surveys

#### Why We Need It
- **Customer support**: Help resolve your issues
- **Product feedback**: Understand user needs
- **Communication optimization**: Send relevant, timely messages
- **Quality assurance**: Improve support quality

### 2.6 Location Data

#### What We Collect
| Data Type | Required | Purpose | Retention |
|-----------|----------|---------|-----------|
| Precise location | No (explicit opt-in) | Location-based reminders | Until feature disabled |
| Timezone | Yes | Timestamp accuracy | Until account deletion |
| Country/region | Yes (from IP) | Compliance, localization | 30 days |

#### How We Collect
- **GPS**: Device location services (only with explicit permission)
- **IP geolocation**: Approximate location from IP address
- **Manual input**: Timezone setting

#### Why We Need It
- **Location reminders**: "Remind me when I arrive at..."
- **Timezone accuracy**: Correct timestamps for your location
- **Compliance**: Apply correct legal requirements
- **Localization**: Show content in your language

#### Privacy Protections
- ✅ **Explicit permission required**: iOS location permission prompt
- ✅ **Purpose-specific**: Only for location-based reminders
- ✅ **Can be disabled**: Turn off anytime in Settings
- ✅ **Not shared**: Never sold or shared with third parties
- ✅ **Not tracked**: No continuous location tracking

---

## 3. Data Collection Methods

### 3.1 Direct Collection

You provide data directly through:
- **Account registration**: Email, name, password
- **Content creation**: Thoughtmarks, tags, notes
- **Settings**: Preferences and configurations
- **Support requests**: Questions and feedback
- **Surveys**: Optional feedback forms

### 3.2 Automatic Collection

We automatically collect:
- **Device information**: Model, OS version, identifier
- **Usage analytics**: Feature usage, screen views (opt-in)
- **Crash reports**: Error logs and stack traces (opt-in)
- **Performance data**: Load times, API response times (opt-in)

### 3.3 Third-Party Collection

Third-party services may collect:
- **Firebase**: Authentication, analytics, crash reports
- **OpenAI**: AI query inputs (cloud mode only, encrypted)
- **Apple**: App Store purchase information
- **iCloud**: Backup metadata (if iCloud backup enabled)

**Important**: Third-party collection is governed by their privacy policies.

### 3.4 Cookies and Similar Technologies

We use:
- **Session cookies**: Keep you logged in
- **Security tokens**: Prevent cross-site request forgery
- **Local storage**: Cache app data for offline access
- **Analytics cookies**: Track usage (opt-in only)

**No third-party advertising cookies**: We do not use cookies for ad targeting.

---

## 4. AI Data Processing

### 4.1 On-Device Processing

When you choose "On-Device" AI mode:

#### What Happens
- AI models run entirely on your device
- No data sent to external servers
- Fastest processing (no network latency)
- Limited to device capabilities

#### Data Flow
1. You create Thoughtmark or query
2. Data processed by on-device AI models
3. Results displayed to you
4. No data leaves your device

#### Privacy
- ✅ **Maximum privacy**: Data never leaves device
- ✅ **No cloud storage**: Everything stays local
- ✅ **No third-party access**: No external AI services
- ✅ **Offline capable**: Works without internet

### 4.2 Cloud Encrypted Processing

When you choose "Cloud Encrypted" AI mode:

#### What Happens
- AI runs on our secure cloud servers
- Advanced models and capabilities
- Data encrypted in transit and at rest
- Temporary processing, no permanent storage

#### Data Flow
1. You create Thoughtmark or query
2. Data encrypted on your device
3. Encrypted data sent to our servers
4. Decrypted and processed in secure environment
5. Results encrypted and sent back
6. Decrypted and displayed to you
7. All server data deleted within 24 hours

#### Privacy
- ✅ **End-to-end encryption**: TLS 1.3 in transit, AES-256 at rest
- ✅ **Temporary processing**: Data deleted after processing
- ✅ **No permanent storage**: Not saved in databases
- ✅ **No training use**: Not used to train AI models (unless you opt-in)
- ✅ **Access controls**: Strict employee access restrictions

### 4.3 AI Training (Opt-In Only)

If you opt-in to contribute to AI training:

#### What Happens
- Your data anonymized (all identifiers removed)
- Combined with other users' data
- Used to improve AI models
- Cannot be traced back to you

#### Process
1. You explicitly opt-in (Settings → Privacy → AI Training)
2. Data is fully anonymized
3. Identifiers stripped (name, email, device ID)
4. Combined with dataset of 10,000+ users
5. Used to fine-tune AI models
6. Models deployed to improve service for all users

#### You Can Opt-Out Anytime
- Settings → Privacy → AI Training → Disable
- Previously contributed data remains anonymized
- Future data no longer collected for training

---

## 5. Data Usage Purposes

### 5.1 Core Service Operations

We use your data to:

#### Provide Functionality
- Store and retrieve your Thoughtmarks
- Synchronize across your devices
- Enable search and organization
- Process AI requests
- Backup and restore data

#### User Experience
- Personalize your interface
- Remember your preferences
- Pre-fill forms and inputs
- Show relevant suggestions
- Optimize performance

### 5.2 Communication

We use your email to:

#### Essential Communications
- Account verification
- Password resets
- Security alerts
- Service outages
- Policy changes

#### Optional Communications (Opt-In)
- Product updates and new features
- Tips and best practices
- User research opportunities
- Newsletter and blog posts

**Opt-out anytime**: Every email includes unsubscribe link.

### 5.3 Security and Fraud Prevention

We use data to:
- **Detect suspicious activity**: Unusual login patterns
- **Prevent unauthorized access**: Multi-factor authentication
- **Block malicious actors**: IP blocking, rate limiting
- **Investigate security incidents**: Audit logs
- **Comply with legal requests**: Law enforcement cooperation

### 5.4 Analytics and Improvement

We use anonymized data to:
- **Fix bugs**: Identify and resolve crashes
- **Improve performance**: Optimize speed and reliability
- **Enhance UX**: Understand user behavior
- **Prioritize features**: Build what users need
- **Measure success**: Track key metrics

### 5.5 Legal Compliance

We use data to:
- **Comply with laws**: GDPR, CCPA, other regulations
- **Respond to legal requests**: Court orders, subpoenas
- **Enforce Terms**: Prevent Terms violations
- **Protect rights**: Defend against legal claims

---

## 6. Data Sharing and Disclosure

### 6.1 We Do NOT Sell Data

**We will never sell, rent, or trade your personal data for marketing or advertising purposes.**

### 6.2 Service Providers

We share limited data with trusted service providers:

| Provider | Data Shared | Purpose | Location | DPA |
|----------|-------------|---------|----------|-----|
| Firebase (Google) | Device ID, usage analytics | Authentication, analytics | US | ✅ Yes |
| OpenAI | Encrypted AI queries | AI processing (cloud mode) | US | ✅ Yes |
| Apple | Purchase info | Subscription management | US | ✅ Yes |
| AWS | Encrypted backups | Cloud storage | EU/US | ✅ Yes |

**Contractual Protections**:
- Data Processing Agreements (DPAs)
- Standard Contractual Clauses (SCCs) for international transfers
- Confidentiality obligations
- Security requirements
- Data deletion upon termination

### 6.3 Legal Requirements

We may disclose data when required by law:
- **Court orders**: Subpoenas, warrants
- **Legal investigations**: Law enforcement requests
- **Emergency situations**: Imminent danger to safety
- **Compliance**: Regulatory inquiries

**Our Commitment**:
- We challenge overly broad requests
- We notify users unless prohibited
- We publish transparency reports annually
- We disclose only minimum necessary data

### 6.4 Business Transfers

If Thoughtmarks is acquired or merged:
- **Same privacy commitments**: Successor bound by this policy
- **Advance notice**: 30 days before any changes
- **Opt-out option**: Delete account before transfer
- **Data transfer**: Only with legally binding agreements

### 6.5 Aggregated Data

We may share anonymized, aggregate statistics:
- **Industry research**: Mobile productivity trends
- **Business partnerships**: Integration opportunities
- **Public communications**: Company blog posts
- **Investor updates**: Growth and engagement metrics

**No individual identification**: Cannot be traced to any user.

---

## 7. Data Retention

### 7.1 Retention Principles

We retain data only as long as necessary:
- **Purpose limitation**: Deleted when purpose fulfilled
- **Legal requirements**: Comply with retention laws
- **User control**: You can delete data anytime
- **Security**: Secure deletion methods

### 7.2 Retention Periods

| Data Type | Retention Period | Rationale |
|-----------|------------------|-----------|
| Account information | Until account deletion | Account management |
| Thoughtmark content | Until user deletes | Core service |
| Voice recordings | Until user deletes | User content |
| Search history | 90 days (configurable) | Convenience vs. privacy |
| Usage analytics | 365 days (aggregate) | Long-term trend analysis |
| Crash reports | 90 days | Bug fixing window |
| Support tickets | 3 years | Service quality |
| Backup copies | Until account deletion + 90 days | Recovery window |
| Audit logs | 1 year | Security investigations |
| Legal holds | Duration of legal matter | Compliance |

### 7.3 Deletion Methods

#### Secure Deletion
- **Overwriting**: Multiple-pass data overwrite
- **Cryptographic erasure**: Delete encryption keys
- **Database purge**: Remove from all databases
- **Backup deletion**: Remove from backup systems

#### Deletion Timeline
1. **Immediate**: Marked for deletion
2. **7 days**: Grace period for accidental deletion
3. **30 days**: Permanent deletion from production
4. **90 days**: Deletion from backups
5. **Complete**: No recovery possible

---

## 8. Data Protection Measures

### 8.1 Encryption

#### At Rest
- **AES-256 encryption**: Military-grade encryption
- **Hardware-backed keys**: iOS Secure Enclave
- **Encrypted databases**: SQLCipher for local storage
- **Encrypted backups**: AES-256 for cloud backups

#### In Transit
- **TLS 1.3**: Latest transport security
- **Certificate pinning**: Prevent man-in-the-middle attacks
- **Perfect forward secrecy**: Session key rotation
- **End-to-end option**: E2EE for cloud sync (coming soon)

### 8.2 Access Controls

#### Authentication
- **Strong passwords**: Minimum 8 characters
- **Biometric auth**: Face ID, Touch ID
- **Two-factor auth**: TOTP-based 2FA
- **Session management**: Auto-logout, device management

#### Authorization
- **Role-based access**: Minimal employee permissions
- **Least privilege**: Only necessary data access
- **Audit logging**: All access logged and monitored
- **Regular reviews**: Quarterly access audits

### 8.3 Infrastructure Security

#### Cloud Infrastructure
- **Secure data centers**: SOC 2 Type II certified
- **Network segmentation**: Isolated environments
- **DDoS protection**: Cloudflare protection
- **Intrusion detection**: 24/7 monitoring
- **Vulnerability scanning**: Weekly automated scans

#### Application Security
- **Code reviews**: Peer review of all code
- **Security testing**: Quarterly penetration tests
- **Dependency scanning**: Automated vulnerability checks
- **Bug bounty program**: Responsible disclosure rewards

### 8.4 Incident Response

If a security breach occurs:

#### Immediate Actions (Within 24 Hours)
1. **Contain**: Isolate affected systems
2. **Investigate**: Determine scope and impact
3. **Notify**: Inform affected users via email
4. **Remediate**: Fix vulnerabilities

#### Follow-Up Actions (Within 72 Hours)
1. **Regulatory notification**: Notify data protection authorities (GDPR requirement)
2. **Detailed assessment**: Complete impact analysis
3. **User support**: Provide guidance and support
4. **Public disclosure**: Transparent communication

#### Long-Term Actions
1. **Post-mortem**: Detailed incident analysis
2. **Process improvement**: Update security procedures
3. **Training**: Employee security awareness
4. **Transparency report**: Public incident disclosure

---

## 9. Your Control and Choices

### 9.1 Access and Export

**You can access and export all your data anytime:**

#### In-App Export
- Settings → Data Management → Export Data
- Available formats: JSON, CSV, Markdown
- Includes: All Thoughtmarks, tags, settings
- Delivery: Instant download or email link

#### Data Access Request
- Email privacy@thoughtmarks.app
- We respond within 30 days (GDPR requirement)
- We provide machine-readable formats
- Free of charge (unless excessive requests)

### 9.2 Correction and Update

**You can correct or update your data:**

#### Self-Service
- Edit profile information in Settings
- Update email address (verification required)
- Change display name and photo
- Modify content anytime

#### Support Request
- Email support@thoughtmarks.app
- We respond within 48 hours
- We verify identity before changes

### 9.3 Deletion

**You can delete your data:**

#### In-App Deletion
- Settings → Account → Delete Account
- Confirms deletion (irreversible warning)
- Deletes all data within 30 days
- Backup deletion within 90 days

#### Email Request
- Email privacy@thoughtmarks.app
- Include registered email address
- Identity verification required
- Confirmation within 48 hours

### 9.4 Opt-Out Controls

**You control what data we collect:**

#### Analytics Opt-Out
- Settings → Privacy → Analytics → Disable
- Stops all usage tracking
- No impact on service functionality

#### Crash Reporting Opt-Out
- Settings → Privacy → Crash Reporting → Disable
- Stops automatic crash reports
- Manual reporting still available

#### Marketing Opt-Out
- Settings → Notifications → Marketing → Disable
- Unsubscribe link in all marketing emails
- Essential communications continue (security, service)

#### AI Training Opt-Out
- Settings → Privacy → AI Training → Disable
- No data used for training
- No impact on AI features

---

## 10. Children's Privacy

**Thoughtmarks is not intended for children under 13.**

### 10.1 Age Verification
- Age confirmation required during registration
- If under 13, registration is blocked
- No collection of age information beyond verification

### 10.2 Parental Rights
- Parents can request deletion of child's data
- Contact privacy@thoughtmarks.app with proof of parenthood
- Immediate deletion upon verification

### 10.3 Discovery of Underage Users
If we discover underage use:
1. **Immediate suspension**: Account disabled
2. **Data deletion**: All data deleted within 48 hours
3. **Parental notification**: If contact information available

---

## 11. International Data Transfers

### 11.1 Transfer Mechanisms

When transferring data outside EU/EEA:
- **Standard Contractual Clauses**: EU-approved contracts
- **Adequacy decisions**: EU Commission-approved countries
- **GDPR compliance**: Full data protection maintained

### 11.2 Data Locations

| Data Type | Primary Location | Backup Location |
|-----------|-----------------|-----------------|
| Production data | EU (Ireland) | EU (Germany) |
| Backups | EU (Germany) | US (encrypted) |
| AI processing | US (if cloud mode) | - |
| Analytics | US (Google Firebase) | - |

### 11.3 Your Rights

- Same privacy protections everywhere
- Object to transfers in certain cases
- Request data be stored only in EU (Enterprise plan)

---

## 12. Updates to This Policy

### 12.1 Change Notification

We will notify you of material changes via:
- **In-app notification**: Alert on next app launch
- **Email**: To registered address
- **Website banner**: Prominent notice
- **Change summary**: What changed and why

### 12.2 Review Period

- **30-day review period**: Before changes take effect
- **Opt-out option**: Delete account if you disagree
- **Continued use**: Acceptance of new policy

---

## 13. Contact Information

### 13.1 Privacy Questions

**Email**: privacy@thoughtmarks.app  
**Subject**: "Data Collection Question"  
**Response**: Within 48 hours

### 13.2 Data Access Requests

**Email**: privacy@thoughtmarks.app  
**Subject**: "Data Access Request"  
**Response**: Within 30 days (GDPR requirement)

### 13.3 Data Protection Officer

**Email**: dpo@thoughtmarks.app  
**Subject**: "GDPR Request"  
**Response**: Within 30 days

---

## 14. Summary

### 14.1 What We Collect
- ✅ Account information (email, name)
- ✅ Content you create (Thoughtmarks, recordings)
- ✅ Device information (model, OS)
- ✅ Usage analytics (opt-in only)

### 14.2 How We Use It
- ✅ Provide core service functionality
- ✅ Synchronize across devices
- ✅ Process AI requests
- ✅ Improve product quality

### 14.3 Your Rights
- ✅ Access and export your data
- ✅ Correct inaccurate information
- ✅ Delete your account and data
- ✅ Opt-out of analytics and marketing

### 14.4 Our Commitments
- ✅ Never sell your data
- ✅ Transparent practices
- ✅ Strong security measures
- ✅ Full GDPR compliance

---

**Questions?** Contact us at privacy@thoughtmarks.app or read our full [Privacy Policy](./privacy-policy.md).

**Last Updated**: October 1, 2025  
**Effective Date**: October 1, 2025


