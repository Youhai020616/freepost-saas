"use client";

import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format, startOfWeek, addDays, addHours, isSameDay, isSameHour } from 'date-fns';
import { DraggablePostCard } from './draggable-post-card';

interface Post {
  id: string;
  content: string;
  scheduledTime: string;
  status: string;
  platform: string;
  color: string;
}

interface WeekViewProps {
  posts: Post[];
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
  onViewPost?: (postId: string) => void;
  onEditPost?: (postId: string) => void;
  onDuplicatePost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
}

// Time slot component with droppable functionality
function TimeSlot({ 
  day, 
  hour, 
  posts,
  onViewPost,
  onEditPost,
  onDuplicatePost,
  onDeletePost,
}: { 
  day: Date; 
  hour: number; 
  posts: Post[];
  onViewPost?: (postId: string) => void;
  onEditPost?: (postId: string) => void;
  onDuplicatePost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
}) {
  const slotTime = addHours(day, hour);
  const slotId = `week-slot-${format(slotTime, 'yyyy-MM-dd-HH')}`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: {
      type: 'week-slot',
      scheduledTime: slotTime.toISOString(),
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[60px] border-b border-r border-border/50 p-1
        transition-colors duration-200
        ${isOver ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background hover:bg-muted/30'}
      `}
    >
      <div className="space-y-1">
        {posts.map((post) => (
          <DraggablePostCard 
            key={post.id} 
            post={post} 
            compact 
            onView={onViewPost}
            onEdit={onEditPost}
            onDuplicate={onDuplicatePost}
            onDelete={onDeletePost}
          />
        ))}
      </div>
    </div>
  );
}

export function WeekView({ 
  posts, 
  currentWeek, 
  onWeekChange,
  onViewPost,
  onEditPost,
  onDuplicatePost,
  onDeletePost,
}: WeekViewProps) {
  // Calculate week start (Monday)
  const weekStart = useMemo(() => {
    return startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  }, [currentWeek]);

  // Generate 7 days of the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // Time slots (business hours: 6 AM - 11 PM)
  const timeSlots = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => i + 6); // 6:00 to 23:00
  }, []);

  // Group posts by day and hour
  const postsByDayAndHour = useMemo(() => {
    const map = new Map<string, Post[]>();
    
    posts.forEach(post => {
      const postDate = new Date(post.scheduledTime);
      const hour = postDate.getHours();
      
      weekDays.forEach(day => {
        if (isSameDay(postDate, day)) {
          const key = `${format(day, 'yyyy-MM-dd')}-${hour}`;
          if (!map.has(key)) {
            map.set(key, []);
          }
          map.get(key)!.push(post);
        }
      });
    });
    
    return map;
  }, [posts, weekDays]);

  // Navigation handlers
  const goToPreviousWeek = () => {
    onWeekChange(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    onWeekChange(addDays(weekStart, 7));
  };

  const goToToday = () => {
    onWeekChange(new Date());
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
        <div className="text-sm font-medium">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </div>
      </div>

      {/* Week Grid */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 bg-muted/50 border-b border-border sticky top-0 z-10">
              <div className="p-2 border-r border-border font-medium text-xs text-muted-foreground">
                Time
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="p-2 border-r border-border text-center"
                >
                  <div className="font-medium text-sm">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'MMM d')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="relative">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8">
                  {/* Time label */}
                  <div className="p-2 border-r border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground">
                    {format(addHours(new Date().setHours(hour, 0, 0, 0), 0), 'HH:mm')}
                  </div>
                  
                  {/* Day columns */}
                  {weekDays.map((day) => {
                    const key = `${format(day, 'yyyy-MM-dd')}-${hour}`;
                    const postsInSlot = postsByDayAndHour.get(key) || [];
                    
                    return (
                      <TimeSlot
                        key={`${day.toISOString()}-${hour}`}
                        day={day}
                        hour={hour}
                        posts={postsInSlot}
                        onViewPost={onViewPost}
                        onEditPost={onEditPost}
                        onDuplicatePost={onDuplicatePost}
                        onDeletePost={onDeletePost}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
