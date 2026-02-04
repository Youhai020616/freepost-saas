import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPlatformDialog } from "./AddPlatformDialog";

interface SidebarFooterProps {
  isCollapsed: boolean;
  visibleAccountIds: Set<string>;
  onToggleVisibility: (platformId: string) => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed,
  visibleAccountIds,
  onToggleVisibility,
}) => {
  return (
    <footer className="border-t border-border px-3 py-4">
      {isCollapsed ? (
        <AddPlatformDialog
          visibleAccountIds={visibleAccountIds}
          onToggleVisibility={onToggleVisibility}
          trigger={
            <Button variant="ghost" size="icon" className="w-full">
              <Plus className="h-5 w-5" />
            </Button>
          }
        />
      ) : (
        <AddPlatformDialog
          visibleAccountIds={visibleAccountIds}
          onToggleVisibility={onToggleVisibility}
          trigger={
            <Button
              variant="ghost"
              className="w-full gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add more platforms
            </Button>
          }
        />
      )}
    </footer>
  );
};
