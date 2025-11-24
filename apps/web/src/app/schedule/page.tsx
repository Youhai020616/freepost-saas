'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, UniqueIdentifier } from '@dnd-kit/core';
import { useQuery } from '@tanstack/react-query';
import { useUpdatePostSchedule } from '@/hooks/use-update-post-schedule';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Edit,
  Trash2,
  Eye,
  List,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { WeekView } from '@/components/schedule/week-view';
import { GlassMonthView } from '@/components/schedule/glass-month-view';

// 🔧 类型定义
interface ScheduledPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: string;
  status: string;
  engagement: number;
  color: string;
}

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

// 🎨 Platform color mapping
const getPlatformColor = (platform: string): string => {
  const colors: Record<string, string> = {
    twitter: '#1da1f2',
    instagram: '#e4405f',
    facebook: '#1877f2',
    youtube: '#ff0000',
    linkedin: '#0077b5',
  };
  return colors[platform] || '#6366f1';
};

export default function SchedulePage() {
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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // 🆕 React Query mutation for optimistic updates
  const updateScheduleMutation = useUpdatePostSchedule();

  // 🔧 修复: 使用 React Query 获取真实数据
  const { data: posts = scheduledPosts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const result = await response.json();
      // 为每个 post 添加 color 属性
      return result.data.map((post: ScheduledPost) => ({
        ...post,
        color: getPlatformColor(post.platform),
      }));
    },
    // 开发环境下使用 mock 数据作为 fallback
    placeholderData: scheduledPosts,
  });

  // 🆕 过滤逻辑实现
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post: ScheduledPost) => {
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
  const handleDragStart = (event: DragStartEvent) => {
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
    const post = posts.find((p: ScheduledPost) => p.id === postId);
    if (!post) return;

    const currentTime = new Date(post.scheduledTime);
    const targetDate = new Date(targetDateStr);

    targetDate.setHours(currentTime.getHours());
    targetDate.setMinutes(currentTime.getMinutes());
    targetDate.setSeconds(currentTime.getSeconds());

    const newScheduledTime = targetDate.toISOString();

    // 🔧 修复: 移除本地 setPosts，完全依赖 React Query 的乐观更新
    // React Query mutation 会在 onMutate 中处理乐观更新
    updateScheduleMutation.mutate({
      postId,
      scheduledTime: newScheduledTime,
    });
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
          /* 🎨 Glass Month View - 玻璃态月视图 */
          <GlassMonthView
            posts={filteredPosts}
            onNewPost={() => {/* TODO: 导航到 compose 页面 */}}
            onDateSelect={setSelectedDate}
          />
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
                  filteredPosts.map((post: ScheduledPost) => (
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
                      variant="ghost"
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
