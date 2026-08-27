"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  LayoutGrid,
  Wrench,
  Smartphone,
  Sofa,
  Home,
  Droplet,
  Paintbrush,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getIcon } from "@/components/icon-map";
import { CATEGORIES } from "@/lib/data";
import { KEYWORD_MAP } from "@/lib/constants";
import { formatLKR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";

/**
 * Light3DHeroAndServices
 * ----------------------------------------------------------------------------
 * The always-light, Apple/Stripe-inspired hero + service showcase.
 *
 *  - Crisp white / off-white canvas, deep charcoal headings, vibrant gradient
 *    accents.
 *  - Hero: bold headline, a central soft-shadowed smart-search bar with live
 *    AI tag detection, and a row of floating 3D category pills.
 *  - Services: clean layered-white "bento" cards with diffused multi-layer
 *    shadows, pastel-tinted icon boxes, and spring hover-lift (y:-6).
 *  - Fully driven by GET /api/services and the shared Zustand store.
 */

/* Pastel-tinted, glowing icon boxes + label colours per category (light mode).
   All classes are written as literals so Tailwind can generate them. */
const CATEGORY_META: Record<
  string,
  { icon: LucideIcon; box: string; text: string }
> = {
  All: { icon: LayoutGrid, box: "bg-slate-100 text-slate-600", text: "text-slate-600" },
  Garage: { icon: Wrench, box: "bg-emerald-50 text-emerald-600", text: "text-emerald-600" },
  Electronics: { icon: Smartphone, box: "bg-cyan-50 text-cyan-600", text: "text-cyan-600" },
  Furniture: { icon: Sofa, box: "bg-purple-50 text-purple-600", text: "text-purple-600" },
  "Smart Home": { icon: Home, box: "bg-amber-50 text-amber-600", text: "text-amber-600" },
  Cleaning: { icon: Sparkles, box: "bg-rose-50 text-rose-600", text: "text-rose-600" },
  Plumbing: { icon: Droplet, box: "bg-blue-50 text-blue-600", text: "text-blue-600" },
  Painting: { icon: Paintbrush, box: "bg-lime-50 text-lime-600", text: "text-lime-600" },
  Moving: { icon: Truck, box: "bg-indigo-50 text-indigo-600", text: "text-indigo-600" },
};

export function Light3DHeroAndServices() {
  const [query, setQuery] = React.useState("");
  const [detected, setDetected] = React.useState<{ category: string; tag: string }[]>([]);
  const [services, setServices] = React.useState<Service[] | null>(null);

  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const openBooking = useAppStore((s) => s.openBooking);

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

  // Live AI-style tag/category detection as the user types.
  React.useEffect(() => {
    const text = query.toLowerCase();
    if (!text.trim()) {
      setDetected([]);
      return;
    }
    const found: { category: string; tag: string }[] = [];
    const seen = new Set<string>();
    for (const key of Object.keys(KEYWORD_MAP)) {
      if (text.includes(key) && !seen.has(KEYWORD_MAP[key].category)) {
        seen.add(KEYWORD_MAP[key].category);
        found.push(KEYWORD_MAP[key]);
      }
    }
    setDetected(found);
  }, [query]);

  const scrollToServices = () =>
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(detected[0]?.category ?? "All");
    scrollToServices();
  };

  // Filter by the active category; first becomes the featured wide card.
  const visible = React.useMemo(() => {
    if (!services) return [];
    if (selectedCategory === "All") return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Soft premium gradient blobs (light) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      {/* ============================ HERO ============================ */}
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-36 text-center sm:pt-44">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered local Taskers, on demand
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl"
        >
          Book a <span className="text-gradient">local expert</span>
          <br className="hidden sm:block" /> in minutes, not days.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-balance text-base text-slate-500 sm:text-lg"
        >
          Describe the task in plain words — our AI matches you with vetted
          Taskers for garage, electronics, furniture, smart-home and more.
        </motion.p>

        {/* Central smart-search bar with soft shadow box */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={submitSearch}
          className="mx-auto mt-9 flex max-w-2xl items-center gap-2 rounded-full border border-slate-100 bg-white p-2 pl-5 shadow-xl shadow-slate-200/50"
        >
          <Search className="h-5 w-5 shrink-0 text-primary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Fix my car bumper tomorrow at 10 AM…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <Button type="submit" variant="gradient" size="lg" className="shrink-0">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </motion.form>

        {/* Live detected tags */}
        <div className="mt-4 flex min-h-[28px] flex-wrap items-center justify-center gap-2">
          <AnimatePresence>
            {detected.map((d, i) => (
              <motion.span
                key={d.tag}
                initial={{ opacity: 0, scale: 0.7, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                <Sparkles className="mr-1 inline h-3 w-3" />
                {d.tag} → {d.category}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating 3D category pills */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_META[cat] ?? CATEGORY_META.All;
            const Icon = meta.icon;
            const active = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSelectedCategory(cat);
                  scrollToServices();
                }}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-lg shadow-slate-200/50 transition-colors",
                  active ? "border-primary/40 ring-2 ring-primary/30" : "border-slate-100"
                )}
              >
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl", meta.box)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">{cat}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ========================= SERVICES ========================= */}
      <div id="services" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              <Zap className="h-3 w-3 text-primary" /> Easy Access
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Explore local services
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {selectedCategory === "All"
              ? "Trending across your city right now."
              : `Filtered by “${selectedCategory}”.`}
          </p>
        </div>

        {!services ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl border border-slate-100 bg-white" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured && (
              <ServiceCard
                key={featured.id}
                service={featured}
                featured
                onBook={() => openBooking(featured)}
              />
            )}
            {rest.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                onBook={() => openBooking(service)}
              />
            ))}
            {visible.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-slate-400">
                No services in this category yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------- Light 3D service card --------------------------- */
function ServiceCard({
  service,
  featured,
  index = 0,
  onBook,
}: {
  service: Service;
  featured?: boolean;
  index?: number;
  onBook: () => void;
}) {
  const Icon = getIcon(service.icon);
  const meta = CATEGORY_META[service.category] ?? CATEGORY_META.All;
  const IconBox = meta.box;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-shadow hover:shadow-2xl hover:shadow-slate-200",
        featured && "lg:col-span-2 lg:flex-row lg:items-center"
      )}
    >
      {/* Subtle gradient watermark on hover */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30",
          service.gradient
        )}
      />

      <div className={cn("relative", featured && "lg:max-w-md")}>
        <div className="flex items-start justify-between">
          <div className={cn("grid h-12 w-12 place-items-center rounded-2xl shadow-sm", IconBox)}>
            <Icon className="h-6 w-6" />
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {service.category}
          </span>
        </div>

        <h3
          className={cn(
            "mt-5 font-display font-semibold text-slate-900",
            featured ? "text-2xl" : "text-xl"
          )}
        >
          {service.name}
        </h3>
        <p className={cn("mt-2 text-slate-500", featured ? "text-sm" : "line-clamp-2 text-sm")}>
          {service.description}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-600">{service.rating}</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-200" />
          <span>{service.taskersAvailable} nearby</span>
          <span className="h-1 w-1 rounded-full bg-slate-200" />
          <span>From {formatLKR(service.hourlyRate)}/hr</span>
        </div>
      </div>

      {/* CTA */}
      {featured ? (
        <Button variant="gradient" className="relative mt-6 shrink-0 lg:mt-0" onClick={onBook}>
          Book Now <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <button
          onClick={onBook}
          className="mt-6 flex items-center gap-1 text-sm font-medium text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-primary"
        >
          Book Service
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </motion.div>
  );
}
