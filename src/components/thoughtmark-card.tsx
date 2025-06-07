import { Card, CardContent } from "@/components/ui/card";
import { TagChip } from "@/components/ui/tag-chip";
import { SwipeToDelete } from "@/components/ui/swipe-to-delete";
import { ShareButton } from "@/components/share-dialog";
import { Edit2 } from "lucide-react";
import type { ThoughtmarkWithBin } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ThoughtmarkCardProps {
  thoughtmark: ThoughtmarkWithBin;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  enableSwipeDelete?: boolean;
}

export function ThoughtmarkCard({ 
  thoughtmark, 
  onEdit, 
  onDelete, 
  onClick, 
  enableSwipeDelete = false 
}: ThoughtmarkCardProps) {
  const cardContent = (
    <Card 
      className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-white text-sm line-clamp-1">
            {thoughtmark.title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(thoughtmark.updatedAt), { addSuffix: true })}
            </span>
            <div className="flex space-x-1">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <div onClick={(e) => e.stopPropagation()}>
                <ShareButton thoughtmark={thoughtmark} variant="icon" />
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {thoughtmark.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {thoughtmark.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          {thoughtmark.binName && (
            <span className="text-xs text-gray-400">
              {thoughtmark.binName}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (enableSwipeDelete && onDelete) {
    return (
      <SwipeToDelete onDelete={onDelete}>
        {cardContent}
      </SwipeToDelete>
    );
  }

  return cardContent;
}
