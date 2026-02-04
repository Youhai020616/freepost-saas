import React from "react";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccountCard } from "./AccountCard";
import { AccountGroup as AccountGroupType, SocialAccount } from "../types";

interface AccountGroupProps {
  group: AccountGroupType;
  isCollapsed: boolean;
  onToggleGroup?: (groupId: string) => void;
  onRemove: (platformId: string) => void;
  onConnect: (platformId: string) => void;
}

export const AccountGroup: React.FC<AccountGroupProps> = ({
  group,
  isCollapsed,
  onToggleGroup,
  onRemove,
  onConnect,
}) => {
  const { accounts, isCollapsible, isCollapsed: collapsed } = group;

  const handleToggle = () => {
    if (isCollapsible && onToggleGroup) {
      onToggleGroup(group.id);
    }
  };

  if (!accounts.length) {
    return null;
  }

  return (
    <section className="space-y-2">
      {!isCollapsed && (
        <header className="flex items-center justify-between px-2 text-xs font-medium text-muted-foreground">
          <button
            onClick={handleToggle}
            className={cn(
              "flex items-center gap-2 rounded px-1 py-1 transition hover:text-foreground",
              !isCollapsible && "cursor-default"
            )}
          >
            {isCollapsible && (
              <span className="inline-flex h-4 w-4 items-center justify-center">
                {collapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </span>
            )}
            <span>
              {group.label}
              <span className="ml-1 text-[11px] text-muted-foreground/70">
                ({accounts.length})
              </span>
            </span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            aria-label={`${group.label} actions`}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </header>
      )}

      {!collapsed && (
        <div className="grid gap-2">
          {accounts.map((account: SocialAccount) => (
            <AccountCard
              key={account.id}
              account={account}
              isCollapsed={isCollapsed}
              onRemove={onRemove}
              onConnect={onConnect}
            />
          ))}
        </div>
      )}
    </section>
  );
};
