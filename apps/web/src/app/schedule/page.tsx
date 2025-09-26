'use client';
import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  List,
  MoreHorizontal
} from 'lucide-react';

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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Content Calendar</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Plan and schedule your social media posts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              Schedule Post
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'calendar' ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-4 mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-4">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg ${
                      day ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800'
                    } transition-colors cursor-pointer`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday(day) 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getPostsForDate(day).slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className="text-xs p-1 rounded text-white truncate"
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
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              +{getPostsForDate(day).length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Scheduled Posts</h2>
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Platforms</option>
                  <option>Twitter</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>YouTube</option>
                </select>
                <select className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Next 7 days</option>
                  <option>Next 30 days</option>
                  <option>This month</option>
                  <option>All scheduled</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: post.color }}
                        />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {post.platform}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(post.scheduledTime).toLocaleDateString()} at{' '}
                          {new Date(post.scheduledTime).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Scheduled</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
