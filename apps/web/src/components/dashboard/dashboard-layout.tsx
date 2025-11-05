"use client";

import React from 'react';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <DashboardNavbar />
      
      {/* Sidebar - Social Accounts */}
      <DashboardSidebar />
      
      {/* Main Content - Responsive margin for sidebar on desktop */}
      <main className="pt-16 md:ml-72 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};
