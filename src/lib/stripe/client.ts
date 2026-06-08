import "server-only";
import Stripe from "stripe";

// Cliente único reutilizado em route handlers e webhooks. Stripe SDK é
// thread-safe e mantém pool de conexões internamente.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

// IDs públicos do plano Pro. Definidos via env pra permitir trocar entre
// modo test e live sem mudar código.
export const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY!;
