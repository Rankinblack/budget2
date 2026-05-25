// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout Session (one-time payment) for the signed-in user.
// Deploy:  supabase functions deploy create-checkout --no-verify-jwt
// Secrets: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SUPABASE_URL, SUPABASE_ANON_KEY
import Stripe from "https://esm.sh/stripe@16?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const PRICE_ID = Deno.env.get("STRIPE_PRICE_ID")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    // Identify the user from their Supabase access token.
    const auth = req.headers.get("Authorization") || "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: cors });

    const { returnUrl } = await req.json().catch(() => ({ returnUrl: "" }));
    const base = returnUrl || req.headers.get("origin") || "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",                       // one-time payment
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${base}?paid=1`,
      cancel_url: `${base}?canceled=1`,
      client_reference_id: user.id,          // so the webhook knows who paid
      customer_email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
