import { connection } from "next/server";

export async function POST(request: Request) {
  await connection();
  const body = (await request.json().catch(() => null)) as {
    helpful?: boolean;
    note?: string;
  } | null;

  console.log("[ghostscout-feedback]", {
    helpful: Boolean(body?.helpful),
    note: body?.note?.slice(0, 500) ?? "",
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
