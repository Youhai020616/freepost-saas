'use client';

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isToday, getDate, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  content: string;
  platform: string;
  scheduledTime: string;
  status: string;
  engagement: number;
  color: string;
}

interface GlassMonthViewProps {
  posts: Post[];
  onNewPost?: () => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

// Hide scrollbar utility
const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

export function GlassMonthView({ posts, onNewPost, onDateSelect, className }: GlassMonthViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [viewStyle, setViewStyle] = React.useState<'scroll' | 'grid'>('scroll');
  const todayRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Generate week view days (current week)
  const weekDays = React.useMemo(() => {
    const start = startOfWeek(currentMonth);
    const end = endOfWeek(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Generate full month days for grid view
  const monthDays = React.useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
  }, [currentMonth]);

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      return isSameDay(postDate, date);
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Auto-scroll to today's date in scroll view
  React.useEffect(() => {
    if (viewStyle === 'scroll' && todayRef.current && scrollContainerRef.current) {
      // 使用 requestAnimationFrame 确保在 DOM 更新后执行
      const scrollToToday = () => {
        todayRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      };
      
      // 使用 RAF 替代 setTimeout，更可靠
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToToday);
      });
    }
  }, [viewStyle, currentMonth]);

  return (
    <div
      className={cn(
        "w-full rounded-3xl p-6 shadow-2xl overflow-hidden",
        "bg-gradient-to-br from-card/95 via-muted/90 to-card/95",
        "backdrop-blur-xl border border-border",
        "text-foreground font-sans",
        className
      )}
    >
      <ScrollbarHide />

      {/* Header: View Toggle and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-1 rounded-lg bg-muted/50 p-1">
          <button
            onClick={() => setViewStyle('scroll')}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-all",
              viewStyle === 'scroll'
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Scroll View
          </button>
          <button
            onClick={() => setViewStyle('grid')}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-all",
              viewStyle === 'grid'
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Grid View
          </button>
        </div>
        <Button
          onClick={onNewPost}
          variant="neutral"
          className="bg-white text-black hover:bg-white/90 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Month Display and Navigation */}
      <div className="flex items-center justify-between mb-8">
        <motion.div
          key={format(currentMonth, "MMMM yyyy")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {format(currentMonth, "MMMM")}
          </h2>
          <p className="text-muted-foreground text-lg mt-1">{format(currentMonth, "yyyy")}</p>
        </motion.div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <AnimatePresence mode="wait">
        {viewStyle === 'scroll' ? (
          <motion.div
            key="scroll"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide -mx-6 px-6"
          >
            <div className="flex space-x-4 pb-4">
              {monthDays.map((day) => {
                const dayPosts = getPostsForDate(day);
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isDayToday = isToday(day);

                return (
                  <div
                    key={format(day, "yyyy-MM-dd")}
                    ref={isDayToday ? todayRef : null}
                    className="flex flex-col flex-shrink-0 w-[120px]"
                  >
                    {/* Day Header */}
                    <div className="flex flex-col items-center space-y-2 mb-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        {format(day, "EEE")}
                      </span>
                      <button
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 relative",
                          {
                            "bg-primary text-primary-foreground shadow-lg scale-110": isSelected,
                            "bg-muted hover:bg-muted/80": !isSelected && !isDayToday,
                            "bg-blue-500/30 hover:bg-blue-500/40 dark:bg-blue-500/20 dark:hover:bg-blue-500/30": !isSelected && isDayToday,
                            "text-foreground": !isSelected,
                          }
                        )}
                      >
                        {isDayToday && !isSelected && (
                          <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        )}
                        {getDate(day)}
                      </button>
                    </div>

                    {/* Posts for this day */}
                    {dayPosts.length > 0 && (
                      <div className="space-y-2 bg-muted/30 rounded-lg p-2 min-h-[100px]">
                        {dayPosts.slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className="bg-card rounded-md p-2 border border-border hover:border-primary/50 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: post.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-foreground/90 line-clamp-2 group-hover:text-foreground transition-colors">
                                  {post.content}
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-1 block">
                                  {format(new Date(post.scheduledTime), "h:mm a")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {dayPosts.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center py-1">
                            +{dayPosts.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-3 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-muted-foreground uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3">
              {monthDays.map((day, index) => {
                const dayPosts = getPostsForDate(day);
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isDayToday = isToday(day);

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "min-h-[100px] rounded-lg p-3 cursor-pointer transition-all",
                      "bg-muted/30 hover:bg-muted/50 border border-border hover:border-primary/50",
                      isSelected && "ring-2 ring-primary bg-muted/50",
                      isDayToday && "ring-2 ring-blue-500"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-semibold mb-2",
                      isDayToday ? "text-blue-500" : "text-foreground/90"
                    )}>
                      {getDate(day)}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          className="text-xs bg-card rounded px-2 py-1 border border-border truncate"
                          style={{ borderLeftColor: post.color, borderLeftWidth: '2px' }}
                        >
                          {post.content.substring(0, 20)}...
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayPosts.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {posts.length} posts scheduled this month
          </span>
          <span className="text-muted-foreground">
            {posts.filter(p => isToday(new Date(p.scheduledTime))).length} posts today
          </span>
        </div>
      </div>
    </div>
  );
}
