import { ReactNode, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Settings } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showNewButton?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  title, 
  showBackButton = false, 
  showNewButton = true,
  className = ""
}: PageLayoutProps) {
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !showBackButton) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      
      // Check if this is a horizontal swipe (more horizontal than vertical)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      
      // Check if it's a rightward swipe with sufficient distance (at least 100px)
      const isRightSwipe = deltaX > 100;
      
      // Only trigger navigation if it's a clear rightward swipe
      if (isHorizontalSwipe && isRightSwipe) {
        window.history.back();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showBackButton]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-blue-900/10 animate-pulse opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {title && (
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                {title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/settings")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className={`p-4 ${className}`}>
          {children}
        </div>

        {/* Floating Action Button */}
        {showNewButton && (
          <Button
            onClick={() => setLocation("/create")}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#C6D600] hover:bg-[#B5C100] text-black shadow-2xl hover:shadow-[0_0_30px_rgba(198,214,0,0.5)] transition-all duration-300 z-50 border-2 border-[#C6D600]/20"
            size="lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}