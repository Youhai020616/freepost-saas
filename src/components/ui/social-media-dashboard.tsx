import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

/**
 * ===================================
 * Types & Interfaces
 * ===================================
 */
export type SidebarLink = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
};

export type Stat = {
  id: string;
  label: string;
  value: number | string;
};

export type PostStatus = "scheduled" | "draft" | "published" | "failed";

export type SocialPost = {
  id: string;
  content: string;
  platform?: string;
  scheduledTime?: string;
  publishedTime?: string;
  status?: PostStatus;
  engagement?: number;
  accentColor?: string;
  mediaUrls?: string[];
  hashtags?: string[];
  bgColorClass?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  avatarUrl: string;
  time: string;
  read?: boolean;
  type?: 'mention' | 'like' | 'comment' | 'follow';
};

export type SortBy = "manual" | "date" | "platform" | "engagement";
export type SortDir = "asc" | "desc";
export type ThemeMode = "light" | "dark" | "system";

export type Channel = {
  id: string;
  name: string;
  color: string;
  connected: boolean;
};

export type TopNavLink = {
  id: string;
  label: string;
  active?: boolean;
};

export type SocialDashboardProps = {
  title?: string;
  user?: { name?: string; avatarUrl?: string };
  topNavLinks?: TopNavLink[];
  channels?: Channel[];
  stats?: Stat[];
  posts: SocialPost[];
  notifications?: Notification[];
  view?: "grid" | "list";
  defaultView?: "grid" | "list";
  onViewChange?: (view: "grid" | "list") => void;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  notificationsOpen?: boolean;
  defaultNotificationsOpen?: boolean;
  onNotificationsOpenChange?: (open: boolean) => void;
  sortBy?: SortBy;
  defaultSortBy?: SortBy;
  sortDir?: SortDir;
  defaultSortDir?: SortDir;
  onSortChange?: (by: SortBy, dir: SortDir) => void;
  statusFilter?: PostStatus | "all";
  defaultStatusFilter?: PostStatus | "all";
  onStatusFilterChange?: (status: PostStatus | "all") => void;
  pageSize?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onPostClick?: (postId: string) => void;
  onPostAction?: (postId: string, action: "edit" | "delete" | "duplicate") => void;
  onPostUpdate?: (post: SocialPost) => void;
  onPostsReorder?: (orderedIds: string[]) => void;
  allowCreate?: boolean;
  onPostCreate?: (post: SocialPost) => void;
  generateId?: () => string;
  onNotificationRead?: (notificationId: string, read: boolean) => void;
  showThemeToggle?: boolean;
  onToggleTheme?: () => void;
  theme?: ThemeMode;
  defaultTheme?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  persistKey?: string;
  className?: string;
  loading?: boolean;
  emptyPostsLabel?: string;
  emptyNotificationsLabel?: string;
  // 新增属性
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  children?: React.ReactNode; // 允许传入自定义内容
  // 侧边栏折叠功能
  sidebarCollapsed?: boolean;
  defaultSidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
};

/**
 * ===================================
 * Spacing System - Consistent padding/margins
 * ===================================
 */
const spacing = {
  page: {
    header: "px-4 sm:px-6 lg:px-8 py-4",
    sidebar: "px-2 sm:px-3 py-4",
    main: "px-4 sm:px-6 lg:px-8 py-4",
    notifications: "px-4 sm:px-6 py-4"
  },
  card: {
    base: "p-4 sm:p-5 lg:p-6",
    compact: "p-3 sm:p-4"
  },
  button: {
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-4 py-2.5"
  },
  gap: {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6"
  }
};

/**
 * ===================================
 * Utilities
 * ===================================
 */
const cx = (...classes: Array<string | false | null | undefined>) => {
  return classes.filter(Boolean).join(" ");
};

const parseDateLike = (v?: string): number => {
  if (!v) return 0;
  const ts = Date.parse(v);
  return Number.isNaN(ts) ? 0 : ts;
};

const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max);
};

const readLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/**
 * ===================================
 * Icon Components
 * ===================================
 */
const Icons = {
  Dots: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Grid: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  List: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Bell: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Theme: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" />
    </svg>
  ),
  Trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Edit: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M7 2v4M17 2v4M3 8h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  BarChart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 19V5M10 19V9M16 19V3M22 19H2" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .33 1.8 1.8 0 0 0-.82 1.51V21.5a2 2 0 1 1-4 0v-.26A1.8 1.8 0 0 0 7 19.4a1.8 1.8 0 0 0-1.98-.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.33-1 1.8 1.8 0 0 0-1.51-.82H2.5a2 2 0 1 1 0-4h.26A1.8 1.8 0 0 0 4.6 7a1.8 1.8 0 0 0-.36-1.98l-.06-.06A2 2 0 1 1 7.01 2.13l.06.06A1.8 1.8 0 0 0 9 4.6c.34 0 .67-.11 1-.33.46-.31.77-.82.82-1.38V2.5a2 2 0 1 1 4 0v.26c.05.56.36 1.07.82 1.38.33.22.66.33 1 .33a1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.8 1.8 0 0 0 19.4 9c0 .34.11.67.33 1 .31.46.82.77 1.38.82h.39a2 2 0 1 1 0 4h-.39c-.56.05-1.07.36-1.38.82-.22.33-.33.66-.33 1z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Arrow: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 5v14m7-7-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Media: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  CreditCard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M1 10h22" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  // 社交媒体图标
  Twitter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
    </svg>
  ),
  Facebook: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />
    </svg>
  ),
  Instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor" />
    </svg>
  ),
  LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
    </svg>
  ),
  YouTube: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" />
    </svg>
  ),
  TikTok: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="currentColor" />
    </svg>
  )
};

/**
 * ===================================
 * Main Component
 * ===================================
 */
export function SocialMediaDashboard({
  // Content
  title = "Freepost",
  user = {
    name: "You",
    avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop",
  },
  // 顶部导航链接
  topNavLinks = [
    { id: "compose", label: "Compose" },
    { id: "schedule", label: "Schedule" },
    { id: "dashboard", label: "Dashboard", active: true },
    { id: "media", label: "Media" },
  ],
  // 侧边栏频道
  channels = [
    { id: "twitter", name: "Twitter", color: "#1da1f2", connected: true },
    { id: "facebook", name: "Facebook", color: "#1877f2", connected: true },
    { id: "instagram", name: "Instagram", color: "#e4405f", connected: false },
    { id: "linkedin", name: "LinkedIn", color: "#0077b5", connected: true },
    { id: "youtube", name: "YouTube", color: "#ff0000", connected: false },
    { id: "tiktok", name: "TikTok", color: "#000000", connected: false },
  ],
  stats,
  // Data
  posts,
  notifications = [],
  // View
  view,
  defaultView = "grid",
  onViewChange,
  // Search
  searchQuery,
  defaultSearchQuery = "",
  onSearchQueryChange,
  showSearch = true,
  searchPlaceholder = "Search posts",
  // Notifications panel
  notificationsOpen,
  defaultNotificationsOpen = false,
  onNotificationsOpenChange,
  // Sort
  sortBy,
  defaultSortBy = "date",
  sortDir,
  defaultSortDir = "desc",
  onSortChange,
  // Filter
  statusFilter,
  defaultStatusFilter = "all",
  onStatusFilterChange,
  // Pagination
  pageSize = 9,
  initialPage = 1,
  onPageChange,
  // Actions
  onPostClick,
  onPostAction,
  onPostUpdate,
  onPostsReorder,
  // Create
  allowCreate = true,
  onPostCreate,
  generateId,
  onNotificationRead,
  // Theme
  showThemeToggle = true,
  onToggleTheme,
  theme,
  defaultTheme = "system",
  onThemeChange,
  // Persistence
  persistKey,
  // Misc
  className = "",
  loading = false,
  emptyPostsLabel = "No posts match your search.",
  emptyNotificationsLabel = "No notifications yet.",
  // New props
  activeSection,
  onSectionChange,
  children,
  // Sidebar collapse props
  sidebarCollapsed,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
}: SocialDashboardProps) {
  const lsKey = persistKey ? (k: string) => `smd:${persistKey}:${k}` : null;

  // State management
  const [internalView, setInternalView] = useState<"grid" | "list">(defaultView);
  const viewMode = view ?? internalView;

  const [internalQuery, setInternalQuery] = useState<string>(defaultSearchQuery);
  const query = searchQuery ?? internalQuery;

  const [internalNotificationsOpen, setInternalNotificationsOpen] = useState<boolean>(defaultNotificationsOpen);
  const [isHydrated, setIsHydrated] = useState(false);
  const isNotificationsOpen = notificationsOpen ?? internalNotificationsOpen;

  // 客户端水合后再读取 localStorage
  useEffect(() => {
    if (lsKey && typeof window !== 'undefined') {
      const savedView = readLS(lsKey("view"), defaultView);
      const savedQuery = readLS(lsKey("query"), defaultSearchQuery);
      const savedNotificationsOpen = readLS(lsKey("notificationsOpen"), defaultNotificationsOpen);
      const savedSortBy = readLS(lsKey("sortBy"), defaultSortBy);
      const savedSortDir = readLS(lsKey("sortDir"), defaultSortDir);
      const savedStatusFilter = readLS(lsKey("statusFilter"), defaultStatusFilter);
      const savedPage = readLS(lsKey("page"), initialPage);
      const savedSidebarCollapsed = readLS(lsKey("sidebarCollapsed"), defaultSidebarCollapsed);

      setInternalView(savedView);
      setInternalQuery(savedQuery);
      setInternalNotificationsOpen(savedNotificationsOpen);
      setInternalSortBy(savedSortBy);
      setInternalSortDir(savedSortDir);
      setInternalStatusFilter(savedStatusFilter);
      setInternalSidebarCollapsed(savedSidebarCollapsed);
      setPage(savedPage);
    }
    setIsHydrated(true);
  }, []); // 只在组件挂载时执行一次

  const [internalSortBy, setInternalSortBy] = useState<SortBy>(defaultSortBy);
  const [internalSortDir, setInternalSortDir] = useState<SortDir>(defaultSortDir);
  const activeSortBy = sortBy ?? internalSortBy;
  const activeSortDir = sortDir ?? internalSortDir;

  const [internalStatusFilter, setInternalStatusFilter] = useState<PostStatus | "all">(defaultStatusFilter);
  const activeStatusFilter = statusFilter ?? internalStatusFilter;

  const [page, setPage] = useState<number>(initialPage);

  const [localPosts, setLocalPosts] = useState<SocialPost[]>(posts);

  useEffect(() => {
    if (onPostUpdate || onPostsReorder) return;
    setLocalPosts(posts);
  }, [posts, onPostUpdate, onPostsReorder]);

  const dataPosts = onPostUpdate || onPostsReorder ? posts : localPosts;

  const searchInputId = useId();
  const statusSelectId = useId();

  // Compute stats
  const computedStats: Stat[] = useMemo(() => {
    if (stats) return stats;
    const total = dataPosts.length;
    const byStatus = dataPosts.reduce(
      (acc, p) => {
        acc[p.status ?? "scheduled"]++;
        return acc;
      },
      { scheduled: 0, draft: 0, published: 0, failed: 0 } as Record<PostStatus, number>
    );
    const publishedLast7Days = dataPosts.filter(p => {
      if (p.status !== "published" || !p.publishedTime) return false;
      const publishedDate = new Date(p.publishedTime);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return publishedDate >= sevenDaysAgo;
    }).length;

    return [
      { id: "scheduled", label: "Scheduled", value: byStatus.scheduled },
      { id: "drafts", label: "Drafts", value: byStatus.draft },
      { id: "published7d", label: "Published (7d)", value: publishedLast7Days },
    ];
  }, [stats, dataPosts]);

  // Filter and sort posts
  const orderMap = useMemo(() => {
    const map = new Map<string, number>();
    dataPosts.forEach((p, i) => map.set(p.id, i));
    return map;
  }, [dataPosts]);

  const preparedPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = dataPosts.slice();

    if (activeStatusFilter !== "all") {
      list = list.filter((p) => (p.status ?? "scheduled") === activeStatusFilter);
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          (p.platform?.toLowerCase().includes(q) ?? false) ||
          (p.hashtags?.some(tag => tag.toLowerCase().includes(q)) ?? false)
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (activeSortBy) {
        case "manual":
          cmp = (orderMap.get(a.id)! - orderMap.get(b.id)!);
          break;
        case "date":
          cmp = parseDateLike(a.scheduledTime) - parseDateLike(b.scheduledTime);
          break;
        case "platform":
          cmp = (a.platform ?? "").localeCompare(b.platform ?? "");
          break;
        case "engagement":
          cmp = (a.engagement ?? 0) - (b.engagement ?? 0);
          break;
      }
      return activeSortBy === "manual" ? cmp : activeSortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [dataPosts, query, activeSortBy, activeSortDir, activeStatusFilter, orderMap]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(preparedPosts.length / pageSize));
  const currentPage = clamp(page, 1, totalPages);
  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return preparedPosts.slice(start, start + pageSize);
  }, [preparedPosts, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, activeStatusFilter, activeSortBy, activeSortDir, pageSize]);

  // Theme handling - 避免 hydration 不匹配
  const [internalTheme, setInternalTheme] = useState<ThemeMode>(defaultTheme);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (theme) return;
    // 延迟读取 localStorage 以避免 hydration 不匹配
    const timer = setTimeout(() => {
      if (lsKey) {
        const savedTheme = readLS(lsKey("theme"), defaultTheme);
        setInternalTheme(savedTheme);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [theme, defaultTheme]); // 移除 lsKey 依赖，因为它可能每次都变化

  const activeTheme = theme ?? internalTheme;

  const applyTheme = useCallback((mode: ThemeMode) => {
    if (typeof window === 'undefined') return; // 只在客户端执行
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    root.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (!isClient) return; // 只在客户端应用主题
    applyTheme(activeTheme);
    if (lsKey) writeLS(lsKey("theme"), activeTheme);
  }, [activeTheme, applyTheme, lsKey, isClient]);

  const toggleTheme = () => {
    if (onToggleTheme) return onToggleTheme();
    const next: ThemeMode =
      activeTheme === "dark" ? "light" : activeTheme === "light" ? "system" : "dark";
    if (theme === undefined) setInternalTheme(next);
    onThemeChange?.(next);
  };

  // Local state for editing and creation
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<SocialPost | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<SocialPost>({
    id: "",
    content: "",
    platform: "twitter",
    scheduledTime: "",
    status: "draft",
    engagement: 0,
    accentColor: "#1da1f2",
    mediaUrls: [],
    hashtags: [],
  });
  const [detailPost, setDetailPost] = useState<SocialPost | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 侧边栏折叠状态管理
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(defaultSidebarCollapsed ?? false);
  const isSidebarCollapsed = sidebarCollapsed ?? internalSidebarCollapsed;

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userMenuOpen && !target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Notification handling
  const [localRead, setLocalRead] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const seed: Record<string, boolean> = {};
    notifications.forEach((n) => (seed[n.id] = !!n.read));
    setLocalRead(seed);
  }, [notifications]);

  const isRead = (n: Notification) => n.read ?? localRead[n.id] ?? false;
  const toggleRead = (n: Notification) => {
    const next = !isRead(n);
    if (onNotificationRead) {
      onNotificationRead(n.id, next);
    } else {
      setLocalRead((s) => ({ ...s, [n.id]: next }));
    }
  };

  // Persistence effects - 移除 lsKey 依赖避免无限循环
  useEffect(() => { if (lsKey) writeLS(lsKey("view"), viewMode); }, [viewMode]);
  useEffect(() => { if (lsKey) writeLS(lsKey("query"), query); }, [query]);
  useEffect(() => { if (lsKey) writeLS(lsKey("notificationsOpen"), isNotificationsOpen); }, [isNotificationsOpen]);
  useEffect(() => { if (lsKey) { writeLS(lsKey("sortBy"), activeSortBy); writeLS(lsKey("sortDir"), activeSortDir); } }, [activeSortBy, activeSortDir]);
  useEffect(() => { if (lsKey) writeLS(lsKey("statusFilter"), activeStatusFilter); }, [activeStatusFilter]);
  useEffect(() => { if (lsKey) writeLS(lsKey("page"), currentPage); }, [currentPage]);
  useEffect(() => { if (lsKey) writeLS(lsKey("sidebarCollapsed"), isSidebarCollapsed); }, [isSidebarCollapsed]);

  // Controlled/uncontrolled setters
  const setView = (next: "grid" | "list") => {
    if (view === undefined) setInternalView(next);
    onViewChange?.(next);
  };

  const setSearch = (q: string) => {
    if (searchQuery === undefined) setInternalQuery(q);
    onSearchQueryChange?.(q);
  };

  const setNotificationsOpen = (open: boolean) => {
    if (notificationsOpen === undefined) setInternalNotificationsOpen(open);
    onNotificationsOpenChange?.(open);
  };

  const setSort = (by: SortBy, dir: SortDir) => {
    if (sortBy === undefined) setInternalSortBy(by);
    if (sortDir === undefined) setInternalSortDir(dir);
    onSortChange?.(by, dir);
  };

  const setStatusFilter = (status: PostStatus | "all") => {
    if (statusFilter === undefined) setInternalStatusFilter(status);
    onStatusFilterChange?.(status);
  };

  const goToPage = (p: number) => {
    setPage(p);
    onPageChange?.(p);
  };

  const toggleSidebar = () => {
    const next = !isSidebarCollapsed;
    if (sidebarCollapsed === undefined) setInternalSidebarCollapsed(next);
    onSidebarCollapsedChange?.(next);
  };

  // Post actions
  const startEdit = (p: SocialPost) => {
    setEditingId(p.id);
    setEditDraft({ ...p });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editDraft) return;
    if (onPostUpdate) {
      onPostUpdate(editDraft);
    } else {
      setLocalPosts((arr) => arr.map((x) => (x.id === editDraft.id ? editDraft : x)));
    }
    setEditingId(null);
    setEditDraft(null);
  };

  const mkId = () => {
    if (generateId) return generateId();
    // 使用更稳定的ID生成方式
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `post-${timestamp}-${random}`;
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = mkId();
    const post: SocialPost = { ...createDraft, id };
    if (onPostCreate) {
      onPostCreate(post);
    } else {
      setLocalPosts((arr) => [post, ...arr]);
    }
    setCreateOpen(false);
    setCreateDraft({
      id: "",
      content: "",
      platform: "twitter",
      scheduledTime: "",
      status: "draft",
      engagement: 0,
      accentColor: "#1da1f2",
      mediaUrls: [],
      hashtags: [],
    });
  };

  const openDetail = (p: SocialPost) => {
    if (onPostClick) return onPostClick(p.id);
    setDetailPost(p);
  };

  const getNavIcon = (id?: string) => {
    switch ((id || "").toLowerCase()) {
      case "dashboard": return <Icons.Home className="size-5" />;
      case "compose": return <Icons.Edit className="size-5" />;
      case "media": return <Icons.Media className="size-5" />;
      case "schedule": return <Icons.Calendar className="size-5" />;
      case "billing": return <Icons.CreditCard className="size-5" />;
      case "settings": return <Icons.Settings className="size-5" />;
      default: return <Icons.Logo className="size-5" />;
    }
  };

  const getChannelIcon = (id: string) => {
    const iconSize = "size-5"; // 统一图标大小：折叠与展开一致，使用展开的标准
    switch (id.toLowerCase()) {
      case "twitter": return <Icons.Twitter className={iconSize} />;
      case "facebook": return <Icons.Facebook className={iconSize} />;
      case "instagram": return <Icons.Instagram className={iconSize} />;
      case "linkedin": return <Icons.LinkedIn className={iconSize} />;
      case "youtube": return <Icons.YouTube className={iconSize} />;
      case "tiktok": return <Icons.TikTok className={iconSize} />;
      default: return <Icons.Globe className={iconSize} />;
    }
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case "twitter": return "#1da1f2";
      case "facebook": return "#1877f2";
      case "instagram": return "#e4405f";
      case "linkedin": return "#0077b5";
      case "youtube": return "#ff0000";
      case "tiktok": return "#000000";
      default: return "#6366f1";
    }
  };

  // 在水合完成之前显示加载状态，避免闪烁
  if (!isHydrated) {
    return (
      <div className={cx("min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center", className)}>
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className={cx(
      "smd-container flex flex-col h-screen bg-slate-50 dark:bg-slate-900",
      className
    )}>
      {/* Header with integrated navigation - Buffer style */}
      <header className={cx(
        "flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800",
        spacing.page.header,
        spacing.gap.sm
      )}>
        {/* Left side: Brand + Navigation */}
        <div className={cx("flex items-center min-w-0", spacing.gap.sm)}>
          {/* Brand */}
          <div className="flex items-center gap-3 mr-8">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-black text-white shrink-0">
              <Icons.Logo className="size-5" />
            </span>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
          </div>

          {/* Navigation Links - Buffer style */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              {topNavLinks.map((link, index) => (
                <div key={link.id} className="relative">
                  <button
                    onClick={() => onSectionChange?.(link.id)}
                    className={cx(
                      "px-4 py-3 text-sm font-medium transition-all relative",
                      (activeSection || "dashboard") === link.id
                        ? "text-black dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                  >
                    {link.label}
                  </button>
                  {/* Active indicator - black underline */}
                  {(activeSection || "dashboard") === link.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Search */}
          {showSearch && (
            <label
              htmlFor={searchInputId}
              className={cx(
                "hidden lg:flex items-center rounded-lg bg-slate-50 dark:bg-slate-700",
                "ring-1 ring-slate-200 dark:ring-slate-600 px-3 py-2 ml-8",
                spacing.gap.xs
              )}
            >
              <Icons.Search className="size-4 text-slate-500 dark:text-slate-400" />
              <input
                id={searchInputId}
                aria-label="Search posts"
                className="bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none text-sm w-56"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          )}
        </div>

        {/* Right side: Actions + User */}
        <div className={cx("flex items-center", spacing.gap.xs)}>
          {allowCreate && (
            <button
              className={cx(
                "rounded-lg bg-black text-white hover:bg-gray-800 transition-colors",
                spacing.button.md
              )}
              onClick={() => setCreateOpen(true)}
            >
              <span className="hidden sm:inline">New Post</span>
              <Icons.Plus className="size-5 sm:hidden" />
            </button>
          )}

          {showThemeToggle && (
            <button
              title={`Theme: ${activeTheme}`}
              onClick={toggleTheme}
              className={cx(
                "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
                "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                "p-2"
              )}
              suppressHydrationWarning
            >
              <Icons.Theme className="size-5" />
              <span className="sr-only">Toggle theme</span>
            </button>
          )}

          <button
            className={cx(
              "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
              "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
              "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
              "p-2 relative"
            )}
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifications"
          >
            <Icons.Bell className="size-5" />
            {notifications.filter(n => !isRead(n)).length > 0 && (
              <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          <div className="relative" data-user-menu>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cx(
                "flex items-center rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                "pl-2 pr-3 py-1.5",
                spacing.gap.xs
              )}
              aria-label="Account menu"
            >
              <img src={user?.avatarUrl} alt="" className="size-8 rounded-md object-cover" />
              <span className="hidden sm:inline text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.name}
              </span>
              <Icons.Arrow className={cx("size-4 transition-transform", userMenuOpen && "rotate-180")} />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">alex@freepost.com</div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      window.location.href = '/billing';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <Icons.CreditCard className="size-4" />
                    Billing & Plans
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      window.location.href = '/settings';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <Icons.Settings className="size-4" />
                    Settings
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      // 这里可以添加登出逻辑
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  >
                    <Icons.Close className="size-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation - shown on smaller screens */}
      <nav className="md:hidden border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-center px-4 py-2">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {topNavLinks.map((link) => (
              <div key={link.id} className="relative flex-shrink-0">
                <button
                  onClick={() => onSectionChange?.(link.id)}
                  className={cx(
                    "px-3 py-2 text-sm font-medium transition-all relative whitespace-nowrap",
                    (activeSection || "dashboard") === link.id
                      ? "text-black dark:text-white"
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  {link.label}
                </button>
                {(activeSection || "dashboard") === link.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 - Channels */}
        <aside className={cx(
          "hidden sm:flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300",
          isSidebarCollapsed ? "w-24" : "w-64",
          spacing.gap.sm
        )}>
          {/* 侧边栏头部 */}
          <div className={cx(
            "flex items-center justify-between border-b border-slate-200 dark:border-slate-700",
            isSidebarCollapsed ? "px-3 py-4" : "px-4 py-4"
          )}>
            {!isSidebarCollapsed && (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Channels
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className={cx(
                "p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
                isSidebarCollapsed && "mx-auto"
              )}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <Icons.ChevronRight className="size-5" />
              ) : (
                <Icons.ChevronLeft className="size-5" />
              )}
            </button>
          </div>

          {/* 频道列表 */}
          <div className={cx(
            "flex-1 overflow-y-auto",
            isSidebarCollapsed ? "px-2" : "px-4"
          )}>
            <div className={cx(isSidebarCollapsed ? "space-y-3 py-4" : "space-y-2 py-0")}>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={cx(
                    "group relative flex items-center rounded-lg transition-all cursor-pointer",
                    "hover:bg-slate-50 dark:hover:bg-slate-700",
                    isSidebarCollapsed ? "p-3 justify-center" : "p-3 gap-3"
                  )}
                  title={isSidebarCollapsed ? `${channel.name} - ${channel.connected ? "Connected" : "Not connected"}` : undefined}
                >
                  {/* 社交媒体图标 */}
                  <div
                    className={cx(
                      "flex items-center justify-center rounded-lg transition-all",
                      "w-10 h-10", // 统一容器尺寸：折叠与展开一致
                      channel.connected ? "shadow-sm" : "grayscale opacity-60"
                    )}
                    style={{
                      backgroundColor: channel.connected ? channel.color : '#6b7280',
                      color: 'white'
                    }}
                  >
                    {getChannelIcon(channel.id)}
                  </div>

                  {/* 频道信息 - 只在展开状态显示 */}
                  {!isSidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className={cx(
                          "font-medium text-sm truncate",
                          channel.connected
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-500 dark:text-slate-400"
                        )}>
                          {channel.name}
                        </div>
                        <div className={cx(
                          "text-xs truncate",
                          channel.connected
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-400"
                        )}>
                          {channel.connected ? "Connected" : "Not connected"}
                        </div>
                      </div>

                      {/* 连接状态指示器和按钮 */}
                      <div className="flex items-center gap-2">
                        {channel.connected ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <button className="px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors">
                            Connect
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* 折叠状态下的连接状态指示器 */}
                  {isSidebarCollapsed && channel.connected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* 添加频道按钮 */}
            {!isSidebarCollapsed && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                  <Icons.Plus className="size-5" />
                  <span className="text-sm font-medium">Add Channel</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className={cx(
          "flex-1 min-w-0 overflow-hidden flex flex-col",
          spacing.page.main
        )}>
          {/* 如果有自定义内容，显示自定义内容，否则显示默认的仪表板内容 */}
          {children ? (
            children
          ) : (
            <>
              {/* Overview Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Dashboard
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Overview of scheduled posts, recent activity, and account status.
                </p>

                {/* Stats */}
                <div className={cx("flex flex-wrap items-center", spacing.gap.md)}>
                  {computedStats.map((s, i) => (
                    <div key={s.id} className={cx("flex items-center", spacing.gap.xs)}>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {s.value === 0 ? "--" : s.value}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {s.label}
                      </span>
                      {i < computedStats.length - 1 && (
                        <span className="ml-4 w-px h-8 bg-slate-200 dark:bg-slate-700" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className={cx("flex items-center", spacing.gap.xs)}>
              <label className="sr-only" htmlFor={statusSelectId}>
                Filter by status
              </label>
              <select
                id={statusSelectId}
                value={activeStatusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PostStatus | "all")}
                className={cx(
                  "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
                  spacing.button.sm
                )}
              >
                <option value="all">All Posts</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
                <option value="failed">Failed</option>
              </select>

              <div className={cx("inline-flex items-center", spacing.gap.xs)}>
                <label className="sr-only" htmlFor="sortBy">Sort by</label>
                <select
                  id="sortBy"
                  value={activeSortBy}
                  onChange={(e) => setSort(e.target.value as SortBy, activeSortDir)}
                  className={cx(
                    "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                    "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
                    spacing.button.sm
                  )}
                >
                  <option value="manual">Manual</option>
                  <option value="date">Date</option>
                  <option value="platform">Platform</option>
                  <option value="engagement">Engagement</option>
                </select>
                {activeSortBy !== "manual" && (
                  <button
                    className={cx(
                      "p-2 rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                      "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    )}
                    aria-label={`Sort direction: ${activeSortDir}`}
                    onClick={() => setSort(activeSortBy, activeSortDir === "asc" ? "desc" : "asc")}
                  >
                    <Icons.Arrow className={cx("size-4", activeSortDir === "asc" && "rotate-180")} />
                  </button>
                )}
              </div>
            </div>

            <div className="inline-flex rounded-lg ring-1 ring-slate-200 dark:ring-slate-700">
              <button
                onClick={() => setView("list")}
                className={cx(
                  "p-2 rounded-l-lg transition-colors",
                  viewMode === "list"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
                title="List view"
                aria-pressed={viewMode === "list"}
              >
                <Icons.List className="size-5" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={cx(
                  "p-2 rounded-r-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
                title="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Icons.Grid className="size-5" />
              </button>
            </div>
          </div>

          {/* Posts */}
          <section
            aria-label="Social Media Posts"
            className={cx(
              "flex-1 overflow-y-auto",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                : cx("flex flex-col", spacing.gap.sm)
            )}
          >
            {loading && (
              <div className="col-span-full">
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                    <div key={i} className="h-44 rounded-xl bg-slate-200 dark:bg-slate-700" />
                  ))}
                </div>
              </div>
            )}

            {!loading && pagedPosts.map((p) => {
              const accent = p.accentColor || getPlatformColor(p.platform);
              const isEditing = editingId === p.id;

              return (
                <article
                  key={p.id}
                  className={cx(
                    "group rounded-xl transition-all",
                    "ring-1 ring-slate-200 dark:ring-slate-700",
                    p.bgColorClass || "bg-white dark:bg-slate-800",
                    viewMode === "list"
                      ? cx("flex items-center", spacing.card.compact, spacing.gap.md)
                      : cx("flex flex-col", spacing.card.base),
                    "hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-600"
                  )}
                  aria-label={`${p.platform} post`}
                >
                  {/* Card header */}
                  <div className={cx(
                    "flex items-start justify-between",
                    viewMode === "list" ? "w-full" : ""
                  )}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: accent }}
                        title={p.platform}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {p.platform} • {p.scheduledTime ? (isClient ? new Date(p.scheduledTime).toLocaleDateString() : p.scheduledTime.split('T')[0]) : 'No date'}
                      </span>
                    </div>

                    <div className={cx("flex items-center", spacing.gap.xs, "opacity-0 group-hover:opacity-100 transition-opacity")}>
                      <button
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(p);
                          onPostAction?.(p.id, "edit");
                        }}
                        title="Edit"
                      >
                        <Icons.Edit className="size-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostAction?.(p.id, "delete");
                          if (!onPostAction && !onPostUpdate) {
                            setLocalPosts((arr) => arr.filter((x) => x.id !== p.id));
                          }
                        }}
                        title="Delete"
                      >
                        <Icons.Trash className="size-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostAction?.(p.id, "duplicate");
                        }}
                        title="Duplicate"
                      >
                        <Icons.Dots className="size-4 text-slate-500 dark:text-slate-400 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  {!isEditing ? (
                    <div className={viewMode === "list" ? "flex-1 min-w-0" : "mt-3"}>
                      <button
                        className="text-left w-full"
                        onClick={() => openDetail(p)}
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-3">
                          {p.content}
                        </p>
                        {p.hashtags && p.hashtags.length > 0 && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {p.hashtags.map(tag => `#${tag}`).join(' ')}
                          </p>
                        )}
                      </button>
                    </div>
                  ) : (
                    <form
                      className={cx(
                        "mt-3 grid gap-2",
                        viewMode === "list" ? "w-full grid-cols-1" : "grid-cols-1"
                      )}
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEdit();
                      }}
                    >
                      <textarea
                        className={cx(
                          "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                          "bg-white dark:bg-slate-900/40 resize-none",
                          spacing.button.sm
                        )}
                        rows={3}
                        value={editDraft?.content ?? ""}
                        onChange={(e) => setEditDraft((d) => ({ ...(d as SocialPost), content: e.target.value }))}
                        placeholder="Post content"
                        required
                      />
                      <div className={cx("flex items-center", spacing.gap.xs, "mt-2")}>
                        <button type="submit" className={cx(
                          "rounded-lg bg-black text-white hover:bg-gray-800",
                          spacing.button.sm
                        )}>
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit} className={cx(
                          "rounded-lg ring-1 ring-slate-300 dark:ring-slate-700",
                          spacing.button.sm
                        )}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Footer */}
                  {!isEditing && (
                    <div className={cx(
                      "mt-4 flex items-center justify-between",
                      viewMode === "list" ? "w-full" : ""
                    )}>
                      <div className={cx("flex items-center", spacing.gap.xs)}>
                        <span className={cx(
                          "text-xs px-2 py-0.5 rounded-full ring-1",
                          "ring-slate-200 dark:ring-slate-700",
                          p.status === "published" ? "text-green-600 bg-green-50 dark:bg-green-900/20" :
                          p.status === "scheduled" ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" :
                          p.status === "failed" ? "text-red-600 bg-red-50 dark:bg-red-900/20" :
                          "text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/40"
                        )}>
                          {p.status || "draft"}
                        </span>
                        {p.engagement !== undefined && (
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {p.engagement} engagements
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {!loading && pagedPosts.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                {emptyPostsLabel}
              </div>
            )}
          </section>

          {/* Pagination */}
          {!loading && preparedPosts.length > pageSize && (
            <div className={cx(
              "flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700",
              "text-sm text-slate-600 dark:text-slate-300"
            )}>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className={cx("inline-flex items-center", spacing.gap.xs)}>
                <button
                  className={cx(
                    "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                    "bg-white dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                    spacing.button.sm
                  )}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                <button
                  className={cx(
                    "rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                    "bg-white dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                    spacing.button.sm
                  )}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </main>

        {/* Notifications Panel - 只在点击铃铛按钮后显示 */}
        {isNotificationsOpen && (
          <aside
            className={cx(
              "fixed inset-y-0 right-0 z-40 w-80 md:w-96",
              "bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700",
              "transform transition-transform duration-300",
              "translate-x-0 shadow-xl"
            )}
            aria-label="Notifications"
          >
          <div className={cx(
            "flex items-center justify-between border-b border-slate-200 dark:border-slate-700",
            spacing.page.notifications
          )}>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </p>
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setNotificationsOpen(false)}
              aria-label="Close notifications"
            >
              <Icons.Close className="size-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <div className={cx(
            "overflow-y-auto h-[calc(100%-64px)]",
            spacing.page.notifications,
            "space-y-3"
          )}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cx(
                  "flex items-start rounded-lg",
                  "ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.card.compact,
                  spacing.gap.sm,
                  !isRead(n) && "ring-blue-200 dark:ring-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                <img
                  src={n.avatarUrl}
                  alt=""
                  className="size-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {n.title}
                    </div>
                    <button
                      className={cx(
                        "size-2 rounded-full transition-colors",
                        isRead(n)
                          ? "bg-slate-300 dark:bg-slate-600"
                          : "bg-blue-500"
                      )}
                      onClick={() => toggleRead(n)}
                      aria-label={`Mark as ${isRead(n) ? 'unread' : 'read'}`}
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                {emptyNotificationsLabel}
              </div>
            )}
          </div>
        </aside>
        )}

        {/* 通知面板背景遮罩 - 移动端 */}
        {isNotificationsOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setNotificationsOpen(false)}
          />
        )}
      </div>

      {/* Create Post Modal */}
      {allowCreate && createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create post"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCreateOpen(false)}
          />
          <div className={cx(
            "relative w-full max-w-md rounded-xl",
            "bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700",
            "shadow-xl",
            spacing.card.base
          )}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              New Post
            </h2>
            <form className="space-y-3" onSubmit={submitCreate}>
              <textarea
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800 resize-none",
                  spacing.button.sm
                )}
                rows={4}
                placeholder="What's on your mind?"
                value={createDraft.content}
                onChange={(e) => setCreateDraft((d) => ({ ...d, content: e.target.value }))}
                required
              />
              <select
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                value={createDraft.platform}
                onChange={(e) => setCreateDraft((d) => ({ ...d, platform: e.target.value }))}
              >
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
              <input
                type="datetime-local"
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                value={createDraft.scheduledTime}
                onChange={(e) => setCreateDraft((d) => ({ ...d, scheduledTime: e.target.value }))}
              />
              <select
                className={cx(
                  "w-full rounded-lg ring-1 ring-slate-200 dark:ring-slate-700",
                  "bg-white dark:bg-slate-800",
                  spacing.button.sm
                )}
                value={createDraft.status}
                onChange={(e) => setCreateDraft((d) => ({ ...d, status: e.target.value as PostStatus }))}
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <div className={cx("flex items-center pt-4", spacing.gap.xs)}>
                <button
                  className={cx(
                    "rounded-lg bg-black text-white hover:bg-gray-800 transition-colors",
                    spacing.button.md
                  )}
                  type="submit"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  className={cx(
                    "rounded-lg ring-1 ring-slate-300 dark:ring-slate-700",
                    "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                    spacing.button.md
                  )}
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global styles */}
      <style jsx global>{`
        .smd-container {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .smd-container ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .smd-container ::-webkit-scrollbar-track {
          background: transparent;
        }

        .smd-container ::-webkit-scrollbar-thumb {
          background-color: rgb(203 213 225);
          border-radius: 4px;
        }

        .dark .smd-container ::-webkit-scrollbar-thumb {
          background-color: rgb(71 85 105);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .smd-container button:focus-visible,
        .smd-container input:focus-visible,
        .smd-container select:focus-visible,
        .smd-container textarea:focus-visible,
        .smd-container a:focus-visible {
          outline: 2px solid rgb(0 0 0);
          outline-offset: 2px;
        }

        .dark .smd-container button:focus-visible,
        .dark .smd-container input:focus-visible,
        .dark .smd-container select:focus-visible,
        .dark .smd-container textarea:focus-visible,
        .dark .smd-container a:focus-visible {
          outline-color: rgb(255 255 255);
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default SocialMediaDashboard;
