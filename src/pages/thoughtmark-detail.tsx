import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Edit3, Save, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertThoughtmarkSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useBins } from "@/hooks/use-bins";
import { z } from "zod";
import type { Thoughtmark, ThoughtmarkWithBin } from "@shared/schema";

const editThoughtmarkSchema = insertThoughtmarkSchema.extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type EditThoughtmarkForm = z.infer<typeof editThoughtmarkSchema>;

export default function ThoughtmarkDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  
  const { user } = useAuth();
  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { data: bins = [] } = useBins();

  const thoughtmarkId = params.id ? parseInt(params.id) : null;
  const currentThoughtmark = thoughtmarks.find(t => t.id === thoughtmarkId);
  const currentIndex = thoughtmarks.findIndex(t => t.id === thoughtmarkId);
  
  const prevThoughtmark = currentIndex > 0 ? thoughtmarks[currentIndex - 1] : null;
  const nextThoughtmark = currentIndex < thoughtmarks.length - 1 ? thoughtmarks[currentIndex + 1] : null;

  const form = useForm<EditThoughtmarkForm>({
    resolver: zodResolver(editThoughtmarkSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      binId: undefined,
    },
  });

  // Set form values when thoughtmark loads
  useEffect(() => {
    if (currentThoughtmark) {
      form.reset({
        title: currentThoughtmark.title,
        content: currentThoughtmark.content,
        tags: currentThoughtmark.tags || [],
        binId: currentThoughtmark.binId || undefined,
      });
    }
  }, [currentThoughtmark, form]);

  // Swipe navigation handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // Swipe threshold
    if (Math.abs(diffX) > 100) {
      if (diffX > 0 && nextThoughtmark) {
        // Swipe left - next thoughtmark
        setLocation(`/thoughtmark/${nextThoughtmark.id}`);
      } else if (diffX < 0 && prevThoughtmark) {
        // Swipe right - previous thoughtmark
        setLocation(`/thoughtmark/${prevThoughtmark.id}`);
      }
    }
    
    setStartX(null);
  };

  const updateThoughtmarkMutation = useMutation({
    mutationFn: async (data: EditThoughtmarkForm) => {
      const response = await apiRequest("PATCH", `/api/thoughtmarks/${thoughtmarkId}`, data);
      if (!response.ok) {
        throw new Error("Failed to update thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Thoughtmark updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update thoughtmark",
        variant: "destructive",
      });
    },
  });

  const deleteThoughtmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${thoughtmarkId}`);
      if (!response.ok) {
        throw new Error("Failed to delete thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      toast({
        title: "Success",
        description: "Thoughtmark moved to trash",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete thoughtmark",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditThoughtmarkForm) => {
    updateThoughtmarkMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm("Move this thoughtmark to trash?")) {
      deleteThoughtmarkMutation.mutate();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please sign in to view thoughtmarks</p>
      </div>
    );
  }

  if (!currentThoughtmark) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-title text-white">Thoughtmark Not Found</h1>
          </div>
          <p className="text-gray-400 mb-4">The thoughtmark could not be found.</p>
          <Button onClick={() => setLocation("/")}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentBin = bins.find(b => b.id === currentThoughtmark.binId);

  return (
    <div 
      className="min-h-screen bg-black text-white p-4 pb-20"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-title text-white">Thoughtmark</h1>
              {currentBin && (
                <p className="text-sm text-gray-400">{currentBin.name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation indicators */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => prevThoughtmark && setLocation(`/thoughtmark/${prevThoughtmark.id}`)}
            disabled={!prevThoughtmark}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <span className="text-xs text-gray-500">
            {currentIndex + 1} of {thoughtmarks.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => nextThoughtmark && setLocation(`/thoughtmark/${nextThoughtmark.id}`)}
            disabled={!nextThoughtmark}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Content */}
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-900 border-gray-700 text-white resize-none"
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-gray-700 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateThoughtmarkMutation.isPending}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateThoughtmarkMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {currentThoughtmark.title}
              </h2>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {currentThoughtmark.content}
                </p>
              </div>
            </div>

            {currentThoughtmark.tags && currentThoughtmark.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentThoughtmark.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
              Created {new Date(currentThoughtmark.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}