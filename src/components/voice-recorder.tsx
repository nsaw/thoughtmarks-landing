import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { voiceHandler } from "@/lib/voice-handler";

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export function VoiceRecorder({ isOpen, onClose, onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  const startRecording = async () => {
    try {
      // Reset transcript state
      setTranscript("");
      transcriptRef.current = "";
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Initialize speech recognition if available
      try {
        if ('webkitSpeechRecognition' in window) {
          const recognition = new (window as any).webkitSpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            
            // Update transcript with final results
            if (finalTranscript) {
              transcriptRef.current = finalTranscript.trim();
              setTranscript(finalTranscript.trim());
            } else if (interimTranscript) {
              // Show interim results but don't store permanently yet
              setTranscript(interimTranscript.trim());
            }
            
            console.log('Speech recognition result:', { 
              finalTranscript, 
              interimTranscript, 
              storedTranscript: transcriptRef.current,
              displayTranscript: finalTranscript || interimTranscript
            });
          };

          recognition.onend = () => {
            const currentTranscript = transcriptRef.current;
            console.log('Speech recognition ended, transcript:', currentTranscript);
            // Auto-save when recognition ends
            if (currentTranscript.trim()) {
              console.log('Auto-saving voice note...');
              setTimeout(async () => {
                try {
                  await voiceHandler.handleVoiceTranscription(currentTranscript);
                  console.log('Voice note saved successfully');
                  onClose();
                } catch (error) {
                  console.error('Error saving voice note:', error);
                }
              }, 500);
            } else {
              console.log('No transcript to save');
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        }
      } catch (error) {
        console.log('Speech recognition not available:', error);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping speech recognition:', error);
      }
    }

    // Force save if we have transcript when stopping manually
    const currentTranscript = transcriptRef.current;
    if (currentTranscript.trim()) {
      console.log('Manual stop - saving transcript:', currentTranscript);
      setTimeout(async () => {
        try {
          await voiceHandler.handleVoiceTranscription(currentTranscript);
          console.log('Voice note saved on manual stop');
          onClose();
        } catch (error) {
          console.error('Error saving voice note on manual stop:', error);
        }
      }, 100);
    }
  };

  const playRecording = () => {
    if (recordedBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleUseTranscription = () => {
    if (transcript.trim()) {
      onTranscriptionComplete(transcript.trim());
      onClose();
    }
  };

  const handleAutoSave = async () => {
    if (transcript.trim()) {
      // Auto-save to Sort Later bin without user interaction
      await voiceHandler.handleVoiceTranscription(transcript);
      onClose();
    }
  };

  const handleManualSave = () => {
    if (transcript.trim()) {
      onTranscriptionComplete(transcript.trim());
      onClose();
    }
  };

  const handleRetry = () => {
    setTranscript("");
    setRecordedBlob(null);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Voice to Thoughtmark</h3>
          <p className="text-gray-400 text-sm">Record your thoughts and we'll transcribe them</p>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              onTouchEnd={isRecording ? stopRecording : startRecording}
              className={cn(
                "w-20 h-20 rounded-full border-4 transition-all duration-200 active:scale-95 touch-manipulation",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 active:bg-red-700 border-red-400 animate-pulse" 
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-blue-400"
              )}
              disabled={false}
              type="button"
            >
              {isRecording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </Button>
            
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping pointer-events-none" />
            )}
          </div>

          <p className="text-center text-sm text-gray-400">
            {isRecording ? "Recording... Tap to stop" : "Tap to start recording"}
          </p>
        </div>

        {/* Playback Controls */}
        {recordedBlob && !isRecording && (
          <div className="flex justify-center">
            <Button
              onClick={playRecording}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "Pause" : "Play"} Recording</span>
            </Button>
          </div>
        )}

        {/* Transcription */}
        {transcript && (
          <div className="space-y-3">
            <h4 className="font-medium text-white">Transcription:</h4>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 max-h-32 overflow-y-auto">
              {transcript}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          
          {transcript && (
            <>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
              >
                Retry
              </Button>
              <Button
                onClick={handleUseTranscription}
                className="flex-1 bg-[#C6D600] text-black hover:bg-[#C6D600]/90"
              >
                Create Thoughtmark
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}