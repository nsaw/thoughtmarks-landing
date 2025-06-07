import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { SearchBar } from "@/components/search-bar";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AllThoughtmarks() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const { data: thoughtmarks = [], isLoading } = useThoughtmarks();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Thoughtmark deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete thoughtmark",
        variant: "destructive",
      });
    },
  });

  // Filter and search thoughtmarks
  const filteredThoughtmarks = useMemo(() => {
    return thoughtmarks.filter(thoughtmark => {
      const matchesSearch = searchQuery === "" || 
        thoughtmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thoughtmark.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === "" || 
        thoughtmark.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag && !thoughtmark.isDeleted;
    });
  }, [thoughtmarks, searchQuery, selectedTag]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    thoughtmarks.forEach(thoughtmark => {
      thoughtmark.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [thoughtmarks]);

  if (!user) {
    return (
      <PageLayout title="All Thoughtmarks" showBackButton={true} showNewButton={true}>
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-400">Please sign in to view your thoughtmarks</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="All Thoughtmarks" showBackButton={true} showNewButton={true}>
      <div className="max-w-md mx-auto space-y-4">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search all thoughtmarks..."
        />

        {/* Filter by Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("")}
              className="text-xs"
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className="text-xs"
              >
                #{tag}
              </Button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          {filteredThoughtmarks.length} thoughtmarks
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedTag && ` tagged with "${selectedTag}"`}
        </div>

        {/* Thoughtmarks List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
            ))
          ) : filteredThoughtmarks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {searchQuery || selectedTag ? "No thoughtmarks match your filters" : "No thoughtmarks yet"}
              </p>
              <Button 
                onClick={() => setLocation("/create")}
                className="bg-[#C6D600] hover:bg-[#B5C100] text-black"
              >
                Create Your First Thoughtmark
              </Button>
            </div>
          ) : (
            filteredThoughtmarks.map((thoughtmark) => (
              <ThoughtmarkCard
                key={thoughtmark.id}
                thoughtmark={thoughtmark}
                onEdit={() => setLocation(`/edit/${thoughtmark.id}`)}
                onDelete={() => deleteMutation.mutate(thoughtmark.id)}
                enableSwipeDelete={true}
              />
            ))
          )}
        </div>

        {/* Quick Stats */}
        {thoughtmarks.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-[#C6D600]">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Thoughtmarks</p>
                <p className="text-xl font-bold">{thoughtmarks.filter(t => !t.isDeleted).length}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Tags</p>
                <p className="text-xl font-bold">{allTags.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}