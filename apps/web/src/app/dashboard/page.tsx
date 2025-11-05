'use client';
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

interface SocialPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime?: string;
  publishedTime?: string;
  status: "draft" | "scheduled" | "published";
  engagement: number;
  accentColor: string;
  hashtags: string[];
}

const initialPosts: SocialPost[] = [
  {
    id: "p1",
    content: "🚀 Excited to share our latest product update! New features that will revolutionize your social media workflow. What do you think? #ProductUpdate #SocialMedia #Innovation",
    platform: "twitter",
    scheduledTime: "2025-01-20T14:30:00",
    status: "scheduled",
    engagement: 0,
    accentColor: "#1da1f2",
    hashtags: ["ProductUpdate", "SocialMedia", "Innovation"],
  },
  {
    id: "p2",
    content: "Behind the scenes look at our team working on the next big feature. The dedication and creativity never cease to amaze me! 💪✨",
    platform: "instagram",
    scheduledTime: "2025-01-19T16:00:00",
    status: "draft",
    engagement: 0,
    accentColor: "#e4405f",
    hashtags: ["BehindTheScenes", "TeamWork"],
  },
  {
    id: "p3",
    content: "Just published our comprehensive guide to social media automation. Check it out and let us know your thoughts in the comments!",
    platform: "linkedin",
    publishedTime: "2025-01-18T10:00:00",
    status: "published",
    engagement: 247,
    accentColor: "#0077b5",
    hashtags: ["SocialMediaAutomation", "Guide", "Marketing"],
  },
  {
    id: "p4",
    content: "Quick tip Tuesday: Did you know you can schedule posts across multiple platforms simultaneously? Save time and maintain consistency! 🕒📱",
    platform: "facebook",
    scheduledTime: "2025-01-21T12:00:00",
    status: "scheduled",
    engagement: 0,
    accentColor: "#1877f2",
    hashtags: ["TipTuesday", "Productivity", "SocialMediaTips"],
  },
  {
    id: "p5",
    content: "New video tutorial is live! Learn how to create engaging content that converts. Link in bio 🎥✨ #ContentCreation #Tutorial #Marketing",
    platform: "youtube",
    publishedTime: "2025-01-17T09:30:00",
    status: "published",
    engagement: 1203,
    accentColor: "#ff0000",
    hashtags: ["ContentCreation", "Tutorial", "Marketing"],
  },
];

const platformIcons: Record<string, string> = {
  twitter: "𝕏",
  facebook: "f",
  instagram: "📷",
  linkedin: "in",
  youtube: "▶️",
  tiktok: "♪",
};

export default function DashboardPage() {
  // Calculate metrics from posts
  const metrics = useMemo(() => {
    const scheduled = initialPosts.filter(p => p.status === "scheduled").length;
    const drafts = initialPosts.filter(p => p.status === "draft").length;
    const published = initialPosts.filter(p => p.status === "published").length;
    const totalEngagement = initialPosts
      .filter(p => p.status === "published")
      .reduce((sum, p) => sum + p.engagement, 0);

    return { scheduled, drafts, published, totalEngagement };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor your social media performance</p>
          </div>
          <Link href="/compose">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{metrics.scheduled}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold">{metrics.drafts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">{metrics.published}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Engagement</p>
                  <p className="text-2xl font-bold">{metrics.totalEngagement.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Link href="/compose">
            <Button variant="neutral" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Post
            </Button>
          </Link>
          <Link href="/schedule">
            <Button variant="neutral" className="gap-2">
              <Calendar className="w-4 h-4" />
              View Calendar
            </Button>
          </Link>
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platformIcons[post.platform]}</span>
                      <span className="text-xs font-medium text-muted-foreground capitalize">
                        {post.platform}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        post.status === "published" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                        post.status === "scheduled" && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                        post.status === "draft" && "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                      )}
                    >
                      {post.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {post.scheduledTime && formatDate(post.scheduledTime)}
                      {post.publishedTime && formatDate(post.publishedTime)}
                    </span>
                    {post.status === "published" && (
                      <span className="font-medium">{post.engagement} engagements</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Post published on LinkedIn</p>
                <p className="text-xs text-muted-foreground">Social media automation guide • 247 engagements</p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Post scheduled for Twitter</p>
                <p className="text-xs text-muted-foreground">Product update announcement</p>
                <p className="text-xs text-muted-foreground mt-1">Scheduled for Jan 20 at 2:30 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Video published on YouTube</p>
                <p className="text-xs text-muted-foreground">Content creation tutorial • 1.2K engagements</p>
                <p className="text-xs text-muted-foreground mt-1">4 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
