import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { TagChip } from "@/components/ui/tag-chip";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ThoughtmarkWithBin } from "@shared/schema";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [similarResults, setSimilarResults] = useState<(ThoughtmarkWithBin & { similarity: number })[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);

  // Get initial search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split("?")[1] || "");
    const query = urlParams.get("q") || "";
    setSearchQuery(query);
  }, [location]);

  const { data: searchResults = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/search", searchQuery, selectedTags],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      selectedTags.forEach(tag => params.append("tags", tag));
      
      const response = await apiRequest("GET", `/api/search?${params}`);
      return response.json();
    },
    enabled: !!(searchQuery || selectedTags.length > 0),
  });

  // Semantic search mutation
  const semanticSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/ai/similar", { query, limit: 5 });
      if (!response.ok) {
        throw new Error("Semantic search failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSimilarResults(data.results || []);
      setShowSimilar(true);
    },
    onError: () => {
      // Silently fail if AI is not available
      setSimilarResults([]);
      setShowSimilar(false);
    }
  });

  // Get unique tags from results
  const availableTags = Array.from(
    new Set(searchResults.flatMap(tm => tm.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    if (newQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", newQuery);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative">
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-gray-800 rounded-lg mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Search Results</h1>
            <p className="text-sm text-gray-400">
              {isLoading 
                ? "Searching..." 
                : `${searchResults.length} results${searchQuery ? ` for "${searchQuery}"` : ""}`
              }
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search thoughtmarks..."
          />
          {searchQuery && (
            <div className="mt-3">
              <Button
                onClick={() => semanticSearchMutation.mutate(searchQuery)}
                disabled={semanticSearchMutation.isPending}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {semanticSearchMutation.isPending ? "Finding..." : "Find Similar"}
              </Button>
            </div>
          )}
        </div>

        {/* Filter Tags */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <TagChip
              tag="All"
              variant={selectedTags.length === 0 ? "primary" : "secondary"}
              onClick={() => setSelectedTags([])}
            />
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                tag={tag}
                variant={selectedTags.includes(tag) ? "primary" : "secondary"}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        )}

        {/* AI Similar Results */}
        {showSimilar && similarResults.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-blue-300">Similar Thoughtmarks</h3>
              <button
                onClick={() => setShowSimilar(false)}
                className="ml-auto text-xs text-gray-400 hover:text-white"
              >
                Hide
              </button>
            </div>
            <div className="space-y-3">
              {similarResults.map((thoughtmark) => (
                <div key={`similar-${thoughtmark.id}`} className="relative">
                  <div className="absolute -left-2 top-3 w-1 h-6 bg-blue-400 rounded-full opacity-60"></div>
                  <div className="pl-4">
                    <ThoughtmarkCard
                      thoughtmark={thoughtmark}
                      onEdit={() => setLocation(`/edit/${thoughtmark.id}`)}
                    />
                    <div className="mt-2 text-xs text-blue-300">
                      {Math.round(thoughtmark.similarity * 100)}% similar
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              {searchQuery || selectedTags.length > 0 
                ? "No thoughtmarks found matching your search"
                : "Enter a search term to find thoughtmarks"
              }
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTags([]);
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((thoughtmark) => (
              <ThoughtmarkCard
                key={thoughtmark.id}
                thoughtmark={thoughtmark}
                onEdit={() => setLocation(`/edit/${thoughtmark.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav onNavigate={setLocation} />
    </div>
  );
}
