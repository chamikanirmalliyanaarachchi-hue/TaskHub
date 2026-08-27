"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clock, Users, Star, ArrowUpRight, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getIcon } from "@/components/icon-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatLKR, cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

/**
 * "Bento Grid" service showcase.
 *  - Pulls live service data from GET /api/services.
 *  - Filters by the category chosen in the hero (shared via Zustand).
 *  - Each card features a hover-driven 3D tilt, a live hourly-rate calculator
 *    (drag the slider to recompute), and a live availability badge.
 *  - Clicking a card opens the multi-step booking drawer.
 */
export function BentoGrid() {
  const [services, setServices] = React.useState<Service[] | null>(null);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
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

  const visible = React.useMemo(() => {
    if (!services) return [];
    if (selectedCategory === "All") return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="glow" className="mb-3">
            <Zap className="h-3.5 w-3.5" /> Popular Tasks
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Explore local services
          </h2>
          <p className="mt-2 text-muted-foreground">
            {selectedCategory === "All"
              ? "Trending across your city right now."
              : `Filtered by “${selectedCategory}”.`}
          </p>
        </div>
      </div>

      {!services ? (
        // Skeleton loading state
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-3xl bg-secondary/40"
            />
          ))}
        </div>
      ) : (
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((service, i) => (
            <BentoCard
              key={service.id}
              service={service}
              index={i}
              onBook={() => openBooking(service)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Individual bento card with 3D tilt + live rate calculator
--------------------------------------------------------------------------- */
function BentoCard({
  service,
  index,
  onBook,
}: {
  service: Service;
  index: number;
  onBook: () => void;
}) {
  const Icon = getIcon(service.icon);
  const [hours, setHours] = React.useState(2);

  // Size variation for the bento aesthetic (popular cards span larger).
  const span = React.useMemo(() => {
    if (service.popular && index % 3 === 0)
      return "lg:col-span-2 lg:row-span-2";
    if (index % 5 === 0) return "lg:col-span-2";
    return "";
  }, [service.popular, index]);

  // ---- 3D tilt logic ----
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 15,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const livePrice = service.hourlyRate * hours;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className={cn("perspective", span)}
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-5 shadow-lg backdrop-blur-xl transition-shadow hover:shadow-2xl dark:bg-white/[0.06]"
      >
        {/* Artwork */}
        <div
          className={cn(
            "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity group-hover:opacity-70",
            service.gradient
          )}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between">
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              service.gradient
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="success" className="gap-1">
            <Users className="h-3 w-3" />
            {service.taskersAvailable} near you
          </Badge>
        </div>

        {/* Body */}
        <div className="relative mt-4">
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span className="font-semibold text-foreground">{service.rating}</span>
            <span className="text-muted-foreground">· {service.category}</span>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold">{service.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {service.description}
          </p>
        </div>

        {/* Live calculator */}
        <div className="relative mt-4 rounded-2xl bg-secondary/50 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {hours}h
            </span>
            <span className="font-semibold text-foreground">
              {formatLKR(livePrice)}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 w-full accent-[hsl(var(--primary))]"
            aria-label="Hours"
          />
        </div>

        {/* CTA */}
        <Button
          variant="gradient"
          className="relative mt-4 w-full"
          onClick={onBook}
        >
          Instant Book
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
