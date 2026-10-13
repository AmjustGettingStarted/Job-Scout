"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function send(helpful: boolean) {
    setPending(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful }),
      });
      if (!response.ok) throw new Error("feedback failed");
      setSent(true);
      toast.success("Thanks — that helps.");
    } catch {
      toast.error("Could not send feedback.");
    } finally {
      setPending(false);
    }
  }

  return (
    <footer className="flex flex-col gap-4 border-t border-hairline py-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-body-sm text-frost-muted">Did this help?</p>
      <div className="flex gap-3">
        <Button size="sm" disabled={sent || pending} onClick={() => send(true)}>
          Yes
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={sent || pending}
          onClick={() => send(false)}
        >
          Not yet
        </Button>
      </div>
    </footer>
  );
}
