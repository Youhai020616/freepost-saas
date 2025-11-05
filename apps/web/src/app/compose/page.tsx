'use client';

import React, { useState } from 'react';
import { Plus, Check, Image as ImageIcon, Smile, BarChart2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { cn } from '@/lib/utils';

// 社交媒体图标组件
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const platforms = [
  { 
    name: 'Twitter', 
    color: '#1da1f2',
    icon: TwitterIcon,
    textColor: 'text-white'
  },
  { 
    name: 'Facebook', 
    color: '#1877f2',
    icon: FacebookIcon,
    textColor: 'text-white'
  },
  { 
    name: 'Instagram', 
    color: '#e4405f',
    icon: InstagramIcon,
    textColor: 'text-white'
  },
  { 
    name: 'LinkedIn', 
    color: '#0077b5',
    icon: LinkedInIcon,
    textColor: 'text-white'
  },
  { 
    name: 'YouTube', 
    color: '#ff0000',
    icon: YouTubeIcon,
    textColor: 'text-white'
  },
  { 
    name: 'TikTok', 
    color: '#000000',
    icon: TikTokIcon,
    textColor: 'text-white'
  },
];

export default function ComposePage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [hashtags, setHashtags] = useState('');
  const maxLength = 280;

  const togglePlatform = (platformName: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleSaveDraft = () => {
    if (!content.trim() && selectedPlatforms.length === 0) {
      alert('Please add some content or select a platform before saving draft');
      return;
    }
    // TODO: Implement save draft logic
    console.log('Saving draft...');
    console.log('Content:', content);
    console.log('Platforms:', selectedPlatforms);
    console.log('Hashtags:', hashtags);
    console.log('Scheduled:', scheduledTime);
    alert('Draft saved successfully!');
  };

  const handlePublish = () => {
    if (!content.trim()) {
      alert('Please enter some content before publishing');
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }
    // TODO: Implement publish logic
    console.log('Publishing to:', selectedPlatforms);
    console.log('Content:', content);
    console.log('Hashtags:', hashtags);
    console.log('Scheduled:', scheduledTime);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Compose Post</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and schedule your social media content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="noShadow" className="gap-2" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button 
              className="gap-2"
              onClick={handlePublish}
            >
              <Plus className="w-4 h-4" />
              Publish Now
            </Button>
          </div>
        </div>

        {/* Main Compose Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Content Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selection */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Select Platforms</CardTitle>
                  {selectedPlatforms.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {selectedPlatforms.length} selected
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.name);
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.name}
                        onClick={() => togglePlatform(platform.name)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
                          isSelected 
                            ? "border-transparent shadow-lg scale-105" 
                            : "border-border hover:border-muted-foreground/30 hover:shadow-sm"
                        )}
                        style={{
                          backgroundColor: isSelected ? platform.color : 'transparent'
                        }}
                      >
                        <div 
                          className={cn(
                            "transition-colors",
                            isSelected ? "text-white" : ""
                          )}
                          style={{
                            color: !isSelected ? platform.color : undefined
                          }}
                        >
                          <IconComponent />
                        </div>
                        <span 
                          className={cn(
                            "text-xs font-medium transition-colors",
                            isSelected ? platform.textColor : "text-foreground"
                          )}
                        >
                          {platform.name}
                        </span>
                        {isSelected && (
                          <Check className="absolute top-2 right-2 w-4 h-4 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Content</CardTitle>
                  <div className={cn(
                    "text-sm font-medium",
                    content.length > maxLength ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  )}>
                    {content.length}/{maxLength}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  placeholder="What's on your mind? Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={cn(
                    "w-full h-48 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background placeholder:text-muted-foreground text-base",
                    content.length > maxLength && "border-red-500 focus:ring-red-500"
                  )}
                />
                
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-xs">Media</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <BarChart2 className="w-4 h-4" />
                    <span className="text-xs">Poll</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Preview */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Post Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
                <div className="pt-2">
                  <Button variant="neutral" className="w-full justify-start gap-2 text-sm h-9">
                    <span>✨</span>
                    <span>Schedule for best time</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hashtags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  type="text"
                  placeholder="#marketing #socialmedia"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {['#marketing', '#social', '#content'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setHashtags(prev => prev ? `${prev} ${tag}` : tag)}
                      className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {content && selectedPlatforms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedPlatforms.slice(0, 2).map((platformName) => {
                      const platform = platforms.find(p => p.name === platformName);
                      if (!platform) return null;
                      const IconComponent = platform.icon;
                      return (
                        <div key={platformName} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center gap-2">
                            <div style={{ color: platform.color }}>
                              <IconComponent />
                            </div>
                            <span className="text-xs font-medium">{platformName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {content}
                          </p>
                        </div>
                      );
                    })}
                    {selectedPlatforms.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{selectedPlatforms.length - 2} more platforms
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
