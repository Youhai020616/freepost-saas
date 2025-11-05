'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

export default function ScheduleContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => {
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

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-none border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Content Calendar</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Plan and schedule your social media posts
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                    viewMode === 'calendar'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent'
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent'
                  )}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
              </div>
              {/* Schedule Post button */}
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Schedule Post
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === 'calendar' ? (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-4">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[120px] p-2 rounded-md border transition-colors cursor-pointer",
                    day
                      ? isToday(day)
                        ? 'ring-2 ring-primary bg-accent/50'
                        : 'hover:bg-accent hover:border-primary/50'
                      : 'bg-muted/30 cursor-default'
                  )}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={cn(
                        "text-sm font-medium mb-2",
                        isToday(day) && "text-primary"
                      )}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {getPostsForDate(day).slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className="text-xs p-1 rounded text-white truncate font-medium"
                            style={{ backgroundColor: post.color }}
                          >
                            {new Date(post.scheduledTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })} - {post.platform}
                          </div>
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
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Scheduled Posts</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <select className="px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All Platforms</option>
                <option>Twitter</option>
                <option>Facebook</option>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>YouTube</option>
              </select>
              <select className="px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Next 7 days</option>
                <option>Next 30 days</option>
                <option>This month</option>
                <option>All scheduled</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {scheduledPosts.map((post) => (
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
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
