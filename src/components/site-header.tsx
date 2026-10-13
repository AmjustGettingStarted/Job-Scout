"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader({
  quota,
  pro,
  demo,
  upgrading,
  onUpgrade,
  onDemo,
  onEndDemo,
}: {
  quota: string;
  pro: boolean;
  demo: boolean;
  upgrading: boolean;
  onUpgrade: () => void;
  onDemo: () => void;
  onEndDemo: () => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-buttons border border-hairline">
          <span className="radar-dot" aria-hidden />
        </span>
        <span className="text-body font-bold tracking-[-0.021em] text-frost-white">
          GhostScout
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={pro ? "default" : "outline"}>{quota}</Badge>
        {demo ? (
          <Button size="sm" variant="outline" onClick={onEndDemo}>
            End demo
          </Button>
        ) : pro ? null : (
          <>
            <Button size="sm" variant="outline" onClick={onDemo}>
              Demo unlock
            </Button>
            <Button size="sm" disabled={upgrading} onClick={onUpgrade}>
              {upgrading ? "Opening checkout" : "Upgrade $9/mo"}
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
