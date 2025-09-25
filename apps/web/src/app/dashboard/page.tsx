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

export default function DashboardPage() {
  const [data, setData] = useState<SocialPost[]>(initialPosts);
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "compose":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Compose</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Create and schedule your social media posts</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  Save Draft
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Publish Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Select Platforms</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'].map((platform) => (
                      <button
                        key={platform}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                      >
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">{platform}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Content</h3>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">0/280</div>
                  </div>
                  <textarea
                    placeholder="What's happening?"
                    className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Schedule</h3>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Hashtags</h3>
                  <input
                    type="text"
                    placeholder="#marketing #socialmedia #content"
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "media":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Media Library</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage your images, videos, and documents</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                Upload Media
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Folders</h3>
                  <div className="space-y-1">
                    {['All Media', 'Images', 'Videos', 'Documents'].map((folder) => (
                      <button
                        key={folder}
                        className="w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <span className="font-medium">{folder}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">12</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative">
                        <img
                          src={`https://images.unsplash.com/photo-161122492385${item}-80b023f02d71?w=400&auto=format&fit=crop&q=80`}
                          alt={`Media ${item}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate mb-1">image-{item}.jpg</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">2.4 MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "schedule":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Content Calendar</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Plan and schedule your social media posts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                  <button className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                    Calendar
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                    List
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Schedule Post
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">January 2025</h2>
                  <button className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Today
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // Start from day -2 to show previous month days
                    const isCurrentMonth = day > 0 && day <= 31;
                    const hasPost = isCurrentMonth && [5, 12, 18, 25].includes(day);

                    return (
                      <div
                        key={i}
                        className={`min-h-[100px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer ${
                          isCurrentMonth ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {isCurrentMonth && (
                          <>
                            <div className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">
                              {day}
                            </div>
                            {hasPost && (
                              <div className="text-xs p-1 rounded text-white bg-blue-500 truncate">
                                2:30 PM - Twitter
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null; // 使用默认的仪表板内容
    }
  };

  return (
    <SocialMediaDashboard
      title="Freepost"
      user={{
        name: "Alex Chen",
        avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop"
      }}
      posts={data}
      notifications={demoNotifications}
      persistKey="freepost-dashboard"
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      showSearch={false}
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
    >
      {renderContent()}
    </SocialMediaDashboard>
  );
}
