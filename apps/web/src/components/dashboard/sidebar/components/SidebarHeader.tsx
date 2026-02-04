import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  connectedCount: number;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  searchQuery,
  onSearchChange,
  connectedCount,
}) => {
  return (
    <header className="relative border-b border-border px-3 py-4">
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm transition hover:bg-accent"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className={cn("flex flex-col gap-3", isCollapsed && "items-center")}> 
        {!isCollapsed && (
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Social Accounts</h3>
            <span className="text-xs text-muted-foreground">
              Connected platforms: {connectedCount}
            </span>
          </div>
        )}

        {!isCollapsed && (
          <SearchInput value={searchQuery} onChange={onSearchChange} />
        )}

        {isCollapsed && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {connectedCount} connected
          </span>
        )}
      </div>
    </header>
  );
};
