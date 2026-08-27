"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Wrench,
  Smartphone,
  Sofa,
  Home,
  Sparkles,
  Droplet,
  Paintbrush,
  Truck,
  ArrowRight,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { formatLKR, cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

/**
 * CreativeCategories
 * ----------------------------------------------------------------------------
 * The "WOW" factor: each category is a 3D interactive glass card.
 *  - Distinct pastel gradient wash per category (light-mode safe).
 *  - Cursor-following 3D tilt via Framer Motion (rotateX/rotateY).
 *  - A floating, glowing icon that pops in Z-space and reacts on hover.
 *  - Whole card elevates (y:-8, scale) on hover; tapping opens booking.
 */
const CARD_META: Record<
  string,
  { icon: LucideIcon; pastel: string; accent: string; solid: string }
> = {
  Garage: { icon: Wrench, pastel: "from-emerald-100/70 to-teal-50/40", accent: "text-emerald-600", solid: "bg-emerald-500" },
  Electronics: { icon: Smartphone, pastel: "from-cyan-100/70 to-sky-50/40", accent: "text-cyan-600", solid: "bg-cyan-500" },
  Furniture: { icon: Sofa, pastel: "from-purple-100/70 to-fuchsia-50/40", accent: "text-purple-600", solid: "bg-purple-500" },
  "Smart Home": { icon: Home, pastel: "from-amber-100/70 to-orange-50/40", accent: "text-amber-600", solid: "bg-amber-500" },
  Cleaning: { icon: Sparkles, pastel: "from-rose-100/70 to-pink-50/40", accent: "text-rose-600", solid: "bg-rose-500" },
  Plumbing: { icon: Droplet, pastel: "from-blue-100/70 to-indigo-50/40", accent: "text-blue-600", solid: "bg-blue-500" },
  Painting: { icon: Paintbrush, pastel: "from-lime-100/70 to-green-50/40", accent: "text-lime-600", solid: "bg-lime-500" },
  Moving: { icon: Truck, pastel: "from-indigo-100/70 to-violet-50/40", accent: "text-indigo-600", solid: "bg-indigo-500" },
};

export function CreativeCategories() {
  const [services, setServices] = React.useState<Service[] | null>(null);
  const openBooking = useAppStore((s) => s.openBooking);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

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

  // Category → representative service map.
  const byCategory = React.useMemo(() => {
    const map: Record<string, Service> = {};
    services?.forEach((s) => {
      if (!map[s.category]) map[s.category] = s;
    });
    return map;
  }, [services]);

  const cats = CATEGORIES.filter((c) => c !== "All");

  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 backdrop-blur-xl">
          <Zap className="h-3 w-3 text-primary" /> Explore
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Choose a <span className="text-gradient">category</span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Tap any tile to instantly book a vetted Tasker near you.
        </p>
      </div>

      {!services ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl border border-white/40 bg-white/30 backdrop-blur-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cats.map((cat, i) => {
            const meta = CARD_META[cat];
            if (!meta) return null;
            const Icon = meta.icon;
            const svc = byCategory[cat];
            return (
              <CategoryCard
                key={cat}
                index={i}
                cat={cat}
                meta={meta}
                icon={Icon}
                service={svc}
                onOpen={() => {
                  if (svc) openBooking(svc);
                  else {
                    setSelectedCategory(cat);
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ----------------------------- 3D tilt card ----------------------------- */
function CategoryCard({
  index,
  cat,
  meta,
  icon: Icon,
  service,
  onOpen,
}: {
  index: number;
  cat: string;
  meta: { icon: LucideIcon; pastel: string; accent: string; solid: string };
  icon: LucideIcon;
  service?: Service;
  onOpen: () => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 15,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="[perspective:1000px]"
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={reset}
        whileHover={{ y: -8, scale: 1.02 }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onClick={onOpen}
        className="group relative h-full cursor-pointer overflow-hidden rounded-3xl border border-white/40 bg-white/30 p-6 shadow-glass-lg backdrop-blur-xl"
      >
        {/* Distinct pastel gradient wash */}
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", meta.pastel)} />
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />

        <div className="relative" style={{ transform: "translateZ(40px)" }}>
          {/* Floating 3D icon */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className={cn(
              "grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
              meta.solid
            )}
          >
            <Icon className="h-7 w-7" />
          </motion.div>

          <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
            {service?.name ?? cat}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {service?.description ?? `Book a ${cat.toLowerCase()} Tasker near you`}
          </p>

          {service && (
            <p className="mt-3 text-xs text-slate-400">
              From {formatLKR(service.hourlyRate)}/hr
            </p>
          )}

          <span
            className={cn(
              "mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100",
              meta.accent
            )}
          >
            Book now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
