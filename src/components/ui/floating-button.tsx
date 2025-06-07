import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-14 h-14 rounded-full neon-gradient-border bg-gradient-to-br from-[#C6D600] to-[#00FFFF] hover:neon-glow text-black shadow-lg hover:shadow-xl transition-all duration-300 z-50 relative overflow-hidden"
      size="icon"
    >
      <Plus className="h-6 w-6 relative z-10" />
    </Button>
  );
}
