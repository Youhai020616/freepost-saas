import type { ComponentType, CSSProperties, ReactNode } from "react";

export type PlatformCategory = "social" | "professional" | "media" | "messaging";

export interface SocialPlatformDefinition {
  id: string;
  platform: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  category: PlatformCategory;
}

export type AccountStatus = "active" | "error" | "expired";

export interface SocialAccount extends SocialPlatformDefinition {
  username: string;
  connected: boolean;
  isVisible: boolean;
  isActive: boolean;
  lastSyncAt?: string;
  status: AccountStatus;
  errorMessage?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SidebarSettings {
  isCollapsed: boolean;
  visibleAccountIds: string[];
  favoriteAccountIds: string[];
  groupBy: "category" | "status" | "custom";
  sortBy: "manual" | "name" | "lastUsed";
}

export interface AccountGroup {
  id: string;
  label: string;
  accounts: SocialAccount[];
  isCollapsible: boolean;
  isCollapsed: boolean;
  icon?: ReactNode;
}

export type SidebarFilter = "all" | "connected" | "disconnected";
