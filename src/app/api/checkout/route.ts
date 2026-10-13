import { connection } from "next/server";
import Stripe from "stripe";

export async function POST() {
  await connection();
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const price = process.env.STRIPE_PRICE_ID?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

  if (!secret || !price || secret.includes("...") || price.includes("...")) {
    return Response.json(
      { error: "Stripe test keys are not configured." },
      { status: 400 },
    );
  }

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    });

    if (!session.url) {
      return Response.json({ error: "Checkout did not return a URL." }, { status: 500 });
    }

    return Response.json({ url: session.url });
  } catch {
    return Response.json(
      { error: "Could not start Stripe Checkout." },
      { status: 500 },
    );
  }
}
