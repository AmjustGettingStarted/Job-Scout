"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#scout", label: "Scout" },
  { href: "#features", label: "Features" },
  { href: "#stories", label: "Stories" },
  { href: "#pricing", label: "Pricing" },
];

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
    <header className="sticky top-0 z-40 border-b border-fold bg-paper/95 px-5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 py-4">
        <a href="#scout" className="flex cursor-pointer items-center gap-3">
          <span
            className="block size-8 bg-coral"
            style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
            aria-hidden
          />
          <span className="text-body font-bold text-ink">GhostScout</span>
        </a>
        <nav className="flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer text-caption font-semibold text-steel transition-all hover:text-coral"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
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
      </div>
    </header>
  );
}
