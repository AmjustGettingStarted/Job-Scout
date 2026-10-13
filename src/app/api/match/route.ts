import { connection } from "next/server";
import type { Job } from "@/lib/types";

type MatchBody = {
  resume?: string;
  job?: Job;
  mode?: "private" | "hosted";
  type?: "match" | "outreach";
};

const MATCH_SYSTEM =
  'Compare the candidate resume to the job. Return ONLY JSON: {"score": number, "missingSkills": string[], "highlights": string[]}. score is an integer from 0 to 100. missingSkills are tech-stack skills the job asks for that the resume does not show. highlights are 3 short points drawn only from the candidate\'s real experience. Do not invent employers, titles, or skills.';

const OUTREACH_SYSTEM =
  'Write a short recruiter email from the candidate using only experience that appears in the resume and the requirements of this job. Return ONLY JSON: {"email": string}. Keep it under 140 words, personal, and specific. Do not invent experience.';

export async function POST(request: Request) {
  await connection();
  const body = (await request.json().catch(() => null)) as MatchBody | null;
  const resume = body?.resume?.trim() ?? "";
  const job = body?.job;
  const mode = body?.mode === "hosted" ? "hosted" : "private";
  const type = body?.type === "outreach" ? "outreach" : "match";

  if (!resume || !job?.title) {
    return Response.json(
      { error: "Resume and job are required." },
      { status: 400 },
    );
  }

  const target = resolveModel(mode);
  if (!target) {
    return Response.json(mockResult(type, job, resume));
  }

  try {
    const content = await complete(target, type, resume, job);
    const parsed = parseModelJson(content);
    if (type === "outreach") {
      const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
      if (!email) throw new Error("empty email");
      return Response.json({ mock: false, email });
    }
    return Response.json({
      mock: false,
      score: clampScore(parsed.score),
      missingSkills: asStrings(parsed.missingSkills),
      highlights: asStrings(parsed.highlights),
    });
  } catch {
    return Response.json(mockResult(type, job, resume));
  }
}

function resolveModel(mode: "private" | "hosted") {
  if (mode === "hosted") {
    const baseUrl = process.env.TINKER_BASE_URL?.trim();
    const apiKey = process.env.TINKER_API_KEY?.trim();
    const model = process.env.TINKER_MODEL?.trim();
    if (!baseUrl || !apiKey || !model || apiKey.includes("...")) return null;
    return { baseUrl, apiKey, model };
  }

  const baseUrl =
    process.env.OLLAMA_BASE_URL?.trim() || "http://localhost:11434/v1";
  const model = process.env.OLLAMA_MODEL?.trim() || "llama3.1";
  const apiKey = process.env.OLLAMA_API_KEY?.trim() || "";
  return { baseUrl, apiKey, model };
}

async function complete(
  target: { baseUrl: string; apiKey: string; model: string },
  type: "match" | "outreach",
  resume: string,
  job: Job,
) {
  const endpoint = `${target.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(target.apiKey ? { Authorization: `Bearer ${target.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: target.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: type === "outreach" ? OUTREACH_SYSTEM : MATCH_SYSTEM,
        },
        {
          role: "user",
          content: JSON.stringify({
            resume: resume.slice(0, 6000),
            job: {
              title: job.title,
              company: job.company,
              location: job.location,
              tags: job.tags,
              description: job.description,
            },
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) throw new Error("model request failed");
  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("empty model response");
  return content;
}

function parseModelJson(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

function clampScore(value: unknown) {
  const score = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function asStrings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function mockResult(type: "match" | "outreach", job: Job, resume: string) {
  if (type === "outreach") {
    const line = resume.split(/\n|\. /).find((part) => part.trim().length > 40);
    const proof = line?.trim().slice(0, 180) || "recent product work on the resume";
    return {
      mock: true,
      email: `Hi ${job.company} team — I am applying for ${job.title}. ${proof}. That lines up with the ${job.tags.slice(0, 2).join(" and ") || "skills"} this role asks for. Happy to share a short walkthrough of the work.\n\nMOCK — no model connected.`,
    };
  }

  return {
    mock: true,
    score: 72,
    missingSkills: job.tags.slice(0, 3).length
      ? job.tags.slice(0, 3)
      : ["GraphQL", "Kubernetes"],
    highlights: [
      `MOCK — resume compared locally against ${job.title} at ${job.company}.`,
      "Call out one shipped project that uses the stack named in the posting.",
      "Mention remote collaboration only if the resume actually shows it.",
    ],
  };
}
