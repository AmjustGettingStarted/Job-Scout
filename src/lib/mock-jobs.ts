import type { Job } from "@/lib/types";

export const mockJobs: Job[] = [
  {
    id: "mock-1",
    company: "Northline",
    title: "Senior React Engineer",
    location: "Remote — Worldwide",
    salary: "$140k–$170k",
    tags: ["React", "TypeScript", "Next.js", "Node"],
    description:
      "Build the product UI for a remote-first developer tool. You will own a Next.js app, work with a small API team, and ship accessible interfaces. Required: React, TypeScript, and production Next.js. Nice to have: testing, design systems, and Postgres.",
    url: "https://remotive.com",
    source: "Sample",
  },
  {
    id: "mock-2",
    company: "Harbor Kit",
    title: "Full-Stack TypeScript Developer",
    location: "Remote — Americas",
    salary: "$120k–$150k",
    tags: ["TypeScript", "PostgreSQL", "React", "AWS"],
    description:
      "Join a four-person team shipping a hiring product. The stack is TypeScript end to end, React on the front, Postgres underneath, and AWS for deploy. You should have shipped a product people pay for and be comfortable writing SQL.",
    url: "https://remotive.com",
    source: "Sample",
  },
  {
    id: "mock-3",
    company: "Lumen Field",
    title: "Frontend Engineer, Design Systems",
    location: "Remote — Europe",
    salary: "Not listed",
    tags: ["React", "CSS", "Accessibility", "Figma"],
    description:
      "Maintain a component library used by three product squads. Strong CSS, accessible React, and the ability to turn Figma into production components. GraphQL is a plus. No closed-source design-tool lock-in required.",
    url: "https://remotive.com",
    source: "Sample",
  },
];
