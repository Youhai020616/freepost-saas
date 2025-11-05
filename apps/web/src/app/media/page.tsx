'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function MediaPage() {
  const folders = ['All Media', 'Images', 'Videos', 'Documents'];
  const mediaItems = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Media Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your images, videos, and documents
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Media
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Folders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {folders.map((folder, index) => (
                    <button
                      key={folder}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-md text-left transition-colors",
                        index === 0
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                    >
                      <span className="font-medium">{folder}</span>
                      <span className="text-xs text-muted-foreground">12</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <Card key={item} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={`https://images.unsplash.com/photo-161122492385${item}-80b023f02d71?w=400&auto=format&fit=crop&q=80`}
                      alt={`Media ${item}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&auto=format&fit=crop&q=80`;
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium truncate mb-1">image-{item}.jpg</h4>
                    <p className="text-sm text-muted-foreground">2.4 MB</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
