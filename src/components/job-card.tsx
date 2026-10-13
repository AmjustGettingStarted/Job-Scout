"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMotionVariants } from "@/lib/motion";
import type { Job } from "@/lib/types";

export function JobCard({
  job,
  disabled,
  onScan,
}: {
  job: Job;
  disabled: boolean;
  onScan: (job: Job) => void;
}) {
  const motionVars = useMotionVariants();

  return (
    <motion.div variants={motionVars.fadeUp}>
      <Card
        size="sm"
        className="h-full shadow-none transition-shadow duration-300 hover:shadow-plasma-ambient"
      >
        <CardHeader>
          <p className="text-caption text-frost-faint">{job.company}</p>
          <CardTitle className="text-body font-bold">{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <p className="text-caption text-frost-muted">
            {job.location}
            <span className="text-frost-faint"> · </span>
            {job.salary}
          </p>
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 4).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            <Button size="sm" disabled={disabled} onClick={() => onScan(job)}>
              Scan match
            </Button>
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="text-caption font-semibold text-plasma-pink"
            >
              View on {job.source}
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
