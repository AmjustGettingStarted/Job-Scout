"use client";

import { useState } from "react";
import {
  Lock,
  Mail,
  ScanSearch,
  Shield,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: ScanSearch,
    title: "Search that actually filters",
    body: "A keyword has to show up in the role title. Sales jobs stay out of a frontend search.",
  },
  {
    icon: Shield,
    title: "Resume stays with you",
    body: "Private mode calls a model on your machine. Hosted mode uses an open-weight endpoint you choose.",
  },
  {
    icon: Sparkles,
    title: "One scan, one note",
    body: "Get a match score, the missing skills, and a recruiter email drafted from your real experience.",
  },
];

const quotes = [
  {
    quote: "I pasted the resume and the first role opened with a score. That is the whole product.",
    name: "Amina",
    role: "Frontend engineer",
  },
  {
    quote: "Private mode means I am not uploading my work history into someone else’s training set.",
    name: "Leo",
    role: "Staff engineer",
  },
  {
    quote: "Three free scans were enough to see the fit. Pro is there when the search gets serious.",
    name: "Priya",
    role: "Product designer",
  },
];

export function HeroBand({
  onScout,
  onDemo,
}: {
  onScout: () => void;
  onDemo: () => void;
}) {
  return (
    <section className="fold-cut bg-paper px-5 pt-10 pb-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start gap-6">
          <p className="border border-fold bg-warm-crease px-3 py-1 text-caption font-semibold text-ink">
            Paper-sharp job scouting
          </p>
          <h1 className="max-w-[14ch] text-display font-bold text-ink">
            Fold the search. Keep the resume.
          </h1>
          <p className="max-w-xl text-body text-steel">
            Find a remote role, paste your experience, and see the match. The
            first three scans are free. Pro is $9 a month.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="cursor-pointer" onClick={onScout}>
              Start scouting
            </Button>
            <Button className="cursor-pointer" variant="outline" onClick={onDemo}>
              Try Pro demo
            </Button>
          </div>
        </div>
        <div className="relative mx-auto h-72 w-full max-w-md" aria-hidden>
          <div
            className="absolute inset-6 bg-sage-paper transition-all duration-300"
            style={{ clipPath: "polygon(12% 0, 100% 18%, 82% 100%, 0 78%)" }}
          />
          <div
            className="absolute inset-0 bg-sky-fold transition-all duration-300"
            style={{
              clipPath: "polygon(0 22%, 68% 0, 100% 70%, 28% 100%)",
              transform: "perspective(800px) rotateY(8deg)",
            }}
          />
          <div
            className="absolute right-4 bottom-8 h-28 w-28 bg-coral"
            style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
          />
          <div
            className="absolute top-6 left-8 h-16 w-24 bg-warm-crease"
            style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)" }}
          />
        </div>
      </div>
    </section>
  );
}

export function FeatureBand() {
  return (
    <section id="features" className="px-5 py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <div className="max-w-xl">
          <h2 className="text-heading font-bold text-ink">Cut on the crease</h2>
          <p className="mt-3 text-body text-steel">
            Three moves. Search, paste, scan. Nothing else sits between you and the role.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardContent className="flex h-full gap-4">
                <feature.icon className="size-6 shrink-0 text-coral" strokeWidth={1.5} />
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-body font-bold text-ink">{feature.title}</CardTitle>
                  <p className="text-body-sm text-steel">{feature.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialBand() {
  return (
    <section id="stories" className="bg-sage-paper/40 px-5 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <h2 className="text-heading font-bold text-ink">From the fold</h2>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
          {quotes.map((item) => (
            <figure key={item.name} className="flex flex-col gap-3 border-t-2 border-coral pt-4">
              <blockquote className="text-body-sm text-ink">{item.quote}</blockquote>
              <figcaption className="text-caption font-semibold text-steel">
                {item.name}
                <span className="text-fold"> · </span>
                {item.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingBand({
  upgrading,
  onUpgrade,
  onDemo,
}: {
  upgrading: boolean;
  onUpgrade: () => void;
  onDemo: () => void;
}) {
  return (
    <section id="pricing" className="px-5 py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <div className="max-w-xl">
          <h2 className="text-heading font-bold text-ink">Pricing, folded flat</h2>
          <p className="mt-3 text-body text-steel">
            Start free. Unlock Pro in demo if you want to test the paid path without a card.
          </p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-body font-bold">Scout</CardTitle>
              <p className="text-heading font-bold text-ink">$0</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 text-body-sm text-steel">
              <p>3 resume scans</p>
              <p>Live remote search</p>
              <p>Private or hosted model</p>
            </CardContent>
          </Card>
          <Card className="bg-ink text-paper lg:-translate-y-3">
            <CardHeader>
              <p className="text-caption font-semibold text-coral">Most used</p>
              <CardTitle className="text-body font-bold text-paper">Pro Scout</CardTitle>
              <p className="text-heading font-bold text-paper">$9<span className="text-body-sm font-semibold text-fold">/mo</span></p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 text-body-sm text-paper">
              <p>Unlimited scans</p>
              <p>Outreach emails</p>
              <p>Demo unlock, no charge</p>
              <div className="mt-auto flex flex-col gap-2">
                <Button disabled={upgrading} onClick={onUpgrade}>
                  {upgrading ? "Opening checkout" : "Pay $9"}
                </Button>
                <Button variant="outline" onClick={onDemo}>
                  Demo unlock
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Lock className="size-6 text-coral" strokeWidth={1.5} />
              <CardTitle className="text-body font-bold">Private</CardTitle>
              <p className="text-heading font-bold text-ink">$0</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 text-body-sm text-steel">
              <p>Ollama on your machine</p>
              <p>No resume vendor</p>
              <p>Same scan flow</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function ClosingBand({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="px-5 pb-16">
      <div className="mx-auto max-w-[1200px] bg-coral px-6 py-12 text-paper clip-cta">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-heading font-bold">Ready to crease the shortlist?</h2>
            <p className="mt-2 max-w-lg text-body-sm text-paper">
              Search a keyword, paste the resume, and open the match. Demo Pro is one click if you want the paid state first.
            </p>
          </div>
          <Button variant="outline" className="bg-paper" onClick={onDemo}>
            Unlock demo
          </Button>
        </div>
      </div>
    </section>
  );
}

export function PaperFooter() {
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
    <footer className="border-t border-fold bg-paper px-5 py-12 text-ink">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <p className="text-body font-bold">GhostScout</p>
          <p className="text-caption text-steel">
            Remote job search and resume match, scored on an open model.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-caption">
          <p className="font-semibold">Explore</p>
          <a className="cursor-pointer text-steel hover:text-coral" href="#scout">Scout</a>
          <a className="cursor-pointer text-steel hover:text-coral" href="#features">Features</a>
          <a className="cursor-pointer text-steel hover:text-coral" href="#pricing">Pricing</a>
          <a className="cursor-pointer text-steel hover:text-coral" href="#stories">Stories</a>
        </div>
        <div id="privacy" className="flex flex-col gap-2 text-caption">
          <p className="font-semibold">Legal</p>
          <a className="cursor-pointer text-steel hover:text-coral" href="#privacy">Privacy policy</a>
          <a id="terms" className="cursor-pointer text-steel hover:text-coral" href="#terms">Terms of use</a>
          <a id="contact" className="cursor-pointer text-steel hover:text-coral" href="#contact">Contact</a>
          <p className="text-steel">
            Resumes are sent only to the model mode you pick. This demo stores Pro on this browser, not on a server.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-caption font-semibold">Did this help?</p>
          <div className="flex gap-2">
            <Button size="sm" disabled={sent || pending} onClick={() => void send(true)}>
              Yes
            </Button>
            <Button size="sm" variant="outline" disabled={sent || pending} onClick={() => void send(false)}>
              Not yet
            </Button>
          </div>
          <div className="flex gap-3">
            <a
              className="cursor-pointer text-ink hover:text-coral"
              href="https://github.com/AmjustGettingStarted/Job-Scout"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.4 9.6 8.1 11.2.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.4 6 .4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.7-1.6 8.1-6 8.1-11.2A11.5 11.5 0 0 0 12 .5Z" />
              </svg>
            </a>
            <a className="cursor-pointer text-ink hover:text-coral" href="#contact" aria-label="Contact">
              <Mail className="size-5" />
            </a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1200px] text-caption text-steel">
        Copyright 2026 GhostScout. Jobs link back to LinkedIn, Himalayas, Jobicy, Remotive, Remote OK, Arbeitnow, and We Work Remotely.
      </p>
    </footer>
  );
}
