import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddPlatform?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddPlatform }) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">Connect your first platform</h4>
        <p className="text-xs text-muted-foreground">
          Build your publishing workflow by adding social accounts to the dashboard sidebar.
        </p>
      </div>
      <Button variant="neutral" size="sm" onClick={onAddPlatform}>
        Browse platforms
      </Button>
    </div>
  );
};
