import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ThoughtmarkWithBin, InsertThoughtmark } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { localStorageManager } from "@/lib/local-storage";
import { useAuth } from "./use-auth";

export function useThoughtmarks() {
  const queryClient = useQueryClient();
  const { isAuthenticated, guestMode } = useAuth();

  const thoughtmarksQuery = useQuery({
    queryKey: isAuthenticated ? ["/api/thoughtmarks"] : ["local-thoughtmarks"],
    queryFn: async () => {
      if (isAuthenticated) {
        try {
          const response = await apiRequest("GET", "/api/thoughtmarks");
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json() as Promise<ThoughtmarkWithBin[]>;
        } catch (error) {
          console.warn("API request failed, falling back to local storage:", error);
          return localStorageManager.getThoughtmarks();
        }
      } else {
        return localStorageManager.getThoughtmarks();
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createThoughtmarkMutation = useMutation({
    mutationFn: async (thoughtmark: InsertThoughtmark) => {
      if (isAuthenticated) {
        const response = await apiRequest("POST", "/api/thoughtmarks", thoughtmark);
        return response.json();
      } else {
        return localStorageManager.createThoughtmark(thoughtmark);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  const updateThoughtmarkMutation = useMutation({
    mutationFn: async ({ id, ...thoughtmark }: { id: number } & Partial<InsertThoughtmark>) => {
      if (isAuthenticated) {
        const response = await apiRequest("PATCH", `/api/thoughtmarks/${id}`, thoughtmark);
        return response.json();
      } else {
        return localStorageManager.updateThoughtmark(id, thoughtmark);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  const deleteThoughtmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isAuthenticated) {
        const response = await apiRequest("DELETE", `/api/thoughtmarks/${id}`);
        return response.json();
      } else {
        return localStorageManager.deleteThoughtmark(id);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  return {
    data: thoughtmarksQuery.data || [],
    isLoading: thoughtmarksQuery.isLoading,
    error: thoughtmarksQuery.error,
    createThoughtmark: createThoughtmarkMutation.mutate,
    updateThoughtmark: updateThoughtmarkMutation.mutate,
    deleteThoughtmark: deleteThoughtmarkMutation.mutate,
    isCreating: createThoughtmarkMutation.isPending,
    isUpdating: updateThoughtmarkMutation.isPending,
    isDeleting: deleteThoughtmarkMutation.isPending,
  };
}
