"use client";

import { useDraggable } from '@dnd-kit/core';
import { Eye, Edit, Copy, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
  id: string;
  content: string;
  scheduledTime: string;
  status: string;
  platform: string;
  color: string;
}

interface DraggablePostCardProps {
  post: Post;
  compact?: boolean;
  onView?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDuplicate?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export function DraggablePostCard({ 
  post, 
  compact = false,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: DraggablePostCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            ref={setNodeRef}
            style={{ ...style, backgroundColor: post.color }}
            className="text-xs p-1 rounded text-white truncate font-medium cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            {...listeners}
            {...attributes}
          >
            {formatTime(post.scheduledTime)} - {post.platform}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {onView && (
            <DropdownMenuItem onClick={() => onView(post.id)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(post.id)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Post
            </DropdownMenuItem>
          )}
          {onDuplicate && (
            <DropdownMenuItem onClick={() => onDuplicate(post.id)}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
          )}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Regular (non-compact) view
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={{ ...style, backgroundColor: post.color }}
          className="text-xs p-1 rounded text-white truncate font-medium cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
          {...listeners}
          {...attributes}
        >
          {formatTime(post.scheduledTime)} - {post.platform}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {onView && (
          <DropdownMenuItem onClick={() => onView(post.id)}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(post.id)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Post
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={() => onDuplicate(post.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(post.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
