import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccountGroup } from "./AccountGroup";
import { EmptyState } from "./EmptyState";
import { AccountGroup as AccountGroupType, SocialAccount } from "../types";

interface SidebarContentProps {
  quickAccess: SocialAccount[];
  groups: AccountGroupType[];
  isCollapsed: boolean;
  isLoading: boolean;
  onToggleGroup: (groupId: string) => void;
  onRemove: (platformId: string) => void;
  onConnect: (platformId: string) => void;
  onAddPlatform?: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  quickAccess,
  groups,
  isCollapsed,
  isLoading,
  onToggleGroup,
  onRemove,
  onConnect,
  onAddPlatform,
}) => {
  const hasVisibleAccounts = groups.some((group) => group.accounts.length);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 px-3 py-4">
        {!isCollapsed && quickAccess.length > 0 && (
          <section className="space-y-2">
            <header className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick access
            </header>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickAccess.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.id}
                    title={account.platform}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-card transition hover:border-primary"
                  >
                    <Icon className="h-6 w-6" style={{ color: account.color }} />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-lg border border-border/50 bg-muted/40"
              />
            ))}
          </div>
        )}

        {!isLoading && !hasVisibleAccounts && (
          <EmptyState onAddPlatform={onAddPlatform} />
        )}

        {!isLoading &&
          groups.map((group) => (
            <AccountGroup
              key={group.id}
              group={group}
              isCollapsed={isCollapsed}
              onToggleGroup={onToggleGroup}
              onRemove={onRemove}
              onConnect={onConnect}
            />
          ))}
      </div>
    </ScrollArea>
  );
};
