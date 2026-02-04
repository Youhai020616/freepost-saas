import React, { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PLATFORM_DEFINITIONS } from "../utils/constants";
import { PlatformCategory } from "../types";

interface AddPlatformDialogProps {
  trigger: React.ReactNode;
  visibleAccountIds: Set<string>;
  onToggleVisibility: (platformId: string) => void;
}

const CATEGORY_LABELS: Record<PlatformCategory, string> = {
  social: "Social Media",
  professional: "Professional",
  media: "Media & Content",
  messaging: "Messaging",
};

export const AddPlatformDialog: React.FC<AddPlatformDialogProps> = ({
  trigger,
  visibleAccountIds,
  onToggleVisibility,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredPlatforms = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return PLATFORM_DEFINITIONS;
    return PLATFORM_DEFINITIONS.filter((platform) =>
      platform.platform.toLowerCase().includes(query)
    );
  }, [search]);

  const platformsByCategory = useMemo(() => {
    return filteredPlatforms.reduce<Record<PlatformCategory, typeof PLATFORM_DEFINITIONS>>(
      (acc, platform) => {
        acc[platform.category] = acc[platform.category] || [];
        acc[platform.category].push(platform);
        return acc;
      },
      {
        social: [],
        professional: [],
        media: [],
        messaging: [],
      }
    );
  }, [filteredPlatforms]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Social Media Platforms</DialogTitle>
          <DialogDescription>
            Select platforms to show in your sidebar. You can connect them after adding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="relative">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search platforms..."
              className="h-10 w-full rounded-md border border-border bg-muted/40 px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </div>

          {Object.entries(platformsByCategory).map(([category, platforms]) => {
            if (!platforms.length) return null;

            return (
              <section key={category} className="space-y-3">
                <header className="text-sm font-semibold text-foreground">
                  {CATEGORY_LABELS[category as PlatformCategory]} ({platforms.length})
                </header>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isVisible = visibleAccountIds.has(platform.id);

                    return (
                      <button
                        key={platform.id}
                        onClick={() => onToggleVisibility(platform.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
                          isVisible
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/30 hover:border-primary/40"
                        )}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card">
                          <Icon className="h-5 w-5" style={{ color: platform.color }} />
                        </span>
                        <span className="flex-1 text-sm font-medium text-foreground">
                          {platform.platform}
                        </span>
                        {isVisible ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
