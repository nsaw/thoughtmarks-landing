# Apple Watch Companion App Plan

## Overview
This document outlines the comprehensive plan for developing an Apple Watch companion app that integrates with the main Thoughtmarks mobile app, focusing on Voice-to-Thoughtmark (VTT) functionality and Siri integration.

## Core Features

### 1. One-Tap Voice Capture
**Purpose**: Enable quick voice note capture directly from the Apple Watch without opening the iPhone app.

**Implementation**:
- **Watch App**: Simple interface with a single "Record" button
- **Voice Recording**: Use WatchKit's audio recording capabilities
- **Local Storage**: Store recordings temporarily on the watch
- **Sync Queue**: Queue recordings for sync to iPhone when connected

**User Flow**:
1. User taps the "Record" button on the watch
2. Watch starts recording audio
3. User speaks their thoughtmark
4. User taps "Stop" to end recording
5. Recording is queued for sync to iPhone
6. Confirmation is shown on the watch

### 2. Siri Integration
**Purpose**: Enable hands-free voice commands for creating thoughtmarks via Siri.

**Implementation**:
- **Siri Shortcuts**: Create custom Siri shortcuts for voice commands
- **Intent Handling**: Handle Siri intents on both watch and iPhone
- **Voice Commands**: Support commands like "Create thoughtmark" or "Add to bin"
- **Context Awareness**: Understand context from previous interactions

**Supported Commands**:
- "Hey Siri, create a thoughtmark"
- "Hey Siri, add to my work bin"
- "Hey Siri, what's my latest thoughtmark?"
- "Hey Siri, search my thoughtmarks"

### 3. Queued Sync via WCSession
**Purpose**: Synchronize data between the Apple Watch and iPhone app using WatchConnectivity.

**Implementation**:
- **WCSession**: Use WatchConnectivity framework for communication
- **Message Queuing**: Queue messages when devices are not connected
- **Data Sync**: Sync voice recordings, settings, and recent thoughtmarks
- **Conflict Resolution**: Handle sync conflicts gracefully

**Sync Strategy**:
- **Bidirectional**: Sync data in both directions
- **Incremental**: Only sync changed data
- **Offline Support**: Queue operations when offline
- **Background Sync**: Sync in background when possible

## Technical Architecture

### 1. Watch App Structure
```
WatchApp/
├── WatchKit Extension/
│   ├── InterfaceController.swift
│   ├── VoiceRecorderController.swift
│   ├── SettingsController.swift
│   └── SyncManager.swift
├── WatchKit App/
│   ├── Interface.storyboard
│   └── Assets.xcassets
└── Shared/
    ├── Models/
    ├── Services/
    └── Utilities/
```

### 2. Communication Layer
```swift
// WCSession Manager
class WatchConnectivityManager: NSObject, WCSessionDelegate {
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        // Handle incoming messages from iPhone
    }
    
    func sendMessage(_ message: [String: Any]) {
        // Send message to iPhone
    }
    
    func syncVoiceRecording(_ recording: VoiceRecording) {
        // Sync voice recording to iPhone
    }
}
```

### 3. Voice Recording Service
```swift
class WatchVoiceRecorder: NSObject {
    func startRecording() {
        // Start audio recording on watch
    }
    
    func stopRecording() -> VoiceRecording {
        // Stop recording and return audio data
    }
    
    func transcribeAudio(_ audioData: Data) -> String {
        // Transcribe audio using on-device or cloud STT
    }
}
```

## User Experience Design

### 1. Watch App Interface
**Main Screen**:
- Large "Record" button (primary action)
- Recent thoughtmarks list (scrollable)
- Settings access (gear icon)

**Recording Screen**:
- Recording indicator with waveform
- Stop button
- Cancel button
- Recording duration

**Settings Screen**:
- Sync status
- Voice settings
- Bin preferences
- About information

### 2. Siri Integration
**Shortcut Creation**:
- Automatically create shortcuts when app is installed
- Allow users to customize shortcut phrases
- Provide suggested shortcuts based on usage

**Intent Handling**:
- Handle voice commands gracefully
- Provide feedback for successful operations
- Handle errors and edge cases

### 3. Sync Experience
**Sync Status**:
- Show sync status on watch face
- Indicate when sync is in progress
- Show last sync time

**Offline Support**:
- Queue operations when offline
- Show queued items count
- Sync when connection is restored

## Implementation Phases

### Phase 1: Core Watch App (4-6 weeks)
**Deliverables**:
- Basic watch app with recording functionality
- WCSession communication setup
- Voice recording and playback
- Basic UI implementation

**Technical Tasks**:
- Set up WatchKit project
- Implement voice recording
- Create WCSession manager
- Design basic UI

### Phase 2: Siri Integration (3-4 weeks)
**Deliverables**:
- Siri shortcuts implementation
- Intent handling on both devices
- Voice command processing
- Custom shortcut creation

**Technical Tasks**:
- Implement Siri shortcuts
- Create intent definitions
- Handle voice commands
- Test Siri integration

### Phase 3: Advanced Features (4-5 weeks)
**Deliverables**:
- Advanced sync capabilities
- Offline support
- Settings synchronization
- Performance optimization

**Technical Tasks**:
- Implement advanced sync
- Add offline queuing
- Sync settings and preferences
- Optimize performance

### Phase 4: Polish and Testing (2-3 weeks)
**Deliverables**:
- UI polish and animations
- Comprehensive testing
- Performance optimization
- App Store preparation

**Technical Tasks**:
- Polish UI and animations
- Comprehensive testing
- Performance optimization
- App Store submission

## Technical Requirements

### 1. Development Environment
- **Xcode**: Latest version with WatchKit support
- **iOS Deployment Target**: iOS 14.0+
- **watchOS Deployment Target**: watchOS 7.0+
- **Swift**: Swift 5.0+

### 2. Frameworks and APIs
- **WatchKit**: Core watch app framework
- **WatchConnectivity**: Communication between devices
- **AVFoundation**: Audio recording and playback
- **Intents**: Siri integration
- **Core Data**: Local data storage

### 3. Dependencies
- **Audio Processing**: Use native AVFoundation
- **Network Communication**: WatchConnectivity
- **Data Persistence**: Core Data or SQLite
- **UI Framework**: WatchKit

## Data Flow

### 1. Voice Recording Flow
```
User taps Record → Watch starts recording → User speaks → 
User taps Stop → Watch processes audio → Watch queues for sync → 
Watch sends to iPhone → iPhone processes and stores → 
iPhone sends confirmation → Watch shows success
```

### 2. Siri Command Flow
```
User says "Hey Siri, create thoughtmark" → Siri processes command → 
Siri calls app intent → App handles intent → App creates thoughtmark → 
App provides feedback → Siri confirms to user
```

### 3. Sync Flow
```
Watch has new data → Watch checks connection → 
If connected: Send immediately → If offline: Queue for later → 
iPhone receives data → iPhone processes data → 
iPhone sends confirmation → Watch updates status
```

## Testing Strategy

### 1. Unit Testing
- Test individual components and services
- Mock external dependencies
- Test error handling and edge cases

### 2. Integration Testing
- Test WCSession communication
- Test Siri integration
- Test sync functionality

### 3. User Testing
- Test with real users
- Gather feedback on usability
- Test accessibility features

### 4. Performance Testing
- Test battery usage
- Test sync performance
- Test memory usage

## Deployment Strategy

### 1. App Store Submission
- Submit watch app as part of main app bundle
- Use App Store Connect for distribution
- Follow Apple's watch app guidelines

### 2. Beta Testing
- Use TestFlight for beta testing
- Test with limited user group
- Gather feedback and iterate

### 3. Release Strategy
- Release with main app update
- Gradual rollout to users
- Monitor usage and performance

## Success Metrics

### 1. Usage Metrics
- Daily active users on watch
- Voice recordings per day
- Siri command usage
- Sync success rate

### 2. Performance Metrics
- Battery usage impact
- Sync speed and reliability
- App launch time
- Memory usage

### 3. User Satisfaction
- User ratings and reviews
- Feature usage analytics
- Support ticket volume
- User feedback

## Risk Mitigation

### 1. Technical Risks
- **WCSession Reliability**: Implement robust error handling and retry logic
- **Battery Usage**: Optimize for battery efficiency
- **Sync Conflicts**: Implement conflict resolution strategies

### 2. User Experience Risks
- **Complexity**: Keep interface simple and intuitive
- **Performance**: Ensure smooth performance on older devices
- **Accessibility**: Ensure accessibility compliance

### 3. Business Risks
- **Development Time**: Plan for potential delays
- **App Store Approval**: Follow Apple guidelines closely
- **User Adoption**: Focus on core value proposition

## Conclusion

The Apple Watch companion app will significantly enhance the Thoughtmarks experience by enabling quick voice capture and hands-free operation. The implementation plan provides a clear roadmap for development while ensuring technical feasibility and user value.

**Key Benefits**:
- **Quick Capture**: One-tap voice recording from the watch
- **Hands-Free Operation**: Siri integration for voice commands
- **Seamless Sync**: Reliable data synchronization between devices
- **Enhanced Productivity**: Faster thoughtmark creation workflow

**Next Steps**:
1. Begin Phase 1 development
2. Set up development environment
3. Create initial watch app prototype
4. Test core functionality
5. Iterate based on feedback

**Timeline**: 13-18 weeks total development time
**Team**: 1-2 developers with watchOS experience
**Budget**: Development time and App Store fees
