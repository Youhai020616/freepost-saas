'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'Total Reach',
      value: '124.5K',
      change: '+12.3%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Engagements',
      value: '8,432',
      change: '+18.2%',
      trend: 'up',
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20'
    },
    {
      title: 'New Followers',
      value: '1,234',
      change: '+8.5%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Comments',
      value: '456',
      change: '+5.2%',
      trend: 'up',
      icon: MessageCircle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Shares',
      value: '789',
      change: '+15.7%',
      trend: 'up',
      icon: Share2,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'Growth Rate',
      value: '23.4%',
      change: '+3.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
    }
  ];

  const platformStats = [
    { platform: 'Twitter', followers: '45.2K', engagement: '8.4%', posts: 234, color: '#1da1f2' },
    { platform: 'Instagram', followers: '38.1K', engagement: '12.1%', posts: 189, color: '#e4405f' },
    { platform: 'LinkedIn', followers: '22.5K', engagement: '5.2%', posts: 156, color: '#0077b5' },
    { platform: 'Facebook', followers: '18.9K', engagement: '6.8%', posts: 198, color: '#1877f2' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your social media performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="7days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={cn("w-4 h-4", metric.color)} />
                        <span className={cn("text-sm font-medium", metric.color)}>{metric.change}</span>
                      </div>
                    </div>
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", metric.bgColor)}>
                      <Icon className={cn("w-6 h-6", metric.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformStats.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <div>
                      <p className="font-medium">{platform.platform}</p>
                      <p className="text-sm text-muted-foreground">{platform.followers} followers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-medium">{platform.engagement}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Posts</p>
                      <p className="font-medium">{platform.posts}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm mb-2">
                      {i === 1 && "🚀 Excited to share our latest product update! New features that will revolutionize your workflow."}
                      {i === 2 && "Behind the scenes look at our team working on the next big feature. The dedication never ceases to amaze!"}
                      {i === 3 && "New video tutorial is live! Learn how to create engaging content that converts. Link in bio 🎥✨"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Published 2 days ago</span>
                      <span>•</span>
                      <span>Twitter</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{2450 - i * 300}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{340 - i * 50}</p>
                      <p className="text-xs text-muted-foreground">Shares</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{180 - i * 20}</p>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
