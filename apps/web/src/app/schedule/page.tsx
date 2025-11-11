'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useUpdatePostSchedule } from '@/hooks/use-update-post-schedule';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Edit,
  Trash2,
  Eye,
  List,
  Copy,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { WeekView } from '@/components/schedule/week-view';
import { DraggablePostCard } from '@/components/schedule/draggable-post-card';

const scheduledPosts = [
  {
    id: '1',
    content: '🚀 Excited to share our latest product update! New features that will revolutionize your social media workflow.',
    platform: 'twitter',
    scheduledTime: '2025-01-20T14:30:00',
    status: 'scheduled',
    engagement: 0,
    color: '#1da1f2'
  },
  {
    id: '2',
    content: 'Behind the scenes look at our team working on the next big feature. The dedication never ceases to amaze me!',
    platform: 'instagram',
    scheduledTime: '2025-01-20T16:00:00',
    status: 'scheduled',
    engagement: 0,
    color: '#e4405f'
  },
  {
    id: '3',
    content: 'Quick tip Tuesday: Did you know you can schedule posts across multiple platforms simultaneously?',
    platform: 'facebook',
    scheduledTime: '2025-01-21T12:00:00',
    status: 'scheduled',
    engagement: 0,
    color: '#1877f2'
  },
  {
    id: '4',
    content: 'New video tutorial is live! Learn how to create engaging content that converts.',
    platform: 'youtube',
    scheduledTime: '2025-01-22T09:30:00',
    status: 'scheduled',
    engagement: 0,
    color: '#ff0000'
  },
  {
    id: '5',
    content: 'Professional networking tips for social media managers and content creators.',
    platform: 'linkedin',
    scheduledTime: '2025-01-23T11:00:00',
    status: 'scheduled',
    engagement: 0,
    color: '#0077b5'
  }
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'week'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // 🆕 过滤器状态管理
  const [filters, setFilters] = useState({
    platform: 'all',
    dateRange: 'next-7-days',
    status: 'all',
    searchTerm: '',
  });

  // 🆕 拖拽状态管理
  const [activeId, setActiveId] = useState<string | null>(null);
  const [posts, setPosts] = useState(scheduledPosts);

  // 🆕 React Query mutation for optimistic updates
  const updateScheduleMutation = useUpdatePostSchedule();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // 🆕 过滤逻辑实现
  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      // 平台过滤
      if (filters.platform !== 'all' && post.platform !== filters.platform) {
        return false;
      }

      // 状态过滤
      if (filters.status !== 'all' && post.status !== filters.status) {
        return false;
      }

      // 日期范围过滤
      const postDate = new Date(post.scheduledTime);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'next-7-days':
          const sevenDaysLater = new Date(now);
          sevenDaysLater.setDate(now.getDate() + 7);
          if (postDate < now || postDate > sevenDaysLater) return false;
          break;
        case 'next-30-days':
          const thirtyDaysLater = new Date(now);
          thirtyDaysLater.setDate(now.getDate() + 30);
          if (postDate < now || postDate > thirtyDaysLater) return false;
          break;
        case 'this-month':
          if (postDate.getMonth() !== now.getMonth() || 
              postDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
          break;
        // 'all-scheduled' 不需要额外过滤
      }

      // 🆕 搜索词过滤
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const contentMatch = post.content.toLowerCase().includes(searchLower);
        const platformMatch = post.platform.toLowerCase().includes(searchLower);
        return contentMatch || platformMatch;
      }

      return true;
    });
  }, [filters, posts]);

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 🆕 操作处理函数
  const handleViewPost = (postId: string) => {
    console.log('View post:', postId);
    // TODO: 打开帖子详情 Modal
  };

  const handleEditPost = (postId: string) => {
    console.log('Edit post:', postId);
    // TODO: 打开编辑 Modal 或跳转编辑页面
  };

  const handleDeletePost = (postId: string) => {
    console.log('Delete post:', postId);
    // TODO: 显示确认对话框，调用删除 API
  };

  const handleDuplicatePost = (postId: string) => {
    console.log('Duplicate post:', postId);
    // TODO: 复制帖子并打开编辑 Modal
  };

  // 🆕 拖拽处理函数
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    // active.id 是帖子 ID，over.id 是目标日期的 ISO 字符串
    const postId = active.id as string;
    const targetDateStr = over.id as string;

    // 计算新的调度时间（保持原有时间，只更新日期）
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const currentTime = new Date(post.scheduledTime);
    const targetDate = new Date(targetDateStr);

    targetDate.setHours(currentTime.getHours());
    targetDate.setMinutes(currentTime.getMinutes());
    targetDate.setSeconds(currentTime.getSeconds());

    const newScheduledTime = targetDate.toISOString();

    // 乐观更新本地状态
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, scheduledTime: newScheduledTime } : p
      )
    );

    // 使用 React Query mutation 调用 API（带乐观更新和错误回滚）
    updateScheduleMutation.mutate({
      postId,
      scheduledTime: newScheduledTime,
    });
  };

  const days = getDaysInMonth(currentDate);

  // 🆕 可放置的日期格子组件
  const DroppableCalendarDay = ({ day, index }: { day: Date | null; index: number }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: day ? day.toISOString() : `empty-${index}`,
      disabled: !day,
    });

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 rounded-md border transition-colors cursor-pointer",
          day
            ? isToday(day)
              ? 'ring-2 ring-primary bg-accent/50'
              : 'hover:bg-accent hover:border-primary/50'
            : 'bg-muted/30 cursor-default',
          isOver && 'ring-2 ring-blue-500 bg-blue-50'
        )}
        onClick={() => day && setSelectedDate(day)}
      >
        {day && (
          <>
            <div className={cn("text-xs sm:text-sm font-medium mb-1 sm:mb-2", isToday(day) && "text-primary")}>
              {day.getDate()}
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              {getPostsForDate(day)
                .slice(0, 3)
                .map((post) => (
                  <DraggablePostCard key={post.id} post={post} />
                ))}
              {getPostsForDate(day).length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{getPostsForDate(day).length - 3} more
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Header - 响应式优化 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Content Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Plan and schedule your social media posts
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            {/* View mode toggle - 响应式优化 */}
            <div className="inline-flex items-center bg-muted/50 rounded-lg p-1 gap-1 flex-1 sm:flex-none">
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center justify-center gap-2 px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-none",
                  viewMode === 'calendar'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Month</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={cn(
                  "flex items-center justify-center gap-2 px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-none",
                  viewMode === 'week'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Week</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex items-center justify-center gap-2 px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-none",
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
            {/* Schedule Post button - 响应式优化 */}
            <Button className="gap-2 flex-shrink-0">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Post</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          /* 🆕 使用 DndContext 包裹日历视图实现拖拽 */
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                    className="flex-shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-lg sm:text-xl font-semibold whitespace-nowrap">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  variant="neutral"
                  onClick={() => setCurrentDate(new Date())}
                  className="w-full sm:w-auto"
                >
                  Today
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              {/* Days of week header - 响应式优化 */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-3 sm:mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar days - 🆕 使用拖拽组件 响应式间距 */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {days.map((day, index) => (
                  <DroppableCalendarDay key={index} day={day} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
          </DndContext>
        ) : viewMode === 'week' ? (
          /* 🆕 Week View with Drag and Drop */
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <WeekView
              posts={filteredPosts}
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
              onViewPost={handleViewPost}
              onEditPost={handleEditPost}
              onDuplicatePost={handleDuplicatePost}
              onDeletePost={handleDeletePost}
            />
          </DndContext>
        ) : (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-xl">Scheduled Posts</CardTitle>
              {/* 🆕 过滤器和搜索栏 - 响应式优化 */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mt-4">
                {/* 🆕 搜索框 */}
                <div className="relative flex-1 w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>

                {/* 🆕 过滤器组 - 在小屏幕上网格布局 */}
                <div className="grid grid-cols-2 md:flex gap-3">
                  {/* 🆕 平台过滤器（绑定状态） */}
                  <select
                    className="px-3 md:px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={filters.platform}
                    onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                  >
                    <option value="all">All Platforms</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                  </select>

                  {/* 🆕 日期范围过滤器（绑定状态） */}
                  <select
                    className="px-3 md:px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <option value="next-7-days">Next 7 days</option>
                    <option value="next-30-days">Next 30 days</option>
                    <option value="this-month">This month</option>
                    <option value="all-scheduled">All scheduled</option>
                  </select>

                  {/* 🆕 状态过滤器 */}
                  <select
                    className="px-3 md:px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring col-span-2 md:col-span-1"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              
              {/* 🆕 过滤结果统计 */}
              <div className="text-sm text-muted-foreground mt-2">
                Showing {filteredPosts.length} of {scheduledPosts.length} posts
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {/* 🆕 使用 filteredPosts 替代 scheduledPosts */}
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: post.color }}
                            />
                            <span className="text-sm font-medium capitalize">
                              {post.platform}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.scheduledTime).toLocaleDateString()} at{' '}
                              {new Date(post.scheduledTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{post.content}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Scheduled</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {/* 🆕 绑定 onClick 事件 */}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewPost(post.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* 🆕 空状态提示 */
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">No posts match your filters</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setFilters({ platform: 'all', dateRange: 'next-7-days', status: 'all', searchTerm: '' })}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
