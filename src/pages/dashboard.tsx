import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DraggableBins } from "@/components/draggable-bins";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { PersistentLayout } from "@/components/persistent-layout";
import { VoiceRecorder } from "@/components/voice-recorder";
import { IntroOverlay } from "@/components/intro-overlay";
import { useAutoBackup } from "@/lib/offline-backup";
import { useAuth } from "@/hooks/use-auth";
import { Settings, Plus, ChevronDown, ChevronUp, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBins } from "@/hooks/use-bins";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BinWithCount } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);
  const [showBinsSection, setShowBinsSection] = useState(true);
  const [showThoughtmarksSection, setShowThoughtmarksSection] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Backup service
  useAutoBackup();

  // Load bins and thoughtmarks
  const { data: bins = [], isLoading: binsLoading } = useBins();
  const { data: thoughtmarks = [], isLoading: thoughtmarksLoading } = useThoughtmarks();

  // Mutation for reordering bins
  const reorderBinsMutation = useMutation({
    mutationFn: async (newOrder: BinWithCount[]) => {
      // Update local storage immediately for offline support
      if (typeof window !== 'undefined') {
        localStorage.setItem('bins-order', JSON.stringify(newOrder.map(b => b.id)));
      }
      
      // Send to server if online
      return apiRequest("POST", "/api/bins/reorder", { 
        binIds: newOrder.map(b => b.id) 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bins'] });
    }
  });

  const handleBinClick = (bin: BinWithCount) => {
    setLocation(`/bins/${bin.id}`);
  };

  const handleBinsReorder = (newOrder: BinWithCount[]) => {
    reorderBinsMutation.mutate(newOrder);
  };

  const handleVoiceRecord = () => {
    setIsVoiceRecorderOpen(true);
  };

  const handleVoiceTranscriptionComplete = (transcription: string) => {
    setLocation(`/create?voice=${encodeURIComponent(transcription)}`);
    setIsVoiceRecorderOpen(false);
  };

  // Check for first-time user
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro && bins.length === 0 && thoughtmarks.length === 0) {
      setShowIntro(true);
    }
  }, [bins.length, thoughtmarks.length]);

  const handleIntroClose = () => {
    setShowIntro(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  // Custom Siri voice recording handler
  useEffect(() => {
    const handleSiriVoiceRecord = (event: CustomEvent) => {
      console.log("Siri voice record event received:", event.detail);
      handleVoiceRecord();
    };

    // Listen for Siri shortcut voice recording
    window.addEventListener('siri-voice-record', handleSiriVoiceRecord as EventListener);

    return () => {
      window.removeEventListener('siri-voice-record', handleSiriVoiceRecord as EventListener);
    };
  }, []);



  // Get recent thoughtmarks (last 5) with tag filtering
  const filteredThoughtmarks = thoughtmarks
    .filter(t => !t.isDeleted)
    .filter(t => selectedTag === "all" || t.tags.includes(selectedTag));

  const recentThoughtmarks = filteredThoughtmarks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get unique tags from all thoughtmarks
  const allTags = Array.from(new Set(thoughtmarks.flatMap(t => t.tags || [])));

  return (
    <PersistentLayout onVoiceRecord={handleVoiceRecord}>
      <div className="p-6">
        {/* Header with Logo and Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden mr-6">
              <img 
                src="https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg" 
                alt="Thoughtmarks Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2">
              <h1 className="text-2xl text-white animate-fade-in-up mb-0 font-extrabold uppercase" style={{ letterSpacing: '-0.02em', transform: 'scaleX(1.1)', fontFamily: 'Ubuntu, sans-serif' }}>
                THOUGHTMARKS
              </h1>
              <p className="text-xs neon-gradient-text font-body font-bold -mt-1">bookmarks for your brain</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/settings')}
            className="text-gray-400 hover:text-white transition-colors z-10"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {/* Tag Filter - Horizontal Scroll */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">tags</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white transition-colors h-6 px-2 text-xs"
            >
              ...
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={selectedTag === "all" ? "default" : "outline"}
              className={`cursor-pointer transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedTag === "all" 
                  ? "bg-[#C6D600] text-black hover:bg-[#B5C100]" 
                  : "border-gray-600 text-gray-300 hover:border-[#C6D600] hover:text-[#C6D600]"
              }`}
              onClick={() => setSelectedTag("all")}
            >
              All ({thoughtmarks.filter(t => !t.isDeleted).length})
            </Badge>
            {allTags.sort().map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedTag === tag 
                    ? "bg-[#C6D600] text-black hover:bg-[#B5C100]" 
                    : "border-gray-600 text-gray-300 hover:border-[#C6D600] hover:text-[#C6D600]"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag} ({thoughtmarks.filter(t => !t.isDeleted && t.tags.includes(tag)).length})
              </Badge>
            ))}
          </div>
        </div>

        {/* Bins Section */}
        <div className="mb-8">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer" 
            onClick={() => setShowBinsSection(!showBinsSection)}
          >
            <h2 className="text-xl font-semibold text-white">Your Bins</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation('/all-bins');
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                View All
              </Button>
              {showBinsSection ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
          
          {showBinsSection && (
            <div className="space-y-3">
              {binsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-16 bg-[#202124] rounded-lg animate-pulse shadow-sm" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Two-column grid for bins - matches dashboard order */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Default bins in order: Relevant, Life Hacks, Quotes, Inspiration, Circle Back, Revelations, Funny, Stories, Half-Baked, Team-Up, Newsworthy */}
                    {['Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy'].map((binName) => {
                      const bin = bins.find(b => b.name === binName);
                      return (
                        <div
                          key={binName}
                          onClick={() => bin && handleBinClick(bin)}
                          className="bg-[#202124] hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:ring-1 hover:ring-blue-500/30 h-16 flex items-center"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-white font-medium text-sm">
                              {binName}
                            </span>
                            <span className="text-blue-400 text-xs">
                              {bin?.thoughtmarkCount || 0}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* New Bin Button */}
                    <div
                      onClick={() => setLocation('/create-bin')}
                      className="bg-[#202124] hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border-2 border-dashed border-gray-600 hover:border-blue-500 h-16 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <Plus className="w-5 h-5 text-[#2999ff] mx-auto mb-1" />
                        <span className="text-[#2999ff] font-medium text-sm">New Bin</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Below grid items */}
                  <div className="space-y-2">
                    {/* Saved to Sort Later */}
                    <div
                      onClick={() => {
                        const sortLaterBin = bins.find(b => b.name === 'Sort Later');
                        if (sortLaterBin) {
                          setLocation(`/bins/${sortLaterBin.id}`);
                        } else {
                          setLocation('/bin/Sort Later');
                        }
                      }}
                      className="flex items-center justify-between p-3 hover:bg-gray-900/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-gray-400 text-sm">Saved to Sort Later</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    {/* View More */}
                    <div
                      onClick={() => setLocation('/all-bins')}
                      className="flex items-center justify-between p-3 hover:bg-gray-900/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-gray-400 text-sm">View More…</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5l4-4 4 4" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Recent Thoughtmarks Section */}
        <div className="mb-8">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowThoughtmarksSection(!showThoughtmarksSection)}
          >
            <h2 className="text-xl font-semibold text-white">
              {selectedTag === "all" ? "Recent Thoughtmarks" : `Recent "${selectedTag}" Thoughtmarks`}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation('/thoughtmarks');
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                View All
              </Button>
              {showThoughtmarksSection ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
          
          {showThoughtmarksSection && (
            <div className="space-y-3">
              {thoughtmarksLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentThoughtmarks.length > 0 ? (
                <div className="space-y-3">
                  {recentThoughtmarks.map((thoughtmark) => (
                    <ThoughtmarkCard
                      key={thoughtmark.id}
                      thoughtmark={thoughtmark}
                      onClick={() => setLocation(`/thoughtmark/${thoughtmark.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>
                    {selectedTag === "all" 
                      ? "No thoughtmarks yet. Tap the button below to create your first one!" 
                      : `No thoughtmarks with "${selectedTag}" tag found.`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <VoiceRecorder 
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        onTranscriptionComplete={handleVoiceTranscriptionComplete}
      />

      {/* First-time user intro overlay */}
      <IntroOverlay isOpen={showIntro} onClose={handleIntroClose} />
    </PersistentLayout>
  );
}