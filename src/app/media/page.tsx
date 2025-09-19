'use client';
import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Image, 
  Video, 
  File, 
  Download, 
  Trash2, 
  Edit, 
  Eye,
  Calendar,
  Tag,
  Folder,
  Plus,
  MoreHorizontal
} from 'lucide-react';

const mediaItems = [
  {
    id: '1',
    name: 'product-launch-hero.jpg',
    type: 'image',
    size: '2.4 MB',
    dimensions: '1920x1080',
    uploadDate: '2025-01-15',
    tags: ['product', 'launch', 'hero'],
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&auto=format&fit=crop&q=80',
    folder: 'Product Launch'
  },
  {
    id: '2',
    name: 'team-meeting-video.mp4',
    type: 'video',
    size: '45.2 MB',
    duration: '2:34',
    uploadDate: '2025-01-14',
    tags: ['team', 'meeting', 'behind-scenes'],
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
    folder: 'Team Content'
  },
  {
    id: '3',
    name: 'social-media-tips.png',
    type: 'image',
    size: '1.8 MB',
    dimensions: '1080x1080',
    uploadDate: '2025-01-13',
    tags: ['tips', 'social-media', 'infographic'],
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&auto=format&fit=crop&q=80',
    folder: 'Educational'
  },
  {
    id: '4',
    name: 'brand-guidelines.pdf',
    type: 'document',
    size: '3.2 MB',
    uploadDate: '2025-01-12',
    tags: ['brand', 'guidelines', 'document'],
    url: '',
    folder: 'Brand Assets'
  },
  {
    id: '5',
    name: 'customer-testimonial.jpg',
    type: 'image',
    size: '1.2 MB',
    dimensions: '800x600',
    uploadDate: '2025-01-11',
    tags: ['testimonial', 'customer', 'review'],
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
    folder: 'Testimonials'
  },
  {
    id: '6',
    name: 'tutorial-screen-recording.mp4',
    type: 'video',
    size: '78.5 MB',
    duration: '5:42',
    uploadDate: '2025-01-10',
    tags: ['tutorial', 'screen-recording', 'education'],
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&auto=format&fit=crop&q=80',
    folder: 'Tutorials'
  }
];

const folders = [
  { name: 'All Media', count: 6, active: true },
  { name: 'Product Launch', count: 1, active: false },
  { name: 'Team Content', count: 1, active: false },
  { name: 'Educational', count: 1, active: false },
  { name: 'Brand Assets', count: 1, active: false },
  { name: 'Testimonials', count: 1, active: false },
  { name: 'Tutorials', count: 1, active: false },
];

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('all');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Media Library</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your images, videos, and documents</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Media
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Folders</h3>
                <button className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.name}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      folder.active 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-4 h-4" />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Items Actions */}
            {selectedItems.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors">
                      Download
                    </button>
                    <button className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 rounded transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Media Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                : 'space-y-2'
            }`}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <div>
                      {/* Thumbnail */}
                      <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative">
                        {item.url ? (
                          <img 
                            src={item.url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getFileIcon(item.type)}
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="absolute top-2 right-2">
                          <button className="p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate mb-1">{item.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.size}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {item.url ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          getFileIcon(item.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">{item.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.size} • {item.uploadDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No media found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or upload some media files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
