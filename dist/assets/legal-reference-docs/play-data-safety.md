# Google Play Data Safety Information

This document outlines the data collection and sharing practices for the Thoughtmarks Android application, as required by Google Play's Data Safety section. This information is designed to mirror the privacy declarations made in the iOS PrivacyInfo.xcprivacy manifests to ensure consistency across platforms.

## Data Collection

### Data Types Collected

| Data Type | Purpose | Shared with Third Parties | Processing | Required or Optional |
|-----------|---------|---------------------------|------------|----------------------|
| **Crash Data** | App Functionality, Analytics | No | On-device and in our servers | Optional (consent-gated) |
| **Performance Data** | App Functionality, Analytics | No | On-device and in our servers | Optional (consent-gated) |
| **Audio Data** | App Functionality | No | On-device only | Required for voice features |
| **Diagnostic Information** | App Functionality, Analytics | No | On-device and in our servers | Optional (consent-gated) |
| **Device or Other IDs** | App Functionality | No | On-device only | Required for app functionality |

### Data Not Collected

The following types of data are **NOT** collected:

- **Personal Information**: Names, email addresses, phone numbers, physical addresses
- **Financial Information**: Credit card details, bank account information
- **Location**: Precise or approximate location
- **Personal Messages**: Email contents, SMS, or other communications
- **Photos and Videos**: Camera access is not used
- **Contacts**: Address book information
- **Calendar**: Calendar events or information
- **Web Browsing History**: Browser history or activity
- **App Activity on Other Apps**: Information about activity on other apps
- **Health and Fitness Information**: Health metrics or fitness data
- **Sensitive Information**: Race, ethnicity, sexual orientation, religious beliefs, etc.

## Data Sharing

Thoughtmarks does not share any collected data with third parties. All data is used solely for:

1. App functionality (essential features)
2. Analytics (improving app performance and user experience)

## Data Security

All data is collected and processed with the following security measures:

- **Encryption**: All data is encrypted in transit and at rest
- **Consent Management**: Analytics and crash reporting are disabled by default until user consent is granted
- **Data Minimization**: Only necessary data is collected, with no personal identifiers
- **Local Processing**: Voice data is processed on-device whenever possible
- **Retention Limits**: Diagnostic data is retained only as long as necessary

## User Controls

Users have the following controls over data collection:

1. **Analytics Consent**: Users can opt in/out of analytics data collection
2. **Crash Reporting Consent**: Users can opt in/out of crash reporting
3. **Data Deletion**: Users can request deletion of all collected data
4. **Privacy Settings**: Accessible via the app's Settings screen

## Permissions

The app requests the following Android permissions:

| Permission | Purpose |
|------------|---------|
| `android.permission.RECORD_AUDIO` | Required for voice recording functionality |
| `android.permission.INTERNET` | Required for network communication |
| `android.permission.ACCESS_NETWORK_STATE` | Required to monitor network connectivity |
| `android.permission.WAKE_LOCK` | Required to prevent device from sleeping during critical operations |
| `android.permission.VIBRATE` | Required for haptic feedback |

## Compliance Information

This Data Safety information complies with:

- Google Play's Data Safety requirements
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Children's Online Privacy Protection Act (COPPA)

## Parity with iOS Privacy Manifests

This document mirrors the declarations made in the iOS PrivacyInfo.xcprivacy manifests for:

- iOS App Target (Thoughtmarks)
- WatchOS App Target (ThoughtmarksWatch)
- WatchOS Extension Target (ThoughtmarksWatchExtension)
- WatchOS Widget Target (ThoughtmarksWatchWidget)

The same data types, collection purposes, and privacy practices apply across both iOS and Android platforms.

## Contact Information

For questions about our data practices or to exercise your privacy rights:

- Email: privacy@thoughtmarks.app
- Website: https://thoughtmarks.app/privacy
- In-App: Settings > Privacy > Contact Us

---

Last Updated: January 2025
