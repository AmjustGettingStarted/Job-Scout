export type AiMode = "private" | "hosted";

export type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  url: string;
  source: string;
};

export type MatchResult = {
  mock: boolean;
  score: number;
  missingSkills: string[];
  highlights: string[];
};

export type OutreachResult = {
  mock: boolean;
  email: string;
};

export const FREE_SCANS = 3;
export const SCANS_KEY = "gs_scans_used";
export const PRO_KEY = "gs_pro";
export const DEMO_KEY = "gs_demo";
