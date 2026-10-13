import { load } from "cheerio";
import { findPlace, placeTerms } from "@/lib/places";
import { stripHtml } from "@/lib/strip-html";
import type { Job } from "@/lib/types";

const TTL_MS = 10 * 60 * 1000;
const RESULT_LIMIT = 72;
const HIMALAYAS_PAGES = 4;
const LINKEDIN_PAGES = 3;

const STOP = new Set([
  "a",
  "an",
  "and",
  "dev",
  "developer",
  "end",
  "engineer",
  "for",
  "in",
  "job",
  "jobs",
  "junior",
  "lead",
  "of",
  "on",
  "or",
  "remote",
  "role",
  "roles",
  "senior",
  "staff",
  "the",
  "to",
  "with",
]);

const ALIASES: Record<string, string[]> = {
  frontend: [
    "frontend",
    "front-end",
    "front end",
    "react",
    "vue",
    "angular",
    "svelte",
    "next.js",
    "nextjs",
    "web developer",
    "web engineer",
  ],
  front: [
    "frontend",
    "front-end",
    "front end",
    "react",
    "vue",
    "angular",
    "web developer",
  ],
  "front-end": ["frontend", "front-end", "front end", "react", "vue", "angular"],
  react: ["react", "next.js", "nextjs", "frontend", "front-end"],
  vue: ["vue", "nuxt", "frontend"],
  angular: ["angular", "frontend"],
  backend: [
    "backend",
    "back-end",
    "back end",
    "node.js",
    "nodejs",
    "django",
    "rails",
    "golang",
    "python",
  ],
  back: ["backend", "back-end", "back end"],
  "back-end": ["backend", "back-end", "back end"],
  python: ["python", "django", "flask", "fastapi"],
  node: ["node.js", "nodejs", "node", "nestjs"],
  fullstack: ["fullstack", "full-stack", "full stack"],
  "full-stack": ["fullstack", "full-stack", "full stack"],
  full: ["fullstack", "full-stack", "full stack"],
  designer: ["designer", "figma", "ux", "ui/ux"],
  design: ["designer", "figma", "ux"],
  devops: ["devops", "sre", "kubernetes", "terraform"],
  sales: ["sales", "account executive"],
};

const WWR_FEEDS = [
  "https://weworkremotely.com/categories/remote-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-design-jobs.rss",
  "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
  "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
];

type Cache = { at: number; jobs: Job[] };

let catalog: Cache | null = null;
let loading: Promise<Job[]> | null = null;
const queryCache = new Map<string, Cache>();

export async function loadCatalog(): Promise<Job[]> {
  if (catalog && Date.now() - catalog.at < TTL_MS) return catalog.jobs;
  if (!loading) {
    loading = fetchCatalog()
      .then((jobs) => {
        catalog = { at: Date.now(), jobs };
        return jobs;
      })
      .finally(() => {
        loading = null;
      });
  }
  return loading;
}

export async function searchJobs(q: string, location: string): Promise<Job[]> {
  const [catalogResult, queryResult] = await Promise.allSettled([
    loadCatalog(),
    loadQueryFeeds(q, location),
  ]);
  const catalogJobs = catalogResult.status === "fulfilled" ? catalogResult.value : [];
  const queryJobs = queryResult.status === "fulfilled" ? queryResult.value : [];
  const jobs = dropSpamTags(dedupe([...queryJobs, ...catalogJobs]));
  if (jobs.length === 0) throw new Error("No job feeds responded");
  return rankJobs(jobs, q, location);
}

export function rankJobs(jobs: Job[], q: string, location: string): Job[] {
  const tokens = queryTokens(q);
  if (tokens.length === 0) return [];
  const terms = placeTerms(location);

  const scored = jobs.flatMap((job) => {
    const title = job.title.toLowerCase();
    const tags = job.tags.join(" ").toLowerCase();
    const description = job.description.toLowerCase();
    let score = 0;
    let titleHits = 0;
    let matched = 0;

    for (const token of tokens) {
      const needles = ALIASES[token] ?? [token];
      if (needles.some((needle) => title.includes(needle))) {
        score += title.includes(token) ? 16 : 10;
        titleHits += 1;
        matched += 1;
      } else if (needles.some((needle) => tags.includes(needle))) {
        score += 4;
        matched += 1;
      } else if (needles.some((needle) => description.includes(needle))) {
        score += 1;
        matched += 1;
      }
    }

    if (matched < tokens.length) return [];
    const place = placeRank(job, terms);
    if (place === 0) return [];
    return [{ job, score, titleHits, place }];
  });

  const titled = scored.filter((row) => row.titleHits === tokens.length);
  const pool = titled.length > 0 ? titled : scored;

  return pool
    .sort(
      (a, b) =>
        b.place - a.place || b.score - a.score || a.job.title.localeCompare(b.job.title),
    )
    .slice(0, RESULT_LIMIT)
    .map((row) => row.job);
}

async function loadQueryFeeds(q: string, location: string): Promise<Job[]> {
  const key = `${q.trim().toLowerCase()}|${location.trim().toLowerCase()}`;
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.jobs;

  const batches = await Promise.allSettled([
    fetchHimalayas(q, location),
    fetchJobicy(q, location),
    fetchLinkedIn(q, location),
  ]);
  const jobs = dedupe(
    batches.flatMap((batch) => (batch.status === "fulfilled" ? batch.value : [])),
  );
  queryCache.set(key, { at: Date.now(), jobs });
  return jobs;
}

async function fetchCatalog(): Promise<Job[]> {
  const batches = await Promise.allSettled([
    fetchRemotive(),
    fetchRemoteOk(),
    fetchArbeitnow(),
    fetchWwr(),
  ]);
  const jobs = batches.flatMap((batch) =>
    batch.status === "fulfilled" ? batch.value : [],
  );
  if (jobs.length === 0) throw new Error("No job feeds responded");
  return dropSpamTags(dedupe(jobs));
}

function queryTokens(q: string): string[] {
  const parts = q
    .toLowerCase()
    .split(/[^a-z0-9+.#-]+/)
    .filter((token) => token.length > 1);
  const useful = parts.filter((token) => !STOP.has(token));
  return useful.length > 0 ? useful : parts.filter((token) => token.length > 2);
}

function placeRank(job: Job, terms: string[] | null) {
  if (!terms) return 1;
  const hay = `${job.location} ${job.title}`.toLowerCase();
  if (terms.some((term) => includesTerm(hay, term))) return 2;
  if (/\b(worldwide|anywhere|global)\b/.test(hay) || hay.trim() === "remote") return 1;
  return 0;
}

function includesTerm(hay: string, needle: string) {
  if (/[^a-z0-9\s]/i.test(needle)) return hay.includes(needle);
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(hay);
}

const TAG_NOISE = new Set([
  "dev",
  "developer",
  "engineer",
  "engineering",
  "remote",
  "senior",
  "junior",
  "lead",
]);

function dropSpamTags(jobs: Job[]): Job[] {
  const groups = new Map<string, Job[]>();
  for (const job of jobs) {
    const group = groups.get(job.source) ?? [];
    group.push(job);
    groups.set(job.source, group);
  }

  const spam = new Set<string>();
  for (const group of groups.values()) {
    const counts = new Map<string, number>();
    for (const job of group) {
      for (const tag of new Set(job.tags.map((item) => item.toLowerCase()))) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    const ceiling = Math.max(3, Math.floor(group.length * 0.35));
    for (const [tag, count] of counts) {
      if (count > ceiling) spam.add(`${group[0]?.source}:${tag}`);
    }
  }

  return jobs.map((job) => {
    const hay = `${job.title} ${job.description}`.toLowerCase();
    return {
      ...job,
      tags: job.tags.filter((tag) => {
        const key = tag.toLowerCase();
        if (key.length < 2 || TAG_NOISE.has(key)) return false;
        if (spam.has(`${job.source}:${key}`)) return false;
        return hay.includes(key);
      }),
    };
  });
}

function dedupe(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    const key = `${job.company}|${job.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: {
      Accept: "application/json",
      "User-Agent": "job-scout",
    },
  });
  if (!response.ok) throw new Error(`Feed failed: ${response.status}`);
  return (await response.json()) as T;
}

async function fetchRemotive(): Promise<Job[]> {
  const payload = await fetchJson<{
    jobs?: Array<{
      id: number;
      url: string;
      title: string;
      company_name: string;
      tags?: string[];
      candidate_required_location?: string;
      salary?: string;
      description?: string;
    }>;
  }>("https://remotive.com/api/remote-jobs");

  return (payload.jobs ?? []).map((job) =>
    makeJob({
      id: `remotive-${job.id}`,
      company: job.company_name,
      title: job.title,
      location: job.candidate_required_location || "Remote",
      salary: job.salary || "Not listed",
      tags: job.tags ?? [],
      description: job.description ?? "",
      url: job.url,
      source: "Remotive",
    }),
  );
}

async function fetchRemoteOk(): Promise<Job[]> {
  const payload = await fetchJson<
    Array<{
      id?: number | string;
      position?: string;
      company?: string;
      tags?: string[];
      description?: string;
      location?: string;
      salary_min?: number;
      salary_max?: number;
      url?: string;
    }>
  >("https://remoteok.com/api");

  return payload.flatMap((job) => {
    if (!job.position || !job.url || !job.id) return [];
    return [
      makeJob({
        id: `remoteok-${job.id}`,
        company: job.company || "Unknown company",
        title: job.position,
        location: job.location || "Remote",
        salary: formatSalary(job.salary_min, job.salary_max),
        tags: (job.tags ?? []).filter((tag) => tag !== job.company),
        description: job.description ?? "",
        url: job.url,
        source: "Remote OK",
      }),
    ];
  });
}

async function fetchArbeitnow(): Promise<Job[]> {
  const payload = await fetchJson<{
    data?: Array<{
      slug: string;
      company_name: string;
      title: string;
      description: string;
      remote?: boolean;
      url: string;
      tags?: string[];
      location?: string;
    }>;
  }>("https://www.arbeitnow.com/api/job-board-api");

  return (payload.data ?? []).flatMap((job) => {
    if (job.remote === false || !job.url) return [];
    return [
      makeJob({
        id: `arbeitnow-${job.slug}`,
        company: job.company_name,
        title: job.title,
        location: job.location || "Remote",
        salary: "Not listed",
        tags: job.tags ?? [],
        description: job.description ?? "",
        url: job.url,
        source: "Arbeitnow",
      }),
    ];
  });
}

async function fetchWwr(): Promise<Job[]> {
  const feeds = await Promise.allSettled(WWR_FEEDS.map((url) => fetchText(url)));
  return feeds.flatMap((feed) =>
    feed.status === "fulfilled" ? parseWwr(feed.value) : [],
  );
}

async function fetchText(url: string, userAgent = "job-scout"): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: { "User-Agent": userAgent },
  });
  if (!response.ok) throw new Error(`Feed failed: ${response.status}`);
  return response.text();
}

function parseWwr(xml: string): Job[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].flatMap((match) => {
    const block = match[1];
    const link = rssTag(block, "link");
    const rawTitle = stripHtml(rssTag(block, "title"), 200);
    if (!link || !rawTitle) return [];
    const splitAt = rawTitle.indexOf(": ");
    const company = splitAt === -1 ? "Unknown company" : rawTitle.slice(0, splitAt);
    const title = splitAt === -1 ? rawTitle : rawTitle.slice(splitAt + 2);
    const region = stripHtml(rssTag(block, "region"), 120);
    return [
      makeJob({
        id: `wwr-${link}`,
        company,
        title,
        location: region || "Remote",
        salary: "Not listed",
        tags: [...block.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((item) =>
          stripHtml(item[1], 40),
        ),
        description: rssTag(block, "description"),
        url: link,
        source: "We Work Remotely",
      }),
    ];
  });
}

async function fetchHimalayas(q: string, location: string): Promise<Job[]> {
  const place = findPlace(location);
  const pages = await Promise.allSettled(
    Array.from({ length: HIMALAYAS_PAGES }, (_, index) => {
      const params = new URLSearchParams({ q, page: String(index + 1) });
      if (place?.value === "worldwide") params.set("worldwide", "true");
      else if (place?.iso) params.set("country", place.iso);
      return fetchJson<{ jobs?: HimalayaJob[] }>(
        `https://himalayas.app/jobs/api/search?${params.toString()}`,
      );
    }),
  );

  return pages.flatMap((page) => {
    if (page.status !== "fulfilled") return [];
    return (page.value.jobs ?? []).flatMap((job) => {
      if (!job.title || !job.applicationLink || !job.guid) return [];
      const countries = (job.locationRestrictions ?? [])
        .map(restrictionName)
        .filter(Boolean);
      return [
        makeJob({
          id: `himalayas-${job.guid}`,
          company: job.companyName || "Unknown company",
          title: job.title,
          location: countries.join(", ") || "Remote — Worldwide",
          salary: formatHimalayaSalary(job),
          tags: job.categories ?? [],
          description: job.description || job.excerpt || "",
          url: job.applicationLink,
          source: "Himalayas",
        }),
      ];
    });
  });
}

type HimalayaJob = {
  title?: string;
  excerpt?: string;
  companyName?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryPeriod?: string;
  currency?: string | null;
  locationRestrictions?: unknown[];
  categories?: string[];
  description?: string;
  applicationLink?: string;
  guid?: string;
};

function restrictionName(value: unknown) {
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    "name" in value &&
    typeof value.name === "string"
  ) {
    return value.name;
  }
  return "";
}

function formatHimalayaSalary(job: HimalayaJob) {
  const low = numberOrZero(job.minSalary ?? undefined);
  const high = numberOrZero(job.maxSalary ?? undefined);
  if (!low && !high) return "Not listed";
  const currency = job.currency ? `${job.currency} ` : "";
  const period =
    job.salaryPeriod && job.salaryPeriod !== "annual" ? `/${job.salaryPeriod}` : "";
  if (low && high && low !== high) return `${currency}${low}–${high}${period}`;
  return `${currency}${low || high}${period}`;
}

async function fetchJobicy(q: string, location: string): Promise<Job[]> {
  const params = new URLSearchParams({ count: "50" });
  const tag = q.trim().slice(0, 50);
  if (tag.length >= 3) params.set("tag", tag);
  const geo = findPlace(location)?.jobicy;
  if (geo) params.set("geo", geo);

  const payload = await fetchJson<{
    jobs?: Array<{
      id?: number | string;
      url?: string;
      jobTitle?: string;
      companyName?: string;
      jobGeo?: string;
      jobExcerpt?: string;
      jobDescription?: string;
      jobIndustry?: string[];
    }>;
  }>(`https://jobicy.com/api/v2/remote-jobs?${params.toString()}`);

  return (payload.jobs ?? []).flatMap((job) => {
    if (!job.id || !job.url || !job.jobTitle) return [];
    return [
      makeJob({
        id: `jobicy-${job.id}`,
        company: job.companyName || "Unknown company",
        title: job.jobTitle,
        location: job.jobGeo || "Remote",
        salary: "Not listed",
        tags: job.jobIndustry ?? [],
        description: job.jobDescription || job.jobExcerpt || "",
        url: job.url,
        source: "Jobicy",
      }),
    ];
  });
}

async function fetchLinkedIn(q: string, location: string): Promise<Job[]> {
  const place = findPlace(location);
  const pages = await Promise.allSettled(
    Array.from({ length: LINKEDIN_PAGES }, (_, index) => {
      const params = new URLSearchParams({
        keywords: q,
        start: String(index * 10),
      });
      if (place?.value === "remote") params.set("f_WT", "2");
      else if (place && place.value !== "worldwide") params.set("location", place.label);
      return fetchText(
        `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${params.toString()}`,
        LINKEDIN_AGENT,
      );
    }),
  );

  return pages.flatMap((page) => (page.status === "fulfilled" ? parseLinkedIn(page.value) : []));
}

const LINKEDIN_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function parseLinkedIn(html: string): Job[] {
  const $ = load(html);
  const jobs: Job[] = [];
  $("div.base-search-card").each((_, element) => {
    const card = $(element);
    const title = card.find("h3").first().text().replace(/\s+/g, " ").trim();
    const company = card.find("h4").first().text().replace(/\s+/g, " ").trim();
    const location = card
      .find(".job-search-card__location")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const href = card.find("a.base-card__full-link").attr("href") ?? "";
    const urn = card.attr("data-entity-urn") ?? href;
    if (!title || !href) return;
    jobs.push(
      makeJob({
        id: `linkedin-${urn}`,
        company: company || "Unknown company",
        title,
        location: location || "Remote",
        salary: "Not listed",
        tags: [],
        description: `${title} at ${company || "a company"} in ${location || "an unlisted location"}. Listed on LinkedIn.`,
        url: href,
        source: "LinkedIn",
      }),
    );
  });
  return jobs;
}

function rssTag(block: string, tag: string): string {
  const found = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!found) return "";
  return found[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
}

function makeJob(job: Job): Job {
  return {
    id: job.id,
    company: clean(job.company, 120) || "Unknown company",
    title: clean(job.title, 180) || "Untitled role",
    location: clean(job.location, 120) || "Remote",
    salary: clean(job.salary, 80) || "Not listed",
    tags: job.tags.map((tag) => clean(tag, 32)).filter(Boolean).slice(0, 8),
    description: stripHtml(job.description),
    url: job.url,
    source: job.source,
  };
}

function clean(value: string, max: number) {
  return stripHtml(value, max);
}

function formatSalary(min?: number, max?: number) {
  const low = numberOrZero(min);
  const high = numberOrZero(max);
  if (!low && !high) return "Not listed";
  if (low && high && low !== high) return `${usd(low)}–${usd(high)}`;
  return usd(low || high);
}

function numberOrZero(value?: number) {
  return typeof value === "number" && value > 0 ? value : 0;
}

function usd(amount: number) {
  if (amount >= 1000) return `$${Math.round(amount / 1000)}k`;
  return `$${amount}`;
}
