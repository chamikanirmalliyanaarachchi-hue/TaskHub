"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getIcon } from "@/components/icon-map";
import { formatLKR } from "@/lib/utils";
import type { Service } from "@/lib/types";

/**
 * BentoServicesSection
 * ----------------------------------------------------------------------------
 * A minimalist, high-end "Explore local services" showcase inspired by
 * Linear / Apple marketing pages.
 *
 * Design language:
 *  - Spacious 3-column (3×2) bento grid with generous gaps & padding.
 *  - Deep, dark glass cards (slate-950/60) with hairline borders.
 *  - A soft gradient glow that "emanates from the border" on hover.
 *  - Each card is colour-coded to its category via custom Tailwind tokens
 *    (see tailwind.config.js → theme.extend.colors.services.*).
 *  - No sliders / progress bars. Just an icon, a status badge, a title,
 *    a one-liner, and a subtle "Book Service →" link revealed on hover.
 */

/* The six categories we present, in display order (perfect 3×2 grid). */
const CATEGORY_ORDER = [
  "Garage",
  "Electronics",
  "Furniture",
  "Smart Home",
  "Cleaning",
  "Moving",
] as const;

/**
 * Static, per-category visual tokens.
 * IMPORTANT: every class below is written as a LITERAL string so Tailwind's
 * content scanner can see & generate it (we never build classes dynamically).
 */
const VISUALS: Record<
  string,
  {
    badge: string; // status pill classes
    iconWrap: string; // translucent icon container
    borderHover: string; // hairline border colour on hover
    link: string; // "Book Service" link colour
    glow: string; // rgba used for the hover gradient overlay
  }
> = {
  Garage: {
    badge: "border-services-garage/30 text-services-garage/80",
    iconWrap: "bg-services-garage/10 text-services-garage ring-1 ring-services-garage/20",
    borderHover: "hover:border-services-garage/30",
    link: "text-services-garage",
    glow: "rgba(16,185,129,0.16)",
  },
  Electronics: {
    badge: "border-services-electronics/30 text-services-electronics/80",
    iconWrap:
      "bg-services-electronics/10 text-services-electronics ring-1 ring-services-electronics/20",
    borderHover: "hover:border-services-electronics/30",
    link: "text-services-electronics",
    glow: "rgba(6,182,212,0.16)",
  },
  Furniture: {
    badge: "border-services-furniture/30 text-services-furniture/80",
    iconWrap:
      "bg-services-furniture/10 text-services-furniture ring-1 ring-services-furniture/20",
    borderHover: "hover:border-services-furniture/30",
    link: "text-services-furniture",
    glow: "rgba(168,85,247,0.16)",
  },
  "Smart Home": {
    badge: "border-services-smartHome/30 text-services-smartHome/80",
    iconWrap:
      "bg-services-smartHome/10 text-services-smartHome ring-1 ring-services-smartHome/20",
    borderHover: "hover:border-services-smartHome/30",
    link: "text-services-smartHome",
    glow: "rgba(245,158,11,0.16)",
  },
  Cleaning: {
    badge: "border-services-cleaning/30 text-services-cleaning/80",
    iconWrap:
      "bg-services-cleaning/10 text-services-cleaning ring-1 ring-services-cleaning/20",
    borderHover: "hover:border-services-cleaning/30",
    link: "text-services-cleaning",
    glow: "rgba(244,63,94,0.16)",
  },
  Moving: {
    badge: "border-services-moving/30 text-services-moving/80",
    iconWrap: "bg-services-moving/10 text-services-moving ring-1 ring-services-moving/20",
    borderHover: "hover:border-services-moving/30",
    link: "text-services-moving",
    glow: "rgba(59,130,246,0.16)",
  },
};

/* Minimal status badge text per category. */
const BADGE_LABEL: Record<string, string> = {
  Garage: "Popular",
  Electronics: "Trending",
  Furniture: "Popular",
  "Smart Home": "Trending",
  Cleaning: "New",
  Moving: "Hot",
};

export function BentoServicesSection() {
  const [services, setServices] = React.useState<Service[] | null>(null);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const openBooking = useAppStore((s) => s.openBooking);

  // Pull the live catalogue from the route handler.
  React.useEffect(() => {
    let active = true;
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: Service[]) => active && setServices(data))
      .catch(() => active && setServices([]));
    return () => {
      active = false;
    };
  }, []);

  // Build the ordered list of cards, matching a service to each category.
  const cards = React.useMemo(() => {
    if (!services) return [];
    return CATEGORY_ORDER.map((cat) => {
      const svc = services.find((s) => s.category === cat);
      return svc ? { category: cat, service: svc } : null;
    }).filter(Boolean) as { category: string; service: Service }[];
  }, [services]);

  return (
    <section
      id="services"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 py-28 sm:py-32"
    >
      {/* ---- Spacious section header ---- */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/50"
        >
          Services
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-5 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Explore local services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-lg text-balance text-base text-white/40"
        >
          Vetted Taskers across your city — from a quick fix to a full smart-home
          setup. Tap any tile to book in seconds.
        </motion.p>
      </div>

      {/* ---- Minimalist 3×2 bento grid ---- */}
      {!services ? (
        // Airy skeleton placeholders (no heavy shimmer).
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cards.map(({ category, service }, i) => {
            const v = VISUALS[category];
            const Icon = getIcon(service.icon);
            const isActive = selectedCategory === category;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group relative"
              >
                {/* Soft gradient glow that emanates from the border on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(440px circle at 50% -10%, ${v.glow}, transparent 70%)`,
                  }}
                />

                {/* The card surface */}
                <div
                  className={`relative flex h-full flex-col rounded-3xl border border-white/5 bg-slate-950/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${v.borderHover} ${
                    isActive ? "ring-1 ring-white/10" : ""
                  }`}
                >
                  {/* Top row: icon + status badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${v.iconWrap}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${v.badge}`}
                    >
                      {BADGE_LABEL[category]}
                    </span>
                  </div>

                  {/* Middle: title + one-line description + subtle meta */}
                  <div className="mt-6">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {service.name}
                    </h3>
                    <p className="mt-2 line-clamp-1 text-sm text-white/40">
                      {service.description}
                    </p>
                    <div className="mt-5 flex items-center gap-3 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Star className={`h-3.5 w-3.5 fill-current ${v.link}`} />
                        <span className="text-white/50">{service.rating}</span>
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span>From {formatLKR(service.hourlyRate)}/hr</span>
                    </div>
                  </div>

                  {/* Bottom: subtle "Book Service →" link revealed on hover */}
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      openBooking(service);
                    }}
                    className={`mt-8 flex items-center gap-1 text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 ${v.link}`}
                  >
                    Book Service
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
