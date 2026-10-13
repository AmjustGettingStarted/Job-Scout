"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const features = [
  "Unlimited scans",
  "Outreach emails",
  "Private mode",
];

export function PaywallModal({
  open,
  onOpenChange,
  upgrading,
  onUpgrade,
  onDemo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  upgrading: boolean;
  onUpgrade: () => void;
  onDemo: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pro Scout, $9/month</DialogTitle>
          <DialogDescription>
            The first three scans are free. Pro keeps the scout running.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-body-sm text-frost-white">
              <Check className="size-4 text-plasma-pink" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="shadow-plasma" disabled={upgrading} onClick={onUpgrade}>
          {upgrading ? "Opening checkout" : "Continue to checkout"}
        </Button>
        <Button variant="outline" onClick={onDemo}>
          Demo unlock — no charge
        </Button>
      </DialogContent>
    </Dialog>
  );
}
