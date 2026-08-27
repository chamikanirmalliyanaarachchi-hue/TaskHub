import { NextResponse } from "next/server";
import { SERVICES } from "@/lib/data";
import { PROMO_CODES, URGENT_FEE_RATE } from "@/lib/constants";
import type { QuoteRequest, PriceQuote, Service } from "@/lib/types";

/**
 * GET /api/services
 * Returns the full catalogue of local services (used by the Bento grid).
 */
export async function GET() {
  return NextResponse.json(SERVICES);
}

/**
 * POST /api/services
 * Calculates a live, itemised price quote for a booking.
 *
 * Body (QuoteRequest):
 *   { serviceId, hours, urgent, promo, options[] }
 *
 * The pricing model:
 *   base        = hourlyRate × hours
 *   optionsTotal= Σ price of selected add-ons
 *   subtotal    = base + optionsTotal
 *   urgentFee   = subtotal × 25%   (when urgent)
 *   discount    = (subtotal + urgentFee) × promoRate
 *   total       = subtotal + urgentFee − discount
 */
export async function POST(request: Request) {
  let body: QuoteRequest;
  try {
    body = (await request.json()) as QuoteRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    serviceId,
    hours = 1,
    urgent = false,
    promo = "",
    options = [],
  } = body;

  const service: Service | undefined = SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Compute base + add-ons.
  const base = service.hourlyRate * Math.max(1, Number(hours) || 1);
  const optionsTotal = service.options
    .filter((o) => options.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);

  const subtotal = base + optionsTotal;
  const urgentFee = urgent ? subtotal * URGENT_FEE_RATE : 0;

  // Promo discount (applied on the post-urgent amount).
  const promoKey = promo.trim().toUpperCase();
  const promoRate = PROMO_CODES[promoKey] ?? 0;
  const discount = (subtotal + urgentFee) * promoRate;

  const quote: PriceQuote = {
    base: Math.round(base),
    optionsTotal: Math.round(optionsTotal),
    subtotal: Math.round(subtotal),
    urgentFee: Math.round(urgentFee),
    discount: Math.round(discount),
    total: Math.round(subtotal + urgentFee - discount),
    currency: "LKR",
  };

  // Simulate a brief server delay for realistic "calculating" UX.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(quote);
}
