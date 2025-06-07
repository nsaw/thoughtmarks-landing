import { apiRequest } from "@/lib/queryClient";

export interface VoiceNoteData {
  transcript: string;
  binId?: number;
  timestamp: Date;
}

export class VoiceHandler {
  private static instance: VoiceHandler;
  
  static getInstance(): VoiceHandler {
    if (!VoiceHandler.instance) {
      VoiceHandler.instance = new VoiceHandler();
    }
    return VoiceHandler.instance;
  }

  async saveVoiceNote(data: VoiceNoteData): Promise<boolean> {
    try {
      // Find Sort Later bin if no specific bin provided
      let targetBinId = data.binId;
      
      if (!targetBinId) {
        const binsResponse = await apiRequest("GET", "/api/bins");
        const bins = await binsResponse.json();
        const sortLaterBin = bins.find((bin: any) => bin.name === "Sort Later");
        targetBinId = sortLaterBin?.id;
      }

      const thoughtmarkData = {
        title: `Voice Note - ${data.timestamp.toLocaleDateString()}`,
        content: data.transcript,
        tags: ["voice"],
        binId: targetBinId,
        attachments: []
      };

      const response = await apiRequest("POST", "/api/thoughtmarks", thoughtmarkData);
      
      if (response.ok) {
        const createdThoughtmark = await response.json();
        this.lastCreatedThoughtmarkId = createdThoughtmark.id;
        
        // Show success notification
        this.showNotification("Voice note saved to Sort Later", "success");
        return true;
      } else {
        throw new Error("Failed to save voice note");
      }
    } catch (error) {
      console.error("Error saving voice note:", error);
      this.showNotification("Failed to save voice note", "error");
      return false;
    }
  }

  private showNotification(message: string, type: "success" | "error"): void {
    // Create toast notification
    const event = new CustomEvent('voice-note-saved', {
      detail: { message, type }
    });
    window.dispatchEvent(event);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Thoughtmarks', {
        body: message,
        icon: '/favicon.ico',
        tag: 'voice-note'
      });
    }
  }

  async handleVoiceTranscription(transcript: string): Promise<number | null> {
    if (!transcript.trim()) return null;

    const voiceData: VoiceNoteData = {
      transcript: transcript.trim(),
      timestamp: new Date()
    };

    const success = await this.saveVoiceNote(voiceData);
    return success ? this.lastCreatedThoughtmarkId : null;
  }

  private lastCreatedThoughtmarkId: number | null = null;
}

export const voiceHandler = VoiceHandler.getInstance();