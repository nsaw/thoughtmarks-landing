import { Home, Search, Archive, Mic } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BottomNavProps {
  onNavigate: (path: string) => void;
  onVoiceRecord?: () => void;
}

export function BottomNav({ onNavigate, onVoiceRecord }: BottomNavProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Mic, label: "Voice", action: "voice" },
    { icon: Archive, label: "Bins", path: "/all-bins" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
      <div className="bg-gray-900/90 backdrop-blur-md border-t border-gray-700 p-4">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const { icon: Icon, label, path, action } = item;
            const isActive = location === path;
            const isVoice = action === "voice";
            
            return (
              <button
                key={path || action || label}
                onClick={() => {
                  if (isVoice && onVoiceRecord) {
                    onVoiceRecord();
                  } else if (path) {
                    onNavigate(path);
                  }
                }}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
                  isVoice ? "hover:bg-red-500/20" : "hover:bg-white/10"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-[#C6D600]" : isVoice ? "text-red-400" : "text-gray-400"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs",
                    isActive ? "text-[#C6D600] font-medium" : isVoice ? "text-red-400" : "text-gray-400"
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
