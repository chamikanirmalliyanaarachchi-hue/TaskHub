"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getIcon } from "@/components/icon-map";
import { CATEGORIES } from "@/lib/data";
import { formatLKR, cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

/**
 * ImmersiveServiceHub
 * ----------------------------------------------------------------------------
 * A creative, mobile-first replacement for the old grid. Goal: reduce scrolling
 * fatigue & cognitive load via an "easy access" layout.
 *
 *  1. Pill-based Category Hub — a horizontally swipeable strip for instant
 *     thumb access to every category.
 *  2. Featured Immersive Card — one large hero card (3D tilt + multi-stop
 *     gradient + glow) for the top service, with a prominent Book CTA.
 *  3. Vertical Stack — the remaining services as clean, tinted glass cards
 *     with subtle tilt + tap feedback.
 *
 * Everything is driven by Framer Motion springs for fluid 3D depth.
 */
export function ImmersiveServiceHub() {
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

  // Filter by the active category; the first becomes the "featured" hero,
  // the rest form the vertical stack.
  const visible = React.useMemo(() => {
    if (!services) return [];
    if (selectedCategory === "All") return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const featured = visible[0];
  const stack = visible.slice(1);

  return (
    <section
      id="services"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-4 py-16 sm:py-24"
    >
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
            <Zap className="h-3 w-3 text-primary" /> Easy Access
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Services, one tap away
          </h2>
        </div>
      </div>

      {/* 1 ▸ Horizontal Pill Category Hub (swipeable) */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_22px_-6px_hsl(var(--primary)/0.9)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white"
              )}
            >
              {cat}
            </motion.button>
          );
        })}
      </div>

      {!services ? (
        <div className="mt-6 space-y-4">
          <div className="h-56 animate-pulse rounded-3xl border border-white/5 bg-white/[0.02]" />
          <div className="h-20 animate-pulse rounded-3xl border border-white/5 bg-white/[0.02]" />
        </div>
      ) : (
        <>
          {/* 2 ▸ Featured Immersive Card */}
          {featured && (
            <FeaturedCard
              key={featured.id}
              service={featured}
              onBook={() => openBooking(featured)}
            />
          )}

          {/* 3 ▸ Vertical Stack */}
          <div className="mt-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {stack.map((service, i) => (
                <StackCard
                  key={service.id}
                  service={service}
                  index={i}
                  onBook={() => openBooking(service)}
                />
              ))}
            </AnimatePresence>
            {stack.length === 0 && (
              <p className="py-6 text-center text-sm text-white/40">
                That's the only service in this category.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Reusable 3D tilt wrapper (desktop hover tilt + mobile tap feedback).
--------------------------------------------------------------------------- */
function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 150,
    damping: 15,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 150,
    damping: 15,
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------- Featured hero ----------------------------- */
function FeaturedCard({
  service,
  onBook,
}: {
  service: Service;
  onBook: () => void;
}) {
  const Icon = getIcon(service.icon);
  return (
    <TiltCard className="mt-6" intensity={10}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/50 p-7 shadow-2xl backdrop-blur-xl"
        )}
      >
        {/* Multi-stop gradient artwork */}
        <div
          className={cn(
            "absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-60 blur-3xl",
            service.gradient
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-[0.07]",
            service.gradient
          )}
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                service.gradient
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/60">
              ★ Featured
            </span>
          </div>

          <h3 className="mt-5 font-display text-2xl font-bold text-white">
            {service.name}
          </h3>
          <p className="mt-2 max-w-md text-sm text-white/50">
            {service.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white/60">{service.rating}</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{service.taskersAvailable} nearby</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>From {formatLKR(service.hourlyRate)}/hr</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBook}
            className={cn(
              "mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-lg",
              service.gradient,
              "shadow-primary/30"
            )}
          >
            <Sparkles className="h-4 w-4" /> Book Now
          </motion.button>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ------------------------------- Stack card ------------------------------ */
function StackCard({
  service,
  index,
  onBook,
}: {
  service: Service;
  index: number;
  onBook: () => void;
}) {
  const Icon = getIcon(service.icon);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 22 }}
    >
      <TiltCard intensity={6}>
        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md",
              service.gradient
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-display text-base font-semibold text-white">
              {service.name}
            </h4>
            <p className="truncate text-xs text-white/40">
              {service.category} · From {formatLKR(service.hourlyRate)}/hr
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBook}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
            aria-label={`Book ${service.name}`}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </TiltCard>
    </motion.div>
  );
}
