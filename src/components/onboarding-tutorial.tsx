import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Mic, Smartphone, Settings } from "lucide-react";
import { installSiriShortcuts } from "@/lib/siri-shortcuts";
import { useToast } from "@/hooks/use-toast";

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "Welcome to Thoughtmarks!",
    description: "Your personal knowledge management system for capturing thoughts without breaking flow state.",
    icon: "🧠",
    action: null,
  },
  {
    id: 2,
    title: "Voice to Thoughtmark",
    description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
    icon: "🎤",
    action: null,
  },
  {
    id: 3,
    title: "Set up Siri Shortcuts",
    description: "Enable voice commands like 'Hey Siri, capture thoughtmark' for hands-free idea capture anywhere on your device.",
    icon: "📱",
    action: "siri-shortcuts",
  },
  {
    id: 4,
    title: "Organize with Smart Bins",
    description: "AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.",
    icon: "📁",
    action: null,
  },
  {
    id: 5,
    title: "Search & Discover",
    description: "Find your thoughts instantly with semantic search. Related ideas surface automatically as you work.",
    icon: "🔍",
    action: null,
  },
];

export function OnboardingTutorial({ isOpen, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSiriShortcuts = async () => {
    try {
      await installSiriShortcuts();
      toast({
        title: "Siri Shortcuts Added!",
        description: "You can now say 'Hey Siri, capture thoughtmark' to create new thoughts.",
      });
    } catch (error) {
      toast({
        title: "Setup Instructions",
        description: "To set up Siri Shortcuts manually, go to Settings > Siri & Search > Add to Siri and search for Thoughtmarks.",
        variant: "default",
      });
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className={`w-full max-w-md mx-4 bg-gray-900 border-gray-700 transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-2xl animate-bounce-gentle">
                {currentTutorialStep.icon}
              </div>
              <span className="text-sm text-gray-400">
                {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
            <div
              className="bg-[#C6D600] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-3 animate-fade-in-up">
              {currentTutorialStep.title}
            </h2>
            <p className="text-gray-300 leading-relaxed animate-fade-in-up">
              {currentTutorialStep.description}
            </p>
          </div>

          {/* Action buttons for specific steps */}
          {currentTutorialStep.action === "siri-shortcuts" && (
            <div className="mb-6">
              <Button
                onClick={handleSiriShortcuts}
                className="w-full bg-[#C6D600] text-black hover:bg-[#B5C100] animate-tooltip-pop"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Set up Siri Shortcuts
              </Button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                This will add voice commands to your iOS device
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-[#C6D600] animate-pulse-neon'
                      : index < currentStep
                      ? 'bg-[#C6D600]/60'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="bg-[#C6D600] text-black hover:bg-[#B5C100]"
            >
              {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}