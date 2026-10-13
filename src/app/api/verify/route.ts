import { connection } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  await connection();
  const sessionId = new URL(request.url).searchParams.get("session_id");
  const secret = process.env.STRIPE_SECRET_KEY?.trim();

  if (!sessionId || !secret || secret.includes("...")) {
    return Response.json({ pro: false });
  }

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return Response.json({ pro: session.payment_status === "paid" });
  } catch {
    return Response.json({ pro: false });
  }
}
