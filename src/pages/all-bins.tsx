import { useState } from "react";
import { useLocation } from "wouter";
import { DraggableBins } from "@/components/draggable-bins";
import { Button } from "@/components/ui/button";
import { useBins } from "@/hooks/use-bins";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import type { BinWithCount } from "@shared/schema";

export default function AllBins() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: bins = [], isLoading: binsLoading } = useBins();

  // Define the same order as dashboard main page
  const dashboardBinOrder = [
    'Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 
    'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy'
  ];

  // Sort bins to match dashboard order, then alphabetically for others
  const sortedBins = [...bins].sort((a, b) => {
    const aIndex = dashboardBinOrder.indexOf(a.name);
    const bIndex = dashboardBinOrder.indexOf(b.name);
    
    // If both bins are in dashboard order, sort by dashboard position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in dashboard order, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // For bins not in dashboard order, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  // Bin reordering mutation
  const reorderBinsMutation = useMutation({
    mutationFn: async (newOrder: BinWithCount[]) => {
      const updates = newOrder.map((bin, index) => ({
        id: bin.id,
        order: index
      }));
      return apiRequest("PATCH", "/api/bins/reorder", { updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Bins reordered",
        description: "Your bin order has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reorder bins. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle bin reordering
  const handleBinsReorder = (newOrder: BinWithCount[]) => {
    reorderBinsMutation.mutate(newOrder);
  };

  // Handle bin click navigation
  const handleBinClick = (bin: BinWithCount) => {
    setLocation(`/bin/${bin.id}`);
  };

  return (
    <PageLayout title="All Bins" showBackButton={true} showNewButton={true}>
      <div className="max-w-md mx-auto pb-24">
        <div className="mb-6">
          <p className="text-xs text-gray-400 font-subtitle">Organize and reorder your bins</p>
        </div>

        {/* Bins Grid with Drag and Drop */}
        <div className="mb-4">
          {binsLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <DraggableBins
              bins={sortedBins}
              onBinClick={handleBinClick}
              onBinsReorder={handleBinsReorder}
            />
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <h3 className="text-sm font-subtitle text-gray-300 mb-2">How to reorder</h3>
          <p className="text-xs text-gray-400 font-body">
            Drag and drop bins to reorder them. Changes are saved automatically.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}