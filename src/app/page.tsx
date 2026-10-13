"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HeroSearch } from "@/components/hero-search";
import { JobFeed } from "@/components/job-feed";
import {
  ClosingBand,
  FeatureBand,
  HeroBand,
  PaperFooter,
  PricingBand,
  TestimonialBand,
} from "@/components/landing-sections";
import { MatchSheet } from "@/components/match-sheet";
import { PaywallModal } from "@/components/paywall-modal";
import { ResumePanel } from "@/components/resume-panel";
import { SiteHeader } from "@/components/site-header";
import { useMotionVariants } from "@/lib/motion";
import {
  DEMO_KEY,
  FREE_SCANS,
  PRO_KEY,
  SCANS_KEY,
  type AiMode,
  type Job,
  type MatchResult,
} from "@/lib/types";

export default function Page() {
  const motionVars = useMotionVariants();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("react");
  const [location, setLocation] = useState("india");
  const [mode, setMode] = useState<AiMode>("private");
  const [resume, setResume] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [searched, setSearched] = useState(false);
  const [used, setUsed] = useState(0);
  const [pro, setPro] = useState(false);
  const [demo, setDemo] = useState(false);
  const [ready, setReady] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [matching, setMatching] = useState(false);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const scrollFeed = useRef(false);
  const pendingJob = useRef<Job | null>(null);

  useEffect(() => {
    const storedUsed = Number(localStorage.getItem(SCANS_KEY) ?? "0");
    const storedDemo = localStorage.getItem(DEMO_KEY) === "true";
    setUsed(Number.isFinite(storedUsed) ? storedUsed : 0);
    setDemo(storedDemo);
    setPro(storedDemo || localStorage.getItem(PRO_KEY) === "true");
    setReady(true);
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    let cancelled = false;
    async function verify() {
      try {
        const response = await fetch(
          `/api/verify?session_id=${encodeURIComponent(sessionId as string)}`,
        );
        const data = (await response.json()) as { pro?: boolean };
        if (cancelled) return;
        if (data.pro) {
          localStorage.setItem(PRO_KEY, "true");
          localStorage.removeItem(DEMO_KEY);
          setDemo(false);
          setPro(true);
          toast.success("Pro Scout is active. Unlimited scans.");
        } else {
          toast.error("Payment was not completed.");
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState(null, "", `${url.pathname}${url.search}`);
      } catch {
        if (!cancelled) toast.error("Could not verify checkout.");
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  async function searchJobs() {
    const q = keyword.trim();
    if (!q) return;
    setJobsLoading(true);
    setJobsError("");
    setSearched(true);
    try {
      const response = await fetch(
        `/api/jobs?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("jobs failed");
      const data = (await response.json()) as { jobs: Job[]; source?: string };
      setJobs(data.jobs ?? []);
      if (data.source === "mock") {
        toast("Showing sample roles. Remotive did not respond.");
      }
    } catch {
      setJobs([]);
      setJobsError("The job search failed. Try again in a moment.");
    } finally {
      scrollFeed.current = true;
      setJobsLoading(false);
    }
  }

  useEffect(() => {
    if (!scrollFeed.current || jobsLoading) return;
    scrollFeed.current = false;
    document.getElementById("job-feed")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [jobsLoading, jobs, jobsError]);

  function handleResume(value: string) {
    const wasEmpty = resume.trim().length === 0;
    setResume(value);
    const text = value.trim();
    if (!text) return;

    const queued = pendingJob.current;
    if (queued) {
      pendingJob.current = null;
      void scan(queued, value);
      return;
    }

    if (!wasEmpty || text.length < 80) return;
    if (jobs.length > 0 && !matching) {
      void scan(jobs[0], value);
      return;
    }
    toast("Resume saved. Search a keyword, then hit Scan first role.");
  }

  async function scan(job: Job, resumeText = resume) {
    if (!resumeText.trim()) {
      pendingJob.current = job;
      toast("Paste your resume. This role scans as soon as you do.");
      document.getElementById("resume")?.focus();
      document.getElementById("resume-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    pendingJob.current = null;
    if (ready && !pro && used >= FREE_SCANS) {
      setPaywallOpen(true);
      return;
    }

    const next = used + 1;
    setUsed(next);
    localStorage.setItem(SCANS_KEY, String(next));
    setActiveJob(job);
    setMatch(null);
    setSheetOpen(true);
    setMatching(true);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText, job, mode, type: "match" }),
      });
      const data = (await response.json()) as MatchResult & { error?: string };
      if (!response.ok) {
        toast.error(data.error || "Scan failed.");
        setMatch(null);
        return;
      }
      if (data.mock) toast("Demo mode: no model connected");
      setMatch(data);
    } catch {
      toast.error("Scan failed.");
      setMatch(null);
    } finally {
      setMatching(false);
    }
  }

  function unlockDemo() {
    localStorage.setItem(PRO_KEY, "true");
    localStorage.setItem(DEMO_KEY, "true");
    setPro(true);
    setDemo(true);
    setPaywallOpen(false);
    toast.success("Demo Pro is on. No charge. Unlimited scans.");
  }

  function endDemo() {
    localStorage.removeItem(PRO_KEY);
    localStorage.removeItem(DEMO_KEY);
    setPro(false);
    setDemo(false);
    toast("Demo Pro is off. Free scans apply again.");
  }

  async function upgrade() {
    setUpgrading(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        toast.error(data.error || "Checkout is unavailable.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Checkout is unavailable.");
    } finally {
      setUpgrading(false);
    }
  }

  const scansLeft = Math.max(0, FREE_SCANS - used);
  const quota = demo
    ? "Pro · demo"
    : pro
      ? "Pro"
      : `${scansLeft} ${scansLeft === 1 ? "scan" : "scans"} left`;

  return (
    <main className="flex w-full flex-col">
      <SiteHeader
        quota={quota}
        pro={pro}
        demo={demo}
        upgrading={upgrading}
        onUpgrade={() => void upgrade()}
        onDemo={unlockDemo}
        onEndDemo={endDemo}
      />
      <HeroBand
        onScout={() => document.getElementById("scout")?.scrollIntoView({ behavior: "smooth" })}
        onDemo={unlockDemo}
      />
      <motion.div
        className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-12"
        variants={motionVars.fadeUp}
        {...motionVars.enter}
      >
        <HeroSearch
          keyword={keyword}
          location={location}
          mode={mode}
          loading={jobsLoading}
          onKeyword={setKeyword}
          onLocation={setLocation}
          onMode={setMode}
          onSearch={() => void searchJobs()}
        />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="order-2 lg:order-1">
            <JobFeed
              jobs={jobs}
              loading={jobsLoading}
              error={jobsError}
              searched={searched}
              scanning={matching}
              onScan={(job) => void scan(job)}
            />
          </div>
          <div className="order-1 lg:sticky lg:top-24 lg:order-2">
            <ResumePanel
              resume={resume}
              jobsReady={jobs.length > 0}
              scanning={matching}
              onResume={handleResume}
              onScanFirst={() => {
                if (!jobs[0]) {
                  toast("Search a keyword first.");
                  return;
                }
                void scan(jobs[0]);
              }}
              onFileError={(message) => toast.error(message)}
            />
          </div>
        </div>
      </motion.div>
      <FeatureBand />
      <TestimonialBand />
      <PricingBand
        upgrading={upgrading}
        onUpgrade={() => void upgrade()}
        onDemo={unlockDemo}
      />
      <ClosingBand onDemo={unlockDemo} />
      <PaperFooter />

      <MatchSheet
        open={sheetOpen}
        job={activeJob}
        resume={resume}
        mode={mode}
        loading={matching}
        result={match}
        onOpenChange={setSheetOpen}
      />
      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        upgrading={upgrading}
        onUpgrade={() => void upgrade()}
        onDemo={unlockDemo}
      />
    </main>
  );
}
