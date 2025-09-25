'use client';
import React, { useState } from "react";
import { SocialMediaDashboard, SocialPost, Notification } from "@/components/ui/social-media-dashboard";

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
    bgColorClass: "bg-blue-50 dark:bg-blue-900/20",
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
    bgColorClass: "bg-pink-50 dark:bg-pink-900/20",
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
    bgColorClass: "bg-blue-50 dark:bg-blue-900/20",
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
    bgColorClass: "bg-blue-50 dark:bg-blue-900/20",
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
    bgColorClass: "bg-red-50 dark:bg-red-900/20",
  },
];

const demoNotifications: Notification[] = [
  {
    id: "n1",
    title: "New Mention",
    message: "@user mentioned you in a comment: 'Great insights on social media automation!'",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80&auto=format&fit=crop",
    time: "2 hours ago",
    type: "mention",
    read: false,
  },
  {
    id: "n2",
    title: "Post Performance",
    message: "Your LinkedIn post about automation has reached 500+ engagements!",
    avatarUrl: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=96&q=80&auto=format&fit=crop",
    time: "4 hours ago",
    type: "like",
    read: false,
  },
  {
    id: "n3",
    title: "Scheduled Post",
    message: "Your Twitter post is scheduled to go live in 30 minutes.",
    avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop",
    time: "6 hours ago",
    type: "comment",
    read: true,
  },
];

export default function WorkspaceDashboard({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<SocialPost[]>(initialPosts);

  return (
    <SocialMediaDashboard
      title="Freepost Dashboard"
      user={{
        name: "Alex Chen",
        avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop"
      }}
      posts={data}
      notifications={demoNotifications}
      persistKey={`freepost-${params.slug}`}
      onPostUpdate={(post) => {
        setData((arr) => arr.map((p) => (p.id === post.id ? post : p)));
      }}
      onPostsReorder={(ids) => {
        setData((arr) => {
          const map = new Map(arr.map((p) => [p.id, p]));
          return ids.map((id) => map.get(id)!).filter(Boolean);
        });
      }}
      onPostAction={(id, action) => {
        console.log("Post action:", action, id);
        if (action === "delete") {
          setData((arr) => arr.filter((p) => p.id !== id));
        }
      }}
      onPostClick={(id) => console.log("Open post:", id)}
      onNotificationRead={(id, read) => console.log("Notification read:", id, read)}
    />
  );
}
