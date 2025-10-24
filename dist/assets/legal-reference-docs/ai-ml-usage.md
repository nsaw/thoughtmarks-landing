# AI and Machine Learning Usage Policy

**Effective Date**: October 1, 2025  
**Last Updated**: October 1, 2025

## Overview

Thoughtmarks uses artificial intelligence (AI) and machine learning (ML) to provide intelligent features and enhance your productivity. This policy explains how AI works in Thoughtmarks, what data is used, how your privacy is protected, and what rights you have.

This policy supplements our [Privacy Policy](./privacy-policy.md), [Terms of Service](./terms-of-service.md), and [Data Collection Policy](./data-collection-usage.md).

---

## 1. AI Features and Capabilities

### 1.1 Core AI Features

Thoughtmarks offers the following AI-powered features:

#### Voice Transcription
- **What it does**: Converts voice recordings to text
- **Technology**: Apple Speech Framework (on-device) or OpenAI Whisper (cloud)
- **Accuracy**: 90-95% for English, 85-92% for other languages
- **Processing**: On-device by default, cloud optional

#### Semantic Search
- **What it does**: Understands meaning, not just keywords
- **Technology**: Sentence embeddings and vector search
- **Example**: Search "happy memories" finds "joyful moments"
- **Processing**: Embeddings generated on-device or cloud

#### Smart Suggestions
- **What it does**: Suggests tags, titles, related Thoughtmarks
- **Technology**: Natural language processing and pattern recognition
- **Personalization**: Learns from your content (locally)
- **Processing**: On-device by default

#### AI Writing Assistant
- **What it does**: Helps expand, refine, or rewrite thoughts
- **Technology**: GPT-4 or on-device language models
- **Capabilities**: Summarize, expand, improve clarity, change tone
- **Processing**: User's choice (on-device or cloud)

#### Intelligent Reminders
- **What it does**: Suggests optimal reminder times
- **Technology**: Pattern recognition and habit learning
- **Personalization**: Based on your usage patterns
- **Processing**: Entirely on-device

#### Content Analysis
- **What it does**: Extracts key topics, themes, sentiment
- **Technology**: Natural language understanding
- **Use case**: Organize and discover insights in your notes
- **Processing**: On-device or cloud

### 1.2 Experimental Features (Opt-In)

These features are in beta and require explicit opt-in:

#### Conversation Mode
- **What it does**: Chat with AI about your Thoughtmarks
- **Technology**: Advanced language models
- **Context**: AI has access to your Thoughtmarks (locally)
- **Processing**: Cloud encrypted mode only

#### Insight Discovery
- **What it does**: Identifies patterns and connections in your thoughts
- **Technology**: Graph neural networks and clustering
- **Personalization**: Highly personalized to your content
- **Processing**: Cloud encrypted mode only

---

## 2. AI Processing Modes

### 2.1 On-Device Processing (Default)

**All AI runs on your iPhone/iPad. Your data never leaves your device.**

#### How It Works
1. AI models embedded in the app
2. Processing happens on device CPU/GPU
3. Uses Apple Neural Engine (A14 Bionic or later)
4. No network requests for AI features
5. Results displayed instantly

#### Advantages
- ✅ **Maximum privacy**: Data never transmitted
- ✅ **Fastest speed**: No network latency
- ✅ **Works offline**: No internet required
- ✅ **No costs**: Included in subscription
- ✅ **Full control**: AI runs under your control

#### Limitations
- ⚠️ **Device requirements**: Requires A14 Bionic or newer
- ⚠️ **Model size**: Limited to smaller models
- ⚠️ **Capabilities**: Less advanced than cloud AI
- ⚠️ **Battery impact**: Higher battery usage

#### Models Used
- **Apple Speech Framework**: Voice transcription
- **Core ML models**: On-device inference
- **MobileNet**: Efficient neural networks
- **DistilBERT**: Lightweight language understanding

#### Privacy Guarantees
- 🔒 **Zero data transmission**: Nothing leaves device
- 🔒 **No logging**: No AI query logs
- 🔒 **No training**: Models are static, not updated
- 🔒 **Full offline**: Works in airplane mode

### 2.2 Cloud Encrypted Processing (Optional)

**Advanced AI runs on secure cloud servers. Data is encrypted end-to-end.**

#### How It Works
1. Your data encrypted on device (AES-256)
2. Encrypted data sent to our secure servers
3. Decrypted in secure processing environment
4. AI processes your request
5. Results encrypted and sent back
6. Decrypted and displayed on device
7. All server data deleted within 24 hours

#### Advantages
- ✅ **Advanced AI**: Larger, more capable models (GPT-4)
- ✅ **Better accuracy**: State-of-the-art models
- ✅ **More features**: Conversation mode, insights
- ✅ **Device agnostic**: Works on older devices
- ✅ **Less battery**: Processing offloaded to cloud

#### Limitations
- ⚠️ **Internet required**: Needs active connection
- ⚠️ **Network latency**: Slightly slower than on-device
- ⚠️ **Data transmission**: Data leaves device (encrypted)
- ⚠️ **Premium only**: Requires Pro subscription

#### Security Measures
- 🔒 **End-to-end encryption**: TLS 1.3 + AES-256
- 🔒 **Temporary processing**: Deleted within 24 hours
- 🔒 **No permanent storage**: Not saved in databases
- 🔒 **Access controls**: Restricted employee access
- 🔒 **Audit logs**: All access monitored
- 🔒 **SOC 2 compliance**: Industry-standard security

#### Third-Party AI Services

When using Cloud Encrypted mode, we may use:

| Service | Purpose | Data Shared | Retention | DPA |
|---------|---------|-------------|-----------|-----|
| OpenAI GPT-4 | Advanced language understanding | Encrypted prompts, context | Not retained | ✅ Yes |
| OpenAI Whisper | Voice transcription | Encrypted audio | Not retained | ✅ Yes |
| Pinecone | Vector search | Encrypted embeddings | Until you delete | ✅ Yes |

**Third-party protections**:
- Data Processing Agreements (DPAs)
- Zero-retention policies
- No training on your data
- GDPR-compliant
- Regular security audits

### 2.3 Choosing Your Processing Mode

#### In-App Selection
- Settings → AI & Intelligence → Processing Mode
- Default: On-Device
- Options: On-Device, Cloud Encrypted
- Switch anytime without data loss

#### Recommendation Guide

**Choose On-Device if you prioritize**:
- 🔒 Maximum privacy
- ⚡ Fastest response times
- 📵 Offline capability
- 🔋 Acceptable battery usage
- ✅ Device supports it (A14 Bionic or later)

**Choose Cloud Encrypted if you need**:
- 🤖 Advanced AI capabilities
- 💡 Conversation and insights features
- 📱 Older device support
- 🔋 Lower battery usage
- ☁️ Don't mind internet dependency

---

## 3. Data Usage in AI Features

### 3.1 What Data AI Uses

#### Content Data
- **Thoughtmark text**: To understand context and meaning
- **Voice recordings**: For transcription only
- **Tags and labels**: To improve organization suggestions
- **Search queries**: To understand what you're looking for
- **Usage patterns**: To personalize suggestions

#### Metadata
- **Timestamps**: To understand time-based patterns
- **Word counts**: To estimate processing time
- **Language**: To choose appropriate AI models
- **Device capabilities**: To optimize performance

#### What AI Does NOT Use
- ❌ Your email address or name
- ❌ Other users' data
- ❌ Content from other apps
- ❌ Your contacts or location
- ❌ Your device ID or IP address

### 3.2 How AI Processes Your Data

#### On-Device Mode
1. Data stays on your device
2. AI models access local database
3. Processing happens in app sandbox
4. Results stored locally
5. Nothing transmitted externally

#### Cloud Encrypted Mode
1. Relevant data selected (only what's needed)
2. Encrypted on device
3. Transmitted securely (TLS 1.3)
4. Processed in isolated environment
5. Results encrypted and returned
6. Server data deleted within 24 hours

### 3.3 Data Minimization

We apply strict data minimization:

#### Only Necessary Data
- AI receives only data needed for the specific feature
- Example: Transcription only gets audio, not tags or metadata
- No batch processing of unrelated content

#### Temporary Processing
- Data processed and immediately discarded
- No long-term caching of AI inputs
- No aggregation of multiple requests

#### Context Windows
- AI sees limited context (e.g., last 10 Thoughtmarks)
- Not your entire database
- User-configurable context size (Settings → AI → Context Limit)

---

## 4. AI Training and Model Improvement

### 4.1 Default: No Training on Your Data

**By default, your data is NEVER used to train AI models.**

- Your Thoughtmarks stay private
- No contribution to model training
- No impact on AI research
- Full privacy maintained

### 4.2 Optional: Contribute to Training (Opt-In)

**You can voluntarily contribute anonymized data to improve AI.**

#### How to Opt-In
- Settings → Privacy → AI Training → Enable
- Clear explanation of what's shared
- Confirmation required
- Opt-out anytime

#### What Gets Shared (If You Opt-In)
- ✅ Anonymized text samples
- ✅ Aggregated usage patterns
- ✅ De-identified search queries
- ✅ General AI interaction patterns

#### What's NEVER Shared
- ❌ Your name or email
- ❌ Identifiable personal information
- ❌ Complete Thoughtmarks
- ❌ Voice recordings
- ❌ Device identifiers

#### Anonymization Process
1. **Identifier removal**: Strip all personal data
2. **Generalization**: Replace specific details with categories
3. **Aggregation**: Combine with 10,000+ other users
4. **K-anonymity**: Ensure at least K=1000 similar records
5. **Differential privacy**: Add statistical noise
6. **Review**: Manual review before use

#### How Your Contribution Helps
- 🎯 **Better AI accuracy**: Improve transcription, search, suggestions
- 🌍 **Broader support**: Support more languages and use cases
- ⚡ **Faster models**: Optimize for better performance
- 🆕 **New features**: Enable innovative capabilities

#### Your Rights
- Opt-out anytime (Settings → Privacy → AI Training → Disable)
- Request deletion of contributed data (privacy@thoughtmarks.app)
- No penalty for opting out
- Same service quality regardless of choice

### 4.3 Model Updates

#### On-Device Models
- Updated with app updates
- Downloaded from Apple App Store
- Reviewed by Apple
- Installed on device only

#### Cloud Models
- Updated continuously on our servers
- No user action required
- Backwards compatible
- Announced via in-app notifications

---

## 5. AI Accuracy and Limitations

### 5.1 Known Limitations

**AI is not perfect. You should be aware of these limitations:**

#### Accuracy Limitations
- ⚠️ **Transcription errors**: 5-15% error rate depending on audio quality
- ⚠️ **Language support**: English has highest accuracy
- ⚠️ **Context misunderstanding**: AI may misinterpret ambiguous text
- ⚠️ **Hallucinations**: AI may generate plausible but incorrect information

#### Technical Limitations
- ⚠️ **Computational constraints**: On-device models are smaller
- ⚠️ **Context windows**: Limited to recent content (not entire history)
- ⚠️ **Processing time**: Complex requests take longer
- ⚠️ **Resource usage**: High battery and memory consumption

#### Bias and Fairness
- ⚠️ **Training bias**: AI may reflect biases in training data
- ⚠️ **Language bias**: Better performance in English
- ⚠️ **Cultural assumptions**: May not understand all cultural contexts
- ⚠️ **Stereotypes**: May occasionally produce stereotypical content

### 5.2 Accuracy Expectations

| Feature | Accuracy | Notes |
|---------|----------|-------|
| Voice transcription (English) | 90-95% | Depends on audio quality, accent |
| Voice transcription (Other languages) | 85-92% | Varies by language |
| Semantic search | 85-95% | Better with more context |
| Tag suggestions | 80-90% | Improves over time |
| Content summarization | 85-95% | Depends on content clarity |
| Sentiment analysis | 75-85% | May miss sarcasm, nuance |

### 5.3 User Responsibilities

**You are responsible for verifying AI output:**

- ✅ **Proofread transcriptions**: Check for accuracy
- ✅ **Verify facts**: Don't trust AI for critical information
- ✅ **Review suggestions**: AI suggestions are recommendations, not guarantees
- ✅ **Report errors**: Help us improve by reporting issues

**DO NOT rely on AI for**:
- ❌ Medical advice
- ❌ Legal advice
- ❌ Financial advice
- ❌ Safety-critical decisions
- ❌ Emergency situations

### 5.4 Reporting Issues

If you encounter AI errors or problems:

#### In-App Reporting
- Long-press on AI result → Report Issue
- Include description of what went wrong
- Optional: Share input data (anonymized)

#### Email Reporting
- **Email**: ai-feedback@thoughtmarks.app
- **Include**: Description, screenshots (if applicable)
- **Response time**: Within 48 hours

---

## 6. Transparency and Explainability

### 6.1 How AI Works

We strive to make AI transparent and understandable:

#### Feature Documentation
- In-app help explains each AI feature
- Settings → Help → AI Features
- Video tutorials available
- FAQ section

#### AI Indicators
- 🤖 **AI badge**: Shows when content is AI-generated
- ⚡ **Processing indicator**: Shows AI is working
- 🔒 **Privacy indicator**: Shows which processing mode is active

#### Confidence Scores
- AI provides confidence levels for suggestions
- Low confidence: ⚠️ Warning shown
- High confidence: ✅ Indicated visually

### 6.2 Understanding AI Decisions

**Why did AI suggest this?**

- In-app explanations for suggestions
- Tap "Why?" next to any AI suggestion
- Clear reasoning provided
- Links to relevant content

**How can I improve AI results?**

- Provide more context
- Use clearer language
- Add relevant tags
- Check settings for customization options

### 6.3 AI Credits

We clearly attribute AI-generated content:

- **Transcriptions**: "Transcribed by AI"
- **Summaries**: "AI-generated summary"
- **Suggestions**: "Suggested by AI"
- **Rewrites**: "AI-assisted editing"

---

## 7. Your AI Rights and Controls

### 7.1 Control Over AI Features

You have complete control over AI:

#### Enable/Disable AI Features
- Settings → AI & Intelligence
- Toggle each feature individually
- Disable all AI features at once
- Changes take effect immediately

#### Processing Mode Selection
- Settings → AI & Intelligence → Processing Mode
- Switch between On-Device and Cloud Encrypted
- Default: On-Device
- Change anytime without data loss

#### Context Control
- Settings → AI & Intelligence → Context Limit
- Control how much of your history AI sees
- Options: Last 10, 50, 100, or All Thoughtmarks
- Lower limits = more privacy, less context

#### Language Preferences
- Settings → AI & Intelligence → Languages
- Choose primary language for transcription
- Add secondary languages
- AI will auto-detect and use appropriate models

### 7.2 Data Access and Deletion

#### AI-Generated Content
- You own all AI-generated content
- Delete anytime (same as regular content)
- Export includes AI-generated content
- No different treatment from user-created content

#### AI Query History
- Settings → AI & Intelligence → Query History
- View all past AI queries
- Delete individual queries
- Clear entire history

#### AI Training Data
- If opted-in, request deletion of contributed data
- Email: privacy@thoughtmarks.app
- Include: "AI Training Data Deletion Request"
- Processed within 30 days

### 7.3 GDPR and AI Rights

**EU/EEA users have additional rights:**

#### Right to Explanation
- Request explanation of any AI decision
- Email: dpo@thoughtmarks.app
- Response within 30 days

#### Right to Human Review
- Request human review of AI decisions
- Available for content moderation, account actions
- Email: appeals@thoughtmarks.app

#### Right to Object
- Object to automated decision-making
- Disable AI features without penalty
- Request manual processing for specific tasks

---

## 8. Safety and Ethical AI

### 8.1 Prohibited AI Uses

You may not use Thoughtmarks AI to:

#### Harmful Content
- ❌ Generate hate speech, discriminatory content
- ❌ Create violent or graphic content
- ❌ Produce sexually explicit content
- ❌ Facilitate illegal activities

#### Deceptive Practices
- ❌ Impersonate others
- ❌ Generate misleading information
- ❌ Create fake news or propaganda
- ❌ Spam or mass unsolicited messages

#### Security Violations
- ❌ Attempt to jailbreak or manipulate AI
- ❌ Reverse engineer AI models
- ❌ Extract training data
- ❌ Probe for vulnerabilities

### 8.2 Content Moderation

**We may moderate AI-generated content for safety:**

- Automated detection of policy violations
- Human review of flagged content
- Account suspension for repeated violations
- Cooperation with law enforcement if required

**Moderation is limited to:**
- Policy enforcement
- Legal compliance
- User safety
- Not used for censorship or political purposes

### 8.3 Bias Mitigation

We actively work to reduce AI bias:

#### Training Data Diversity
- Diverse, representative datasets
- Multi-language, multi-cultural content
- Regular bias audits
- Third-party fairness assessments

#### Fairness Testing
- Automated bias detection in outputs
- A/B testing across demographics
- User feedback collection
- Continuous improvement

#### Transparency
- Annual AI fairness reports
- Public disclosure of known biases
- Commitment to improvement
- Open to external audits

---

## 9. AI Security and Privacy

### 9.1 Security Measures

#### Model Security
- **Secure distribution**: Models signed and verified
- **Tamper detection**: Detect modified models
- **Regular updates**: Security patches for models
- **Vulnerability scanning**: Automated security checks

#### Processing Security
- **Sandboxing**: AI runs in isolated environments
- **Memory protection**: Prevent data leakage
- **Audit logging**: All AI access logged
- **Intrusion detection**: Monitor for attacks

#### Infrastructure Security
- **SOC 2 Type II**: Industry-standard compliance
- **Penetration testing**: Quarterly security audits
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Access controls**: Multi-factor authentication

### 9.2 Privacy Protections

#### Data Isolation
- Your AI data is isolated from other users
- No cross-user data sharing
- Strict access controls
- Regular security audits

#### Minimal Data Exposure
- AI sees only necessary data
- Context windows limit exposure
- Temporary processing only
- Automatic deletion after processing

#### Employee Access
- No employee access to AI query data
- Encrypted logs (cannot be read by humans)
- Audit trails for all access
- Zero-knowledge architecture (cloud encrypted mode)

---

## 10. Third-Party AI Services

### 10.1 OpenAI Integration

When using Cloud Encrypted mode, we may use OpenAI:

#### What OpenAI Provides
- GPT-4 language models
- Whisper transcription
- Advanced natural language understanding

#### Data Sharing with OpenAI
- **What's sent**: Encrypted prompts and context
- **What's NOT sent**: Personal identifiers, full database
- **Retention**: Zero data retention (per our DPA)
- **Training**: Your data is NOT used for OpenAI training
- **Privacy**: Subject to OpenAI's Enterprise Privacy Policy

#### Legal Protections
- Data Processing Agreement (DPA)
- Standard Contractual Clauses (SCCs)
- GDPR compliance
- Zero-retention guarantee
- Audit rights

### 10.2 Other AI Providers

We may use additional AI providers:

| Provider | Service | Data Shared | Retention | Location |
|----------|---------|-------------|-----------|----------|
| Pinecone | Vector search | Encrypted embeddings | Until deletion | US |
| Anthropic (Future) | Alternative language models | Encrypted prompts | Zero retention | US |

**All providers**:
- Sign Data Processing Agreements
- GDPR-compliant
- Zero or minimal data retention
- Regular security audits

### 10.3 Your Control

- Choose processing mode (on-device vs. cloud)
- Opt-out of cloud AI entirely
- View which providers are used
- Request data deletion from providers

---

## 11. Children and AI

**Thoughtmarks is not intended for children under 13.**

- No AI features designed for children
- No collection of children's data for AI training
- Immediate deletion if underage use discovered
- Parental controls not applicable (service restricted to 13+)

---

## 12. Future AI Development

### 12.1 Upcoming Features (Roadmap)

**Planned AI enhancements** (subject to change):

#### Short-Term (3-6 months)
- Multi-language voice transcription improvements
- Contextual auto-tagging
- Enhanced semantic search
- Improved suggestion accuracy

#### Medium-Term (6-12 months)
- Conversation mode with AI assistant
- Advanced insight discovery
- Pattern recognition and trend analysis
- Collaborative AI (team features)

#### Long-Term (12+ months)
- Custom AI model training (Enterprise)
- Federated learning (privacy-preserving training)
- Real-time transcription and translation
- Multimodal AI (text + voice + images)

### 12.2 User Feedback

We actively seek user feedback on AI:

- In-app feedback forms
- User research sessions
- Beta testing programs
- Public roadmap voting

**Participate**: Settings → Help → Provide Feedback

### 12.3 Ethical AI Commitment

We commit to:

- 🎯 **Transparency**: Clear explanations of AI capabilities and limitations
- ⚖️ **Fairness**: Bias detection and mitigation
- 🔒 **Privacy**: Privacy-first AI design
- 🛡️ **Safety**: Content moderation and abuse prevention
- 🌍 **Accessibility**: AI benefits for all users
- 📚 **Education**: Help users understand and trust AI

---

## 13. Regulatory Compliance

### 13.1 GDPR Compliance

Our AI practices comply with GDPR:

- **Lawful basis**: Legitimate interest + consent for training
- **Data minimization**: Only necessary data used
- **Purpose limitation**: Clear, specific purposes
- **Storage limitation**: Temporary processing only
- **Transparency**: Clear explanations provided
- **User rights**: Full GDPR rights respected

### 13.2 AI Act Compliance (EU)

**Preparing for EU AI Act compliance:**

- **Risk classification**: Low-risk AI systems
- **Transparency obligations**: Clear AI disclosure
- **Human oversight**: Human review available
- **Accuracy requirements**: Regular accuracy testing
- **Bias mitigation**: Fairness assessments

### 13.3 Other Regulations

- **CCPA (California)**: Right to opt-out, data access
- **PIPEDA (Canada)**: Privacy-by-design AI
- **LGPD (Brazil)**: Data subject rights
- **PDPA (Singapore)**: Consent and notification

---

## 14. Incident Reporting

### 14.1 AI Errors and Issues

**Report AI problems:**

- **In-app**: Long-press AI result → Report Issue
- **Email**: ai-feedback@thoughtmarks.app
- **Include**: Description, screenshots, input data (optional)

### 14.2 Safety Concerns

**Report safety or ethical concerns:**

- **Email**: ai-ethics@thoughtmarks.app
- **Include**: Description of concern, examples
- **Response**: Within 24 hours for safety issues

### 14.3 Bug Bounty

**Security vulnerabilities in AI systems:**

- **Email**: security@thoughtmarks.app
- **Rewards**: $100-$5,000 depending on severity
- **Responsible disclosure**: Give us 90 days to fix

---

## 15. Contact Information

### 15.1 AI Support

**Email**: ai-support@thoughtmarks.app  
**Subject**: "AI Feature Question"  
**Response**: Within 48 hours

### 15.2 AI Ethics and Fairness

**Email**: ai-ethics@thoughtmarks.app  
**Subject**: "AI Ethics Concern"  
**Response**: Within 24 hours

### 15.3 Data Protection Officer

**Email**: dpo@thoughtmarks.app  
**Subject**: "AI Privacy Request"  
**Response**: Within 30 days (GDPR requirement)

---

## 16. Summary

### 16.1 Key Points

- 🔒 **Privacy-first**: On-device AI by default
- ⚡ **Your choice**: Select processing mode
- 🚫 **No training**: Your data not used for AI training (unless opt-in)
- ✅ **Transparency**: Clear explanations of AI capabilities
- 🎯 **Accuracy**: 85-95% accuracy for most features
- ⚖️ **Fairness**: Active bias mitigation
- 🛡️ **Safety**: Content moderation and abuse prevention
- 📊 **Control**: Full control over AI features and data

### 16.2 Your Responsibilities

- Verify AI-generated content
- Report errors and issues
- Don't rely on AI for critical decisions
- Use AI ethically and responsibly

### 16.3 Our Commitments

- Transparent AI practices
- Privacy-preserving AI
- Continuous improvement
- Bias mitigation
- User empowerment

---

**Questions?** Contact us at ai-support@thoughtmarks.app or read our full [Privacy Policy](./privacy-policy.md) and [Terms of Service](./terms-of-service.md).

**Last Updated**: October 1, 2025  
**Effective Date**: October 1, 2025


