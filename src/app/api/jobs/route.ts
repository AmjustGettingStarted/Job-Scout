import { connection } from "next/server";
import { searchJobs } from "@/lib/search-jobs";

export async function GET(request: Request) {
  await connection();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const location = searchParams.get("location")?.trim() ?? "";

  if (!q) {
    return Response.json(
      { jobs: [], source: "live" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const jobs = await searchJobs(q, location);
    return Response.json(
      { jobs, source: "live" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { jobs: [], error: "Job feeds did not respond." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
