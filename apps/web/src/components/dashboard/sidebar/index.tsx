"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarContent } from "./components/SidebarContent";
import { SidebarFooter } from "./components/SidebarFooter";
import { useSocialAccounts } from "./hooks/use-social-accounts";
import { AccountGroup } from "./types";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const { accounts, isLoading, toggleVisibility, removeFromSidebar } =
    useSocialAccounts();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set()
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleAccounts = useMemo(
    () => accounts.filter((account) => account.isVisible),
    [accounts]
  );

  const filteredAccounts = useMemo(() => {
    if (!normalizedQuery) return visibleAccounts;
    return visibleAccounts.filter((account) =>
      [account.platform, account.username]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery, visibleAccounts]);

  const quickAccess = useMemo(
    () => filteredAccounts.filter((account) => account.connected).slice(0, 5),
    [filteredAccounts]
  );

  const groups = useMemo<AccountGroup[]>(() => {
    const connected = filteredAccounts.filter((account) => account.connected);
    const disconnected = filteredAccounts.filter(
      (account) => !account.connected
    );

    return [
      {
        id: "connected",
        label: "已连接账号",
        accounts: connected,
        isCollapsible: true,
        isCollapsed: collapsedGroups.has("connected"),
      },
      {
        id: "disconnected",
        label: "未连接账号",
        accounts: disconnected,
        isCollapsible: true,
        isCollapsed: collapsedGroups.has("disconnected"),
      },
    ];
  }, [filteredAccounts, collapsedGroups]);

  const connectedCount = useMemo(
    () => accounts.filter((account) => account.connected).length,
    [accounts]
  );

  const visibleAccountIds = useMemo(
    () => new Set(accounts.filter((account) => account.isVisible).map((a) => a.id)),
    [accounts]
  );

  const handleToggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:fixed md:block left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "md:w-20" : "md:w-72"
      )}
    >
      <div className="flex h-full flex-col">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={() => onToggleCollapse(!isCollapsed)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          connectedCount={connectedCount}
        />

        <SidebarContent
          quickAccess={quickAccess}
          groups={groups}
          isCollapsed={isCollapsed}
          isLoading={isLoading}
          onToggleGroup={handleToggleGroup}
          onRemove={(platformId) => removeFromSidebar.mutate(platformId)}
          onConnect={(platformId) => console.log("connect", platformId)}
        />

        <SidebarFooter
          isCollapsed={isCollapsed}
          visibleAccountIds={visibleAccountIds}
          onToggleVisibility={(platformId) => toggleVisibility.mutate(platformId)}
        />
      </div>
    </aside>
  );
};
