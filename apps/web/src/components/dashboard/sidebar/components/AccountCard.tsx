import React from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "../utils/constants";
import { SocialAccount } from "../types";

interface AccountCardProps {
  account: SocialAccount;
  isCollapsed: boolean;
  onRemove: (platformId: string) => void;
  onManage?: (platformId: string) => void;
  onConnect?: (platformId: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isCollapsed,
  onRemove,
  onManage,
  onConnect,
}) => {
  const Icon = account.icon;
  const isConnected = account.connected;

  if (isCollapsed) {
    return (
      <button
        onClick={() => !isConnected && onConnect?.(account.id)}
        className="w-full p-3 flex items-center justify-center"
        title={account.platform}
      >
        <div className="relative flex items-center justify-center">
          <Icon
            className="w-6 h-6"
            style={{ color: isConnected ? account.color : undefined }}
          />
          {isConnected && (
            <span className="absolute -top-1 -right-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-card bg-green-500" />
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-lg border transition-all",
        isConnected
          ? "bg-card border-border hover:shadow-sm"
          : "border-dashed border-muted-foreground/30 bg-muted/40"
      )}
      style={{
        borderColor: isConnected ? account.color : undefined,
        background: isConnected ? STATUS_COLORS.connected.background : undefined,
      }}
    >
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" style={{ color: account.color }} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {account.platform}
              </span>
              <span className="text-xs text-muted-foreground">
                {isConnected ? account.username : "Not connected"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[11px] font-medium text-green-600 dark:text-green-400">
                <Check className="h-3 w-3" />
                Connected
              </span>
            )}
            <button
              onClick={() => onRemove(account.id)}
              className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-destructive"
              title="Remove from sidebar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {isConnected ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => onManage?.(account.id)}
            >
              Manage
            </Button>
          ) : (
            <Button
              variant="neutral"
              size="sm"
              className="h-8 w-full gap-1 text-xs"
              onClick={() => onConnect?.(account.id)}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
