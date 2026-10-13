"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScoreRing } from "@/components/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMotionVariants } from "@/lib/motion";
import type { AiMode, Job, MatchResult } from "@/lib/types";

export function MatchSheet({
  open,
  job,
  resume,
  mode,
  loading,
  result,
  onOpenChange,
}: {
  open: boolean;
  job: Job | null;
  resume: string;
  mode: AiMode;
  loading: boolean;
  result: MatchResult | null;
  onOpenChange: (open: boolean) => void;
}) {
  const motionVars = useMotionVariants();
  const [email, setEmail] = useState("");
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    setEmail("");
  }, [job?.id]);

  async function draftEmail() {
    if (!job) return;
    setDrafting(true);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job, mode, type: "outreach" }),
      });
      const data = (await response.json()) as { mock?: boolean; email?: string; error?: string };
      if (!response.ok || !data.email) {
        toast.error(data.error || "Could not draft the email.");
        return;
      }
      if (data.mock) toast("Demo mode: no model connected");
      setEmail(data.email);
    } catch {
      toast.error("Could not draft the email.");
    } finally {
      setDrafting(false);
    }
  }

  async function copyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>{job?.title ?? "Match"}</SheetTitle>
          <SheetDescription>
            {job ? `${job.company} · ${job.location}` : "Pick a role to scan."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="flex flex-col gap-4"
                {...motionVars.enter}
                variants={motionVars.fadeUp}
              >
                <Skeleton className="mx-auto h-[220px] w-[220px] rounded-buttons" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                className="flex flex-col gap-6"
                {...motionVars.enter}
                variants={motionVars.stagger}
              >
                <motion.div variants={motionVars.fadeUp} className="flex flex-col items-center">
                  <ScoreRing score={result.score} />
                  {result.mock ? <Badge>MOCK</Badge> : null}
                </motion.div>
                <motion.div variants={motionVars.fadeUp} className="flex flex-col gap-3">
                  <h3 className="text-body-sm font-semibold text-frost-white">
                    Missing skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.length === 0 ? (
                      <p className="text-caption text-frost-muted">
                        No obvious stack gaps in this pass.
                      </p>
                    ) : (
                      result.missingSkills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))
                    )}
                  </div>
                </motion.div>
                <motion.div variants={motionVars.fadeUp} className="flex flex-col gap-3">
                  <h3 className="text-body-sm font-semibold text-frost-white">
                    Highlights to mention
                  </h3>
                  <div className="flex flex-col gap-3">
                    {result.highlights.map((item) => (
                      <motion.div
                        key={item}
                        variants={motionVars.fadeUp}
                        className="text-body-sm text-frost-muted"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={motionVars.fadeUp} className="flex flex-col gap-3">
                  <Button disabled={drafting} onClick={draftEmail}>
                    {drafting ? "Writing" : "Generate outreach email"}
                  </Button>
                  <AnimatePresence>
                    {email ? (
                      <motion.div
                        key="email"
                        className="flex flex-col gap-3"
                        {...motionVars.enter}
                        variants={motionVars.fadeUp}
                      >
                        <Textarea readOnly value={email} className="min-h-48" />
                        <Button variant="outline" size="sm" onClick={copyEmail}>
                          Copy
                        </Button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                className="text-body-sm text-frost-muted"
                {...motionVars.enter}
                variants={motionVars.fadeUp}
              >
                The scan did not return a match. Try again.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
