// Enhanced Siri Shortcuts integration for iOS
export interface SiriShortcut {
  phrase: string;
  title: string;
  description: string;
  url: string;
}

export const siriShortcuts: SiriShortcut[] = [
  {
    phrase: "Add thoughtmark",
    title: "New Thoughtmark",
    description: "Quickly capture a new thoughtmark with voice",
    url: `${window.location.origin}/create?voice=true`
  },
  {
    phrase: "Voice note",
    title: "Voice Thoughtmark", 
    description: "Record a voice note as a thoughtmark",
    url: `${window.location.origin}/create?voice=true&bin=1`
  },
  {
    phrase: "Quick thought",
    title: "Quick Thoughtmark",
    description: "Capture a quick thought for later",
    url: `${window.location.origin}/create?quick=true`
  },
  {
    phrase: "Review thoughtmarks",
    title: "Review Today's Thoughts",
    description: "See thoughtmarks from today",
    url: `${window.location.origin}/?filter=today`
  }
];

export function generateSiriShortcutURL(shortcut: SiriShortcut): string {
  const baseURL = "https://www.icloud.com/shortcuts/";
  const shortcutData = {
    WFWorkflowName: shortcut.title,
    WFWorkflowTypes: ["NCWidget", "WatchKit"],
    WFWorkflowActions: [
      {
        WFWorkflowActionIdentifier: "is.workflow.actions.openurl",
        WFWorkflowActionParameters: {
          WFInput: shortcut.url
        }
      }
    ]
  };
  
  return `${baseURL}?data=${encodeURIComponent(JSON.stringify(shortcutData))}`;
}

export function installSiriShortcuts(): void {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    // Register service worker for background processing
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('Service Worker registered for Siri Shortcuts');
    });
  }
  
  // Add to home screen prompt
  const addToHomeScreen = () => {
    const instructions = `
To use Siri with Thoughtmarks:

1. Add this app to your home screen
2. Open the Shortcuts app on iOS
3. Create a new shortcut with these phrases:
   - "Add thoughtmark" → Opens voice recorder
   - "Quick thought" → Opens new thoughtmark form
   - "Review thoughtmarks" → Shows today's thoughts

4. Set the action to "Open App" and select Thoughtmarks
    `;
    
    alert(instructions);
  };
  
  // Detect if running as PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (!isStandalone) {
    addToHomeScreen();
  }
}

export function handleSiriParameters(): void {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('voice') === 'true') {
    // Auto-trigger voice recording
    setTimeout(() => {
      const voiceButton = document.querySelector('[data-voice-trigger]');
      if (voiceButton) {
        (voiceButton as HTMLElement).click();
      }
    }, 500);
  }
  
  if (urlParams.get('quick') === 'true') {
    // Focus on title input for quick entry
    setTimeout(() => {
      const titleInput = document.querySelector('input[name="title"]');
      if (titleInput) {
        (titleInput as HTMLInputElement).focus();
      }
    }, 500);
  }
}