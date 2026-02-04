"use client";

import React, { useState, useEffect } from 'react';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = 'dashboard-sidebar-collapsed';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // 初始状态始终为 false，避免 hydration 不匹配
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 客户端挂载后读取 localStorage
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  // 当侧边栏状态改变时，保存到 localStorage
  const handleToggleCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <DashboardNavbar />

      {/* Sidebar - Social Accounts */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content - Responsive margin for sidebar on desktop */}
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-72"
        )}
      >
        {children}
      </main>
    </div>
  );
};
