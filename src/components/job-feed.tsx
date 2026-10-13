"use client";

import { AnimatePresence, motion } from "framer-motion";
import { JobCard } from "@/components/job-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMotionVariants } from "@/lib/motion";
import type { Job } from "@/lib/types";

export function JobFeed({
  jobs,
  loading,
  error,
  searched,
  scanning,
  onScan,
}: {
  jobs: Job[];
  loading: boolean;
  error: string;
  searched: boolean;
  scanning: boolean;
  onScan: (job: Job) => void;
}) {
  const motionVars = useMotionVariants();

  return (
    <section id="job-feed" className="flex scroll-mt-4 flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-subheading font-bold text-frost-white">Jobs</h2>
        <p className="text-caption text-frost-muted">
          {loading
            ? "Searching"
            : jobs.length > 0
              ? `${jobs.length} roles`
              : searched
                ? "No matches"
                : "Waiting for a search"}
        </p>
      </div>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeletons"
            className="flex flex-col gap-4"
            {...motionVars.enter}
            variants={motionVars.fadeUp}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-cards" />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div key="error" {...motionVars.enter} variants={motionVars.fadeUp}>
            <Card>
              <CardContent>
                <p className="text-body-sm text-frost-muted">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : jobs.length === 0 ? (
          <motion.div key="empty" {...motionVars.enter} variants={motionVars.fadeUp}>
            <Card>
              <CardContent>
                <p className="text-body-sm text-frost-muted">
                  {searched
                    ? "No roles came back for that search. Try a broader keyword."
                    : "Search a keyword to load remote roles."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={jobs.map((job) => job.id).join("-")}
            className="flex flex-col gap-4"
            {...motionVars.enter}
            variants={motionVars.stagger}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                disabled={scanning}
                onScan={onScan}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
