'use client';
import React, { useState } from 'react';
import { 
  Calendar, 
  Image, 
  Video, 
  Hash, 
  AtSign, 
  MapPin, 
  Clock, 
  Send, 
  Save, 
  Eye,
  Smile,
  Link,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

const platforms = [
  { id: 'twitter', name: 'Twitter', color: '#1da1f2', limit: 280 },
  { id: 'facebook', name: 'Facebook', color: '#1877f2', limit: 63206 },
  { id: 'instagram', name: 'Instagram', color: '#e4405f', limit: 2200 },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', limit: 3000 },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', limit: 5000 },
  { id: 'tiktok', name: 'TikTok', color: '#000000', limit: 2200 },
];

export default function ComposeContent() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter']);
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [hashtags, setHashtags] = useState('');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 280;
    return Math.min(...selectedPlatforms.map(id => 
      platforms.find(p => p.id === id)?.limit || 280
    ));
  };

  const characterCount = content.length;
  const characterLimit = getCharacterLimit();
  const isOverLimit = characterCount > characterLimit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Compose</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Create and schedule your social media posts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Send className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Select Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="font-medium text-slate-900 dark:text-slate-100">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Content</h3>
              <div className={`text-sm font-medium ${
                isOverLimit ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {characterCount}/{characterLimit}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className={`w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isOverLimit 
                  ? 'border-red-300 dark:border-red-700' 
                  : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400`}
            />
            
            {/* Content Tools */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Hash className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <AtSign className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">AI Assist</span>
                <button className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <Zap className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Media</h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
              <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">Drag and drop your images or videos here</p>
              <button className="text-blue-500 hover:text-blue-600 font-medium">Browse files</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Publish Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Best time: 2:00 PM - 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Hashtags */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Hashtags</h3>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#marketing #socialmedia #content"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {['#trending', '#marketing', '#business', '#socialmedia'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setHashtags(prev => prev ? `${prev} ${tag}` : tag)}
                  className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Predicted Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Estimated Reach</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">2.5K - 4.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Engagement Rate</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">3.2% - 5.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Best Platform</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Twitter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
