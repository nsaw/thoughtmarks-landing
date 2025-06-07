import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";

interface PersistentLayoutProps {
  children: React.ReactNode;
  onVoiceRecord?: () => void;
}

export function PersistentLayout({ children, onVoiceRecord }: PersistentLayoutProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen bg-black">
      {/* Main content */}
      <div className="pb-32">
        {children}
      </div>

      {/* Black gradient overlay behind navigation - extends higher to fade page content behind button */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/98 via-black/92 via-black/85 via-black/70 via-black/50 via-black/30 to-transparent pointer-events-none z-10"></div>

      {/* Enhanced shadow effect for New Thoughtmark button - casts onto nav bar and page */}
      <div className="fixed bottom-16 left-0 right-0 px-4 max-w-md mx-auto z-15 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.9), 0 -24px 80px rgba(0, 0, 0, 0.7), 0 -36px 120px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.8)',
            filter: 'blur(4px)',
            transform: 'scale(1.2)',
            background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 70%)'
          }}
        ></div>
      </div>

      {/* Large New Thoughtmark Button at Bottom */}
      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-md mx-auto z-30">
        <div 
          className="p-1"
          style={{
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            background: 'linear-gradient(135deg, #C6D600 0%, #00D9FF 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 16px 64px rgba(0, 0, 0, 0.6)'
          }}
        >
          <Button 
            onClick={() => setLocation('/create')}
            className="w-full text-[#C6D600] hover:opacity-90 font-bold py-12 text-xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #000000 0%, #1e3a8a 100%)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              border: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.2), 0 -4px 16px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Plus className="w-8 h-8 mr-3" />
            NEW THOUGHTMARK
          </Button>
        </div>
      </div>

      <BottomNav 
        onNavigate={setLocation} 
        onVoiceRecord={onVoiceRecord}
      />
    </div>
  );
}