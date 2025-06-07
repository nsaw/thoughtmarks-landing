import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BinSelector } from "@/components/bin-selector";
import { TagChip } from "@/components/ui/tag-chip";
import { FileUpload } from "@/components/file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertThoughtmarkSchema } from "@shared/schema";
import { z } from "zod";
import type { BinWithCount } from "@shared/schema";
import type { FileAttachment } from "@/components/file-upload";

const formSchema = insertThoughtmarkSchema.extend({
  tags: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateThoughtmark() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Get URL params for voice note handling
  const urlParams = new URLSearchParams(window.location.search);
  const transcript = urlParams.get('transcript');
  const binId = urlParams.get('binId');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      binId: binId ? parseInt(binId) : undefined,
      tags: [],
    },
  });

  // Load bins
  const { data: bins = [], isLoading: binsLoading } = useQuery<BinWithCount[]>({
    queryKey: ["/api/bins"],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        tags: selectedTags,
        attachments: attachments.length > 0 ? attachments : undefined,
      };
      const response = await apiRequest("POST", "/api/thoughtmarks", payload);
      if (!response.ok) {
        throw new Error("Failed to create thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Thoughtmark created successfully",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create thoughtmark",
        variant: "destructive",
      });
    },
  });

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      const sortLaterBin = bins.find(bin => bin.name === "Sort Later");
      
      form.setValue("title", `Voice Note - ${new Date().toLocaleDateString()}`);
      form.setValue("content", decodeURIComponent(transcript));
      form.setValue("binId", sortLaterBin?.id);
      const voiceTags = ["voice"];
      form.setValue("tags", voiceTags);
      setSelectedTags(voiceTags);
    }
  }, [transcript, form, bins]);

  // AI categorization mutation
  const categorizeMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/ai/categorize", { title, content });
      if (!response.ok) {
        throw new Error("Failed to get AI suggestions");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAiSuggestions(data.suggestions || []);
      setShowAiSuggestions(true);
    },
    onError: () => {
      setAiSuggestions([]);
      setShowAiSuggestions(false);
    }
  });

  const triggerAiCategorization = () => {
    const title = form.getValues("title");
    const content = form.getValues("content");
    
    if (title && content && title.length > 3 && content.length > 10) {
      categorizeMutation.mutate({ title, content });
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const commonTags = ["work", "personal", "ideas", "research", "goals", "notes"];

  return (
    <PageLayout title="New Thoughtmark" showBackButton={true} showNewButton={false}>
      <div className="max-w-md mx-auto pb-24">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <Input
              {...form.register("title")}
              placeholder="Give your thoughtmark a title..."
              className="w-full px-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-[#C6D600] focus:border-[#C6D600]"
              onBlur={triggerAiCategorization}
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Context
            </label>
            <Textarea
              {...form.register("content")}
              rows={6}
              placeholder="Capture your thoughts, insights, or ideas..."
              className="w-full px-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-[#C6D600] focus:border-[#C6D600] resize-none"
              onBlur={triggerAiCategorization}
            />
            {form.formState.errors.content && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          {/* AI Categorization Suggestions */}
          {showAiSuggestions && aiSuggestions.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-blue-300">AI Suggestions</span>
              </div>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const suggestedBin = bins.find(b => b.name === suggestion.binName);
                      if (suggestedBin) {
                        form.setValue("binId", suggestedBin.id);
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg bg-blue-800/30 hover:bg-blue-700/40 border border-blue-600/50"
                  >
                    <div className="font-medium text-blue-200">{suggestion.binName}</div>
                    <div className="text-sm text-blue-300 mt-1">{suggestion.reasoning}</div>
                    <div className="text-xs text-blue-400 mt-1">
                      Confidence: {Math.round(suggestion.confidence * 100)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bin Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Bin
            </label>
            <BinSelector
              bins={bins}
              selectedBinId={form.watch("binId") ?? undefined}
              onBinSelect={(binId) => form.setValue("binId", binId)}
              placeholder="Select a bin..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {commonTags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  variant={selectedTags.includes(tag) ? "primary" : "secondary"}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Attachments
            </label>
            <FileUpload
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              maxFiles={5}
              maxSizeInMB={10}
              acceptedTypes={['image/*', 'application/pdf', 'text/*', 'audio/*', 'video/*']}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-[#C6D600] hover:bg-[#B5C100] text-black"
            >
              {createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}