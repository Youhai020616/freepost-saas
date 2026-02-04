import { SocialPlatformDefinition } from "../types";
import {
  BlueskyIcon,
  DiscordIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MediumIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  ThreadsIcon,
  TikTokIcon,
  TwitterIcon,
  YouTubeIcon,
} from "./icons";

export const PLATFORM_DEFINITIONS: SocialPlatformDefinition[] = [
  {
    id: "twitter",
    platform: "Twitter",
    icon: TwitterIcon,
    color: "#1da1f2",
    category: "social",
  },
  {
    id: "facebook",
    platform: "Facebook",
    icon: FacebookIcon,
    color: "#1877f2",
    category: "social",
  },
  {
    id: "instagram",
    platform: "Instagram",
    icon: InstagramIcon,
    color: "#e4405f",
    category: "social",
  },
  {
    id: "tiktok",
    platform: "TikTok",
    icon: TikTokIcon,
    color: "#000000",
    category: "social",
  },
  {
    id: "threads",
    platform: "Threads",
    icon: ThreadsIcon,
    color: "#000000",
    category: "social",
  },
  {
    id: "bluesky",
    platform: "Bluesky",
    icon: BlueskyIcon,
    color: "#0085ff",
    category: "social",
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    icon: LinkedInIcon,
    color: "#0077b5",
    category: "professional",
  },
  {
    id: "youtube",
    platform: "YouTube",
    icon: YouTubeIcon,
    color: "#ff0000",
    category: "media",
  },
  {
    id: "medium",
    platform: "Medium",
    icon: MediumIcon,
    color: "#000000",
    category: "media",
  },
  {
    id: "pinterest",
    platform: "Pinterest",
    icon: PinterestIcon,
    color: "#e60023",
    category: "media",
  },
  {
    id: "reddit",
    platform: "Reddit",
    icon: RedditIcon,
    color: "#ff4500",
    category: "social",
  },
  {
    id: "discord",
    platform: "Discord",
    icon: DiscordIcon,
    color: "#5865f2",
    category: "messaging",
  },
  {
    id: "telegram",
    platform: "Telegram",
    icon: TelegramIcon,
    color: "#0088cc",
    category: "messaging",
  },
];

export const DEFAULT_VISIBLE_PLATFORMS = [
  "twitter",
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
];

export const STATUS_COLORS = {
  connected: {
    border: "var(--platform-color, var(--primary))",
    background: "color-mix(in srgb, var(--platform-color, var(--primary)) 10%, transparent)",
    text: "var(--foreground)",
  },
  disconnected: {
    border: "var(--muted-foreground-30, hsl(var(--border)))",
    background: "color-mix(in srgb, hsl(var(--muted)) 15%, transparent)",
    text: "var(--muted-foreground)",
  },
  error: {
    border: "hsl(var(--destructive))",
    background: "color-mix(in srgb, hsl(var(--destructive)) 12%, transparent)",
    text: "hsl(var(--destructive))",
  },
};
