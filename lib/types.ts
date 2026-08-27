/**
 * Shared TypeScript domain types for TaskHub 2.0.
 * These describe the shape of data exchanged between the UI and the
 * Next.js Route Handler (app/api/services/route.ts).
 */

/** An optional paid add-on presented in the booking flow (Step 1). */
export interface ServiceOption {
  id: string;
  name: string;
  /** Extra cost in LKR (Sri Lankan Rupees). */
  price: number;
}

/** The 4 steps of the multi-step booking drawer (1-indexed). */
export type BookingStep = 1 | 2 | 3 | 4;

/** A local service / task category listing. */
export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Lucide icon key — resolved to a component via components/icon-map.tsx. */
  icon: string;
  /** Base hourly rate in LKR. */
  hourlyRate: number;
  /** Mock "live" count of nearby taskers. */
  taskersAvailable: number;
  rating: number;
  tags: string[];
  /** Tailwind gradient utility classes used for the card artwork. */
  gradient: string;
  options: ServiceOption[];
  popular?: boolean;
}

/** The itemised price quote returned by the pricing API. */
export interface PriceQuote {
  base: number;
  optionsTotal: number;
  subtotal: number;
  /** Urgent surcharge (25% of subtotal when requested). */
  urgentFee: number;
  discount: number;
  total: number;
  currency: string;
}

/** Request body accepted by POST /api/services (price calculation). */
export interface QuoteRequest {
  serviceId: string;
  hours: number;
  urgent: boolean;
  promo: string;
  options: string[];
}

/** A single live booking activity entry for the toast feed. */
export interface ActivityItem {
  id: string;
  name: string;
  service: string;
  location: string;
  minutesAgo: number;
}
